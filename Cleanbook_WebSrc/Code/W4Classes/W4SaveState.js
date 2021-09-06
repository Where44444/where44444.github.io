class W4SaveState {
    // var staySignedIn = false;
    // var email = "";
    // var password = "";
    // var lastTaskInProgressID = "";
    // var systemNotificationsMap = new HashMap<>();
    // var systemNotificationIDsMap = new HashMap<>();
    // var appNotificationsMap = new HashMap<>();
    // var appNotificationIDsMap = new HashMap<>();
    // var initialNotificationSent = false;
    // var spanishMode = false;
    // var initialBGLocationConsentAcquired = false;

    constructor() {
        // this.staySignedIn = false;
        // this.email = "";
        // this.password = "";
        this.lastTaskInProgressID = "";
        this.systemNotificationsMap = new Map();
        this.systemNotificationIDsMap = new Map();
        this.appNotificationsMap = new Map();
        this.appNotificationIDsMap = new Map();
        this.initialNotificationSent = false;
        this.spanishMode = false;
        this.initialBGLocationConsentAcquired = false;
    }

    loadFromCookies() {
        this.lastTaskInProgressID = MainActivity.getCookie("lastTaskInProgressID");
        this.systemNotificationsMap = W4_Funcs.mapFromObject(MainActivity.getCookie("systemNotificationsMap"));
        this.systemNotificationIDsMap = W4_Funcs.mapFromObject(MainActivity.getCookie("systemNotificationIDsMap"));
        this.appNotificationsMap = W4_Funcs.mapFromObject(MainActivity.getCookie("appNotificationsMap"));
        this.appNotificationIDsMap = W4_Funcs.mapFromObject(MainActivity.getCookie("appNotificationIDsMap"));
        this.initialNotificationSent = MainActivity.getCookie("initialNotificationSent");
        this.spanishMode = MainActivity.getCookie("spanishMode");
        this.initialBGLocationConsentAcquired = MainActivity.getCookie("initialBGLocationConsentAcquired");

        if (this.lastTaskInProgressID == null)
            this.lastTaskInProgressID = "";
        if (this.systemNotificationsMap == null)
            this.systemNotificationsMap = new Map();
        if (this.systemNotificationIDsMap == null)
            this.systemNotificationIDsMap = new Map();
        if (this.appNotificationsMap == null)
            this.appNotificationsMap = new Map();
        if (this.appNotificationIDsMap == null)
            this.appNotificationIDsMap = new Map();
        if (this.initialNotificationSent == null)
            this.initialNotificationSent = false;
        if (this.spanishMode == null)
            this.spanishMode = false;
        if (this.initialBGLocationConsentAcquired == null)
            this.initialBGLocationConsentAcquired = false;

        // console.log("Loaded");
        // console.log(this.systemNotificationsMap.get(NotificationsManager.key_Message));
    }

    saveToCookies() {
        MainActivity.setCookie("lastTaskInProgressID", this.lastTaskInProgressID);
        // MainActivity.setCookie("systemNotificationsMap", W4_Funcs.objFromMap(this.systemNotificationsMap)); //Disabled because it takes more than 4096 Bytes in cookies
        // MainActivity.setCookie("systemNotificationIDsMap", W4_Funcs.objFromMap(this.systemNotificationIDsMap));
        MainActivity.setCookie("appNotificationsMap", W4_Funcs.objFromMap(this.appNotificationsMap));
        MainActivity.setCookie("appNotificationIDsMap", W4_Funcs.objFromMap(this.appNotificationIDsMap));
        MainActivity.setCookie("initialNotificationSent", this.initialNotificationSent);
        MainActivity.setCookie("spanishMode", this.spanishMode);
        MainActivity.setCookie("initialBGLocationConsentAcquired", this.initialBGLocationConsentAcquired);

        // console.log("Saved");
        // console.log(this.systemNotificationsMap.get(NotificationsManager.key_Message));
    }

    // isStaySignedIn() {
    //     return staySignedIn;
    // }

    // setStaySignedIn(staySignedIn) {
    //     this.staySignedIn = staySignedIn;
    // }

    // getEmail() {
    //     return email;
    // }

    // setEmail(email) {
    //     this.email = email;
    // }

    // getPassword() {
    //     return password;
    // }

    // setPassword(password) {
    //     this.password = password;
    // }

    getLastTaskInProgressID() {
        return this.lastTaskInProgressID;
    }

    setLastTaskInProgressID(lastTaskInProgressID) {
        this.lastTaskInProgressID = lastTaskInProgressID;
    }

    isInitialNotificationSent() {
        return this.initialNotificationSent;
    }

    setInitialNotificationSent(initialNotificationSent) {
        this.initialNotificationSent = initialNotificationSent;
    }

    getSystemNotificationsMap() {
        return this.systemNotificationsMap;
    }

    setSystemNotificationsMap(systemNotificationsMap) {
        this.systemNotificationsMap = systemNotificationsMap;
    }

    getSystemNotificationIDsMap() {
        return this.systemNotificationIDsMap;
    }

    setSystemNotificationIDsMap(systemNotificationIDsMap) {
        this.systemNotificationIDsMap = systemNotificationIDsMap;
    }

    getAppNotificationsMap() {
        return this.appNotificationsMap;
    }

    setAppNotificationsMap(appNotificationsMap) {
        this.appNotificationsMap = appNotificationsMap;
    }

    getAppNotificationIDsMap() {
        return this.appNotificationIDsMap;
    }

    setAppNotificationIDsMap(appNotificationIDsMap) {
        this.appNotificationIDsMap = appNotificationIDsMap;
    }

    isSpanishMode() {
        return this.spanishMode;
    }

    setSpanishMode(spanishMode) {
        this.spanishMode = spanishMode;
    }

    isInitialBGLocationConsentAcquired() {
        return this.initialBGLocationConsentAcquired;
    }

    setInitialBGLocationConsentAcquired(initialBGLocationConsentAcquired) {
        this.initialBGLocationConsentAcquired = initialBGLocationConsentAcquired;
    }


    // getLastSeenMessageTime() {
    //     return this.lastSeenMessageTime;
    // }

    // setLastSeenMessageTime(lastSeenMessageTime) {
    //     this.lastSeenMessageTime = lastSeenMessageTime;
    // }

    method_InitializeNotificationsData(key) {
        var saveStateModified = false;
        if (!this.getSystemNotificationsMap().has(key)) {
            this.getSystemNotificationsMap().set(key, []);
            saveStateModified = true;
        }
        if (!this.getSystemNotificationIDsMap().has(key)) {
            this.getSystemNotificationIDsMap().set(key, 0);
            saveStateModified = true;
        }
        if (!this.getAppNotificationsMap().has(key)) {
            this.getAppNotificationsMap().set(key, []);
            saveStateModified = true;
        }
        if (!this.getAppNotificationIDsMap().has(key)) {
            this.getAppNotificationIDsMap().set(key, 0);
            saveStateModified = true;
        }
        var now = new W4DateTime();
        var systemIndexesToRemove = [];
        var systemNotifications = MainActivity.w4SaveState.getSystemNotificationsMap().get(key);
        for (var i = 0; i < systemNotifications.length; ++i) //Remove week old notifications
        {
            var diff = now.getMillis() - systemNotifications[i].time;
            if (diff >= MainActivity.NOTIFICATION_EXPIRATION_TIME)
                systemIndexesToRemove.push(i);
        }
        for (var i = systemIndexesToRemove.length - 1; i >= 0; --i) {
            systemNotifications.splice(systemIndexesToRemove[i], 1);
            saveStateModified = true;
        }
        this.getSystemNotificationsMap().set(key, systemNotifications);

        var appIndexesToRemove = [];
        var appNotifications = MainActivity.w4SaveState.getAppNotificationsMap().get(key);
        for (var i = 0; i < appNotifications.length; ++i) //Remove week old notifications
        {
            var diff = now.getMillis() - appNotifications[i].time;
            if (diff >= MainActivity.NOTIFICATION_EXPIRATION_TIME) {
                appIndexesToRemove.push(i);
            }
        }
        for (var i = appIndexesToRemove.length - 1; i >= 0; --i) {
            appNotifications.splice(appIndexesToRemove[i], 1);
            saveStateModified = true;
        }
        this.getAppNotificationsMap().set(key, appNotifications);

        return saveStateModified;
    }
}
