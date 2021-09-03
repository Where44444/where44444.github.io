class ViewTemplateListActivity extends W4Activity {

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewTemplateListActivity = null;
    }

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("View Templates");
        a.setContentView(R.layout.activity_view_template_list);
        FireBaseListeners.viewTemplateListActivity = this;
        a.assetType = a.getIntent().getIntExtra("assetType", 0);
        a.newEditActivity = a.getIntent().getStringExtra("newEditActivity");
        a.viewActivity = a.getIntent().getStringExtra("viewActivity");
        a.returnAsset = a.getIntent().getBooleanExtra("returnAsset", false);
        a.isSDS = a.getIntent().getBooleanExtra("isSDS", false);
        var fbutton = a.findViewById("AddTemplateButton");
        if (MainActivity.currentPerson.getWritePermissions()[a.assetType] || MainActivity.currentPerson.getWritePermissions()[a.assetType + 1]) {
            a.findViewById("AddTemplateButton").setVisibility(View.VISIBLE);
            fbutton.addEventListener("click", function () {
                var intent = new Intent(this, a.newEditActivity);
                intent.putExtra("isTemplate", true);
                a.startActivity(intent);
            });
        }
        else {
            a.findViewById("AddTemplateButton").setVisibility(View.GONE);
        }
        a.search_edittext = a.findViewById("Search_Bar");
        a.search_edittext.addEventListener('keyup', function () {
            a.updateList();
        });

        a.updateList();
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        if (searchText != "") {
            this.assetList = Asset.getSearchedAssets(W4_Funcs.getPermittedAssetTemplateList(this.assetType), searchText);
        }
        else {
            this.assetList = W4_Funcs.getPermittedAssetTemplateList(this.assetType);
        }
        this.templateListAdapter = new TemplateListAdapter(this, this.assetList);
        this.findViewById("TemplateList").setAdapter(this.templateListAdapter);
    }

    listItemSelected(position) {
        var a = this;
        var asset = a.assetList[position];
        if (a.returnAsset) {
            a.getIntent().putExtra("returnID", asset.getW4id());
            a.setResult(AppCompatActivity.RESULT_OK, a.getIntent());
            a.finish();
        } else if (a.isSDS) {
            var intent = new Intent(this, new ViewNewEditSDSActivity());
            intent.putExtra("id", asset.getW4id());
            a.startActivity(intent);
        }
        else {
            var intent;
            if ((MainActivity.currentPerson.getWritePermissions()[a.assetType] || MainActivity.currentPerson.getWritePermissions()[a.assetType + 1])) {
                intent = new Intent(this, a.newEditActivity);
            }
            else {
                intent = new Intent(this, a.viewActivity);
            }
            intent.putExtra("id", asset.getW4id());
            intent.putExtra("isTemplate", true);
            a.startActivity(intent);
        }
    }
}
