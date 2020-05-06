var INDEX_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,   76, 77, 78, 79,   39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];
var INDEXES = ["RECORD_NUMBER","DESCRIP1","DESCRIP2","COMMENTS","EQUIP_TYPE","EQUIP_DSGN","APPL_BRAND","APPL_MFR","PART_TYPE","B_PN",   "CHLX_PN","F_PN",   "GEM_PN", "RS_PN",  "MM_PN",  "JS_PN",  "K_PN",   "L_PN",   "M_PN",   "N_PN",   "OEM_PN", "PART_NUMBR", "Q_PN",   "SOURCE", "UNIT",   "KEEP",   "REORD_QTY","GET",    "PICKED", "TAG",    "FROM",   "CGS",    "DATE",   "FRT_IN", "QUESTIONS","MODIFIED","NEW",    "NEWER",  "LOCATION","SPECMETHOD","SPEC01NAME","SPEC01HINT","SPEC01DATA","SPEC02NAME","SPEC02HINT","SPEC02DATA","SPEC03NAME","SPEC03HINT","SPEC03DATA","SPEC04NAME","SPEC04HINT","SPEC04DATA","SPEC05NAME","SPEC05HINT","SPEC05DATA","SPEC06NAME","SPEC06HINT","SPEC06DATA","SPEC07NAME","SPEC07HINT","SPEC07DATA","SPEC08NAME","SPEC08HINT","SPEC08DATA","SPEC09NAME","SPEC09HINT","SPEC09DATA","SPEC10NAME","SPEC10HINT","SPEC10DATA","SPEC11NAME","SPEC11HINT","SPEC11DATA","SPEC12NAME","SPEC12HINT","SPEC12DATA"];
var INDEX_WIDTHS = ["initial",  "200px",   "200px",   "400px",   "initial",   "initial",   "initial",   "initial", "initial",  "initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial",    "initial","initial","initial","initial","initial",  "initial","initial","initial","initial","initial","initial","initial","initial",  "initial", "initial","initial","initial", "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial"   ];
var MEMO_INDEXES = ["LOOK_UP_PN", "ADVICE", "ATTN", "MODEL"]; //76, 77, 78, 79 LOCATION = 38
var MEMO_INDEX_WIDTHS = ["400px",  "400px",  "400px","400px"];
var WORDS_TO_IGNORE = ["the","at","there","some","my","of","be","use","her","than","and","this","an","would","a","have","each","make","to","from","which","like","been","in","or","she","him","call","is","one","do","into","who","you","had","how","time","that","by","their","has","its","it","word","if","look","now","he","but","will","two","find","was","not","up","more","for","what","down","on","all","about","go","day","are","were","out","see","did","as","we","get","with","when","then","no","come","his","your","them","way","made","they","can","these","could","may","i","said","so"];
var _DESCRIP1 =    1;
var _DESCRIP2 =    2;
var _COMMENTS =    3;
var _EQUIP_TYPE =  4;
var _APPL_BRAND =  6;
var _PART_NUMBR = 21;
var _SOURCE =     23;
var _KEEP =       25;
var _REORD_QTY =  26;
var _GET =        27;
var _FROM =       30;
var _MODIFIED =   35;
var _LOCATION =   38;
var _LOOK_UP_PN = 76;
var _ADVICE =     77;
var _ATTN =       78;
var _MODEL =      79;

var LOCAL_MODE = false;

var _content;
var _content_standard;

var _content_extra = null;
// var _indexToContentID;
var _contentSortedIndex = [0];
var _contentSortedReverse = false;
var _sortedIndexBGColor = "#70A2FF"; //Light blue
var _sortedIndexBGColorReverse = "#FF7070"; //Salmon
var _selectedRowColor = "#96BBFF"; //Light blue
var _selectedCellColor = "#70A2FF"; //Slightly Less Light blue
var _tempTopRowColor = "#A0FF77"; //Light green

var _sort_orders;

var _recordViews = [];
var _recordViewHightlightType = 0;

var _isTableSelected = false;
var _selectedTable = TABLE_RECORD_BROWSER;
var _selectedRow = 0;
var _selectedCell = 0;
var _selectedCellLastID = null;

var _searchResults = []; //[index, [cells with match], [actual string matches]]

//Only indexes of records being shown in the tables
var _currentSearchResultsStartIndex = 0;
var _currentRecordBrowserStartIndex = 0;
var _indexesSearchResults = [];
var _indexesSimilarStrings = [];
var _indexesRecordBrowser = [];

var _searchResultsMax = 6;
var _recordBrowserMax = 10;

var _largestRecordNumber = 0;

var _minRepititions = 3;

var TABLE_SEARCH_RESULTS = 0;
var TABLE_SIMILAR_STRINGS = 1;
var TABLE_RECORD_BROWSER = 2;

var _searchstring_any_history = [];
var _searchstring_specific_history = [];
var _searchstring_any_history_index = 0;
var _searchstring_specific_history_index = [];
var _selected_search_input = 0;

// var str1 = "USED WITH SPARK IGNITION; NAT/LP SELECT; KIT INCL SMALL PARTS; CNSDR C:5395S0005 KIT";
// var str2 = "USED WITH SPARK IGNITION; NAT/LP SELECT; KIT INCL SMALL PARTS; CNSDR C:5396S0012 KIT";
// var str1 = "USES TIMER MOTOR 414-064-20; INCL REQ SHORTER MOUNTING SCREWS 2X 3428970";
// var str2 = "USES TIMER MOTOR 414-386-20; INCL REQ SHORTER MOUNTING SCREWS 2X 3428970; USED ON 3 SPEED MODELS ";
// var str1 = "WITH SPECIFIC LEVER; USED AS S.C. DOOR LATCH SWITCH FOR SOLENOID; CNSDR SWAPPING LEVER TO ALTERNATE SPLIT SWITCH ";
// var str2 = "WITH SPECIFICALLY BENT LEVER; USED AS CARTRIDGE CONFIRMATION SWITCH FOR DOWNDRAFT FAN; CNSDR SWAPPING LEVER TO ALTERNATE SPLIT SWITCH ";
// getWordCompareIndexes(str1, str2, 1);

var checkboxHTML = "";
var checkboxHTML_More = "";
var INDEXES_CONCAT = INDEXES.concat(MEMO_INDEXES);
var INDEX_WIDTHS_CONCAT = INDEX_WIDTHS.concat(MEMO_INDEX_WIDTHS);

