var _local_admin = "-MkdCi-odQ9JClQ8iI0M";

var _employee_table_ids = [];
function updateEmployeeIDsTable() {
    document.getElementById("button_save_employee_ids").style.display = "none";
    var tableHTML = "<h2>Employees</h2><table id='employee_ids_table_ele' class='largeText'><tr><th>First Name</th><th>Middle Name</th><th>Last Name</th><th>ID</th><th>Admin</th><th>Delete</th></tr></table>";
    document.getElementById("employee_ids_table").innerHTML = tableHTML;
    _employee_table_ids = [];
    if (_downloaded_employee_ids != null)
        for (let [key, val] of Object.entries(_downloaded_employee_ids)) {
            _employee_table_ids.push(key);
            insertEmployeeIDTableRow(val.first_name, val.middle_name, val.last_name, val.id, val.admin);
        }
}

function saveEmployeeIDs() {
    let obj = new Object();
    var table = document.getElementById("employee_ids_table_ele");
    var i = 0;
    for (let id of _employee_table_ids) {
        ++i;
        var obj0 = new Object();
        obj[id] = obj0;
        obj0.first_name = String(table.rows[i].cells[0].children[0].value);
        obj0.middle_name = String(table.rows[i].cells[1].children[0].value);
        obj0.last_name = String(table.rows[i].cells[2].children[0].value);
        obj0.id = String(table.rows[i].cells[3].children[0].value);
        //Don't allow admin to change their admin status
        if (id != _local_admin)
            obj0.admin = table.rows[i].cells[4].children[0].checked;
        else
            obj0.admin = true;
    }
    writeToDB("data/employeeids", obj, null);
}

function employeeIDTableChanged() {
    document.getElementById("button_save_employee_ids").style.display = "block";
}

function newEmployeeID() {
    insertEmployeeIDTableRow("", "", "", "", false);
    _employee_table_ids.push(getNewKey("data/employeeids"));
    saveEmployeeIDs();
}

function insertEmployeeIDTableRow(first_name, middle_name, last_name, id, admin) {
    var table = document.getElementById("employee_ids_table_ele");
    var len = table.rows.length;
    var row = table.insertRow(len);
    var tableHTML = "<td><input class='largeText' onkeyup='employeeIDTableChanged();' value='" + first_name
        + "'></td><td><input class='largeText' onkeyup='employeeIDTableChanged();' value='" + middle_name
        + "'></td><td><input class='largeText' onkeyup='employeeIDTableChanged();' value='" + last_name
        + "'></td><td><input class='largeText' onkeyup='employeeIDTableChanged();' value='" + id
        + "'></td><td><input style='width: 30px; height: 30px;' onchange='employeeIDTableChanged();' type='checkbox'";

    if (admin)
        tableHTML += "checked";
    tableHTML += "></td><td><button style='width: 100px; height: 30px;' onclick='deleteEmployee(" + (len - 1) + ");'>X</button></td>";
    row.innerHTML = tableHTML;
}

function deleteEmployee(row) {
    var key = _employee_table_ids[row];
    if (key != _local_admin)
        deleteFromDB("data/employeeids/" + key, null);
    else
        showSnackbar("Cannot delete main Admin!", 5000);
}

