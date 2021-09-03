class NewEditLocationActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_location);
        var location_id = a.getIntent().getStringExtra("location_id");
        a.newLocation = (location_id == null);
        if (a.newLocation) {
            a.getSupportActionBar().setTitle("New Location");
            a.selectedLocation = new Location();
            var reffLocation = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_LOCATIONS).push();
            a.selectedLocation.setW4id(reffLocation.key);
            a.findViewById("Delete_Edit_Location").setVisibility(View.GONE);
        }
        else {
            a.getSupportActionBar().setTitle("Edit Location");
            a.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), location_id);
        }
        if (a.selectedLocation == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var spinner = a.findViewById("Edit_Location_Country_Spinner");
        var spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, Location.countries_array
        );
        spinner.setAdapter(spinnerArrayAdapter);

        a.findViewById("Edit_Location_Name").setText(a.selectedLocation.getName());
        a.findViewById("Edit_Location_Address1").setText(a.selectedLocation.getAddress1());
        a.findViewById("Edit_Location_Address2").setText(a.selectedLocation.getAddress2());
        a.findViewById("Edit_Location_City").setText(a.selectedLocation.getCity());
        a.findViewById("Edit_Location_State").setText(a.selectedLocation.getState());
        a.findViewById("Edit_Location_Zip").setText(a.selectedLocation.getZip());
        a.findViewById("Edit_Location_Phone").setText(a.selectedLocation.getPhone());
        a.findViewById("Edit_Location_Country_Spinner").setSelection(a.selectedLocation.getCountry());
        a.findViewById("Edit_Location_GPSRadius").setText(a.selectedLocation.getGpsRadius() + "");
        a.findViewById("Edit_Location_Email").setText(a.selectedLocation.getEmail());
        a.findViewById("Edit_Location_Security").setText(a.selectedLocation.getSecurityInfo());
        a.findViewById("Edit_Location_Instructions").setText(a.selectedLocation.getInstructions());
        var button = a.findViewById("Cancel_Edit_Location");
        button.addEventListener("click", function () {
            a.finish();
        });
        button = a.findViewById("Accept_Edit_Location");
        button.addEventListener("click", function () {
            var name = a.findViewById("Edit_Location_Name").getText();
            var address1 = a.findViewById("Edit_Location_Address1").getText();
            var address2 = a.findViewById("Edit_Location_Address2").getText();
            var city = a.findViewById("Edit_Location_City").getText();
            var state = a.findViewById("Edit_Location_State").getText();
            var zip = a.findViewById("Edit_Location_Zip").getText();
            var phone = a.findViewById("Edit_Location_Phone").getText();
            var country = a.findViewById("Edit_Location_Country_Spinner").getSelectedItemPosition();
            var gpsRadius = W4_Funcs.getIntFromEditText(a.findViewById("Edit_Location_GPSRadius"), 0);
            var email = a.findViewById("Edit_Location_Email").getText();
            var securityInfo = a.findViewById("Edit_Location_Security").getText();
            var instructions = a.findViewById("Edit_Location_Instructions").getText();
            var reffLocation = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_LOCATIONS).child(a.selectedLocation.getW4id());
            var location = new Location(a.selectedLocation.getW4id(), name, address1, address2, city, state, zip, country, phone, email, securityInfo, instructions, gpsRadius, 0, 0);
            // var ll = W4_Funcs.getLLFromLocation(this, location);
            location.setLatitude(0);
            location.setLongitude(0);

            if (a.newLocation) {
                let reffMessage = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_MESSAGES).push();
                let initialMessage = new Message(reffMessage.key, "Send messages here to everyone assigned to " + name, new W4DateTime().getMillis(), MainActivity.currentPerson.getW4id(), location.getW4id())
                W4_Funcs.writeToDB(reffMessage, initialMessage, "");
                W4_Funcs.writeToDB(reffLocation, location, "New Location " + location.getName());
            }
            else {
                W4_Funcs.writeToDB(reffLocation, location, "Edited Location " + location.getName());
            }

            if (a.newLocation) {
                MainActivity.w4Toast(this, "Successfully added new Location", Toast.LENGTH_LONG);
            }
            else {
                MainActivity.w4Toast(this, "Successfully edited Location", Toast.LENGTH_LONG);
            }
            a.finish();
        });
        button = a.findViewById("Delete_Edit_Location");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ConfirmActivity());
            intent.putExtra("description", "Are you sure you want to delete this Location? All associated Messages, Shifts, Time Punches, Inspection Plans, Supplies, and Tasks will also be deleted.");
            a.startActivityForResult(intent, MainActivity.requestCodeLocationDelete);
        });
    }

    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeLocationDelete) {
            if (!this.newLocation && resultCode == AppCompatActivity.RESULT_OK) {
                for (let message of MainActivity.theCompany.getMessageList()) {
                    if (message.getLocationID() == (this.selectedLocation.getW4id())) {
                        var reffMessage = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_MESSAGES).child(message.getW4id());
                        W4_Funcs.deleteFromDB(reffMessage, "");
                    }
                }
                var shiftIDs = W4_Funcs.getShiftIDsForLocation(this.selectedLocation.getW4id());

                Deletions.deleteShifts_withLocation(this.selectedLocation.getW4id());
                Deletions.deleteTimePunches_withLocation(this.selectedLocation.getW4id());
                Deletions.deleteInspectionPlans_withLocation(this.selectedLocation.getW4id());
                Deletions.deleteSupplies_withLocation(this.selectedLocation.getW4id());
                Deletions.deleteTaskSheets_withShifts(shiftIDs);
                Deletions.deleteTaskSheetOccurences(shiftIDs, null);

                var reffLocation = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_LOCATIONS).child(this.selectedLocation.getW4id());
                W4_Funcs.deleteFromDB(reffLocation, "Deleted location " + this.selectedLocation.getName());
                MainActivity.w4Toast(this, "Successfully deleted Location", Toast.LENGTH_LONG);
                this.finish();
            }
        }
    }
}