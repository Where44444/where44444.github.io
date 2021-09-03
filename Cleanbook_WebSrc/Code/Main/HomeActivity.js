class HomeActivity extends W4Activity {

    static homeActivity = null;

    getName() {
        return "HomeActivity";
    }

    onDestroy() {
        super.onDestroy();
        HomeActivity.logOut();
        HomeActivity.homeActivity = null;
    }

    onCreateOptionsMenu(menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        var actionView = this.findViewById("action_notification", true);
        actionView.addEventListener("click", function () {
            if (MainActivity.loggedIn && MainActivity.allDatabaseDownloaded) {
                if (MainActivity.w4Notifications.length > 0) {
                    var intent = new Intent(HomeActivity.homeActivity, new ViewNotificationsListActivity());
                    HomeActivity.homeActivity.startActivity(intent);
                }
                else {
                    MainActivity.dialogBox(HomeActivity.homeActivity, "", "You Have No Notifications");
                }
            }
        });

        var actionView = this.findViewById("action_inbox", true);
        actionView.addEventListener("click", function () {
            if (MainActivity.loggedIn && MainActivity.allDatabaseDownloaded) {
                HomeActivity.messagesButtonClicked();
            }
        });

        this.notificationsRedCircle = this.findViewById("NotificationsRedCircle_ActionBar", true);
        this.notificationsRedCircleText = this.findViewById("NotificationsRedCircleText", true);
        this.inboxRedCircle = this.findViewById("InboxRedCircle", true);
        this.inboxRedCircleText = this.findViewById("InboxRedCircleText", true);
        this.populateNotificationsList();
        if (ViewNotificationsListActivity.viewNotificationsListActivity != null) {
            ViewNotificationsListActivity.viewNotificationsListActivity.updateList();
        }

        this.findViewById("activity_back_arrow", true).ele.onclick = function () {
            AppCompatActivity.activities[AppCompatActivity.activities.length - 1].onOptionsItemSelected(new OptionsItem("home"));
        };

        var activity = this;
        this.findViewById("sidebar_button_home", true).ele.onclick = function () {
            var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_HOME);
            activity.startActivity(intent);
        };

        this.findViewById("sidebar_button_userprofile", true).ele.onclick = function () {
            var intent = new Intent(activity, new NewEditPersonActivity());
            intent.putExtra("id", MainActivity.currentPerson.getW4id());
            activity.startActivity(intent);
        }

        this.findViewById("sidebar_logout_button", true).ele.onclick = function () {
            HomeActivity.logOut();
            var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            activity.startActivity(intent);
        };

        return true;
    }

    onResume() {
        super.onResume();
        this.hideBackButton();
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        // a.getSupportActionBar().setTitle("Home");
        a.setContentView(R.layout.activity_home);
        HomeActivity.homeActivity = this;

        a.findViewById("version_home").setText("v. " + MainActivity.version);

        a.setButtonsInvisible();

        FireBaseListeners.fireBaseSingleListener_getUser();

        if (MainActivity.emailOBJ != null) {
            W4_Funcs.startEmail(MainActivity.emailOBJ.message, MainActivity.emailOBJ.subject, this, MainActivity.emailOBJ.reciever);
            MainActivity.emailOBJ = null;
        }
        var button1 = a.findViewById("EmployeeStatusButton");
        button1.addEventListener("click", function () {
            if (MainActivity.loggedIn && MainActivity.allDatabaseDownloaded) {
                if (MainActivity.currentPerson.canSeeEmployeeStatuses()) {
                    var intent = new Intent(HomeActivity.homeActivity, new EmployeeStatusListActivity());
                    HomeActivity.homeActivity.startActivity(intent);
                }
            }
        });
        button1 = a.findViewById("LogOutButton");
        button1.addEventListener("click", function () {
            HomeActivity.logOut();
            var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            a.startActivity(intent);
        });

        var imageButton = a.findViewById("PeopleButton");
        imageButton.addEventListener("click", function () {
            var intent = new Intent(HomeActivity.homeActivity, new ViewPeopleListActivity());
            HomeActivity.homeActivity.startActivity(intent);
        });
        imageButton = a.findViewById("TimePunchesButton");
        imageButton.addEventListener("click", function () {
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_TIMEPUNCHES)) {
                if (MainActivity.theCompany.getPersonList().length > 0 && MainActivity.theCompany.getLocationList().length > 0 && MainActivity.theCompany.getShiftList().length > 0) {
                    var intent = new Intent(HomeActivity.homeActivity, new ViewTimePunchListByTypeActivity());
                    HomeActivity.homeActivity.startActivity(intent);
                } else {
                    if (MainActivity.theCompany.getPersonList().length == 0)
                        MainActivity.w4Toast(HomeActivity.homeActivity, "Add more People first", Toast.LENGTH_LONG);
                    else if (MainActivity.theCompany.getLocationList().length == 0) {
                        MainActivity.w4Toast(HomeActivity.homeActivity, "Add more Locations first", Toast.LENGTH_LONG);
                    } else if (MainActivity.theCompany.getShiftList().length == 0) {
                        MainActivity.w4Toast(HomeActivity.homeActivity, "Add more Shifts first", Toast.LENGTH_LONG);
                    }
                }
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
        });
        imageButton = a.findViewById("LocationsButton");
        imageButton.addEventListener("click", function () {
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_LOCATIONS)) {
                var intent = new Intent(HomeActivity.homeActivity, new ViewLocationsListActivity());
                HomeActivity.homeActivity.startActivity(intent);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
        });
        imageButton = a.findViewById("ShiftsButton");
        imageButton.addEventListener("click", function () {
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_SHIFTS)) {
                if (W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SHIFTS).length > 0) {
                    var intent = new Intent(HomeActivity.homeActivity, new ViewShiftListActivity());
                    HomeActivity.homeActivity.startActivity(intent);
                } else
                    MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noLocationsText, Toast.LENGTH_LONG);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
        });
        imageButton = a.findViewById("SupplyItemsButton");
        imageButton.addEventListener("click", function () {
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_SUPPLIES)) {
                if (W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SUPPLIES).length > 0) {
                    var intent = new Intent(HomeActivity.homeActivity, new ViewSupplyItemLocationsListActivity());
                    HomeActivity.homeActivity.startActivity(intent);
                } else
                    MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noLocationsText, Toast.LENGTH_LONG);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
        });
        imageButton = a.findViewById("SDSButton");
        imageButton.addEventListener("click", function () {
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_SDS)) {
                var intent = new Intent(HomeActivity.homeActivity, new ViewSDSLocationsListActivity());
                HomeActivity.homeActivity.startActivity(intent);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
        });
        imageButton = a.findViewById("InspectionPlansButton");
        imageButton.addEventListener("click", function () {
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_INSPECTIONS)) {
                if (W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_INSPECTIONS).length > 0) {
                    if (W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_INSPECTIONS).length > 0) {
                        var intent = new Intent(HomeActivity.homeActivity, new ViewInspectionPlansListActivity());
                        HomeActivity.homeActivity.startActivity(intent);
                    } else
                        MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noShiftsText, Toast.LENGTH_LONG);
                } else
                    MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noLocationsText, Toast.LENGTH_LONG);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
        });
        imageButton = a.findViewById("TasksButton");
        imageButton.addEventListener("click", function () {
            if (MainActivity.companyData.isTasksEnabled()) {
                if (W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_TASKS).length > 0) {
                    var intent = new Intent(HomeActivity.homeActivity, new ViewTaskListByTypeActivity());
                    HomeActivity.homeActivity.startActivity(intent);
                } else
                    MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noShiftsText, Toast.LENGTH_LONG);
            }
            else {
                MainActivity.w4Toast(HomeActivity.homeActivity, "Tasks for your company have been disabled", Toast.LENGTH_LONG);
            }
        });
        imageButton = a.findViewById("MessagesButton");
        imageButton.addEventListener("click", function () {
            HomeActivity.messagesButtonClicked();
        });
        imageButton = a.findViewById("ReportsButton");
        imageButton.addEventListener("click", function () {
            if (MainActivity.currentPerson.canExportReports()) {
                var intent = new Intent(HomeActivity.homeActivity, new ReportTypesActivity());
                HomeActivity.homeActivity.startActivity(intent);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        });
        button1 = a.findViewById("PrivacyPolicyButton");
        button1.addEventListener("click", function () {
            var intent = new Intent(HomeActivity.homeActivity, new PrivacyPolicyActivity());
            a.startActivity(intent);
        });
    }

    static messagesButtonClicked() {
        if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_MESSAGES)) {
            if (W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_MESSAGES).length > 0) {
                var intent = new Intent(HomeActivity.homeActivity, new ViewMessageLocationsActivity());
                HomeActivity.homeActivity.startActivity(intent);
            } else
                MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.noLocationsText, Toast.LENGTH_LONG);
        } else
            MainActivity.w4Toast(HomeActivity.homeActivity, MainActivity.notPermitted, Toast.LENGTH_LONG);
    }

    static logOut() {
        //TODO Repopulate this list
        firebase.auth().signOut();
        MainActivity.allDatabaseDownloaded = false;

        if (FireBaseListeners.reffLocations != null)
            FireBaseListeners.reffLocations.off();
        if (FireBaseListeners.reffMessages != null)
            FireBaseListeners.reffMessages.off();
        if (FireBaseListeners.reffTasks != null)
            FireBaseListeners.reffTasks.off();
        if (FireBaseListeners.reffPeople != null)
            FireBaseListeners.reffPeople.off();
        if (FireBaseListeners.reffShifts != null)
            FireBaseListeners.reffShifts.off();
        if (FireBaseListeners.reffTimePunches != null)
            FireBaseListeners.reffTimePunches.off();
        if (FireBaseListeners.reffInspectionPlans != null)
            FireBaseListeners.reffInspectionPlans.off();
        if (FireBaseListeners.reffInspectionPlansOccurence != null)
            FireBaseListeners.reffInspectionPlansOccurence.off();
        if (FireBaseListeners.reffSupplyItems != null)
            FireBaseListeners.reffSupplyItems.off();
        MainActivity.w4_DB_Data = null;
        MainActivity.companyData = null;
        MainActivity.w4Notifications = [];
        MainActivity.lastTaskSheet = null;
        MainActivity.theCompany = new TheCompany("", "");
        MainActivity.current_email = null;
        MainActivity.current_password = null;
        MainActivity.currentPerson = null;
        MainActivity.currentPersonID = "";
        HomeActivity.setAllFirebaseReffsInProgress(false);
        HomeActivity.setAllFirebaseReffsFirstLoad(false);
        MainActivity.firebaseReffInProgress = false;
        FireBaseListeners.reffLocations = null;
        FireBaseListeners.firstGetLocationsListener = true;
        FireBaseListeners.viewLocationsListActivity = null;
        FireBaseListeners.reffMessages = null;
        FireBaseListeners.firstGetMessagesListener = true;
        FireBaseListeners.messageSelectedLocation = null;
        FireBaseListeners.reffTasks = null;
        FireBaseListeners.firstGetTasksListener = true;
        FireBaseListeners.viewTaskListActivity = null;
        FireBaseListeners.reffTasksOccurence = null;
        FireBaseListeners.firstGetTasksOccurenceListener = true;
        FireBaseListeners.reffPeople = null;
        FireBaseListeners.firstGetPeopleListener = true;
        ViewPeopleListActivity.viewPeopleListActivity = null;
        FireBaseListeners.viewNewEditSDSActivity = null;
        FireBaseListeners.reffShifts = null;
        FireBaseListeners.firstGetShiftsListener = true;
        FireBaseListeners.tempShiftAddedPeopleIDs = [];
        FireBaseListeners.viewShiftCalendarActivity = null;
        FireBaseListeners.viewShiftListActivity = null;
        FireBaseListeners.reffTimePunches = null;
        FireBaseListeners.firstGetTimePunchesListener = true;
        FireBaseListeners.viewTimePunchListActivity = null;
        FireBaseListeners.reffInspectionPlans = null;
        FireBaseListeners.firstGetInspectionPlansListener = true;
        FireBaseListeners.viewInspectionPlanListActivity = null;
        FireBaseListeners.reffInspectionPlansOccurence = null;
        FireBaseListeners.firstGetInspectionPlansOccurenceListener = true;
        FireBaseListeners.reffSupplyItems = null;
        FireBaseListeners.firstGetSupplyItemsListener = true;
        FireBaseListeners.viewSupplyItemListActivity = null;
        FireBaseListeners.employeeStatusListActivity = null;
        MainActivity.shiftsReadyForClockIn = false;
        MainActivity.locationsReadyForClockIn = false;
        MainActivity.clockInOutPendingLocation = MainActivity.PENDING_CLOCKINOUT_NONE;
        MainActivity.pendingClockInOutLocationLatitudeList = [];
        MainActivity.pendingClockInOutLocationLongitudeList = [];
        MainActivity.pendingClockInOutLocationList = [];
        MainActivity.pendingClockInOutShiftList = [];
        MainActivity.statusPendingLocation = MainActivity.PENDING_CLOCKINOUT_NONE;

        if (MainActivity.notificationManager != null) {
            MainActivity.notificationManager.cancelAll();
        }
    }

    cancelClockInOut() {
        MainActivity.pendingClockInOutLocationLatitudeList = [];
        MainActivity.pendingClockInOutLocationLongitudeList = [];
        MainActivity.pendingClockInOutLocationList = [];
        MainActivity.pendingClockInOutShiftList = [];
        MainActivity.clockInOutPendingLocation = MainActivity.PENDING_CLOCKINOUT_NONE;
    }

    static setFirebaseReferenceInProgress(index, bool) {
        MainActivity.firebaseReffsInProgress[index] = bool;
        if (bool)
            MainActivity.firebaseReffsFirstLoad[index] = true;
        MainActivity.firebaseReffInProgress = false;
        for (var i = 0; i < MainActivity.netTaskSize; ++i) {
            if (MainActivity.firebaseReffsInProgress[i]) {
                MainActivity.firebaseReffInProgress = true;
                break;
            }
        }
        if (bool == false && MainActivity.firebaseReffInProgress == false) {
            MainActivity.allDatabaseDownloaded = true;
            for (var i = 0; i < MainActivity.netTaskSize; ++i)
                if (MainActivity.firebaseReffsFirstLoad[i] == false) {
                    MainActivity.allDatabaseDownloaded = false;
                    break;
                }
            if (MainActivity.allDatabaseDownloaded) {
                NotificationsManager.sendInitialNotification();
                NotificationsManager.doTimePunchNotifications();
                NotificationsManager.doTaskNotifications();
                NotificationsManager.doMessageNotifications();
                NotificationsManager.doInspectionNotifications();
                HomeActivity.initializeHomeScreen();
                W4AlarmManager.startAlarmManager(MainActivity.mainActivity);
                // if (HomeActivity.homeActivity != null && MainActivity.companyData.isTasksEnabled()) {
                //     HomeActivity.homeActivity.resumeTask(true);
                // }
            }
        }
    }

    static setAllFirebaseReffsInProgress(bool) {
        for (var i = 0; i < MainActivity.netTaskSize; ++i) {
            MainActivity.firebaseReffsInProgress[i] = bool;
        }
        MainActivity.firebaseReffInProgress = bool;
    }

    static setAllFirebaseReffsFirstLoad(bool) {
        for (var i = 0; i < MainActivity.netTaskSize; ++i) {
            MainActivity.firebaseReffsFirstLoad[i] = bool;
        }
    }

    setButtonsInvisible() {
        this.findViewById("LoadAssets_Progress").setVisibility(View.VISIBLE);
        this.findViewById("EmployeeStatusButton").setVisibility(View.GONE);
        this.findViewById("LogOutButton").setVisibility(View.INVISIBLE);
        this.findViewById("PeopleButton").setVisibility(View.INVISIBLE);
        this.findViewById("LocationsButton").setVisibility(View.INVISIBLE);
        this.findViewById("MessagesButton").setVisibility(View.INVISIBLE);
        this.findViewById("ShiftsButton").setVisibility(View.INVISIBLE);
        this.findViewById("TimePunchesButton").setVisibility(View.INVISIBLE);
        this.findViewById("InspectionPlansButton").setVisibility(View.INVISIBLE);
        this.findViewById("SupplyItemsButton").setVisibility(View.INVISIBLE);
        var circle = this.findViewById("SupplyItemsButtonRedCircle");
        var textView = this.findViewById("SupplyItemsButtonRedCircleText");
        circle.setVisibility(View.GONE);
        textView.setText("");
        this.findViewById("SDSButton").setVisibility(View.INVISIBLE);
        this.findViewById("TasksButton").setVisibility(View.INVISIBLE);
        this.findViewById("ReportsButton").setVisibility(View.INVISIBLE);
    }

    static initializeHomeScreen() {
        if (HomeActivity.homeActivity != null) {
            HomeActivity.homeActivity.getSupportActionBar().setTitle(MainActivity.currentPerson.getFirst_name() + " " + MainActivity.currentPerson.getLast_name());
            HomeActivity.homeActivity.setButtonsInvisible();
            if (MainActivity.currentPerson.canSeeEmployeeStatuses()) {
                HomeActivity.homeActivity.findViewById("EmployeeStatusButton").setVisibility(View.VISIBLE);
                HomeActivity.homeActivity.setEmployeeStatusButton();
            }
            HomeActivity.homeActivity.findViewById("LogOutButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("PeopleButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("LocationsButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("MessagesButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("ShiftsButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("TimePunchesButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("InspectionPlansButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("SupplyItemsButton").setVisibility(View.VISIBLE);
            var tasksButton = HomeActivity.homeActivity.findViewById("TasksButton");
            tasksButton.setVisibility(View.VISIBLE);
            if (MainActivity.companyData.isTasksEnabled()) {
                tasksButton.setBackgroundResource("../res/icon_tasks.png");
            }
            else {
                tasksButton.setBackgroundResource("../res/icon_tasks_disabled.png");
            }
            HomeActivity.homeActivity.findViewById("ReportsButton").setVisibility(View.VISIBLE);
            if (W4_Funcs.isAssetReadable(Asset.PERMISSION_ALL_SUPPLIES)) {
                var circle = HomeActivity.homeActivity.findViewById("SupplyItemsButtonRedCircle");
                var textView = HomeActivity.homeActivity.findViewById("SupplyItemsButtonRedCircleText");
                var totalAmountRequested = MainActivity.theCompany.getTotalSuppliesRequested();
                if (totalAmountRequested > 0) {
                    circle.setVisibility(View.VISIBLE);
                    textView.setText(totalAmountRequested + "");
                } else {
                    circle.setVisibility(View.GONE);
                    textView.setText("");
                }
            } else {
                var circle = HomeActivity.homeActivity.findViewById("SupplyItemsButtonRedCircle");
                var textView = HomeActivity.homeActivity.findViewById("SupplyItemsButtonRedCircleText");
                circle.setVisibility(View.GONE);
                textView.setText("");
            }
            HomeActivity.homeActivity.findViewById("SDSButton").setVisibility(View.VISIBLE);
            HomeActivity.homeActivity.findViewById("LoadAssets_Progress").setVisibility(View.GONE);
            HomeActivity.homeActivity.setAdminToolsButton();
            HomeActivity.homeActivity.findViewById("profile_circle_initials", true).setText(MainActivity.currentPerson.method_getInitials());
        }
    }

    setEmployeeStatusButton() {
        var button = this.findViewById("EmployeeStatusButton");
        var list = W4_Funcs.getEmployeeStatuses();
        var clockedIn = 0;
        var clockedOut = 0;
        for (let e of list) {
            if (EmployeeStatusActivity.getBoolAndClockedText(e.person, e.shift)[0]) {
                ++clockedIn;
            } else {
                ++clockedOut;
            }
        }
        var text = "";
        if (clockedIn > 0) {
            text += MainActivity.BLUE_CIRCLE + " " + clockedIn + " Clocked In";
        }
        if (clockedOut > 0) {
            if (clockedIn > 0) {
                text += "<br>";
            }
            text += MainActivity.RED_CIRCLE + " " + clockedOut + " Clocked Out";
        }
        if (clockedIn == 0 && clockedOut == 0)
            text = "No Shifts Active Now";
        button.setText(text);
        if (FireBaseListeners.employeeStatusListActivity != null) {
            FireBaseListeners.employeeStatusListActivity.updateList();
        }
    }

    populateNotificationsList() {
        if (MainActivity.w4Notifications.length > 0) {
            this.notificationsRedCircle.setVisibility(View.VISIBLE);
            this.notificationsRedCircleText.setText(MainActivity.w4Notifications.length + "");
        } else {
            this.notificationsRedCircle.setVisibility(View.INVISIBLE);
        }
        var numMessages = W4_Funcs.getNumMessageNotifications();
        if (numMessages > 0) {
            this.inboxRedCircle.setVisibility(View.VISIBLE);
            this.inboxRedCircleText.setText(numMessages + "");
        } else {
            this.inboxRedCircle.setVisibility(View.INVISIBLE);
        }
    }

    setAdminToolsButton() {
        if (MainActivity.loggedIn && MainActivity.w4_DB_Data.getAdmins().includes(firebase.auth().currentUser.email)) {
            this.findViewById("AdminToolsButton").setVisibility(View.VISIBLE);
            this.findViewById("AdminToolsButton").addEventListener("click", function () {
                var intent = new Intent(HomeActivity.homeActivity, new AdminToolsActivity());
                HomeActivity.homeActivity.startActivity(intent);
            });
        } else {
            HomeActivity.homeActivity.findViewById("AdminToolsButton").setVisibility(View.GONE);
        }
    }
}
