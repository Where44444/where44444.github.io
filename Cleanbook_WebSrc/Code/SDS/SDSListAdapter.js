class SDSListAdapter extends ArrayAdapter {
    // final Activity context;
    // final ArrayList<SupplyItem> supplyItemList;

    // static SDSListAdapter.ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param context The context of the current activity so it
     *                knows how to display the list in the listview
     * @param supplyItemList The list of items to display in the list view
     *                 with their info
     */
    constructor(context, supplyItemList) {
        super(context, R.layout.generic_list_item, supplyItemList);
        this.context = context;
        this.supplyItemList = supplyItemList;
    }

    /**
     *
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view, parent) {
        var a = this;
        var inflater = LayoutInflater.from(a.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        var supplyItem = a.supplyItemList[position];
        var id = supplyItem.getW4id();
        if (supplyItem.getTemplateID() != ("")) {
            id = supplyItem.getTemplateID();
        }
        var supplyitem_id = id;
        button.setText(supplyItem.getName());
        button = view.findViewById("Generic_Button");

        button.addEventListener("click", function () {
            var intent = new Intent(a.context, new ViewNewEditSDSActivity());
            intent.putExtra("id", supplyitem_id);
            a.context.startActivity(intent);
        });

        return view;

    };


}
