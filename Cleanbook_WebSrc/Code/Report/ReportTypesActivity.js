class ReportTypesActivity extends W4Activity {
    static EXPORT_HOURS_COUNT = 0;
    static EXPORT_CLOCK_SUMMARY = 1;
    static EXPORT_TASK_SUMMARY = 2;
    static EXPORT_INSPECTION_SUMMARY = 3;

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Reports");
        a.setContentView(R.layout.activity_report_types);

        a.findViewById("Button_Export_Hours_Count").addEventListener("click", function () {
            ReportTypesActivity.buttonExportHoursCount(a);
        });

        a.findViewById("Button_Export_Clock_Summary").addEventListener("click", function () {
            ReportTypesActivity.buttonExportClockSummary(a);
        });

        a.findViewById("Button_Export_Task_Summary").addEventListener("click", function () {
            ReportTypesActivity.buttonExportTaskSummary(a);
        });

        a.findViewById("Button_Export_Supply_Requests").addEventListener("click", function () {
            ReportTypesActivity.buttonExportSupplyRequests(a);
        });

        a.findViewById("Button_Export_Inspection_Summary").addEventListener("click", function () {
            ReportTypesActivity.buttonExportInspectionSummary(a);
        });
    }

    static buttonExportHoursCount(activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var intent = new Intent(activity, new ViewTimePunchListByTypeActivity());
            intent.putExtra("export_type", ReportTypesActivity.EXPORT_HOURS_COUNT);
            activity.startActivity(intent);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static buttonExportClockSummary(activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var intent = new Intent(activity, new ViewTimePunchListByTypeActivity());
            intent.putExtra("export_type", ReportTypesActivity.EXPORT_CLOCK_SUMMARY);
            activity.startActivity(intent);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static buttonExportTaskSummary(activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var intent = new Intent(activity, new ViewTimePunchListByTypeActivity());
            intent.putExtra("export_type", ReportTypesActivity.EXPORT_TASK_SUMMARY);
            activity.startActivity(intent);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static buttonExportTaskSummary_Skip(activity, byPerson, name0, location_id, person_id) {
        if (MainActivity.currentPerson.canExportReports()) {
            var intent = new Intent(activity, new StartEndDateActivity());
            intent.putExtra("by_person", byPerson);
            intent.putExtra("name", name0);
            intent.putExtra("location_id", location_id);
            intent.putExtra("person_id", person_id);
            intent.putExtra("export_type", ReportTypesActivity.EXPORT_TASK_SUMMARY);
            activity.startActivity(intent);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static buttonExportSupplyRequests(activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            Exports.exportSupplyRequests(activity);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static buttonExportInspectionSummary(activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var intent = new Intent(activity, new ViewTimePunchListByTypeActivity());
            intent.putExtra("export_type", ReportTypesActivity.EXPORT_INSPECTION_SUMMARY);
            activity.startActivity(intent);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }
}
