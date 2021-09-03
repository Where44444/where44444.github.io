class SupportActionBar {

    constructor(activity) {
        this.activity = activity;
        this.title = "";
    }

    hide() {
        this.title = "";
        this.setInnerHTMLTitle();
    }

    setTitle(title) {
        this.title = title;
        this.setInnerHTMLTitle();
    }

    setInnerHTMLTitle() {
        if (this.activity.isCurrentActivity()) {
            document.getElementById("support_bar").innerHTML = this.title;
        }
    }
}