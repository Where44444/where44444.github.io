class SupplyItemListAdapter extends ArrayAdapter {
    // final Activity context;
    // final ArrayList<SupplyItem> supplyItemList;

    // static SupplyItemListAdapter.ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param context        The context of the current activity so it
     *                       knows how to display the list in the listview
     * @param supplyItemList The list of items to display in the list view
     *                       with their info
     */
    constructor(context, supplyItemList) {
        super(context, R.layout.supply_item_list_item, supplyItemList);
        this.context = context;
        this.supplyItemList = supplyItemList;
    }

    /**
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view, parent) {
        var a = this;
        var inflater = LayoutInflater.from(a.getContext());
        view = inflater.inflate(R.layout.supply_item_list_item, null, true);
        var button = view.findViewById("SupplyItemButton");
        var supplyItem = a.supplyItemList[position];
        var text = supplyItem.getName();
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), supplyItem.getLocationID());
        if (location != null)
            text += " at " + location.getName();
        button.setText(text);
        var requestNotification = view.findViewById("Request_Notification");
        var requestNotificationText = view.findViewById("Request_Notification_Text");
        var editButton = view.findViewById("SupplyItemButton");
        var requestButton = view.findViewById("RequestSuppliesButton");
        var fulfillButton = view.findViewById("FulfillSuppliesButton");

        if (supplyItem.getAmountRequested() > 0) {
            requestNotification.setVisibility(View.VISIBLE);
            requestNotificationText.setText(supplyItem.getAmountRequested() + "");
            fulfillButton.setVisibility(View.VISIBLE);
        }

        editButton.addEventListener("click", function () {
            var intent;
            if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SUPPLIES] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SUPPLIES])
                intent = new Intent(a.context, new NewEditSupplyItemActivity());
            else {
                intent = new Intent(a.context, new ViewSupplyItemActivity());
            }
            intent.putExtra("id", supplyItem.getW4id());
            a.context.startActivity(intent);

        });

        requestButton.addEventListener("click", function () {
            var intent = new Intent(a.context, new RequestSuppliesActivity());
            intent.putExtra("id", supplyItem.getW4id());
            a.context.startActivity(intent);

        });

        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SUPPLIES] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SUPPLIES]) {
            fulfillButton.addEventListener("click", function () {
                var reffSupplyItem = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).child(supplyItem.getW4id());
                supplyItem.setQuantity(supplyItem.getQuantity() + supplyItem.getAmountRequested());
                supplyItem.setAmountRequested(0);
                supplyItem.setRequester("");
                W4_Funcs.writeToDB(reffSupplyItem, supplyItem, "");
                MainActivity.w4Toast(a.getContext(), "Successfully fulfilled request", Toast.LENGTH_LONG);

            });
        } else
            fulfillButton.setVisibility(View.GONE);

        return view;
    };
}
