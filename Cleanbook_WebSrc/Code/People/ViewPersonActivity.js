class ViewPersonActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Person");
        a.setContentView(R.layout.activity_view_person);

        a.read_switches = [];
        a.write_switches = [];
        a.radio_groups = [];
        a.radios_all = [];
        a.radios_assigned = [];

        a.read_switches.push(a.findViewById("View_Person_Read_Locations"));
        a.read_switches.push(a.findViewById("View_Person_Read_Messages"));
        a.read_switches.push(a.findViewById("View_Person_Read_People"));
        a.read_switches.push(a.findViewById("View_Person_Read_Shifts"));
        a.read_switches.push(a.findViewById("View_Person_Read_TimePunches"));
        a.read_switches.push(a.findViewById("View_Person_Read_Inspections"));
        a.read_switches.push(a.findViewById("View_Person_Read_Supplies"));
        a.read_switches.push(a.findViewById("View_Person_Read_SDS"));
        a.read_switches.push(a.findViewById("View_Person_Read_Tasks"));

        a.write_switches.push(a.findViewById("View_Person_Write_Locations"));
        a.write_switches.push(a.findViewById("View_Person_Write_Messages"));
        a.write_switches.push(a.findViewById("View_Person_Write_People"));
        a.write_switches.push(a.findViewById("View_Person_Write_Shifts"));
        a.write_switches.push(a.findViewById("View_Person_Write_TimePunches"));
        a.write_switches.push(a.findViewById("View_Person_Write_Inspections"));
        a.write_switches.push(a.findViewById("View_Person_Write_Supplies"));
        a.write_switches.push(a.findViewById("View_Person_Write_SDS"));
        a.write_switches.push(a.findViewById("View_Person_Write_Tasks"));

        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_Locations"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_Messages"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_People"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_Shifts"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_TimePunches"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_Inspections"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_Supplies"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_SDS"));
        a.radio_groups.push(a.findViewById("View_Person_Radio_Group_Tasks"));

        a.radios_all.push(a.findViewById("View_Person_All_Locations"));
        a.radios_all.push(a.findViewById("View_Person_All_Messages"));
        a.radios_all.push(a.findViewById("View_Person_All_People"));
        a.radios_all.push(a.findViewById("View_Person_All_Shifts"));
        a.radios_all.push(a.findViewById("View_Person_All_TimePunches"));
        a.radios_all.push(a.findViewById("View_Person_All_Inspections"));
        a.radios_all.push(a.findViewById("View_Person_All_Supplies"));
        a.radios_all.push(a.findViewById("View_Person_All_SDS"));
        a.radios_all.push(a.findViewById("View_Person_All_Tasks"));

        a.radios_assigned.push(a.findViewById("View_Person_Assigned_Locations"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_Messages"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_People"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_Shifts"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_TimePunches"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_Inspections"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_Supplies"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_SDS"));
        a.radios_assigned.push(a.findViewById("View_Person_Assigned_Tasks"));
        a.selectedPerson = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), a.getIntent().getStringExtra("id"));
        if (a.selectedPerson == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        a.findViewById("View_Person_Type_Text").setText(Asset.person_types_array[a.selectedPerson.getType()]);
        a.findViewById("View_Person_FirstName").setText(a.selectedPerson.getFirst_name());
        a.findViewById("View_Person_LastName").setText(a.selectedPerson.getLast_name());
        a.findViewById("View_Person_Phone").setText(a.selectedPerson.getPhone());
        a.findViewById("View_Person_Email").setText(a.selectedPerson.getEmail());
        a.findViewById("View_Person_RequiresGPS_CheckBox").setChecked(a.selectedPerson.isRequiringGPSClockIn());

        //Set UI From READ Permissions---------------------------------------------------------------------------------------------------------------------------------------
        for (var i = 0; i < a.read_switches.length; ++i) {
            if (a.selectedPerson.getReadPermissions()[i * 2] || a.selectedPerson.getReadPermissions()[i * 2 + 1]) {
                a.read_switches[i].setChecked(true);
                if (a.selectedPerson.getReadPermissions()[i * 2]) {
                    a.radios_all[i].setChecked(true);
                } else {
                    a.radios_assigned[i].setChecked(true);
                }
            }
        }

        //Set UI From WRITE Permissions---------------------------------------------------------------------------------------------------------------------------------------
        for (var i = 0; i < a.write_switches.length; ++i) {
            if (a.selectedPerson.getWritePermissions()[i * 2] || a.selectedPerson.getWritePermissions()[i * 2 + 1]) {
                a.write_switches[i].setChecked(true);
                if (a.selectedPerson.getWritePermissions()[i * 2]) {
                    a.radios_all[i].setChecked(true);
                } else {
                    a.radios_assigned[i].setChecked(true);
                }
            }
        }
        for (var i = 0; i < a.read_switches.length; ++i)
            a.processViewBoxChecking(a.read_switches[i], a.write_switches[i], a.radio_groups[i]);
        var button = a.findViewById("View_Person_Permissions_Button");
        button.addEventListener("click", function () {
            if (a.findViewById("View_Person_Permissions_Div").getVisibility() == View.VISIBLE)
                a.findViewById("View_Person_Permissions_Div").setVisibility(View.GONE);
            else
                a.findViewById("View_Person_Permissions_Div").setVisibility(View.VISIBLE);
        });

        a.findViewById("View_Permissions_Help").addEventListener("click", function () {
            if (a.findViewById("View_Person_Permissions_Text").getVisibility() == View.GONE)
                a.findViewById("View_Person_Permissions_Text").setVisibility(View.VISIBLE);
            else
                a.findViewById("View_Person_Permissions_Text").setVisibility(View.GONE);
        });
    }

    processViewBoxChecking(readBox, writeBox, radioGroup) {
        if (readBox.isChecked() || writeBox.isChecked()) {
            radioGroup.setVisibility(View.VISIBLE);
        } else if (!readBox.isChecked() && !writeBox.isChecked()) {
            radioGroup.setVisibility(View.GONE);
        }

        if (writeBox.isChecked())
            readBox.setChecked(true);
    }
}
