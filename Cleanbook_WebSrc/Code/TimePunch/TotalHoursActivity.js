class TotalHoursActivity extends W4Activity {
    // var this.startDay = null;
    //     var this.endDay = null;
    //     var this.byPerson = false;
    //     var this.selectedLocation = null;
    //     var this.selectedPerson = null;
    //     var this.personID_To_dateAndHoursMap = new HashMap<>();
    //     var this.exportType = -1;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Total Hours");
        a.setContentView(R.layout.activity_total_hours);
        var dateTimeNow = new W4DateTime();
        var dateTime1MonthBack = new W4DateTime(dateTimeNow.getMillis() - TimeUnit.DAYS.toMillis(31));
        a.startDay = W4_Funcs.dateTimeToCalendarDay(dateTime1MonthBack);
        a.endDay = W4_Funcs.dateTimeToCalendarDay(dateTimeNow);

        a.getSupportActionBar().setTitle(a.getIntent().getStringExtra("name") + " Total Hours");
        a.exportType = a.getIntent().getIntExtra("export_type", -1);
        a.byPerson = a.getIntent().getBooleanExtra("by_person", false);
        a.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), a.getIntent().getStringExtra("location_id"));
        a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.getIntent().getStringExtra("person_id"));
        if ((!a.byPerson && a.selectedLocation == null) || (a.byPerson && a.selectedPerson == null)) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var button = a.findViewById("TotalHours_StartDate_Button");
        a.setStartDateButton(W4_Funcs.calendarDayToDateTime(a.startDay, 0, 0, 0));
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.startDay.getYear());
            intent.putExtra("dMonth", a.startDay.getMonthOfYear());
            intent.putExtra("dDay", a.startDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeTotalHoursStartCalendar);

        });
        var button = a.findViewById("TotalHours_EndDate_Button");
        a.setEndDateButton(W4_Funcs.calendarDayToDateTime(a.endDay, 0, 0, 0));
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", a.endDay.getYear());
            intent.putExtra("dMonth", a.endDay.getMonthOfYear());
            intent.putExtra("dDay", a.endDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeTotalHoursEndCalendar);

        });
        var button = a.findViewById("Button_Export_Hours_Count_Final");
        button.addEventListener("click", function () {
            Exports.exportHoursCount(a.byPerson, a.personID_To_dateAndHoursMap, a.selectedPerson, a.selectedLocation, a.startDay, a.endDay, this);

        });
        var button = a.findViewById("Button_Export_Clock_In_Summary_Final");
        button.addEventListener("click", function () {
            Exports.exportClockSummary(a.byPerson, a.selectedPerson, a.selectedLocation, a.startDay, a.endDay, this);

        });
        a.personID_To_dateAndHoursMap = W4_Funcs.calculateHours(a.byPerson, a.startDay, a.endDay, a.selectedPerson, a.selectedLocation, this);
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeTotalHoursStartCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.startDay = calendarDay;
                this.setStartDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                this.personID_To_dateAndHoursMap = W4_Funcs.calculateHours(this.byPerson, this.startDay, this.endDay, this.selectedPerson, this.selectedLocation, this);
            }
        } else if (requestCode == MainActivity.requestCodeTotalHoursEndCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                this.endDay = calendarDay;
                this.setEndDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                this.personID_To_dateAndHoursMap = W4_Funcs.calculateHours(this.byPerson, this.startDay, this.endDay, this.selectedPerson, this.selectedLocation, this);
            }
        }
    }

    setStartDateButton(dateTime) {
        var button = this.findViewById("TotalHours_StartDate_Button");
        var text = W4_Funcs.getFriendlyDayText(dateTime);
        button.setText(text);
    }

    setEndDateButton(dateTime) {
        var button = this.findViewById("TotalHours_EndDate_Button");
        var text = W4_Funcs.getFriendlyDayText(dateTime);
        button.setText(text);
    }
}
