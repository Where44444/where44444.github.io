class FireBaseListeners {
    static reffLocations = null;
    static firstGetLocationsListener = true;
    static viewLocationsListActivity = null;
    static reffMessages = null;
    static firstGetMessagesListener = true;
    static messageSelectedLocation = null;
    static reffTasks = null;
    static firstGetTasksListener = true;
    static viewTaskListActivity = null;
    static reffTasksOccurence = null;
    static firstGetTasksOccurenceListener = true;
    static reffPeople = null;
    static firstGetPeopleListener = true;
    static viewNewEditSDSActivity = null;
    static reffShifts = null;
    static firstGetShiftsListener = true;
    static tempShiftAddedPeopleIDs = [];
    static viewShiftCalendarActivity = null;
    static viewShiftListActivity = null;
    static reffTimePunches = null;
    static firstGetTimePunchesListener = true;
    static viewTimePunchListActivity = null;
    static reffInspectionPlans = null;
    static firstGetInspectionPlansListener = true;
    static viewInspectionPlanListActivity = null;
    static reffInspectionPlansOccurence = null;
    static firstGetInspectionPlansOccurenceListener = true;
    static reffSupplyItems = null;
    static firstGetSupplyItemsListener = true;
    static viewSupplyItemListActivity = null;
    static employeeStatusListActivity = null;
    static viewTemplateListActivity = null;
    static reffData = null;

    static fireBaseSingleListener_getUser() {
        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetSingleUser, true);
        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetSingleUser, false);
        FireBaseListeners.fireBaseListener_getPeople(MainActivity.theCompany.getId());
        FireBaseListeners.fireBaseListener_getTimePunches();
        FireBaseListeners.fireBaseListener_getLocations();
        FireBaseListeners.fireBaseListener_getShifts();
        FireBaseListeners.fireBaseListener_getSupplyItems();
        FireBaseListeners.fireBaseListener_getInspectionPlans();
        FireBaseListeners.fireBaseListener_getInspectionPlansOccurences();
        FireBaseListeners.fireBaseListener_getMessages();
        FireBaseListeners.fireBaseListener_getTasks();
        FireBaseListeners.fireBaseListener_getTasksOccurence();
    }

    static fireBaseListener_getPeople(companyID) {
        if (FireBaseListeners.reffPeople != null)
            FireBaseListeners.reffPeople.off();
        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetPeople, true);
        FireBaseListeners.firstGetPeopleListener = true;
        FireBaseListeners.reffPeople = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(companyID).child(MainActivity.DB_PATH_ASSET_PEOPLE);
        FireBaseListeners.reffPeople.on('value', function (dataSnapshot) {
            FireBaseListeners.processPeopleSnapshotData(dataSnapshot);
        });
    }

    static fireBaseListener_getTimePunches() {

        if (FireBaseListeners.reffTimePunches != null)
            FireBaseListeners.reffTimePunches.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetTimePunches, true);
        FireBaseListeners.firstGetTimePunchesListener = true;
        FireBaseListeners.reffTimePunches = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES);
        FireBaseListeners.reffTimePunches.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                MainActivity.theCompany.setTimePunchList([]);

                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var timePunch = TimePunch.fromDS(ds);
                    MainActivity.theCompany.getTimePunchList().push(timePunch);
                }

                MainActivity.theCompany.getTimePunchList().sort(TimePunch.compareTo);

                if (FireBaseListeners.firstGetTimePunchesListener) {
                    FireBaseListeners.firstGetTimePunchesListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetTimePunches, false);
                } else {
                    NotificationsManager.doTimePunchNotifications();
                    HomeActivity.initializeHomeScreen();
                }

                if (FireBaseListeners.viewTimePunchListActivity != null) {
                    FireBaseListeners.viewTimePunchListActivity.updateList();
                }
            }
        });
    }

    static fireBaseListener_getLocations() {
        if (FireBaseListeners.reffLocations != null)
            FireBaseListeners.reffLocations.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetLocations, true);
        FireBaseListeners.firstGetLocationsListener = true;
        FireBaseListeners.reffLocations = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_LOCATIONS);
        FireBaseListeners.reffLocations.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                MainActivity.theCompany.setLocationList([]);
                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var location = Location.fromDS(ds);
                    MainActivity.theCompany.getLocationList().push(location);
                }

                MainActivity.theCompany.getLocationList().sort(Location.compareTo);

                if (FireBaseListeners.viewLocationsListActivity != null) {
                    FireBaseListeners.viewLocationsListActivity.updateList();
                }

                if (FireBaseListeners.firstGetLocationsListener) {
                    FireBaseListeners.firstGetLocationsListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetLocations, false);
                } else {
                    HomeActivity.initializeHomeScreen();
                }
                MainActivity.locationsReadyForClockIn = true;
            }
        });
    }

    static fireBaseListener_getShifts() {

        if (FireBaseListeners.reffShifts != null)
            FireBaseListeners.reffShifts.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetShifts, true);
        FireBaseListeners.firstGetShiftsListener = true;
        FireBaseListeners.reffShifts = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SHIFTS);
        FireBaseListeners.reffShifts.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                MainActivity.theCompany.setShiftList([]);
                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var shift = Shift.fromDS(ds);
                    if (shift.getWeeklyRepeatDays() == null)
                        shift.setWeeklyRepeatDays([]);
                    if (shift.getPersonIDList() == null)
                        shift.setPersonIDList([]);
                    MainActivity.theCompany.getShiftList().push(shift);
                }

                MainActivity.theCompany.getShiftList().sort(Shift.compareTo);

                if (FireBaseListeners.viewShiftListActivity != null) {
                    FireBaseListeners.viewShiftListActivity.updateList();
                }

                if (FireBaseListeners.viewShiftCalendarActivity != null)
                    FireBaseListeners.viewShiftCalendarActivity.updateCalendarScheduleView();

                if (FireBaseListeners.firstGetShiftsListener) {
                    FireBaseListeners.firstGetShiftsListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetShifts, false);
                } else {
                    HomeActivity.initializeHomeScreen();
                }
                MainActivity.shiftsReadyForClockIn = true;
            }
        });
    }

    static fireBaseListener_getSupplyItems() {

        if (FireBaseListeners.reffSupplyItems != null)
            FireBaseListeners.reffSupplyItems.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetSupplyItems, true);
        FireBaseListeners.firstGetSupplyItemsListener = true;
        FireBaseListeners.reffSupplyItems = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS);
        FireBaseListeners.reffSupplyItems.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                MainActivity.theCompany.setSupplyItemList([]);
                MainActivity.theCompany.setSupplyItemTemplateList([]);
                var totalAmountRequested = 0;

                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var supplyItem = SupplyItem.fromDS(ds);
                    if (supplyItem.isTemplate()) {
                        MainActivity.theCompany.getSupplyItemTemplateList().push(supplyItem);
                    } else {
                        MainActivity.theCompany.getSupplyItemList().push(supplyItem);
                        totalAmountRequested += supplyItem.getAmountRequested();
                    }
                }

                MainActivity.theCompany.getSupplyItemList().sort(SupplyItem.compareTo);
                MainActivity.theCompany.getSupplyItemTemplateList().sort(SupplyItem.compareTo);

                if (FireBaseListeners.viewSupplyItemListActivity != null) {
                    FireBaseListeners.viewSupplyItemListActivity.updateList();
                }

                if (FireBaseListeners.viewTemplateListActivity != null) {
                    FireBaseListeners.viewTemplateListActivity.updateList();
                }

                if (FireBaseListeners.firstGetSupplyItemsListener) {
                    FireBaseListeners.firstGetSupplyItemsListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetSupplyItems, false);
                } else {
                    HomeActivity.initializeHomeScreen();
                }
            }
        });
    }

    static fireBaseListener_getInspectionPlans() {

        if (FireBaseListeners.reffInspectionPlans != null)
            FireBaseListeners.reffInspectionPlans.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetInspectionPlans, true);
        FireBaseListeners.firstGetInspectionPlansListener = true;
        FireBaseListeners.reffInspectionPlans = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS);
        FireBaseListeners.reffInspectionPlans.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {

                MainActivity.theCompany.setInspectionPlanList([]);
                MainActivity.theCompany.setInspectionPlanTemplateList([]);

                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var inspectionPlan = InspectionPlan.fromDS(ds);
                    if (inspectionPlan.getArea_names() == null)
                        inspectionPlan.setArea_names([]);
                    if (inspectionPlan.getPoints() == null)
                        inspectionPlan.setPoints([]);
                    if (inspectionPlan.isTemplate()) {
                        MainActivity.theCompany.getInspectionPlanTemplateList().push(inspectionPlan);
                    } else {
                        MainActivity.theCompany.getInspectionPlanList().push(inspectionPlan);
                    }
                }

                MainActivity.theCompany.getInspectionPlanList().sort(InspectionPlan.compareTo);
                MainActivity.theCompany.getInspectionPlanTemplateList().sort(InspectionPlan.compareTo);

                if (FireBaseListeners.viewTemplateListActivity != null) {
                    FireBaseListeners.viewTemplateListActivity.updateList();
                }

                if (FireBaseListeners.firstGetInspectionPlansListener) {
                    FireBaseListeners.firstGetInspectionPlansListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetInspectionPlans, false);
                } else {
                    HomeActivity.initializeHomeScreen();
                }
                FireBaseListeners.populateAllInspectionPlansList();
            }
        });
    }

    static fireBaseListener_getInspectionPlansOccurences() {

        if (FireBaseListeners.reffInspectionPlansOccurence != null)
            FireBaseListeners.reffInspectionPlansOccurence.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetInspectionPlansOccurence, true);
        FireBaseListeners.firstGetInspectionPlansOccurenceListener = true;
        FireBaseListeners.reffInspectionPlansOccurence = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE);
        FireBaseListeners.reffInspectionPlansOccurence.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {

                MainActivity.theCompany.setInspectionPlansCompletedList([]);
                MainActivity.theCompany.setInspectionPlansInProgressList([]);

                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var inspectionPlanOccurence = InspectionPlanOccurence.fromDS(ds);
                    if (inspectionPlanOccurence.getArea_names() == null)
                        inspectionPlanOccurence.setArea_names([]);
                    if (inspectionPlanOccurence.getPoints() == null)
                        inspectionPlanOccurence.setPoints([]);
                    if (inspectionPlanOccurence.isCompleted())
                        MainActivity.theCompany.getInspectionPlansCompletedList().push(inspectionPlanOccurence);
                    else
                        MainActivity.theCompany.getInspectionPlansInProgressList().push(inspectionPlanOccurence);
                }

                MainActivity.theCompany.getInspectionPlansCompletedList().sort(InspectionPlanOccurence.compareTo);
                MainActivity.theCompany.getInspectionPlansInProgressList().sort(InspectionPlanOccurence.compareTo);

                if (FireBaseListeners.firstGetInspectionPlansOccurenceListener) {
                    FireBaseListeners.firstGetInspectionPlansOccurenceListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetInspectionPlansOccurence, false);
                } else {
                    NotificationsManager.doInspectionNotifications();
                    HomeActivity.initializeHomeScreen();
                }
                FireBaseListeners.populateAllInspectionPlansList();
            }
        });
    }

    static fireBaseListener_getMessages() {

        if (FireBaseListeners.reffMessages != null)
            FireBaseListeners.reffMessages.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetMessages, true);
        FireBaseListeners.firstGetMessagesListener = true;
        FireBaseListeners.reffMessages = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_MESSAGES);
        FireBaseListeners.reffMessages.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                var oldList = MainActivity.theCompany.getMessageList();
                var newList = [];
                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var message = Message.fromDS(ds);
                    if (message.getLocationID() != null) {
                        if (!message.isMessageInList(oldList)) {
                            if (ViewMessageDialogueActivity.viewMessageDialogueActivity != null && message.getLocationID() == FireBaseListeners.messageSelectedLocation.getW4id()) {
                                ViewMessageDialogueActivity.viewMessageDialogueActivity.updateList(message);
                            }
                        }
                        newList.push(message);
                    }
                }
                MainActivity.theCompany.setMessageList(newList);

                if (FireBaseListeners.firstGetMessagesListener) {
                    FireBaseListeners.firstGetMessagesListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetMessages, false);
                } else {
                    NotificationsManager.doMessageNotifications();
                    HomeActivity.initializeHomeScreen();
                }
            }
        });
    }

    static fireBaseListener_getTasks() {

        if (FireBaseListeners.reffTasks != null)
            FireBaseListeners.reffTasks.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetTasks, true);
        FireBaseListeners.firstGetTasksListener = true;
        FireBaseListeners.reffTasks = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS);
        FireBaseListeners.reffTasks.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                var taskSheetList = [];
                var taskSheetTemplateList = [];
                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var task = TaskSheet.fromDS(ds);
                    if (task.isTemplate()) {
                        taskSheetTemplateList.push(task);
                    } else {
                        taskSheetList.push(task);
                    }
                }
                MainActivity.theCompany.setTaskSheetList(taskSheetList);
                MainActivity.theCompany.setTaskSheetTemplateList(taskSheetTemplateList);

                if (FireBaseListeners.viewTaskListActivity != null) {
                    FireBaseListeners.viewTaskListActivity.populateTasksList(FireBaseListeners.viewTaskListActivity);
                }

                if (FireBaseListeners.viewTemplateListActivity != null) {
                    FireBaseListeners.viewTemplateListActivity.updateList();
                }

                if (FireBaseListeners.firstGetTasksListener) {
                    FireBaseListeners.firstGetTasksListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetTasks, false);
                } else {
                    HomeActivity.initializeHomeScreen();
                }
            }
        });
    }

    static fireBaseListener_getTasksOccurence() {

        if (FireBaseListeners.reffTasksOccurence != null)
            FireBaseListeners.reffTasksOccurence.off();

        HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetTasksOccurence, true);
        FireBaseListeners.firstGetTasksOccurenceListener = true;
        FireBaseListeners.reffTasksOccurence = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE);
        FireBaseListeners.reffTasksOccurence.on('value', function (dataSnapshot) {
            if (MainActivity.loggedIn) {
                var taskSheetInProgressList = [];
                var taskSheetCompletedList = [];
                var ds_val = dataSnapshot.val();
                for (const ds_key in ds_val) {
                    let ds = ds_val[ds_key];
                    var taskOccurence = TaskSheetOccurence.fromDS(ds);
                    if (taskOccurence.isCompleted())
                        taskSheetCompletedList.push(taskOccurence);
                    else
                        taskSheetInProgressList.push(taskOccurence);
                }

                taskSheetInProgressList.sort(TaskSheetOccurence.compareTo);
                taskSheetCompletedList.sort(TaskSheetOccurence.compareTo);

                MainActivity.theCompany.setTaskSheetInProgressList(taskSheetInProgressList);
                MainActivity.theCompany.setTaskSheetCompletedList(taskSheetCompletedList);

                if (FireBaseListeners.firstGetTasksOccurenceListener) {
                    FireBaseListeners.firstGetTasksOccurenceListener = false;
                    HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetTasksOccurence, false);
                } else {
                    NotificationsManager.doTaskNotifications();
                    HomeActivity.initializeHomeScreen();
                }

                if (FireBaseListeners.viewTaskListActivity != null) {
                    FireBaseListeners.viewTaskListActivity.populateTasksInProgressList(FireBaseListeners.viewTaskListActivity);
                    FireBaseListeners.viewTaskListActivity.populateTasksCompletedList(FireBaseListeners.viewTaskListActivity);
                }
            }
        });
    }

    static processPeopleSnapshotData(dataSnapshot) {
        if (MainActivity.loggedIn) {
            var value = dataSnapshot.child(MainActivity.currentPersonID).val(); //Ensures that MainActivity.currentPerson is set to the value of the credentials on the login page
            if (value == null) { //If first time logging in
                if (dataSnapshot.numChildren() != 0) { //If there's other people in the company already, this means the person was deleted and they're trying to log back in instantly
                    HomeActivity.logOut();
                    if (HomeActivity.homeActivity != null)
                        HomeActivity.homeActivity.finish();
                    System.exit(1);
                    return;
                }
                var readPermissions = [
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false];
                var writePermissions = [
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false,
                    true,
                    false];
                var person = new Person(MainActivity.currentPersonID, "Company", "Owner", "", firebase.auth().currentUser.email, MainActivity.current_password, Person.OWNER, readPermissions, writePermissions, false, false);
                W4_Funcs.writeToDB(FireBaseListeners.reffPeople.child(MainActivity.currentPersonID), person, "Owner created first time " + MainActivity.currentPersonID);
                MainActivity.currentPerson = person;
                MainActivity.current_password = MainActivity.currentPerson.getPassword();
                console.log("Couldn't find " + firebase.auth().currentUser.email + " in company->people and set as Owner, Uid: " + MainActivity.currentPersonID);
            } else {
                MainActivity.currentPerson = Person.fromDS(value);
                MainActivity.current_password = MainActivity.currentPerson.getPassword();
                console.log("Set MainActivity.currentPerson to " + MainActivity.currentPerson.getFirst_name() + " " + MainActivity.currentPerson.getLast_name());
            }

            MainActivity.theCompany.setPersonList([MainActivity.currentPerson]);
            var ds_val = dataSnapshot.val();
            for (const ds_key in ds_val) {
                let ds = ds_val[ds_key];
                var person = Person.fromDS(ds);
                if (person.getW4id() != MainActivity.currentPerson.getW4id()) {
                    if (person.getReadPermissions() == null)
                        person.setReadPermissions(W4_Funcs.getAllFalsePermissions());
                    if (person.getWritePermissions() == null)
                        person.setWritePermissions(W4_Funcs.getAllFalsePermissions());
                    MainActivity.theCompany.getPersonList().push(person);
                }
            }

            MainActivity.theCompany.getPersonList().sort(Person.compareTo);

            if (ViewPeopleListActivity.viewPeopleListActivity != null) {
                ViewPeopleListActivity.viewPeopleListActivity.updateList();
            }

            if (FireBaseListeners.firstGetPeopleListener) {
                FireBaseListeners.firstGetPeopleListener = false;
                HomeActivity.setFirebaseReferenceInProgress(MainActivity.netTaskGetPeople, false);
            } else {
                HomeActivity.initializeHomeScreen();
            }
        }
    }

    static populateAllInspectionPlansList() {
        if (FireBaseListeners.viewInspectionPlanListActivity != null) {
            FireBaseListeners.viewInspectionPlanListActivity.populateInspectionPlansList(FireBaseListeners.viewInspectionPlanListActivity);
            FireBaseListeners.viewInspectionPlanListActivity.populateInspectionPlansInProgressList(FireBaseListeners.viewInspectionPlanListActivity);
            FireBaseListeners.viewInspectionPlanListActivity.populateInspectionPlansCompletedList(FireBaseListeners.viewInspectionPlanListActivity);
        }
    }

    static fireBaseListener_getData() {
        if (FireBaseListeners.reffData != null)
            FireBaseListeners.reffData.off();
        FireBaseListeners.reffData = firebase.database().ref().child(MainActivity.DB_PATH_DATA);
        FireBaseListeners.reffData.on('value', function (dataSnapshot) {
            MainActivity.w4_DB_Data = new W4Data(dataSnapshot);
            MainActivity.companyData = Asset.getAssetbyId(MainActivity.w4_DB_Data.getCompanies(), MainActivity.theCompany.getId());
            if (MainActivity.companyData == null) {
                MainActivity.companyData = new CompanyData();
            }

            if (HomeActivity.homeActivity != null) {
                HomeActivity.homeActivity.setAdminToolsButton();
            }
            if (AdminToolsActivity.adminToolsActivity != null) {
                AdminToolsActivity.adminToolsActivity.updateList();
            }
            var companyData = Asset.getAssetbyId(MainActivity.w4_DB_Data.getCompanies(), MainActivity.theCompany.getId());
            var now = new W4DateTime();
            if ((MainActivity.version_long != MainActivity.w4_DB_Data.getVersion_long() && MainActivity.version_long != MainActivity.w4_DB_Data.getTest_version_long())
                || (companyData != null && companyData.isBlacklisted())
                || (companyData != null && companyData.isTrialPeriod() && now.getMillis() >= companyData.getTrialEnd())) {
                if (AppCompatActivity.activities.length > 1) {
                    HomeActivity.logOut();
                    var intent = new Intent(MainActivity.mainActivity, null);
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    MainActivity.mainActivity.startActivity(intent);
                }
            } else {
                MainActivity.mainActivity.autoSignIn();
            }
            MainActivity.mainActivity.findViewById("maindiv").setVisibility(View.VISIBLE);
            document.getElementById("firstLoader").style.display = "none";
        });

    }
}
