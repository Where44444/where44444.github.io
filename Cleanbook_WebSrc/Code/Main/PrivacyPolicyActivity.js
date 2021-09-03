class PrivacyPolicyActivity extends W4Activity {
    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("Privacy Policy");
        this.setContentView(R.layout.activity_privacy_policy);
        var webView = this.findViewById("WebView");
        webView.ele.src = ("https://where44444.github.io/CleanAssistant_Docs/Privacy_Policy");
        webView.ele.style.height = (window.innerHeight - 150) + "px";
    }
}
