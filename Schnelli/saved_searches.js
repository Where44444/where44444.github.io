var _saved_searches = []; //Array of arrays of arrays of strings for search parameters
//First index = A search
//Second index = Array of strings for a step in that search
//Third index = String for the parameter in that search
var _current_saved_search = null; //Index of current search
var _current_saved_search2 = null; //Index of current search parameters

function updateSavedSearches() {
    var html = "";
    if (_saved_searches.length > 0) {
        html += "<button onclick='deleteSavedSearchesMinus10();'>Clear All Except Most Recent 10</button><br><br>";
        html += "<table>";
    } else {
        html += "<p>There are no saved searches, search for parts and they will appear here</p>";
    }
    for (var i0 = _saved_searches.length - 1; i0 >= 0; --i0) {
        var search = _saved_searches[i0];
        var number = "";
        var num = _saved_searches.length - i0;
        if (num < 11) {
            if (num == 10)
                number = 0;
            else
                number = num;
        }
        html += "<tr><td style='font-size: 20px;'>" + number + "</td><td><button id='loadSavedSearch_" + number + "' onclick='loadSavedSearch(" + i0 + ");'>Load</button> <button onclick='deleteSavedSearch(" + i0 + ");'>Delete</button></td><td><table><tr>";
        var firstSearch = true;
        for (let search2 of search) {
            if (firstSearch)
                firstSearch = false;
            else
                html += "<td><img src='right_arrow.png' width='20'></td>";
            for (var i = -1; i < INDEXES_CONCAT.length; ++i) {
                if (search2.length > i + 1 && search2[i + 1] != "") {
                    html += "<td>";
                    if (i == -1)
                        html += "<u>Any</u>";
                    else
                        html += "<u>" + INDEXES_CONCAT[i] + "</u>";
                    html += "<br>" + search2[i + 1] + "</td>";
                }
            }
        }
        html += "</tr></table></td></tr>";
    }
    if (_saved_searches.length > 0)
        html += "</table>";
    document.getElementById("saved_searches_div").innerHTML = html;
}

function loadSavedSearch(num) {
    if (num != null)
        _current_saved_search = num;
    if (_saved_searches.length > _current_saved_search) {
        if (num == null) { //2nd+ search in saved
            ++_current_saved_search2;
            if (_saved_searches[_current_saved_search].length > _current_saved_search2)
                document.getElementById("searchInResultsButton").click();
        }
        else {
            _current_saved_search2 = 0;
            setTab(TAB_SEARCH);
        }
        if (_saved_searches[_current_saved_search].length > _current_saved_search2) {
            if (_saved_searches[_current_saved_search][_current_saved_search2].length == 1) {
                document.getElementById("radio_columns_any").click();
                document.getElementById("search_input").value = _saved_searches[_current_saved_search][_current_saved_search2][0];
                search_query(null, true);
            }
            else {
                document.getElementById("radio_columns_specific").click();
                for (var i = 0; i < INDEXES_CONCAT.length; ++i)
                    document.getElementById("search_input_" + i).value = _saved_searches[_current_saved_search][_current_saved_search2][i + 1];
                search_query(null, true);
            }
        } else {
            _current_saved_search2 = null;
        }
    }
}

function deleteSavedSearch(num) {
    _saved_searches.splice(num, 1);
    updateSavedSearches();
}

function deleteSavedSearchesMinus10() {
    while (_saved_searches.length > 10) {
        _saved_searches.splice(0, 1);
    }
    updateSavedSearches();
}