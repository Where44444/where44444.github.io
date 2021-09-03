class ViewTimePunchActivity extends W4Activity {

    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View Time Punch");
        this.setContentView(R.layout.activity_view_time_punch);
        var timepunch_id = this.getIntent().getStringExtra("timepunch_id");
        this.selectedTimePunch = Asset.getAssetbyId(MainActivity.theCompany.getTimePunchList(), timepunch_id);
        if (this.selectedTimePunch == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            this.finish();
            return;
        }
        var punchTime = new W4DateTime(this.selectedTimePunch.getTime());

        var textView = this.findViewById("View_TimePunch_Shift_Text");
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), this.selectedTimePunch.getShiftID());
        if (shift != null)
            textView.setText(shift.method_getFullName());
        var textView = this.findViewById("View_TimePunch_Person_Text");
        var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), this.selectedTimePunch.getPersonID());
        if (person != null)
            textView.setText(person.getFirst_name() + " " + person.getLast_name());
        var textView = this.findViewById("View_TimePunch_Time");
        textView.setText(W4_Funcs.getFriendlyDayText(punchTime) + " at " + W4_Funcs.getTimeText(punchTime));

        if (this.selectedTimePunch.getClockIn())
            this.findViewById("View_TimePunch_ClockIn_Radio").setChecked(true);
        else
            this.findViewById("View_TimePunch_ClockOut_Radio").setChecked(true);
    }
}
