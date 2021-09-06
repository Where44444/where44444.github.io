class ViewTimePunchListByTypeActivity extends W4Activity {
    static byPerson = 0;
    static byLocation = 1;
    static listType = ViewTimePunchListByTypeActivity.byPerson;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Time Punches By Type");
        a.setContentView(R.layout.activity_view_time_punch_by_type);
        a.exportType = a.getIntent().getIntExtra("export_type", -1);
        if (a.exportType != -1) {
            a.getSupportActionBar().setTitle("Choose Report Person/Location");
        }
        var fab = a.findViewById("AddTimePunchButton_ByType");
        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_TIMEPUNCHES] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_TIMEPUNCHES]) {
            a.findViewById("AddTimePunchButton_ByType").setVisibility(View.VISIBLE);
            fab.addEventListener("click", function () {
                if (W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES).length > 0) {
                    var intent = new Intent(this, new NewEditTimePunchActivity());
                    a.startActivity(intent);
                } else
                    MainActivity.w4Toast(a, MainActivity.noLocationsText, Toast.LENGTH_LONG);

            });
        } else
            a.findViewById("AddTimePunchButton_ByType").setVisibility(View.GONE);

        if (a.exportType != -1)
            a.findViewById("AddTimePunchButton_ByType").setVisibility(View.GONE);
        var imageButton = a.findViewById("SetTimePunchTypePersonButton");
        imageButton.addEventListener("click", function () {
            a.setTimePunchList(ViewTimePunchListByTypeActivity.byPerson);

        });
        var imageButton = a.findViewById("SetTimePunchTypeLocationButton");
        imageButton.addEventListener("click", function () {
            a.setTimePunchList(ViewTimePunchListByTypeActivity.byLocation);
        });
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.setTimePunchList(ViewTimePunchListByTypeActivity.listType);
        });

        a.setTimePunchList(ViewTimePunchListByTypeActivity.listType);
    }

    setTimePunchList(type) {
        ViewTimePunchListByTypeActivity.listType = type;
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (type == ViewTimePunchListByTypeActivity.byPerson) {
            var list;
            if (searchText != ("")) {
                list = Asset.getSearchedAssets(W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES), searchText);
            } else {
                list = W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES);
            }
            this.timePunchByPersonListAdapter = new TimePunchByPersonListAdapter(this, list, this.exportType);
            this.findViewById("TimePunchTypeList").setAdapter(this.timePunchByPersonListAdapter);
            this.findViewById("SetTimePunchTypePersonButton").ele.children[0].src = ("../res/icon_people_on.png");
            this.findViewById("SetTimePunchTypeLocationButton").ele.children[0].src = ("../res/icon_locations_off.png");
        } else {
            var list;
            if (searchText != ("")) {
                list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES), searchText);
            } else {
                list = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES);
            }
            this.timePunchByLocationListAdapter = new TimePunchByLocationListAdapter(this, list, this.exportType);
            this.findViewById("TimePunchTypeList").setAdapter(this.timePunchByLocationListAdapter);
            this.findViewById("SetTimePunchTypePersonButton").ele.children[0].src = ("../res/icon_people_off.png");
            this.findViewById("SetTimePunchTypeLocationButton").ele.children[0].src = ("../res/icon_locations_on.png");
        }
    }
}