for(var i = 0; i < INDEXES_CONCAT.length; ++i){
  _searchstring_specific_history.push(new Array());
  _searchstring_specific_history_index.push(0);
}

for(var i = 0; i < INDEXES_CONCAT.length; ++i){
  var order_id = INDEX_ORDER[i];
  if(i <= 9){
    checkboxHTML += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 50) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' id=\"column_checkbox_" + order_id + "\"><span class='checkmark'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if((i + 1)% 5 == 0 && i != 0){
      checkboxHTML += "<br><br>";
      for(var j = 0; j < 5; ++j){
        var i2 = (i - 4) + j;
        var order_id2 = INDEX_ORDER[i2];
        checkboxHTML += "<div style='position:absolute; left:" + ((i2 % 5) * 250 + 50) + "px;'><input id='search_input_" + order_id2 + "' type='text' style='width: 230px;' onfocus='deselectTable(" + order_id2 + ");' onfocusout='onSearchInputFocusOut();' onchange='onSearchInputChanged(" + order_id2 + ")'><div id='search_autocomplete_" + order_id2 + "'></div></div>";
      }
      if(i == 4)
        checkboxHTML += "<button id='search_specific_button' style='display: inline; width: 100px; position:absolute; left:" + ((i + 1) * 250 + 50) + "px;' onclick='search_query();'>Go</button>";
      checkboxHTML += "<br><br><br>";
    }
    if(i == 9){
      checkboxHTML += "<button onclick='show_more_column_checkboxes(true);' id=\"show_more_column_checkboxes\" style='position:absolute; left: 50px; width: 200px;'>More</button>";
    }
  }
  else{
    checkboxHTML_More += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 50) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' id=\"column_checkbox_" + order_id + "\"><span class='checkmark'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if((i + 1)% 5 == 0 && i != 0){
      checkboxHTML_More += "<br><br>";
      for(var j = 0; j < 5; ++j){
        var i2 = (i - 4) + j;
        var order_id2 = INDEX_ORDER[i2];
        checkboxHTML_More += "<div style='position:absolute; left:" + ((i2 % 5) * 250 + 50) + "px;'><input id='search_input_" + order_id2 + "' type='text' style='width: 230px;' onfocus='deselectTable(" + order_id2 + ");' onfocusout='onSearchInputFocusOut();' onchange='onSearchInputChanged(" + order_id2 + ")'><div id='search_autocomplete_" + order_id2 + "'></div></div>";
      }
      checkboxHTML_More += "<br><br><br>";
    }
    if(i == INDEXES_CONCAT.length - 1) {
      checkboxHTML_More += "<br><br><br><button onclick='show_more_column_checkboxes(false);' style='position:absolute; left: 50px; width: 200px;'>Less</button>";
    }
  }
}
document.getElementById("radio_columns_checkboxes").innerHTML = checkboxHTML;
document.getElementById("radio_columns_checkboxes_more").innerHTML = checkboxHTML_More;
setRadioColumn();
document.getElementById("repititions_min").value = _minRepititions;

var firebaseConfig = {
  apiKey: "AIzaSyBiHDF9LJepi4QyOhHeayZT_etKN5AjlGs",
  authDomain: "appliance-parts-f45cd.firebaseapp.com",
  databaseURL: "https://appliance-parts-f45cd.firebaseio.com",
  projectId: "appliance-parts-f45cd",
  storageBucket: "appliance-parts-f45cd.appspot.com",
  messagingSenderId: "671454569102",
  appId: "1:671454569102:web:479b1d3a11bedf601c1fdf"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    loadContentDiv();
  }
  else {
    document.getElementById("login_div").style.display = "block";
  }
});

function log_out(){
  firebase.auth().signOut().then(function() {
    document.getElementById("login_div").style.display = "block";
    document.getElementById("content_div").style.display = "none";
    document.getElementById("sort_order_div").style.display = "none";
    document.getElementById("search_div").style.display = "none";
  }).catch(function(error) {
    window.alert(errorMessage);
  });
}

function log_in(){
  document.getElementById("login_div").style.display = "none";

  var persistenceVar;
  if(document.getElementById("remember_input").checked)
    persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
  else
    persistenceVar = firebase.auth.Auth.Persistence.NONE;

    firebase.auth().setPersistence(persistenceVar).then(function() {
        return firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input").value, document.getElementById("password_input").value).then(function() {
          loadContentDiv();
          }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("login error " + errorMessage);
          window.alert(errorMessage);
          // ...
          document.getElementById("login_div").style.display = "block";
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("persistence error " + errorMessage);
        window.alert(errorMessage);
  });
}

function fetchJSONRecursive(index)
{
  if(index < EXTRA_DB.length){
    fetchJSONFile("csv/" + EXTRA_DB[index] + ".json", function(data){
      processJSONDataExtra(data, index);
      fetchJSONRecursive(index + 1);
    });
  }
  else{
    fetchJSONFile('final.json', function(data){
      processJSONData(data);
    });
  }
}

