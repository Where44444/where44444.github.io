var _LOCAL_SERVER_MODE = false;

const REQUESTTYPE_READ = "r"
const REQUESTTYPE_WRITE = "w"
const REQUESTTYPE_DELETE = "e"
const REQUESTTYPE_ADDLISTENER = "l"
const REQUESTTYPE_DELETELISTENER = "d"
const REQUESTTYPE_REPLY_READ = "R"
const REQUESTTYPE_REPLY_WRITE = "W"
const REQUESTTYPE_REPLY_DELETE = "E"
const REQUESTTYPE_REPLY_LISTENERUPDATED = "U"
const REQUESTTYPE_REPLY_LISTENERDELETED = "D"
var listeners = [];
var socketListeners = new Map();
var readFunctions = new Map();
var writeFunctions = new Map();
var deleteFunctions = new Map();

var _OVERRIDE_LOCAL = 1;
var _OVERRIDE_FIREBASE = 2;

function socketRecievedMessage(event) {
    var json1 = JSON.parse(event.data);
    var key = json1["key"];
    var val = json1["val"];
    if (val == null)
        val = new Object();
    switch (json1["req"]) {
        case REQUESTTYPE_REPLY_READ:
            if (readFunctions.has(key)) {
                var func = readFunctions.get(key);
                readFunctions.delete(key);
                func(val, getKeyFromPath(key)); //Todo, send key of data
            }
            break;
        case REQUESTTYPE_REPLY_WRITE:
            if (writeFunctions.has(key)) {
                var func = writeFunctions.get(key);
                writeFunctions.delete(key);
                func();
            }
            break;
        case REQUESTTYPE_REPLY_DELETE:
            if (deleteFunctions.has(key)) {
                var func = deleteFunctions.get(key);
                deleteFunctions.delete(key);
                func();
            }
            break;
        case REQUESTTYPE_REPLY_LISTENERUPDATED:
            if (socketListeners.has(key)) {
                socketListeners.get(key)(val, getKeyFromPath(key));
            }
            break;
        case REQUESTTYPE_REPLY_LISTENERDELETED:
            break;

    }
}

function removeListeners(override) {
    if (override == null)
        override = -1;
    if ((override == _OVERRIDE_LOCAL || _LOCAL_SERVER_MODE) && override != _OVERRIDE_FIREBASE) {
        if (_socket != null) {
            for (let [key, value] of socketListeners) {
                var obj = new Object();
                obj["req"] = REQUESTTYPE_DELETELISTENER;
                obj["key"] = key;
                _socket.send(JSON.stringify(obj));
            }
        }
        socketListeners.clear();
    }
    else {
        for (var i = 0; i < listeners.length; ++i)
            listeners[i].off();
        listeners = [];
    }
}

function addDBListener(reff, function1, override) {
    if (override == null)
        override = -1;
    if ((override == _OVERRIDE_LOCAL || _LOCAL_SERVER_MODE) && override != _OVERRIDE_FIREBASE) {
        socketListeners.set(reff, function1);
        var obj = new Object();
        obj["req"] = REQUESTTYPE_ADDLISTENER;
        obj["key"] = reff;
        _socket.send(JSON.stringify(obj));
    }
    else {
        var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
        ref.on('value', (snapshot) => {
            var val = snapshot.val();
            if (val == null)
                val = new Object();
            function1(val, snapshot.key);
            snapshot = null; //Helps to prevent "Out of memory" errors?
        });
        listeners.push(ref);
    }
}

function readFromDB(reff, function1, override) {
    if (override == null)
        override = -1;
    if ((override == _OVERRIDE_LOCAL || _LOCAL_SERVER_MODE) && override != _OVERRIDE_FIREBASE) {
        readFunctions.set(reff, function1);
        var obj = new Object();
        obj["req"] = REQUESTTYPE_READ;
        obj["key"] = reff;
        _socket.send(JSON.stringify(obj));
    }
    else {
        // var ref0 = ref(getDatabase(), _DATABASE_PREFIX + reff);
        // get(ref0).then((snapshot) => {

        var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
        ref.once('value', function (snapshot) {
            var val = snapshot.val();
            if (val == null)
                val = new Object();
            // console.log("Snapshot|" + reff + "|" + objSize(val) + "|" + (val == null) + "|");
            function1(val, snapshot.key);
            snapshot = null; //Helps to prevent "Out of memory" errors?
        });
    }
}

function recursive_set_obj_w4_datemodified(obj) {
    let nonObjectFound = false;
    for (let [key, value] of Object.entries(obj)) {
        if (typeof value != "object") {
            let date = new Date();
            obj.w4_dm = date.getTime();
            nonObjectFound = true;
            break;
        }
    }

    if (!nonObjectFound) {
        for (let [key, value] of Object.entries(obj)) {
            recursive_set_obj_w4_datemodified(value);
        }
    }
}

function writeToDB(reff, object, function1, override) {
    if (override == null)
        override = -1;
    recursive_set_obj_w4_datemodified(object);
    if ((override == _OVERRIDE_LOCAL || _LOCAL_SERVER_MODE) && override != _OVERRIDE_FIREBASE) {
        if (function1 != null)
            writeFunctions.set(reff, function1);
        var obj = new Object();
        obj["req"] = REQUESTTYPE_WRITE;
        obj["key"] = reff;
        obj["val"] = object;
        _socket.send(JSON.stringify(obj));
    }
    else {
        var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
        ref.set(object, function1);
    }
}

function deleteFromDB(reff, function1, override) {
    if (override == null)
        override = -1;
    let obj0 = new Object();
    obj0.key = reff;
    writeToDB(getNewKeyPath("sync_deletions"), obj0, null); //Keep track of what keys have been deleted so that syncing deletes key on other database (would normally copy it back over)
    if ((override == _OVERRIDE_LOCAL || _LOCAL_SERVER_MODE) && override != _OVERRIDE_FIREBASE) {
        if (function1 != null)
            deleteFunctions.set(reff, function1);
        var obj = new Object();
        obj["req"] = REQUESTTYPE_DELETE;
        obj["key"] = reff;
        _socket.send(JSON.stringify(obj));
    }
    else {
        var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
        ref.remove(function1);
    }
}

function getNewKeyPath(reff) {
    var ref = firebase.database().ref(_DATABASE_PREFIX + reff).push();
    return reff + "/" + ref.key;
}

function getNewKey(reff) {
    var ref = firebase.database().ref(_DATABASE_PREFIX + reff).push();
    return ref.key;
}

function getKeyFromPath(pathAndKey) {
    for (var i = pathAndKey.length; i >= 0; --i) {
        if (pathAndKey[i] == '/') {
            return pathAndKey.substring(i + 1, pathAndKey.length);
        }
    }
    return pathAndKey;
}

function getDatabaseRef(key) {
    return firebase.database().ref(_DATABASE_PREFIX + key);
}

function writeToChangeHistory(type_text, change_info) {
    //Write employee initials, time, type text, change info
    var initials = getMyInitials();
    var time = (new Date()).getTime();
    var obj = new Object();
    obj.initials = initials;
    obj.time = time;
    obj.type = type_text;
    obj.change = change_info;

    writeToDB(getNewKeyPath("change_history"), obj, null);
}