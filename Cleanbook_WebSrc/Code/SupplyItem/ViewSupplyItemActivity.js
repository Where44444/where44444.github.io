class ViewSupplyItemActivity extends W4Activity {

    onCreate() {
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View Supplies");
        this.setContentView(R.layout.activity_view_supply_item);
        var id = this.getIntent().getStringExtra("id");
        this.isTemplate = this.getIntent().getBooleanExtra("isTemplate", false);
        if (this.isTemplate) {
            this.selectedSupplyItem = Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemTemplateList(), id);
        } else {
            this.selectedSupplyItem = Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemList(), id);
        }
        if (this.selectedSupplyItem == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            this.finish();
            return;
        }
        if (this.selectedSupplyItem.getAmountRequested() > 0) {
            var requestText = this.findViewById("View_SupplyItem_Requester");
            requestText.setVisibility(View.VISIBLE);
            requestText.setText(this.selectedSupplyItem.getAmountRequested() + " Requested by " + this.selectedSupplyItem.getRequester());
        }
        this.findViewById("View_SupplyItem_Name").setText(this.selectedSupplyItem.getName());
        this.findViewById("View_SupplyItem_Brand").setText(this.selectedSupplyItem.getBrand());
        this.findViewById("View_SupplyItem_Sku").setText(this.selectedSupplyItem.getSku());
        var priceString = "" + (this.selectedSupplyItem.getPrice() / 100);
        var needsDecimals = (this.selectedSupplyItem.getPrice() % 100 == 0)
        if (needsDecimals) {
            priceString += ".00";
        }
        else if (priceString.length > 1 && priceString.charAt(priceString.length - 2) == '.')
            priceString += "0";
        this.findViewById("View_SupplyItem_Price").setText(priceString);
        this.findViewById("View_SupplyItem_Quantity").setText("" + this.selectedSupplyItem.getQuantity());
        this.findViewById("View_SupplyItem_SuppliedBy").setText(this.selectedSupplyItem.getSuppliedBy());
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), this.selectedSupplyItem.getLocationID());
        if (location != null)
            this.findViewById("View_SupplyItem_Location_Text").setText(location.getName());
        else {
            this.findViewById("View_SupplyItem_Location_Label").setVisibility(View.GONE);
            this.findViewById("View_SupplyItem_Location_Text").setVisibility(View.GONE);
        }
        this.findViewById("View_SupplyItem_Notes").setText(this.selectedSupplyItem.getNotes());
        if (this.isTemplate) {
            this.findViewById("View_SupplyItem_Location_Label").setVisibility(View.GONE);
            this.findViewById("View_SupplyItem_Location_Text").setVisibility(View.GONE);
        }
    }
}
