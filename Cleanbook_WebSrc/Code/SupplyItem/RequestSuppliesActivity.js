class RequestSuppliesActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().hide();
        a.setContentView(R.layout.activity_request_supplies);
        a.selectedSupplyItem = Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemList(), a.getIntent().getStringExtra("id"));
        if (a.selectedSupplyItem == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        if (a.selectedSupplyItem.getAmountRequested() <= 0)
            a.findViewById("Request_Supplies_Amount").setValue("1");
        else
            a.findViewById("Request_Supplies_Amount").setValue(a.selectedSupplyItem.getAmountRequested() + "");
        var button = a.findViewById("Request_Supplies_Amount_Minus");
        button.addEventListener("click", function () {
            var editText = a.findViewById("Request_Supplies_Amount");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            if (value > 1)
                --value;
            else
                value = 1;
            editText.setText(value + "");
        });
        var button = a.findViewById("Request_Supplies_Amount_Plus");
        button.addEventListener("click", function () {
            var editText = a.findViewById("Request_Supplies_Amount");
            var value = W4_Funcs.getIntFromEditText(editText, 1);
            ++value;
            editText.setValue(value + "");

        });
        var button = a.findViewById("Cancel_Request_Supplies");
        button.addEventListener("click", function () {
            a.finish();

        });
        var button = a.findViewById("Accept_Request_Supplies");
        button.addEventListener("click", function () {
            var requestAmount = W4_Funcs.getIntFromEditText(a.findViewById("Request_Supplies_Amount"), 1);
            var reffSupplyItem = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).child(a.selectedSupplyItem.getW4id());
            a.selectedSupplyItem.setAmountRequested(requestAmount);
            a.selectedSupplyItem.setRequester(MainActivity.currentPerson.getFirst_name() + " " + MainActivity.currentPerson.getLast_name());
            W4_Funcs.writeToDB(reffSupplyItem, a.selectedSupplyItem, "");
            MainActivity.w4Toast(this, "Successfully requested Supplies", Toast.LENGTH_LONG);
            a.finish();
        });
    }
}
