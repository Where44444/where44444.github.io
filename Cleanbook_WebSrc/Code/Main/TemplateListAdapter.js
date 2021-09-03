class TemplateListAdapter extends ArrayAdapter {

    // final Activity context;
    // final ArrayList<Asset> list;

    // static ViewHolder viewHolder;
    // var ID = 1;

    constructor(context, list) {
        super(context, R.layout.generic_list_item, list);
        this.context = context;
        this.list = list;
    }

    /**
     *
     * @param position The index of where the item is on the list, 0 is top, next is 1, etc.
     * @param view
     * @param parent
     * @return
     */
    getView(position, view) {
        var inflater = LayoutInflater.from(this.getContext());
        view = inflater.inflate(R.layout.generic_list_item, null, true);
        var button = view.findViewById("Generic_Button");
        var asset = this.list[position];
        button = view.findViewById("Generic_Button");
        button.addEventListener("click", function () {
            if (FireBaseListeners.viewTemplateListActivity != null) {
                FireBaseListeners.viewTemplateListActivity.listItemSelected(position);
            }
        });

        button.setText(asset.method_getTemplateName());

        return view;
    };
}
