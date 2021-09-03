class LocationListAdapter extends ArrayAdapter {

    /**
     * Constructor
     *
     * @param context The context of the current activity so it
     *                knows how to display the list in the listview
     * @param locationList The list of items to display in the list view
     *                 with their info
     */
    constructor(context, locationList, assetType) {
        super(context, R.layout.generic_list_item, locationList);
        this.context = context;
        this.locationList = locationList;
        this.assetType = assetType;
        if (assetType == Asset.PERMISSION_ALL_SUPPLIES) {
            this.location_To_Supply_Map = W4_Funcs.getSuppliesForLocations(W4_Funcs.getPermittedSuppliesList());
        }
        else if (assetType == Asset.PERMISSION_ALL_MESSAGES) {
            this.newMessagesByLocationMap = new Map();
            for (let w4Notification of MainActivity.w4Notifications) {
                if (w4Notification.key == NotificationsManager.key_Message) {
                    var message = Asset.getAssetbyId(MainActivity.theCompany.getMessageList(), w4Notification.any_id);
                    if (message != null) {
                        if (this.newMessagesByLocationMap.has(message.getLocationID())) {
                            this.newMessagesByLocationMap.set(message.getLocationID(), this.newMessagesByLocationMap.get(message.getLocationID()) + 1)
                        }
                        else {
                            this.newMessagesByLocationMap.set(message.getLocationID(), 1)
                        }

                    }
                }
            }
        }
    }

    /**
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view, parent) {
        var a = this;
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.location_notification_list_item, null, true);
        var button = view.findViewById("Button");
        var notification = view.findViewById("Request_Notification");
        var notificationText = view.findViewById("Request_Notification_Text");
        var location = this.locationList[position];
        var location_id = location.getW4id();
        button.setText(location.getName());

        switch (this.assetType) {
            case Asset.PERMISSION_ALL_LOCATIONS:
                button.addEventListener("click", function () {
                    var intent;
                    if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_LOCATIONS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_LOCATIONS])
                        intent = new Intent(a.context, new NewEditLocationActivity());
                    else
                        intent = new Intent(a.context, new ViewLocationActivity());
                    intent.putExtra("location_id", location_id);
                    a.context.startActivity(intent);
                });
                break;
            case Asset.PERMISSION_ALL_SUPPLIES:
                if (this.location_To_Supply_Map.has(location_id)) {
                    var list = this.location_To_Supply_Map.get(location_id);
                    var numRequested = 0;
                    for (let supplyItem of list) {
                        if (supplyItem.getAmountRequested() > 0) {
                            numRequested += supplyItem.getAmountRequested();
                        }
                    }
                    if (numRequested > 0) {
                        notification.setVisibility(View.VISIBLE);
                        notificationText.setText(numRequested + "");
                    }
                }
                button.addEventListener("click", function () {
                    var intent = new Intent(a.context, new ViewSupplyItemListActivity());
                    intent.putExtra("location_id", location_id);
                    a.context.startActivity(intent);
                });
                break;
            case Asset.PERMISSION_ALL_SDS:
                button.addEventListener("click", function () {
                    var intent = new Intent(a.context, new ViewSDSListActivity());
                    intent.putExtra("location_id", location_id);
                    a.context.startActivity(intent);
                });
                break;
            case Asset.PERMISSION_ALL_MESSAGES:
                var newMessages = 0;
                if (this.newMessagesByLocationMap.has(location_id))
                    newMessages = this.newMessagesByLocationMap.get(location_id);
                if (newMessages > 0) {
                    notification.setVisibility(View.VISIBLE);
                    notificationText.setText(newMessages + "");
                }
                button.addEventListener("click", function () {
                    var intent = new Intent(a.context, new ViewMessageDialogueActivity());
                    intent.putExtra("id", location.getW4id());
                    a.context.startActivity(intent);
                });
                break;
        }

        return view;
    };
}
