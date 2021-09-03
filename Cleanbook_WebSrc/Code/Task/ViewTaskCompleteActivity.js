class ViewTaskCompleteActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate;
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_view_task_complete);
        a.getSupportActionBar().setTitle("View Complete Task Sheet");
        var tasksheet_id = a.getIntent().getStringExtra("id");
        a.selectedTaskSheetOccurence = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetCompletedList(), tasksheet_id);
        if (a.selectedTaskSheetOccurence == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        } else {
            a.findViewById("Task_Name").setText(a.selectedTaskSheetOccurence.getName());
            a.findViewById("Task_Date_Label").setText(W4_Funcs.getFriendlyDayText(new W4DateTime(a.selectedTaskSheetOccurence.getStartedDateTime())));
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.selectedTaskSheetOccurence.getShiftID());
            if (shift != null)
                a.findViewById("Task_Shift_Text").setText(shift.method_getFullName());
            var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.selectedTaskSheetOccurence.getPersonID());
            if (person != null)
                a.findViewById("Task_Person_Label").setText(person.getFirst_name() + " " + person.getLast_name());
            var task_strings = a.selectedTaskSheetOccurence.getTasks();
            var subTask_strings = a.selectedTaskSheetOccurence.getSubTasks();
            var durations = a.selectedTaskSheetOccurence.getDurations();
            var task_ll = a.findViewById("Task_Linear_Layout");
            for (var i = 0; task_strings != null && i < task_strings.length; ++i) {
                var subtask_views = [];
                for (var j = 0; subTask_strings != null && i < subTask_strings.length && subTask_strings[i] != null && j < subTask_strings[i].length; ++j) {
                    var subtask_view = a.getSubtaskView(this, subTask_strings[i][j]);
                    subtask_views.push(subtask_view);
                }
                var task_view = this.getTaskView(this, task_strings[i], durations[i], i);
                task_ll.addView(task_view);
                for (let view of subtask_views)
                    task_ll.addView(view);
            }
        }
        var writeable = W4_Funcs.isAssetWriteable(Asset.PERMISSION_ALL_TASKS);
        var button = a.findViewById("Delete_Complete_Task");
        if (writeable) {
            button.setVisibility(View.VISIBLE);
            button.addEventListener("click", function () {
                var intent = new Intent(this, new ConfirmActivity());
                intent.putExtra("description", "Are you sure you want to delete this Task Occurence?");
                a.startActivityForResult(intent, MainActivity.requestCodeTaskCompletedDelete);
            });
        } else
            button.setVisibility(View.GONE);
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeTaskCompletedDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var reffTask = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE).child(this.selectedTaskSheetOccurence.getW4id());
                W4_Funcs.deleteFromDB(reffTask, "Deleted task sheet " + this.selectedTaskSheetOccurence.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(this.selectedTaskSheetOccurence.getLocationID()) + "|Person:" + W4_DBLog.getPersonStringForLog(this.selectedTaskSheetOccurence.getPersonID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(this.selectedTaskSheetOccurence.getShiftID()) + "|");
                MainActivity.w4Toast(this, "Successfully deleted Task Occurence", Toast.LENGTH_LONG);
                this.finish();
            }
        }
    }

    getTaskView(context, name0, duration, i) {
        var inflater = LayoutInflater.from(context);
        var task_view = inflater.inflate(R.layout.task_complete_task_view, null, true);
        var task_name = task_view.findViewById("task_name");
        name0 = name0 + "  -  " + W4_Funcs.getHoursMinutesText(duration);
        task_name.setText(name0);
        var timesCompletedArray = this.selectedTaskSheetOccurence.getTimesCompleted();
        var timeCompleted = timesCompletedArray[i];
        var time_complete_textview = task_view.findViewById("task_time_complete");
        if (timeCompleted != -1) {
            time_complete_textview.setVisibility(View.VISIBLE);
            var minutesTaken = this.selectedTaskSheetOccurence.method_howLongDidTaskTake(i);
            time_complete_textview.setText(W4_Funcs.getHoursMinutesText(minutesTaken));

            if (duration != -1 && !this.selectedTaskSheetOccurence.method_wasTaskCompletedOnTime(i))
                time_complete_textview.setTextColor("#F40000"); //Red
            else
                time_complete_textview.setTextColor("grey");
        } else
            time_complete_textview.setVisibility(View.GONE);
        return task_view;
    }

    getSubtaskView(context, name0) {
        var inflater = LayoutInflater.from(context);
        var subtask_view = inflater.inflate(R.layout.task_complete_subtask_view, null, true);
        var task_name = subtask_view.findViewById("task_name");
        task_name.setText(name0);
        return subtask_view;
    }
}