var _extraDBLoadedIndex = -1;
function loadContentDiv(){
  document.getElementById("email_input").value = "";
  document.getElementById("password_input").value = "";
  document.getElementById("content_div").style.display = "block";
  document.getElementById("message").innerHTML = "<p>Downloading parts from database... This may take up to 60 seconds</p>";
  document.getElementById("record_browser_div").style.display = "none";

  // var partRef = firebase.database().ref('parts_db/D_DNI');
  // partRef.remove();

//   $.ajax({
//     type: "GET",
//     url: "ascii_test.txt",
//     dataType: "text",
//     success: function(data) {processCSVData(data);}
//  });

if(LOCAL_MODE) {
  // document.getElementById("fileinput_div").innerHTML = "<input id='fileinput_json' type='file' style='width: 500px; height: 200px;'></input><br>";
  // document.getElementById('fileinput_json').addEventListener('change', readSingleFile_json, false);
  fetchJSONRecursive(0);
}
else {
  for(var i = 0; i < EXTRA_DB.length; ++i)
  {
    var extraDBRef = firebase.database().ref('parts_db/' + EXTRA_DB[i]);
    extraDBRef.once('value', function(snapshot) {
      var objs = [];
      var keys = [];
      snapshot.forEach(function(childSnapshot) {
        objs.push(childSnapshot.val());
        keys.push(childSnapshot.key);
      });
      processJSONDataExtra(objs, EXTRA_DB.indexOf(snapshot.key), keys);
      ++_extraDBLoadedIndex;
      if(_extraDBLoadedIndex == EXTRA_DB.length - 1) //Load big P&A_PRI after extra Databases loaded
      {
        var partsRef = firebase.database().ref('parts_db/P&A_PRI').orderByChild('RECORD_NUMBER');
        partsRef.once('value', function(snapshot) {
          document.getElementById("message").innerHTML = "<p>Processing parts...</p>";
      
          // var numChildren = snapshot.numChildren();
          _content = [];
          
          var numRecords = 0;
          snapshot.forEach(function(childSnapshot) {
            var content_line = [];
            //indexToContentID[numRecords] = childSnapshot.key;
            for(var i = 0; i < INDEXES.length; ++i)
              content_line.push(String(childSnapshot.child(INDEXES[i]).val()));
            for(var i = 0; i < MEMO_INDEXES.length; ++i){
              var memolines = childSnapshot.child(MEMO_INDEXES[i]).val();
              for(var j = 0; j < memolines.length; ++j)
                memolines[j] = String(memolines[j]);
              content_line.push(memolines);
            }
            content_line.push(childSnapshot.key);
            // document.getElementById("loading_parts").innerHTML = "<p>Processing parts...  " + (numRecords / numChildren) + "%</p>";
            _content.push(content_line);
            ++numRecords;
          });
          generateContent_Standard();
          populateRecordBrowser(0, false);
          _contentSortedReverse = true;
          sortContentByIndex(0);
          loadChangeAlerts();
        });
      }
    });
  }
}

  var sortOrdersRef = firebase.database().ref('sort_orders');
  sortOrdersRef.on('value', function(snapshot) {
    var sortOrders = [];
    snapshot.forEach(function(childSnapshot) {
      var sortObj = childSnapshot.val();
      sortObj.key = childSnapshot.key;
      sortOrders.push(sortObj);
    });
    _sort_orders = sortOrders;
    populateSortOrders();
  });
}

function search_query()
{
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("similar_string_expander").style.display = "none";
  var searchstring_any = standardizeString(document.getElementById("search_input").value);
  document.getElementById("message").innerHTML = "<p><br><br><br>Searching...</p>";
  var anyChecked = document.getElementById("radio_columns_any").checked;
  if(searchstring_any == "" && anyChecked){
    document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found. Try using numbers or characters in your search</p>";
  }
  else{
    if(anyChecked && !_searchstring_any_history.includes(document.getElementById("search_input").value)){
      _searchstring_any_history.push(document.getElementById("search_input").value);
      _searchstring_any_history_index = _searchstring_any_history.length - 1;
    }
    var searchWorker = new Worker('get_search_results.js');
    // var results = getSearchResults(searchstring, content_simple);

    var total_indexes_length = INDEXES.length + MEMO_INDEXES.length;
    var columnsToSearch = [];
    var searchstrings_specific = [];
    for(var i = 0; i < total_indexes_length; ++i){
      var standard = standardizeString(document.getElementById("search_input_" + i).value);
      if(!anyChecked && standard != "" && !_searchstring_specific_history[i].includes(document.getElementById("search_input_" + i).value))
      {
        _searchstring_specific_history[i].push(document.getElementById("search_input_" + i).value);
        _searchstring_specific_history_index[i] = _searchstring_specific_history[i].length - 1;
      }
      searchstrings_specific.push(standard);
      if(standard == ""){
        document.getElementById("column_checkbox_" + i).checked = false;
        columnsToSearch.push(false);
      }
      else
        columnsToSearch.push(anyChecked || document.getElementById("column_checkbox_" + i).checked);
    }
    
    var exactMatch = document.getElementById("search_exact_match").checked;
    if(exactMatch){
      searchstring_any = document.getElementById("search_input").value.toLowerCase();
      searchstrings_specific = [];
      for(var i = 0; i < total_indexes_length; ++i){
        var standard = document.getElementById("search_input_" + i).value.toLowerCase();
        searchstrings_specific.push(standard);
      }
    }
    searchWorker.postMessage([searchstring_any, _content_standard, _content, columnsToSearch, exactMatch, anyChecked, searchstrings_specific, INDEXES]);
    searchWorker.onmessage = function(e) {
      var results = e.data;
      if(results[0] == 0){
        document.getElementById("message").innerHTML = "<br><br><br><p>Searched " + results[1] + " of " + _content.length + " records</p>";
      }
      else{
        if(results.length <= 1)
          document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found</p>";
        else{
          results.splice(0,1);
          _searchResults = results;
          populateSearchResults(0, false, false, -1);
        }
      }
    }
  }
}

