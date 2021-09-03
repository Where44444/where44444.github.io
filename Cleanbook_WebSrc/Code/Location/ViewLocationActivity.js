class ViewLocationActivity extends W4Activity {

    onCreate() {
super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View Location");
        this.setContentView(R.layout.activity_view_location);
        var location_id = this.getIntent().getStringExtra("location_id");
        this.selectedLocation = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), location_id);
        if (this.selectedLocation == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            this.finish();
            return;
        }
        this.getSupportActionBar().setTitle("View Location");

        this.findViewById("View_Location_Name").setText(this.selectedLocation.getName());
        this.findViewById("View_Location_Address1").setText(this.selectedLocation.getAddress1());
        this.findViewById("View_Location_Address2").setText(this.selectedLocation.getAddress2());
        this.findViewById("View_Location_City").setText(this.selectedLocation.getCity());
        this.findViewById("View_Location_State").setText(this.selectedLocation.getState());
        this.findViewById("View_Location_Zip").setText(this.selectedLocation.getZip());
        this.findViewById("View_Location_Phone").setText(this.selectedLocation.getPhone());
        this.findViewById("View_Location_Country_Text").setText(Asset.countries_array[this.selectedLocation.getCountry()]);
        this.findViewById("View_Location_GPSRadius").setText(this.selectedLocation.getGpsRadius() + "");
        this.findViewById("View_Location_Email").setText(this.selectedLocation.getEmail());
        this.findViewById("View_Location_Security").setText(this.selectedLocation.getSecurityInfo());
        this.findViewById("View_Location_Instructions").setText(this.selectedLocation.getInstructions());
    }
}
