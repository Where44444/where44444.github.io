class NewEditCompanyActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_company);
        a.setLoading(false);
        var id = a.getIntent().getStringExtra("id");
        a.newCompany = (id == null);
        var companyName = a.findViewById("Name");
        var viewEmail = a.findViewById("ViewEmail");
        var editEmail = a.findViewById("EditEmail");
        var passwordLL = a.findViewById("PasswordLL");
        var trialCheckBox = a.findViewById("trialPeriodCheckbox");
        var blacklistedCheckBox = a.findViewById("blackListedCheckbox");
        var tasksCheckbox = a.findViewById("tasksCheckbox");
        if (a.newCompany) {
            a.getSupportActionBar().setTitle("New Company");
            viewEmail.setVisibility(View.GONE);
            editEmail.setVisibility(View.VISIBLE);
            passwordLL.setVisibility(View.VISIBLE);
            var now = new W4DateTime();
            var weekLater = new W4DateTime(now.getMillis() + TimeUnit.DAYS.toMillis(7));
            a.companyData = new CompanyData("", "", "", false, weekLater.getMillis(), false, true);
        }
        else {
            a.getSupportActionBar().setTitle("Edit Company");
            viewEmail.setVisibility(View.VISIBLE);
            editEmail.setVisibility(View.GONE);
            passwordLL.setVisibility(View.GONE);
            a.companyData = Asset.getAssetbyId(MainActivity.w4_DB_Data.getCompanies(), id);
        }
        companyName.setText(a.companyData.getName());
        viewEmail.setText(a.companyData.getEmail());
        trialCheckBox.setChecked(a.companyData.isTrialPeriod());
        blacklistedCheckBox.setChecked(a.companyData.isBlacklisted());
        tasksCheckbox.setChecked(a.companyData.isTasksEnabled());
        a.setTrialPeriod();
        var button2 = a.findViewById("Edit_Show_Password");
        button2.addEventListener("click", function () {
            if (a.findViewById("password").getInputType() == (InputType.TYPE_TEXT_VARIATION_PASSWORD)) {
                a.findViewById("password").setInputType(InputType.TYPE_CLASS_TEXT);
            } else {
                a.findViewById("password").setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
        });
        var button2 = a.findViewById("Edit_Show_Password2");
        button2.addEventListener("click", function () {
            if (a.findViewById("password2").getInputType() == (InputType.TYPE_TEXT_VARIATION_PASSWORD)) {
                a.findViewById("password2").setInputType(InputType.TYPE_CLASS_TEXT);
            } else {
                a.findViewById("password2").setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
        });
        var trialButton = a.findViewById("trialPeriodDateButton");
        trialButton.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            var dt = new W4DateTime(a.companyData.getTrialEnd());
            intent.putExtra("dYear", dt.getYear());
            intent.putExtra("dMonth", dt.getMonthOfYear());
            intent.putExtra("dDay", dt.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeCalendar);
        });

        a.findViewById("Cancel").addEventListener("click", function () {
            a.finish();
        });

        a.findViewById("Accept").addEventListener("click", function () {
            if (a.newCompany) {
                a.companyData.setName(companyName.getText());
                a.companyData.setTrialPeriod(trialCheckBox.isChecked());
                a.companyData.setBlacklisted(blacklistedCheckBox.isChecked());
                a.companyData.setTasksEnabled(tasksCheckbox.isChecked());
                var email = a.findViewById("EditEmail").getText();
                email = email.replace(" ", "").toLowerCase();
                var password = a.findViewById("password").getText();
                if (W4_Funcs.isValidEmail(email)) {
                    if (a.findViewById("password").getText().length >= 6) {
                        if (a.findViewById("password").getText() == a.findViewById("password2").getText()) {
                            a.setLoading(true);
                            var person = new Person("", "", "", "", email, password, Asset.OWNER, [], [], false, false);
                            a.companyData.setEmail(email);
                            a.createNewFireBaseUser(person, password);
                        } else {
                            MainActivity.w4Toast(a, "Passwords must match!", Toast.LENGTH_LONG);
                        }
                    } else {
                        MainActivity.w4Toast(a, "Password must be at least 6 characters long", Toast.LENGTH_LONG);
                    }
                } else {
                    MainActivity.w4Toast(a, "E-mail address is invalid", Toast.LENGTH_LONG);
                }
            }
            else {
                a.companyData.setName(companyName.getText());
                a.companyData.setTrialPeriod(trialCheckBox.isChecked());
                a.companyData.setBlacklisted(blacklistedCheckBox.isChecked());
                a.companyData.setTasksEnabled(tasksCheckbox.isChecked());
                var reffCompany = firebase.database().ref().child(MainActivity.DB_PATH_DATA).child(MainActivity.DB_PATH_ADMIN_DATA_COMPANIES).child(a.companyData.getW4id());
                W4_Funcs.writeToDB(reffCompany, a.companyData, "Edited Company " + a.companyData.getName());
                a.finish();
                MainActivity.w4Toast(this, "Successfully edited Company", Toast.LENGTH_LONG);
            }
        });

        trialCheckBox.addEventListener("click", function () {
            a.setTrialPeriod();
        });
    }

    setTrialPeriod() {
        var checkBox = this.findViewById("trialPeriodCheckbox");
        var trialButton = this.findViewById("trialPeriodDateButton");
        if (checkBox.isChecked()) {
            var dt = new W4DateTime(this.companyData.getTrialEnd());
            dt = W4_Funcs.getDSTSafeDateTime(dt.getYear(), dt.getMonthOfYear(), dt.getDayOfMonth(), 23, 59, 0); //Set time to 11:59p that day
            this.companyData.setTrialEnd(dt.getMillis());
            trialButton.setText("Ends " + dt.getMonthOfYear() + "/" + dt.getDayOfMonth() + "/" + dt.getYear() + " at midnight");
            trialButton.setVisibility(View.VISIBLE);
        }
        else {
            trialButton.setVisibility(View.GONE);
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var dt = W4_Funcs.getDSTSafeDateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.companyData.setTrialEnd(dt.getMillis());
                this.setTrialPeriod();
            }
        }
    }

    createNewFireBaseUser(person2, password) {
        var a = this;
        var reffPerson = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).push();
        person2.setW4id(reffPerson.key);
        if (a.newCompany) {
            a.companyData.setW4id(reffPerson.key);
        }
        var reffEmail = firebase.database().ref().child(MainActivity.DB_PATH_EMAILS).child(person2.getW4id()).child(person2.getW4id());
        W4_Funcs.writeToDB(reffEmail, person2.getEmail(), "");
        var reffAdminData = firebase.database().ref().child(MainActivity.DB_PATH_DATA).child(MainActivity.DB_PATH_ADMIN_DATA_COMPANIES).child(a.companyData.getW4id());
        W4_Funcs.writeToDB(reffAdminData, a.companyData, "Added new company data to admin data " + a.companyData.getName());
        var subject = "Your Owner Account For Clean Assistant Has Been Created";
        var message =
            "Download the app for your device:<br>" +
            "Android<br>" +
            "https://play.google.com/store/apps/details?id=com.where44444.cleanbook<br><br>" +
            "iOS<br>" +
            "https://apps.apple.com/us/app/cleanassistant/id1558722026<br><br>" +
            "E-mail: <b>" + person2.getEmail() + "</b><br>" +
            "Password: <b>" + password + "</b><br><br>" +
            "Please change your password as soon as possible in the app! Go to People->(Your Name)->Password and type your new password in<br>" +
            "both fields then press accept.";
        MainActivity.emailOBJ = new EmailOBJ(subject, message, person2.getEmail());
        //This next block sometimes doesn't run the addOnCompleteListener, or it fails to add the person to cleanassistant database when it does run
        var person = person2;
        firebase.auth().createUserWithEmailAndPassword(person.getEmail(), password) //Creating a new person also signs into that account, make sure to sign back into original account
            .then((userCredential) => {
                // Sign in success, update UI with the signed-in user's information
                console.log("createUserWithEmail:success " + firebase.auth().getUid());
                HomeActivity.logOut();
                MainActivity.overrideAutoLogin = true;
                var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                a.startActivity(intent);
                MainActivity.w4Toast(this, "Successfully added new Company", Toast.LENGTH_LONG);
            }).catch((error) => {
                // If sign in fails, display a message to the user.
                a.setLoading(false);
                MainActivity.w4Toast(this, error.message, Toast.LENGTH_LONG);
                console.log("createUserWithEmail:failure, current mauth " + firebase.auth().currentUser.uid + "|" + error.code + "|" + error.message);
                W4_Funcs.deleteFromDB(reffEmail, "Deleted email from failure to re-sign-in on new company creation");
                W4_Funcs.deleteFromDB(reffAdminData, "Deleted company admin data from failure to re-sign-in on new company creation");
                MainActivity.emailOBJ = null;
            });
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.findViewById("Cancel").setVisibility(View.GONE);
            this.findViewById("Accept").setVisibility(View.GONE);
            this.findViewById("Progress").setVisibility(View.VISIBLE);
        } else {
            this.findViewById("Cancel").setVisibility(View.VISIBLE);
            this.findViewById("Accept").setVisibility(View.VISIBLE);
            this.findViewById("Progress").setVisibility(View.GONE);
        }
    }
}
