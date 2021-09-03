class StartEndDateActivity extends W4Activity {
    //     var this.startDay = null;
    // var this.endDay = null;
    // var this.byPerson = false;
    // var this.selectedLocation = null;
    // var this.selectedPerson = null;
    // var this.personID_To_dateAndHoursMap = new HashMap <> ();
    // var this.exportType = -1;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Choose Date Range");
        a.setContentView(R.layout.activity_start_end_date);
        var dateTimeNow = new W4DateTime();
        var dateTime1MonthBack = new W4DateTime(dateTimeNow.getMillis() - TimeUnit.DAYS.toMillis(31));
        a.startDay = W4_Funcs.dateTimeToCalendarDay(dateTime1MonthBack);
        a.endDay = W4_Funcs.dateTimeToCalendarDay(dateTimeNow);
        a.exportType = a.getIntent().getIntExtra("export_type", -1);
        a.byPerson = a.getIntent().getBooleanExtra("by_person", false);
        a.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), a.getIntent().getStringExtra("location_id"));
        a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.getIntent().getStringExtra("person_id"));
        if ((!a.byPerson && a.selectedLocation == null) || (a.byPerson && a.selectedPerson == null)) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }

        a.setStartDateButton(W4_Funcs.calendarDayToDateTime(a.startDay, 0, 0, 0));
        a.findViewById("StartDate_Button").addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.startDay.getYear());
            intent.putExtra("dMonth", a.startDay.getMonthOfYear());
            intent.putExtra("dDay", a.startDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeSEStartCalendar);
        });

        a.setEndDateButton(W4_Funcs.calendarDayToDateTime(a.endDay, 0, 0, 0));
        a.findViewById("EndDate_Button").addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.endDay.getYear());
            intent.putExtra("dMonth", a.endDay.getMonthOfYear());
            intent.putExtra("dDay", a.endDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeSEEndCalendar);
        });

        a.findViewById("Button_Export2").addEventListener("click", function () {
            switch (a.exportType) {
                case ReportTypesActivity.EXPORT_HOURS_COUNT:
                    Exports.exportHoursCount(a.byPerson, a.personID_To_dateAndHoursMap, a.selectedPerson, a.selectedLocation, a.startDay, a.endDay, this);
                    break;
                case ReportTypesActivity.EXPORT_CLOCK_SUMMARY:
                    Exports.exportClockSummary(a.byPerson, a.selectedPerson, a.selectedLocation, a.startDay, a.endDay, this);
                    break;
                case ReportTypesActivity.EXPORT_TASK_SUMMARY:
                    Exports.exportTaskSummary(a.byPerson, a.selectedPerson, a.selectedLocation, a.startDay, a.endDay, this);
                    break;
                case ReportTypesActivity.EXPORT_INSPECTION_SUMMARY:
                    Exports.exportInspectionSummary(a.byPerson, a.selectedPerson, a.selectedLocation, a.startDay, a.endDay, this);
                    break;
                default:
                    break;
            }
        });
        a.personID_To_dateAndHoursMap = W4_Funcs.calculateHours(a.byPerson, a.startDay, a.endDay, a.selectedPerson, a.selectedLocation, this);
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeSEStartCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.startDay = calendarDay;
                this.setStartDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                this.personID_To_dateAndHoursMap = W4_Funcs.calculateHours(this.byPerson, this.startDay, this.endDay, this.selectedPerson, this.selectedLocation, this);
            }
        } else if (requestCode == MainActivity.requestCodeSEEndCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.endDay = calendarDay;
                this.setEndDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                this.personID_To_dateAndHoursMap = W4_Funcs.calculateHours(this.byPerson, this.startDay, this.endDay, this.selectedPerson, this.selectedLocation, this);
            }
        }
    }

    setStartDateButton(dateTime) {
        var button = this.findViewById("StartDate_Button");
        var text = W4_Funcs.getFriendlyDayText(dateTime);
        button.setText(text);
    }

    setEndDateButton(dateTime) {
        var button = this.findViewById("EndDate_Button");
        var text = W4_Funcs.getFriendlyDayText(dateTime);
        button.setText(text);
    }
}
