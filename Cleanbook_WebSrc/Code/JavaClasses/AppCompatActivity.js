class AppCompatActivity {
    static activities = [];
    static RESULT_OK = 0;
    static RESULT_CANCELED = 1;
    static id = 0;

    constructor() {
        this.id = AppCompatActivity.id;
        // this.lastClickedEle = null;
        this.lastScroll_Y = null;
        AppCompatActivity.id++;
        this.supportActionBar = new SupportActionBar(this);
    }

    findViewById(id, notInActivity) {
        var ele;
        if (notInActivity != null) {
            ele = document.getElementById(id);
        }
        else {
            ele = W4_Funcs.getElementInsideContainer("activity_" + this.id, id)
        }
        if (ele == null) {
            console.log("Failed to find|" + id + "| in activity_" + this.id + "|");
            return null;
        }
        return new View(ele, this);
    }

    startActivityForResult(intent, requestCode) {
        intent.requestCode = requestCode;
        this.startActivity(intent);
    }

    startActivity(intent) {
        this.lastScroll_Y = window.scrollY;
        var clearTop = false;
        var clearHome = false;
        if (intent.flags != null) {
            if (intent.flags == Intent.FLAG_ACTIVITY_CLEAR_TOP) {
                clearTop = true;
                while (AppCompatActivity.activities.length > 0) {
                    AppCompatActivity.activities[AppCompatActivity.activities.length - 1].finish();
                }
            }
            if (intent.flags == Intent.FLAG_ACTIVITY_CLEAR_HOME) {
                clearHome = true;
                while (AppCompatActivity.activities.length > 2) {
                    AppCompatActivity.activities[AppCompatActivity.activities.length - 1].finish();
                }
            }
        }

        for (var i = 0; i < AppCompatActivity.activities.length; ++i) {
            document.getElementById("activity_" + AppCompatActivity.activities[i].id).style.display = "none";
        }

        if (clearTop) {
            document.getElementById("bars_div").style.display = "none";
            document.getElementById("activities").style.marginLeft = "0px";
            document.getElementById("activities").style.marginTop = "0px";
            startMainActivity();
        }
        else if (clearHome) {

        }
        else {
            intent.activity2.intent = intent;
            AppCompatActivity.activities.push(intent.activity2);
            intent.activity2.onCreateOptionsMenu(null);
            intent.activity2.onCreate();
            intent.activity2.onResume();
            document.getElementById("bars_div").style.display = "";
            document.getElementById("activities").style.marginLeft = _sidebar_width;
            document.getElementById("activities").style.marginTop = "60px";
        }

        if (intent.isMain) {
            document.getElementById("bars_div").style.display = "none";
            document.getElementById("activities").style.marginLeft = "0px";
            document.getElementById("activities").style.marginTop = "0px";
        }

        if (AppCompatActivity.activities.length > 0) {
            var topActivity = document.getElementById("activity_" + AppCompatActivity.activities[AppCompatActivity.activities.length - 1].id);
            if (topActivity != null) {
                topActivity.style.display = "";
                this.supportActionBar.setInnerHTMLTitle();
            }
        }
    }

    setResult(result) {
        this.resultCode = result;
    }

    finish() {
        this.onDestroy();
        var index = 0;
        for (var i = 0; i < AppCompatActivity.activities.length; ++i) {
            if (AppCompatActivity.activities[i].id == this.id) {
                index = i;
                AppCompatActivity.activities.splice(index, 1);
                break;
            }
        }

        if (AppCompatActivity.activities.length == 1) {
            document.getElementById("bars_div").style.display = "none";
            document.getElementById("activities").style.marginLeft = "0px";
            document.getElementById("activities").style.marginTop = "0px";
        }

        document.getElementById("activity_" + this.id).remove();

        for (var i = 0; i < AppCompatActivity.activities.length; ++i) {
            document.getElementById("activity_" + AppCompatActivity.activities[i].id).style.display = "none";
        }

        if (index > 0) {
            document.getElementById("activity_" + AppCompatActivity.activities[index - 1].id).style.display = "";
            AppCompatActivity.activities[index - 1].onResume();
            AppCompatActivity.activities[index - 1].supportActionBar.setInnerHTMLTitle();
        }

        if (this.intent.requestCode != null && AppCompatActivity.activities.length > 0) {
            AppCompatActivity.activities[index - 1].onActivityResult(this.intent.requestCode, this.resultCode, this.intent);
        }
    }

    onCreateOptionsMenu(menu) {
    }

    onCreate() {
        var view = this.findViewById("activity_back_arrow", true);
        view.setVisibility(View.VISIBLE);
    }

    onResume() {
        if (this.lastScroll_Y != null) {
            window.scroll(window.scrollX, this.lastScroll_Y);
            // this.lastClickedEle.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
        } else {
            var ele = document.getElementById("activity_" + this.id);
            if (ele != null) {
                ele.scrollIntoView(true); //True = scrolltotop //False = scrolltobottom
            }
        }
    }

    onDestroy() {
    }

    static getApplicationContext() {
        return MainActivity.mainActivity;
    }

    setContentView(content) {
        if (W4_Funcs.getElementInsideContainer("activities", "activity_" + this.id) == null) {
            var ele = W4_Funcs.createElementFromHTML("<div id='activity_" + this.id + "'></div>");
            document.getElementById("activities").appendChild(ele);
        }
        var ele = W4_Funcs.getElementInsideContainer("activities", "activity_" + this.id);
        ele.innerHTML = content;
    }

    getSupportActionBar() {
        return this.supportActionBar;
    }

    getName() {
        return "AppCompatActivity";
    }

    getIntent() {
        return this.intent;
    }

    onOptionsItemSelected(item) {
        switch (item.getItemId()) {
            case "home":
                this.finish();
        }
    }

    hideBackButton() {
        var view = this.findViewById("activity_back_arrow", true);
        view.setVisibility(View.GONE);
    }

    onActivityResult() {
    }

    // setLastClickedEle(ele) {
    //     if (this.lastClickedEle == null) {
    //         if (AppCompatActivity.activities.length > 1) {
    //             var lastActivity = AppCompatActivity.activities[AppCompatActivity.activities.length - 2];
    //             lastActivity.lastClickedEle = ele;
    //         }
    //     }
    //     this.lastClickedEle = ele;
    // }

    // setLastScroll_Y() {
    //     if (this.lastScroll_Y == null) {
    //         if (AppCompatActivity.activities.length > 1) {
    //             var lastActivity = AppCompatActivity.activities[AppCompatActivity.activities.length - 2];
    //             lastActivity.lastScroll_Y = window.scrollY;
    //         }
    //     }
    //     this.lastScroll_Y = window.scrollY;
    //     console.log(window.scrollY);
    // }

    isCurrentActivity() {
        if (AppCompatActivity.activities.length == 0)
            return false;
        return this.id == AppCompatActivity.activities[AppCompatActivity.activities.length - 1].id;
    }
}