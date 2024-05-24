var _truck_data = new Object();
var _selected_parts_truck = null;

function populateTrucksDiv() {
    var html = "";
    for (let [key, truck] of Object.entries(_truck_data)) {
        html += "<input type='text' id='truck_name_" + key + "' value='" + getHTMLSafeText(truck.name) + "' onkeyup='showTruckSaveButton();'>&nbsp;&nbsp;&nbsp;<select id='truckEmployeeSelect_" + key + "' onchange='showTruckSaveButton();' style='margin-bottom: 5px;'>";
        for (let [key2, val2] of Object.entries(_downloaded_employee_ids)) {
            html += "<option value='" + key2 + "'>" + val2.last_name + ", " + val2.first_name + "</option>";
        }
        html += "</select>&nbsp;&nbsp;&nbsp;<button onclick='deleteTruck(\"" + key + "\");'>X</button><br>";
    }
    html += "<button id='truckSaveButton' onclick='saveTrucks();' style='display: none; margin-bottom: 5px;'>Save</button><br><button onclick='addNewTruck();'>Add New Truck +</button>";

    //Truck Parts
    html += "<br><br><span style='font-size: 25px;'>Parts on </span><select id='selectTruckParts' onchange='_selected_parts_truck = this.value; populateTrucksDiv();' style='width: 250px; height: 40px; font-size: 20px;'>";
    for (let [key, truck] of Object.entries(_truck_data)) {
        html += "<option value='" + key + "'>" + getHTMLSafeText(truck.name) + "</option>";
    }
    html += "</select>&nbsp;&nbsp;&nbsp;"
        + "<span style='font-size: 25px;'>Add Part </span><input style='width: 250px; height: 40px; font-size: 20px;' type='text' id='addTruckPartInput' onfocus='onTruckPartFocus();' onkeyup='onTruckPartKeyUpEvent(event);' oninput='onTruckPartKeyUpEvent(event);' onkeydown='onTruckPartKeyDownEvent(event);'>"
        + "<div id='TruckPart_autocomplete' style='position: absolute;'></div>";

    if (_truck_data[_selected_parts_truck] != null && _truck_data[_selected_parts_truck].parts != null) {
        html += "<br><table><tr><th>PN</th><th>Desc</th><th>Qty</th><th>Adjust Qty</th><th>Record View</th></tr>"
        var content_id = "";
        var parts = [];
        for (let [key, part] of Object.entries(_truck_data[_selected_parts_truck].parts)) {
            part.key = key;
            parts.push(part);
        }
        COMPARE_INDEX_I = "pn";
        parts.sort(COMPARE_INDEX);
        for (let part of parts) {
            var partRow = getContentExtraIndexFrom_DB_ID(part.key, part.index);
            var desc = "";
            if (partRow != null) {
                var content_index = getParentRecordIndexWithChildPart(part.index, partRow);
                if (content_index != null) {
                    content_id = _content[content_index][_content[content_index].length - 1];
                    desc = _content[content_index][_DESCRIP1];
                }
            }
            html += "<tr><td>" + _EXTRA_DB_COMMENTS_PREFIXES[part.index] + ": " + part.pn + "</td><td>" + desc + "</td><td>" + part.qty + "</td>"
                + "<td><button onclick='adjustTruckPartQty(\"" + part.key + "\", false, true, false);'>-</button>&nbsp;<button onclick='adjustTruckPartQty(\"" + part.key + "\", true, false, false);'>+</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='adjustTruckPartQty(\"" + part.key + "\", false, false, true);'>X</button></td><td><img onclick='addTruckPartRecordView(\"" + content_id + "\");' width='50px' height='20px' class='clickable' src='./record_view.png'></td>"
                + "</tr>";
        }
        html += "</table>";
    }

    document.getElementById("truck_employees").innerHTML = html;

    for (let [key, truck] of Object.entries(_truck_data)) {
        var select = document.getElementById("truckEmployeeSelect_" + key);
        if (select != null) {
            select.value = truck.employee_id;
        }
    }

    if (_selected_parts_truck != null)
        document.getElementById("selectTruckParts").value = _selected_parts_truck;
    else if (Object.entries(_truck_data).length > 0)
        for (let [key, truck] of Object.entries(_truck_data)) {
            _selected_parts_truck = key;
            break;
        }
}

function addNewTruck() {
    var truck = new Object();
    truck.employee_id = "";
    truck.name = "Truck " + (Object.entries(_truck_data).length + 1);
    truck.parts = new Object();
    writeToDB(getNewKeyPath("trucks"), truck);
}

function showTruckSaveButton() {
    document.getElementById("truckSaveButton").style.display = "";
}

function saveTrucks() {
    for (let [key, truck] of Object.entries(_truck_data)) {
        var input = document.getElementById("truck_name_" + key);
        if (input != null) {
            truck.name = input.value;
            truck.employee_id = document.getElementById("truckEmployeeSelect_" + key).value;
        }
    }
    writeToDB("trucks", _truck_data);
}

function deleteTruck(id) {
    deleteFromDB("trucks/" + id);
}

function addPartToTruck(row, index) {
    var id = _content_extra[index][row][1];
    if (_truck_data[_selected_parts_truck] != null) {
        if (_truck_data[_selected_parts_truck].parts[id] != null) {
            _truck_data[_selected_parts_truck].parts[id].qty += 1;
        } else {
            _truck_data[_selected_parts_truck].parts[id] = new Object();
            _truck_data[_selected_parts_truck].parts[id].pn = _content_extra[index][row][0][CE_PN];
            _truck_data[_selected_parts_truck].parts[id].index = index;
            _truck_data[_selected_parts_truck].parts[id].qty = 1;
        }
        showSnackbar(_truck_data[_selected_parts_truck].name + " now has " + _truck_data[_selected_parts_truck].parts[id].qty + " of " + _truck_data[_selected_parts_truck].parts[id].pn + " on board", 5000);
        writeToDB("trucks/" + _selected_parts_truck, _truck_data[_selected_parts_truck]);
    }
}

function addTruckPartRecordView(id) {
    if (id != "") {
        addRecordView(id);
        setTab(TAB_RECORD_VIEWS);
        selectRecordView(_recordViews.length - 1, true);
    }
}

function adjustTruckPartQty(id, up, down, delete0) {
    if (_truck_data[_selected_parts_truck] != null) {
        if (_truck_data[_selected_parts_truck].parts[id] != null) {
            if (up)
                _truck_data[_selected_parts_truck].parts[id].qty += 1;
            else if (down) {
                if (_truck_data[_selected_parts_truck].parts[id].qty > 1)
                    _truck_data[_selected_parts_truck].parts[id].qty -= 1;
                else
                    _truck_data[_selected_parts_truck].parts[id] = null;
            }
            else if (delete0)
                _truck_data[_selected_parts_truck].parts[id] = null;
        }
        writeToDB("trucks/" + _selected_parts_truck, _truck_data[_selected_parts_truck]);
    }
}