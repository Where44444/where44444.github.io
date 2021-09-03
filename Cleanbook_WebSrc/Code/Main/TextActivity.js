class TextActivity extends W4Activity {
    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Input Text");
        a.setContentView(R.layout.activity_text);
        var hint = a.getIntent().getStringExtra("hint");
        var text = a.getIntent().getStringExtra("text");
        var editText = a.findViewById("clearableEditText");
        if (hint != null) {
            editText.setHint(hint);
        }
        if (text != null) {
            editText.setText(text);
        }

        a.findViewById("Cancel").addEventListener("click", function () {
            a.finish();
        });

        a.findViewById("Accept").addEventListener("click", function () {
            a.getIntent().putExtra("text", editText.getText());
            a.setResult(AppCompatActivity.RESULT_OK, a.getIntent());
            a.finish();
        });
    }
}
