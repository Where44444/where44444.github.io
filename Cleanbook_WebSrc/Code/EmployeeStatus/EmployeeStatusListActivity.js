class EmployeeStatusListActivity extends W4Activity {

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.employeeStatusListActivity = null;
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("Employee Status");
        this.setContentView(R.layout.activity_employee_status_list);
        FireBaseListeners.employeeStatusListActivity = this;
        this.search_edittext = this.findViewById("Search_Bar");
        this.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        }
        );

        this.updateList();
    }

    updateList() {
        super.updateList();
        var essList = W4_Funcs.getEmployeeStatuses();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (searchText != ("")) {
            essList = Asset.getSearchedAssets(essList, searchText);
        }
        var employeeStatusListAdapter = new EmployeeStatusListAdapter(this, essList);
        this.findViewById("EmployeeStatusList").setAdapter(employeeStatusListAdapter);
    }
}