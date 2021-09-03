class NewEditPersonActivity extends W4Activity {

    // Person a.selectedPerson;
    // var a.read_switches = [];
    // var a.write_switches = [];
    // var a.radio_groups = [];
    // var a.radios_all = [];
    // var a.radios_assigned = [];

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_person);

        a.read_switches = [];
        a.write_switches = [];
        a.radio_groups = [];
        a.radios_all = [];
        a.radios_assigned = [];

        a.read_switches.push(a.findViewById("Edit_Person_Read_Locations"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_Messages"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_People"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_Shifts"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_TimePunches"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_Inspections"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_Supplies"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_SDS"));
        a.read_switches.push(a.findViewById("Edit_Person_Read_Tasks"));

        a.write_switches.push(a.findViewById("Edit_Person_Write_Locations"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_Messages"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_People"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_Shifts"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_TimePunches"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_Inspections"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_Supplies"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_SDS"));
        a.write_switches.push(a.findViewById("Edit_Person_Write_Tasks"));

        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_Locations"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_Messages"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_People"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_Shifts"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_TimePunches"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_Inspections"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_Supplies"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_SDS"));
        a.radio_groups.push(a.findViewById("Edit_Person_Radio_Group_Tasks"));

        a.radios_all.push(a.findViewById("Edit_Person_All_Locations"));
        a.radios_all.push(a.findViewById("Edit_Person_All_Messages"));
        a.radios_all.push(a.findViewById("Edit_Person_All_People"));
        a.radios_all.push(a.findViewById("Edit_Person_All_Shifts"));
        a.radios_all.push(a.findViewById("Edit_Person_All_TimePunches"));
        a.radios_all.push(a.findViewById("Edit_Person_All_Inspections"));
        a.radios_all.push(a.findViewById("Edit_Person_All_Supplies"));
        a.radios_all.push(a.findViewById("Edit_Person_All_SDS"));
        a.radios_all.push(a.findViewById("Edit_Person_All_Tasks"));

        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_Locations"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_Messages"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_People"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_Shifts"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_TimePunches"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_Inspections"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_Supplies"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_SDS"));
        a.radios_assigned.push(a.findViewById("Edit_Person_Assigned_Tasks"));

        a.eles = [];
        for (var i = 0; i < a.read_switches.length; ++i) {
            var obj = new Object();
            obj.readBox = a.read_switches[i];
            obj.writeBox = a.write_switches[i];
            obj.radioGroup = a.radio_groups[i];
            a.eles.push(obj);

            a.read_switches[i].ele.i = i;
            a.write_switches[i].ele.i = i;
            a.radio_groups[i].ele.i = i;
            a.radios_all[i].ele.i = i;
            a.radios_assigned[i].ele.i = i;
        }

        var id = a.getIntent().getStringExtra("id");
        a.newPerson = (id == null);

        if (a.newPerson) {
            a.getSupportActionBar().setTitle("New Person");
            a.findViewById("New_Person_Email").setVisibility(View.VISIBLE);
            a.findViewById("Delete_Edit_Person").setVisibility(View.GONE);
            a.findViewById("Edit_Person_Password_Title").setText("Password");
            a.findViewById("Edit_Person_Password").ele.placeholder = "Password";
            a.findViewById("Edit_Person_Password2").ele.placeholder = "Password";
        } else {
            a.getSupportActionBar().setTitle("Edit Person");
            a.findViewById("Edit_Person_Email").setVisibility(View.VISIBLE);
            a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), id);
            a.findViewById("Edit_Person_Password_Title").setText("Password (Leave Blank if Unchanged)");
            a.findViewById("Edit_Person_Password").ele.placeholder = "New Password";
            a.findViewById("Edit_Person_Password2").ele.placeholder = "New Password";
        }

        if (!a.newPerson && a.selectedPerson == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var spinner = a.findViewById("Edit_Person_Type_Spinner");
        var spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Asset.person_types_array
        );
        spinner.setAdapter(spinnerArrayAdapter);

        spinner.addEventListener("change", function () {
            var position = spinner.getSelectedItemPosition();
            switch (position) {
                case Person.EMPLOYEE:
                    a.setUIPermissions(Asset.rPermissionsEmployee, Asset.wPermissionsEmployee);
                    break;
                case Person.SUPERVISOR:
                    a.setUIPermissions(Asset.rPermissionsSupervisor, Asset.wPermissionsSupervisor);
                    break;
                case Person.MANAGER:
                    a.setUIPermissions(Asset.rPermissionsManager, Asset.wPermissionsManager);
                    break;
                case Person.CLIENT:
                    a.setUIPermissions(Asset.rPermissionsClient, Asset.wPermissionsClient);
                    break;
                case Person.OWNER:
                    a.setUIPermissions(Asset.rPermissionsOwner, Asset.wPermissionsOwner);
                    break;
            }
            MainActivity.dialogBox(a, "Permissions set!", "This persons permissions have been changed to the preset for " + Asset.person_types_array[position] + ". You can modify them further by pressing the 'Permissions' button");
            for (var i = 0; i < a.read_switches.length; ++i) {
                NewEditPersonActivity.processEditBoxChecking(a.eles, a.read_switches[i].ele);
            }
        });

        if (!a.newPerson) {
            a.findViewById("Edit_Person_Type_Spinner").setSelection(a.selectedPerson.getType());
        }

        if (!a.newPerson) {
            if (a.selectedPerson.getW4id() == (MainActivity.theCompany.getId())) { //If person is the owner
                a.findViewById("Edit_Person_Type_Label").setVisibility(View.GONE);
                a.findViewById("Edit_Person_Type_Spinner").setVisibility(View.GONE);
                a.findViewById("Owner_No_Permissions_Text").setVisibility(View.VISIBLE);
                a.findViewById("Edit_Permissions_Label").setVisibility(View.GONE);
                a.findViewById("Edit_Person_Permissions_Div").setVisibility(View.GONE);
                a.findViewById("Delete_Edit_Person").setVisibility(View.GONE);
            } else if (a.selectedPerson.getW4id() == (MainActivity.currentPerson.getW4id())) { //If person is editing themselves
                a.findViewById("Edit_Person_Type_Label").setVisibility(View.GONE);
                a.findViewById("Edit_Person_Type_Spinner").setVisibility(View.GONE);
                a.findViewById("Edit_Person_RequiresGPS_CheckBox").setVisibility(View.GONE);
                a.findViewById("Self_No_Permissions_Text").setVisibility(View.VISIBLE);
                a.findViewById("Edit_Permissions_Label").setVisibility(View.GONE);
                a.findViewById("Edit_Person_Permissions_Div").setVisibility(View.GONE);
                a.findViewById("Delete_Edit_Person").setVisibility(View.GONE);
            }

            a.findViewById("Edit_Person_FirstName").setText(a.selectedPerson.getFirst_name());
            a.findViewById("Edit_Person_LastName").setText(a.selectedPerson.getLast_name());
            a.findViewById("Edit_Person_Phone").setText(a.selectedPerson.getPhone());
            a.findViewById("Edit_Person_Email").setText(a.selectedPerson.getEmail());
            a.findViewById("Edit_Person_RequiresGPS_CheckBox").setChecked(a.selectedPerson.isRequiringGPSClockIn());

            //Set UI From READ Permissions---------------------------------------------------------------------------------------------------------------------------------------
            for (var i = 0; i < a.read_switches.length; ++i) {
                if (a.selectedPerson.getReadPermissions()[i * 2] || a.selectedPerson.getReadPermissions()[i * 2 + 1]) {
                    a.read_switches[i].setChecked(true);
                    if (a.selectedPerson.getReadPermissions()[i * 2]) {
                        a.radios_all[i].setChecked(true);
                    } else {
                        a.radios_assigned[i].setChecked(true);
                    }
                }
            }

            //Set UI From WRITE Permissions---------------------------------------------------------------------------------------------------------------------------------------
            for (var i = 0; i < a.write_switches.length; ++i) {
                if (a.selectedPerson.getWritePermissions()[i * 2] || a.selectedPerson.getWritePermissions()[i * 2 + 1]) {
                    a.write_switches[i].setChecked(true);
                    if (a.selectedPerson.getWritePermissions()[i * 2]) {
                        a.radios_all[i].setChecked(true);
                    } else {
                        a.radios_assigned[i].setChecked(true);
                    }
                }
            }
        }

        for (var i = 0; i < a.read_switches.length; ++i)
            NewEditPersonActivity.processEditBoxChecking(a.eles, a.read_switches[i].ele);
        var button2 = a.findViewById("Edit_Show_Password");
        button2.addEventListener("click", function () {
            if ((a.findViewById("Edit_Person_Password")).getInputType() == (InputType.TYPE_TEXT_VARIATION_PASSWORD)) {
                (a.findViewById("Edit_Person_Password")).setInputType(InputType.TYPE_CLASS_TEXT);
            } else {
                (a.findViewById("Edit_Person_Password")).setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
        });
        button2 = a.findViewById("Edit_Show_Password2");
        button2.addEventListener("click", function () {
            if ((a.findViewById("Edit_Person_Password2")).getInputType() == (InputType.TYPE_TEXT_VARIATION_PASSWORD)) {
                (a.findViewById("Edit_Person_Password2")).setInputType(InputType.TYPE_CLASS_TEXT);
            } else {
                (a.findViewById("Edit_Person_Password2")).setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
            }
        });
        var button = a.findViewById("Edit_Person_None_Permissions_Button");
        button.addEventListener("click", function () {
            a.setUIPermissions(Asset.permissionsNone, Asset.permissionsNone);
            for (var i = 0; i < a.read_switches.length; ++i)
                NewEditPersonActivity.processEditBoxChecking(a.eles, a.read_switches[i].ele);
        });
        button = a.findViewById("Edit_Person_All_Permissions_Button");
        button.addEventListener("click", function () {
            a.setUIPermissions(Asset.permissionsAll, Asset.permissionsAll);
            for (var i = 0; i < a.read_switches.length; ++i)
                NewEditPersonActivity.processEditBoxChecking(a.eles, a.read_switches[i].ele);
        });
        button = a.findViewById("Cancel_Edit");
        button.addEventListener("click", function () {
            a.finish();
        });
        button = a.findViewById("Accept_Edit");
        button.addEventListener("click", function () {
            var firstName = a.findViewById("Edit_Person_FirstName").getText();
            var lastName = a.findViewById("Edit_Person_LastName").getText();
            var phone = a.findViewById("Edit_Person_Phone").getText();
            var password = a.findViewById("Edit_Person_Password").getText();
            if (!a.newPerson) {
                if (a.findViewById("Edit_Person_Password").getText() == "") {
                    password = a.selectedPerson.getPassword();
                }
                else {
                    if (a.findViewById("Edit_Person_Password").getText() != a.findViewById("Edit_Person_Password2").getText()) {
                        MainActivity.w4Toast(a, "Passwords must match!", Toast.LENGTH_LONG)
                        return
                    }
                }
            }
            else {
                if (a.findViewById("Edit_Person_Password").getText() != a.findViewById("Edit_Person_Password2").getText()) {
                    MainActivity.w4Toast(a, "Passwords must match!", Toast.LENGTH_LONG)
                    return
                }
            }

            var type = a.findViewById("Edit_Person_Type_Spinner").getSelectedItemPosition();
            var requiresGPS = a.findViewById("Edit_Person_RequiresGPS_CheckBox").isChecked();

            var new_email = null;
            if (a.newPerson) {
                new_email = a.findViewById("New_Person_Email").getText().replace(/ /g, "").toLowerCase();
            }

            var readPermissions = [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ];
            var writePermissions = [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ];

            for (var i = 0; i < a.read_switches.length; ++i) {
                if (a.read_switches[i].isChecked())
                    if (a.radios_all[i].isChecked())
                        readPermissions[i * 2] = true;
                    else
                        readPermissions[i * 2 + 1] = true;
            }
            for (var i = 0; i < a.write_switches.length; ++i) {
                if (a.write_switches[i].isChecked())
                    if (a.radios_all[i].isChecked())
                        writePermissions[i * 2] = true;
                    else
                        writePermissions[i * 2 + 1] = true;
            }

            if (a.newPerson) {
                if (W4_Funcs.isValidEmail(new_email)) {
                    if (a.findViewById("Edit_Person_Password").getText().length >= 6) {
                        a.setEditPersonLoading(true)
                        var person = new Person("", firstName, lastName, phone, new_email, password, type, readPermissions, writePermissions, requiresGPS, false);
                        a.createNewFireBaseUser(person, password);
                    }
                    else {
                        MainActivity.w4Toast(this, "Password must be at least 6 characters long", Toast.LENGTH_LONG);
                    }
                }
                else {
                    MainActivity.w4Toast(this, "E-mail address is invalid", Toast.LENGTH_LONG);
                }
            }
            else {
                a.setEditPersonLoading(true);
                var newPerson = new Person(a.selectedPerson.getW4id(), firstName, lastName, phone, a.selectedPerson.getEmail(), password, type, readPermissions, writePermissions, requiresGPS, a.selectedPerson.isClockedIn());
                a.createEditFireBaseUser(a.selectedPerson, newPerson);
            }
        });

        var button = a.findViewById("Delete_Edit_Person");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ConfirmActivity());
            intent.putExtra("description", "Are you sure you want to delete this Person? All associated Shifts will remove this Person. All associated Time Punches and Task Sheet Instances will also be deleted.");
            a.startActivityForResult(intent, MainActivity.requestCodePersonDelete);
        });

        button = a.findViewById("Edit_Person_Permissions_Button");
        button.addEventListener("click", function () {
            if (a.findViewById("Edit_Person_Permissions_Div").getVisibility() == View.VISIBLE)
                a.findViewById("Edit_Person_Permissions_Div").setVisibility(View.GONE);
            else
                a.findViewById("Edit_Person_Permissions_Div").setVisibility(View.VISIBLE);
        });

        (a.findViewById("View_Permissions_Help")).addEventListener("click", function () {
            if (a.findViewById("Edit_Person_Permissions_Text").getVisibility() == View.GONE)
                a.findViewById("Edit_Person_Permissions_Text").setVisibility(View.VISIBLE);
            else
                a.findViewById("Edit_Person_Permissions_Text").setVisibility(View.GONE);
        });
        for (var i = 0; i < a.read_switches.length; ++i) {
            a.read_switches[i].addEventListener("click", function (event) {
                NewEditPersonActivity.processEditBoxChecking(a.eles, event.target);
            });
            a.write_switches[i].addEventListener("click", function (event) {
                NewEditPersonActivity.processEditBoxChecking(a.eles, event.target);
            });
            a.radios_assigned[i].addEventListener("click", function (event) {
                NewEditPersonActivity.processEditBoxChecking(a.eles, event.target);
            });
            a.radios_all[i].addEventListener("click", function (event) {
                NewEditPersonActivity.processEditBoxChecking(a.eles, event.target);
            });
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        console.log("Recieved result|" + requestCode + "|" + resultCode + "|" + data);
        var a = this;
        super.onActivityResult(requestCode, resultCode, data);
        if (!a.newPerson) {
            if (requestCode == MainActivity.requestCodePersonDelete) {
                if (resultCode == AppCompatActivity.RESULT_OK) {
                    //Delete the user
                    a.setEditPersonLoading(true);
                    var reffPerson = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_PEOPLE).child(a.selectedPerson.getW4id());
                    W4_Funcs.deleteFromDB(reffPerson, "Deleted person " + a.selectedPerson.getFirst_name() + " " + a.selectedPerson.getLast_name());
                    var reffEmail = firebase.database().ref().child(MainActivity.DB_PATH_EMAILS).child(MainActivity.theCompany.getId()).child(a.selectedPerson.getW4id());
                    W4_Funcs.deleteFromDB(reffEmail, "");
                    Deletions.deleteTimePunches_withPerson(a.selectedPerson.getW4id());
                    Deletions.deletePersonFromShifts(a.selectedPerson.getW4id());
                    Deletions.deleteTaskSheetOccurences(null, a.selectedPerson.getW4id());
                    firebase.auth().signInWithEmailAndPassword(a.selectedPerson.getEmail(), a.selectedPerson.getPassword())
                        .then((userCredential) => {
                            console.log("signInWithEmail:success " + firebase.auth().getUid());
                            firebase.auth().currentUser.delete().then(() => {
                                console.log("User account deleted.");
                                firebase.auth().setPersistence(MainActivity.persistenceVar).then(function () {
                                    return firebase.auth().signInWithEmailAndPassword(MainActivity.current_email, MainActivity.current_password) //Log back into main account
                                        .then((userCredential) => {
                                            console.log("signInWithEmail:success " + firebase.auth().getUid());
                                            MainActivity.w4Toast(this, "Successfully deleted Person", Toast.LENGTH_LONG);
                                            HomeActivity.logOut();
                                            MainActivity.overrideAutoLogin = true;
                                            var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
                                            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                                            a.startActivity(intent);
                                        }).catch((error) => {
                                            console.log("signInWithEmail:failure|" + error.code + "|" + error.message);
                                            MainActivity.w4Toast(this, "Could not authenticate your credentials", Toast.LENGTH_LONG);
                                            System.exit(2);
                                        });
                                });
                            }).catch((error) => {
                                console.log("signInWithEmail:failure|" + error.code + "|" + error.message);
                                System.exit(3);
                            });
                        }).catch((error) => {
                            console.log("signInWithEmail:failure|" + error.code + "|" + error.message);
                            MainActivity.w4Toast(this, "Could not authenticate your credentials", Toast.LENGTH_LONG);
                            System.exit(4);
                        });
                }
            }
        }
    }

    createEditFireBaseUser(prevPerson, newPerson) {
        var a = this;
        var newPerson2 = newPerson;
        console.log("New password: |" + newPerson.getPassword() + "| Old: |" + prevPerson.getPassword() + "|" + newPerson.getPassword() == (prevPerson.getPassword()));
        if ((a.findViewById("Edit_Person_Password")).getText().length >= 6 || (a.findViewById("Edit_Person_Password")).getText().length == 0) {
            if (newPerson.getPassword() != (prevPerson.getPassword())) {
                console.log("Password needs changing");
                var reffPerson = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_PEOPLE).child(newPerson2.getW4id());
                W4_Funcs.writeToDB(reffPerson, newPerson2, "Edited Person (new password) " + newPerson2.getFirst_name() + " " + newPerson2.getLast_name());
                firebase.auth().signInWithEmailAndPassword(a.selectedPerson.getEmail(), a.selectedPerson.getPassword())
                    .then((userCredential) => {
                        console.log("signInWithEmail:success " + firebase.auth().getUid());
                        firebase.auth().currentUser.updatePassword(newPerson2.getPassword())
                            .then(() => {
                                console.log("User account changed password.");
                                if (newPerson2.getW4id() == (MainActivity.currentPersonID))
                                    MainActivity.current_password = newPerson2.getPassword();
                                firebase.auth().setPersistence(MainActivity.persistenceVar).then(function () {
                                    return firebase.auth().signInWithEmailAndPassword(MainActivity.current_email, MainActivity.current_password) //Log back into main account
                                        .then((userCredential) => {
                                            console.log("signInWithEmail:success " + firebase.auth().getUid());
                                            MainActivity.w4Toast(this, "Successfully edited Person", Toast.LENGTH_LONG);
                                            a.finish();
                                        }).catch((error) => {
                                            console.log("signInWithEmail:failure|" + error.code + "|" + error.message);
                                            MainActivity.w4Toast(this, "Could not authenticate your credentials", Toast.LENGTH_LONG);
                                            System.exit(5);
                                        });
                                });
                            }).catch((error) => {
                                console.log("updatePassword:failure|" + error.code + "|" + error.message);
                                System.exit(6);
                            });
                    }).catch((error) => {
                        console.log("signInWithEmail:failure|" + error.code + "|" + error.message);
                        MainActivity.w4Toast(this, "Could not authenticate your credentials", Toast.LENGTH_LONG);
                        System.exit(7);
                    });
            } else { //No new password
                var reffPerson = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_PEOPLE).child(newPerson.getW4id());
                W4_Funcs.writeToDB(reffPerson, newPerson, "Edited Person (no new password) " + newPerson.getFirst_name() + " " + newPerson.getLast_name());
                MainActivity.w4Toast(this, "Successfully edited Person", Toast.LENGTH_LONG);
                a.finish();
            }
        } else { //Password too short
            MainActivity.w4Toast(this, "Password must be at least 6 characters long", Toast.LENGTH_LONG);
            a.setEditPersonLoading(false);
        }
    }

    setEditPersonLoading(isLoading) {
        var a = this;
        if (isLoading) {
            (a.findViewById("Edit_Person_FirstName")).setInputType(InputType.TYPE_NULL);
            (a.findViewById("Edit_Person_LastName")).setInputType(InputType.TYPE_NULL);
            (a.findViewById("Edit_Person_Phone")).setInputType(InputType.TYPE_NULL);
            a.findViewById("Edit_Person_Type_Spinner").setClickable(false);
            a.findViewById("Cancel_Edit").setVisibility(View.GONE);
            a.findViewById("Accept_Edit").setVisibility(View.GONE);
            a.findViewById("Delete_Edit_Person").setVisibility(View.GONE);
            a.findViewById("Edit_Person_Progress").setVisibility(View.VISIBLE);
        } else {
            (a.findViewById("Edit_Person_FirstName")).setInputType(InputType.TYPE_CLASS_TEXT);
            (a.findViewById("Edit_Person_LastName")).setInputType(InputType.TYPE_CLASS_TEXT);
            (a.findViewById("Edit_Person_Phone")).setInputType(InputType.TYPE_CLASS_PHONE);
            a.findViewById("Edit_Person_Type_Spinner").setClickable(true);
            a.findViewById("Cancel_Edit").setVisibility(View.VISIBLE);
            a.findViewById("Accept_Edit").setVisibility(View.VISIBLE);
            a.findViewById("Delete_Edit_Person").setVisibility(View.VISIBLE);
            a.findViewById("Edit_Person_Progress").setVisibility(View.GONE);
        }
    }

    static processEditBoxChecking(eles, ele) {
        var i = ele.i;
        var readBox = eles[i].readBox;
        var writeBox = eles[i].writeBox;
        var radioGroup = eles[i].radioGroup;
        if (readBox.isChecked() || writeBox.isChecked()) {
            radioGroup.setVisibility(View.VISIBLE);
        } else if (!readBox.isChecked() && !writeBox.isChecked()) {
            radioGroup.setVisibility(View.GONE);
        }

        if (writeBox.isChecked() && !readBox.isChecked()) {
            readBox.setChecked(true);
            MainActivity.w4Toast(null, "Every writeable asset must be readable", Toast.LENGTH_LONG);
        }
    }

    setUIPermissions(readPermissions, writePermissions) {
        var a = this;
        for (var i = 0; i < a.read_switches.length; ++i) {
            a.read_switches[i].setChecked(readPermissions[i * 2] || readPermissions[i * 2 + 1]);
            a.write_switches[i].setChecked(writePermissions[i * 2] || writePermissions[i * 2 + 1]);
            if (readPermissions[i * 2 + 1] || writePermissions[i * 2 + 1])
                a.radios_assigned[i].setChecked(true);
            if (readPermissions[i * 2] || writePermissions[i * 2])
                a.radios_all[i].setChecked(true);
        }
    }

    createNewFireBaseUser(person, password) {
        var reffPerson = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_PEOPLE).push();
        person.setW4id(reffPerson.key);
        W4_Funcs.writeToDB(reffPerson, person, "New Person " + person.getFirst_name() + " " + person.getLast_name());
        var reffEmail = firebase.database().ref().child(MainActivity.DB_PATH_EMAILS).child(MainActivity.theCompany.getId()).child(person.getW4id());
        W4_Funcs.writeToDB(reffEmail, person.getEmail(), "");
        var subject = "Your Account For Clean Assistant Has Been Created";
        var message =
            "Download the app for your device:<br>" +
            "Android<br>" +
            "https://play.google.com/store/apps/details?id=com.where44444.cleanbook<br><br>" +
            "iOS<br>" +
            "https://apps.apple.com/us/app/cleanassistant/id1558722026<br><br>" +
            "E-mail: <b>" + person.getEmail() + "</b><br>" +
            "Password: <b>" + password + "</b><br><br>" +
            "Please change your password as soon as possible in the app! Go to People->(Your Name)->Password and type your new password in<br>" +
            "both fields then press accept.";

        MainActivity.emailOBJ = new EmailOBJ(subject, message, person.getEmail());
        this.completeCreateNewFireBaseUser(person, password);
    }

    completeCreateNewFireBaseUser(person2, password) {
        var a = this;
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
                MainActivity.w4Toast(this, "Successfully added new Person", Toast.LENGTH_LONG);
            }).catch((error) => {
                // If sign in fails, display a message to the user.
                a.setEditPersonLoading(false);
                MainActivity.w4Toast(this, error.message, Toast.LENGTH_LONG);
                console.log("createUserWithEmail:failure, current mauth " + firebase.auth().currentUser.uid + "|" + error.code + "|" + error.message);
                var reffPerson = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_PEOPLE).child(person.getW4id());
                W4_Funcs.deleteFromDB(reffPerson, "Deleted person from failed re-sign in " + person.getFirst_name() + " " + person.getLast_name());
                var reffEmail = firebase.database().ref().child(MainActivity.DB_PATH_EMAILS).child(MainActivity.theCompany.getId()).child(person.getW4id());
                W4_Funcs.deleteFromDB(reffEmail, "");
                MainActivity.emailOBJ = null;
            });
    }
}
