var _change_filter_date_start = -1;
var _change_filter_date_end = -1;
function populateChangeHistory() {
    var table_html = "<table style='font-size: 12px;'><tr>"
        + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Date</th>"
        + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Initials</th>"
        + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Type</th>"
        + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Change</th>"
        + "</tr>";
    var filter_initials = document.getElementById("change_history_filter_initials").value;
    var filter_type = document.getElementById("change_history_filter_type").value;
    var filter_change = document.getElementById("change_history_filter_change").value;
    var filter_any_field = document.getElementById("change_history_filter_change_any_field").value;
    var do_filter_initials = (filter_initials.replace(/ /g, "").length > 0);
    var do_filter_type = (filter_type.replace(/ /g, "").length > 0);
    var do_filter_change = (filter_change.replace(/ /g, "").length > 0);
    var do_filter_any_field = (filter_any_field.replace(/ /g, "").length > 0);
    var inc = 0;
    _content_change_history.sort(COMPARE_OBJECT_time);
    var regex_filter_initials = getRegexSafeSearchTerm(filter_initials).toLowerCase();
    var regex_filter_type = getRegexSafeSearchTerm(filter_type).toLowerCase();
    var regex_filter_change = getRegexSafeSearchTerm(filter_change).toLowerCase();
    var regex_filter_any_field = getRegexSafeSearchTerm(filter_any_field).toLowerCase();
    for (var i = _content_change_history.length - 1; i >= 0; --i) {
        var change_obj = _content_change_history[i];
        var match_failed = false;
        if (!match_failed && _change_filter_date_start != -1) {
            var time = change_obj.time;
            if (!isNaN(time) && (time < _change_filter_date_start || time >= _change_filter_date_end))
                match_failed = true;
        }
        if (!match_failed && do_filter_initials) {
            var result = String(change_obj.initials).toLowerCase().match(regex_filter_initials);
            if (result == null)
                match_failed = true;
        }
        if (!match_failed && do_filter_type) {
            var result = String(change_obj.type).toLowerCase().match(regex_filter_type);
            if (result == null)
                match_failed = true;
        }
        if (!match_failed && do_filter_change) {
            var result = String(change_obj.change).toLowerCase().match(regex_filter_change);
            if (result == null)
                match_failed = true;
        }
        if (!match_failed && do_filter_any_field) {
            var any_field_match_found = false;
            for (let [key, value] of Object.entries(change_obj)) {
                if (!any_field_match_found) {
                    var result = String(value).toLowerCase().match(regex_filter_any_field);
                    if (result != null)
                        any_field_match_found = true;
                }
            }
            if (!any_field_match_found)
                match_failed = true;
        }

        if (!match_failed) {
            table_html += "<tr id='changehistory_table_row_" + inc + "' onclick='viewchangeFromHistory(" + i + ");'>"
                + "<td>" + getMMDDYYYY_HHMMText(new Date(change_obj.time)) + "</td>"
                + "<td>" + change_obj.initials + "</td>"
                + "<td>" + change_obj.type + "</td>"
                + "<td>" + change_obj.change + "</td>"
                + "</tr>";
            ++inc;
        }
    }
    table_html += "</table>";
    document.getElementById("table_change_history_div").innerHTML = table_html;
    // var date1 = new Date("abc");
    // console.log("DATE" + date1.getTime() + "|" +  isNaN(date1.getTime()));
    if (!set_tableChangeHistory_SelectedRow(_table_changehistory_selected_row))
        set_tableChangeHistory_SelectedRow(0);
}

function clearChangeFilters() {
    var date0 = new Date(FILTER_TIME_START);
    var date1 = new Date();
    $('#change_history_filter_time').data('daterangepicker').setStartDate(date0);
    $('#change_history_filter_time').data('daterangepicker').setEndDate(date1);
    document.getElementById("change_history_filter_initials").value = "";
    document.getElementById("change_history_filter_type").value = "";
    document.getElementById("change_history_filter_change").value = "";
    document.getElementById("change_history_filter_change_any_field").value = "";
    _change_filter_date_start = date0.getTime();
    _change_filter_date_end = date1.getTime();
    populateChangeHistory();
}

var retrieveChangeDataCallback = null;
function retrieveChangeDataFromDatabase(callback) {
    if (_LOCAL_SERVER_MODE || firebase.auth().currentUser.uid == _admin_uid) {
        document.getElementById("button_update_change_history").style.display = "none";
        retrieveChangeDataCallback = callback;
        readFromDB("change_history", function (val0, key0) {
            _content_change_history = [];
            for (let [key, val] of Object.entries(val0)) {
                var change_obj = val;
                change_obj.key = key;
                _content_change_history.push(change_obj);
            }
            if (retrieveChangeDataCallback != null)
                retrieveChangeDataCallback();
            document.getElementById("button_update_change_history").style.display = "";
        });
    }
}

function viewchangeFromHistory(row) {

}