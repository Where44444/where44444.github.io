var _sync_socket = null;
const _db_lists_to_sync = [
  "change_alerts",
  "invoice_data",
  "parts_db/B_DNI",
  "parts_db/CHLX",
  "parts_db/DNI",
  "parts_db/F",
  "parts_db/GEM",
  "parts_db/H_RS",
  "parts_db/I_MM",
  "parts_db/JS",
  "parts_db/OEM",
  "parts_db/P&A_PRI",
  "sort_orders",
  "", //13 Set in init0.js "data/employeeids/" +  firebase.auth().currentUser.uid; because user has to log in before this can be retrieved
  "change_history"
];

const db_other_to_sync = [
  "encompass",
  "google_cse_api",
  "invoice",
];

function sync_button() {
  setTab(TAB_SYNC_DB);
  sync_display_none();
  document.getElementById("sync_db_div").style.display = "block";

  if (!_FIREBASE_LOGGED_IN) {
    document.getElementById("sync_db_firebase_login_div").style.display = "block";
    document.getElementById("password_input_sync").value = "";
  }
  else if (_socket == null) {
    document.getElementById("sync_db_local_login_div").style.display = "block";
    document.getElementById("local_server_connect_div_loading_sync").style.display = "none";
    document.getElementById("local_server_connect_div_non_loading_sync").style.display = "block";
    var ip = localStorage.getItem("local_server_ip");
    if (ip != null) {
      document.getElementById("input_local_server_ip_sync").value = ip;
    }
  }
  else {
    document.getElementById("sync_db_select_div").style.display = "block";
    document.getElementById("sync_status").innerHTML = "";
  }
}

function exitFirebaseServerScreen_sync() {
  exitSyncDiv()
}

function log_in_sync() {
  document.getElementById("login_sync_loader").style.display = "block";
  document.getElementById("email_input_sync").disabled = true;
  document.getElementById("password_input_sync").disabled = true;

  firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input_sync").value, document.getElementById("password_input_sync").value).then(function () {
    _FIREBASE_LOGGED_IN = true; //Have to cheese it here to help the sync_button method work because the onauthstatechangedlistener is too slow
    sync_button();
    document.getElementById("login_sync_loader").style.display = "none";
    document.getElementById("email_input_sync").disabled = false;
    document.getElementById("password_input_sync").disabled = false;
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("login error " + errorMessage);
    showSnackbar(errorMessage, 5000);
    document.getElementById("login_sync_loader").style.display = "none";
    document.getElementById("email_input_sync").disabled = false;
    document.getElementById("password_input_sync").disabled = false;
  });
}

function exitLocalServerScreen_sync() {
  exitSyncDiv();
}

function exitSyncDiv() {
  sync_display_none();
  document.getElementById("sync_db_div").style.display = "none";
  showContentDiv();

  if (last_selected_tab != TAB_SYNC_DB)
    setTab(last_selected_tab);
  else
    setTab(TAB_MAINMENU);
}

function connectToLocalServer_sync() {
  connectToLocalServer(true);
}

function cancelConnectToLocalServer_sync() {
  closeWebSocket();
  document.getElementById("local_server_connect_div_loading_sync").style.display = "none";
  document.getElementById("local_server_connect_div_non_loading_sync").style.display = "block";
}

function beginSync() {
  _content = null; //Syncing has begun, clear this sizeable data from memory because we'll be logging out after the sync anyway, and don't want to risk a memory overflow
  _content_standard = null;
  _content_extra = null;

  document.getElementById("beginSyncButton").style.display = "none";
  document.getElementById("exitSyncDivButton").style.display = "none";
  document.getElementById("sync_loader").style.display = "block";
  _sync_i0 = 0;
  // _firebaseListData = new Object();
  // _localListData = new Object();
  _deletions = [];
  let ref = firebase.database().ref(_DATABASE_PREFIX + "sync_deletions");
  ref.once('value', function (snapshot) { //Get Firebase Deletions
    _firebaseDeletions = snapshot.val();
    readFunctions.set("sync_deletions", function (val0, key0) { //Get Local Deletions
      _localDeletions = val0;
      if (_firebaseDeletions != null)
        for (let [key1, value1] of Object.entries(_firebaseDeletions))
          _deletions.push(value1);
      for (let [key1, value1] of Object.entries(_localDeletions))
        _deletions.push(value1);

      beginSyncRecursiveLists(); //Continue
    });
    let obj = new Object();
    obj["req"] = REQUESTTYPE_READ;
    obj["key"] = "sync_deletions";
    _socket.send(JSON.stringify(obj));
  });
}

