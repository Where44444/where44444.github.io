class NewEditInspectionPlanActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_inspection_plan);
        var id = a.getIntent().getStringExtra("id");
        a.newInspectionPlan = (id == null);
        a.isTemplate = a.getIntent().getBooleanExtra("isTemplate", false);
        if (a.newInspectionPlan) {
            if (a.isTemplate) {
                a.getSupportActionBar().setTitle("New Inspection Plan Template");
            } else {
                a.getSupportActionBar().setTitle("New Inspection Plan");
            }
            a.selectedInspectionPlan = new InspectionPlan();
            a.findViewById("Delete_Inspection_Plan").setVisibility(View.GONE);
        } else {
            if (a.isTemplate) {
                a.getSupportActionBar().setTitle("Edit Inspection Plan Template");
                a.selectedInspectionPlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlanTemplateList(), id);
            } else {
                a.getSupportActionBar().setTitle("Edit Inspection Plan");
                a.selectedInspectionPlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlanList(), id);
            }
        }

        if (a.selectedInspectionPlan == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var spinner = a.findViewById("Inspection_Plan_Shift_Spinner");
        var shiftList1 = W4_Funcs.getPermittedShiftList_ForX(Asset.PERMISSION_ALL_INSPECTIONS);
        var shiftSpinnerItems = null;
        var shiftNames = null;
        if (shiftList1.length > 0) {
            shiftSpinnerItems = W4_Funcs.getShiftSpinnerItems(shiftList1);
            shiftNames = shiftSpinnerItems[0];
            a.shiftList = shiftSpinnerItems[2];
            a.findViewById("Inspection_Plan_Shift_Label").setVisibility(View.VISIBLE);
            spinner.setVisibility(View.VISIBLE);
            var spinnerArrayAdapter = new ArrayAdapter(
                this, R.layout.spinner_item, shiftNames
            );
            spinner.setAdapter(spinnerArrayAdapter);
            for (var i = 0; i < a.shiftList.length; ++i) {
                if (a.shiftList[i].getW4id() == (a.selectedInspectionPlan.getShiftID())) {
                    spinner.setSelection(i);
                    break;
                }
            }
        } else {
            a.findViewById("Inspection_Plan_Shift_Label").setVisibility(View.GONE);
            spinner.setVisibility(View.GONE);
        }
        var button = a.findViewById("Import_Template");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_INSPECTIONS);
            intent.putExtra("newEditActivity", new NewEditInspectionPlanActivity());
            intent.putExtra("returnAsset", true);
            a.startActivityForResult(intent, MainActivity.requestCodeReturnTemplateAsset);
        });
        var button = a.findViewById("Inspection_Plan_Add_Area");
        button.addEventListener("click", function () {
            a.addArea(a);
        });
        var button = a.findViewById("Cancel_InspectionPlan");
        button.addEventListener("click", function () {
            a.finish();
        });
        var button = a.findViewById("Accept_InspectionPlan");
        button.addEventListener("click", function () {
            var linearLayout = a.findViewById("Inspection_Plan_Linear_Layout");
            var childCount = linearLayout.getChildCount();
            var area_names = [];
            var points = [];
            var areaNum = -1;
            for (var i = 0; i < childCount; ++i) {
                var view2 = linearLayout.getChildAt(i);
                var linearLayout2 = view2;
                var childCount2 = linearLayout2.getChildCount();
                for (var j = 0; j < childCount2; ++j) {
                    if (linearLayout2.getChildAt(j).ele.nodeName == "INPUT") {
                        var editText = linearLayout2.getChildAt(j);
                        switch (editText.getId()) {
                            case "ID_AREA":
                                area_names.push(editText.getText());
                                points.push([]);
                                ++areaNum;
                                break;
                            case "ID_POINT":
                                points[areaNum].push(editText.getText());
                                break;
                        }
                        break;
                    }
                }
            }
            var planName = a.findViewById("InspectionPlan_Name").getText();
            var spinner = a.findViewById("Inspection_Plan_Shift_Spinner");
            var shiftID = "";
            var locationID = "";
            var locationName = "";

            if (spinner.getSelectedItemPosition() >= 0) {
                var shift = a.shiftList[spinner.getSelectedItemPosition()];
                locationID = shift.getLocationID();
                shiftID = shift.getW4id();
                var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                if (location != null) {
                    locationName = location.getName();
                }
            }

            if (a.newInspectionPlan) {
                var plan = new InspectionPlan("", planName, locationID, shiftID, locationName, area_names, points, a.isTemplate);
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS).push();
                plan.setW4id(reffPlan.key);
                W4_Funcs.writeToDB(reffPlan, plan, "New Inspection Plan " + plan.getName() + "|Location:" + locationName);
                MainActivity.w4Toast(this, "Successfully added new Inspection Plan", Toast.LENGTH_LONG);
            } else {
                var plan = new InspectionPlan(a.selectedInspectionPlan.getW4id(), planName, locationID, shiftID, locationName, area_names, points, a.isTemplate);
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS).child(plan.getW4id());
                W4_Funcs.writeToDB(reffPlan, plan, "Edited Inspection Plan " + plan.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(plan.getLocationID()) + "|");
                MainActivity.w4Toast(this, "Successfully edited Inspection Plan", Toast.LENGTH_LONG);
            }
            a.finish();
        });

        if (!a.newInspectionPlan) {
            button = a.findViewById("Delete_Inspection_Plan");
            button.addEventListener("click", function () {
                var intent = new Intent(this, new ConfirmActivity());
                intent.putExtra("description", "Are you sure you want to delete this Inspection Plan?");
                a.startActivityForResult(intent, MainActivity.requestCodeInspectionPlanDelete);
            });
        }
        a.setUIFromSelectedInspectionPlan(false);
    }

    setUIFromSelectedInspectionPlan(templateImport) {
        this.findViewById("Inspection_Plan_Linear_Layout").setText("");

        if (!templateImport && this.newInspectionPlan) {
            this.addArea(this);
        }

        this.findViewById("InspectionPlan_Name").setText(this.selectedInspectionPlan.getName());

        for (var i = 0; i < this.selectedInspectionPlan.getArea_names().length; ++i) {
            var linearLayoutArea = NewEditInspectionPlanActivity.getEdit_AreaView(this, this, this.selectedInspectionPlan.getArea_names()[i]);
            this.findViewById("Inspection_Plan_Linear_Layout").ele.appendChild(linearLayoutArea.ele);
            var points = null;
            if (this.selectedInspectionPlan.getPoints().length > i) {
                points = this.selectedInspectionPlan.getPoints()[i];
            }
            if (points != null) {
                for (var j = 0; j < points.length; ++j) {
                    var pointText = points[j];
                    var pointLayout = NewEditInspectionPlanActivity.getEdit_PointView(this, this, pointText);
                    this.findViewById("Inspection_Plan_Linear_Layout").addView(pointLayout[0]);
                }
            }
        }

        if (this.isTemplate) {
            this.findViewById("Inspection_Plan_Shift_Label").setVisibility(View.GONE);
            this.findViewById("Inspection_Plan_Shift_Spinner").setVisibility(View.GONE);
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeInspectionPlanDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK && !this.newInspectionPlan) {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS).child(this.selectedInspectionPlan.getW4id());
                W4_Funcs.deleteFromDB(reffPlan, "Deleted inspection plan " + this.selectedInspectionPlan.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(this.selectedInspectionPlan.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(this.selectedInspectionPlan.getShiftID()) + "|");
                MainActivity.w4Toast(this, "Successfully deleted Inspection Plan", Toast.LENGTH_LONG);
                this.finish();
            }
        } else if (requestCode == MainActivity.requestCodeReturnTemplateAsset) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var templatePlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlanTemplateList(), data.getStringExtra("returnID"));
                if (templatePlan != null) {
                    this.selectedInspectionPlan1 = new InspectionPlan(templatePlan);
                    this.selectedInspectionPlan1.setW4id(this.selectedInspectionPlan.getW4id());
                    this.selectedInspectionPlan = this.selectedInspectionPlan1;
                    this.setUIFromSelectedInspectionPlan(true);
                }
            }
        }
    }

    addArea(context) {
        var linearLayoutArea = NewEditInspectionPlanActivity.getEdit_AreaView(context, this, "");
        var linearLayout = NewEditInspectionPlanActivity.getEdit_PointView(context, this, "");
        this.findViewById("Inspection_Plan_Linear_Layout").addView(linearLayoutArea);
        this.findViewById("Inspection_Plan_Linear_Layout").addView(linearLayout[0]);
    }

    static getEdit_AreaView(context, activity, areaText) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_edit_area_view, null, true);
        var editText = view.findViewById("ID_AREA");
        editText.setText(areaText);
        var minuButton = view.findViewById("ID_AREA_BUTTON");
        minuButton.addEventListener("click", function () {
            var topLayout = activity.findViewById("Inspection_Plan_Linear_Layout");
            var startIndex = topLayout.indexOfChild(view);
            topLayout.removeView(view);
            var childCount = topLayout.getChildCount();
            var viewsToRemove = [];
            var quitLoop = false;
            for (var i = startIndex; i < childCount && !quitLoop; ++i) {
                var linearLayout2 = topLayout.getChildAt(i);
                switch (linearLayout2.getId()) {
                    case "ID_AREA":
                        quitLoop = true;
                        break;
                    case "ID_POINT":
                        viewsToRemove.push(linearLayout2);
                        break;
                }
            }
            for (let viewToRemove of viewsToRemove) {
                topLayout.removeView(viewToRemove);
            }
        });

        return view;
    }

    static getEdit_PointView(context, activity, pointText) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_edit_point_view, null, true);
        var editText = view.findViewById("ID_POINT");
        editText.setText(pointText);
        var plusButton = view.findViewById("ID_POINT_PLUS");
        plusButton.addEventListener("click", function () {
            var plan = activity.findViewById("Inspection_Plan_Linear_Layout");
            var lArray = NewEditInspectionPlanActivity.getEdit_PointView(context, activity, "");
            plan.addView(lArray[0], plan.indexOfChild(view) + 1);
        });
        var minuButton = view.findViewById("ID_POINT_X");
        minuButton.addEventListener("click", function () {
            activity.findViewById("Inspection_Plan_Linear_Layout").removeView(view);
        });
        return [view];
    }

    static getView_AreaView(context, activity, areaText) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_view_area_view, null, true);
        var textView = view.findViewById("ID_AREA");
        textView.setText(areaText);
        return view;
    }

    static getView_PointView(context, activity, pointText) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_view_point_view, null, true);
        var textView = view.findViewById("ID_POINT");
        textView.setText(pointText);
        return [view];
    }
}
