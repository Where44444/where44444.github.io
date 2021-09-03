class W4AlarmManager {
    static alarmStarted = false;

    static startAlarmManager(context) {
        if (!W4AlarmManager.alarmStarted) {
            W4AlarmManager.alarmStarted = true;

            var func0 = function () {
                W4AlarmManager.onReceive(context, null);
                setTimeout(function () {
                    func0();
                }, 60000);
            }
            func0();
        }
    }
    static notificationID = 0;

    static onReceive(context, intent) {
        //Check for upcoming shifts
        console.log("Alarm Ran");
        if (MainActivity.mainActivity.loggedIn && MainActivity.allDatabaseDownloaded) {
            //            if(MainActivity.mainActivity != null && MainActivity.mainActivity.mBoundService != null){
            //                MainActivity.mainActivity.mBoundService.requestPersonLocationForDB(MainActivity.mainActivity);
            //            }
            if (HomeActivity.homeActivity != null) {
                HomeActivity.homeActivity.setEmployeeStatusButton();
            }

            //Check for upcoming shifts
            var now = new W4DateTime();
            for (let shift of W4_Funcs.getAssignedShifts(MainActivity.currentPerson.getW4id())) {
                if (W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, now, false, 0) == Shift.OCCURS_FIRST_DAY) {
                    var shiftStartTimeToday = W4_Funcs.getShiftStartTimeOnDay(shift.getStartTime(), now);
                    var millisTillStart = shiftStartTimeToday.getMillis() - now.getMillis();
                    if (millisTillStart > TimeUnit.MINUTES.toMillis(14) && millisTillStart <= TimeUnit.MINUTES.toMillis(15)) { //Should be 14 to 15!
                        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                        var text;
                        if (location != null)
                            text = "You have a shift at " + location.getName() + " starting soon at " + W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime()));
                        else
                            text = "You have a shift starting soon at " + W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime()));
                        var title = "Shift Starting Soon";
                        W4_Funcs.showNotification(MainActivity.mainActivity, W4AlarmManager.notificationID, -1, title, text, null, true, true, null);
                        ++W4AlarmManager.notificationID;
                    }
                }
            }

            //Check for late tasks
            var taskSheetOccurences = W4_Funcs.getTodaysIncompleteTaskSheets(MainActivity.currentPerson.getW4id());
            for (let taskSheetOccurence of taskSheetOccurences) {
                var taskDay = new W4DateTime(taskSheetOccurence.getStartedDateTime());
                taskDay = W4_Funcs.getDSTSafeDateTime(taskDay.getYear(), taskDay.getMonthOfYear(), taskDay.getDayOfMonth(), 0, 0, 0);
                var mainTimes = taskSheetOccurence.method_findMainTaskTimes();
                var completes = taskSheetOccurence.getTimesCompleted();
                var startTaskSheetTime = null;
                if (mainTimes.length > 0) {
                    startTaskSheetTime = new W4DateTime(mainTimes[0]);
                }
                for (var i = 0; i < mainTimes.length; ++i) {
                    if (completes[i] == -1) {
                        var goalTime = new W4DateTime(mainTimes[i]);
                        var daysBetween = Days.daysBetween(startTaskSheetTime, goalTime).getDays();
                        var taskDayCurrent = new W4DateTime(taskDay.getMillis());
                        for (var d = 0; d < daysBetween; ++d) {
                            taskDayCurrent = W4_Funcs.getNextDay(taskDayCurrent);
                        }
                        goalTime = W4_Funcs.getDSTSafeDateTime(taskDayCurrent.getYear(), taskDayCurrent.getMonthOfYear(), taskDayCurrent.getDayOfMonth(), goalTime.getHourOfDay(), goalTime.getMinuteOfHour(), 0);
                        var diff = TimeUnit.MILLISECONDS.toMinutes(now.getMillis() - goalTime.getMillis());
                        if (diff == 1) {
                            var title = "Late Task";
                            var text = "You are late on finishing " + taskSheetOccurence.getTasks()[i] + " by " + W4_Funcs.getTimeText(goalTime);
                            W4_Funcs.showNotification(MainActivity.mainActivity, W4AlarmManager.notificationID, -1, title, text, null, true, true, null);
                            ++W4AlarmManager.notificationID;
                        }
                    }
                }
            }
        }
    }
}