var _sync_i0 = 0;
var _sync_i1 = 0;
var _firebaseKeysModified = null;
var _localKeysModified = null;
var _key_i = 0;
var _firebaseDone = false;
var _localDone = false;

var _firebaseListData = null;
var _localListData = null;
var _firebaseDeletions = null;
var _localDeletions = null;
var _deletions = null;
function beginSyncRecursiveLists() {
  _firebaseListData = new Object();
  _localListData = new Object();
  _firebaseDone = false;
  _localDone = false;
  
  var listPath = _db_lists_to_sync[_sync_i0];
  document.getElementById("sync_status").innerHTML = "Downloading lists data... " + listPath + "<br>" + (_sync_i0 + 1) + "/" + _db_lists_to_sync.length;

  var ref = firebase.database().ref(_DATABASE_PREFIX + listPath);
  ref.once('value', function (snapshot) {
    let val = snapshot.val();
    if (objSize(val) > 0)
      _firebaseListData[listPath] = val;
    snapshot = null; //Helps to prevent "Out of memory" errors?
    _firebaseDone = true;
    if (_localDone) {
      ++_sync_i0;
      resolveDiffs();
    }
  });

  readFunctions.set(listPath, function (val0, key0) {
    if (objSize(val0) > 0)
      _localListData[listPath] = val0;
    _localDone = true;
    if (_firebaseDone) {
      ++_sync_i0;
      resolveDiffs();
    }
  });
  var obj = new Object();
  obj["req"] = REQUESTTYPE_READ;
  obj["key"] = listPath;
  _socket.send(JSON.stringify(obj));
}

function resolveDiffs() {
  var date = new Date();

  let _firebaseKeysModified_map = new Map();
  let _localKeysModified_map = new Map();
  for (var [key0, value0] of Object.entries(_localListData)) {
    if (value0 != null) {
      for (var [key1, value1] of Object.entries(value0)) {
        if (value1.w4_dm == null) {  //Fix missing date modified
          value1.w4_dm = date.getTime();
          _localKeysModified_map.set(key0 + "/" + key1, [key0, key1]);
        }
      }
    }
  }

  for (var [key0, value0] of Object.entries(_firebaseListData)) {
    if (value0 != null)
      for (var [key1, value1] of Object.entries(value0)) {
        if (value1.w4_dm == null) { //Fix missing date modified
          value1.w4_dm = date.getTime();
          _firebaseKeysModified_map.set(key0 + "/" + key1, [key0, key1]);
        }
      }
  }

  for (var [key0, value0] of Object.entries(_firebaseListData)) {
    if (value0 != null)
      for (var [key1, fir] of Object.entries(value0)) { //Compare fir data
        if (_localListData[key0] != null && _localListData[key0][key1] != null) { //Keys in fir compare to loc dm
          let loc = _localListData[key0][key1];
          if (loc.w4_dm > fir.w4_dm) {
            _firebaseListData[key0][key1] = loc;
            _firebaseKeysModified_map.set(key0 + "/" + key1, [key0, key1]);
          }
        } else { //_localData is missing that value
          if (_localListData[key0] == null)
            _localListData[key0] = new Object();
          _localKeysModified_map.set(key0 + "/" + key1, [key0, key1]);

        }
      }
  }

  for (var [key0, value0] of Object.entries(_localListData)) {
    if (value0 != null)
      for (var [key1, loc] of Object.entries(value0)) { //Compare loc data
        if (_firebaseListData[key0] != null && _firebaseListData[key0][key1] != null) { //Keys in loc compare to fir dm
          let fir = _firebaseListData[key0][key1];
          if (fir.w4_dm > loc.w4_dm) {
            // _localData[key0][key1] = fir; //No need to change this array since all database copying will be from firebase array, since everything will be synced to be the same
            _localKeysModified_map.set(key0 + "/" + key1, [key0, key1]);
          }
        } else { //_firebaseData is missing that value
          if (_firebaseListData[key0] == null)
            _firebaseListData[key0] = new Object();
          _firebaseListData[key0][key1] = loc;
          _firebaseKeysModified_map.set(key0 + "/" + key1, [key0, key1]);
        }
      }
  }

  _firebaseKeysModified = [];
  _localKeysModified = [];
  for (let [key, value] of _firebaseKeysModified_map)
    _firebaseKeysModified.push(value);
  for (let [key, value] of _localKeysModified_map)
    _localKeysModified.push(value);

  _key_i = 0;
  recursiveSyncListsToFirebase();
}

