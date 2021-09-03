class ViewTaskActivity extends W4Activity {

    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.setContentView(R.layout.activity_view_task);
        this.getSupportActionBar().setTitle("View Task Sheet");
        var tasksheet_id = this.getIntent().getStringExtra("id");
        this.isTemplate = this.getIntent().getBooleanExtra("isTemplate", false);
        if (this.isTemplate) {
            this.selectedTaskSheet = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetTemplateList(), tasksheet_id);
        }
        else {
            this.selectedTaskSheet = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetList(), tasksheet_id);
        }
        if (this.selectedTaskSheet == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            this.finish();
            return;
        } else {
            this.findViewById("Task_Name").setText(this.selectedTaskSheet.getName());
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), this.selectedTaskSheet.getShiftID());
            if (shift != null)
                this.findViewById("Task_Shift_Text").setText(shift.method_getFullName());
            var task_strings = this.selectedTaskSheet.getTasks();
            var subTask_strings = this.selectedTaskSheet.getSubTasks();
            var durations = this.selectedTaskSheet.getDurations();
            var task_ll = this.findViewById("Task_Linear_Layout");
            for (var i = 0; task_strings != null && i < task_strings.length; ++i) {
                var subtask_views = [];
                for (var j = 0; subTask_strings != null && i < subTask_strings.length && subTask_strings[i] != null && j < subTask_strings[i].length; ++j) {
                    var subtask_view = this.getSubtaskView(this, subTask_strings[i][j]);
                    subtask_views.push(subtask_view);
                }
                var task_view = this.getTaskView(this, task_strings[i], durations[i]);
                task_ll.addView(task_view);
                for (let view of subtask_views)
                    task_ll.addView(view);
            }
        }

        if (this.isTemplate) {
            this.findViewById("Task_Shift_Label").setVisibility(View.GONE);
            this.findViewById("Task_Shift_Text").setVisibility(View.GONE);
        }
    }

    getTaskView(context, name, duration) {
        var inflater = LayoutInflater.from(context);
        var task_view = inflater.inflate(R.layout.task_view_task_view, null, true);
        var task_name = task_view.findViewById("task_name");
        name = name + "  -  " + W4_Funcs.getHoursMinutesText(duration);
        task_name.setText(name);
        return task_view;
    }

    getSubtaskView(context, name) {
        var inflater = LayoutInflater.from(context);
        var subtask_view = inflater.inflate(R.layout.task_view_subtask_view, null, true);
        var task_name = subtask_view.findViewById("task_name");
        task_name.setText(name);
        return subtask_view;
    }
}
