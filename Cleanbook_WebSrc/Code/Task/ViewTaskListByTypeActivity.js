class ViewTaskListByTypeActivity extends W4Activity {
    static byPerson = 0;
    static byLocation = 1;
    static listType = ViewTaskListByTypeActivity.byLocation;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Tasks By Type");
        a.setContentView(R.layout.activity_view_task_list_by_type);

        a.findViewById("TemplatesButton").addEventListener("click", function () {
            var intent = new Intent(this, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_TASKS);
            intent.putExtra("newEditActivity", new NewEditTaskActivity());
            intent.putExtra("viewActivity", new ViewTaskActivity());
            a.startActivity(intent);

        });

        if (W4_Funcs.isAssetWriteable(Asset.PERMISSION_ALL_TASKS)) {
            var fab = a.findViewById("AddTaskButton_ByType");
            a.findViewById("AddTaskButton_ByType").setVisibility(View.VISIBLE);
            fab.addEventListener("click", function () {
                if (W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_TASKS).length > 0) {
                    var intent = new Intent(this, new NewEditTaskActivity());
                    a.startActivity(intent);
                } else
                    MainActivity.w4Toast(a, MainActivity.noShiftsText, Toast.LENGTH_LONG);

            });
        } else
            a.findViewById("AddTaskButton_ByType").setVisibility(View.GONE);
        var imageButton = a.findViewById("SetTaskTypePersonButton");
        imageButton.addEventListener("click", function () {
            a.setTaskList(ViewTaskListByTypeActivity.byPerson);

        });
        var imageButton = a.findViewById("SetTaskTypeLocationButton");
        imageButton.addEventListener("click", function () {
            a.setTaskList(ViewTaskListByTypeActivity.byLocation);

        });
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.setTaskList(ViewTaskListByTypeActivity.listType);
        });
        a.setTaskList(ViewTaskListByTypeActivity.listType);
    }

    setTaskList(type) {
        ViewTaskListByTypeActivity.listType = type;
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (type == ViewTaskListByTypeActivity.byPerson) {
            var list;
            if (searchText != ("")) {
                list = Asset.getSearchedAssets(W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TASKS), searchText);
            } else {
                list = W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TASKS);
            }
            this.taskByPersonListAdapter = new TaskByPersonListAdapter(this, list);
            this.findViewById("TaskTypeList").setAdapter(this.taskByPersonListAdapter);
            this.findViewById("SetTaskTypePersonButton").ele.children[0].src = "../res/icon_people_on.png";
            this.findViewById("SetTaskTypeLocationButton").ele.children[0].src = "../res/icon_locations_off.png";
        } else {
            var list;
            if (searchText != ("")) {
                list = Asset.getSearchedAssets(W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TASKS), searchText);
            } else {
                list = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_TASKS);
            }
            this.taskByLocationListAdapter = new TaskByLocationListAdapter(this, list);
            this.findViewById("TaskTypeList").setAdapter(this.taskByLocationListAdapter);
            this.findViewById("SetTaskTypePersonButton").ele.children[0].src = "../res/icon_people_off.png";
            this.findViewById("SetTaskTypeLocationButton").ele.children[0].src = "../res/icon_locations_on.png";
        }
    }
}
