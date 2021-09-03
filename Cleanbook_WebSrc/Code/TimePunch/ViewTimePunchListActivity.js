class ViewTimePunchListActivity extends W4Activity {
    // var this.byPerson = false;
    //     var this.selectedLocation = null;
    //     var this.selectedPerson = null;
    //     var this.trimmedTimePunches = [];
    //     var this.timePunchListAdapter = null;
    //     var this.search_edittext = null;

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewTimePunchListActivity = null;
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Time Punches");
        a.setContentView(R.layout.activity_view_time_punch_list);
        FireBaseListeners.viewTimePunchListActivity = this;
        a.getSupportActionBar().setTitle(a.getIntent().getStringExtra("name") + " Time Punches");
        a.byPerson = a.getIntent().getBooleanExtra("by_person", false);
        var location_id = a.getIntent().getStringExtra("location_id");
        var person_id = a.getIntent().getStringExtra("person_id");
        if (location_id != null)
            a.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), location_id);
        if (person_id != null)
            a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), person_id);
        if ((!a.byPerson && a.selectedLocation == null) || (a.byPerson && a.selectedPerson == null)) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var fab = a.findViewById("AddTimePunchButton");
        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_TIMEPUNCHES] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_TIMEPUNCHES]) {
            a.findViewById("AddTimePunchButton").setVisibility(View.VISIBLE);
            fab.addEventListener("click", function () {
                if (W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES).length > 0) {
                    var intent = new Intent(this, new NewEditTimePunchActivity());
                    intent.putExtra("location_id", location_id);
                    intent.putExtra("person_id", person_id);
                    a.startActivity(intent);
                }
                else
                    MainActivity.w4Toast(a, MainActivity.noLocationsText, Toast.LENGTH_LONG);
            });
        }
        else
            a.findViewById("AddTimePunchButton").setVisibility(View.GONE);
        var button = a.findViewById("TotalHoursButton");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new TotalHoursActivity());
            intent.putExtra("name", a.getIntent().getStringExtra("name"));
            intent.putExtra("by_person", a.byPerson);
            intent.putExtra("location_id", location_id);
            intent.putExtra("person_id", person_id);
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
        this.trimmedTimePunches = [];
        var timePunchList = W4_Funcs.getPermittedTimePunchList();
        if (this.byPerson) {
            for (var i = 0; i < timePunchList.length; ++i) {
                var timePunch = timePunchList[i];
                if (timePunch.getPersonID() == (this.selectedPerson.getW4id())) {
                    this.trimmedTimePunches.push(timePunch);
                }
            }
        }
        else {
            for (var i = 0; i < timePunchList.length; ++i) {
                var timePunch = timePunchList[i];
                if (timePunch.getLocationID() == (this.selectedLocation.getW4id())) {
                    this.trimmedTimePunches.push(timePunch);
                }
            }
        }
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (searchText != ("")) {
            this.trimmedTimePunches = Asset.getSearchedAssets(this.trimmedTimePunches, searchText);
        }
        this.timePunchListAdapter = new TimePunchListAdapter(this, this.trimmedTimePunches, this.byPerson);
        this.findViewById("TimePunchList").setAdapter(this.timePunchListAdapter);
    }



}
