class ViewInspectionPlansListActivity extends W4Activity {

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewInspectionPlanListActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Inspection Plans");
        a.setContentView(R.layout.activity_view_inspection_plans_list);
        var readOnly = !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_INSPECTIONS] && !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS];
        FireBaseListeners.viewInspectionPlanListActivity = a;

        a.findViewById("TemplatesButton").addEventListener("click", function () {
            var intent = new Intent(a, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_INSPECTIONS);
            intent.putExtra("newEditActivity", new NewEditInspectionPlanActivity());
            intent.putExtra("viewActivity", new ViewInspectionPlanActivity());
            a.startActivity(intent);
        });

        a.findViewById("Button_Export_Inspection_Summary2").addEventListener("click", function () {
            ReportTypesActivity.buttonExportInspectionSummary(a);
        });

        if (!readOnly) {
            a.findViewById("AddInspectionPlanButton").setVisibility(View.VISIBLE);
            var button = a.findViewById("AddInspectionPlanButton");
            button.addEventListener("click", function () {
                var intent = new Intent(a, new NewEditInspectionPlanActivity());
                a.startActivity(intent);
            });
        }
        else
            a.findViewById("AddInspectionPlanButton").setVisibility(View.GONE);
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            FireBaseListeners.populateAllInspectionPlansList();
        });

        FireBaseListeners.populateAllInspectionPlansList();
    }

    populateInspectionPlansList(context) {
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var inspectionPlanList = [];
        if (searchText != ("")) {
            inspectionPlanList = Asset.getSearchedAssets(W4_Funcs.getPermittedInspectionPlanList(), searchText);
        } else {
            inspectionPlanList = W4_Funcs.getPermittedInspectionPlanList();
        }

        if (inspectionPlanList.length > 0)
            this.findViewById("View_Inspection_Plans_Space2").setVisibility(View.VISIBLE);
        else
            this.findViewById("View_Inspection_Plans_Space2").setVisibility(View.GONE);

        this.findViewById("InspectionPlansList").setText("");
        var readOnly = !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_INSPECTIONS] && !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS];
        for (var i = 0; i < inspectionPlanList.length; ++i) {
            var position = i;
            var inflater = LayoutInflater.from(context);
            var view = inflater.inflate(R.layout.inspection_plan_list_item, null, true);
            var editButton = view.findViewById("InspectionPlanButton");
            var inspectionPlan = inspectionPlanList[position];
            var locText = "";
            if (inspectionPlan.getLocationSavedName() != ("")) {
                locText = "at " + inspectionPlan.getLocationSavedName();
            }
            editButton.setText(inspectionPlan.getName() + " " + locText);

            editButton.ele.w4id = inspectionPlan.getW4id();
            editButton.addEventListener("click", function (event) {
                var intent;
                if (readOnly)
                    intent = new Intent(context, new ViewInspectionPlanActivity());
                else
                    intent = new Intent(context, new NewEditInspectionPlanActivity());
                intent.putExtra("id", event.target.w4id);
                context.startActivity(intent);
            });
            var startButton = view.findViewById("StartInspectionPlanButton");

            if (readOnly)
                startButton.setVisibility(View.GONE);
            else {
                startButton.ele.w4id = inspectionPlan.getW4id();
                startButton.setVisibility(View.VISIBLE);
                startButton.addEventListener("click", function (event) {
                    var intent = new Intent(context, new DoInspectionPlanInProgressActivity());
                    intent.putExtra("id", event.target.w4id);
                    intent.putExtra("new", true);
                    context.startActivity(intent);
                });
            }
            this.findViewById("InspectionPlansList").ele.appendChild(view.ele);
        }
    }

    populateInspectionPlansInProgressList(context) {
        this.findViewById("InspectionPlansInProgressList").setText("");
        var readOnly = !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_INSPECTIONS] && !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS];
        if (MainActivity.theCompany.getInspectionPlansInProgressList().length > 0 && !readOnly) {
            this.findViewById("View_InspectionPlansInProgress_Label").setVisibility(View.VISIBLE);
            this.findViewById("View_Inspection_Plans_Space1").setVisibility(View.VISIBLE);
        } else {
            this.findViewById("View_InspectionPlansInProgress_Label").setVisibility(View.GONE);
            this.findViewById("View_Inspection_Plans_Space1").setVisibility(View.GONE);
        }

        if (!readOnly) {
            var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
            var inspectionPlanInProgressList = [];
            if (searchText != ("")) {
                inspectionPlanInProgressList = Asset.getSearchedAssets(W4_Funcs.getPermittedInspectionPlanInProgressList(), searchText);
            } else {
                inspectionPlanInProgressList = W4_Funcs.getPermittedInspectionPlanInProgressList();
            }

            if (inspectionPlanInProgressList.length > 0 && !readOnly) {
                this.findViewById("View_InspectionPlansInProgress_Label").setVisibility(View.VISIBLE);
                this.findViewById("View_Inspection_Plans_Space1").setVisibility(View.VISIBLE);
            } else {
                this.findViewById("View_InspectionPlansInProgress_Label").setVisibility(View.GONE);
                this.findViewById("View_Inspection_Plans_Space1").setVisibility(View.GONE);
            }
            for (var i = 0; i < inspectionPlanInProgressList.length; ++i) {
                var position = i;
                var inspectionPlanOccurence = inspectionPlanInProgressList[i];
                var inflater = LayoutInflater.from(context);
                var view = inflater.inflate(R.layout.generic_list_item, null, true);
                var button = view.findViewById("Generic_Button");
                var startedTime = new W4DateTime(inspectionPlanOccurence.getDateTime());
                var timeString = W4_Funcs.getFriendlyDateText(startedTime);
                var locText = "";
                if (inspectionPlanOccurence.getLocationSavedName() != ("")) {
                    locText = "at " + inspectionPlanOccurence.getLocationSavedName();
                }

                button.setText(inspectionPlanOccurence.getName() + " " + locText + " - Started " + timeString + " " + W4_Funcs.getTimeText(startedTime));
                button.ele.w4id = inspectionPlanOccurence.getW4id();
                button.addEventListener("click", function (event) {
                    var intent = new Intent(context, new DoInspectionPlanInProgressActivity());
                    intent.putExtra("id", event.target.w4id);
                    intent.putExtra("new", false);
                    context.startActivity(intent);
                });
                this.findViewById("InspectionPlansInProgressList").addView(view);
            }
        }
    }

    populateInspectionPlansCompletedList(context) {
        this.findViewById("InspectionPlansCompletedList").setText("");
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var inspectionPlanCompletedList = [];
        if (searchText != ("")) {
            inspectionPlanCompletedList = Asset.getSearchedAssets(W4_Funcs.getPermittedInspectionPlanCompletedList(), searchText);
        } else {
            inspectionPlanCompletedList = W4_Funcs.getPermittedInspectionPlanCompletedList();
        }

        if (inspectionPlanCompletedList.length > 0)
            this.findViewById("View_InspectionPlansCompleted_Label").setVisibility(View.VISIBLE);
        else
            this.findViewById("View_InspectionPlansCompleted_Label").setVisibility(View.GONE);
        for (var i = 0; i < inspectionPlanCompletedList.length; ++i) {
            var inspectionPlanOccurence = inspectionPlanCompletedList[i];
            var inflater = LayoutInflater.from(context);
            var view = inflater.inflate(R.layout.generic_list_item, null, true);
            var button = view.findViewById("Generic_Button");
            var completedTime = new W4DateTime(inspectionPlanOccurence.getDateTime());
            var timeString = W4_Funcs.getFriendlyDateText(completedTime);
            var locText = "";
            if (inspectionPlanOccurence.getLocationSavedName() != ("")) {
                locText = "at " + inspectionPlanOccurence.getLocationSavedName();
            }

            button.setText(inspectionPlanOccurence.getName() + " " + locText + " - Finished " + timeString + " " + W4_Funcs.getTimeText(completedTime));
            button.ele.w4id = inspectionPlanOccurence.getW4id();
            button.addEventListener("click", function (event) {
                var intent = new Intent(context, new ViewInspectionPlanCompleteActivity());
                intent.putExtra("id", event.target.w4id);
                context.startActivity(intent);
            });
            this.findViewById("InspectionPlansCompletedList").addView(view);
        }
    }
}