var _clients_table_ids = [];
function updateClientsTable() {
    document.getElementById("button_new_client").style.display = "none";
    document.getElementById("button_save_clients").style.display = "none";
    if (_FIREBASE_LOGGED_IN) {
        if (firebase.auth().currentUser.uid == _admin_uid && _current_employee != null && _current_employee.admin) {
            document.getElementById("button_save_clients").style.display = "none";
            _clients_table_ids = [];
            if (objSize(_downloaded_clients) > 0) {
                var tableHTML = "<h2>Clients</h2><table id='clients_table_ele' class='largeText'><tr><th>Email</th><th>First Name</th><th>Last Name</th><th>Company</th><th>Blacklisted</th><th>Info</th></tr></table>";
                document.getElementById("clients_table").innerHTML = tableHTML;
                if (_downloaded_clients != null)
                    for (let [key, val] of Object.entries(_downloaded_clients)) {
                        _clients_table_ids.push(key);
                        insertClientTableRow(val.email, val.first_name, val.last_name, val.company, doesOBJContainVal(_downloaded_blacklist, key), val.uid);
                    }
            }
            else {
                document.getElementById("clients_table").innerHTML = "<h2>Clients</h2><h3>You have no clients</h3>";
            }
            if (document.getElementById("new_client_table_ele") == null)
                document.getElementById("button_new_client").style.display = "";
            else
                document.getElementById("button_save_clients").style.display = "";
        }
        else {
            document.getElementById("clients_table").innerHTML = "<h3>You must be logged in to Google FireBase as an admin to edit Clients</h3><br>";
            document.getElementById("new_client_table").innerHTML = "";
        }
    }
    else {
        document.getElementById("clients_table").innerHTML = "<h3>You must be logged in to Google FireBase to edit Clients</h3><br>" +
            "<button style='width: 200px; height: 50px;' onclick='clientsTableLogin();'>Login</button>";
        document.getElementById("new_client_table").innerHTML = "";
    }
}

function clientsTableLogin() {
    _current_login_temp_intent = TAB_PEOPLE;
    document.getElementById("firebase_temp_login_header").innerHTML = "Login to FireBase to Edit Clients";
    document.getElementById("firebase_temp_login_div").style.display = "";
    document.getElementById("password_input_temp").value = "";
    document.getElementById("email_input_temp").focus();
    document.getElementById("email_input_temp").select();
    document.getElementById("content_div").style.display = "none";
}

var _intent_people = false;
var _newUserUID = "";
var _newClient_for_info = null;
function saveClients() {
    let obj = new Object();
    var table = document.getElementById("clients_table_ele");
    var i = 0;
    var blacklistedObj = new Object();
    for (let id of _clients_table_ids) {
        ++i;
        var obj0 = new Object();
        obj[id] = obj0;
        obj0.email = String(table.rows[i].cells[0].children[0].innerHTML);
        obj0.first_name = String(table.rows[i].cells[1].children[0].value);
        obj0.last_name = String(table.rows[i].cells[2].children[0].value);
        obj0.company = String(table.rows[i].cells[3].children[0].value);
        let blacklisted = table.rows[i].cells[4].children[0].checked;
        obj0.uid = String(table.rows[i].cells[5].innerHTML);
        if (blacklisted)
            blacklistedObj[obj0.uid] = id;
    }
    writeToDB("data/clients", obj, null, _OVERRIDE_FIREBASE);
    writeToDB("data/blacklisted_clients", blacklistedObj, null, _OVERRIDE_FIREBASE);

    if (document.getElementById("new_client_table_ele") != null) {
        var obj1 = new Object();
        _newClient_for_info = obj1;
        table = document.getElementById("new_client_table_ele");
        obj1.email = String(table.rows[1].cells[0].children[0].value).toLowerCase();
        obj1.first_name = String(table.rows[1].cells[1].children[0].value);
        obj1.last_name = String(table.rows[1].cells[2].children[0].value);
        obj1.company = String(table.rows[1].cells[3].children[0].value);
        let blacklisted = table.rows[1].cells[4].children[0].checked;
        if (isValidEmail(obj1.email)) {
            let pathkey = getNewKey("data/clients");
            writeToDB("data/clients/" + pathkey, obj1, null, _OVERRIDE_FIREBASE);
            var password = obj1.email;
            if (password.length < 6) {
                var lengthNeeded = 6 - password.length;
                for (var i = 0; i < lengthNeeded; ++i)
                    password += "0";
            }
            firebase.auth().createUserWithEmailAndPassword(obj1.email, password) //Creating a new person also signs into that account, make sure to sign back into original account
                .then((userCredential) => {
                    // Sign in success, update UI with the signed-in user's information
                    document.getElementById("new_client_table").innerHTML = "";
                    _newUserUID = firebase.auth().currentUser.uid;
                    let localMode = _LOCAL_SERVER_MODE;
                    console.log("Calling log out");
                    log_out(false, function () {
                        firebase.auth().signInWithEmailAndPassword(_admin_email, _admin_password).then(function () {
                            _FIREBASE_LOGGED_IN = true;
                            _intent_people = true;
                            writeToDB("data/clients/" + pathkey + "/uid", _newUserUID, null, _OVERRIDE_FIREBASE);
                            if (blacklisted)
                                writeToDB("data/blacklisted_clients/" + _newUserUID, pathkey, null, _OVERRIDE_FIREBASE);
                            if (localMode) {
                                document.getElementById("button_server_select_local").click();
                                document.getElementById("button_server_local_connect").click();
                            }
                            else {
                                document.getElementById("button_server_select_firebase").click();
                                // document.getElementById("email_input").value = 
                            }
                        });
                    });
                }).catch((error) => {
                    // If sign in fails, display a message to the user.
                    deleteFromDB("data/clients/" + pathkey, null, _OVERRIDE_FIREBASE);
                    showSnackbar(error.message, 7000);
                    console.log("createUserWithEmail:failure, current mauth " + firebase.auth().currentUser.uid + "|" + error.code + "|" + error.message);
                });
        }
        else {
            showSnackbar("Invalid email", 5000);
        }
    }
}

