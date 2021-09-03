class ViewMessageLocationsActivity extends W4Activity {

    onResume() {
        super.onResume();
        this.updateList();
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("Messages By Location");
        this.setContentView(R.layout.activity_view_message_locations_list);
        this.search_edittext = this.findViewById("Search_Bar");
        this.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list;
        if (searchText != ("")) {
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_MESSAGES), searchText);
        } else {
            list = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_MESSAGES);
        }
        this.locationListAdapter = new LocationListAdapter(this, list, Asset.PERMISSION_ALL_MESSAGES);
        this.findViewById("MessagesList").setAdapter(this.locationListAdapter);
    }
}
