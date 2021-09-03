class ViewLocationsListActivity extends W4Activity {
    onDestroy() {
        FireBaseListeners.viewLocationsListActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Locations");
        a.setContentView(R.layout.activity_view_locations_list);
        FireBaseListeners.viewLocationsListActivity = this;
        var button = a.findViewById("AddLocationButton");
        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_LOCATIONS]) {
            a.findViewById("AddLocationButton").setVisibility(View.VISIBLE);
            button.addEventListener("click", function () {
                var intent = new Intent(this, new NewEditLocationActivity());
                a.startActivity(intent);
            });
        } else
            a.findViewById("AddLocationButton").setVisibility(View.GONE);
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });

        a.updateList();
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list = [];
        if (searchText != ("")) {
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList(), searchText);
        } else {
            list = W4_Funcs.getPermittedLocationList();
        }
        this.locationListAdapter = new LocationListAdapter(this, list, Asset.PERMISSION_ALL_LOCATIONS);
        this.findViewById("LocationsList").setAdapter(this.locationListAdapter);
    }
}
