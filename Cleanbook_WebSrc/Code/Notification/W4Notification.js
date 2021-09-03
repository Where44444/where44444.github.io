
class W4Notification extends NotificationW4Save {
    // var title = "";
    // var text = "";
    // var pendingIntent = null;
    // var key = -1;

    toObj(){
        var obj = new Object();
        obj.time = this.time;
        obj.any_id = this.any_id;
        obj.task_id = this.task_id;
        obj.shift_id = this.shift_id;
        obj.person_id = this.person_id;
        obj.timepunch_id = this.timepunch_id;
        obj.wasShownOnSystem = this.wasShownOnSystem;
        obj.wasClearedOnApp = this.wasClearedOnApp;
        obj.title = this.title;
        obj.text = this.text;
        // obj.pendingIntent = null;
        obj.key = this.key;

        return obj;
    }

    isContainedIn(list) {
        for (let notification of list) {
            if (notification.equals(this)) {
                return true;
            }
        }
        return false;
    }

    equals(that) {
        return this.title == (that.title) &&
            this.text == (that.text);
    }

    constructor(save, title, text, pendingIntent, key) {
        super(save.time, save.any_id, save.task_id, save.shift_id, save.person_id, save.timepunch_id, save.wasShownOnSystem, save.wasClearedOnApp);
        this.title = title;
        this.text = text;
        this.pendingIntent = pendingIntent;
        this.key = key;
    }
}
