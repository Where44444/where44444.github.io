class ViewShiftActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View Shift");
        this.setContentView(R.layout.activity_view_shift_time);

        var events = [];
        var settings = { };
        var calendar_view = this.findViewById("View_ShiftTime_Calendar_RepeatSummary");
        caleandar(calendar_view.ele, events, settings);

        FireBaseListeners.tempShiftAddedPeopleIDs = [];
        this.selectedShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), this.getIntent().getStringExtra("id"));
        if (this.selectedShift == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            this.finish();
            return;
        }
        this.dateTimeStart = new W4DateTime(this.selectedShift.getStartTime());
        this.selectedCalendarDayStart = W4_Funcs.dateTimeToCalendarDay(this.dateTimeStart);
        this.dateTimeEnd = new W4DateTime(this.selectedShift.getEndTime());
        this.selectedCalendarDayEnd = W4_Funcs.dateTimeToCalendarDay(this.dateTimeEnd);
        this.dateTimeRepeatEndDate = new W4DateTime(this.selectedShift.getRepeatEndDate());

        this.findViewById("View_ShiftTime_Name").setText(this.selectedShift.getName());
        var locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SHIFTS);
        for (var i = 0; i < locationList.length; ++i) {
            if (locationList[i].getW4id() == (this.selectedShift.getLocationID())) {
                this.findViewById("View_ShiftTime_Location_Text").setText(locationList[i].getName());
                break;
            }
        }
        var timeText = "";
        var hourmod = this.dateTimeStart.getHourOfDay() % 12;
        if (hourmod == 0)
            hourmod = 12;
        timeText += hourmod + ":";
        if (this.dateTimeStart.getMinuteOfHour() < 10)
            timeText += "0";
        timeText += this.dateTimeStart.getMinuteOfHour();
        if (this.dateTimeStart.getHourOfDay() > 11)
            timeText += " PM";
        else
            timeText += " AM";
        timeText += " " + W4_Funcs.getFriendlyDayText(this.dateTimeStart);
        this.findViewById("View_ShiftTime_Start_Time").setText(timeText);
        var timeText = "";
        hourmod = this.dateTimeEnd.getHourOfDay() % 12;
        if (hourmod == 0)
            hourmod = 12;
        timeText += hourmod + ":";
        if (this.dateTimeEnd.getMinuteOfHour() < 10)
            timeText += "0";
        timeText += this.dateTimeEnd.getMinuteOfHour();
        if (this.dateTimeEnd.getHourOfDay() > 11)
            timeText += " PM";
        else
            timeText += " AM";
        timeText += " " + W4_Funcs.getFriendlyDayText(this.dateTimeEnd);
        this.findViewById("View_ShiftTime_End_Time").setText(timeText);

        if (this.selectedShift.getRepeatAmount() != 0)
            this.findViewById("View_ShiftTime_RepeatDiv").setVisibility(View.VISIBLE);
        else
            this.findViewById("View_ShiftTime_RepeatDiv").setVisibility(View.GONE);

        if ((MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS] && (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_PEOPLE] || MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_PEOPLE]))
            || MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_SHIFTS] && MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_PEOPLE]) {
            this.findViewById("View_ShiftTime_Permissions_Warning_Text").setVisibility(View.GONE);
            var assignedText = this.findViewById("View_ShiftTime_Assigned_Text");
            assignedText.setVisibility(View.VISIBLE);
            if (this.selectedShift.getPersonIDList().length > 0)
                assignedText.setText("Assigned");
            else
                assignedText.setText("No one Assigned");
            this.findViewById("View_ShiftTime_Add_Person_List").setVisibility(View.VISIBLE);
            for (let personID of this.selectedShift.getPersonIDList()) {
                var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), personID);
                if (person != null) {
                    var linearLayout = this.findViewById("View_ShiftTime_Add_Person_List");
                    linearLayout.addView(ViewShiftActivity.getAddedShiftPersonView(this, this, person.getFirst_name() + " " + person.getLast_name(), person.getW4id()));
                    FireBaseListeners.tempShiftAddedPeopleIDs.push(person.getW4id());
                }
            }
        }
        else { //Doesn't have permission to view all people that may be on this shift
            var warningText = this.findViewById("View_ShiftTime_Permissions_Warning_Text");
            warningText.setVisibility(View.VISIBLE);
            warningText.setText("⚠ You don't have permission to view the People assigned to this Shift.");
            this.findViewById("View_ShiftTime_Assigned_Text").setVisibility(View.GONE);
            this.findViewById("View_ShiftTime_Add_Person_List").setVisibility(View.GONE);
        }

        calendar_view.addEventListener("click", function () {
            a.redecorateRepeatSummaryCalendar();
        });

        this.updateViewRepeatSummaryText();
        this.updateViewStartEndTime();
    }

    updateViewStartEndTime() {
        var startTime = new W4DateTime(this.selectedShift.getStartTime());
        var endTime = new W4DateTime(this.selectedShift.getEndTime());
        this.dateTimeStartExists = W4_Funcs.doesTimeExist(this.selectedCalendarDayStart, startTime.getHourOfDay(), startTime.getMinuteOfHour(), 0);
        this.dateTimeEndExists = W4_Funcs.doesTimeExist(this.selectedCalendarDayEnd, endTime.getHourOfDay(), endTime.getMinuteOfHour(), 0);
        this.dateTimeStartTest = W4_Funcs.calendarDayToDateTime(this.selectedCalendarDayStart, startTime.getHourOfDay(), startTime.getMinuteOfHour(), 0);
        this.dateTimeEndTest = W4_Funcs.calendarDayToDateTime(this.selectedCalendarDayEnd, endTime.getHourOfDay(), endTime.getMinuteOfHour(), 0);
        this.dateTimeStart = this.dateTimeStartTest;
        this.dateTimeEnd = this.dateTimeEndTest;
    }

    updateViewRepeatSummaryText() {
        var summary = "Every";
        var repeatUnit = this.selectedShift.getRepeatUnit();
        var repeatAmount = this.selectedShift.getRepeatAmount();
        if (repeatAmount < 1)
            repeatAmount = 1;
        switch (repeatUnit) {
            case Shift.REPEATUNIT_DAILY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " days";
                else
                    summary += " day";
                break;
            case Shift.REPEATUNIT_WEEKLY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " weeks";
                else
                    summary += " week";
                var weeklyRepeatDays = this.selectedShift.getWeeklyRepeatDays();
                var lastDay = -1;
                var secondToLastDay = -1;
                var numDays = 0;
                for (var i = 0; i < 7; ++i) {
                    if (weeklyRepeatDays[i]) {
                        secondToLastDay = lastDay;
                        lastDay = i;
                        ++numDays;
                    }
                }
                if (numDays != 0) {
                    summary += " on";
                    for (var i = 0; i < 7; ++i) {
                        if (weeklyRepeatDays[i]) {
                            if (lastDay == i && numDays > 1)
                                summary += " and";
                            summary += " " + Asset.intToDayOfWeek[i];
                            if (lastDay != i && secondToLastDay != i)
                                summary += ",";
                        }
                    }
                }
                break;
            case Shift.REPEATUNIT_MONTHLY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " months";
                else
                    summary += " month";
                var monthlyRepeatType = this.selectedShift.getMonthlyRepeatType();
                //this.dateTimeStart
                if (monthlyRepeatType == Shift.MONTHLYREPEATTYPE_DAYOFWEEK) {
                    summary += " on the";
                    var dayOfMonth = this.dateTimeStart.getDayOfMonth() - 1; // 1 - 31
                    var xthDayOfMonth = Math.floor((dayOfMonth - (dayOfMonth % 7)) / 7) + 1;
                    if (xthDayOfMonth == 1)
                        summary += " first";
                    else if (xthDayOfMonth == 2)
                        summary += " second";
                    else if (xthDayOfMonth == 3)
                        summary += " third";
                    else if (xthDayOfMonth == 4)
                        summary += " fourth";
                    else
                        summary += " fifth";

                    summary += " " + Asset.intToDayOfWeek[this.dateTimeStart.getDayOfWeek()];
                }
                break;
            case Shift.REPEATUNIT_YEARLY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " years";
                else
                    summary += " year";
                break;
        }

        var endUnit = this.selectedShift.getEndUnit();
        var repeatEndOccurences = this.selectedShift.getRepeatEndOccurences();
        if (repeatEndOccurences < 1)
            repeatEndOccurences = 1;

        if (endUnit == Shift.ENDUNIT_OCCURENCES) {
            summary += " and ends after " + repeatEndOccurences;
            if (repeatEndOccurences == 1)
                summary += " occurence";
            else
                summary += " occurences";
        }
        else if (endUnit == Shift.ENDUNIT_ONDATE) {
            var date = Asset.intToMonth[this.dateTimeRepeatEndDate.getMonthOfYear()] + " " + this.dateTimeRepeatEndDate.getDayOfMonth() + ", " + this.dateTimeRepeatEndDate.getYear();
            summary += " until " + date;
        }

        if (repeatUnit == Shift.REPEATUNIT_MONTHLY || repeatUnit == Shift.REPEATUNIT_YEARLY)
            summary += "<br><br>⚠ If this repetition causes the shift to fall on a date that doesn't exist (e.g. 29th of February 2021), the shift will be moved to the last day of the month";

        this.findViewById("View_ShiftTime_RepeatSummary_Text").setText(summary);
        this.redecorateRepeatSummaryCalendar();
    }

    redecorateRepeatSummaryCalendar() {
        var calendar_ele = this.findViewById("View_ShiftTime_Calendar_RepeatSummary").ele;
        var dayList = calendar_ele.children[0].children[2];
        var title = calendar_ele.children[0].children[0].children[1].innerHTML;
        var dt = W4_Funcs.getDateTimeFromCalendarTitle(title);
        var firstDayOfWeek = dt.getDayOfWeek();
        for (var i = 0; i < firstDayOfWeek; ++i) {
            dt = W4_Funcs.getPrevDay(dt);
        }

        for (var i = 0; i < dayList.children.length; ++i) {
            if (W4_Funcs.doesRepeatingDateOccurOnDay(this.selectedShift, dt, 0)) {
                dayList.children[i].style.backgroundColor = "#FF006E";
                dayList.children[i].style.color = "white";
            }
            else {
                dayList.children[i].style.backgroundColor = "";
                dayList.children[i].style.color = "";
            }
            dt = W4_Funcs.getNextDay(dt);
        }
    }

    static getAddedShiftPersonView(context, activity, name0, personID) {
        var textViewPerson = new View(W4_Funcs.createElementFromHTML("<div style='width: 100%; text-align: center;'></div>"), activity);
        textViewPerson.setText(name0);
        return textViewPerson;
    }
}
