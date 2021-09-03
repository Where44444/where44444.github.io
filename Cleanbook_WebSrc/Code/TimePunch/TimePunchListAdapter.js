class TimePunchListAdapter extends ArrayAdapter {
    //     final Activity context;
    //     final ArrayList<TimePunch> timePunchList;

    //     static TimePunchListAdapter.ViewHolder viewHolder;
    //     var ID = 0;
    // var byPerson = false;

    /**
     * Constructor
     *
     * @param context The context of the current activity so it
     *                knows how to display the list in the listview
     * @param timePunchList The list of items to display in the list view
     *                 with their info
     */
    constructor(context, timePunchList, byPerson) {
        super(context, R.layout.generic_list_item, timePunchList);
        this.context = context;
        this.timePunchList = timePunchList;
        this.byPerson = byPerson;
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
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        var timePunch = a.timePunchList[position];
        var timepunch_id = timePunch.getW4id();
        var punchTime = new W4DateTime(timePunch.getTime());
        var timeString = W4_Funcs.getFriendlyDateText(punchTime);
        var extraIDText = "";
        if (a.byPerson) {
            var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), timePunch.getLocationID());
            if (location != null)
                extraIDText = location.getName() + " - ";
        }
        else {
            var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), timePunch.getPersonID());
            if (person != null)
                extraIDText = person.getFirst_name() + " " + person.getLast_name() + " - ";
        }
        var emoji = MainActivity.RED_CIRCLE;
        if (timePunch.getClockIn())
            emoji = MainActivity.CLOCK_130; //1:30 clock

        button.setText(emoji + " " + extraIDText + timeString + " " + W4_Funcs.getTimeText(punchTime));
        button = view.findViewById("Generic_Button");

        button.addEventListener("click", function () {
            var intent;
            var locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES);
            if (locationList.length > 0 && (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_TIMEPUNCHES] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_TIMEPUNCHES]))
                intent = new Intent(a.context, new NewEditTimePunchActivity());
            else {
                intent = new Intent(a.context, new ViewTimePunchActivity());
                if (locationList.length == 0)
                    MainActivity.w4Toast(a.getContext(), MainActivity.noLocationsText, Toast.LENGTH_LONG);
            }
            intent.putExtra("timepunch_id", timepunch_id);
            a.context.startActivity(intent);

        });

        return view;

    };
}
