class PersonListAdapter extends ArrayAdapter {

    //     final Activity activity;
    //     final ArrayList<Person> personList;
    //     final boolean intentReturnPersonPos;

    //     static ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param context The activity of the current activity so it
     *                knows how to display the list in the listview
     * @param personList The list of items to display in the list view
     *                 with their names and quantities
     */
    constructor(context, personList, intentReturnPersonPos) {
        super(context, R.layout.generic_list_item, personList);
        this.activity = context;
        this.personList = personList;
        this.intentReturnPersonPos = intentReturnPersonPos;
    }

    /**
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view, parent) {
        var a = this;
        var person = this.personList[position];
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        button.setText(person.getLast_name() + ", " + person.getFirst_name());

        var shiftAddedPeopleAlreadyContains = false;
        if (this.intentReturnPersonPos && FireBaseListeners.tempShiftAddedPeopleIDs.includes(person.getW4id())) {
            button.setTextColor("#FFAAAAAA"); //Greyed out
            shiftAddedPeopleAlreadyContains = true;
        }

        var activity = this.activity;
        button.addEventListener("click", function () {
            if (a.intentReturnPersonPos) {
                if (shiftAddedPeopleAlreadyContains) {
                    MainActivity.w4Toast(a.getContext(), "This person is already assigned to this shift!", Toast.LENGTH_LONG);
                } else {
                    activity.getIntent().putExtra("id", person.getW4id());
                    activity.setResult(AppCompatActivity.RESULT_OK, activity.getIntent());
                    activity.finish();
                }
            } else {
                var intent;
                if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_PEOPLE] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_PEOPLE] || person.getW4id() == (MainActivity.currentPerson.getW4id()))
                    intent = new Intent(activity, new NewEditPersonActivity());
                else
                    intent = new Intent(activity, new ViewPersonActivity());

                intent.putExtra("id", person.getW4id());
                activity.startActivity(intent);
            }
        });

        return view;
    };
}
