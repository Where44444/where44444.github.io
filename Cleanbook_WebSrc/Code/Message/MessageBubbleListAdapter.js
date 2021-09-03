class MessageBubbleListAdapter extends ArrayAdapter {
    // final Activity context;
    // final ArrayList<Message> messageList;

    // static ViewHolder viewHolder;
    // var ID = 0;

    /**
     * Constructor
     *
     * @param context The context of the current activity so it
     *                knows how to display the list in the listview
     * @param locationList The list of items to display in the list view
     *                 with their info
     */
    constructor(context, messageList) {
        super(context, R.layout.generic_list_item, messageList);
        this.context = context;
        this.messageList = messageList;
        this.personMap = new Map();
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
        var message = a.messageList[position];
        var person = null;
        if (this.personMap.has(message.getPersonID()))
            person = this.personMap.get(message.getPersonID());
        else {
            person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), message.getPersonID());
            if (person != null) {
                this.personMap.set(message.getPersonID(), person);
            }
        }
        if (person != null && person.getW4id() == MainActivity.currentPerson.getW4id())
            view = inflater.inflate(R.layout.chat_bubble_right, null, true);
        else
            view = inflater.inflate(R.layout.chat_bubble_left, null, true);

        var text = "";
        if (person != null) {
            text += "<b>" + W4_Funcs.getHTMLSafeText(person.getFirst_name() + " " + person.getLast_name()) + "</b><br>";
        }
        var dt = new W4DateTime(message.getTime());
        text += W4_Funcs.getHTMLSafeText(message.getW4text()) + "<br><span style='color: gray; text-align: right;'>" + W4_Funcs.getFriendlyNumbersDayText(dt, "/", false) + " " + W4_Funcs.getTimeText(dt) + "</span>";
        var div = view.findViewById("bubble");
        div.setText(text);

        // div.addEventListener("click", function () {
        //     var intent = new Intent(a.context, new ViewMessageDialogueActivity());
        //     intent.putExtra("id", location.getW4id());
        //     a.context.startActivity(intent);
        // });


        return view;

    };
}

