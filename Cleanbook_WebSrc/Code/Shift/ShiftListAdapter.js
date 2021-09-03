class ShiftListAdapter extends ArrayAdapter {

    // final Activity context;
    // final ArrayList<Shift> shiftList;

    // static ViewHolder viewHolder;
    // var ID = 1;

    constructor(context, shiftList) {
        super(context, R.layout.generic_list_item, shiftList);
        this.context = context;
        this.shiftList = shiftList;
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
        var shift = a.shiftList[position];
        var locationText = "";
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
        if (location != null) {
            locationText = location.getName() + " ";
        }
        button = view.findViewById("Generic_Button");
        button.addEventListener("click", function () {
            var intent;
            if ((MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) && location != null)
                intent = new Intent(a.context, new NewEditShiftActivity());
            else {
                intent = new Intent(a.context, new ViewShiftActivity());
                if (location == null) {
                    MainActivity.w4Toast(a.context, MainActivity.noLocationsPermissionText, Toast.LENGTH_LONG);
                }
            }
            intent.putExtra("id", shift.getW4id());
            a.context.startActivity(intent);

        });

        var assignedText = "";
        if (shift.getPersonIDList().includes(MainActivity.currentPerson.getW4id())) {
            assignedText = MainActivity.BLUE_CIRCLE + " ";
        }

        button.setText(assignedText + locationText + W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime())) + " to " + W4_Funcs.getTimeText(new W4DateTime(shift.getEndTime())));

        return view;
    };
}
