class DoInspectionPlanInProgressActivity extends W4Activity {

    static resultsIconSpinnerWidthDP = 90;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Perform Inspection");
        a.setContentView(R.layout.activity_do_inspection_plan_in_progress);
        var newInspection = a.getIntent().getBooleanExtra("new", false);
        var id = a.getIntent().getStringExtra("id");

        if (newInspection) {
            var plan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlanList(), id);
            if (plan == null) {
                MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
                a.finish();
                return;
            }
            a.copiedInspectionPlan = new InspectionPlanOccurence(plan, new W4DateTime().getMillis(), false, MainActivity.currentPerson.getW4id(), [], []);
            a.copiedInspectionPlan.setW4id("");
            a.findViewById("Delete_Do_Inspection_Plan_Occurence").setVisibility(View.GONE);
        } else {
            a.copiedInspectionPlan = Asset.getAssetbyId(MainActivity.theCompany.getInspectionPlansInProgressList(), id);
            if (a.copiedInspectionPlan == null) {
                MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
                a.finish();
                return;
            }
            a.findViewById("Delete_Do_Inspection_Plan_Occurence").setVisibility(View.VISIBLE);
        }

        a.findViewById("Do_InspectionPlan_Occurence_Name").setText(a.copiedInspectionPlan.getName());
        var label = a.findViewById("Do_Inspection_Plan_Occurence_Shift_Label");
        var locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_INSPECTIONS);
        if (locationList.length > 0) {
            for (var i = 0; i < locationList.length; ++i) {
                if (locationList[i].getW4id() == (a.copiedInspectionPlan.getLocationID())) {
                    a.copiedInspectionPlan.setLocationSavedName(locationList[i].getName());
                    break;
                }
            }
        }
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), a.copiedInspectionPlan.getShiftID());
        if (shift != null) {
            label.setText(shift.method_getFullName());
        }
        var time = new W4DateTime(a.copiedInspectionPlan.getDateTime());

        a.findViewById("Do_Inspection_Plan_Occurence_Date").setText(W4_Funcs.getFriendlyDayText(time) + " " + W4_Funcs.getTimeText(time));
        var inspector = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.copiedInspectionPlan.getPerson_inspector_id());
        if (inspector != null) {
            a.findViewById("Do_Inspection_Plan_Occurence_Inspector").setText(inspector.getFirst_name() + " " + inspector.getLast_name());
        }

        if (newInspection) {
            for (var i = 0; i < a.copiedInspectionPlan.getArea_names().length; ++i) {
                var linearLayoutArea = DoInspectionPlanInProgressActivity.getDo_OnlyAreaView(this, this, a.copiedInspectionPlan.getArea_names()[i], InspectionPlanOccurence.RESULT_NA);
                a.findViewById("Inspection_Plan_Linear_Layout").addView(linearLayoutArea);
                var points = null;
                if (a.copiedInspectionPlan.getPoints().length > i) {
                    points = a.copiedInspectionPlan.getPoints()[i];
                }
                if (points != null) {
                    for (var j = 0; j < points.length; ++j) {
                        var pointText = points[j];
                        var pointLayout = DoInspectionPlanInProgressActivity.getDo_OnlyPointView(this, this, pointText, InspectionPlanOccurence.RESULT_NA);
                        a.findViewById("Inspection_Plan_Linear_Layout").addView(pointLayout[0]);
                    }
                }
            }
        } else {
            for (var i = 0; i < a.copiedInspectionPlan.getArea_names().length; ++i) {
                var linearLayoutArea = DoInspectionPlanInProgressActivity.getDo_OnlyAreaView(this, this, a.copiedInspectionPlan.getArea_names()[i], a.copiedInspectionPlan.getResult()[i]);
                a.findViewById("Inspection_Plan_Linear_Layout").addView(linearLayoutArea);
                var points = null;
                if (a.copiedInspectionPlan.getPoints().length > i) {
                    points = a.copiedInspectionPlan.getPoints()[i];
                }
                if (points != null) {
                    for (var j = 0; j < points.length; ++j) {
                        var pointText = points[j];
                        var pointLayout = DoInspectionPlanInProgressActivity.getDo_OnlyPointView(this, this, pointText, a.copiedInspectionPlan.getResults()[i][j]);
                        a.findViewById("Inspection_Plan_Linear_Layout").addView(pointLayout[0]);
                    }
                }
            }
        }
        var button = a.findViewById("Cancel_Do_InspectionPlanOccurence");
        button.addEventListener("click", function () {
            a.finish();
        });
        var button = a.findViewById("Finish_Do_InspectionPlanOccurence");
        button.addEventListener("click", function () {
            var linearLayout = a.findViewById("Inspection_Plan_Linear_Layout");
            var j = 0;
            a.copiedInspectionPlan.setResult([]);
            a.copiedInspectionPlan.setResults([]);
            for (var i = 0; i < a.copiedInspectionPlan.getArea_names().length; ++i) {
                var points = null;
                if (a.copiedInspectionPlan.getPoints().length > i) {
                    points = a.copiedInspectionPlan.getPoints()[i];
                }
                if ((linearLayout.getChildAt(j)).getChildAt(1).ele.nodeName == "SELECT") {
                    a.copiedInspectionPlan.getResults().push([]);
                    var spinner = (linearLayout.getChildAt(j)).getChildAt(1);
                    a.copiedInspectionPlan.getResult().push(spinner.getSelectedItemPosition());
                    ++j;
                    if (points != null) {
                        for (let point of points) {
                            if ((linearLayout.getChildAt(j)).getChildAt(2).ele.nodeName == "SELECT") {
                                spinner = (linearLayout.getChildAt(j)).getChildAt(2);
                                a.copiedInspectionPlan.getResults()[i].push(spinner.getSelectedItemPosition());
                                ++j;
                            }
                        }

                    }
                }
            }

            a.copiedInspectionPlan.setCompleted(true);
            a.copiedInspectionPlan.setDateTime((new W4DateTime()).getMillis());
            if (a.copiedInspectionPlan.getW4id() == ("")) {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).push();
                a.copiedInspectionPlan.setW4id(reffPlan.key);
                W4_Funcs.writeToDB(reffPlan, a.copiedInspectionPlan, "");
            } else {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).child(a.copiedInspectionPlan.getW4id());
                W4_Funcs.writeToDB(reffPlan, a.copiedInspectionPlan, "");
            }
            MainActivity.w4Toast(this, "Successfully submitted Inspection Plan", Toast.LENGTH_LONG);
            a.finish();
        });
        var button = a.findViewById("Save_Do_InspectionPlanOccurence");
        button.addEventListener("click", function () {
            var linearLayout = a.findViewById("Inspection_Plan_Linear_Layout");
            var j = 0;
            a.copiedInspectionPlan.setResult([]);
            a.copiedInspectionPlan.setResults([]);
            for (var i = 0; i < a.copiedInspectionPlan.getArea_names().length; ++i) {
                var points = null;
                if (a.copiedInspectionPlan.getPoints().length > i) {
                    points = a.copiedInspectionPlan.getPoints()[i];
                }
                if (linearLayout.getChildAt(j).getChildAt(1).ele.nodeName == "SELECT") {
                    a.copiedInspectionPlan.getResults().push([]);
                    var spinner = (linearLayout.getChildAt(j)).getChildAt(1);
                    a.copiedInspectionPlan.getResult().push(spinner.getSelectedItemPosition());
                    ++j;
                    if (points != null) {
                        for (let point of points) {
                            if ((linearLayout.getChildAt(j)).getChildAt(2).ele.nodeName == "SELECT") {
                                spinner = (linearLayout.getChildAt(j)).getChildAt(2);
                                a.copiedInspectionPlan.getResults()[i].push(spinner.getSelectedItemPosition());
                                ++j;
                            }
                        }
                    }

                }
            }

            if (a.copiedInspectionPlan.getW4id() == ("")) {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).push();
                a.copiedInspectionPlan.setW4id(reffPlan.key);
                W4_Funcs.writeToDB(reffPlan, a.copiedInspectionPlan, "");
                MainActivity.w4Toast(this, "Successfully added new Inspection Plan in Progress", Toast.LENGTH_LONG);
            } else {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).child(a.copiedInspectionPlan.getW4id());
                W4_Funcs.writeToDB(reffPlan, a.copiedInspectionPlan, "");
                MainActivity.w4Toast(this, "Successfully edited Inspection Plan in Progress", Toast.LENGTH_LONG);
            }
            a.finish();
        });
        var button = a.findViewById("Delete_Do_Inspection_Plan_Occurence");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ConfirmActivity());
            intent.putExtra("description", "Are you sure you want to delete this Inspection Plan in Progress?");
            a.startActivityForResult(intent, MainActivity.requestCodeInspectionPlanInProgressDelete);
        });
    }


    onActivityResult(requestCode, resultCode, data) {
        var a = this;
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeInspectionPlanInProgressDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var reffPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS_OCCURENCE).child(a.copiedInspectionPlan.getW4id());
                W4_Funcs.deleteFromDB(reffPlan, "Deleted inspection plan in progress " + a.copiedInspectionPlan.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(a.copiedInspectionPlan.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(a.copiedInspectionPlan.getShiftID()) + "|Person:" + W4_DBLog.getPersonStringForLog(a.copiedInspectionPlan.getPerson_inspector_id()) + "|");
                MainActivity.w4Toast(this, "Successfully deleted Inspection Plan in Progress", Toast.LENGTH_LONG);
                a.finish();
            }
        }
    }

    static getDo_OnlyAreaView(context, activity, areaText, result) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_do_area_view, null, true);

        var textView = view.findViewById("ID_AREA");
        textView.setText(areaText);
        var spinner = view.findViewById("ID_AREA_SPINNER");
        var spinnerArrayAdapter = new ArrayAdapter(
            context, R.layout.spinner_item, Asset.results1
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(result);
        return view;
    }

    static getDo_OnlyPointView(context, activity, pointText, result) {
        var inflater = LayoutInflater.from(context);
        var view = inflater.inflate(R.layout.inspection_plan_do_point_view, null, true);
        var textView = view.findViewById("ID_POINT");
        textView.setText(pointText);
        var spinner = view.findViewById("ID_POINT_SPINNER");
        var spinnerArrayAdapter = new ArrayAdapter(
            context, R.layout.spinner_item, Asset.results1
        );
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(result);

        return [view];
    }
}
