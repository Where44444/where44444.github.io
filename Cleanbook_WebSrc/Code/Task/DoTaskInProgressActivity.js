class DoTaskInProgressActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Perform Tasks");
        a.setContentView(R.layout.activity_do_task_in_progress);
        var newTask = a.getIntent().getBooleanExtra("new", false);
        var id = a.getIntent().getStringExtra("id");
        var writeable = W4_Funcs.isAssetWriteable(Asset.PERMISSION_ALL_TASKS);
        if (writeable)
            a.findViewById("Delete_Do_Task_Occurence").setVisibility(View.VISIBLE);
        else
            a.findViewById("Delete_Do_Task_Occurence").setVisibility(View.GONE);

        if (newTask) {
            a.selectedTaskSheet = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetList(), id);
            if (a.selectedTaskSheet == null) {
                MainActivity.w4Toast(a, MainActivity.missingAsset, Toast.LENGTH_LONG);
                a.finish();
                return;
            }
            var timesCompleted = [];
            var tasks = a.selectedTaskSheet.getTasks();
            if (tasks != null)
                for (var i = 0; i < tasks.length; ++i) {
                    timesCompleted.push(-1);
                }
            a.reffTaskOccurence = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE).push();
            var now = new W4DateTime();
            a.selectedTaskSheetOccurence = new TaskSheetOccurence(a.selectedTaskSheet, timesCompleted, now.getMillis(), now.getMillis(), false, MainActivity.currentPerson.getW4id());
            a.selectedTaskSheetOccurence.setW4id(a.reffTaskOccurence.key);
            a.selectedTaskSheetOccurence.trimUncommonTasks(now);
            a.selectedTaskSheetOccurence.clearRepetitionInfo();
            W4_Funcs.writeToDB(a.reffTaskOccurence, a.selectedTaskSheetOccurence, "");
        } else {
            a.selectedTaskSheetOccurence = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetInProgressList(), id);
            if (a.selectedTaskSheetOccurence == null) {
                MainActivity.w4Toast(a, MainActivity.missingAsset, Toast.LENGTH_LONG);
                a.finish();
                return;
            }
            a.reffTaskOccurence = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE).child(id);
        }


        MainActivity.w4SaveState.setLastTaskInProgressID(a.selectedTaskSheetOccurence.getW4id());
        MainActivity.saveState(8);
        HomeActivity.initializeHomeScreen();
        a.findViewById("Do_Task_Name").setText(a.selectedTaskSheetOccurence.getName());
        a.findViewById("Do_Task_Date_Label").setText(W4_Funcs.getFriendlyDayText(new W4DateTime(a.selectedTaskSheetOccurence.getStartedDateTime())));
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.selectedTaskSheetOccurence.getShiftID());
        if (shift != null)
            a.findViewById("Do_Task_Shift_Label").setText(shift.method_getFullName());
        if (newTask) {
            a.findViewById("Do_Task_Person_Label").setText(MainActivity.currentPerson.getFirst_name() + " " + MainActivity.currentPerson.getLast_name());
        } else {
            var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.selectedTaskSheetOccurence.getPersonID());
            if (person != null)
                a.findViewById("Do_Task_Person_Label").setText(person.getFirst_name() + " " + person.getLast_name());
        }
        var task_strings = a.selectedTaskSheetOccurence.getTasks();
        var subTask_strings = a.selectedTaskSheetOccurence.getSubTasks();
        var durations = a.selectedTaskSheetOccurence.getDurations();
        var task_ll = a.findViewById("Task_Linear_Layout");
        for (var i = 0; task_strings != null && i < task_strings.length; ++i) {
            var subtask_views = [];
            for (var j = 0; subTask_strings != null && i < subTask_strings.length && subTask_strings[i] != null && j < subTask_strings[i].length; ++j) {
                var subtask_view = a.getSubtaskView(a, subTask_strings[i][j]);
                subtask_views.push(subtask_view);
            }
            var task_view = a.getTaskView(a, task_strings[i], i, a.selectedTaskSheetOccurence, durations[i]);
            task_ll.addView(task_view);
            for (let view of subtask_views)
                task_ll.addView(view);
        }


        if (writeable) {
            var button = a.findViewById("Delete_Do_Task_Occurence");
            button.addEventListener("click", function () {
                var intent = new Intent(a, new ConfirmActivity());
                intent.putExtra("description", "Are you sure you want to delete this Task Occurence?");
                a.startActivityForResult(intent, MainActivity.requestCodeTaskInProgressDelete);
            });
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        var a = this;
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeTaskInProgressDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var reffTask = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE).child(a.selectedTaskSheetOccurence.getW4id());
                W4_Funcs.deleteFromDB(reffTask, "Deleted task occurence " + a.selectedTaskSheetOccurence.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(a.selectedTaskSheetOccurence.getLocationID()) + "|Person:" + W4_DBLog.getPersonStringForLog(a.selectedTaskSheetOccurence.getPersonID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(a.selectedTaskSheetOccurence.getShiftID()) + "|");
                MainActivity.w4Toast(a, "Successfully deleted Task Occurence", Toast.LENGTH_LONG);
                a.finish();
            }
        }
    }

    getTaskView(context, name0, i, taskSheetOccurence, duration) {
        var a = this;
        var inflater = LayoutInflater.from(context);
        var task_view = inflater.inflate(R.layout.task_do_task_view, null, true);
        var task_name_button = task_view.findViewById("task_name");
        name0 = name0 + "  -  " + W4_Funcs.getHoursMinutesText(duration);
        var name1 = name0;
        task_name_button.setText(name1);
        task_name_button.addEventListener("click", function () {
            if (taskSheetOccurence.getPersonID() == (MainActivity.currentPerson.getW4id()) || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_TASKS]) {
                a.setTaskButton(name1, i, taskSheetOccurence, duration, task_name_button, task_view, true);
                W4_Funcs.writeToDB(a.reffTaskOccurence, a.selectedTaskSheetOccurence, "");
            } else {
                MainActivity.w4Toast(a, MainActivity.noDoTaskPermission, Toast.LENGTH_LONG);
            }
        });
        a.setTaskButton(name1, i, taskSheetOccurence, duration, task_name_button, task_view, false);
        return task_view;
    }

    getSubtaskView(context, name0) {
        var inflater = LayoutInflater.from(context);
        var subtask_view = inflater.inflate(R.layout.task_do_subtask_view, null, true);
        var task_name = subtask_view.findViewById("task_name");
        task_name.setText(name0);
        return subtask_view;
    }

    setTaskButton(name1, i, taskSheetOccurence, duration, task_name_button, task_view, toggle) {
        var a = this;
        var dateTimesCompleted = taskSheetOccurence.getTimesCompleted();
        var now = new W4DateTime();
        if (toggle) {
            if (dateTimesCompleted[i] == -1) {
                dateTimesCompleted[i] = now.getMillis();
            } else {
                dateTimesCompleted[i] = -1;
            }
        }
        var time_complete_textview = task_view.findViewById("task_time_complete");
        if (dateTimesCompleted[i] != -1) {
            time_complete_textview.setVisibility(View.VISIBLE);
            var minutesTaken = taskSheetOccurence.method_howLongDidTaskTake(i);
            time_complete_textview.setText(W4_Funcs.getHoursMinutesText(minutesTaken));

            if (duration != -1 && !taskSheetOccurence.method_wasTaskCompletedOnTime(i))
                time_complete_textview.setTextColor("#F40000"); //Red
            else
                time_complete_textview.setTextColor("gray");
            var content = "<s>" + name1 + "</s>";
            task_name_button.setText(content);
            var completed = true;
            for (let time of dateTimesCompleted) {
                if (time == -1)
                    completed = false;
            }
            taskSheetOccurence.setCompleted(completed);
            taskSheetOccurence.setUpdatedDateTime((new W4DateTime()).getMillis());
            if (completed)
                MainActivity.w4Toast(a, "Task Sheet Completed!", Toast.LENGTH_LONG);
        } else {
            time_complete_textview.setVisibility(View.GONE);
            task_name_button.setText(name1);
            taskSheetOccurence.setCompleted(false);
        }
    }
}