function populateRecordBrowser(indexStart, highlight_IndexStart_Green)
{
  document.getElementById("wlmay_input_div").style.display = "block";

  document.getElementById("record_browser_table_div").innerHTML = "";
  var origIndexStart = indexStart;
  if(_content.length - indexStart < _recordBrowserMax)
    indexStart = _content.length - _recordBrowserMax;
  if(indexStart < 0)
    indexStart = 0;
  if(indexStart > _content.length - 1)
    indexStart = _content.length - 1;
  var indexEnd = indexStart + (_recordBrowserMax - 1);
  if(_content.length - 1 < indexEnd)
    indexEnd = _content.length - 1;
  _currentRecordBrowserStartIndex = indexStart;

  if(_content.length > 0){
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("message").innerHTML = "";
    document.getElementById("record_browser_div").style.display = "block";
    var tableHTML = "<p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _content.length + " Record(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
    "<p style='display: inline;'>Table Size</p>&nbsp;&nbsp;" + 
    "<input id=\"record_browser_max\" type=\"number\" value=" + _recordBrowserMax + " min=\"0\" onfocus='showRecordBrowserMax();' onchange='showRecordBrowserMax();'></input>" + 
    "<button id=\"save_record_browser_max\" onclick=\"updateRecordBrowserMax();\" style=\"display: none;\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='startNewRecord();'>Add New Part +</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='recordBrowserJumpToEdge(0);'>Jump to Top</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='recordBrowserJumpToEdge(1);'>Jump to Bottom</button>" + 
    "<div id='add_part_table_div'></div>" +
    "<table class='clickable' id='record_browser_table'><tr>";

    for(var i = 0; i < INDEXES_CONCAT.length; ++i){
      var index = INDEX_ORDER[i];
      var bgcolor = "inherit";
      if(_contentSortedIndex.includes(index))
          bgcolor = getSortColor(index);
      tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + ";'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
    }

    // for(var i = 0; i < MEMO_INDEXES.length; ++i){
    //   var i2 = i + INDEXES.length;
    //   var bgcolor = "inherit";
    //   if((i2) == _contentSortedIndex)
    //     if(_contentSortedReverse)
    //       bgcolor = _sortedIndexBGColorReverse;
    //     else
    //       bgcolor = _sortedIndexBGColor;
    //   tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + i2 + ");' style='background-color: " + bgcolor + ";'><div style='width: " + MEMO_INDEX_WIDTHS[i] + ";'>" + MEMO_INDEXES[i] + "</div></th>";
    // }

    _indexesRecordBrowser = [];
    var numRows = 0;
    for (var i = indexStart; i <= indexEnd; ++i) {
      tableHTML += "<tr id='record_browser_row_" + i + "'>"
      _indexesRecordBrowser.push(i);
      for(var j = 0; j < INDEXES_CONCAT.length; ++j)
      {
        var index = INDEX_ORDER[j];
        var id2 = "record_browser_cell_" + i + "_" + j;
        if(index == 0)
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i + "_" + j + "\");' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><img id='edit_icon_" + numRows + "' src='pencil.png' width=25px height=25px onclick='startEditRecord(\"" + _content[i][_content[i].length - 1] + "\", " + i + ", \"record_browser_row_" + i + "\");'>&nbsp;&nbsp;&nbsp;&nbsp;<img id='copy_icon_" + numRows + "' src='copy.png' width=30px height=30px onclick='startNewRecord(" + i + ");'>&nbsp;&nbsp;&nbsp;&nbsp;<div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + "<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + getHTMLSafeText(_content[i][index]) + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i + "_" + j + "' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        else if(index < INDEXES.length)
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i + "_" + j + "\");' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + "<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + getHTMLSafeText(_content[i][index]) + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i + "_" + j + "' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        else{ //Memo field)
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i + "_" + j + "\");' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + "<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + getExpandableHTML(_content[i][index], (i + "_" + j), 100, INDEX_WIDTHS_CONCAT[index]) + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i + "_" + j + "' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        }
      }
      // for(var j = 0; j < MEMO_INDEXES.length; ++j)
      // {
      //   var j2 = j + INDEXES.length;
      //   var id2 = "record_browser_cell_" + i + "_" + j2;
      //   tableHTML += "<td id='" + id2 + "' onclick='onCellClick(" + i + "," + j2 + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + MEMO_INDEXES[j] + "<br><br>" + _content[i][1] + "</span>" + getExpandableHTML(_content[i][j2], (i + "_" + j2), 100, MEMO_INDEX_WIDTHS[j]) + "</div></td>";
      // }
      tableHTML += "</tr>"
      ++numRows;
    }

    tableHTML += "</tr></table>";
    document.getElementById("record_browser_table_div").innerHTML = tableHTML;
  }
  if(highlight_IndexStart_Green && document.getElementById("record_browser_row_" + origIndexStart) != null){
    document.getElementById("record_browser_row_" + origIndexStart).style.backgroundColor = _tempTopRowColor;
  }
}

function populateSearchResults(indexStart, selectTopRow, selectBottomRow, rowToSelect)
{
  document.getElementById("similar_strings_div").innerHTML = "";
  if(_searchResults.length - indexStart < _searchResultsMax)
    indexStart = _searchResults.length - _searchResultsMax;
  if(indexStart < 0)
    indexStart = 0;
  if(indexStart > _searchResults.length - 1)
    indexStart = _searchResults.length - 1;
  var indexEnd = indexStart + (_searchResultsMax - 1);
  if(_searchResults.length - 1 < indexEnd)
    indexEnd = _searchResults.length - 1;

    _currentSearchResultsStartIndex = indexStart;

  var shouldHighlight = document.getElementById("search_highlight_similar_words").checked;

  _indexesSearchResults = [];
  var array_trimmed = [];
  var numRows = 0;
  for (var i = indexStart; i <= indexEnd; ++i) {
    array_trimmed.push(new Array());
    var currentIndex = _searchResults[i][0];
    _indexesSearchResults.push(currentIndex);
    for(var j = 0; j < INDEXES_CONCAT.length; ++j){
      if(j < INDEXES.length)
        array_trimmed[numRows].push(_content[currentIndex][j]);
      else
        array_trimmed[numRows].push(copyArray1D(_content[currentIndex][j]));
    }
    array_trimmed[numRows].push(_content[currentIndex][_content[currentIndex].length - 1]);
    ++numRows;
  }

  if(shouldHighlight){
    var actualSearchStrings = [];
    for (var i = indexStart; i <= indexEnd; ++i) {
      // var len = table.rows.length;
      // var row = table.insertRow(len);
      var matchingcells = _searchResults[i][1];
      for(var j = 0; j < INDEXES_CONCAT.length; ++j){
          // var cell1 = row.insertCell(j);
          // cell1.innerHTML = array_trimmed[i][j];
          if(matchingcells.includes(j)){
            for(var k = 0; k < matchingcells.length; ++k){
              if(matchingcells[k] == j){
                var stringToHighlight = _searchResults[i][2][k];
                if(!actualSearchStrings.includes(stringToHighlight))
                  actualSearchStrings.push(stringToHighlight);
                // var re = new RegExp(stringToHighlight,"g");
                // cell1.innerHTML = cell1.innerHTML.replace(re, "<span style='background: yellow;'>" + stringToHighlight + "</span>");
              }
            }
          }
      }
    }

    //Get string repetition info---------------------------------------------
    var singleWordsToOccurences = new Map(); //Standardized (word) to      [[num occurences, color],             [actual word spellings], [row nums]]
    var doubleWordsToOccurences = new Map(); //Standardized (word word) to [[num occurences, color, word, word], [actual word spellings], [row nums]]
    for(var i = 0; i < array_trimmed.length; ++i)
    {
      var row = array_trimmed[i];
      for(var j = 0; j < INDEXES_CONCAT.length; ++j)
      {
        var index = INDEX_ORDER[j];
        var string;
        if(index < INDEXES.length)
          string = row[index];
        else
          string = stringifyArrayEndChar(row[index], " ");
        var lastCharWasSpace = true;
        var start0 = 0;
        var end = 0;
        var start1 = 0;
        for(var k = 0; k < string.length; ++k)
        {
          var char = string[k];
          var charIsSpace = (char == " ");
          var endOfString = (k + 1 == string.length);
          if(lastCharWasSpace && !charIsSpace){ //Beginning of word
            start0 = start1;
            start1 = k;
          }
          else if((!lastCharWasSpace && charIsSpace) || endOfString){ //Space at end of word or end of string
            if(endOfString)
              end = k + 1;
            else
              end = k;
            var singleWord = string.substring(start1, end);
            var singleWordStandard = standardizeString(singleWord);
            if(!WORDS_TO_IGNORE.includes(singleWordStandard) && singleWordStandard.length > 1){
              if(singleWordsToOccurences.has(singleWordStandard)){
                var value = singleWordsToOccurences.get(singleWordStandard)
                value[0][0] = value[0][0] + 1;
                if(!value[2].includes(i))
                  value[2].push(i);
                if(!value[1].includes(singleWord)){
                  value[1].push(singleWord);
                }
              }
              else{
                // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                var color = getColorFromString(singleWordStandard);
                var value = [[1, color], [singleWord], [i]];
                singleWordsToOccurences.set(singleWordStandard, value);
              }
            }
            if(start0 != start1){
              var doubleWord = string.substring(start0, end);
              var doubleWordStandard = standardizeString(doubleWord);
              var doubleWordSplit = doubleWordStandard.split(" ");
              if(!WORDS_TO_IGNORE.includes(doubleWordSplit[0]) && !WORDS_TO_IGNORE.includes(doubleWordSplit[1]) && doubleWordStandard.length > 3){
                if(doubleWordsToOccurences.has(doubleWordStandard)){
                  var value = doubleWordsToOccurences.get(doubleWordStandard)
                  value[0][0] = value[0][0] + 1;
                  if(!value[2].includes(i))
                    value[2].push(i);
                  if(!value[1].includes(doubleWord)){
                    value[1].push(doubleWord);
                  }
                }
                else{
                  // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                  var color = getColorFromString(doubleWordStandard);
                  var value = [   [1, color, doubleWordSplit[0], doubleWordSplit[1]],  [doubleWord], [i]];
                  doubleWordsToOccurences.set(doubleWordStandard, value);
                }
              }
            }
          }
          lastCharWasSpace = charIsSpace;
        }
      }
    }

    //Populate similar strings list--------------------------------------------------------------
    var onlyHighlightMatches = document.getElementById("search_highlight_only_matches").checked;
    var wordsToSort = []; //[[Standardized word, color], [Actual Words], [row nums]]
    for (let [key, value] of doubleWordsToOccurences) {
      if(value[0][0] >= _minRepititions && !onlyHighlightMatches){
        var finalValue = [[key, value[0][1]], value[1], value[2]];
        wordsToSort.push(finalValue);
      }
    }
    
    for (let [key, value] of singleWordsToOccurences) {
      if(value[0][0] >= _minRepititions && !onlyHighlightMatches){
        var finalValue = [[key, value[0][1]], value[1], value[2]];
        wordsToSort.push(finalValue);
      }
    }
    
    wordsToSort.sort(COMPARE_0_0);
    var similarHTML = "";
    var totalRows = 0;
    _indexesSimilarStrings = [];

    for(var i = 0; i < wordsToSort.length; ++i)
    {
      var wordData = wordsToSort[i];
      var resultsLabel = "results";
      if(wordData[2].length == 1)
        resultsLabel = "result";
      similarHTML += "<div class='clickable' onclick='toggle_similar_string_table(" + i + ");'><p><span id='similar_string_expander_" + i + "'>+</span> " + wordData[1][0] + " (" + wordData[2].length + " " + resultsLabel + ")</p></div>";
      
      similarHTML += "<table class='clickable' style='margin-left: 20px; display: none;' id='similar_string_table_" + i + "'><tr>";
      for(var j = 0; j < INDEXES_CONCAT.length; ++j){
        var index = INDEX_ORDER[j];
        var bgcolor = "inherit";
        if(_contentSortedIndex.includes(index))
            bgcolor = getSortColor(index);
        similarHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + ";'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
      }
      similarHTML += "</tr>";
      for(var j = 0; j < wordData[2].length; ++j){
        similarHTML += "<tr id='similar_string_row_" + totalRows + "'>";
        var rownum = wordData[2][j];
        _indexesSimilarStrings.push(_indexesSearchResults[rownum]);
        for(var k = 0; k < INDEXES_CONCAT.length; ++k){
          var index = INDEX_ORDER[k];
          var termToHighlightList = [];
          var preHTML_List = [];
          var postHTML_List = [];

          var string;
          if(index < INDEXES.length)
            string = array_trimmed[rownum][index];
          else
            string = stringifyArrayEndChar(array_trimmed[rownum][index], " ");
          
          var color = wordData[0][1];
          var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
          for(var v = 0; v < wordData[1].length; ++v){
            // if(getRegexSafeSearchTerm(wordData[1][v]).length <= 1)
            //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(wordData[1][v]) + "|");
            termToHighlightList.push(wordData[1][v]);
            preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
            postHTML_List.push("</span>");
          }
          string = highlightString(string, termToHighlightList, preHTML_List, postHTML_List);
          var id2 = "similar_string_cell_" + totalRows + "_" + k;
          similarHTML += "<td id='" + id2 + "' onclick='onCellClick(" + totalRows + "," + k + ",\"" + id2 + "\"," + TABLE_SIMILAR_STRINGS + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + "<br><br>" + array_trimmed[rownum][1] + "</span>" + string + "</div></td>";
        }

        similarHTML += "</tr>";
        ++totalRows;
      }
      similarHTML += "</table>";
    }
    document.getElementById("similar_string_expander").style.display = "block";
    document.getElementById("similar_strings_div").innerHTML = similarHTML;

    //Highlight array strings with regex---------------------------------------------

    //Go through array of matched search term phrases
    //  Make bold and yellow background
    //
    //Go through singleword map
    //  If more than 2 values in the value array
    //    check if the standard word is in the first slot of any entries in the double word map, set typeHighlightSingle map to false
    //    else set to true
    //
    //Go through double word map
    //  If more than 2 values in the value array
    //    highlight with background
    //
    //Go through single word map
    //  If more than 2 values in the value array
    //    highlight with type from typeHighlightSingle map
    //
    var typeHighlightBGSingle = new Map();
      for (let [key1, value1] of singleWordsToOccurences) {
        if(value1[0][0] >= _minRepititions && !onlyHighlightMatches)
          for (let [key2, value2] of doubleWordsToOccurences) {
            if(value2[0][0] >= _minRepititions && !onlyHighlightMatches)
              typeHighlightBGSingle.set(key1, (key1 != value2[0][2] && key1 != value2[0][3])); //Single word is not in a double word pair
          }
      }

    for(var i = 0; i < array_trimmed.length; ++i){
      for(var j = 1; j < array_trimmed[i].length; ++j){
        var index = INDEX_ORDER[j - 1];
        var termToHighlightList = [];
        var preHTML_List = [];
        var postHTML_List = [];
        //Highlight search terms
        for(var s = 0; s < actualSearchStrings.length; ++s){
          // if(getRegexSafeSearchTerm(actualSearchStrings[s]).length <= 1)
          //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(actualSearchStrings[s]) + "|");
          termToHighlightList.push(actualSearchStrings[s]);
          preHTML_List.push("<span style='background: yellow; color: black;'><b>");
          postHTML_List.push("</b></span>");
        }

        //Highlight double words
          for (let [key, value] of doubleWordsToOccurences) {
            if(value[0][0] >= _minRepititions && !onlyHighlightMatches){
              var color = value[0][1];
              var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
              for(var v = 0; v < value[1].length; ++v){
                // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                termToHighlightList.push(value[1][v]);
                preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                postHTML_List.push("</span>");
              }
            }
          }

          //Highlight single words
          for (let [key, value] of singleWordsToOccurences) {
            if(value[0][0] >= _minRepititions && !onlyHighlightMatches){
              var color = value[0][1];
              var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
              for(var v = 0; v < value[1].length; ++v){
                // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                termToHighlightList.push(value[1][v]);
                if(typeHighlightBGSingle.get(key)){
                  preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                  postHTML_List.push("</span>");
                }
                else{
                  preHTML_List.push("<span style='border-bottom: 3px solid " + bgColor + "'>");
                  postHTML_List.push("</span>");
                }
              }
            }
          }

          if(index < INDEXES.length)
            array_trimmed[i][index] = highlightString(array_trimmed[i][index], termToHighlightList, preHTML_List, postHTML_List);
          else
            array_trimmed[i][index] = highlightString(stringifyArrayEndChar(array_trimmed[i][index], " "), termToHighlightList, preHTML_List, postHTML_List);

      }
    }
  }

  //Generate search results table-----------------------------------------------------------------
  var tableHTML = "<p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _searchResults.length + " Result(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
  "<p style='display: inline;'>Table Size</p>&nbsp;&nbsp;" + 
  "<input id=\"search_results_max\" type=\"number\" value=" + _searchResultsMax + " min=\"0\" onchange='showSearchResultsMax();' onfocus='showSearchResultsMax();'></input>" + 
  "<button id=\"save_search_results_max\" onclick=\"updateSearchResultsMax();\" style=\"display: none;\">Save</button>" +
  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='searchResultsJumpToEdge(0);'>Jump to Top</button>" + 
  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='searchResultsJumpToEdge(1);'>Jump to Bottom</button>" + 
  "<table class='clickable'><tr>";
  for(var i = 0; i < INDEXES_CONCAT.length; ++i){
    var index = INDEX_ORDER[i];
    var bgcolor = "inherit";
    if(_contentSortedIndex.includes(i))
        bgcolor = getSortColor(i);
    tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + ";'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
  }
  tableHTML += "</tr>";
  for(var i = 0; i < array_trimmed.length; ++i){
    tableHTML += "<tr id='search_results_row_" + i + "'>";
    for(var j = 0; j < INDEXES_CONCAT.length; ++j){
      var index = INDEX_ORDER[j];
      var id2 = "search_results_cell_" + i + "_" + j;
      tableHTML += "<td onmouseover='recordViewIconMouseOver(\"search_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"search_" + i + "_" + j + "\");' id='" + id2 + "' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_SEARCH_RESULTS + ");'>" + 
      "<div class='tooltip'><span class='tooltiptext' style='border: 3px solid black; background-color: white; color: black;'>" 
      + INDEXES_CONCAT[index] + "<br><br>" + array_trimmed[i][1] + "</span>" + array_trimmed[i][index] + 
      "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_search_" + i + "_" + j + "' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + array_trimmed[i][array_trimmed[i].length - 1] + "\");'></div></td>";
    }
      // tableHTML += "<td><div style='width: " + headerWidths[j] + ";'>" + array[i][j] + "</div></td>";
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  document.getElementById("search_results_table_div").innerHTML = tableHTML;

  //Set state of divs-------------------------------------------------------
  document.getElementById("search_results_expander").style.display = "block";
  toggle_search_results(1);
  document.getElementById("message").innerHTML = "";

  if(selectTopRow){
    var cell = getCell(0, _selectedCell, TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(0, _selectedCell, cell.id, TABLE_SEARCH_RESULTS);
  }
  else if(selectBottomRow){
    var cell = getCell(array_trimmed.length - 1, _selectedCell, TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(array_trimmed.length - 1, _selectedCell, cell.id, TABLE_SEARCH_RESULTS);
  }
  else if(rowToSelect >= 0){
    var cell = getCell(rowToSelect, _selectedCell, TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(rowToSelect, _selectedCell, cell.id, TABLE_SEARCH_RESULTS);
  }
} //END populateSearchResults

function populateSortOrders()
{
  document.getElementById("sort_order_table_div").innerHTML = "";
  var newHTML = "<table>";
  for(var i = 0; i < _sort_orders.length; ++i)
  {
    var id1 = i + 1;
    newHTML += "<tr id='sort_order_row_" + id1 + "'><td>" + 
    "<div style='display: none; align-items: center; justify-content: center;' id='sort_order_buttons_" + id1 + "'>" +
    "<div style='flex-direction: column; width: 100px;'>" + 
    "<button id='sort_order_button_save" + id1 + "' style='width: 70px; font-size: 20px;' onclick='saveEditSortOrder(" + id1 + ");'>Save</button>" + 
    "<button id='sort_order_button_cancel" + id1 + "' style='width: 70px; font-size: 20px; margin-top: 5px;' onclick='populateSortOrders();'>Cancel</button>" + 
    "<button id='sort_order_button_delete" + id1 + "' style='width: 70px; font-size: 20px; margin-top: 5px; color: red' onclick='startDeleteSortOrder(" + id1 + ");'>Delete</button>" + 
    "<button id='sort_order_button_confirm_delete" + id1 + "' style='display: none; width: 100px; font-size: 20px; margin-top: 5px; color: red' onclick='confirmDeleteSortOrder(" + id1 + ");'>Confirm Delete</button>" + 
    "<button id='sort_order_button_cancel_delete" + id1 + "'  style='display: none; width: 100px; font-size: 20px; margin-top: 5px;' onclick='cancelDeleteSortOrder(" + id1 + ");'>Cancel Delete</button>" + 
    "</div>" +
    "<p style='font-size: 20px;'>Name&nbsp;</p><input id='sort_order_name_" + id1 + "' type='text' style='width: 500px; font-size: 20px;' onfocus='deselectTable();'>" + 
    "</div>" +
    "<div id='sort_order_static_" + id1 + "'>" +
    "<img class='clickable' style='display: inline;' id='sort_order_edit_icon_" + i + "' src='pencil.png' width=20px height=20px onclick='startEditSortOrder(" + id1 + ");')>&nbsp;&nbsp;&nbsp;&nbsp;" + 
    "<button id='sort_order_sort_button_" + id1 +"' style='font-size: 20px;' onclick='sortContentBySortOrder(" + i + ");')>Sort</button>&nbsp;&nbsp;&nbsp;&nbsp;" +
    "<p style='display: inline; font-size: 20px;'>" + getHTMLSafeText(_sort_orders[i].name) + "</p>" +
    "</div>" +
    "</td>";
    for(var j = 0; j < _sort_orders[i].sorted_indexes.length; ++j)
    {
      var index = _sort_orders[i].sorted_indexes[j];
      newHTML += getSortOrderCell(id1, j, index);
    }
    newHTML += "</tr>";
  }
  newHTML += "</table>";
  document.getElementById("sort_order_table_div").innerHTML = newHTML;
}


// Extra:
// MFR -> PART_MFR, APPL_MFR
// PART# -> PN
// S -> SHOP_QTY
// LOC -> LOCATION
// T1 -> TRK1_QTY
// T2 -> TRK2_QTY
// U -> 
// VEND -> FROM
// DATE -> DATE
// CGS -> CGS
// RETAIL -> VEND_RET
// SELL -> SELL

//Highlighting differences
//For each record view
//   For each text field
//      For each word in the text field
//          Check if word is in standardized word array of original, if no, save 0, if yes, save 1, if word_to_ignore, save -1
//If highlight differences is checked, make reverse start and end index array, ignore start end indexes that are one char long
//Else highlight similarities

// var EXTRA_INDEXES = ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]; //JS has no AKA, VEND   DNI and OEM has no OTHER, OEM_PN
var EXTRA_DB =                 ["B_DNI", "CHLX",    "GEM",    "H_RS",  "I_MM",  "JS",    "OEM"];
var EXTRA_DB_ACTUAL_INDEXES =  ["B_PN",  "CHLX_PN", "GEM_PN", "RS_PN", "MM_PN", "JS_PN", "OEM_PN"];
var CONTENT_EXTRA_DB_INDEXES = [9,       10,        12,       13,      14,      15,      20];

//              PART_MFR PART_MFR GEM_ID RS_ID   MM_ID   JS_ID  APPL_MFR
var RECORD_VIEW_HEADERS =                 ["MFR",                                                         "PART#", "S",          "LOC",        "T1",         "T2",         "U",           "VEND",   "DATE",   "CGS",   "RETAIL",     "SELL"];
var RECORD_VIEW_HEADERS_WIDTHS =          ["100px",                                                       "300px", "70px",       "100px",      "70px",       "70px",       "70px",        "100px",  "200px",  "100px", "100px",      "100px"];
var RECORD_VIEW_HEADERS_ACTUAL_INDEXES = [["PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], ["PN"],  ["SHOP_QTY"], ["LOCATION"], ["TRK1_QTY"], ["TRK2_QTY"], ["USED_QTY"],  ["FROM"], ["DATE"], ["CGS"], ["VEND_RET"], ["SELL"]];

function populateRecordViews()
{
  document.getElementById("record_views_div").innerHTML = "";
  var htmlToAdd = "";
  var differences_checked = "";
  var similarities_checked = "";
  if(_recordViewHightlightType == 0)
    differences_checked = "checked";
  else
    similarities_checked = "checked";
  if(_recordViews.length > 0)
    htmlToAdd += "<h1 class='clickable' onclick='toggleDiv(null, \"record_views_table\");'><span id='record_views_table_expander_icon' style='font-size: 50px; font-weight: 100;'>-</span> Record Views</h1>"
    + "<div id='record_views_table_div'>"
    + "<label class='radiobutton_container' style='display: inline;'>Show Differences&nbsp;&nbsp;<input  onchange='setRecordViewHighlightType(0);' type='radio' id='radio_record_views_differences' name='radio_record_views_highlighting'" + differences_checked + "><span class='radiomark'></span></label>"
    + "<label class='radiobutton_container' style='display: inline;'>Show Similarities&nbsp;&nbsp;<input onchange='setRecordViewHighlightType(1);' type='radio' id='radio_record_views_similarities' name='radio_record_views_highlighting'" + similarities_checked + "><span class='radiomark'></span></label>"
    + "<br><br>";
  
  var first_record_rownum = 0;
  for(var i = 0; i < _recordViews.length; ++i)
  {
    var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
    if(rownum != null)
    {
      var equip_type_text = _content[rownum][_EQUIP_TYPE];
      var appl_brand_text = _content[rownum][_APPL_BRAND];
      var descrip1_text =   _content[rownum][_DESCRIP1];
      var descrip2_text =   _content[rownum][_DESCRIP2];
      var comments_text =   _content[rownum][_COMMENTS];
      if(i == 0){
        first_record_rownum = rownum;
      }
      else{
        var equip_type_indexes = getWordCompareIndexes(_content[first_record_rownum][_EQUIP_TYPE], equip_type_text, _recordViewHightlightType);
        var appl_brand_indexes = getWordCompareIndexes(_content[first_record_rownum][_APPL_BRAND], appl_brand_text, _recordViewHightlightType);
        var descrip1_indexes = getWordCompareIndexes(  _content[first_record_rownum][_DESCRIP1], descrip1_text,     _recordViewHightlightType);
        var descrip2_indexes = getWordCompareIndexes(  _content[first_record_rownum][_DESCRIP2], descrip2_text,     _recordViewHightlightType);
        var comments_indexes = getWordCompareIndexes(  _content[first_record_rownum][_COMMENTS], comments_text,     _recordViewHightlightType);
        var preHTML = "<span style='background: salmon;'>";
        if(_recordViewHightlightType == 1)
          preHTML = "<span style='background: lightgreen;'>";
        var postHTML = "</span>";
        equip_type_text = highlightStringBasic(equip_type_text, equip_type_indexes.startIndexes, equip_type_indexes.endIndexes, preHTML, postHTML);
        appl_brand_text = highlightStringBasic(appl_brand_text, appl_brand_indexes.startIndexes, appl_brand_indexes.endIndexes, preHTML, postHTML);
        descrip1_text =   highlightStringBasic(descrip1_text,   descrip1_indexes.startIndexes,   descrip1_indexes.endIndexes,   preHTML, postHTML);
        descrip2_text =   highlightStringBasic(descrip2_text,   descrip2_indexes.startIndexes,   descrip2_indexes.endIndexes,   preHTML, postHTML);
        comments_text =   highlightStringBasic(comments_text,   comments_indexes.startIndexes,   comments_indexes.endIndexes,   preHTML, postHTML);
      }
      htmlToAdd += "<button style='width: 50px;' onclick='removeRecordView(" + i + ");')>X</button><div style='display: flex;'><div class='border_center' style='flex-grow: 1;'></div>" 
      + "<div class='text1'>" + equip_type_text + " / " + appl_brand_text + "</div>"
      + "<div class='border_center' style='flex-grow: 8;'></div></div>"
      + "<div style='display: block; border-left: solid; border-bottom: solid; border-right: solid; border-width: 2px; border-color: black;'>" 
      + "<p style='padding-left: 10px;'><b>DESCRIP1:</b> " + descrip1_text + "<br>"
      + "<b>DESCRIP2: </b>" + descrip2_text + "</p>"
      + "<p style='padding-left: 10px;'><b>COMMENTS:</b> " + comments_text + "</p>"
      + "</div><div class=clickable style='font-size: 20px; background-color: #96BBFF' onclick='toggleDiv(null, \"record_view_details_" + i + "\")'><span id='record_view_details_" + i + "_expander_icon' style='font-size: 24px;'>+</span> Details</div>" 
      + "<div id='record_view_details_" + i + "_div' style='display: none;'><table><tr><th></th>";
      
      for(var j = 0; j < RECORD_VIEW_HEADERS.length; ++j)
      {
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS[j] + ";'><p>" + RECORD_VIEW_HEADERS[j] + "</p></th>";
      }
      htmlToAdd += "<th>Reliable Parts</th><th>Encompass</th>";
      htmlToAdd += "</tr>";
      for(var j = 0; j < EXTRA_DB.length; ++j)
      {
        var extraDBIndex = getExtraDBLinkIndex(j, _content[rownum][CONTENT_EXTRA_DB_INDEXES[j]]);
        if(j == EXTRA_DB.length - 1) //Last row
          htmlToAdd += "<tr style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
        else
          htmlToAdd += "<tr>";
        var partSearchTerm = "";
        for(var k = 0; k < RECORD_VIEW_HEADERS.length; ++k)
        { 
          htmlToAdd += "<td>";
          if(k == 0)
            htmlToAdd += "<p>" + EXTRA_DB[j] + "</p></td><td>";
          if(extraDBIndex != null){
            for(var d = 0; d < RECORD_VIEW_HEADERS_ACTUAL_INDEXES[k].length; ++d){
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES[k][d]];
              if(content1 != null){
                if(k == 1) //PART#
                  partSearchTerm = content1;
                if(k == 9 || k == 10 || k == 11) //"CGS",   "RETAIL",     "SELL" in usd format
                {
                  htmlToAdd += "<p>" + content1.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</p>";
                }
                else
                {
                  htmlToAdd += "<p>" + content1 + "</p>";
                }
                break;
              }
            }
          }
          htmlToAdd += "</td>";
        }
        htmlToAdd += "<td>";
        if(removeExtraSpaces(partSearchTerm) != "")
          htmlToAdd += "<a href='https://www.reliableparts.com/search?q=" + partSearchTerm + "' target='_blank'>Search</a>";
        htmlToAdd += "</td>";
        htmlToAdd += "<td>";
        if(removeExtraSpaces(partSearchTerm) != "")
          htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + partSearchTerm + "' target='_blank'>Search</a>";
        htmlToAdd += "</td>";
        htmlToAdd += "</tr>";
      }
      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 80, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE],     (i + "_ADVICE"),     80, "");
      var MODEL_CONTENT =  getExpandableHTML(_content[rownum][_MODEL],      (i + "_MODEL"),      80, "");
      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>  <td colspan=2><b>" + _content[rownum][_PART_NUMBR] + "</b></td><td><b>" + _content[rownum][_LOCATION] + "</b></td><td colspan=4><b>" + _content[rownum][_MODIFIED] + "</b></td><td>KEEP  <b>" + _content[rownum][_KEEP] +      "</b></td><td>BULK <b>" + _content[rownum][_GET] + "</b></td><td style='text-align: right;'>Aside</td>                                                 </tr>"
                + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td><td colspan=2>" + LKUPPN_CONTENT + "                      </td><td style='text-align: right;'>         ADVICE</td><td colspan=4>" + ADVICE_CONTENT + "                    </td><td>REORD <b>" + _content[rownum][_REORD_QTY] + "</b></td><td colspan=2 style='text-align: right;'>                                          Srce</td><td><b>" + _content[rownum][_SOURCE] + "</b></td></tr>"
                + "<tr><td colspan=4>                                                                                                </td><td style='text-align: right;'>          MODEL</td><td colspan=4>" + MODEL_CONTENT + "                     </td><td>PREF  <b>" + _content[rownum][_FROM] +      "</b></td>                                                                                                                                             </tr>"
                + "</table></div><br><br>";
    }
    if(_recordViews.length > 0)
      htmlToAdd += "</div>";
    document.getElementById("record_views_div").innerHTML = htmlToAdd;
  }
}

document.getElementById("import_wlmay_pdf_input").onchange = function(event) 
{
  if(document.getElementById("import_wlmay_pdf_input").value != "")
  {
    var file = event.target.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader();  

    fileReader.onload = function() {

        //Step 4:turn array buffer into typed array
        var typedarray = new Uint8Array(this.result);

        getPdfText(typedarray);
        document.getElementById("wlmay_input_div").style.display = "none";
        document.getElementById("wlmay_pdf_table_div").style.display = "block";
    };
    //Step 3:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  }
}

function cancelWLMAYPDF()
{
  document.getElementById("wlmay_pdf_table_div").style.display = "none";
  document.getElementById("wlmay_input_div").style.display = "block";
  document.getElementById("import_wlmay_pdf_input").value = "";
}