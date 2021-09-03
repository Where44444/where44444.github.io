class W4Activity extends AppCompatActivity {
    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn) { //Likely getting here because user pressed notification when app wasn't running
            // console.log("Not logged in! Finishing!");
            var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            this.startActivity(intent);
        }
    }

    updateList() {
    }
}
