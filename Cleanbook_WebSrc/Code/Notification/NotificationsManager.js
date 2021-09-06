class NotificationsManager {
    static key_TimePunch = "0";
    static key_LateTask = "1";
    static key_MissingTask = "2";
    static key_Message = "3";
    static key_Inspection = "4";

    static sendInitialNotification() {
        if (!MainActivity.w4SaveState.isInitialNotificationSent() && MainActivity.currentPerson.canSeeNotifications()) {
            var title = "CleanAssistant Notifications";
            var text = "This is how you'll receive notifications about Employee Activities if you're an Owner, Manager, or Supervisor";
            W4_Funcs.showNotification(MainActivity.mainActivity, 0, -1, title, text, null, true, true, null);
            MainActivity.w4SaveState.setInitialNotificationSent(true);
            MainActivity.saveState(3);
        }
    }

    static doTimePunchNotifications() {
        if (MainActivity.mainActivity != null && MainActivity.currentPerson.canSeeNotifications()) { //Start notifications
            var saveStateModified = MainActivity.w4SaveState.method_InitializeNotificationsData(NotificationsManager.key_TimePunch);
            var now = new W4DateTime();
            for (let timePunch of MainActivity.theCompany.getTimePunchList()) {
                var wasShownOnSystem = W4_Funcs.doNotificationsIncludeTimePunchID(MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_TimePunch), timePunch.getW4id());
                var wasClearedOnApp = W4_Funcs.doNotificationsIncludeTimePunchID(MainActivity.w4SaveState.getAppNotificationsMap().get(NotificationsManager.key_TimePunch), timePunch.getW4id());
                if (now.getMillis() - timePunch.getTime() < MainActivity.NOTIFICATION_EXPIRATION_TIME && (!wasShownOnSystem || !wasClearedOnApp)) {
                    var save = new NotificationW4Save();
                    save.timepunch_id = timePunch.getW4id();
                    save.time = timePunch.getTime();
                    MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_TimePunch).push(save);
                    saveStateModified = true;
                    if (W4_Funcs.isTimePunchLateClockIn(timePunch)) {
                        var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), timePunch.getPersonID());
                        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), timePunch.getShiftID());
                        var punchTime = new W4DateTime(timePunch.getTime());
                        var text = "";
                        if (person != null)
                            text += person.getFirst_name() + " " + person.getLast_name() + " ";
                        text += "Clocked in late at " + W4_Funcs.getTimeText(punchTime);
                        if (shift != null)
                            text += " for a shift at " + W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime()));
                        var intent = null;
                        if (person != null) {
                            intent = new Intent(HomeActivity.homeActivity, new ViewTimePunchListActivity());
                            intent.putExtra("by_person", true);
                            intent.putExtra("name", person.getFirst_name() + " " + person.getLast_name());
                            intent.putExtra("person_id", person.getW4id());
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        }
                        var title = "Late Clock In - " + W4_Funcs.getFriendlyDateText(punchTime);
                        W4_Funcs.showNotification(MainActivity.mainActivity, -1, NotificationsManager.key_TimePunch, title, text, intent, !wasShownOnSystem, !wasClearedOnApp, save);
                        saveStateModified = true;
                    }
                }
            }
            if (saveStateModified)
                MainActivity.saveState(4);
        }
    }

    static doTaskNotifications() {
        if (MainActivity.mainActivity != null && MainActivity.currentPerson.canSeeNotifications()) { //Start notifications
            var saveStateModified = MainActivity.w4SaveState.method_InitializeNotificationsData(NotificationsManager.key_LateTask);
            var saveStateModified2 = MainActivity.w4SaveState.method_InitializeNotificationsData(NotificationsManager.key_MissingTask);
            if (saveStateModified2) {
                saveStateModified = true;
            }
            var now = new W4DateTime();
            //Shift Person Day
            var tasksMap = new Map();
            for (let taskSheetOccurence of MainActivity.theCompany.getTaskSheetCompletedList()) {
                if (now.getMillis() - taskSheetOccurence.getUpdatedDateTime() < MainActivity.NOTIFICATION_EXPIRATION_TIME) {
                    var taskDT = new W4DateTime(taskSheetOccurence.getStartedDateTime());
                    var taskDay = W4_Funcs.getDSTSafeDateTime(taskDT.getYear(), taskDT.getMonthOfYear(), taskDT.getDayOfMonth(), 0, 0, 0);
                    tasksMap.set(taskSheetOccurence.getShiftID() + taskSheetOccurence.getPersonID() + taskDay.getMillis(), true);
                    var wasShownOnSystem = W4_Funcs.doNotificationsIncludeTaskID(MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_LateTask), taskSheetOccurence.getW4id());
                    var wasClearedOnApp = W4_Funcs.doNotificationsIncludeTaskID(MainActivity.w4SaveState.getAppNotificationsMap().get(NotificationsManager.key_LateTask), taskSheetOccurence.getW4id());
                    if (!wasShownOnSystem || !wasClearedOnApp) {
                        var goals_met = taskSheetOccurence.method_getNumTasksCompletedOnTime();
                        var total_goals = taskSheetOccurence.getTimesCompleted().length;
                        var save = new NotificationW4Save();
                        save.task_id = taskSheetOccurence.getW4id();
                        save.time = taskSheetOccurence.getUpdatedDateTime();
                        MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_LateTask).push(save);
                        saveStateModified = true;
                        if (goals_met < total_goals) {
                            var numLateTasks = total_goals - goals_met;
                            var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), taskSheetOccurence.getPersonID());
                            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), taskSheetOccurence.getShiftID());
                            var location = null;
                            if (shift != null) {
                                location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                            }
                            var taskTime = new W4DateTime(taskSheetOccurence.getUpdatedDateTime());
                            var text = "";
                            if (person != null)
                                text += person.getFirst_name() + " " + person.getLast_name() + " ";
                            if (numLateTasks == 1)
                                text += "Late on " + numLateTasks + " Task ";
                            else
                                text += "Late on " + numLateTasks + " Tasks ";
                            if (shift != null && location != null)
                                text += "for a shift at " + location.getName() + " at " + W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime()));
                            var intent = new Intent(MainActivity.mainActivity, new ViewTaskCompleteActivity());
                            intent.putExtra("id", taskSheetOccurence.getW4id());
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            var title = "Late Task - " + W4_Funcs.getFriendlyDateText(taskTime);
                            W4_Funcs.showNotification(MainActivity.mainActivity, -1, NotificationsManager.key_LateTask, text, title, intent, !wasShownOnSystem, !wasClearedOnApp, save);
                            saveStateModified = true;
                        }
                    }
                }
            }
            var dayToCheck = W4_Funcs.getPrevDay(new W4DateTime());
            var missingTasks = [];
            for (var i = 0; i < 5; ++i) //Check back five days for missing Tasks, not including today, 6 instead of 7 to help avoid checking for tasks that weren't added in the previous loop
            {
                for (let shift of MainActivity.theCompany.getShiftList()) {
                    var occurs_type = W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, dayToCheck, false, 0);
                    if (occurs_type == Shift.OCCURS_FIRST_DAY || occurs_type == Shift.OCCURS_TWICE_SAME_SLOT) {
                        for (let personID of shift.getPersonIDList()) {
                            var day = W4_Funcs.getDSTSafeDateTime(dayToCheck.getYear(), dayToCheck.getMonthOfYear(), dayToCheck.getDayOfMonth(), 0, 0, 0);
                            if (!tasksMap.has(shift.getW4id() + personID + day.getMillis())) {
                                var wasShownOnSystem = W4_Funcs.doNotificationsIncludeShiftPersonDay(MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_MissingTask), shift.getW4id(), personID, day.getMillis());
                                var wasClearedOnApp = W4_Funcs.doNotificationsIncludeShiftPersonDay(MainActivity.w4SaveState.getAppNotificationsMap().get(NotificationsManager.key_MissingTask), shift.getW4id(), personID, day.getMillis());
                                if (!wasShownOnSystem || !wasClearedOnApp) {
                                    var save = new NotificationW4Save();
                                    save.shift_id = shift.getW4id();
                                    save.person_id = personID;
                                    save.time = day.getMillis();
                                    save.wasShownOnSystem = wasShownOnSystem;
                                    save.wasClearedOnApp = wasClearedOnApp;
                                    missingTasks.push(save);

                                    MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_MissingTask).push(save);
                                    saveStateModified = true;
                                }
                            }
                        }
                    }
                }
                dayToCheck = W4_Funcs.getPrevDay(dayToCheck);
            }

            for (let save of missingTasks) {
                var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), save.shift_id);
                var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), save.person_id);
                var time = new W4DateTime(save.time);
                var location = null;
                if (shift != null)
                    location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                var text = "";
                if (person != null)
                    text += person.getFirst_name() + " " + person.getLast_name() + " ";
                text += "is missing a completed Task Sheet ";
                if (shift != null && location != null)
                    text += "for a shift at " + location.getName() + " at " + W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime()));
                var intent = null;
                if (person != null) {
                    intent = new Intent(HomeActivity.homeActivity, new ViewTaskListActivity());
                    intent.putExtra("by_person", true);
                    intent.putExtra("name", person.getFirst_name() + " " + person.getLast_name());
                    intent.putExtra("person_id", person.getW4id());
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                }
                var title = "Missing Task - " + W4_Funcs.getFriendlyDateText(time);
                W4_Funcs.showNotification(MainActivity.mainActivity, -1, NotificationsManager.key_MissingTask, title, text, intent, !save.wasShownOnSystem, !save.wasClearedOnApp, save);
                saveStateModified = true;
            }

            if (saveStateModified)
                MainActivity.saveState(5);
        }
    }

    static doMessageNotifications() {
        if (MainActivity.mainActivity != null) { //Start notifications
            var saveStateModified = MainActivity.w4SaveState.method_InitializeNotificationsData(NotificationsManager.key_Message);
            var now = new W4DateTime();
            var permittedLocations = null;
            var hasAllMessagesPermission = MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_MESSAGES];
            if (!hasAllMessagesPermission)
                permittedLocations = W4_Funcs.getIDsFromAssetArray(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_MESSAGES));
            for (let message of MainActivity.theCompany.getMessageList()) {
                if (FireBaseListeners.messageSelectedLocation == null || FireBaseListeners.messageSelectedLocation.getW4id() != message.getLocationID()) {
                    var wasShownOnSystem = W4_Funcs.doNotificationsIncludeAnyID(MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_Message), message.getW4id());
                    var wasClearedOnApp = W4_Funcs.doNotificationsIncludeAnyID(MainActivity.w4SaveState.getAppNotificationsMap().get(NotificationsManager.key_Message), message.getW4id());
                    if (message.getPersonID() != (MainActivity.currentPerson.getW4id()) && now.getMillis() - message.getTime() < MainActivity.NOTIFICATION_EXPIRATION_TIME && (!wasShownOnSystem || !wasClearedOnApp)) {
                        if (hasAllMessagesPermission || permittedLocations.includes(message.getLocationID())) {
                            var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), message.getPersonID());
                            var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), message.getLocationID());
                            var text = "";
                            var title = "";
                            if (person != null) {
                                title += person.getFirst_name() + " " + person.getLast_name();
                            }
                            if (location != null) {
                                if (person != null)
                                    title += " at ";
                                title += location.getName();
                            }
                            title += " messaged:";
                            text += message.getW4text();
                            var location_id = "";
                            if (location != null) {
                                location_id = location.getW4id();
                            }
                            var intent = new Intent(HomeActivity.homeActivity, new ViewMessageDialogueActivity());
                            intent.putExtra("id", location_id);
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            var save = new NotificationW4Save();
                            save.any_id = message.getW4id();
                            save.time = message.getTime();
                            MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_Message).push(save);

                            W4_Funcs.showNotification(MainActivity.mainActivity, -1, NotificationsManager.key_Message, title, text, intent, !wasShownOnSystem, !wasClearedOnApp, save);
                            saveStateModified = true;
                        }
                    }
                }
            }
            if (saveStateModified)
                MainActivity.saveState(6);
        }
    }

    static doInspectionNotifications() {
        if (MainActivity.mainActivity != null) { //Start notifications
            var saveStateModified = MainActivity.w4SaveState.method_InitializeNotificationsData(NotificationsManager.key_Inspection);
            var now = new W4DateTime();
            var permittedShifts = null;
            var hasAllInspectionsPermission = MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_INSPECTIONS];
            if (!hasAllInspectionsPermission)
                permittedShifts = W4_Funcs.getIDsFromAssetArray(W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_INSPECTIONS));
            for (let inspectionPlanOccurence of MainActivity.theCompany.getInspectionPlansCompletedList()) {
                var wasShownOnSystem = W4_Funcs.doNotificationsIncludeAnyID(MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_Inspection), inspectionPlanOccurence.getW4id());
                var wasClearedOnApp = W4_Funcs.doNotificationsIncludeAnyID(MainActivity.w4SaveState.getAppNotificationsMap().get(NotificationsManager.key_Inspection), inspectionPlanOccurence.getW4id());
                if (inspectionPlanOccurence.getPerson_inspector_id() != (MainActivity.currentPerson.getW4id()) && now.getMillis() - inspectionPlanOccurence.getDateTime() < MainActivity.NOTIFICATION_EXPIRATION_TIME && (!wasShownOnSystem || !wasClearedOnApp)) {
                    if (hasAllInspectionsPermission || permittedShifts.includes(inspectionPlanOccurence.getShiftID())) {
                        var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), inspectionPlanOccurence.getPerson_inspector_id());
                        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), inspectionPlanOccurence.getLocationID());
                        var below_expectations_points = 0;
                        for (var i = 0; i < inspectionPlanOccurence.getArea_names().length; ++i) {
                            for (let result1 of inspectionPlanOccurence.getResults()[i]) {
                                if (result1 == Asset.RESULT_BELOW) {
                                    ++below_expectations_points;
                                }
                            }
                            if (inspectionPlanOccurence.getResult()[i] == Asset.RESULT_BELOW) {
                                ++below_expectations_points;
                            }
                        }
                        if (below_expectations_points > 0) {
                            var text = "";
                            var title = "Inspection Completed";
                            if (person != null) {
                                title += " by " + person.getFirst_name() + " " + person.getLast_name();
                            }
                            if (location != null) {
                                if (person != null)
                                    title += " at ";
                                title += location.getName();
                            }
                            text += below_expectations_points + " areas are below expectations";
                            var intent = new Intent(HomeActivity.homeActivity, new ViewInspectionPlanCompleteActivity());
                            intent.putExtra("id", inspectionPlanOccurence.getW4id());
                            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            var save = new NotificationW4Save();
                            save.any_id = inspectionPlanOccurence.getW4id();
                            save.time = inspectionPlanOccurence.getDateTime();
                            MainActivity.w4SaveState.getSystemNotificationsMap().get(NotificationsManager.key_Inspection).push(save);
                            W4_Funcs.showNotification(MainActivity.mainActivity, -1, NotificationsManager.key_Inspection, title, text, intent, !wasShownOnSystem, !wasClearedOnApp, save);
                            saveStateModified = true;
                        }
                    }
                }
            }
            if (saveStateModified)
                MainActivity.saveState(7);
        }
    }
}