function recursiveSyncListsToFirebase() {
  if (_key_i < _firebaseKeysModified.length) {
    let keys = _firebaseKeysModified[_key_i];
    ++_key_i;
    let ref = firebase.database().ref(_DATABASE_PREFIX + keys[0] + "/" + keys[1]);
    ref.set(_firebaseListData[keys[0]][keys[1]], recursiveSyncListsToFirebase);
    document.getElementById("sync_status").innerHTML = "Syncing " + keys[0] + "/" + keys[1] + " to FireBase<br>" + _key_i + "/" + _firebaseKeysModified.length;
    // console.log("Syncing " + keys[0] + "/" + keys[1] + " to FireBase\n" + _key_i + "/" + _firebaseKeysModified.length);
  } else {
    _key_i = 0;
    recursiveSyncListsToLocal();
  }
}

function recursiveSyncListsToLocal() {
  if (_key_i < _localKeysModified.length) {
    let keys = _localKeysModified[_key_i];
    ++_key_i;
    let reff = keys[0] + "/" + keys[1];
    writeFunctions.set(reff, recursiveSyncListsToLocal);
    var obj = new Object();
    obj["req"] = REQUESTTYPE_WRITE;
    obj["key"] = reff;
    obj["val"] = _firebaseListData[keys[0]][keys[1]];
    _socket.send(JSON.stringify(obj));
    document.getElementById("sync_status").innerHTML = "Syncing " + keys[0] + "/" + keys[1] + " to Local Server<br>" + _key_i + "/" + _localKeysModified.length;
    // console.log("Syncing " + keys[0] + "/" + keys[1] + " to Local Server\n" + _key_i + "/" + _localKeysModified.length);
  } else {
    if (_sync_i0 < _db_lists_to_sync.length) {
      beginSyncRecursiveLists();
    }
    else {
      _sync_i1 = 0;
      _firebaseOtherData = new Object();
      _localOtherData = new Object();
      beginSyncRecursiveOthers();
    }
  }
}

