class EmployeeStatusListAdapter extends ArrayAdapter {
    // final Activity context;
    // final ArrayList<EmployeeStatusStruct> essList;

    /**
     * Constructor
     *
     * @param context    The context of the current activity so it
     *                   knows how to display the list in the listview
     * @param essList The list of items to display in the list views
     *                   with their info
     */
    constructor(context, essList) {
        super(context, R.layout.generic_list_item, essList);
        this.context = context;
        this.essList = essList;
    }

    /**
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view) {
        var a = this;
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        var struct = a.essList[position];
        var person_id = struct.person.getW4id();
        var shift_id = struct.shift.getW4id();
        var location_id = struct.location.getW4id();
        var text = "";

        var statusBool = EmployeeStatusActivity.getBoolAndClockedText(struct.person, struct.shift)[0];
        if (statusBool) {
            text += MainActivity.BLUE_CIRCLE + " ";
        } else {
            text += MainActivity.RED_CIRCLE + " ";
        }
        text += struct.person.getLast_name() + ", " + struct.person.getFirst_name();
        button.setText(text);
        button = view.findViewById("Generic_Button");
        button.addEventListener("click", function () {
            var intent = new Intent(a.context, new EmployeeStatusActivity());
            intent.putExtra("person_id", person_id);
            intent.putExtra("shift_id", shift_id);
            intent.putExtra("location_id", location_id);
            a.context.startActivity(intent);
        });
        return view;
    }
}