function newClient() {
    document.getElementById("button_new_client").style.display = "none";
    document.getElementById("new_client_table").innerHTML = "<h2>New Client</h2><table id='new_client_table_ele' class='largeText'><tr><th>Email</th><th>First Name</th><th>Last Name</th><th>Company</th><th>Blacklisted</th></tr>"
        + "<td><input class='largeText'></td><td><input class='largeText'></td><td><input class='largeText'></td><td><input class='largeText'></td><td><input style='width: 30px; height: 30px;' type='checkbox'></td></table>";
    document.getElementById("button_save_clients").style.display = "";
}

function insertClientTableRow(email, first_name, last_name, company, blacklisted, uid) {
    var table = document.getElementById("clients_table_ele");
    var len = table.rows.length;
    var row = table.insertRow(len);
    var tableHTML = "<td><p>" + email + "</p></td>" +
        "<td><input class='largeText' onkeyup='clientTableChanged();' value='" + first_name
        + "'></td><td><input class='largeText' onkeyup='clientTableChanged();' value='" + last_name
        + "'></td><td><input class='largeText' onkeyup='clientTableChanged();' value='" + company
        + "'></td><td><input style='width: 30px; height: 30px;' onchange='clientTableChanged();' type='checkbox'";
    if (blacklisted)
        tableHTML += "checked";
    tableHTML += "></td><td style='display: none;'>" + uid + "</td><td><button class='largeText' style='width: 150px;' onclick='viewInfo(" + (len - 1) + ");'>Info</button></td>";
    row.innerHTML = tableHTML;
}

function clientTableChanged() {
    document.getElementById("button_save_clients").style.display = "";
}

function viewInfo(row, client) {
    if (client == null) {
        var id = _clients_table_ids[row];
        client = _downloaded_clients[id];
    }
    if (client != null) {
        var message =
            "Access PartScouter here:<br>" +
            "https://where44444.github.io/Schnelli/partscouter.html?client=1" +
            "<br><br>" +
            "E-mail: <b>" + client.email + "</b><br>" +
            "Password: <b>" + client.email + "</b><br><br>" +
            "Please change your password as soon as possible at this link!<br>" +
            "https://where44444.github.io/Schnelli/partscouter_password_change.html?email=" + client.email;
        startEmail("Your Owner Account For PartScouter Has Been Created", message);
    }
    else {
        showSnackbar("Couldn't find client!", 5000);
    }

}