class NewEditSupplyItemActivity extends W4Activity {


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.setContentView(R.layout.activity_new_edit_supply_item);
        var id = a.getIntent().getStringExtra("id");
        a.new_supplyItem = (id == null);
        a.isTemplate = a.getIntent().getBooleanExtra("isTemplate", false);
        a.locationList = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SUPPLIES);
        if (a.locationList.length == 0) {
            a.findViewById("SupplyItem_Location_Label").setVisibility(View.GONE);
            a.findViewById("SupplyItem_Location_Spinner").setVisibility(View.GONE);
        }

        if (a.new_supplyItem) {
            if (a.isTemplate) {
                a.getSupportActionBar().setTitle("New Supplies Template");
            }
            else {
                a.getSupportActionBar().setTitle("New Supplies");
            }
            a.selectedSupplyItem = new SupplyItem();
            var reffSupplyItem = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).push();
            a.selectedSupplyItem.setW4id(reffSupplyItem.key);
            a.selectedSupplyItem.setLocationID(a.getIntent().getStringExtra("location_id"));
            a.findViewById("Delete_SupplyItem").setVisibility(View.GONE);
        }
        else {
            if (a.isTemplate) {
                a.getSupportActionBar().setTitle("Edit Supplies Template");
            }
            else {
                a.getSupportActionBar().setTitle("Edit Supplies");
            }
            if (a.isTemplate) {
                a.selectedSupplyItem = Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemTemplateList(), id);
            } else {
                a.selectedSupplyItem = Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemList(), id);
            }
        }

        if (a.selectedSupplyItem == null) {
            MainActivity.w4Toast(this, MainActivity.missingAsset, Toast.LENGTH_LONG);
            a.finish();
            return;
        }
        var button = a.findViewById("Import_Template");
        button.addEventListener("click", function () {
            var intent = new Intent(this, new ViewTemplateListActivity());
            intent.putExtra("assetType", Asset.PERMISSION_ALL_SUPPLIES);
            intent.putExtra("newEditActivity", new NewEditSupplyItemActivity());
            intent.putExtra("returnAsset", true);
            a.startActivityForResult(intent, MainActivity.requestCodeReturnTemplateAsset);
        });
        var spinner = a.findViewById("SupplyItem_Location_Spinner");
        var spinnerArrayAdapter = new ArrayAdapter(
            this, R.layout.spinner_item, W4_Funcs.getLocationNames(a.locationList)
        );
        spinner.setAdapter(spinnerArrayAdapter);
        var button = a.findViewById("Cancel_SupplyItem");
        button.addEventListener("click", function () {
            a.finish();

        });
        var button = a.findViewById("Accept_SupplyItem");
        button.addEventListener("click", function () {
            var name0 = a.findViewById("SupplyItem_Name").getText();
            var brand = a.findViewById("SupplyItem_Brand").getText();
            var sku = a.findViewById("SupplyItem_Sku").getText();
            var priceString = a.findViewById("SupplyItem_Price").getText();
            var price = 0;
            if (priceString.length > 0 && (priceString.charAt(priceString.length - 1)) == '.') {
                priceString += "00";
            }
            var regexp = new RegExp("\\d*.?\\d+", "g");
            let match;
            if (priceString.length > 0 && (match = regexp.exec(priceString)) !== null) {
                price = Math.round(Number(priceString) * 100);
            }
            var quantity = 0;
            quantity = W4_Funcs.getIntFromEditText(a.findViewById("SupplyItem_Quantity"), 1);
            var suppliedBy = a.findViewById("SupplyItem_SuppliedBy").getText();
            var notes = a.findViewById("SupplyItem_Notes").getText();
            var locationID = "";
            var locationPos = a.findViewById("SupplyItem_Location_Spinner").getSelectedItemPosition();
            if (locationPos != -1) {
                locationID = W4_Funcs.getPermittedLocationList_ForX(Asset.PERMISSION_ALL_SUPPLIES)[locationPos].getW4id();
            }
            var reffSupplyItem = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).child(a.selectedSupplyItem.getW4id());
            var supplyItem = new SupplyItem(a.selectedSupplyItem.getW4id(), name0, brand, sku, price, quantity, suppliedBy, notes, locationID, a.selectedSupplyItem.getAmountRequested(), a.selectedSupplyItem.getRequester(), a.isTemplate, a.selectedSupplyItem.getTemplateID());
            if (a.new_supplyItem) {
                W4_Funcs.writeToDB(reffSupplyItem, supplyItem, "New Supplies " + supplyItem.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(supplyItem.getLocationID()) + "|");
                MainActivity.w4Toast(this, "Successfully added new Supplies", Toast.LENGTH_LONG);
            } else {
                W4_Funcs.writeToDB(reffSupplyItem, supplyItem, "Edited Supplies " + supplyItem.getName() + " |Location:" + W4_DBLog.getLocationStringForLog(supplyItem.getLocationID()) + "|");
                MainActivity.w4Toast(this, "Successfully edited Supplies", Toast.LENGTH_LONG);
            }
            a.finish();

        });

        if (!a.new_supplyItem) {
            button = a.findViewById("Delete_SupplyItem");
            button.addEventListener("click", function () {
                var intent = new Intent(this, new ConfirmActivity());
                intent.putExtra("description", "Are you sure you want to delete this item? This will delete all associated SDS Sheets.");
                a.startActivityForResult(intent, MainActivity.requestCodeSupplyItemDelete);
            });
        }
        a.setUIFromSelectedSupplyItem(false);
    }

    setUIFromSelectedSupplyItem(templateImport) {
        var requestText = this.findViewById("SupplyItem_Requester");
        if (this.selectedSupplyItem.getAmountRequested() > 0) {
            requestText.setVisibility(View.VISIBLE);
            requestText.setText(this.selectedSupplyItem.getAmountRequested() + " Requested by " + this.selectedSupplyItem.getRequester());
        } else {
            requestText.setVisibility(View.GONE);
        }
        this.findViewById("SupplyItem_Name").setText(this.selectedSupplyItem.getName());
        this.findViewById("SupplyItem_Brand").setText(this.selectedSupplyItem.getBrand());
        this.findViewById("SupplyItem_Sku").setText(this.selectedSupplyItem.getSku());
        var priceString = "" + (this.selectedSupplyItem.getPrice() / 100);
        var needsDecimals = (this.selectedSupplyItem.getPrice() % 100 == 0)
        if (needsDecimals) {
            priceString += ".00";
        }
        else if (priceString.length > 1 && priceString.charAt(priceString.length - 2) == '.')
            priceString += "0";

        this.findViewById("SupplyItem_Price").setText(priceString);
        this.findViewById("SupplyItem_Quantity").setText("" + this.selectedSupplyItem.getQuantity());
        this.findViewById("SupplyItem_SuppliedBy").setText(this.selectedSupplyItem.getSuppliedBy());
        if (!templateImport) {
            var locationIndex = Asset.getAssetPositionInList(this.locationList, this.selectedSupplyItem.getLocationID());
            if (this.locationList.length > locationIndex && locationIndex >= 0) {
                this.findViewById("SupplyItem_Location_Spinner").setSelection(locationIndex);
            }
        }
        this.findViewById("SupplyItem_Notes").setText(this.selectedSupplyItem.getNotes());

        if (this.isTemplate) {
            this.findViewById("SupplyItem_Location_Label").setVisibility(View.GONE);
            this.findViewById("SupplyItem_Location_Spinner").setVisibility(View.GONE);
        }
    }


    onActivityResult(requestCode, resultCode, data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeSupplyItemDelete) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                Deletions.deleteSupplyItem(this.selectedSupplyItem);
                MainActivity.w4Toast(this, "Successfully deleted Supplies", Toast.LENGTH_LONG);
                this.finish();
            }
        } else if (requestCode == MainActivity.requestCodeReturnTemplateAsset) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                this.selectedSupplyItem1 = new SupplyItem(Asset.getAssetbyId(MainActivity.theCompany.getSupplyItemTemplateList(), data.getStringExtra("returnID")));
                this.selectedSupplyItem1.setTemplateID(this.selectedSupplyItem1.getW4id());
                this.selectedSupplyItem1.setW4id(this.selectedSupplyItem.getW4id());
                this.selectedSupplyItem1.setLocationID(this.selectedSupplyItem.getLocationID());
                this.selectedSupplyItem1.setAmountRequested(this.selectedSupplyItem.getAmountRequested());
                this.selectedSupplyItem1.setRequester(this.selectedSupplyItem.getRequester());
                this.selectedSupplyItem = this.selectedSupplyItem1;
                this.setUIFromSelectedSupplyItem(true);
                MainActivity.dialogBox(this, "Template SDS linked", "SDS for this supplies will reference the SDS PDFs and images assigned to this template. To edit the SDS for this template, go to Home Screen->SDS->Templates. Linking won't occur until you press 'Accept'.");
            }
        }
    }
}
