class TaskByPersonListAdapter extends ArrayAdapter {
    // final Activity activity;
    // final ArrayList<Person> personList;

    // static ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param activity The activity of the current activity so it
     *                knows how to display the list in the listview
     * @param personList The list of items to display in the list view
     *                 with their names and quantities
     */
    constructor(activity, personList) {
        super(activity, R.layout.generic_list_item, personList);
        this.activity = activity;
        this.personList = personList;
    }

    /**
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view, parent) {
        var a = this;
        var person = a.personList[position];
        var person_id = person.getW4id();
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");

        button.setText(person.getLast_name() + ", " + person.getFirst_name());
        var bool = false;
        button = view.findViewById("Generic_Button");

        button.addEventListener("click", function () {
            var intent = new Intent(a.activity, new ViewTaskListActivity());
            intent.putExtra("by_person", true);
            intent.putExtra("name", person.getFirst_name() + " " + person.getLast_name());
            intent.putExtra("person_id", person_id);
            a.activity.startActivity(intent);
        });

        return view;

    };

}
