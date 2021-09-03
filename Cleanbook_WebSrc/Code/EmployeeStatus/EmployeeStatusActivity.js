class EmployeeStatusActivity extends W4Activity {
    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Employee Status");
        a.setContentView(R.layout.activity_employee_status);
        var person_id = a.getIntent().getStringExtra("person_id");
        var shift_id = a.getIntent().getStringExtra("shift_id");
        var location_id = a.getIntent().getStringExtra("location_id");
        a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), person_id);
        a.selectedShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shift_id);
        a.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), location_id);
        if (a.selectedPerson == null || a.selectedShift == null || a.selectedLocation == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }

        var textView = a.findViewById("View_EmployeeStatus_Person_Text");
        textView.setText(a.selectedPerson.getFirst_name() + " " + a.selectedPerson.getLast_name());
        textView = a.findViewById("View_EmployeeStatus_Shift_Text");
        textView.setText(a.selectedShift.method_getFullName());
        textView = a.findViewById("View_EmployeeStatus_Clocked_Text");
        textView.setText(EmployeeStatusActivity.getBoolAndClockedText(a.selectedPerson, a.selectedShift)[1]);
    }

    static getBoolAndClockedText(selectedPerson, selectedShift) {
        var boolStatus = false;
        var latestPunch = W4_Funcs.getPersonLatestTimePunch(selectedPerson.getW4id(), selectedShift.getW4id());
        var now = new W4DateTime();
        var yesterday = W4_Funcs.getPrevDay(now);
        var clockedText = "";
        if (latestPunch != null) {
            //Is time punch closer to shift end time yesterday or shift start time today
            var timePunchDT = new W4DateTime(latestPunch.getTime());
            if (!latestPunch.getClockIn()) {
                boolStatus = false;
                clockedText += "<br>" + MainActivity.RED_CIRCLE + " Clocked Out " + W4_Funcs.getTimeText(timePunchDT) + " " + W4_Funcs.getFriendlyDayText(timePunchDT);
            }
            else {
                var shiftStartTime = new W4DateTime(selectedShift.getStartTime());
                var shiftEndTime = new W4DateTime(selectedShift.getEndTime());
                if (!selectedShift.method_doesShiftGoOvernight()) {
                    var shiftStartToday = W4_Funcs.getDSTSafeDateTime(now.getYear(), now.getMonthOfYear(), now.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                    var shiftEndYesterday = W4_Funcs.getDSTSafeDateTime(yesterday.getYear(), yesterday.getMonthOfYear(), yesterday.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                    var nowDiff = Math.abs(latestPunch.getTime() - shiftStartToday.getMillis());
                    var lastDiff = Math.abs(latestPunch.getTime() - shiftEndYesterday.getMillis());
                    if (lastDiff < nowDiff) {
                        boolStatus = false;
                        clockedText += "<br>" + MainActivity.RED_CIRCLE + " Last Clock In was " + W4_Funcs.getTimeText(timePunchDT) + " " + W4_Funcs.getFriendlyDayText(timePunchDT);
                    } else {
                        boolStatus = true;
                        clockedText += "<br>" + MainActivity.BLUE_CIRCLE + " Clocked In " + W4_Funcs.getTimeText(timePunchDT) + " " + W4_Funcs.getFriendlyDayText(timePunchDT);
                    }
                } else {
                    var startMinutes = shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour();
                    var endMinutes = shiftEndTime.getHourOfDay() * 60 + shiftEndTime.getMinuteOfHour();
                    var nowMinutes = now.getHourOfDay() * 60 + now.getMinuteOfHour();
                    var nowToStartDiff = Math.abs(startMinutes - nowMinutes);
                    var nowToEndDiff = Math.abs(endMinutes - nowMinutes);
                    var nowDiff = 0;
                    var lastDiff = 0;
                    if (nowToStartDiff < nowToEndDiff) {
                        var shiftEndToday = W4_Funcs.getDSTSafeDateTime(now.getYear(), now.getMonthOfYear(), now.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                        var shiftStartToday = W4_Funcs.getDSTSafeDateTime(now.getYear(), now.getMonthOfYear(), now.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                        nowDiff = Math.abs(latestPunch.getTime() - shiftStartToday.getMillis());
                        lastDiff = Math.abs(latestPunch.getTime() - shiftEndToday.getMillis());
                    }
                    else {
                        var shiftEndYesterday = W4_Funcs.getDSTSafeDateTime(yesterday.getYear(), yesterday.getMonthOfYear(), yesterday.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                        var shiftStartYesterday = W4_Funcs.getDSTSafeDateTime(yesterday.getYear(), yesterday.getMonthOfYear(), yesterday.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                        nowDiff = Math.abs(latestPunch.getTime() - shiftStartYesterday.getMillis());
                        lastDiff = Math.abs(latestPunch.getTime() - shiftEndYesterday.getMillis());
                    }
                    if (lastDiff < nowDiff) {
                        boolStatus = false;
                        clockedText += "<br>" + MainActivity.RED_CIRCLE + " Last Clock In was " + W4_Funcs.getTimeText(timePunchDT) + " " + W4_Funcs.getFriendlyDayText(timePunchDT);
                    } else {
                        boolStatus = true;
                        clockedText += "<br>" + MainActivity.BLUE_CIRCLE + " Clocked In " + W4_Funcs.getTimeText(timePunchDT) + " " + W4_Funcs.getFriendlyDayText(timePunchDT);
                    }
                }
            }
        }
        else {
            boolStatus = false;
            clockedText += "<br>" + MainActivity.RED_CIRCLE + " Clocked Out<br>This person has no time punches for this shift";
        }

        return [boolStatus, clockedText];
    }
}
