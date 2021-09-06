class NewEditTaskActivity extends W4Activity {

    //     String[] this.shiftIDs;
    //     var this.selectedShift = null;
    //     var this.selectedTaskSheet = new TaskSheet();
    //     var this.selected_preview_RD_Struct = new RepeatingDateStruct();
    //     var this.selected_uncommon_view = null;
    //     var this.dateTimeStart = null;
    //     var this.dateTimeEnd = null;
    // var this.tasksheet_id = null;
    //     var this.location_id = null;
    //     var this.newTaskSheet = false;
    //     var this.isTemplate = false;


    onOptionsItemSelected(item) {
        switch (item.getItemId()) {
            case "home":
                var settingsExited = false;
                if (this.selected_uncommon_view != null) {
                    var uncommon_ll = this.selected_uncommon_view.findViewById("ID_UNCOMMON_LL");
                    if (uncommon_ll.getVisibility() == View.VISIBLE) {
                        settingsExited = true;
                        this.settingsSetMenuVisibility(uncommon_ll.getVisibility() == View.VISIBLE, this.selected_uncommon_view);
                    }
                }
                if (!settingsExited) {
                    this.finish();
                }
                return true;
        }
    }


    onCreate() {
        var a = this;
        this.radioNameSuffix = 0;
        a.selectedTaskSheet = new TaskSheet();
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_task);
        a.tasksheet_id = a.getIntent().getStringExtra("id");
        a.location_id = a.getIntent().getStringExtra("location_id");
        a.newTaskSheet = (a.tasksheet_id == null);
        a.isTemplate = a.getIntent().getBooleanExtra("isTemplate", false);
        if (a.newTaskSheet)
            a.findViewById("Delete_Edit_Task").setVisibility(View.GONE);
        else
            a.findViewById("Delete_Edit_Task").setVisibility(View.VISIBLE);
        var spinner = a.findViewById("Task_Shift_Spinner");
        var shiftList = W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_TASKS);
        var shiftSpinnerItems = null;
        var shiftNames = null;
        if (shiftList.length > 0) {
            spinner.setVisibility(View.VISIBLE);
            shiftSpinnerItems = W4_Funcs.getShiftSpinnerItems(shiftList);
            shiftNames = shiftSpinnerItems[0];
            a.shiftIDs = shiftSpinnerItems[1];
            var spinnerArrayAdapter = new ArrayAdapter(
                this, R.layout.spinner_item, shiftNames
            );
            spinner.setAdapter(spinnerArrayAdapter);
            var shiftChangeListener = function () {
                var position = spinner.getSelectedItemPosition();
                a.selectedShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.shiftIDs[position]);
                a.dateTimeStart = new W4DateTime(a.selectedShift.getStartTime());
                a.dateTimeEnd = a.dateTimeStart;
            };
            spinner.addEventListener("change", shiftChangeListener);
            shiftChangeListener();
        } else {
            MainActivity.w4Toast(this, "Creating a Task Sheet requires a Shift!", Toast.LENGTH_LONG);
            a.finish();
        }
        var shiftID = a.shiftIDs[0];
        if (a.newTaskSheet) {
            if (a.location_id != null) { //Set shift spinner to first found shift at selected location in byType list
                for (var i = 0; i < a.shiftIDs.length; ++i) {
                    var shift1 = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.shiftIDs[i]);
                    if (shift1 != null && shift1.getLocationID() == (a.location_id)) {
                        shiftID = shift1.getW4id();
                        break;
                    }
                }
            }
        }
        else {
            if (a.isTemplate) {
                a.selectedTaskSheet = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetTemplateList(), a.tasksheet_id);
            } else {
                a.selectedTaskSheet = Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetList(), a.tasksheet_id);
            }
            if (a.selectedTaskSheet == null) {
                MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
                a.finish();
                return;
            }
            shiftID = a.selectedTaskSheet.getShiftID();
        }
        var pos = W4_Funcs.getPositionOfStringInArray(a.shiftIDs, shiftID);
        if (pos != -1) {
            a.findViewById("Task_Shift_Spinner").setSelection(pos);
            a.selectedShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shiftID);
            a.dateTimeStart = new W4DateTime(a.selectedShift.getStartTime());
            a.dateTimeEnd = a.dateTimeStart;
        }
        var button = a.findViewById("Import_Template");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_TASKS);
            intent.putExtra("newEditActivity", new NewEditTaskActivity());
            intent.putExtra("returnAsset", true);
            a.startActivityForResult(intent, MainActivity.requestCodeReturnTemplateAsset);
        });
        var button = a.findViewById("Task_Add_Area");
        button.addEventListener("click", function () {
            a.addTask(a);
        });
        var button = a.findViewById("Cancel_Add_Task");
        button.addEventListener("click", function () {
            a.finish();
        });
        var button = a.findViewById("Accept_Add_Task");
        button.addEventListener("click", function () {
            var linearLayout = a.findViewById("Task_Linear_Layout");
            var childCount = linearLayout.getChildCount();
            var task_names = [];
            var subTask_List_Names = [];
            var subTask_names = [];
            var durations = [];
            var repeatAmount = [];
            var repeatUnit = [];
            var endUnit = [];
            var repeatEndOccurences = [];
            var repeatEndDate = [];
            var weeklyRepeatDays = [];
            var monthlyRepeatType = [];
            for (var i = 0; i < childCount; ++i) {
                var view2 = linearLayout.getChildAt(i);
                if (view2.getId() == "TASK_VIEW") {
                    task_names.push(view2.findViewById("ID_TASK").getText());
                    subTask_names = [];
                    subTask_List_Names.push(subTask_names);
                    var hoursPos = view2.findViewById("hours_spinner").getSelectedItemPosition();
                    var minutesPos = view2.findViewById("minutes_spinner").getSelectedItemPosition();
                    durations.push(hoursPos * 60 + minutesPos);
                    var repeatAmount1 = W4_Funcs.getIntFromEditText(view2.findViewById("Edit_Task_RepeatEvery", 1));
                    if (repeatAmount1 < 1)
                        repeatAmount1 = 1;
                    if (!view2.findViewById("Edit_Task_RepeatCheckBox").isChecked())
                        repeatAmount1 = 0;
                    var repeatUnit1 = view2.findViewById("Edit_Task_RepeatUnit").getSelectedItemPosition();
                    var endUnit1 = Shift.ENDUNIT_NEVER;
                    if (view2.findViewById("Edit_Task_Radio_Never").isChecked())
                        endUnit1 = Shift.ENDUNIT_NEVER;
                    else if (view2.findViewById("Edit_Task_Radio_AfterOccurences").isChecked())
                        endUnit1 = Shift.ENDUNIT_OCCURENCES;
                    else if (view2.findViewById("Edit_Task_Radio_OnDate").isChecked())
                        endUnit1 = Shift.ENDUNIT_ONDATE;
                    var repeatEndOccurences1 = W4_Funcs.getIntFromEditText(view2.findViewById("Edit_Task_RepeatOccurences", 1));
                    if (repeatEndOccurences1 < 1)
                        repeatEndOccurences1 = 1;
                    var textViewVarRepeatEndDate = view2.findViewById("VAR_REPEAT_END_DATE");
                    var repeatEndDate1 = Number(textViewVarRepeatEndDate.getText());
                    var weeklyRepeatDays1 = [];
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Sunday").isChecked());
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Monday").isChecked());
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Tuesday").isChecked());
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Wednesday").isChecked());
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Thursday").isChecked());
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Friday").isChecked());
                    weeklyRepeatDays1.push(view2.findViewById("Edit_Task_Repeat_Saturday").isChecked());
                    var monthlyRepeatType1 = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
                    if (view2.findViewById("Edit_Task_Radio_DayOfMonth").isChecked())
                        monthlyRepeatType1 = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
                    else
                        monthlyRepeatType1 = Shift.MONTHLYREPEATTYPE_DAYOFWEEK;

                    repeatAmount.push(repeatAmount1);
                    repeatUnit.push(repeatUnit1);
                    endUnit.push(endUnit1);
                    repeatEndOccurences.push(repeatEndOccurences1);
                    repeatEndDate.push(repeatEndDate1);
                    weeklyRepeatDays.push(weeklyRepeatDays1);
                    monthlyRepeatType.push(monthlyRepeatType1);

                } else { //SUBTASK_VIEW
                    subTask_names.push(view2.findViewById("ID_SUBTASK").getText());
                }
            }
            var taskSheetName = a.findViewById("Task_Name").getText();
            if (taskSheetName == (""))
                taskSheetName = "Task Sheet " + (MainActivity.theCompany.getTaskSheetList().length + MainActivity.theCompany.getTaskSheetTemplateList().length + 1);
            var spinner = a.findViewById("Task_Shift_Spinner");
            var shiftID = "";
            if (spinner.getSelectedItemPosition() >= 0 && spinner.getSelectedItemPosition() < a.shiftIDs.length) {
                shiftID = a.shiftIDs[spinner.getSelectedItemPosition()];
            } else {
                MainActivity.w4Toast(a, "Error getting shift from list", Toast.LENGTH_LONG);
                return;
            }
            var shift = Asset.getAssetbyId(W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_TASKS), shiftID);
            if (shift == null) {
                MainActivity.w4Toast(a, "Shift doesn't exist or you don't have permission to use it", Toast.LENGTH_LONG);
                return;
            }
            var taskSheet = new TaskSheet("", taskSheetName, shift.getLocationID(), shiftID, task_names, subTask_List_Names, durations, repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType, a.isTemplate);
            var reffTask;
            if (a.newTaskSheet)
                reffTask = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS).push();
            else
                reffTask = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS).child(a.tasksheet_id);

            taskSheet.setW4id(reffTask.key);
            W4_Funcs.writeToDB(reffTask, taskSheet, "");
            if (a.newTaskSheet)
                MainActivity.w4Toast(this, "Successfully added new Task Sheet", Toast.LENGTH_LONG);
            else
                MainActivity.w4Toast(this, "Successfully edited Task Sheet", Toast.LENGTH_LONG);
            a.finish();
        });

        if (!a.newTaskSheet) {
            button = a.findViewById("Delete_Edit_Task");
            button.addEventListener("click", function () {
                var intent = new Intent(this, new ConfirmActivity());
                intent.putExtra("description", "Are you sure you want to delete this Task Sheet?");
                a.startActivityForResult(intent, MainActivity.requestCodeTaskDelete);
            });
        }

        a.setUIFromSelectedTask(false);
    }

    setUIFromSelectedTask(templateImport) {
        this.findViewById("Task_Linear_Layout").removeAllViews();
        if (this.newTaskSheet) {
            if (this.isTemplate) {
                this.getSupportActionBar().setTitle("New Task Sheet Template");
            } else {
                this.getSupportActionBar().setTitle("New Task Sheet");
            }
        } else {
            if (this.isTemplate) {
                this.getSupportActionBar().setTitle("Edit Task Sheet Template");
            } else {
                this.getSupportActionBar().setTitle("Edit Task Sheet");
            }
        }

        this.findViewById("Task_Name").setText(this.selectedTaskSheet.getName());
        var task_strings = this.selectedTaskSheet.getTasks();
        var subTask_strings = this.selectedTaskSheet.getSubTasks();
        var durations = this.selectedTaskSheet.getDurations();
        var task_ll = this.findViewById("Task_Linear_Layout");
        for (var i = 0; task_strings != null && i < task_strings.length; ++i) {
            var task_view = this.getTaskView(this, task_strings[i], durations[i], i);
            task_ll.addView(task_view);
            for (var j = 0; subTask_strings != null && i < subTask_strings.length && subTask_strings[i] != null && j < subTask_strings[i].length; ++j) {
                var subtask_view = this.getSubtaskView(this, subTask_strings[i][j]);
                task_ll.addView(subtask_view);
            }
        }

        if (!templateImport && this.newTaskSheet) {
            this.addTask(this);
        }

        if (this.isTemplate) {
            this.findViewById("Task_Shift_Text").setVisibility(View.GONE);
            this.findViewById("Task_Shift_Spinner").setVisibility(View.GONE);
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeTaskDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var reffTask = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS).child(this.selectedTaskSheet.getW4id());
                W4_Funcs.deleteFromDB(reffTask, "Deleted task sheet " + this.selectedTaskSheet.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(this.selectedTaskSheet.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(this.selectedTaskSheet.getShiftID()) + "|");
                MainActivity.w4Toast(this, "Successfully deleted Task Sheet", Toast.LENGTH_LONG);
                this.finish();
            }
        } else if (requestCode == MainActivity.requestCodeCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                var textViewVarRepeatEndDate = this.selected_uncommon_view.findViewById("VAR_REPEAT_END_DATE");
                textViewVarRepeatEndDate.setText(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0).getMillis() + "");
                this.setRepeatEndOnDateButton(this.selected_uncommon_view);
                this.updateEdit_RepeatSummaryText(this.selected_uncommon_view, this.dateTimeStart, this.dateTimeEnd);
            }
        }
        else if (requestCode == MainActivity.requestCodeReturnTemplateAsset) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                this.selectedTaskSheet1 = new TaskSheet(Asset.getAssetbyId(MainActivity.theCompany.getTaskSheetTemplateList(), data.getStringExtra("returnID")));
                this.selectedTaskSheet1.setW4id(this.selectedTaskSheet.getW4id());
                this.selectedTaskSheet = this.selectedTaskSheet1;
                this.setUIFromSelectedTask(true);
            }
        }
    }

    addTask(context) {
        var i1 = 0;
        if (this.selectedTaskSheet != null) {
            i1 = this.selectedTaskSheet.getTasks().length;
        }
        var task_view = this.getTaskView(context, "", 30, i1);
        var subtask_view = this.getSubtaskView(context, "");

        this.findViewById("Task_Linear_Layout").addView(task_view);
        this.findViewById("Task_Linear_Layout").addView(subtask_view);
    }

    getTaskView(context, name0, duration, i1) {
        var a = this;
        var inflater = LayoutInflater.from(context);
        var view1 = inflater.inflate(R.layout.task_task_view, null, true);

        view1.findViewById("Edit_Task_Radio_Never").ele.name += this.radioNameSuffix;
        view1.findViewById("Edit_Task_Radio_AfterOccurences").ele.name += this.radioNameSuffix;
        view1.findViewById("Edit_Task_Radio_OnDate").ele.name += this.radioNameSuffix;
        view1.findViewById("Edit_Task_Radio_DayOfMonth").ele.name += this.radioNameSuffix;
        view1.findViewById("Edit_Task_Radio_DayOfWeek").ele.name += this.radioNameSuffix;
        ++this.radioNameSuffix;

        var calendar_view = view1.findViewById("Edit_Task_Calendar_RepeatSummary");
        caleandar(calendar_view.ele, [], {});

        calendar_view.addEventListener("click", function () {
            a.redecorateRepeatSummaryCalendar(view1);
        });

        view1.findViewById("ID_TASK").setText(name0);
        var times = W4_Funcs.minutesToHoursAndMinutes(duration);
        var spinner = view1.findViewById("hours_spinner");
        var spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item_right_align, Asset.HOURS_0_23
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(times[0]);
        var spinner = view1.findViewById("minutes_spinner");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item_right_align, Asset.MINUTES1
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(times[1]);
        var button = view1.findViewById("ID_TASK_MINU_BUTTON");
        button.addEventListener("click", function () {
            var sheet = a.findViewById("Task_Linear_Layout");
            var startIndex = sheet.indexOfChild(view1);
            sheet.removeView(view1);
            while (sheet.getChildCount() > startIndex) {
                var child = sheet.getChildAt(startIndex);
                if (child.getId() == "SUBTASK_VIEW")
                    sheet.removeView(child);
                else
                    break;
            }
            a.settingsSetMenuVisibility(true, null);
        });
        var imageButton = view1.findViewById("ID_TASK_SETTINGS_BUTTON");
        imageButton.addEventListener("click", function () {
            a.selected_uncommon_view = view1;
            var uncommon_ll = view1.findViewById("ID_UNCOMMON_LL");
            a.settingsSetMenuVisibility(uncommon_ll.getVisibility() == View.VISIBLE, view1);
            a.setRepeatEveryUnitLabel(view1);
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
            a.setRepeatEndOnDateButton(view1);

        });
        var repeatAmount = 0; //Repeat Every X Day (repeat Unit)
        var repeatUnit = 0;//DAILY, WEEKLY, MONTHLY, YEARLY
        var endUnit = 0; //Never, After Occurences, On a Date
        var repeatEndOccurences = 1;
        var weeklyRepeatDays = [
            false,
            false,
            false,
            false,
            false,
            false,
            false];
        var monthlyRepeatType = 0; //Day of Month, Day of Week
        var textViewVarRepeatEndDate = view1.findViewById("VAR_REPEAT_END_DATE");
        textViewVarRepeatEndDate.setText(new W4DateTime().getMillis() + "");
        if (a.selectedTaskSheet != null && a.selectedTaskSheet.getRepeatAmount() != null && a.selectedTaskSheet.getRepeatAmount().length > i1 && a.selectedTaskSheet.getRepeatAmount()[i1] > 0) {
            repeatAmount = a.selectedTaskSheet.getRepeatAmount()[i1];
            repeatUnit = a.selectedTaskSheet.getRepeatUnit()[i1];
            endUnit = a.selectedTaskSheet.getEndUnit()[i1];
            repeatEndOccurences = a.selectedTaskSheet.getRepeatEndOccurences()[i1];
            textViewVarRepeatEndDate.setText(a.selectedTaskSheet.getRepeatEndDate()[i1] + "");
            weeklyRepeatDays = Array.from(a.selectedTaskSheet.getWeeklyRepeatDays()[i1]);
            monthlyRepeatType = a.selectedTaskSheet.getMonthlyRepeatType()[i1];
        } else if (a.selectedShift != null) {
            repeatUnit = a.selectedShift.getRepeatUnit();
            endUnit = a.selectedShift.getEndUnit();
            repeatEndOccurences = a.selectedShift.getRepeatEndOccurences();
            textViewVarRepeatEndDate.setText(a.selectedShift.getRepeatEndDate() + "");
            weeklyRepeatDays = Array.from(a.selectedShift.getWeeklyRepeatDays());
            monthlyRepeatType = a.selectedShift.getMonthlyRepeatType();
        }
        var checkBox = view1.findViewById("Edit_Task_RepeatCheckBox");
        checkBox.setChecked(repeatAmount != 0);
        if (checkBox.isChecked()) {
            view1.findViewById("Calendar_Icon").setVisibility(View.VISIBLE);
            view1.findViewById("Edit_Task_RepeatDiv").setVisibility(View.VISIBLE);
        } else {
            view1.findViewById("Calendar_Icon").setVisibility(View.GONE);
            view1.findViewById("Edit_Task_RepeatDiv").setVisibility(View.GONE);
        }
        checkBox.addEventListener("click", function () {
            if (checkBox.isChecked()) {
                view1.findViewById("Calendar_Icon").setVisibility(View.VISIBLE);
                view1.findViewById("Edit_Task_RepeatDiv").setVisibility(View.VISIBLE);
                view1.findViewById("Edit_Task_RepeatEvery").setText("1");
            } else {
                view1.findViewById("Calendar_Icon").setVisibility(View.GONE);
                view1.findViewById("Edit_Task_RepeatDiv").setVisibility(View.GONE);
                view1.findViewById("Edit_Task_RepeatEvery").setText("0");
            }
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var spinner = view1.findViewById("Edit_Task_RepeatUnit");
        spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Asset.REPEAT_UNITS
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(repeatUnit);

        var spinnerChange = function () {
            var position = spinner.getSelectedItemPosition();
            switch (position) {
                case Asset.REPEATUNIT_DAILY:
                    view1.findViewById("Edit_Task_RadioGroup_MonthlyType").setVisibility(View.GONE);
                    view1.findViewById("Edit_Task_RepeatDaysDiv").setVisibility(View.GONE);
                    break;
                case Asset.REPEATUNIT_WEEKLY:
                    view1.findViewById("Edit_Task_RadioGroup_MonthlyType").setVisibility(View.GONE);
                    view1.findViewById("Edit_Task_RepeatDaysDiv").setVisibility(View.VISIBLE);
                    break;
                case Asset.REPEATUNIT_MONTHLY:
                    view1.findViewById("Edit_Task_RadioGroup_MonthlyType").setVisibility(View.VISIBLE);
                    view1.findViewById("Edit_Task_RepeatDaysDiv").setVisibility(View.GONE);
                    break;
                case Asset.REPEATUNIT_YEARLY:
                    view1.findViewById("Edit_Task_RadioGroup_MonthlyType").setVisibility(View.GONE);
                    view1.findViewById("Edit_Task_RepeatDaysDiv").setVisibility(View.GONE);
                    break;
            }
            a.setRepeatEveryUnitLabel(view1);
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        };

        spinner.addEventListener("change", spinnerChange);
        spinnerChange();
        var button = view1.findViewById("Edit_Task_RepeatEvery_Minus");
        button.addEventListener("click", function () {
            var editText = view1.findViewById("Edit_Task_RepeatEvery");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            if (value > 1)
                --value;
            else
                value = 1;
            editText.setText(value + "");
            a.setRepeatEveryUnitLabel(view1);
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var editText = view1.findViewById("Edit_Task_RepeatEvery");
        editText.setText(repeatAmount + "");
        editText.addEventListener('keyup', function () {
            a.setRepeatEveryUnitLabel(view1);
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var button = view1.findViewById("Edit_Task_RepeatEvery_Plus");
        button.addEventListener("click", function () {
            var editText = view1.findViewById("Edit_Task_RepeatEvery");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            ++value;
            editText.setText(value + "");
            a.setRepeatEveryUnitLabel(view1);
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var updateSummaryTextListener = function (activity, position) {
            a.updateEdit_RepeatSummaryText(view1, activity.dateTimeStart, activity.dateTimeEnd);
        };
        view1.findViewById("Edit_Task_Radio_DayOfMonth").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Radio_DayOfWeek").addEventListener("click", updateSummaryTextListener);
        if (monthlyRepeatType == Asset.MONTHLYREPEATTYPE_DAYOFMONTH)
            view1.findViewById("Edit_Task_Radio_DayOfMonth").setChecked(true);
        else
            view1.findViewById("Edit_Task_Radio_DayOfWeek").setChecked(true);

        view1.findViewById("Edit_Task_Repeat_Sunday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Monday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Tuesday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Wednesday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Thursday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Friday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Saturday").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Repeat_Sunday").setChecked(weeklyRepeatDays[0]);
        view1.findViewById("Edit_Task_Repeat_Monday").setChecked(weeklyRepeatDays[1]);
        view1.findViewById("Edit_Task_Repeat_Tuesday").setChecked(weeklyRepeatDays[2]);
        view1.findViewById("Edit_Task_Repeat_Wednesday").setChecked(weeklyRepeatDays[3]);
        view1.findViewById("Edit_Task_Repeat_Thursday").setChecked(weeklyRepeatDays[4]);
        view1.findViewById("Edit_Task_Repeat_Friday").setChecked(weeklyRepeatDays[5]);
        view1.findViewById("Edit_Task_Repeat_Saturday").setChecked(weeklyRepeatDays[6]);

        view1.findViewById("Edit_Task_Radio_Never").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Radio_AfterOccurences").addEventListener("click", updateSummaryTextListener);
        view1.findViewById("Edit_Task_Radio_OnDate").addEventListener("click", updateSummaryTextListener);
        if (endUnit == Asset.ENDUNIT_NEVER)
            view1.findViewById("Edit_Task_Radio_Never").setChecked(true);
        else if (endUnit == Asset.ENDUNIT_OCCURENCES)
            view1.findViewById("Edit_Task_Radio_AfterOccurences").setChecked(true);
        else
            view1.findViewById("Edit_Task_Radio_OnDate").setChecked(true);

        var button = view1.findViewById("Edit_Task_Occurences_Minus");
        button.addEventListener("click", function () {
            var editText = view1.findViewById("Edit_Task_RepeatOccurences");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            if (value > 1)
                --value;
            else
                value = 1;
            editText.setText(value + "");
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var editText = view1.findViewById("Edit_Task_RepeatOccurences");
        editText.setText(repeatEndOccurences + "");
        editText.addEventListener('keyup', function () {
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var button = view1.findViewById("Edit_Task_Occurences_Plus");
        button.addEventListener("click", function () {
            var editText = view1.findViewById("Edit_Task_RepeatOccurences");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            ++value;
            editText.setText(value + "");
            a.updateEdit_RepeatSummaryText(view1, a.dateTimeStart, a.dateTimeEnd);
        });
        var button = view1.findViewById("Edit_Task_Repeat_EndOnDate");
        a.setRepeatEndOnDateButton(view1);
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            var calendarDay = W4_Funcs.dateTimeToCalendarDay(new W4DateTime(Number(textViewVarRepeatEndDate.getText())));
            intent.putExtra("dYear", calendarDay.getYear());
            intent.putExtra("dMonth", calendarDay.getMonthOfYear());
            intent.putExtra("dDay", calendarDay.getDayOfMonth());
            a.selected_uncommon_view = view1;
            a.startActivityForResult(intent, MainActivity.requestCodeCalendar);
        });

        return view1;
    }

    getSubtaskView(context, name0) {
        var a = this;
        var inflater = LayoutInflater.from(context);
        var subtask_view = inflater.inflate(R.layout.task_subtask_view, null, true);
        subtask_view.findViewById("ID_SUBTASK").setText(name0);
        var plusButton = subtask_view.findViewById("ID_SUBTASK_PLUS_BUTTON");
        plusButton.addEventListener("click", function () {
            var sheet = a.findViewById("Task_Linear_Layout");
            var subtask_view1 = a.getSubtaskView(context, "");
            sheet.addView(subtask_view1, sheet.indexOfChild(subtask_view) + 1);

        });
        var minuButton = subtask_view.findViewById("ID_SUBTASK_MINU_BUTTON");
        minuButton.addEventListener("click", function () {
            var sheet = a.findViewById("Task_Linear_Layout");
            sheet.removeView(subtask_view);
        });
        return subtask_view;
    }

    setRepeatEveryUnitLabel(view) {
        var textView = view.findViewById("Edit_Task_RepeatEvery_Unit");
        var value = W4_Funcs.getIntFromEditText(view.findViewById("Edit_Task_RepeatEvery"), 1); //Change default to 0 to test app crashing
        var position = view.findViewById("Edit_Task_RepeatUnit").getSelectedItemPosition();
        var suffix = "";
        if (value != 1)
            suffix = "s";
        switch (position) {
            case Asset.REPEATUNIT_DAILY:
                textView.setText("Day" + suffix);
                break;
            case Asset.REPEATUNIT_WEEKLY:
                textView.setText("Week" + suffix);
                break;
            case Asset.REPEATUNIT_MONTHLY:
                textView.setText("Month" + suffix);
                break;
            case Asset.REPEATUNIT_YEARLY:
                textView.setText("Year" + suffix);
                break;
        }
    }

    setRepeatEndOnDateButton(view) {
        var button = view.findViewById("Edit_Task_Repeat_EndOnDate");
        var textViewVarRepeatEndDate = view.findViewById("VAR_REPEAT_END_DATE");
        var text = W4_Funcs.getFriendlyDateText(new W4DateTime(Number(textViewVarRepeatEndDate.getText())));
        button.setText(text);
    }

    updateEdit_RepeatSummaryText(view, dateTimeStart, dateTimeEnd) {
        var summary = "Every";
        var repeatUnit = view.findViewById("Edit_Task_RepeatUnit").getSelectedItemPosition();
        var repeatAmount = W4_Funcs.getIntFromEditText(view.findViewById("Edit_Task_RepeatEvery"), 1);
        if (repeatAmount < 1)
            repeatAmount = 1;
        var suffix = "";
        if (repeatAmount != 1)
            suffix = "s";
        switch (repeatUnit) {
            case Asset.REPEATUNIT_DAILY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " days";
                else
                    summary += " day";
                break;
            case Shift.REPEATUNIT_WEEKLY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " weeks";
                else
                    summary += " week";
                var weeklyRepeatDays = [];
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Sunday").isChecked());
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Monday").isChecked());
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Tuesday").isChecked());
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Wednesday").isChecked());
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Thursday").isChecked());
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Friday").isChecked());
                weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Saturday").isChecked());
                var lastDay = -1;
                var secondToLastDay = -1;
                var numDays = 0;
                for (var i = 0; i < 7; ++i) {
                    if (weeklyRepeatDays[i]) {
                        secondToLastDay = lastDay;
                        lastDay = i;
                        ++numDays;
                    }
                }
                if (numDays != 0) {
                    summary += " on";
                    for (var i = 0; i < 7; ++i) {
                        if (weeklyRepeatDays[i]) {
                            if (lastDay == i && numDays > 1)
                                summary += " and";
                            summary += " " + Asset.intToDayOfWeek[i];
                            if (lastDay != i && secondToLastDay != i)
                                summary += ",";
                        }
                    }
                }
                break;
            case Asset.REPEATUNIT_MONTHLY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " months";
                else
                    summary += " month";
                var monthlyRepeatType = Asset.MONTHLYREPEATTYPE_DAYOFMONTH;
                if (view.findViewById("Edit_Task_Radio_DayOfMonth").isChecked())
                    monthlyRepeatType = Asset.MONTHLYREPEATTYPE_DAYOFMONTH;
                else
                    monthlyRepeatType = Asset.MONTHLYREPEATTYPE_DAYOFWEEK;
                //this.dateTimeStart
                if (monthlyRepeatType == Asset.MONTHLYREPEATTYPE_DAYOFWEEK) {
                    summary += " on the";
                    var dayOfMonth = this.dateTimeStart.getDayOfMonth() - 1; // 1 - 31
                    var xthDayOfMonth = Math.floor((dayOfMonth - (dayOfMonth % 7)) / 7) + 1;
                    if (xthDayOfMonth == 1)
                        summary += " first";
                    else if (xthDayOfMonth == 2)
                        summary += " second";
                    else if (xthDayOfMonth == 3)
                        summary += " third";
                    else if (xthDayOfMonth == 4)
                        summary += " fourth";
                    else
                        summary += " fifth";

                    summary += " " + Asset.intToDayOfWeek[this.dateTimeStart.getDayOfWeek()];
                }
                break;
            case Asset.REPEATUNIT_YEARLY:
                if (repeatAmount != 1)
                    summary += " " + repeatAmount + " years";
                else
                    summary += " year";
                break;
        }

        var endUnit = Asset.ENDUNIT_NEVER;
        if (view.findViewById("Edit_Task_Radio_Never").isChecked())
            endUnit = Asset.ENDUNIT_NEVER;
        else if (view.findViewById("Edit_Task_Radio_AfterOccurences").isChecked())
            endUnit = Asset.ENDUNIT_OCCURENCES;
        else if (view.findViewById("Edit_Task_Radio_OnDate").isChecked())
            endUnit = Asset.ENDUNIT_ONDATE;
        var repeatEndOccurences = W4_Funcs.getIntFromEditText(view.findViewById("Edit_Task_RepeatOccurences"), 1);
        if (repeatEndOccurences < 1)
            repeatEndOccurences = 1;

        if (endUnit == Asset.ENDUNIT_OCCURENCES) {
            summary += " and ends after " + repeatEndOccurences;
            if (repeatEndOccurences == 1)
                summary += " occurence";
            else
                summary += " occurences";
        } else if (endUnit == Asset.ENDUNIT_ONDATE) {
            var textViewVarRepeatEndDate = view.findViewById("VAR_REPEAT_END_DATE");
            var selectedRepeatEndDate = new W4DateTime(Number(textViewVarRepeatEndDate.getText()));
            var date = Asset.intToMonth[selectedRepeatEndDate.getMonthOfYear()] + " " + selectedRepeatEndDate.getDayOfMonth() + ", " + selectedRepeatEndDate.getYear();
            summary += " until " + date;
        }

        if (repeatUnit == Asset.REPEATUNIT_MONTHLY || repeatUnit == Asset.REPEATUNIT_YEARLY)
            summary += "<br><br>⚠ If this repetition causes the task to fall on a date that doesn't exist (e.g. 29th of February 2021), the task will be moved to the last day of the month";

        view.findViewById("Edit_Task_RepeatSummary_Text").setText(summary);
        this.selected_preview_RD_Struct = this.updateRDStruct(view, this.dateTimeStart, this.dateTimeEnd);
        this.redecorateRepeatSummaryCalendar(view);
    }

    redecorateRepeatSummaryCalendar(view) {
        // var calendar = view.findViewById("Edit_Task_Calendar_RepeatSummary");
        // calendar.removeDecorators();
        // calendar.addDecorator(new DayViewDecorator() {

        //     boolean shouldDecorate(CalendarDay day) {
        //         var cal2 = Calendar.getInstance();
        //         return (W4_Funcs.doesRepeatingDateOccurOnDay(this.selected_preview_RD_Struct, W4_Funcs.calendarDayToDateTime(day, 0, 0, 0), 0));
        //     }


        //     void decorate(DayViewFacade view) {
        //     view.setBackgroundDrawable(ContextCompat.getDrawable(this, "../res/selector).png");
        // }
        // });

        var calendar_ele = view.findViewById("Edit_Task_Calendar_RepeatSummary").ele;
        var dayList = calendar_ele.children[0].children[2];

        var title = calendar_ele.children[0].children[0].children[1].innerHTML;
        var dt = W4_Funcs.getDateTimeFromCalendarTitle(title);
        var firstDayOfWeek = dt.getDayOfWeek();
        for (var i = 0; i < firstDayOfWeek; ++i) {
            dt = W4_Funcs.getPrevDay(dt);
        }

        for (var i = 0; i < dayList.children.length; ++i) {
            if (W4_Funcs.doesRepeatingDateOccurOnDay(this.selected_preview_RD_Struct, dt, 0)) {
                dayList.children[i].style.backgroundColor = "#FF006E";
                dayList.children[i].style.color = "white";
            }
            else {
                dayList.children[i].style.backgroundColor = "";
                dayList.children[i].style.color = "";
            }
            dt = W4_Funcs.getNextDay(dt);
        }
    }

    updateRDStruct(view, dateTimeStart, dateTimeEnd) {
        var repeatAmount = W4_Funcs.getIntFromEditText(view.findViewById("Edit_Task_RepeatEvery"), 1);
        if (repeatAmount < 1)
            repeatAmount = 1;
        if (!view.findViewById("Edit_Task_RepeatCheckBox").isChecked())
            repeatAmount = 0;
        var repeatUnit = view.findViewById("Edit_Task_RepeatUnit").getSelectedItemPosition();
        var endUnit = Shift.ENDUNIT_NEVER;
        if (view.findViewById("Edit_Task_Radio_Never").isChecked())
            endUnit = Shift.ENDUNIT_NEVER;
        else if (view.findViewById("Edit_Task_Radio_AfterOccurences").isChecked())
            endUnit = Shift.ENDUNIT_OCCURENCES;
        else if (view.findViewById("Edit_Task_Radio_OnDate").isChecked())
            endUnit = Shift.ENDUNIT_ONDATE;
        var repeatEndOccurences = W4_Funcs.getIntFromEditText(view.findViewById("Edit_Task_RepeatOccurences"), 1);
        if (repeatEndOccurences < 1)
            repeatEndOccurences = 1;
        var textViewVarRepeatEndDate = view.findViewById("VAR_REPEAT_END_DATE");
        var repeatEndDateL = Number(textViewVarRepeatEndDate.getText());
        var weeklyRepeatDays = [];
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Sunday").isChecked());
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Monday").isChecked());
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Tuesday").isChecked());
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Wednesday").isChecked());
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Thursday").isChecked());
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Friday").isChecked());
        weeklyRepeatDays.push(view.findViewById("Edit_Task_Repeat_Saturday").isChecked());
        var monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
        if (view.findViewById("Edit_Task_Radio_DayOfMonth").isChecked())
            monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFMONTH;
        else
            monthlyRepeatType = Shift.MONTHLYREPEATTYPE_DAYOFWEEK;
        return new RepeatingDateStruct(dateTimeStart.getMillis(), dateTimeEnd.getMillis(), repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDateL, weeklyRepeatDays, monthlyRepeatType);
    }

    settingsSetMenuVisibility(visible, view1) {
        var ll = this.findViewById("Task_Linear_Layout");
        var imageButton = null;
        if (visible) {
            if (view1 != null) {
                view1.findViewById("ID_UNCOMMON_LL").setVisibility(View.GONE);
                imageButton = view1.findViewById("ID_TASK_SETTINGS_BUTTON");
            }
            if (imageButton != null) {
                imageButton.setImageResource("../res/gear.png");
            }
            this.findViewById("LL1").setVisibility(View.VISIBLE);
            this.findViewById("LL2").setVisibility(View.VISIBLE);
            for (var i = 0; i < ll.getChildCount(); ++i) {
                ll.getChildAt(i).setVisibility(View.VISIBLE);
            }
        } else {
            if (view1 != null) {
                view1.findViewById("ID_UNCOMMON_LL").setVisibility(View.VISIBLE);
                imageButton = view1.findViewById("ID_TASK_SETTINGS_BUTTON");
            }
            if (imageButton != null) {
                imageButton.setImageResource("../res/arrow_back.png");
            }
            this.findViewById("LL1").setVisibility(View.GONE);
            this.findViewById("LL2").setVisibility(View.GONE);
            for (var i = 0; i < ll.getChildCount(); ++i) {
                if (ll.getChildAt(i).ele != this.selected_uncommon_view.ele) {
                    ll.getChildAt(i).setVisibility(View.GONE);
                }
            }
        }
    }
}