var _firebaseOtherData = null;
var _localOtherData = null;
function beginSyncRecursiveOthers() {
  if (_sync_i1 < db_other_to_sync.length) {
    document.getElementById("sync_status").innerHTML = "Downloading other data...<br>" + (_sync_i1 + 1) + "/" + db_other_to_sync.length;
    _firebaseDone = false;
    _localDone = false;

    var otherPath = db_other_to_sync[_sync_i1];

    var ref = firebase.database().ref(_DATABASE_PREFIX + otherPath);
    ref.once('value', function (snapshot) {
      let val = snapshot.val();
      if (objSize(val) > 0)
        _firebaseOtherData[otherPath] = val;
      snapshot = null; //Helps to prevent "Out of memory" errors?
      _firebaseDone = true;
      if (_localDone) {
        ++_sync_i1;
        beginSyncRecursiveOthers();
      }
    });

    readFunctions.set(otherPath, function (val0, key0) {
      if (objSize(val0) > 0)
        _localOtherData[otherPath] = val0;
      _localDone = true;
      if (_firebaseDone) {
        ++_sync_i1;
        beginSyncRecursiveOthers();
      }
    });
    var obj = new Object();
    obj["req"] = REQUESTTYPE_READ;
    obj["key"] = otherPath;
    _socket.send(JSON.stringify(obj));
  } else { //Recursive calls complete
    var date = new Date();

    let _firebaseKeysModified_map = new Map();
    let _localKeysModified_map = new Map();
    for (var [key0, value0] of Object.entries(_localOtherData)) {
      if (value0 != null)
        if (value0.w4_dm == null) {  //Fix missing date modified
          value0.w4_dm = date.getTime();
          _localKeysModified_map.set(key0, true);
        }
    }

    for (var [key0, value0] of Object.entries(_firebaseOtherData)) {
      if (value0 != null)
        if (value0.w4_dm == null) { //Fix missing date modified
          value0.w4_dm = date.getTime();
          _firebaseKeysModified_map.set(key0, true);
        }
    }

    for (var [key0, value0] of Object.entries(_firebaseOtherData)) {//Compare fir data
      if (value0 != null) {
        let fir = value0;
        if (_localOtherData[key0] != null && _localOtherData[key0] != null) { //Keys in fir compare to loc dm
          let loc = _localOtherData[key0];
          if (loc.w4_dm > fir.w4_dm) {
            _firebaseOtherData[key0] = loc;
            _firebaseKeysModified_map.set(key0, true);
          }
        } else { //_localData is missing that value
          if (_localOtherData[key0] == null)
            _localKeysModified_map.set(key0, true);
        }
      }
    }

    for (var [key0, value0] of Object.entries(_localOtherData)) {
      if (value0 != null) {
        let loc = value0;
        if (_firebaseOtherData[key0] != null && _firebaseOtherData[key0] != null) { //Keys in loc compare to fir dm
          let fir = _firebaseOtherData[key0];
          if (fir.w4_dm > loc.w4_dm) {
            _localKeysModified_map.set(key0, true);
          }
        } else { //_firebaseData is missing that value
          _firebaseOtherData[key0] = loc;
          _firebaseKeysModified_map.set(key0, true);
        }
      }
    }

    _firebaseKeysModified = [];
    _localKeysModified = [];
    for (let [key, value] of _firebaseKeysModified_map)
      _firebaseKeysModified.push(key);
    for (let [key, value] of _localKeysModified_map)
      _localKeysModified.push(key);

    _key_i = 0;
    recursiveSyncOthersToFirebase();
  }
}

function recursiveSyncOthersToFirebase() {
  if (_key_i < _firebaseKeysModified.length) {
    let key = _firebaseKeysModified[_key_i];
    ++_key_i;
    let ref = firebase.database().ref(_DATABASE_PREFIX + key);
    ref.set(_firebaseOtherData[key], recursiveSyncOthersToFirebase);
    document.getElementById("sync_status").innerHTML = "Syncing " + key + " to FireBase<br>" + _key_i + "/" + _firebaseKeysModified.length;
    // console.log("Syncing " + keys[0] + "/" + keys[1] + " to FireBase\n" + _key_i + "/" + _firebaseKeysModified.length);
  } else {
    _key_i = 0;
    recursiveSyncOthersToLocal();
  }
}

