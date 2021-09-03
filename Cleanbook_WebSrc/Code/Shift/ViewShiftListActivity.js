class ViewShiftListActivity extends W4Activity {

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewShiftListActivity = null;
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Shifts");
        a.setContentView(R.layout.activity_view_shifts_list);
        FireBaseListeners.viewShiftListActivity = this;
        var fbutton = a.findViewById("AddShiftButton");
        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
            a.findViewById("AddShiftButton").setVisibility(View.VISIBLE);
            fbutton.addEventListener("click", function () {
                var intent = new Intent(this, new NewEditShiftActivity());
                intent.putExtra("startTime", (new W4DateTime()).getMillis());
                a.startActivity(intent);

            });
        } else {
            a.findViewById("AddShiftButton").setVisibility(View.GONE);
        }
        var button = a.findViewById("ViewShiftCalendarButton");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ViewShiftCalendarActivity());
            a.startActivity(intent);

        });
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });

        a.updateList();
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list;
        if (searchText != ("")) {
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedShiftList(), searchText);
        } else {
            list = W4_Funcs.getPermittedShiftList();
        }
        this.shiftListAdapter = new ShiftListAdapter(this, list);
        this.findViewById("ShiftList").setAdapter(this.shiftListAdapter);
    }
}
