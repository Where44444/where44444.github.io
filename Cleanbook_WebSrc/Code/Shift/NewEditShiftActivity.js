class NewEditShiftActivity extends W4Activity {

    // Shift this.selectedShift;
    // var this.selectedCalendarDayStart = null;
    // var this.selectedCalendarDayEnd = null;
    // var this.dateTimeStart = null;
    // var this.dateTimeEnd = null;
    // var this.dateTimeRepeatEndDate = null;
    // var this.dateTimeStartExists = true;
    // var this.dateTimeEndExists = true;
    // var this.previewShift = null;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_shift_time);

        var events = [];
        var settings = { };
        var calendar_view = this.findViewById("Edit_ShiftTime_Calendar_RepeatSummary");
        caleandar(calendar_view.ele, events, settings);

        var shift_id = a.getIntent().getStringExtra("id");
        a.newShift = (shift_id == null);

        if (a.newShift) {
            a.getSupportActionBar().setTitle("New Shift");
            var startMillis = a.getIntent().getLongExtra("startTime", (new W4DateTime()).getMillis());
            var endMillis = startMillis + TimeUnit.HOURS.toMillis(1);
            a.selectedShift = new Shift();
            a.selectedShift.setStartTime(startMillis);
            a.selectedShift.setEndTime(endMillis);
            a.selectedShift.setRepeatEndDate(startMillis);
            var dayOfWeek = new W4DateTime(a.selectedShift.getStartTime()).getDayOfWeek();
            a.selectedShift.getWeeklyRepeatDays()[dayOfWeek] = true;
            let reffShift = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SHIFTS).push();
            a.selectedShift.setW4id(reffShift.key);
            a.findViewById("Delete_Edit_ShiftTime").setVisibility(View.GONE);
        }
        else {
            a.getSupportActionBar().setTitle("Edit Shift");
            a.selectedShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shift_id)
        }

        FireBaseListeners.tempShiftAddedPeopleIDs = [];

        if (a.selectedShift == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        a.dateTimeStart = new W4DateTime(a.selectedShift.getStartTime());
        a.selectedCalendarDayStart = W4_Funcs.dateTimeToCalendarDay(a.dateTimeStart);
        a.dateTimeEnd = new W4DateTime(a.selectedShift.getEndTime());
        a.selectedCalendarDayEnd = W4_Funcs.dateTimeToCalendarDay(a.dateTimeEnd);
        a.dateTimeRepeatEndDate = new W4DateTime(a.selectedShift.getRepeatEndDate());

        a.findViewById("Edit_ShiftTime_Name").setText(a.selectedShift.getName());
        var locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SHIFTS);
        var spinner = a.findViewById("Edit_ShiftTime_Location_Spinner");
        var spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, W4_Funcs.getLocationNames(locationList)
        );
        spinner.setAdapter(spinnerArrayAdapter);
        for (var i = 0; i < locationList.length; ++i) {
            if (locationList[i].getW4id() == (a.selectedShift.getLocationID())) {
                spinner.setSelection(i);
                break;
            }
        }
        var timeChangeListener = function () {
            a.updateEditStartEndTime();
        };
        var spinner = a.findViewById("Edit_ShiftTime_Start_Hours_Spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item_right_align, Shift.HOURS
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(a.dateTimeStart.getHourOfDay() % 12);
        spinner.addEventListener("change", timeChangeListener);
        spinner = a.findViewById("Edit_ShiftTime_Start_Minutes_Spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Shift.MINUTES
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(Math.floor(a.dateTimeStart.getMinuteOfHour() / 5));
        spinner.addEventListener("change", timeChangeListener);
        spinner = a.findViewById("Edit_ShiftTime_Start_AM_PM_Spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Shift.AM_PM
        );
        spinner.setAdapter(spinnerArrayAdapter);
        if (a.dateTimeStart.getHourOfDay() > 11)
            spinner.setSelection(1);
        else
            spinner.setSelection(0);
        spinner.addEventListener("change", timeChangeListener);
        var button = a.findViewById("Edit_ShiftTime_Start_Date_Button");
        a.setStartDateButton(a.dateTimeStart);
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.selectedCalendarDayStart.getYear());
            intent.putExtra("dMonth", a.selectedCalendarDayStart.getMonthOfYear());
            intent.putExtra("dDay", a.selectedCalendarDayStart.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeEditShiftTimeStartCalendar);
        });
        spinner = a.findViewById("Edit_ShiftTime_End_Hours_Spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item_right_align, Shift.HOURS
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(a.dateTimeEnd.getHourOfDay() % 12);
        spinner.addEventListener("change", timeChangeListener);
        spinner = a.findViewById("Edit_ShiftTime_End_Minutes_Spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Shift.MINUTES
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection((a.dateTimeEnd.getMinuteOfHour() / 5));
        spinner.addEventListener("change", timeChangeListener);
        spinner = a.findViewById("Edit_ShiftTime_End_AM_PM_Spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Shift.AM_PM
        );
        spinner.setAdapter(spinnerArrayAdapter);
        if (a.dateTimeEnd.getHourOfDay() > 11)
            spinner.setSelection(1);
        else
            spinner.setSelection(0);
        spinner.addEventListener("change", timeChangeListener);
        button = a.findViewById("Edit_ShiftTime_End_Date_Button");
        a.setEndDateButton(a.dateTimeEnd);
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.selectedCalendarDayEnd.getYear());
            intent.putExtra("dMonth", a.selectedCalendarDayEnd.getMonthOfYear());
            intent.putExtra("dDay", a.selectedCalendarDayEnd.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeEditShiftTimeEndCalendar);
        });
        var checkBox = a.findViewById("Edit_ShiftTime_RepeatCheckBox");
        checkBox.setChecked(a.selectedShift.getRepeatAmount() != 0);
        if (checkBox.isChecked())
            a.findViewById("Edit_ShiftTime_RepeatDiv").setVisibility(View.VISIBLE);
        else
            a.findViewById("Edit_ShiftTime_RepeatDiv").setVisibility(View.GONE);
        checkBox.addEventListener("click", function () {
            if (checkBox.isChecked()) {
                a.findViewById("Edit_ShiftTime_RepeatDiv").setVisibility(View.VISIBLE);
                a.findViewById("Edit_Shift_Time_RepeatEvery").setValue("1");
            } else {
                a.findViewById("Edit_ShiftTime_RepeatDiv").setVisibility(View.GONE);
                a.findViewById("Edit_Shift_Time_RepeatEvery").setValue("0");
            }
        });
        var spinner = a.findViewById("Edit_ShiftTime_RepeatUnit");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Shift.REPEAT_UNITS
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(a.selectedShift.getRepeatUnit());
        var spinnerFunc = function () {
            var position = spinner.getSelectedItemPosition();
            switch (position) {
                case Shift.REPEATUNIT_DAILY:
                    a.findViewById("Edit_ShiftTime_RadioGroup_MonthlyType").setVisibility(View.GONE);
                    a.findViewById("Edit_ShiftTime_RepeatDaysDiv").setVisibility(View.GONE);
                    break;
                case Shift.REPEATUNIT_WEEKLY:
                    a.findViewById("Edit_ShiftTime_RadioGroup_MonthlyType").setVisibility(View.GONE);
                    a.findViewById("Edit_ShiftTime_RepeatDaysDiv").setVisibility(View.VISIBLE);
                    break;
                case Shift.REPEATUNIT_MONTHLY:
                    a.findViewById("Edit_ShiftTime_RadioGroup_MonthlyType").setVisibility(View.VISIBLE);
                    a.findViewById("Edit_ShiftTime_RepeatDaysDiv").setVisibility(View.GONE);
                    break;
                case Shift.REPEATUNIT_YEARLY:
                    a.findViewById("Edit_ShiftTime_RadioGroup_MonthlyType").setVisibility(View.GONE);
                    a.findViewById("Edit_ShiftTime_RepeatDaysDiv").setVisibility(View.GONE);
                    break;
            }
            a.setRepeatEveryUnitLabel();
            a.updateEdit_RepeatSummaryText();
        }
        spinner.addEventListener("change", spinnerFunc);
        spinnerFunc();

        var button = a.findViewById("Edit_Shift_Time_RepeatEvery_Minus");
        button.addEventListener("click", function () {
            var editText = a.findViewById("Edit_Shift_Time_RepeatEvery");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            if (value > 1)
                --value;
            else
                value = 1;
            editText.setValue(value + "");
            a.setRepeatEveryUnitLabel();
            a.updateEdit_RepeatSummaryText();
        });
        var editText = a.findViewById("Edit_Shift_Time_RepeatEvery");
        editText.setValue(a.selectedShift.getRepeatAmount() + "");
        editText.addEventListener('keyup', function () {
            a.setRepeatEveryUnitLabel();
            a.updateEdit_RepeatSummaryText();
        });
        var button = a.findViewById("Edit_Shift_Time_RepeatEvery_Plus");
        button.addEventListener("click", function () {
            var editText = a.findViewById("Edit_Shift_Time_RepeatEvery");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            ++value;
            editText.setValue(value + "");
            a.setRepeatEveryUnitLabel();
            a.updateEdit_RepeatSummaryText();
        });
        var updateSummaryTextListener = function () {
            a.updateEdit_RepeatSummaryText();
        };

        a.findViewById("Edit_ShiftTime_Radio_DayOfMonth").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Radio_DayOfWeek").addEventListener("click", updateSummaryTextListener);
        if (a.selectedShift.getMonthlyRepeatType() == Shift.MONTHLYREPEATTYPE_DAYOFMONTH)
            a.findViewById("Edit_ShiftTime_Radio_DayOfMonth").setChecked(true);
        else
            a.findViewById("Edit_ShiftTime_Radio_DayOfWeek").setChecked(true);

        a.findViewById("Edit_ShiftTime_Repeat_Sunday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Monday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Tuesday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Wednesday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Thursday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Friday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Saturday").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Repeat_Sunday").setChecked(a.selectedShift.getWeeklyRepeatDays()[0]);
        a.findViewById("Edit_ShiftTime_Repeat_Monday").setChecked(a.selectedShift.getWeeklyRepeatDays()[1]);
        a.findViewById("Edit_ShiftTime_Repeat_Tuesday").setChecked(a.selectedShift.getWeeklyRepeatDays()[2]);
        a.findViewById("Edit_ShiftTime_Repeat_Wednesday").setChecked(a.selectedShift.getWeeklyRepeatDays()[3]);
        a.findViewById("Edit_ShiftTime_Repeat_Thursday").setChecked(a.selectedShift.getWeeklyRepeatDays()[4]);
        a.findViewById("Edit_ShiftTime_Repeat_Friday").setChecked(a.selectedShift.getWeeklyRepeatDays()[5]);
        a.findViewById("Edit_ShiftTime_Repeat_Saturday").setChecked(a.selectedShift.getWeeklyRepeatDays()[6]);

        a.findViewById("Edit_ShiftTime_Radio_Never").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Radio_AfterOccurences").addEventListener("click", updateSummaryTextListener);
        a.findViewById("Edit_ShiftTime_Radio_OnDate").addEventListener("click", updateSummaryTextListener);
        if (a.selectedShift.getEndUnit() == Shift.ENDUNIT_NEVER)
            a.findViewById("Edit_ShiftTime_Radio_Never").setChecked(true);
        else if (a.selectedShift.getEndUnit() == Shift.ENDUNIT_OCCURENCES)
            a.findViewById("Edit_ShiftTime_Radio_AfterOccurences").setChecked(true);
        else
            a.findViewById("Edit_ShiftTime_Radio_OnDate").setChecked(true);
        var button = a.findViewById("Edit_Shift_Time_Occurences_Minus");
        button.addEventListener("click", function () {
            var editText = a.findViewById("Edit_ShiftTime_RepeatOccurences");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            if (value > 1)
                --value;
            else
                value = 1;
            editText.setValue(value + "");
            a.updateEdit_RepeatSummaryText();
        });
        var editText = a.findViewById("Edit_ShiftTime_RepeatOccurences");
        editText.setValue(a.selectedShift.getRepeatEndOccurences() + "");
        editText.addEventListener('keyup', function () {
            a.updateEdit_RepeatSummaryText();
        });
        var button = a.findViewById("Edit_Shift_Time_Occurences_Plus");
        button.addEventListener("click", function () {
            var editText = a.findViewById("Edit_ShiftTime_RepeatOccurences");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            ++value;
            editText.setValue(value + "");
            a.updateEdit_RepeatSummaryText();
        });
        var button = a.findViewById("Edit_ShiftTime_Add_Person");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ViewPeopleListActivity());
            intent.putExtra("intentReturnPersonPos", true);
            a.startActivityForResult(intent, MainActivity.requestCodeGetPersonForShift);
        });
        var button = a.findViewById("Cancel_Edit_ShiftTime");
        button.addEventListener("click", function () {
            a.setResult(AppCompatActivity.RESULT_CANCELED);
            a.finish();
        });
        var button = a.findViewById("Accept_Edit_ShiftTime");
        button.addEventListener("click", function () {
            //Selected date is null when calendar is first created
            a.updateEditStartEndTime();
            if (a.dateTimeStartExists && a.dateTimeEndExists) {
                if (a.dateTimeEnd.getMillis() > a.dateTimeStart.getMillis()) {
                    if (!W4_Funcs.isDiffMoreThan24Hours(a.dateTimeStart, a.dateTimeEnd)) {
                        var reffShift = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SHIFTS).child(a.selectedShift.getW4id());
                        var shift = a.updateShift(reffShift.key);
                        if (a.newShift) {
                            W4_Funcs.writeToDB(reffShift, shift, "New Shift " + shift.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(shift.getLocationID()) + "|");
                            MainActivity.w4Toast(a, "Successfully added new Shift", Toast.LENGTH_LONG);
                        }
                        else {
                            W4_Funcs.writeToDB(reffShift, shift, "Edited Shift " + shift.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(shift.getLocationID()) + "|");
                            MainActivity.w4Toast(a, "Successfully edited Shift", Toast.LENGTH_LONG);
                        }
                        a.finish();
                    } else {
                        MainActivity.dialogBox(a, "⚠ Warning", "Shift cannot be longer than 24 hours!");
                    }
                } else {
                    MainActivity.dialogBox(a, "⚠ Warning", "End day and time can't occur before start day and time!");
                }
            } else {
                if (!a.dateTimeStartExists) {
                    MainActivity.dialogBox(a, "⚠ Warning", "Start time doesn't exist because of Daylight Savings Time!");
                } else {
                    MainActivity.dialogBox(a, "⚠ Warning", "End time doesn't exist because of Daylight Savings Time!");
                }
            }
        });
        var button = a.findViewById("Edit_Shift_Repeat_EndOnDate");
        a.setRepeatEndOnDateButton();
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            var calendarDay = W4_Funcs.dateTimeToCalendarDay(a.dateTimeRepeatEndDate);
            intent.putExtra("dYear", calendarDay.getYear());
            intent.putExtra("dMonth", calendarDay.getMonthOfYear());
            intent.putExtra("dDay", calendarDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeEditShiftTimeEndRepeatCalendar);
        });
        var button = a.findViewById("Delete_Edit_ShiftTime");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ConfirmActivity());
            intent.putExtra("description", "Are you sure you want to delete this Shift? All Associated Tasks, Inspection Plans, and Time Punches will also be deleted.");
            a.startActivityForResult(intent, MainActivity.requestCodeShiftDelete);
        });

        if (a.selectedShift.getPersonIDList() != null) {
            var linearLayout = a.findViewById("Edit_ShiftTime_Add_Person_List");
            for (let personID of a.selectedShift.getPersonIDList()) {
                for (let person of MainActivity.theCompany.getPersonList()) {
                    if (personID == (person.getW4id())) {
                        linearLayout.addView(NewEditShiftActivity.getAddedShiftPersonView(this, this, person.getFirst_name() + " " + person.getLast_name(), person.getW4id()));
                        FireBaseListeners.tempShiftAddedPeopleIDs.push(person.getW4id());
                        break;
                    }
                }
            }
        }

        calendar_view.addEventListener("click", function () {
            a.redecorateRepeatSummaryCalendar();
        });

        a.updateEdit_RepeatSummaryText();
        a.updateEditStartEndTime();
    }

    redecorateRepeatSummaryCalendar() {
        var calendar_ele = this.findViewById("Edit_ShiftTime_Calendar_RepeatSummary").ele;
        var dayList = calendar_ele.children[0].children[2];

        var title = calendar_ele.children[0].children[0].children[1].innerHTML;
        var dt = W4_Funcs.getDateTimeFromCalendarTitle(title);
        var firstDayOfWeek = dt.getDayOfWeek();
        for (var i = 0; i < firstDayOfWeek; ++i) {
            dt = W4_Funcs.getPrevDay(dt);
        }

        for (var i = 0; i < dayList.children.length; ++i) {
            if (W4_Funcs.doesRepeatingDateOccurOnDay(this.previewShift, dt, 0)) {
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

    setStartDateButton(dateTime) {
        var button = this.findViewById("Edit_ShiftTime_Start_Date_Button");
        var text = Asset.intToDayOfWeek3Letter[dateTime.getDayOfWeek()] + " " + W4_Funcs.getFriendlyDateText(dateTime);
        button.setText(text);
    }

    setEndDateButton(dateTime) {
        var button = this.findViewById("Edit_ShiftTime_End_Date_Button");
        var text = Asset.intToDayOfWeek3Letter[dateTime.getDayOfWeek()] + " " + W4_Funcs.getFriendlyDateText(dateTime);
        button.setText(text);
    }

    setRepeatEndOnDateButton() {
        var button = this.findViewById("Edit_Shift_Repeat_EndOnDate");
        var text = Asset.intToDayOfWeek3Letter[this.dateTimeRepeatEndDate.getDayOfWeek()] + " " + W4_Funcs.getFriendlyDateText(this.dateTimeRepeatEndDate);
        button.setText(text);
    }

    updateEditStartEndTime() {
        var ampmmultStart = this.findViewById("Edit_ShiftTime_Start_AM_PM_Spinner").getSelectedItemPosition();
        var hourStart = this.findViewById("Edit_ShiftTime_Start_Hours_Spinner").getSelectedItemPosition() + (12 * ampmmultStart);
        var minuteStart = this.findViewById("Edit_ShiftTime_Start_Minutes_Spinner").getSelectedItemPosition() * 5;
        var ampmmultEnd = this.findViewById("Edit_ShiftTime_End_AM_PM_Spinner").getSelectedItemPosition();
        var hourEnd = this.findViewById("Edit_ShiftTime_End_Hours_Spinner").getSelectedItemPosition() + (12 * ampmmultEnd);
        var minuteEnd = this.findViewById("Edit_ShiftTime_End_Minutes_Spinner").getSelectedItemPosition() * 5;
        this.dateTimeStartExists = W4_Funcs.doesTimeExist(this.selectedCalendarDayStart, hourStart, minuteStart, 0);
        this.dateTimeEndExists = W4_Funcs.doesTimeExist(this.selectedCalendarDayEnd, hourEnd, minuteEnd, 0);
        this.dateTimeStartTest = W4_Funcs.calendarDayToDateTime(this.selectedCalendarDayStart, hourStart, minuteStart, 0);
        this.dateTimeEndTest = W4_Funcs.calendarDayToDateTime(this.selectedCalendarDayEnd, hourEnd, minuteEnd, 0);
        this.dateTimeStart = this.dateTimeStartTest;
        this.dateTimeEnd = this.dateTimeEndTest;
    }

    updateShift(id) {
        var name0 = this.findViewById("Edit_ShiftTime_Name").getText();
        if (name0 == ("")) {
            name0 = "Shift " + (MainActivity.theCompany.getShiftList().length + 1);
        }
        var repeatAmount = W4_Funcs.getIntFromEditText(this.findViewById("Edit_Shift_Time_RepeatEvery"), 1);
        if (repeatAmount < 1)
            repeatAmount = 1;
        if (!this.findViewById("Edit_ShiftTime_RepeatCheckBox").isChecked())
            repeatAmount = 0;
        var repeatUnit = this.findViewById("Edit_ShiftTime_RepeatUnit").getSelectedItemPosition();
        var endUnit = Shift.ENDUNIT_NEVER;
        if (this.findViewById("Edit_ShiftTime_Radio_Never").isChecked())
            endUnit = Shift.ENDUNIT_NEVER;
        else if (this.findViewById("Edit_ShiftTime_Radio_AfterOccurences").isChecked())
            endUnit = Shift.ENDUNIT_OCCURENCES;
        else if (this.findViewById("Edit_ShiftTime_Radio_OnDate").isChecked())
            endUnit = Shift.ENDUNIT_ONDATE;
        var repeatEndOccurences = W4_Funcs.getIntFromEditText(this.findViewById("Edit_ShiftTime_RepeatOccurences"), 1);
        if (repeatEndOccurences < 1)
            repeatEndOccurences = 1;
        var repeatEndDate = this.dateTimeRepeatEndDate.getMillis();
        var weeklyRepeatDays = [];
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Sunday").isChecked());
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Monday").isChecked());
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Tuesday").isChecked());
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Wednesday").isChecked());
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Thursday").isChecked());
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Friday").isChecked());
        weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Saturday").isChecked());
        var monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
        if (this.findViewById("Edit_ShiftTime_Radio_DayOfMonth").isChecked())
            monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
        else
            monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFWEEK;
        //tempAddedShiftPeopleIDS
        var locationID = "";
        var locationPos = this.findViewById("Edit_ShiftTime_Location_Spinner").getSelectedItemPosition();
        if (locationPos != -1) {
            locationID = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SHIFTS)[locationPos].getW4id();
        }
        var color = this.selectedShift.getColor();
        return new Shift(id, name0, this.dateTimeStart.getMillis(), this.dateTimeEnd.getMillis(), repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType, FireBaseListeners.tempShiftAddedPeopleIDs, locationID, color);
    }

    updateEdit_RepeatSummaryText() {
        var summary = "Every";
        var repeatUnit = this.findViewById("Edit_ShiftTime_RepeatUnit").getSelectedItemPosition();
        var repeatAmount = W4_Funcs.getIntFromEditText(this.findViewById("Edit_Shift_Time_RepeatEvery"), 1);
        if (repeatAmount < 1)
            repeatAmount = 1;
        var suffix = "";
        if (repeatAmount != 1)
            suffix = "s";
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
                var weeklyRepeatDays = [];
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Sunday").isChecked());
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Monday").isChecked());
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Tuesday").isChecked());
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Wednesday").isChecked());
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Thursday").isChecked());
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Friday").isChecked());
                weeklyRepeatDays.push(this.findViewById("Edit_ShiftTime_Repeat_Saturday").isChecked());
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
                var monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
                if (this.findViewById("Edit_ShiftTime_Radio_DayOfMonth").isChecked())
                    monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
                else
                    monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFWEEK;
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

        var endUnit = Shift.ENDUNIT_NEVER;
        if (this.findViewById("Edit_ShiftTime_Radio_Never").isChecked())
            endUnit = Shift.ENDUNIT_NEVER;
        else if (this.findViewById("Edit_ShiftTime_Radio_AfterOccurences").isChecked())
            endUnit = Shift.ENDUNIT_OCCURENCES;
        else if (this.findViewById("Edit_ShiftTime_Radio_OnDate").isChecked())
            endUnit = Shift.ENDUNIT_ONDATE;
        var repeatEndOccurences = W4_Funcs.getIntFromEditText(this.findViewById("Edit_ShiftTime_RepeatOccurences"), 1);
        if (repeatEndOccurences < 1)
            repeatEndOccurences = 1;

        if (endUnit == Shift.ENDUNIT_OCCURENCES) {
            summary += " and ends after " + repeatEndOccurences;
            if (repeatEndOccurences == 1)
                summary += " occurence";
            else
                summary += " occurences";
        } else if (endUnit == Shift.ENDUNIT_ONDATE) {
            var date = Asset.intToMonth[this.dateTimeRepeatEndDate.getMonthOfYear()] + " " + this.dateTimeRepeatEndDate.getDayOfMonth() + ", " + this.dateTimeRepeatEndDate.getYear();
            summary += " until " + date;
        }

        if (repeatUnit == Shift.REPEATUNIT_MONTHLY || repeatUnit == Shift.REPEATUNIT_YEARLY)
            summary += "<br><br>⚠ If this repetition causes the shift to fall on a date that doesn't exist (e.g. 29th of February 2021), the shift will be moved to the last day of the month";

        this.findViewById("Edit_ShiftTime_RepeatSummary_Text").setText(summary);
        this.previewShift = this.updateShift("");
        this.redecorateRepeatSummaryCalendar();
    }

    setRepeatEveryUnitLabel() {
        var textView = this.findViewById("Edit_ShiftTime_RepeatEvery_Unit");
        var value = W4_Funcs.getIntFromEditText(this.findViewById("Edit_Shift_Time_RepeatEvery"), 1); //Change default to 0 to test app crashing
        var position = this.findViewById("Edit_ShiftTime_RepeatUnit").getSelectedItemPosition();
        var suffix = "";
        if (value != 1)
            suffix = "s";
        switch (position) {
            case Shift.REPEATUNIT_DAILY:
                textView.setText("Day" + suffix);
                break;
            case Shift.REPEATUNIT_WEEKLY:
                textView.setText("Week" + suffix);
                break;
            case Shift.REPEATUNIT_MONTHLY:
                textView.setText("Month" + suffix);
                break;
            case Shift.REPEATUNIT_YEARLY:
                textView.setText("Year" + suffix);
                break;
        }
    }

    static getAddedShiftPersonView(context, activity, name0, personID) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.shift_added_person, null, true);
        var buttonPerson = view.findViewById("MainButton");
        buttonPerson.setText(name0);
        var buttonDeletePerson = view.findViewById("XButton");
        var linearLayout = activity.findViewById("Edit_ShiftTime_Add_Person_List");
        buttonDeletePerson.addEventListener("click", function (event) {
            // linearLayout.removeView(new View(event.target.parentElement, activity));
            linearLayout.removeView(view);
            FireBaseListeners.tempShiftAddedPeopleIDs.splice(FireBaseListeners.tempShiftAddedPeopleIDs.indexOf(personID), 1);
        });
        return view;
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeShiftDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var shiftID = [this.selectedShift.getW4id()];
                Deletions.deleteInspectionPlans_withShift(this.selectedShift.getW4id());
                Deletions.deleteTaskSheets_withShifts(shiftID);
                Deletions.deleteTaskSheetOccurences(shiftID, null);
                Deletions.deleteTimePunches_withShift(this.selectedShift.getW4id());
                var reffShift = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SHIFTS).child(this.selectedShift.getW4id());
                W4_Funcs.deleteFromDB(reffShift, "Deleted shift " + this.selectedShift.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(this.selectedShift.getLocationID()) + "|");
                MainActivity.w4Toast(this, "Successfully deleted Shift", Toast.LENGTH_LONG);
                this.finish();
            }
        } else if (requestCode == MainActivity.requestCodeGetPersonForShift) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var person_id = data.getStringExtra("id");
                var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), person_id);
                if (person == null) {
                    MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
                    this.finish();
                    return;
                }
                var linearLayout = this.findViewById("Edit_ShiftTime_Add_Person_List");
                linearLayout.addView(NewEditShiftActivity.getAddedShiftPersonView(this, this, person.getFirst_name() + " " + person.getLast_name(), person.getW4id()));
                FireBaseListeners.tempShiftAddedPeopleIDs.push(person.getW4id());
            }
        } else if (requestCode == MainActivity.requestCodeEditShiftTimeStartCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.selectedCalendarDayStart = calendarDay;
                this.updateEditStartEndTime();
                this.setStartDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                this.updateEdit_RepeatSummaryText();
            }
        } else if (requestCode == MainActivity.requestCodeEditShiftTimeEndCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.selectedCalendarDayEnd = calendarDay;
                this.updateEditStartEndTime();
                this.setEndDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                this.updateEdit_RepeatSummaryText();
            }
        } else if (requestCode == MainActivity.requestCodeEditShiftTimeEndRepeatCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.dateTimeRepeatEndDate = W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0);
                this.setRepeatEndOnDateButton();
                this.updateEdit_RepeatSummaryText();
            }
        }
    }
}
