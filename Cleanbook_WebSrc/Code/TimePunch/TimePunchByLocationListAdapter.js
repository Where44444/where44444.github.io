class TimePunchByLocationListAdapter extends ArrayAdapter {
    // final Activity context;
    // final ArrayList<Location> locationList;
    // final int exportType;

    // static TimePunchByLocationListAdapter.ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param activity     The context of the current activity so it
     *                     knows how to display the list in the listview
     * @param locationList The list of items to display in the list view
     *                     with their info
     */
    constructor(activity, locationList, exportType) {
        super(activity, R.layout.generic_list_item, locationList);
        this.context = activity;
        this.locationList = locationList;
        this.exportType = exportType;
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
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        var location = a.locationList[position];
        var location_id = location.getW4id();
        button.setText(location.getName());
        button = view.findViewById("Generic_Button");

        button.addEventListener("click", function () {
            var intent;
            switch (a.exportType) {
                case -1:
                    intent = new Intent(a.context, new ViewTimePunchListActivity());
                    break;
                default:
                    intent = new Intent(a.context, new StartEndDateActivity());
                    break;
            }
            intent.putExtra("by_person", false);
            intent.putExtra("name", location.getName());
            intent.putExtra("location_id", location_id);
            intent.putExtra("export_type", a.exportType);
            a.context.startActivity(intent);

        });

        return view;
    }

}
