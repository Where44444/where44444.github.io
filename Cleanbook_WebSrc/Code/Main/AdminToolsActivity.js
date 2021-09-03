class AdminToolsActivity extends W4Activity {
    static adminToolsActivity = null;

    onDestroy() {
        super.onDestroy();
        AdminToolsActivity.adminToolsActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Admin Tools");
        a.setContentView(R.layout.activity_admin_tools);
        AdminToolsActivity.adminToolsActivity = this;

        a.findViewById("Add_Company").addEventListener("click", function () {
            var intent = new Intent(this, new NewEditCompanyActivity());
            a.startActivity(intent);
        });

        a.findViewById("Add_Admin").addEventListener("click", function () {
            var intent = new Intent(this, new TextActivity());
            intent.putExtra("hint", "Email Address");
            a.startActivityForResult(intent, MainActivity.requestCodeText);
        });

        a.updateList();
    }


    updateList() {
        var a = this;
        super.updateList();
        var llCompanies = a.findViewById("CompaniesLL");
        var llAdmins = a.findViewById("AdminsLL");
        llCompanies.setText("");
        llAdmins.setText("");

        for (let companyData of MainActivity.w4_DB_Data.getCompanies()) {
            var inflater = LayoutInflater.from(this);
            var view = inflater.inflate(R.layout.generic_list_item, null, true);
            var button = view.findViewById("Generic_Button");

            button.setText(companyData.getName());
            button.addEventListener("click", function () {
                var intent = new Intent(this, new NewEditCompanyActivity());
                intent.putExtra("id", companyData.getW4id());
                a.startActivity(intent);
            });
            llCompanies.addView(view);
        }
        var i = 0;
        for (let admin of MainActivity.w4_DB_Data.getAdmins()) {
            var inflater = LayoutInflater.from(this);
            var view = inflater.inflate(R.layout.admin_tools_admin_view, null, true);
            var button = view.findViewById("xbutton");
            var textView = view.findViewById("text1");
            textView.setText(admin);
            if (i == 0 || admin == (firebase.auth().currentUser.email)) {
                button.setVisibility(View.GONE); //Don't allow main admin (index 0) to be removed or admin to remove themselves
            }
            else {
                button.addEventListener("click", function () {
                    var index = MainActivity.w4_DB_Data.getAdmins().indexOf(admin);
                    if (index >= 0) {
                        MainActivity.w4_DB_Data.getAdmins().splice(index, 1);
                        var reffAdmins = firebase.database().ref().child(MainActivity.DB_PATH_DATA).child(MainActivity.DB_PATH_ADMIN_DATA_ADMINS);
                        W4_Funcs.writeToDB(reffAdmins, MainActivity.w4_DB_Data.getAdmins(), "Removed Admin " + admin);
                    }
                });
            }
            llAdmins.addView(view);
            ++i;
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeText) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var email = data.getStringExtra("text").toLowerCase();
                if (W4_Funcs.isValidEmail(email)) {
                    MainActivity.w4_DB_Data.getAdmins().push(email);
                    var reffAdmins = firebase.database().ref().child(MainActivity.DB_PATH_DATA).child(MainActivity.DB_PATH_ADMIN_DATA_ADMINS);
                    W4_Funcs.writeToDB(reffAdmins, MainActivity.w4_DB_Data.getAdmins(), "Added Admin " + email);
                }
                else {
                    MainActivity.dialogBox(this, "Invalid Email", "Enter an email in the xxx@yyy.zzz format");
                }
            }
        }
    }
}
