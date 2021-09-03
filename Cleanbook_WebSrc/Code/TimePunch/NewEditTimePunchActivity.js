class NewEditTimePunchActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_time_punch);

        var shiftList = W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES);
        var shiftSpinnerItems = null;
        var shiftNames = null;
        if (shiftList.length > 0) {
            shiftSpinnerItems = W4_Funcs.getShiftSpinnerItems(shiftList);
            shiftNames = shiftSpinnerItems[0];
            a.shiftIDs = shiftSpinnerItems[1];
        }

        var personList = W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES);
        var timepunch_id = a.getIntent().getStringExtra("timepunch_id");
        var person_id = a.getIntent().getStringExtra("person_id");
        var location_id = a.getIntent().getStringExtra("location_id");
        a.newTimePunch = (timepunch_id == null);

        if (a.newTimePunch) {
            a.getSupportActionBar().setTitle("New Time Punch");
            a.selectedTimePunch = new TimePunch();
            a.selectedTimePunch.setPersonID(person_id);
            a.selectedTimePunch.setLocationID(location_id);

            var index = W4_Funcs.getShiftSpinnerIndexAtLocation(a.shiftIDs, location_id);
            if (index < a.shiftIDs.length) {
                a.selectedTimePunch.setShiftID(a.shiftIDs[index]);
            }

            var reffTimePunch = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).push();
            a.selectedTimePunch.setW4id(reffTimePunch.key);
            a.findViewById("Delete_Edit_TimePunch").setVisibility(View.GONE);
        }
        else {
            a.getSupportActionBar().setTitle("Edit Time Punch");
            a.selectedTimePunch = Asset.getAssetbyId(MainActivity.theCompany.getTimePunchList(), timepunch_id);
        }

        if (a.selectedTimePunch == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }

        if (shiftList.length > 0) {
            var spinner = a.findViewById("Edit_TimePunch_Shift_Spinner");
            var spinnerArrayAdapter = new ArrayAdapter(
                this, R.layout.spinner_item, shiftNames
            );
            spinner.setAdapter(spinnerArrayAdapter);
            var index = W4_Funcs.getPositionOfStringInArray(a.shiftIDs, a.selectedTimePunch.getShiftID());
            if (index != -1)
                spinner.setSelection(index);
        } else {
            MainActivity.w4Toast(this, "No shifts found!", Toast.LENGTH_LONG);
            a.finish();
        }


        var punchTime = new W4DateTime();
        if (!a.newTimePunch) {
            punchTime = new W4DateTime(a.selectedTimePunch.getTime())
        }

        a.selectedCalendarDay = W4_Funcs.dateTimeToCalendarDay(punchTime);
        var dateTime = new W4DateTime();

        var spinner = a.findViewById("Edit_TimePunch_Person_Spinner");
        var spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, W4_Funcs.getPersonNames(personList)
        );
        spinner.setAdapter(spinnerArrayAdapter);
        var pos = Asset.getAssetPositionInList(personList, a.selectedTimePunch.getPersonID());
        if (pos == -1 && !a.newTimePunch) {
            MainActivity.w4Toast(this, MainActivity.missingAssetForSpinner, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        if (pos != -1)
            spinner.setSelection(pos);
        var spinner = a.findViewById("Edit_TimePunch_HoursSpinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item_right_align, Asset.HOURS
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(punchTime.getHourOfDay() % 12);
        var spinner = a.findViewById("Edit_TimePunch_MinutesSpinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Asset.MINUTES1
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(punchTime.getMinuteOfHour());
        var spinner = a.findViewById("Edit_TimePunch_AMPMSpinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Asset.AM_PM
        );
        spinner.setAdapter(spinnerArrayAdapter);
        if (punchTime.getHourOfDay() > 11)
            spinner.setSelection(1);
        else
            spinner.setSelection(0);

        if (a.selectedTimePunch.getClockIn())
            a.findViewById("Edit_TimePunch_ClockIn_Radio").setChecked(true);
        else
            a.findViewById("Edit_TimePunch_ClockOut_Radio").setChecked(true);
        var button = a.findViewById("Edit_TimePunch_DateButton");
        a.setDateButton(punchTime);
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.selectedCalendarDay.getYear());
            intent.putExtra("dMonth", a.selectedCalendarDay.getMonthOfYear());
            intent.putExtra("dDay", a.selectedCalendarDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeEditTimePunchCalendar);

        });
        var button = a.findViewById("Cancel_Edit_TimePunch");
        button.addEventListener("click", function () {
            a.finish();

        });
        var button = a.findViewById("Accept_Edit_TimePunch");
        button.addEventListener("click", function () {
            //Selected date is null when calendar is first created
            var ampmmult = a.findViewById("Edit_TimePunch_AMPMSpinner").getSelectedItemPosition();
            var hour = a.findViewById("Edit_TimePunch_HoursSpinner").getSelectedItemPosition() + (12 * ampmmult);
            var minute = a.findViewById("Edit_TimePunch_MinutesSpinner").getSelectedItemPosition();
            if (W4_Funcs.doesTimeExist(a.selectedCalendarDay, hour, minute, 0)) {
                var dateTime = W4_Funcs.calendarDayToDateTime(a.selectedCalendarDay, hour, minute, 0);
                var clockIn = a.findViewById("Edit_TimePunch_ClockIn_Radio").isChecked();
                var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.shiftIDs[a.findViewById("Edit_TimePunch_Shift_Spinner").getSelectedItemPosition()]);
                if (shift != null) {
                    var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                    if (location != null) {
                        var person = W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES)[a.findViewById("Edit_TimePunch_Person_Spinner").getSelectedItemPosition()];
                        var reffTimePunch = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).child(a.selectedTimePunch.getW4id());
                        var timePunch = new TimePunch(a.selectedTimePunch.getW4id(), dateTime.getMillis(), clockIn, location.getW4id(), person.getW4id(), shift.getW4id());
                        W4_Funcs.setTimePunchInFireBase(reffTimePunch, timePunch, person.getW4id(), false);
                        if (a.newTimePunch) {
                            MainActivity.w4Toast(this, "Successfully added new Time Punch", Toast.LENGTH_LONG);
                        }
                        else {
                            MainActivity.w4Toast(this, "Successfully edited Time Punch", Toast.LENGTH_LONG);
                        }
                        a.finish();
                    } else {
                        MainActivity.w4Toast(a, "Could not find Location!", Toast.LENGTH_LONG);
                    }
                } else {
                    MainActivity.w4Toast(a, "Could not find Shift!", Toast.LENGTH_LONG);
                }
            } else {
                MainActivity.w4Toast(a, "Time doesn't exist because of Daylight Savings Time!", Toast.LENGTH_LONG);
            }

        });
        var button = a.findViewById("Delete_Edit_TimePunch");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ConfirmActivity());
            intent.putExtra("description", "Are you sure you want to delete this Time Punch?");
            a.startActivityForResult(intent, MainActivity.requestCodeTimePunchDelete);

        });
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeEditTimePunchCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.selectedCalendarDay = calendarDay;
                this.setDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
            }
        } else if (requestCode == MainActivity.requestCodeTimePunchDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var reffTimePunch = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).child(this.selectedTimePunch.getW4id());
                W4_Funcs.deleteFromDB(reffTimePunch, "Deleted time punch " + this.selectedTimePunch.getTime() + " |Location:" + W4_DBLog.getLocationStringForLog(this.selectedTimePunch.getLocationID()) + "|Person:" + W4_DBLog.getPersonStringForLog(this.selectedTimePunch.getPersonID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(this.selectedTimePunch.getShiftID()) + "|");
                W4_Funcs.setPersonClockInStatusFromTimePunches(this.selectedTimePunch.getPersonID(), null, [this.selectedTimePunch.getW4id()]);
                MainActivity.w4Toast(this, "Successfully deleted Time Punch", Toast.LENGTH_LONG);
                this.finish();
            }
        }
    }

    setDateButton(dateTime) {
        var button = this.findViewById("Edit_TimePunch_DateButton");
        var text = W4_Funcs.getFriendlyDateText(dateTime);
        button.setText(text);
    }
}
