class ViewTaskListActivity extends W4Activity {

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewTaskListActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Tasks");
        a.setContentView(R.layout.activity_view_task_list);

        a.findViewById("TemplatesButton").addEventListener("click", function () {
            var intent = new Intent(a, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_TASKS);
            intent.putExtra("newEditActivity", new NewEditTaskActivity());
            intent.putExtra("viewActivity", new ViewTaskActivity());
            a.startActivity(intent);

        });

        a.getSupportActionBar().setTitle(a.getIntent().getStringExtra("name") + " Tasks");
        a.byPerson = a.getIntent().getBooleanExtra("by_person", false);
        var location_id = a.getIntent().getStringExtra("location_id");
        var person_id = a.getIntent().getStringExtra("person_id");
        if (location_id != null)
            a.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), location_id);
        if (person_id != null)
            a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), person_id);
        if ((!a.byPerson && a.selectedLocation == null) || (a.byPerson && a.selectedPerson == null)) {
            MainActivity.w4Toast(a, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var readOnly = !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_TASKS] && !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_TASKS];
        FireBaseListeners.viewTaskListActivity = a;

        if (!readOnly) {
            a.findViewById("AddTaskButton").setVisibility(View.VISIBLE);
            var button = a.findViewById("AddTaskButton");
            button.addEventListener("click", function () {
                var intent = new Intent(a, new NewEditTaskActivity());
                if (!a.byPerson)
                    intent.putExtra("location_id", a.selectedLocation.getW4id());
                a.startActivity(intent);
            });
        } else
            a.findViewById("AddTaskButton").setVisibility(View.GONE);
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.populateTasksList(a);
            a.populateTasksInProgressList(a);
            a.populateTasksCompletedList(a);
        });

        a.populateTasksList(a);
        a.populateTasksInProgressList(a);
        a.populateTasksCompletedList(a);
    }

    populateTasksList(context) {
        context.findViewById("TasksList").removeAllViews();
        var readOnly = !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_TASKS] && !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_TASKS];
        var taskList = W4_Funcs.getPermittedTaskList();
        var trimmedTaskList = [];
        if (context.byPerson) {
            var assignedShifts = W4_Funcs.getAssignedShiftsIDs(context.selectedPerson.getW4id());
            for (let task of taskList) {
                if (assignedShifts.includes(task.getShiftID()))
                    trimmedTaskList.push(task);
            }
        } else {
            for (let task of taskList) {
                var location = W4_Funcs.getLocationFromShiftID(task.getShiftID());
                if (location != null && location.getW4id() == (context.selectedLocation.getW4id()))
                    trimmedTaskList.push(task);
            }
        }
        var searchText = W4_Funcs.standardizeString(context.search_edittext.getText());
        if (searchText != ("")) {
            trimmedTaskList = Asset.getSearchedAssets(trimmedTaskList, searchText);
        }
        for (var i = 0; i < trimmedTaskList.length; ++i) {
            var inflater = LayoutInflater.from(context);
            var view = inflater.inflate(R.layout.task_list_item, null, true);
            var editButton = view.findViewById("TaskButton");
            var task = trimmedTaskList[i];
            var locText = "";
            var location = W4_Funcs.getLocationFromShiftID(task.getShiftID());
            if (location != null) {
                locText = " at " + location.getName();
            }
            editButton.setText(task.getName() + locText);

            editButton.ele.w4id = task.getW4id();
            editButton.addEventListener("click", function (event) {
                var intent;
                if (readOnly) {
                    intent = new Intent(context, new ViewTaskActivity());
                } else {
                    intent = new Intent(context, new NewEditTaskActivity());
                }
                intent.putExtra("id", event.target.w4id);
                context.startActivity(intent);
            });

            context.findViewById("Button_Export_Task_Summary2").addEventListener("click", function () {
                var name0 = "";
                var location_id = "";
                var person_id = "";
                if (context.byPerson) {
                    name0 = context.selectedPerson.getFirst_name() + " " + context.selectedPerson.getLast_name();
                    person_id = context.selectedPerson.getW4id();
                } else {
                    name0 = context.selectedLocation.getName();
                    location_id = context.selectedLocation.getW4id();
                }
                ReportTypesActivity.buttonExportTaskSummary_Skip(context, context.byPerson, name0, location_id, person_id);
            });
            context.findViewById("TasksList").addView(view);
        }
    }

    populateTasksInProgressList(context) {
        context.findViewById("TasksInProgressList").removeAllViews();
        var taskList = W4_Funcs.getPermittedTaskInProgressList();
        var trimmedTaskList = [];
        if (context.byPerson) {
            for (let task of taskList) {
                if (task.getPersonID() == (context.selectedPerson.getW4id()))
                    trimmedTaskList.push(task);
            }
        } else {
            for (let task of taskList) {
                var location = W4_Funcs.getLocationFromShiftID(task.getShiftID());
                if (location != null && location.getW4id() == (context.selectedLocation.getW4id()))
                    trimmedTaskList.push(task);
            }
        }
        var searchText = W4_Funcs.standardizeString(context.search_edittext.getText());
        if (searchText != ("")) {
            trimmedTaskList = Asset.getSearchedAssets(trimmedTaskList, searchText);
        }
        for (var i = 0; i < trimmedTaskList.length; ++i) {
            var taskOccurence = trimmedTaskList[i];
            var inflater = LayoutInflater.from(context);
            var view = inflater.inflate(R.layout.generic_list_item, null, true);
            var button = view.findViewById("Generic_Button");
            var updatedTime = new W4DateTime(taskOccurence.getUpdatedDateTime());
            var timeString = W4_Funcs.getFriendlyDateText(updatedTime);
            var locText = "";
            var location = W4_Funcs.getLocationFromShiftID(taskOccurence.getShiftID());
            if (location != null) {
                locText = "at " + location.getName() + " ";
            }

            button.setText(taskOccurence.getName() + " " + locText + "- Updated " + timeString + " " + W4_Funcs.getTimeText(updatedTime));
            button.ele.w4id = taskOccurence.getW4id();
            button.addEventListener("click", function (event) {
                var intent = new Intent(context, new DoTaskInProgressActivity());
                intent.putExtra("id", event.target.w4id);
                intent.putExtra("new", false);
                context.startActivity(intent);
            });
            context.findViewById("TasksInProgressList").addView(view);
        }
        if (trimmedTaskList.length > 0) {
            context.findViewById("View_Tasks_Space1").setVisibility(View.VISIBLE);
            context.findViewById("View_TasksInProgress_Label").setVisibility(View.VISIBLE);
        } else {
            context.findViewById("View_Tasks_Space1").setVisibility(View.GONE);
            context.findViewById("View_TasksInProgress_Label").setVisibility(View.GONE);
        }
    }

    populateTasksCompletedList(context) {
        context.findViewById("TasksCompletedList").removeAllViews();
        var taskList = W4_Funcs.getPermittedTaskCompletedList();
        var trimmedTaskList = [];
        if (context.byPerson) {
            for (let task of taskList) {
                if (task.getPersonID() == (context.selectedPerson.getW4id()))
                    trimmedTaskList.push(task);
            }
        } else {
            for (let task of taskList) {
                var location = W4_Funcs.getLocationFromShiftID(task.getShiftID());
                if (location != null && location.getW4id() == (context.selectedLocation.getW4id()))
                    trimmedTaskList.push(task);
            }
        }
        var searchText = W4_Funcs.standardizeString(context.search_edittext.getText());
        if (searchText != ("")) {
            trimmedTaskList = Asset.getSearchedAssets(trimmedTaskList, searchText);
        }
        for (var i = 0; i < trimmedTaskList.length; ++i) {
            var taskOccurence = trimmedTaskList[i];
            var timesCompleted = taskOccurence.getTimesCompleted();
            var goals_met = 0;
            var goals_total = timesCompleted.length;
            for (var m = 0; m < timesCompleted.length; ++m) {
                if (taskOccurence.method_wasTaskCompletedOnTime(m))
                    ++goals_met;
            }
            var inflater = LayoutInflater.from(context);
            var view = inflater.inflate(R.layout.task_completed_list_item, null, true);
            var button = view.findViewById("Button");
            var completedTime = new W4DateTime(taskOccurence.getUpdatedDateTime());
            var timeString = W4_Funcs.getFriendlyDateText(completedTime);
            var locText = "";
            var location = W4_Funcs.getLocationFromShiftID(taskOccurence.getShiftID());
            if (location != null) {
                locText = "at " + location.getName() + " ";
            }

            button.setText(taskOccurence.getName() + " " + locText + "- Finished " + timeString + " " + W4_Funcs.getTimeText(completedTime));
            button.ele.w4id = taskOccurence.getW4id();
            button.addEventListener("click", function (event) {
                var intent = new Intent(context, new ViewTaskCompleteActivity());
                intent.putExtra("id", event.target.w4id);
                context.startActivity(intent);

            });
            var text = view.findViewById("Text");
            text.setText(goals_met + " / " + goals_total + " On Time");
            if (goals_met != goals_total)
                text.setTextColor("#FF0000");
            context.findViewById("TasksCompletedList").addView(view);
        }

        if (trimmedTaskList.length > 0) {
            context.findViewById("View_Tasks_Space2").setVisibility(View.VISIBLE);
            context.findViewById("View_TasksCompleted_Label").setVisibility(View.VISIBLE);
        } else {
            context.findViewById("View_Tasks_Space2").setVisibility(View.GONE);
            context.findViewById("View_TasksCompleted_Label").setVisibility(View.GONE);
        }
    }
}
