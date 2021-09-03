class ConfirmActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().hide(); //Hide bar at top with App Name on it

        this.setContentView(R.layout.activity_confirm);
        var description = this.getIntent().getStringExtra("description");
        if (description != null)
            this.findViewById("ConfirmDescription").setText(description);
        var button = this.findViewById("YesConfirm");
        button.addEventListener("click", function () {
            a.setResult(AppCompatActivity.RESULT_OK);
            a.finish();
        });
        button = this.findViewById("CancelConfirm");
        button.addEventListener("click", function () {
            a.setResult(AppCompatActivity.RESULT_CANCELED);
            a.finish();
        });
    }
}
