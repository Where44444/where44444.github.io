class ViewInspectionPlanCompleteActivity extends W4Activity {


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Complete Inspection");
        a.setContentView(R.layout.activity_view_inspection_plan_complete);
        a.completedInspectionPlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlansCompletedList(), a.getIntent().getStringExtra("id"));
        if (a.completedInspectionPlan == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        a.findViewById("View_InspectionPlan_Name").setText(a.completedInspectionPlan.getName());
        var shiftText = a.findViewById("Inspection_Plan_Shift_Text");
        var locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_INSPECTIONS);
        if (locationList.length > 0) {
            for (var i = 0; i < locationList.length; ++i) {
                if (locationList[i].getW4id() == (a.completedInspectionPlan.getLocationID())) {
                    a.completedInspectionPlan.setLocationSavedName(locationList[i].getName());
                    break;
                }
            }
        }
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.completedInspectionPlan.getShiftID());
        if (shift != null) {
            shiftText.setText(shift.method_getFullName());
        }
        var time = new W4DateTime(a.completedInspectionPlan.getDateTime());

        a.findViewById("View_Inspection_Plan_Date").setText(W4_Funcs.getFriendlyDayText(time) + " " + W4_Funcs.getTimeText(time));
        var inspector = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.completedInspectionPlan.getPerson_inspector_id());
        if (inspector != null) {
            a.findViewById("View_Inspection_Plan_Inspector").setText(inspector.getFirst_name() + " " + inspector.getLast_name());
        }
        for (var i = 0; i < a.completedInspectionPlan.getArea_names().length; ++i) {
            var linearLayoutArea = ViewInspectionPlanCompleteActivity.getView_OnlyAreaView(this, this, a.completedInspectionPlan.getArea_names()[i], a.completedInspectionPlan.getResult()[i]);
            a.findViewById("Inspection_Plan_Linear_Layout").addView(linearLayoutArea);
            var points = null;
            if (a.completedInspectionPlan.getPoints().length > i) {
                points = a.completedInspectionPlan.getPoints()[i];
            }
            if (points != null) {
                for (var j = 0; j < points.length; ++j) {
                    var pointText = points[j];
                    var pointLayout = ViewInspectionPlanCompleteActivity.getView_OnlyPointView(this, this, pointText, a.completedInspectionPlan.getResults()[i][j]);
                    a.findViewById("Inspection_Plan_Linear_Layout").addView(pointLayout[0]);
                }
            }
        }
        var readOnly = !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_INSPECTIONS] && !MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS];
        var deleteButton = a.findViewById("Delete_View_Completed_InspectionPlan");
        if (readOnly) {
            deleteButton.setVisibility(View.GONE);
        } else {
            deleteButton.setVisibility(View.VISIBLE);
            deleteButton.addEventListener("click", function () {
                var intent = new Intent(this, new ConfirmActivity());
                intent.putExtra("description", "Are you sure you want to delete this Completed Inspection Plan?");
                a.startActivityForResult(intent, MainActivity.requestCodeCompletedInspectionPlanDelete);
            });
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeCompletedInspectionPlanDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).child(this.completedInspectionPlan.getW4id());
                W4_Funcs.deleteFromDB(reffPlan, "Deleted completed inspection plan " + this.completedInspectionPlan.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(this.completedInspectionPlan.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(this.completedInspectionPlan.getShiftID()) + "|Person:" + W4_DBLog.getPersonStringForLog(this.completedInspectionPlan.getPerson_inspector_id()) + "|");
                MainActivity.w4Toast(this, "Successfully deleted Completed Inspection Plan", Toast.LENGTH_LONG);
                this.finish();
            }
        }
    }

    static getView_OnlyAreaView(context, activity, areaText, result) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_do_area_view, null, true);

        var textView = view.findViewById("ID_AREA");
        textView.setText(areaText);
        var spinner = view.findViewById("ID_AREA_SPINNER");
        var spinnerArrayAdapter = new ArrayAdapter(
            context, R.layout.spinner_item, InspectionPlanOccurence.singleResults[result]
        );
        spinner.setAdapter(spinnerArrayAdapter);
        return view;
    }

    static getView_OnlyPointView(context, activity, pointText, result) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_do_point_view, null, true);

        var textView = view.findViewById("ID_POINT");
        textView.setText(pointText);
        var spinner = view.findViewById("ID_POINT_SPINNER");
        var spinnerArrayAdapter = new ArrayAdapter(
            context, R.layout.spinner_item, InspectionPlanOccurence.singleResults[result]
        );
        spinner.setAdapter(spinnerArrayAdapter);
        return [view];
    }
}