function recursiveSyncOthersToLocal() {
  if (_key_i < _localKeysModified.length) {
    let key = _localKeysModified[_key_i];
    ++_key_i;
    let reff = key;
    writeFunctions.set(reff, recursiveSyncOthersToLocal);
    var obj = new Object();
    obj["req"] = REQUESTTYPE_WRITE;
    obj["key"] = reff;
    obj["val"] = _firebaseOtherData[key];
    _socket.send(JSON.stringify(obj));
    document.getElementById("sync_status").innerHTML = "Syncing " + key + " to Local Server<br>" + _key_i + "/" + _localKeysModified.length;
    // console.log("Syncing " + keys[0] + "/" + keys[1] + " to Local Server\n" + _key_i + "/" + _localKeysModified.length);
  } else {
    _key_i = 0;
    _keys_to_delete = [];
    recursiveDeletions();
  }
}

var _deletion_obj = null;
var _keys_to_delete = null;
function recursiveDeletions() {
  if (_key_i < _deletions.length) {
    _deletion_obj = _deletions[_key_i];
    ++_key_i;
    readFunctions.set(_deletion_obj.key, function (val0, key0) {
      if (val0 != null && val0.w4_dm != null && _deletion_obj.w4_dm > val0.w4_dm) //Object was deleted later than it's last edit
        _keys_to_delete.push(_deletion_obj.key);
      document.getElementById("sync_status").innerHTML = "Marking " + _keys_to_delete.length + " items for deletion from " + _deletions.length + " previous deletions<br>" + _key_i + "/" + _deletions.length;
      recursiveDeletions();
    });
    let obj = new Object();
    obj["req"] = REQUESTTYPE_READ;
    obj["key"] = _deletion_obj.key;
    _socket.send(JSON.stringify(obj));
  } else {
    _key_i = 0;
    recursiveDeletions2();
  }
}

var _deletion_key = null;
function recursiveDeletions2() {
  if (_key_i < _keys_to_delete.length) {
    _deletion_key = _keys_to_delete[_key_i];
    ++_key_i;
    document.getElementById("sync_status").innerHTML = "Deleting " + _deletion_key + "<br>" + _key_i + "/" + _keys_to_delete;
    let ref = firebase.database().ref(_DATABASE_PREFIX + _deletion_key);
    ref.remove(function () { //Get Firebase Deletions
      deleteFunctions.set(_deletion_key, function () { //Get Local Deletions
        recursiveDeletions2(); //Continue
      });
      let obj = new Object();
      obj["req"] = REQUESTTYPE_DELETE;
      obj["key"] = _deletion_key;
      _socket.send(JSON.stringify(obj));
    });
  } else {
    finishSync();
  }
}

function finishSync() {
  //Log out and log back in to every machine when a sync is detected, only if user has editing access (just David for now), don't allow other machines to sync while syncing
  if (_LOCAL_SERVER_MODE) {
    document.getElementById("beginSyncButton").style.display = "block";
    document.getElementById("exitSyncDivButton").style.display = "block";
    document.getElementById("sync_loader").style.display = "none";
    document.getElementById("sync_status").innerHTML = "Syncing complete";
    setDivsOnLogOut();
    document.getElementById("button_server_select_local").click();
    var ip = localStorage.getItem("local_server_ip");
    document.getElementById("input_local_server_ip").value = ip;
    document.getElementById("button_server_local_connect").click();
  } else {
    document.getElementById("beginSyncButton").style.display = "block";
    document.getElementById("exitSyncDivButton").style.display = "block";
    document.getElementById("sync_loader").style.display = "none";
    document.getElementById("sync_status").innerHTML = "Syncing complete";
    log_out(true);
    document.getElementById("email_input").value = _current_email;
    document.getElementById("password_input").value = _current_password;
    log_in(true);
  }
  _firebaseListData = null;
  _localListData = null;
  _firebaseDeletions = null;
  _localDeletions = null;
  _deletions = null;
  _firebaseKeysModified = null;
  _localKeysModified = null;
}

function sync_display_none() {
  document.getElementById("content_div").style.display = "none";
  document.getElementById("sync_db_firebase_login_div").style.display = "none";
  document.getElementById("sync_db_local_login_div").style.display = "none";
  document.getElementById("sync_db_select_div").style.display = "none";
}