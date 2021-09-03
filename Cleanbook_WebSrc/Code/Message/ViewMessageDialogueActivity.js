class ViewMessageDialogueActivity extends W4Activity {

    static viewMessageDialogueActivity = null;

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.messageSelectedLocation = null;
        ViewMessageDialogueActivity.viewMessageDialogueActivity = null;
    }

    onResume() {
        super.onResume();
        // var topBarHeight = this.findViewById("headerbar", true).ele.clientHeight;
        // var bottomBarHeight = this.findViewById("sidebar_sensitive").ele.clientHeight;
        // this.findViewById("chat_messages_view").ele.style.height = (window.innerHeight - (topBarHeight + bottomBarHeight)) + "px"; //Top bar + bottom messaging bar
        this.updateList();
    }

    onCreate() {
        var a = this;
        this.list = [];
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Messages");
        a.setContentView(R.layout.activity_view_message_dialogue);
        ViewMessageDialogueActivity.viewMessageDialogueActivity = this;
        FireBaseListeners.messageSelectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), a.getIntent().getStringExtra("id"));
        if (FireBaseListeners.messageSelectedLocation == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        a.getSupportActionBar().setTitle(FireBaseListeners.messageSelectedLocation.getName());
        a.removeMessageNotifications();

        var input = a.findViewById("message_input");
        input.addEventListener("keyup", function (event) {
            if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
                event.preventDefault();
                a.sendMessage();
            }
        });

        var button = a.findViewById("message_send_button");
        button.addEventListener("click", function () {
            a.sendMessage();
        });
    }

    sendMessage() {
        var input = this.findViewById("message_input");
        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_MESSAGES] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_MESSAGES]) {
            if (FireBaseListeners.messageSelectedLocation != null) {
                var reffMessage = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_MESSAGES).push();
                var message = new Message(reffMessage.key, input.getText(), new W4DateTime().getMillis(), MainActivity.currentPerson.getW4id(), FireBaseListeners.messageSelectedLocation.getW4id());
                W4_Funcs.writeToDB(reffMessage, message, "");
                input.setText("");
            } else
                MainActivity.w4Toast(this, "An error occured from retrieving this location", Toast.LENGTH_LONG);
        } else
            MainActivity.w4Toast(this, "You don't have permission to write Messages", Toast.LENGTH_LONG);
    }

    updateList(newMessage) {
        super.updateList();
        var view = this.findViewById("chat_messages_view");
        if (newMessage != null) {
            this.list.push(newMessage);
            view.updateAdapterLastItem(this.messageBubbleListAdapter);

        } else {
            this.list = [];
            for (let message of MainActivity.theCompany.getMessageList()) {
                if (message.getLocationID() == FireBaseListeners.messageSelectedLocation.getW4id()) {
                    this.list.push(message);
                }
            }
            this.list.sort(Message.compareTo);
            this.messageBubbleListAdapter = new MessageBubbleListAdapter(this, this.list);
            view.setAdapter(this.messageBubbleListAdapter);
        }
        this.findViewById("chat_bottom_scrollintoview_div").ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }

    removeMessageNotifications() {
        var indexesToRemove = [];
        for (var i = 0; i < MainActivity.w4Notifications.length; ++i) {
            var w4Notification = MainActivity.w4Notifications[i];
            if (w4Notification.key == NotificationsManager.key_Message) {
                var message = Asset.getAssetbyId(MainActivity.theCompany.getMessageList(), w4Notification.any_id);
                if (message != null && message.getLocationID() == FireBaseListeners.messageSelectedLocation.getW4id()) {
                    indexesToRemove.push(i);
                }
            }
        }
        for (var i = indexesToRemove.length - 1; i >= 0; --i) {
            W4_Funcs.removeNotification(indexesToRemove[i]);
        }
    }
}
