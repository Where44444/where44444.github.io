class ViewPeopleListActivity extends W4Activity {

    static viewPeopleListActivity = null;

    onDestroy() {
        super.onDestroy();
        ViewPeopleListActivity.viewPeopleListActivity = null;
    }

    onCreate() {
super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        this.getSupportActionBar().setTitle("View People");
        this.setContentView(R.layout.activity_view_people_list);
        ViewPeopleListActivity.viewPeopleListActivity = this;
        this.intentReturnPersonPos = this.getIntent().getBooleanExtra("intentReturnPersonPos", false);
        var button = this.findViewById("AddPersonButton");
        if (MainActivity.currentPerson != null && MainActivity.currentPerson.getWritePermissions() != null && MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_PEOPLE]) {
            this.findViewById("AddPersonButton").setVisibility(View.VISIBLE);
            button.addEventListener("click", function () {
                var intent = new Intent(ViewPeopleListActivity.viewPeopleListActivity, new NewEditPersonActivity());
                ViewPeopleListActivity.viewPeopleListActivity.startActivity(intent);
            });
        } else
            this.findViewById("AddPersonButton").setVisibility(View.GONE);
        this.search_edittext = this.findViewById("Search_Bar");
        this.search_edittext.addEventListener('keyup', function () {
            ViewPeopleListActivity.viewPeopleListActivity.updateList();
        });

        this.updateList();
    }


    updateList() {
        super.updateList();
        var searchText = W4_Funcs.standardizeString(this.search_edittext.getText());
        var list;
        if (searchText != ("")) {
            list = Asset.getSearchedAssets(W4_Funcs.getPermittedPersonList(), searchText);
        } else {
            list = W4_Funcs.getPermittedPersonList();
        }
        this.personListAdapter = new PersonListAdapter(this, list, this.intentReturnPersonPos);
        this.findViewById("PeopleList").setAdapter(this.personListAdapter);
    }
}
