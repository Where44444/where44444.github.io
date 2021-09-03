class ViewInspectionPlanActivity extends W4Activity {

    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View Inspection Plan");
        this.setContentView(R.layout.activity_view_inspection_plan);
        this.isTemplate = this.getIntent().getBooleanExtra("isTemplate", false);
        var id = this.getIntent().getStringExtra("id");

        if (this.isTemplate) {
            this.selectedInspectionPlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlanTemplateList(), id);
        } else {
            this.selectedInspectionPlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlanList(), id);
        }
        if (this.selectedInspectionPlan == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            this.finish();
            return;
        }
        this.findViewById("View_InspectionPlan_Name").setText(this.selectedInspectionPlan.getName());
        var shiftText = this.findViewById("Inspection_Plan_Shift_Text");
        var locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_INSPECTIONS);
        if (locationList.length > 0) {
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), this.selectedInspectionPlan.getShiftID());
            if (shift != null) {
                shiftText.setVisibility(View.VISIBLE);
                shiftText.setText(shift.method_getFullName());
            } else {
                shiftText.setVisibility(View.GONE);
            }
        } else {
            shiftText.setVisibility(View.GONE);
        }
        for (var i = 0; i < this.selectedInspectionPlan.getArea_names().length; ++i) {
            var linearLayoutArea = NewEditInspectionPlanActivity.getView_AreaView(this, this, this.selectedInspectionPlan.getArea_names()[i]);
            this.findViewById("Inspection_Plan_Linear_Layout").ele.appendChild(linearLayoutArea.ele);
            var points = null;
            if (this.selectedInspectionPlan.getPoints().length > i) {
                points = this.selectedInspectionPlan.getPoints()[i];
            }
            if (points != null) {
                for (var j = 0; j < points.length; ++j) {
                    var pointText = points[j];
                    var pointLayout = NewEditInspectionPlanActivity.getView_PointView(this, this, pointText);
                    this.findViewById("Inspection_Plan_Linear_Layout").addView(pointLayout[0]);
                }
            }
        }
        if (this.isTemplate) {
            this.findViewById("Inspection_Plan_Shift_Label").setVisibility(View.GONE);
            this.findViewById("Inspection_Plan_Shift_Text").setVisibility(View.GONE);
        }
    }

}
