// function processCSVData(allText) {
//   var quotes = false;
//   var row = 0;
//   var column = 1;
//   var start = 0;
//   var end = 0;
//   _content = new Array(25862);
//   // _indexToContentID = new Array(25862);
//   for (var i = 0; i < _content.length; ++i) { 
//     _content[i] = new Array(INDEXES.length);
//     _content[i][0] = i + "n";
//     // _indexToContentID[i] = _content[i][0];
//     for(var j = 0; j < INDEXES.length; ++j){
//       _content[i][j] = "";
//     }
//   } 
//   for(var i = 0; i < allText.length; ++i)
//   {
//     var n = allText.charAt(i);
//     if(n == '\"'){
//       quotes = !quotes;
//     }

//     else if(n == ',' && !quotes){
//       end = i;
//       _content[row][column] = allText.substring(start, end);
//       ++column;
//       start = i + 1;
//     }
//     else if(n == '\n'){
//       end = i;
//       _content[row][column] = allText.substring(start, end);
//       column = 1;
//       ++row;
//       start = i + 1;
//     }
//   }
//   generateContent_Standard();
//   populateRecordBrowser(0, false);
// }

// function readSingleFile_json(evt) {
//   var file = evt.target.files[0];
//   var fr = new FileReader();
//   fr.onload = processJSONData;
//   fr.readAsText(file);
//   document.getElementById("fileinput_div").style.display = "none";
// }

// function processJSONData(e){
//   let lines = e.target.result;
//   var objs = JSON.parse(lines);
//   _content = [];
//   for(var i = 0; i < objs.length; ++i){
//     var content_line = [];
//     var obj = objs[i];
//     for(var j = 0; j < INDEXES.length; ++j){
//       content_line.push(String(obj[INDEXES[j]]));
//     }
//     for(var j = 0; j < MEMO_INDEXES.length; ++j){
//       content_line.push(obj[MEMO_INDEXES[j]]);
//     }
//     content_line.push(i + "n");
//     _content.push(content_line);
//   }

//   generateContent_Standard();
//   populateRecordBrowser(0, false);
// }

function getExtraDBPartManufacturer(i, j)
{
  var MFR_INDEXES = ["PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"];
  var part = _content_extra[i][j][0];
  for(var k = 0; k < MFR_INDEXES.length; ++k)
  {
    var mfr = part[MFR_INDEXES[k]];
    if(mfr != null){
      return mfr;
    }
  }
}

function getParentIndexFromID(id1)
{
  var numRecords = _content.length;
  for(var i = 0; i < numRecords; ++i)
  {
    if(_content[i][_content[i].length - 1] == id1)
      return i;
  }
  return null;
}

var _extradb_link_index_cache = [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()];
function getExtraDBLinkIndex(db, pn) {
  if (pn.length > 0) {

    if(_extradb_link_index_cache[db].has(pn))
    {
      var index = _extradb_link_index_cache[db].get(pn);
      if(_content_extra[db].length > index && String(_content_extra[db][index][0].PN) == pn) //Only include exact match PN in cache to ensure it doesn't load inferior match if indexes are changed
      {
        return index;
      }
      
      _extradb_link_index_cache[db].delete(pn); //Cache invalid
    }
    
    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match PN
    {
      if (String(_content_extra[db][i][0].PN) == pn) 
      {
        _extradb_link_index_cache[db].set(pn, i);
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0].PN)) == pn1) //General match PN
      {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match AKA
    {
      if (String(_content_extra[db][i][0].AKA) == pn) {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0].AKA)) == pn1) //General match AKA
      {
        return i;
      }
    }
  }
  return null;
}

function processJSONData(objs) {
  _content = [];
  for (var i = 0; i < objs.length; ++i) {
    var content_line = [];
    var obj = objs[i];
    for (var j = 0; j < _INDEXES.length; ++j) {
      content_line.push(String(obj[_INDEXES[j]]));
    }
    for (var j = 0; j < _MEMO_INDEXES.length; ++j) {
      content_line.push(obj[_MEMO_INDEXES[j]]);
    }
    content_line.push(i + "n");
    _content.push(content_line);
    // var in1 = 6;
    // var link = getExtraDBLinkIndex(in1, content_line[CONTENT_EXTRA_DB_INDEXES[in1]]);
    // if(link == null)
    //   console.log(content_line[CONTENT_EXTRA_DB_INDEXES[in1]]);
  }
  generateContent_Standard();
  populateRecordBrowser(0, false);
  initialLoadingFinished();
}

function processJSONDataExtra(objs, _content_extra_db, keys) {
  if (_content_extra == null) {
    _content_extra = new Array(_EXTRA_DB.length);
    for (var i = 0; i < _EXTRA_DB.length; ++i)
      _content_extra[i] = [];
  }

  for (var i = 0; i < objs.length; ++i) {
    var content_line = [];
    content_line.push(objs[i]);
    // for(var j = 0; j < EXTRA_INDEXES.length; ++j){
    //   var item = obj[EXTRA_INDEXES[j]];
    //   if(item == null)
    //     content_line.push("");
    //   else
    //     content_line.push(String(item));
    // }
    if (keys == null)
      content_line.push(i + "e");
    else
      content_line.push(keys[i]);
    _content_extra[_content_extra_db].push(content_line);
  }
  
  _CHILD_PART_LINKS_CACHE = [];
}

function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

function is_standardized(str) {
  return /^[a-z0-9 ]+$/i.test(String(str));
}

function removeExtraSpaces(str) {
  //Remove multiple spaces
  var str2 = String(str).replace(/ {2,}/g, " ");

  //Remove spaces at beginning of string
  if (str2.charAt(0) == " ")
    str2 = str2.substring(1, str2.length);

  //Remove spaces at end of string
  if (str2.charAt(str2.length - 1) == " ")
    str2 = str2.substring(0, str2.length - 1);

  return str2;
}

function removePreWP(str)
{
  var str2 = String(str).toLowerCase();
  if(str2.length >= 2 && str2.charAt(0) == 'w' && str2.charAt(1) == 'p')
  {
    return str.substring(2, str.length);
  }
  return str;
}

function standardizeString(str) {
  var str2 = String(str).toLowerCase();

  //Remove non numbers and letters and spaces
  str2 = str2.replace(/[^0-9a-z ]/g, "");

  //Remove multiple spaces
  str2 = str2.replace(/ {2,}/g, " ");

  //Remove spaces at beginning of string
  if (str2.charAt(0) == " ")
    str2 = str2.substring(1, str2.length);

  //Remove spaces at end of string
  if (str2.charAt(str2.length - 1) == " ")
    str2 = str2.substring(0, str2.length - 1);

  return str2;
}

function escapeQuotations(str) {
  var str2 = String(str).replace(/\"/g, "\\\"");
  str2 = str2.replace(/\'/g, "\\\'");
  return str2;
}

function useBlackText(r, g, b) {
  var gamma = 2.2;
  var L = 0.2126 * Math.pow(r, gamma)
    + 0.7152 * Math.pow(g, gamma)
    + 0.0722 * Math.pow(b, gamma);
  return (L > 0.5);
}

function getStandardPNString(str1) {
  var str = String(str1);
  var modified = true;
  while (modified) {
    var orig_length = str.length;
    // str = removeStartingZeroes(str);
    str = removeEndTilde(str);
    str = removeEndArrow(str);
    str = removeEndExclaim(str);
    str = removeEndSemicolon(str);
    modified = (orig_length != str.length);
  }
  return str.toLowerCase();
}

function getStandardPNWebSearchString(str1) {
  var str = String(str1);
  var modified = true;
  while (modified) {
    var orig_length = str.length;
    // str = removeStartingZeroes(str);
    str = removeEndTilde(str);
    str = removeEndArrow(str);
    str = removeEndExclaim(str);
    str = removeEndSemicolon(str);
    modified = (orig_length != str.length);
  }
  return str.toLowerCase();
}

function removeStartingZeroes(str1) {
  var str = String(str1);
  while (str.length > 0 && str[0] == "0")
    str = str.substring(1, str.length);
  return str;
}

function removeEndTilde(str1) {
  var str = String(str1);
  if (str.length > 0 && str[str.length - 1] == "~")
    str = str.substring(0, str.length - 1);
  return str;
}

function removeEndArrow(str1) {
  var str = String(str1);
  if (str.length > 1 && str[str.length - 2] == "-" && str[str.length - 1] == ">")
    str = str.substring(0, str.length - 2);
  return str;
}

function removeEndExclaim(str1) {
  var str = String(str1);
  if (str.length > 0 && str[str.length - 1] == "!")
    str = str.substring(0, str.length - 1);
  return str;
}

function removeEndSemicolon(str1) {
  var str = String(str1);
  if (str.length > 0 && str[str.length - 1] == ";")
    str = str.substring(0, str.length - 1);
  return str;
}

function is_numeric(str1) {
  var str = String(str1);
  return /^\d+$/.test(str);
}

function is_alphanumeric(str1) {
  var str = String(str1);
  return /^[a-z0-9]+$/i.test(str);
}

function getRegexSafeSearchTerm(str) {
  var str2 = String(str).replace(/\\/g, "\\\\");
  str2 = str2.replace(/\)/g, "\\)");
  str2 = str2.replace(/\(/g, "\\(");
  str2 = str2.replace(/\+/g, "\\+");
  str2 = str2.replace(/\-/g, "\\-");
  str2 = str2.replace(/\?/g, "\\?");
  str2 = str2.replace(/\|/g, "\\|");
  str2 = str2.replace(/\!/g, "\\!");
  str2 = str2.replace(/\//g, "\\/");
  str2 = str2.replace(/\*/g, "\\*");
  str2 = str2.replace(/\,/g, "\\,");
  str2 = str2.replace(/\./g, "\\.");
  str2 = str2.replace(/\^/g, "\\^");
  str2 = str2.replace(/\$/g, "\\$");
  str2 = str2.replace(/\[/g, "\\[");
  str2 = str2.replace(/\{/g, "\\{");
  return str2;
}

function getHTMLSafeText(str) {
  var str2 = String(str).replace("\&", "&amp;");
  str2 = str2.replace(/\</g, "&lt;");
  str2 = str2.replace(/\>/g, "&gt;");
  str2 = str2.replace("\"", "&quot;");
  str2 = str2.replace("\'", "&apos;");
  return str2;
}

function getStringNumberHash(s) {
  return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
}

function getColorFromString(str1) {
  var str = String(str1);
  var color = [Math.abs(getStringNumberHash(str + "!@#$%^&*()") % 256), Math.abs(getStringNumberHash(str + "!1234567890!") % 256), Math.abs(getStringNumberHash(str + "selamat pagi") % 256)];
  return color;
}

function toggle_similar_strings() {
  if (document.getElementById("similar_strings_div").style.display == "none") {
    document.getElementById("similar_strings_div").style.display = "block";
    document.getElementById("similar_strings_expander_icon").innerHTML = "-";
  }
  else {
    document.getElementById("similar_strings_div").style.display = "none";
    document.getElementById("similar_strings_expander_icon").innerHTML = "+";
  }
}

// function toggle_search_results(state) { //0 hidden, 1 shown, 2 toggle
//   if (state == 0) {
//     document.getElementById("search_results_div").style.display = "none";
//     document.getElementById("search_results_expander_icon").innerHTML = "+";
//   }
//   else if (state == 1) {
//     document.getElementById("search_results_div").style.display = "block";
//     document.getElementById("search_results_expander_icon").innerHTML = "-";
//   }
//   else {
//     if (document.getElementById("search_results_div").style.display == "none") {
//       document.getElementById("search_results_div").style.display = "block";
//       document.getElementById("search_results_expander_icon").innerHTML = "-";
//     }
//     else {
//       document.getElementById("search_results_div").style.display = "none";
//       document.getElementById("search_results_expander_icon").innerHTML = "+";
//     }
//   }
// }

function toggle_similar_string_table(id) {
  var tableID = "similar_string_table_" + id;
  var expanderID = "similar_string_expander_" + id;
  if (document.getElementById(tableID).style.display == "none") 
  {
    document.getElementById(tableID).style.display = "block";
    document.getElementById(expanderID).innerHTML = "-";
  }
  else 
  {
    document.getElementById(tableID).style.display = "none";
    document.getElementById(expanderID).innerHTML = "+";
  }
}

var _DBID_to_ContentIndex_Cache = new Map();
function getContentIndexFrom_DB_ID(db_id) 
{
  if(_DBID_to_ContentIndex_Cache.has(db_id))
  {
    var index = _DBID_to_ContentIndex_Cache.get(db_id);
    if(_content.length > index && _content[index][_content[index].length - 1] == db_id)
    {
      return index;
    }
    else
    {
      _DBID_to_ContentIndex_Cache.delete(db_id);
    }
  }

  for (var i = 0; i < _content.length; ++i) {
    if (_content[i][_content[i].length - 1] == db_id)
    {
      _DBID_to_ContentIndex_Cache.set(db_id, i);
      return i;
    }
  }
  // console.log("Failed to find content row with id " + db_id);
  return null;
}

function getContentExtraIndexFrom_DB_ID(db_id, db_index) {
  for (var i = 0; i < _content_extra[db_index].length; ++i) 
  {
    if (_content_extra[db_index][i][1] == db_id)
      return i;
  }
  // console.log("Failed to find content extra row with id " + db_id);
  return null;
}

function sortContentByIndex(index) {
  showSnackbar("Sorting by index...", 6000);
  // document.getElementById("message").innerHTML = "<p>Sorting by index...</p>";
  document.getElementById("content_div").style.display = "none";

  var _selectedRecord_DB_ID = null;
  if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length) {
    _selectedRecord_DB_ID = _content[_selectedRow][_content[_selectedRow].length - 1];
  }

  var index_array = [index];
  if (isArrayEqual(index_array, _contentSortedIndex)) {
    _contentSortedReverse = !_contentSortedReverse;
  }
  else {
    _contentSortedReverse = false;
  }

  var sortWorker = new Worker('workers/sort_content_by_index.js');
  sortWorker.postMessage([_content, index, _INDEXES, _contentSortedReverse]);
  sortWorker.onmessage = function (e) {
    _content = e.data[0];
    generateContent_Standard();
    _contentSortedIndex = [index];
    populateRecordBrowser(0, false);
    document.getElementById("message").innerHTML = "";
    document.getElementById("content_div").style.display = "";
    if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null) {
      var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
      if (index1 != null) {
        populateRecordBrowser(index1, false);
        var cell = getCell(index1, _selectedCell, _selectedTable);
        if (cell != null)
          onCellClick(index1, _selectedCell, cell.id, _selectedTable);
      }
    }
    showSnackbar("Sorting search results...", 3000);
    re_sort_searchResults();
    setTab(_selected_tab);
  }
}

function sortContentBySortOrder(order_index) {
  showSnackbar("Sorting by index...", 6000);
  // document.getElementById("message").innerHTML = "<p>Sorting by index...</p>";
  document.getElementById("content_div").style.display = "none";
  
  var _selectedRecord_DB_ID = null;
  if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length) {
    _selectedRecord_DB_ID = _content[_selectedRow][_content[_selectedRow].length - 1];
  }
  
  var sorted_indexes = _sort_orders[order_index].sorted_indexes;
  if (isArrayEqual(sorted_indexes, _contentSortedIndex)) {
    _contentSortedReverse = !_contentSortedReverse;
  }
  else {
    _contentSortedReverse = false;
  }
  
  var sortWorker = new Worker('workers/sort_content_by_sort_order.js');
  sortWorker.postMessage([_content, sorted_indexes, _INDEXES, _contentSortedReverse]);
  sortWorker.onmessage = function (e) {
    _content = e.data[0];
    generateContent_Standard();
    _contentSortedIndex = sorted_indexes;
    populateRecordBrowser(0, false);
    document.getElementById("message").innerHTML = "";
    document.getElementById("content_div").style.display = "";
    if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null) {
      var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
      if (index1 != null) {
        populateRecordBrowser(index1, false);
        var cell = getCell(index1, _selectedCell, _selectedTable);
        if (cell != null)
        onCellClick(index1, _selectedCell, cell.id, _selectedTable);
      }
    }
    showSnackbar("Sorting search results...", 3000);
    re_sort_searchResults();
    setTab(_selected_tab);
  }
}

function re_sort_searchResults()
{
  _searchResults.sort(COMPARE_SEARCHRESULTS_TO_SORTED_CONTENT);
  populateSearchResults(_currentSearchResultsStartIndex, false, false, -1);
}

function generateContent_Standard() {
  _content_standard = [];
  for (var i = 0; i < _content.length; ++i)
  _content_standard.push(getStandardRow(i));
  setLargestRecordNumbers();
}

function generateContent_Standard_Row(rownum) {
  _content_standard[rownum] = getStandardRow(rownum);
  setLargestRecordNumbers();
}

function generateContent_Standard_New() {
  _content_standard.push(getStandardRow(_content.length - 1));
  setLargestRecordNumbers();
}

function getStandardRow(content_index) {
  var ilength = _INDEXES.length;
  var newRow = [];
  for (var j = 0; j < ilength; ++j)
    newRow.push(standardizeString(_content[content_index][j]));

  for (var j = 0; j < _MEMO_INDEXES.length; ++j) {
    var memoIndex = j + ilength;
    var array1 = [];
    for (var k = 0; k < _content[content_index][memoIndex].length; ++k) {
      array1.push(standardizeString(_content[content_index][memoIndex][k]));
    }
    newRow.push(array1);
  }
  newRow.push(_content[content_index][_content[content_index].length - 1]); //Copy database ID
  return newRow;
}

function onCellClick(row, cell, id, table_enum, skipPopulate) {
var textele_edit = document.getElementById("edit_textarea_1");
var textele_new  = document.getElementById("new_textarea_1");

if(table_enum != _TABLE_RECORD_BROWSER || (textele_edit == null && textele_new == null)) //Prevents record browser from being selected while editing
{
    if (skipPopulate == null)
      skipPopulate = false;

    _isTableSelected = true;
    var elementRow = null;
    var elementCell = null;
    switch (_selectedTable) 
    {
      case _TABLE_SEARCH_RESULTS:
        elementRow = document.getElementById("search_results_row_" + _selectedRow);
        elementCell = document.getElementById("search_results_cell_" + _selectedRow + "_" + _selectedCell);
        break;
      case _TABLE_SIMILAR_STRINGS:
        elementRow = document.getElementById("similar_string_row_" + _selectedRow);
        elementCell = document.getElementById("similar_string_cell_" + _selectedRow + "_" + _selectedCell);
        break;
      case _TABLE_RECORD_BROWSER:
        elementRow = document.getElementById("record_browser_row_" + _selectedRow);
        elementCell = document.getElementById("record_browser_cell_" + _selectedRow + "_" + _selectedCell);
        break;
    }
    if (elementRow != null)
      elementRow.style.backgroundColor = "";

    if (elementCell != null)
      elementCell.style.backgroundColor = "";

    _selectedTable = table_enum;
    _selectedRow = row;
    _selectedCell = cell;

    switch (_selectedTable) {
      case _TABLE_SEARCH_RESULTS:
        elementRow = document.getElementById("search_results_row_" + _selectedRow);
        if (!skipPopulate)
          populateRecordBrowser(_indexesSearchResults[row], true);
        break;
      case _TABLE_SIMILAR_STRINGS:
        elementRow = document.getElementById("similar_string_row_" + _selectedRow);
        if (!skipPopulate)
          populateRecordBrowser(_indexesSimilarStrings[row], true);
        break;
      case _TABLE_RECORD_BROWSER:
        elementRow = document.getElementById("record_browser_row_" + _selectedRow);
        break;
    }
    if (elementRow != null)
      elementRow.style.backgroundColor = _selectedRowColor;

    elementCell = document.getElementById(id);
    _selectedCellLastID = null;
    if (elementCell != null) {
      elementCell.style.backgroundColor = _selectedCellColor;
      elementCell.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
      _selectedCellLastID = id;
      setKeyboardShortcutBar();
    }
  }
}

function deselectTable(index) {
  _selected_record_view = -1;
  if (index != null)
    _selected_search_input = index;
  _isTableSelected = false;
  var elementRow = null;
  var elementCell = null;

  switch (_selectedTable) {
    case _TABLE_SEARCH_RESULTS:
      elementRow = document.getElementById("search_results_row_" + _selectedRow);
      elementCell = document.getElementById("search_results_cell_" + _selectedRow + "_" + _selectedCell);
      break;
    case _TABLE_SIMILAR_STRINGS:
      elementRow = document.getElementById("similar_string_row_" + _selectedRow);
      elementCell = document.getElementById("similar_string_cell_" + _selectedRow + "_" + _selectedCell);
      break;
    case _TABLE_RECORD_BROWSER:
      elementRow = document.getElementById("record_browser_row_" + _selectedRow);
      elementCell = document.getElementById("record_browser_cell_" + _selectedRow + "_" + _selectedCell);
      break;
  }
  if (elementRow != null)
    elementRow.style.backgroundColor = "";

  if (elementCell != null)
    elementCell.style.backgroundColor = "";
}

function getCell(row, column, table_enum) {
  var elementCell = null;
  switch (table_enum) {
    case _TABLE_SEARCH_RESULTS:
      elementCell = document.getElementById("search_results_cell_" + row + "_" + column);
      break;
    case _TABLE_SIMILAR_STRINGS:
      elementCell = document.getElementById("similar_string_cell_" + row + "_" + column);
      break;
    case _TABLE_RECORD_BROWSER:
      elementCell = document.getElementById("record_browser_cell_" + row + "_" + column);
      break;
  }
  return elementCell;
}

function setRadioColumn() {
  if (document.getElementById("radio_columns_specific").checked) {
    document.getElementById("search_any_input_div").style.display = "none";
    document.getElementById("radio_columns_div").style.display = "block";
    document.getElementById("radio_columns_all_none_buttons_div").style.display = "";
  }
  else {
    document.getElementById("search_any_input_div").style.display = "block";
    document.getElementById("radio_columns_div").style.display = "none";
    document.getElementById("radio_columns_all_none_buttons_div").style.display = "none";
  }
  var ele = document.getElementById("search_input_" + _INDEX_ORDER[0]);
  if(ele != null && document.getElementById("radio_columns_div").style.display != "none")
  {
    ele.focus();
    ele.select();    
  }
}

function setRadioColumnsChecked(bool) {
  var total_index_length = _INDEXES.length + _MEMO_INDEXES.length;
  for (var i = 0; i < total_index_length; ++i) {
    document.getElementById("column_checkbox_" + i).checked = bool;
    if (!bool)
      document.getElementById("search_input_" + i).value = "";
  }

}

function onSearchInputChanged(index) {
  if (document.getElementById("search_input_" + index).value == "")
    document.getElementById("column_checkbox_" + index).checked = false;
  else
    document.getElementById("column_checkbox_" + index).checked = true;
}

function show_more_column_checkboxes(visible) {
  if (visible) {
    document.getElementById("show_more_column_checkboxes").style.display = "none";
    document.getElementById("radio_columns_checkboxes_more").style.display = "block";
  }
  else {
    document.getElementById("show_more_column_checkboxes").style.display = "block";
    document.getElementById("radio_columns_checkboxes_more").style.display = "none";
  }
}

function updateRecordBrowserMax() {
  var max = Number(document.getElementById("record_browser_max").value);
  document.getElementById("save_record_browser_max").style.display = "none";
  if (max > 0) {
    _recordBrowserMax = max;
    populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  }
  else {
    document.getElementById("record_browser_max").value = 1;
  }
}

function updateSearchResultsMax() {
  var max = Number(document.getElementById("search_results_max").value);
  document.getElementById("save_search_results_max").style.display = "none";
  if (max > 0) {
    _searchResultsMax = max;
    populateSearchResults(_currentSearchResultsStartIndex, false, false, -1);
  }
  else {
    document.getElementById("search_results_max").value = 1;
  }
}

function startEditRecord(record_id, rownum, row_id) {
  for (var i = 0; i < _recordBrowserMax; ++i) {
    var icon = document.getElementById("edit_icon_" + i);
    if (icon != null)
      icon.style.display = "none";
    icon = document.getElementById("copy_icon_" + i);
    if (icon != null)
      icon.style.display = "none";
  }
  var cells1 = document.getElementById(row_id).cells;
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    if (i == 0) {
      cells1[i].innerHTML = "<div style='display: flex; align-items: center; justify-content: center;'>" +
        "<div style='flex-direction: column;'>" +
        "<button id='save_edit_record' onclick='saveEditRecord(" + rownum + ");'          style='background-color: #70A2FF; color: black; width: 60px;'><span style='color: white;'>S</span>ave</button>" +
        "<button id='cancel_edit_record' onclick='cancelEditRecord()'                     style='background-color: #70A2FF; color: black; width: 60px; margin-top: 5px;'><span style='color: white;'>C</span>ancel</button>" +
        "<button id='delete_edit_record' onclick='startDeleteRecord(); event.preventDefault();'                    style='background-color: #70A2FF; color: black; width: 60px; margin-top: 5px; color: red;'><span style='color: white;'>D</span>elete</button>" +
        "<button id='confirm_delete_record' onclick='confirmDeleteRecord(" + rownum + ")' style='background-color: #70A2FF; color: black; display: none; color: red;'>Confirm&nbsp;<span style='color: white;'>D</span>elete</button>" +
        "<button id='cancel_delete_record' onclick='cancelDeleteRecord();'                style='background-color: #70A2FF; color: black; display: none;'><span style='color: white;'>C</span>ancel Delete</button>" +
        "</div>" +
                            "<input type='text' id='edit_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + "' onfocus='deselectTable();' onchange='deselectTable();'></input></div>";
      document.getElementById("edit_textarea_" + i).value = _content[rownum][index];
    }
    else if (index < _INDEXES.length) {
      cells1[i].innerHTML = "<input type='text' id='edit_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></input>";
      document.getElementById("edit_textarea_" + i).value = _content[rownum][index];
    }
    else {
      cells1[i].innerHTML = "<textarea id='edit_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></textarea>";
      document.getElementById("edit_textarea_" + i).innerHTML = stringifyArrayEndChar(_content[rownum][index], "\n");
    }
  }
  var ele = document.getElementById("edit_textarea_1");
  if(ele != null){
    ele.focus();
    ele.select();
  }
}

function saveEditRecord(rownum) {
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    if (index < _INDEXES.length)
      _content[rownum][index] = document.getElementById("edit_textarea_" + i).value;
    else //Memo Fields
      _content[rownum][index] = document.getElementById("edit_textarea_" + i).value.split("\n");
  }
  generateContent_Standard_Row(rownum);
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  if (!_LOCAL_MODE) {
    var row = _content[rownum];
    var partObj = new Object();
    for (var i = 0; i < _INDEXES.length; ++i)
      partObj[_INDEXES[i]] = row[i];
    for (var i = 0; i < _MEMO_INDEXES.length; ++i)
      partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
    writeToDatabase('parts_db/P&A_PRI/' + row[row.length - 1], partObj, true, true, false, null);
  }
}

function saveContentToDatabase(rownum, addChangeAlert)
{
  if(addChangeAlert == null)
    addChangeAlert = true;
  if (!_LOCAL_MODE) {
    var row = _content[rownum];
    var partObj = new Object();
    for (var i = 0; i < _INDEXES.length; ++i)
      partObj[_INDEXES[i]] = row[i];
    for (var i = 0; i < _MEMO_INDEXES.length; ++i)
      partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
    console.log("Saving to db|" + rownum + "|" + addChangeAlert);
    writeToDatabase('parts_db/P&A_PRI/' + row[row.length - 1], partObj, addChangeAlert, true, false, null);
  }
}

function cancelEditRecord() {
  populateRecordBrowser(_selectedRow, false);
}

function startNewRecord(indexToCopy) {
  deselectTable();
  for (var i = 0; i < _recordBrowserMax; ++i) {
    var icon = document.getElementById("edit_icon_" + i);
    if (icon != null)
      icon.style.display = "none";
    icon = document.getElementById("copy_icon_" + i);
    if (icon != null)
      icon.style.display = "none";
  }

  var tableHTML = "<br><br><h1>New Record</h1><table><tr>";
  var contentToCopy = new Array();
  if (indexToCopy != null) {
    for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
      var trueIndex = _INDEX_ORDER[i];
      if (trueIndex < _INDEXES.length) //MEMO INDEX
        contentToCopy.push(_content[indexToCopy][trueIndex]);
      else
        contentToCopy.push(stringifyArrayEndChar(_content[indexToCopy][trueIndex], "\n"));
    }
  }
  else {
    for (var i = 0; i < INDEXES_CONCAT.length; ++i)
      contentToCopy.push("");
  }

  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    tableHTML += "<th><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
  }

  tableHTML += "</tr><tr>"

  for (var i = 0; i < INDEX_WIDTHS_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    if (i == 0) 
    {
      tableHTML += "<td><div style='display: flex; align-items: center; justify-content: center;'>" +
        "<div style='flex-direction: column;'>" +
        "<button id='save_new_record'   style='width: 60px; background-color: #70A2FF; color: black;'                  onclick='saveNewRecord();'  ><span style='color: white;'>S</span>ave</button>" +
        "<button id='cancel_new_record' style='width: 60px; background-color: #70A2FF; color: black; margin-top: 5px;' onclick='cancelNewRecord();'><span style='color: white;'>C</span>ancel</button>" +
        "</div>" +
        "<input type='text' id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></input></div></td>";
    }
    else if (index < _INDEXES.length)
      tableHTML += "<td>" +
        "<input type='text' id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></input></td>";
    else
      tableHTML += "<td>" +
        "<textarea id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></textarea></td>";
  }

  tableHTML += "</tr></table><br>";
  document.getElementById("add_part_table_div").innerHTML = tableHTML;
  for (var i = 0; i < INDEX_WIDTHS_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    if (index == 0) {

    }
    else
      document.getElementById("new_textarea_" + i).value = contentToCopy[i];
  }
  var ele = document.getElementById("new_textarea_1");
  if(ele != null)
  {
    ele.focus();
    ele.select();
  }
  ele = document.getElementById("new_textarea_" + _INDEX_ORDER.indexOf(_OEM_PN));
  if(ele != null)
  {
    ele.value = "OEM" + (_largestOEMNumber + 1);
  }
  ele = document.getElementById("new_textarea_" + _INDEX_ORDER.indexOf(_RECORD_NUMBER));
  if(ele != null)
  {
    ele.value = "" + (_largestRecordNumber + 1);
  }
}

function cancelNewRecord() {
  document.getElementById("add_part_table_div").innerHTML = "";
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
}

function saveNewRecord() {
  var partsListRef = getDatabaseRef('parts_db/P&A_PRI');
  var newPartRef = (_largestRecordNumber + 1) + "n";
  if (!_LOCAL_MODE)
    newPartRef = partsListRef.push();

  _content.push(new Array(INDEXES_CONCAT.length));
  var row = _content[_content.length - 1];
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    if (index < _INDEXES.length)
      row[index] = document.getElementById("new_textarea_" + i).value;
    else
      row[index] = document.getElementById("new_textarea_" + i).value.split("\n");
  }
  if (_LOCAL_MODE)
    row.push(newPartRef); //Add key to end
  else
    row.push(newPartRef.key);

  generateContent_Standard_New();
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  if (!_LOCAL_MODE) {
    var partObj = new Object();
    for (var i = 0; i < _INDEXES.length; ++i)
      partObj[_INDEXES[i]] = row[i];
    for (var i = 0; i < _MEMO_INDEXES.length; ++i)
      partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
    writeToDatabase('parts_db/P&A_PRI/' + newPartRef.key, partObj, true, true, false, null);
  }
}

function startDeleteRecord() {
  document.getElementById("save_edit_record").style.display = "none";
  document.getElementById("cancel_edit_record").style.display = "none";
  document.getElementById("delete_edit_record").style.display = "none";
  document.getElementById("confirm_delete_record").style.display = "flex";
  document.getElementById("cancel_delete_record").style.display = "flex";
  document.getElementById("edit_textarea_0").style.display = "none";
}

function cancelDeleteRecord() {
  document.getElementById("save_edit_record").style.display = "flex";
  document.getElementById("cancel_edit_record").style.display = "flex";
  document.getElementById("delete_edit_record").style.display = "flex";
  document.getElementById("confirm_delete_record").style.display = "none";
  document.getElementById("cancel_delete_record").style.display = "none";
  document.getElementById("edit_textarea_0").style.display = "flex";
}

function confirmDeleteRecord(rownum) {
  if (!_LOCAL_MODE) {
    deleteFromDatabase('parts_db/P&A_PRI/' + _content[rownum][_content[rownum].length - 1], true, true, false, null);
  }

  _content.splice(rownum, 1);
  _content_standard.splice(rownum, 1);

  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  setLargestRecordNumbers();
  clearSearchResults();
}

function startNewSortOrder(id1) {
  var newHTML = "<table><tr id='sort_order_row_" + id1 + "'><td style='width: 600px;'>" +
    "<div style='display: flex; align-items: center; justify-content: center;'>" +
    "<div style='flex-direction: column; width: 100px;'>" +
    "<button id='button_sortorder_new_save'   style='background-color: #70A2FF; color: black; width: 70px; font-size: 20px;' onclick='saveNewSortOrder();'><span style='color: white;'>S</span>ave</button>" + 
    "<button id='button_sortorder_new_cancel' style='background-color: #70A2FF; color: black; width: 70px; font-size: 20px; margin-top: 5px;' onclick='cancelNewSortOrder();'><span style='color: white;'>C</span>ancel</button>" +
    "</div>" +
    "<p style='font-size: 20px;'>Name&nbsp;</p><input id='sort_order_name_0' type='text' style='width: 500px; font-size: 20px;' onfocus='deselectTable();'>" +
    "</div>" +
    "</td>" + getSortOrderNewCell(id1, 0) + "</tr></table>";
  document.getElementById("sort_order_table_new_div").innerHTML = newHTML;
  document.getElementById("button_add_sort_order").style.display = "none";
}

function getSortOrderNewCell(id1, id2) {
  var newHTML = "<td id='sort_order_cell_" + id1 + "_" + id2 + "'><div style='display: flex; align-items: center; justify-content: center;'><select id='sort_order_select_" + id1 + "_" + id2 + "' style='font-size: 20px;'>";
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    newHTML += "<option value='" + INDEXES_CONCAT[0] + "'>" + INDEXES_CONCAT[index] + "</option>";
  }
  var plusScript = "appendSortOrderCell(" + id1 + "," + id2 + ");";
  var minusScript = "removeSortOrderCell(" + id1 + "," + id2 + ");";
  var minusButton = "";
  if (id2 != 0)
    minusButton = "<button id='button_sortorder_edit_minus_" + id1 + "_" + id2 + "' style='font-size: 20px; width: 50px; margin-top: 5px;' onclick='" + minusScript + "'>-</button>";
  var plusButton = "<button id='button_sortorder_edit_plus_" + id1 + "_" + id2 + "' style='font-size: 20px; width: 50px;' onclick='" + plusScript + "'>+</button>";
  newHTML += "</select>&nbsp;&nbsp;&nbsp;<div style='flex-direction: column; width: 50px;' id='sort_order_buttons_" + id1 + "_" + id2 + "'>" + plusButton + minusButton + "</div></div></td>";
  return newHTML;
}

function getSortOrderCell(id1, id2, defaultIndex) {
  var newHTML = "<td id='sort_order_cell_" + id1 + "_" + id2 + "'><div style='display: flex; align-items: center; justify-content: center;'><select id='sort_order_select_" + id1 + "_" + id2 + "' style='font-size: 20px; display: none;'>";
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    newHTML += "<option value='" + INDEXES_CONCAT[defaultIndex] + "'>" + INDEXES_CONCAT[index] + "</option>";
  }
  var plusScript = "appendSortOrderCell(" + id1 + "," + id2 + ");";
  var minusScript = "removeSortOrderCell(" + id1 + "," + id2 + ");";
  var minusButton = "";
  if (id2 != 0)
    minusButton = "<button id='button_sortorder_edit_minus_" + id1 + "_" + id2 + "' style='font-size: 20px; width: 50px; margin-top: 5px;' onclick='" + minusScript + "'>-</button>";
  var plusButton = "<button id='button_sortorder_edit_plus_" + id1 + "_" + id2 + "' style='font-size: 20px; width: 50px;' onclick='" + plusScript + "'>+</button>";
  newHTML += "</select>&nbsp;&nbsp;&nbsp;<div style='flex-direction: column; width: 50px; display: none;' id='sort_order_buttons_" + id1 + "_" + id2 + "'>" + plusButton + minusButton + "</div></div>" +
    "<p id='sort_order_static_cell_" + id1 + "_" + id2 + "' style='font-size: 15px;'>" + INDEXES_CONCAT[defaultIndex] + "</p>" +
    "</td>";
  return newHTML;
}

function appendSortOrderCell(id1, id2) {
  var savedIndexes = [];
  var savedName = document.getElementById("sort_order_name_" + id1).value;
  for (var i = 0; i <= id2; ++i)
    savedIndexes.push(document.getElementById("sort_order_select_" + id1 + "_" + i).selectedIndex);

  document.getElementById('sort_order_row_' + id1).innerHTML += getSortOrderNewCell(id1, id2 + 1);
  document.getElementById("sort_order_buttons_" + id1 + "_" + id2).style.display = "none";
  for (var i = 0; i <= id2; ++i)
    document.getElementById("sort_order_select_" + id1 + "_" + i).selectedIndex = savedIndexes[i];
  document.getElementById("sort_order_name_" + id1).value = savedName;
}

function removeSortOrderCell(id1, id2) {
  removeElement("sort_order_cell_" + id1 + "_" + id2);
  document.getElementById("sort_order_buttons_" + id1 + "_" + (id2 - 1)).style.display = "inline";
}

function cancelNewSortOrder() {
  document.getElementById("button_add_sort_order").style.display = "";
  document.getElementById("sort_order_table_new_div").innerHTML = "";
  setKeyboardShortcutBar();
}

function saveNewSortOrder() {
  var i = 0;
  var sorted_indexes = [];
  while (document.getElementById("sort_order_select_0_" + i) != null) {
    var select = document.getElementById("sort_order_select_0_" + i);
    sorted_indexes.push(select.selectedIndex);
    ++i;
  }
  
  if (sorted_indexes.length > 0) {
    var sortObj = new Object();
    sortObj.name = document.getElementById("sort_order_name_0").value;
    sortObj.sorted_indexes = sorted_indexes;
    
    var sortListRef = getDatabaseRef('sort_orders');
    var newSortOrderRef = sortListRef.push();
    writeToDatabase('sort_orders/' + newSortOrderRef.key, sortObj, false, false, false, null);
  }
  
  cancelNewSortOrder();
}

var _current_sort_order_editing = 0;
function startEditSortOrder(id1) {
  _current_sort_order_editing = id1;
  document.getElementById("sort_order_static_" + id1).style.display = "none";
  for(var i = 0; i < _sort_orders.length; ++i)
    document.getElementById("sort_order_edit_icon_" + i).style.display = "none";
  document.getElementById("sort_order_sort_button_" + id1).style.display = "none";
  document.getElementById("sort_order_buttons_" + id1).style.display = "flex";
  document.getElementById("sort_order_name_" + id1).value = _sort_orders[id1 - 1].name;
  var i = 0;
  while (document.getElementById("sort_order_static_cell_" + id1 + "_" + i) != null) {
    document.getElementById("sort_order_static_cell_" + id1 + "_" + i).style.display = "none";
    var select1 = document.getElementById("sort_order_select_" + id1 + "_" + i);
    select1.style.display = "";
    select1.selectedIndex = _sort_orders[id1 - 1].sorted_indexes[i];
    ++i;
  }
  document.getElementById("sort_order_buttons_" + id1 + "_" + (i - 1)).style.display = "";
}

function saveEditSortOrder(id1) {
  var i = 0;
  var sorted_indexes = [];
  while (document.getElementById("sort_order_select_" + id1 + "_" + i) != null) {
    var select = document.getElementById("sort_order_select_" + id1 + "_" + i);
    sorted_indexes.push(select.selectedIndex);
    ++i;
  }

  if (sorted_indexes.length > 0) {
    var sortObj = new Object();
    sortObj.name = document.getElementById("sort_order_name_" + id1).value;
    sortObj.sorted_indexes = sorted_indexes;

    writeToDatabase('sort_orders/' + _sort_orders[id1 - 1].key, sortObj, false, false, false, null);
  }
  populateSortOrders();
}

function startDeleteSortOrder(id1) {
  document.getElementById("sort_order_button_save" + id1).style.display = "none";
  document.getElementById("sort_order_button_cancel" + id1).style.display = "none";
  document.getElementById("sort_order_button_delete" + id1).style.display = "none";
  document.getElementById("sort_order_button_confirm_delete" + id1).style.display = "";
  document.getElementById("sort_order_button_cancel_delete" + id1).style.display = "";
}

function cancelDeleteSortOrder(id1) {
  document.getElementById("sort_order_button_save" + id1).style.display = "";
  document.getElementById("sort_order_button_cancel" + id1).style.display = "";
  document.getElementById("sort_order_button_delete" + id1).style.display = "";
  document.getElementById("sort_order_button_confirm_delete" + id1).style.display = "none";
  document.getElementById("sort_order_button_cancel_delete" + id1).style.display = "none";
}

function confirmDeleteSortOrder(id1) {
  deleteFromDatabase('sort_orders/' + _sort_orders[id1 - 1].key, false, false, false, null);
  populateSortOrders();
}

function stringifyArrayEndChar(array, endChar) {
  var result = "";
  for (var i = 0; i < array.length; ++i) {
    result += array[i];
    if (i != array.length - 1)
      result += endChar;
  }
  return result;
}

function copyArray1D(array) {
  var result = [];
  for (var i = 0; i < array.length; ++i) {
    result.push(array[i]);
  }
  return result;
}

function setLargestRecordNumbers() {
  _largestRecordNumber = 0;
  _largestOEMNumber = 0;
  for (var i = 0; i < _content.length; ++i) {
    var recordnumber = Number(_content_standard[i][0]);
    if (recordnumber > _largestRecordNumber)
      _largestRecordNumber = recordnumber;
    var oemString = String(_content[i][_OEM_PN]);
    if(oemString.length > 3)
    {
      if(oemString.substring(0, 3).toLowerCase() == "oem")
      {
        var oemNumber = Number(oemString.substring(3, oemString.length));
        if(oemNumber > _largestOEMNumber)
          _largestOEMNumber = oemNumber;
      }
    }
  }
}

function clearSearchResults() {
  document.getElementById("radio_columns_any").checked = true;
  document.getElementById("search_input").value = "";
  setRadioColumn();
  search_query(true);
}

function recordBrowserJumpToEdge(end) {
  var index = 0;
  if (end == 0)
    populateRecordBrowser(0, false);
  else {
    populateRecordBrowser(_content.length - 1, false);
    index = _content.length - 1;
  }

  var cell = getCell(index, _selectedCell, _TABLE_RECORD_BROWSER);
  if (cell != null)
    onCellClick(index, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
}

function searchResultsJumpToEdge(end) {
  var index = 0;
  if (end == 0)
    populateSearchResults(0, true, false, -1);
  else {
    populateSearchResults(_searchResults.length - 1, false, true, -1);
  }
}

function highlightString(str1, termToHighlightList, preHTML_List, postHTML_List) {
  var matchList = [];
  let match;
  var indexToPreHTMLs = new Map();
  var indexToPostHTMLs = new Map();
  var str = String(str1);
  for (var i = 0; i < termToHighlightList.length; ++i) {
    var regexp = new RegExp(getRegexSafeSearchTerm(termToHighlightList[i]), "g");
    while ((match = regexp.exec(str)) !== null) {
      // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
      // expected output: "Found football start=6 end=14."
      // expected output: "Found foosball start=16 end=24."
      if (indexToPreHTMLs.has(match.index))
        indexToPreHTMLs.get(match.index).push(preHTML_List[i]);
      else {
        var value = [preHTML_List[i]];
        indexToPreHTMLs.set(match.index, value);
      }

      if (indexToPostHTMLs.has(regexp.lastIndex))
        indexToPostHTMLs.get(regexp.lastIndex).push(postHTML_List[i]);
      else {
        var value = [postHTML_List[i]];
        indexToPostHTMLs.set(regexp.lastIndex, value);
      }

      if (!matchList.includes(match.index))
        matchList.push(match.index);
      if (!matchList.includes(regexp.lastIndex))
        matchList.push(regexp.lastIndex);
    }
  }

  matchList.sort(COMPARE_NUMBERS);
  for (var i = matchList.length - 1; i >= 0; --i) {
    var index = matchList[i];
    if (indexToPreHTMLs.has(index))
    {
      var preHTML_List2 = indexToPreHTMLs.get(index);
      for (var j = 0; j < preHTML_List2.length; ++j)
        str = str.substring(0, index) + preHTML_List2[j] + str.substring(index, str.length);
    }

    if (indexToPostHTMLs.has(index)) {
      var postHTML_List2 = indexToPostHTMLs.get(index);
      for (var j = 0; j < postHTML_List2.length; ++j)
        str = str.substring(0, index) + postHTML_List2[j] + str.substring(index, str.length);
    }
  }
  return str;
}

function highlightStringBasic(str1, startIndexes, endIndexes, preHTML, postHTML) {
  var str = String(str1);
  var str_length = str.length;
  var str2 = str;
  for (var i = str_length - 1; i >= 0; --i) {
    var debug_num = 0;
    if (endIndexes.includes(i)) {
      str2 = str2.substring(0, i + 1) + postHTML + str2.substring(i + 1, str2.length);
      ++debug_num;
    }
    if (startIndexes.includes(i)) {
      str2 = str2.substring(0, i) + preHTML + str2.substring(i, str2.length);
      ++debug_num;
    }

    // if(debug_num > 1){
    //   console.log("highlight string got invalid start and end index! " + i);
    //   console.log(str);
    //   console.log(startIndexes);
    //   console.log(endIndexes);
    // }
  }
  return str2;
}

function showRecordBrowserMax() {
  document.getElementById('save_record_browser_max').style.display = 'inline';
  deselectTable();
}

function showSearchResultsMax() {
  document.getElementById('save_search_results_max').style.display = 'inline';
  deselectTable();
}

function setMinRepititions() {
  _minRepititions = Number(document.getElementById("repititions_min").value);
  deselectTable();
}

function toggleDiv(bool, id1) {
  if (bool != null) {
    if (bool) {
      document.getElementById(id1 + "_div").style.display = "block";
      document.getElementById(id1 + "_expander_icon").innerHTML = "-";
    }
    else {
      document.getElementById(id1 + "_div").style.display = "none";
      document.getElementById(id1 + "_expander_icon").innerHTML = "+";
    }
  }
  else {
    if (document.getElementById(id1 + "_div").style.display == "none") {
      document.getElementById(id1 + "_div").style.display = "block";
      document.getElementById(id1 + "_expander_icon").innerHTML = "-";
      if (id1.length > 1 && id1.substring(0, id1.length - 1) == "record_view_details_")
        _recordViews_Key_To_Details_Open.set(_recordViews[Number(id1.substring(id1.length - 1, id1.length))], true);
    }
    else {
      document.getElementById(id1 + "_div").style.display = "none";
      document.getElementById(id1 + "_expander_icon").innerHTML = "+";
      if (id1.length > 1 && id1.substring(0, id1.length - 1) == "record_view_details_")
        _recordViews_Key_To_Details_Open.set(_recordViews[Number(id1.substring(id1.length - 1, id1.length))], false);
    }
  }
}

function toggle_record_browser(bool) {
  if (bool != null) {
    if (bool) {
      document.getElementById("record_browser_table_div").style.display = "block";
      document.getElementById("record_browser_expander_icon").innerHTML = "-";
    }
    else {
      document.getElementById("record_browser_table_div").style.display = "none";
      document.getElementById("record_browser_expander_icon").innerHTML = "+";
    }
  }
  else {
    if (document.getElementById("record_browser_table_div").style.display == "none") {
      document.getElementById("record_browser_table_div").style.display = "block";
      document.getElementById("record_browser_expander_icon").innerHTML = "-";
    }
    else {
      document.getElementById("record_browser_table_div").style.display = "none";
      document.getElementById("record_browser_expander_icon").innerHTML = "+";
    }
  }
}

function getExpandableHTML(str_array, id, char_limit, width, /*optional*/ html_string) {
  var str;
  var content_str;
  if(html_string != null)
  {
    str = html_string;
    content_str = html_string.replace(/(<([^>]+)>)/ig, ''); //Strip html tags
  }
  else
  {
    str = stringifyArrayEndChar(str_array, "<br>");
    content_str = str;
  }
  
  var result = str;
  if (content_str.length > char_limit) {
    var id_str = "expandable_html_str_" + id;
    var id_str_short = "expandable_html_str_short_" + id;
    var id_more = "expandable_html_more_" + id;
    var id_less = "expandable_html_less_" + id;
    var str_short;
    if(html_string != null)
    {
      str_short = "<div style='overflow: hidden; width: " + width + "; height: 18px; text-overflow: ellipsis; white-space: nowrap; display: block;'>" + html_string.replace("<br>", " ") + "</div>";
    }
    else
      str_short = stringifyArrayEndChar(str_array, " ").substring(0, char_limit) + "...";

    var scriptMore = "document.getElementById('" + id_str_short + "').style.display='none'; document.getElementById('" + id_str + "').style.display=''; this.style.display='none'; document.getElementById('" + id_less + "').style.display=''";
    var scriptLess = "document.getElementById('" + id_str + "').style.display='none'; document.getElementById('" + id_str_short + "').style.display=''; this.style.display='none'; document.getElementById('" + id_more + "').style.display=''";
    result = "<span id=" + id_str_short + ">" + str_short + "</span>" +
      "<span id=" + id_str + " style='display: none;'>" + str + "</span><br>" +
      "<button id=" + id_more + " onclick=\"" + scriptMore + "\" style='width: " + width + ";'>More</button>" +
      "<button id=" + id_less + " onclick=\"" + scriptLess + "\" style='width: " + width + "; display: none;'>Less</button>";
  }
  return result;
}

function removeElement(elementId) {
  // Removes an element from the document.
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

function isArrayEqual(array1, array2) {
  if (array1.length != array2.length)
    return false;
  for (var i = 0; i < array1.length; ++i)
    if (array1[i] != array2[i])
      return false;

  return true;
}

function getSortColor(index) {
  var pos = _contentSortedIndex.indexOf(index);
  var color1 = pos * (155 / _contentSortedIndex.length) + 100;
  if (_contentSortedReverse) {
    return ("rgb(255, " + color1 + "," + color1 + ")");
  }
  else {
    return ("rgb(" + color1 + "," + color1 + ", 255)");
  }
}

function recordViewIconMouseOver(id1) {
  var icon = document.getElementById("record_view_icon_" + id1);
  if (icon != null)
    document.getElementById("record_view_icon_" + id1).style.display = "";
}

function recordViewIconMouseOut(id1) {
  var icon = document.getElementById("record_view_icon_" + id1);
  if (icon != null)
    document.getElementById("record_view_icon_" + id1).style.display = "none";
}

var _record_view_page_list = [];
function addRecordView(key) {
  showSnackbar("Added to Record Views", 3000);
  _recordViews.push(key);
  _record_view_page_list.push(1);
  populateRecordViews();
  setKeyboardShortcutBar();
}

function removeRecordView(pos) {
  _recordViews.splice(pos, 1);
  _record_view_page_list.splice(pos, 1);
  populateRecordViews();
  if(_recordViews.length > 0)
  {
    if(pos == _recordViews.length)
      selectRecordView(pos - 1, true);
    else
      selectRecordView(pos, true);
  }
  setKeyboardShortcutBar();
}

//type: 0 = different, 1 = similar
function getWordCompareIndexes(str1, str2, type) {
  var str1_split = standardizeString(str1).split(" ");
  var str2_split = standardizeString(str2).split(" ");
  var noMatchIndexes = [];
  var matchIndexes = [];
  var ignoreIndexes = [];
  for (var i = 0; i < str2_split.length; ++i) {
    var str2_word = str2_split[i];
    if (_WORDS_TO_IGNORE.includes(str2_word)) {
      ignoreIndexes.push(i);
    }
    else {
      // var result = str1_standard.match(getRegexSafeSearchTerm(str2_word));
      if (str1_split.includes(str2_word))
        matchIndexes.push(i);
      else
        noMatchIndexes.push(i);
    }
  }

  var i2 = 0;
  var wordStartIndexes = [];
  var wordEndIndexes = [];
  var inWord = false;
  var str2_lower = str2.toLowerCase();
  while (i2 < str2_lower.length && str2_lower.charAt(i2) == " ")
    ++i2;
  var lastSpace = i2 - 1;
  while (i2 < str2_lower.length) {
    var str2_char = str2_lower.charAt(i2);
    if (str2_char != " " && is_standardized(str2_char))
      inWord = true;
    if (inWord && str2_char == " ") {
      inWord = false;
      wordStartIndexes.push(lastSpace + 1);
      wordEndIndexes.push(i2 - 1);
    }
    else if (inWord && i2 == str2_lower.length - 1) {
      inWord = false;
      wordStartIndexes.push(lastSpace + 1);
      wordEndIndexes.push(i2);
    }
    if (str2_char == " ")
      lastSpace = i2;
    ++i2;
  }

  var indexObj = new Object();
  indexObj.startIndexes = [];
  indexObj.endIndexes = [];

  if (type == 0) {
    for (var i = 0; i < noMatchIndexes.length; ++i) {
      indexObj.startIndexes.push(wordStartIndexes[noMatchIndexes[i]]);
      indexObj.endIndexes.push(wordEndIndexes[noMatchIndexes[i]]);
    }
  }
  else {
    for (var i = 0; i < matchIndexes.length; ++i) {
      indexObj.startIndexes.push(wordStartIndexes[matchIndexes[i]]);
      indexObj.endIndexes.push(wordEndIndexes[matchIndexes[i]]);
    }
  }
  return indexObj;
}

function setRecordViewHighlightType(type) {
  _recordViewHightlightType = type;
  populateRecordViews();
  if (type == 0)
    document.getElementById("radio_record_views_differences").checked = true;
  else if(type == 1)
    document.getElementById("radio_record_views_similarities").checked = true;
  else if(type == 2)
    document.getElementById("radio_record_views_compareall").checked = true;
}

function toggleRecordViewMemo(id1) {
  var buttonShow = document.getElementById("record_view_memo_show_" + id1);
  if (buttonShow.style.display == "none") {
    document.getElementById("record_view_memo_show_" + id1).style.display = "";
    document.getElementById("record_view_memo_hide_" + id1).style.display = "none";
  }
  else {
    document.getElementById("record_view_memo_show_" + id1).style.display = "none";
    document.getElementById("record_view_memo_hide_" + id1).style.display = "";
  }
}

//^([0-9.]+\/)(.+\/)([0-9-.]+)
//[4]
//48.20/BIRKBY/PS/747-7493
//35.36/BOOTH/PS/337-4913 


//^([0-9.]+\/)(.+)
//[3]
//111.73/CARROLL/PS/

//^([0-9.]+\/)(.+\/)([0-9-.]+)
//6.26/PFLUM/603-6455
//58.64/SCALES/521-8140
//13.70/PARRISH,STK/747-8832
//15.56/WALKER/458-201-9839 
//0.00/MARTIN/954-9144

//^(.+\/)([0-9-.]+)
//MANLEY/PS/520-4610

//^([0-9.]+\/)(.+)
//[2]
//5.57/PFLUM
//45.94/PFLUM(2),STOCK
//26.45/RESTOCK 
//41.40/BAURER/

//^(.+\/)([0-9-.]+)
//RVSALES/689-3678
//RUPE/520-2307
//KUYKENDALL/517-1498
//WHITTAKER INVEST/953.-7032

function getPDFNumberNamePhone(str1) {
  var str = String(str1);
  var regexp = /^([0-9.]+\/)(.+\/)([0-9-.]+)/;
  var result = str.match(regexp)
  if (result != null) {
    var obj = [cleanPDFNumberNamePhoneString(result[1]), cleanPDFNumberNamePhoneString(result[2]), cleanPDFNumberNamePhoneString(result[3])];
    return obj;
  }
  regexp = /^([0-9.]+\/)(.+)/;
  result = str.match(regexp)
  if (result != null) {
    var obj = [cleanPDFNumberNamePhoneString(result[1]), cleanPDFNumberNamePhoneString(result[2]), ""];
    return obj;
  }
  regexp = /^(.+\/)([0-9-.]+)/;
  result = str.match(regexp)
  if (result != null) {
    var obj = ["", cleanPDFNumberNamePhoneString(result[1]), cleanPDFNumberNamePhoneString(result[2])];
    return obj;
  }

  return null;
}

function cleanPDFNumberNamePhoneString(str) {

  //Remove multiple spaces
  var str2 = String(str).replace(/ {2,}/g, " ");

  //Remove spaces at beginning of string
  if (str2.length > 0 && str2.charAt(0) == " ")
    str2 = str2.substring(1, str2.length);

  //Remove spaces at end of string
  if (str2.length > 0 && str2.charAt(str2.length - 1) == " ")
    str2 = str2.substring(0, str2.length - 1);

  //Remove / at beginning of string
  if (str2.length > 0 && str2.charAt(0) == "/")
    str2 = str2.substring(1, str2.length);

  //Remove / at end of string
  if (str2.length > 0 && str2.charAt(str2.length - 1) == "/")
    str2 = str2.substring(0, str2.length - 1);

  return str2;
}

//|X 421 Y    436| Pick Ticket No.
//|X  26 YMAX 377| Ordered starts (Line 55), 1 line per part 
//|X  74 YMAX 377| Shipped, 1 line per part (DATE LINE 51 IS ALSO AT X 74)
//|X 124 YMAX 377| Back order, 1 line per part
//|X 203 YMAX 377| Item No./Description, variable lines per part, always 23 lines long
//|X 458 YMAX 377| Price, 1 line per part 
//|X 516 YMAX 377| Amount, 1 line per part
//|X  38 Y     62| (LAST PAGE) Subtotal
//|X 121 Y     62| (LAST PAGE) Shipping & Handling
//|X 200 Y     62| (LAST PAGE) Tax
//|X 276 Y     62| (LAST PAGE) Subtotal
//|X 355 Y     62| (LAST PAGE) Deposit
//|X 510 Y     62| (LAST PAGE) Balance Due
//|X 181 YMAX 377| U/M 1 line per part
//WLMAY address info, 7 lines
//|X 420 YMAX 377| Retail price, variable lines per part, first non-empty string is start of part section 

//Ordered, Shipped, Back Order - parse until something with letters in it or more than 1 ., divide into 3 sections
//Next 23 lines are Item No./Description
//Price, Amount - Parse two times length of Ordered array, then divide into 2 sections, parse until theres a line with letters, then next line in x.xx number format is retail price
//Retail price, use spacing to divide out Item No./Description array


//Save array of y positions from ORDERED String Positions, multiply position by numpages - (currentpage - 1)

var pageOn = 1;
var pdfOn;
var textContentArrayAll = [];
function getPdfText(url) {
  document.getElementById("wlmay_pdf_name").innerHTML = $("#import_wlmay_pdf_input").get(0).files[0].name;
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function (pdf) {
    // console.log('PDF loaded ' + pdf.numPages);
    pageOn = 1;
    pdfOn = pdf;
    textContentArrayAll = [];
    processPage();
  });
}

function processPage() {
  if (pageOn <= pdfOn.numPages) {
    pdfOn.getPage(pageOn).then(function (page) {
      page.getTextContent().then(function (textContent) {
        var textContentArray = textContent.items;
        textContentArray.sort(COMPARE_PDF_TEXT_POSITIONS);
        for (var i = 0; i < textContentArray.length; ++i) //Multiply heights to be higher at top of page
        {
          textContentArray[i].adjustedHeight = Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) + (10000 * (pdfOn.numPages - pageOn));
          // console.log("X " + textContentArray[i].transform[PDF_TRANSFORM_X] + "| Y " + textContentArray[i].adjustedHeight + "|" + textContentArray[i].str);
        }
        textContentArrayAll = textContentArrayAll.concat(textContentArray);

        if (pageOn == 1) //First Page
        {
          //Invoice NO. 523 715
          //Invoice Date. 530 693
          //Customer Purchase Order No. 43 471
          setPDFTableValue(findPDFTextContentIndexByPosition(523, 715, textContentArray, null, null), textContentArray, "wlmay_pdf_invoice_no_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(530, 693, textContentArray, null, null), textContentArray, "wlmay_pdf_invoice_date_input");
          setPDFTableValue(findPDFTextContentIndexByPosition( 43, 471, textContentArray, null, null), textContentArray, "wlmay_pdf_customer_po_no_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(421, 436, textContentArray, null, null), textContentArray, "wlmay_pdf_pick_ticket_input");
        }

        if (pageOn == pdfOn.numPages) //Last Page
        {
          setPDFTableValue(findPDFTextContentIndexByPosition( 38, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_subtotal0_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(121, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_s&h_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(200, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_tax_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(276, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_subtotal1_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(355, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_deposit_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(510, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_balancedue_input");

          var ORDERED_Indexes = findPDFTextContentIndexByPosition(26, null, textContentArrayAll, 377, null);
          var SHIPPED_Indexes = findPDFTextContentIndexByPosition(74, null, textContentArrayAll, 377, null);
          var BACKORDERED_Indexes = findPDFTextContentIndexByPosition(124, null, textContentArrayAll, 377, null);
          var ITEMDESC_Indexes = findPDFTextContentIndexByPosition(203, null, textContentArrayAll, 377, null);
          var RETAILPRICE_Indexes = findPDFTextContentIndexByPosition(420, null, textContentArrayAll, 377, null);
          var PRICE_Indexes = findPDFTextContentIndexByPosition(458, null, textContentArrayAll, 377, null);
          var AMOUNT_Indexes = findPDFTextContentIndexByPosition(516, null, textContentArrayAll, 377, null);
          var tableHTML = "<table id='wlmay_pdf_parts_table'><tr><th></th><th>Ordered</th><th>Shipped</th><th>Back Ordered</th><th>Item NO./Description</th><th>Retail Price</th><th>Price</th><th>Amount</th></tr>";
          var current_ITEMDESC_Index = 0;
          var columnRowIndexes = [0, 0, 0]; //RETAILPRICE, PRICE, AMOUNT
          for (var i = 0; i < ORDERED_Indexes.length; ++i) {
            tableHTML += "<tr id='table_pdfimport_row_" + i + "' style='vertical-align: top;'>";
            tableHTML += "<td><button style='background-color: #70A2FF; color: black; height: 100px;' id='startAddToDatabaseButton_" + i + "' onclick='generatePDFAddToDatabaseTable(" + i + ");'><span style='color: white;'>A</span>dd to Database</button></td>"
            tableHTML += "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[ORDERED_Indexes[i]].str)) + "'     id='pdf_ordered_" + i + "'></td>";
            tableHTML += "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[SHIPPED_Indexes[i]].str)) + "'     id='pdf_shipped_" + i + "'></td>";
            tableHTML += "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[BACKORDERED_Indexes[i]].str)) + "' id='pdf_backordered_" + i + "'></td>";

            var nextORDEREDHeight = -1;
            if (i < ORDERED_Indexes.length - 1) //Not on last part
            {
              nextORDEREDHeight = textContentArrayAll[ORDERED_Indexes[i + 1]].adjustedHeight;
            }
            tableHTML += "<td><textarea id='pdf_description_" + i + "' onfocus='deselectTable();' style='width: 500px; height: 90px;'>";
            var numberNamePhone = null;
            while (current_ITEMDESC_Index < ITEMDESC_Indexes.length && textContentArrayAll[ITEMDESC_Indexes[current_ITEMDESC_Index]].adjustedHeight > nextORDEREDHeight) {
              var str = removeExtraSpaces(textContentArrayAll[ITEMDESC_Indexes[current_ITEMDESC_Index]].str);
              if (str != "") 
              {
                var numberNamePhoneTemp = getPDFNumberNamePhone(str);
                if (numberNamePhoneTemp != null)
                  numberNamePhone = numberNamePhoneTemp;
                tableHTML += getHTMLSafeText(removeExtraSpaces(textContentArrayAll[ITEMDESC_Indexes[current_ITEMDESC_Index]].str)) + "\n";
              }
              ++current_ITEMDESC_Index;
            }
            if (tableHTML.charAt(tableHTML.length - 1) == "\n")
              tableHTML = tableHTML.substring(0, tableHTML.length - 1);
            tableHTML += "</textarea>";
            if (numberNamePhone != null) {
              tableHTML += "<table><tr><th>Dealer Price</th><th>Name</th><th>Phone</th></tr>"
                + "<tr>"
                + "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[0]) + "' id='pdf_dealerprice_" + i + "'></td>"
                + "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[1]) + "' id='pdf_customername_" + i + "'></td>"
                + "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[2]) + "' id='pdf_customerphone_" + i + "'></td>"
                + "</tr></table>";
            }
            tableHTML += "</td>";

            tableHTML += getPDFInputHTML(columnRowIndexes, 0, RETAILPRICE_Indexes, nextORDEREDHeight, "pdf_retailprice_" + i);
            tableHTML += getPDFInputHTML(columnRowIndexes, 1, PRICE_Indexes, nextORDEREDHeight, "pdf_yourprice_" + i);
            tableHTML += getPDFInputHTML(columnRowIndexes, 2, AMOUNT_Indexes, nextORDEREDHeight, "pdf_totalamount_" + i);

            tableHTML += "</tr><tr><td id='pdf_add_to_database_table_" + i + "' colspan=8></td></tr>";
          }
          tableHTML += "</table>";
          document.getElementById("wlmay_pdf_parts_table_div").innerHTML = tableHTML;
          var ele = document.getElementById("wlmay_pdf_invoice_no_input");
          if(ele != null && ele.style.display != "none")
          {
            ele.focus();
            ele.select();
          }
          setKeyboardShortcutBar();
          set_tablePDFImport_SelectedRow(0);
        }
        else {
          ++pageOn;
          processPage();
        }
      });
    });
  }
}

function getPDFInputHTML(columnRowIndexes, index, CONTENTIndexes, nextORDEREDHeight, id) {
  var tableHTML = "<td>";
  while (columnRowIndexes[index] < CONTENTIndexes.length && textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].adjustedHeight > nextORDEREDHeight) {
    var str = removeExtraSpaces(textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].str);
    if (str != "")
      tableHTML += "<input type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].str)) + "' onfocus='deselectTable();' id='" + id + "'>";
    ++columnRowIndexes[index];
  }
  tableHTML += "</td>";
  return tableHTML;
}

function setPDFTableValue(index, textcontentArray, id1) {
  if (index != null)
    document.getElementById(id1).value = removeExtraSpaces(textcontentArray[index].str);
  else
    document.getElementById(id1).value = "";
}

// function sortPDFTextContentIndexes(textContentArray, indexes)
// {
//   var arrayToSort = [];
//   for(var i = 0; i < indexes.length; ++i)
//   {
//     arrayToSort.push([indexes[i], textContentArray[indexes[i]].transform[PDF_TRANSFORM_Y]]);
//   }
//   arrayToSort.sort(COMPARE_PDF_TEXT_POSITIONS);
//   var returnArray = [];
//   for(var i = 0; i < arrayToSort.length; ++i)
//   {
//     returnArray.push(arrayToSort[i][0]);
//   }
//   return returnArray;
// }

function COMPARE_PDF_TEXT_POSITIONS(a, b) {
  if (Number(a.transform[PDF_TRANSFORM_Y]) < Number(b.transform[PDF_TRANSFORM_Y])) {
    return 1;
  }
  if (Number(a.transform[PDF_TRANSFORM_Y]) > Number(b.transform[PDF_TRANSFORM_Y])) {
    return -1;
  }
  return 0;
}

var PDF_TRANSFORM_Y = 5;
var PDF_TRANSFORM_X = 4;
function findPDFTextContentIndexByPosition(px, py, textContentArray, YMaximum, YMinimum) {
  if (YMaximum != null && YMinimum != null) {
    var indexArray = [];
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) <= Number(YMaximum)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) >= Number(YMinimum))
        indexArray.push(i);
    return indexArray;
  }
  else if (YMaximum != null) {
    var indexArray = [];
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) <= Number(YMaximum))
        indexArray.push(i);
    return indexArray;
  }
  else if (YMinimum != null) {
    var indexArray = [];
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) >= Number(YMinimum))
        indexArray.push(i);
    return indexArray;
  }
  else {
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px) && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) == Number(py))
        return i;
    return null;
  }
}

function deleteFromDatabase(key, addChangeAlert, is_content, is_content_extra, content_extra_db) {
  var ref = firebase.database().ref(key);
  ref.remove();
  if (addChangeAlert) {
    addNewChangeAlert(key, true, is_content, is_content_extra, content_extra_db);
  }
}

function writeToDatabase(key_path, value, addChangeAlert, is_content, is_content_extra, content_extra_db) {
  var ref = firebase.database().ref(key_path);
  ref.set(value);
  if (addChangeAlert) {
    addNewChangeAlert(key_path, false, is_content, is_content_extra, content_extra_db);
  }
}

function getDatabaseRef(key) {
  return firebase.database().ref(key);
}

var MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
function addNewChangeAlert(key, deleted, is_content, is_content_extra, content_extra_db) {
  var changeAlertsRef = firebase.database().ref("change_alerts");
  changeAlertsRef.once('value', function (snapshot) {
    var numChildren = snapshot.numChildren();
    var i = 0;
    var obj = new Object();
    obj.key = key;
    obj.time = new Date().getTime();
    obj.deleted = deleted;
    obj.is_content = is_content;
    obj.is_content_extra = is_content_extra;
    obj.content_extra_db = content_extra_db;
    var ref2 = firebase.database().ref("change_alerts").push();
    if (numChildren == 0) {
      ref2.set(obj);
    }
    else {
      snapshot.forEach(function (childSnapshot) {
        ++i;
        if (childSnapshot.val().key == key)
          firebase.database().ref("change_alerts/" + childSnapshot.key).remove();

        if (i == numChildren) {
          ref2.set(obj);
        }
      });
    }
  });
}

var _CHANGE_ALERTS_CACHE = [];
function loadChangeAlerts() {
  var ref = firebase.database().ref("change_alerts");
  ref.on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var alertOBJ = childSnapshot.val();
      var isCached = doesChangeAlertsCacheContainMatch(alertOBJ);
      if(!isCached)
      {
        _CHANGE_ALERTS_CACHE.push(alertOBJ);
        if (alertOBJ.is_content) {
          reloadContentFromChangeAlert(alertOBJ);
          showSnackbar("Loading new changes for P&A_PRI...", 3000);
        }
        else if (alertOBJ.is_content_extra) {
          reloadContentExtraFromChangeAlert(alertOBJ);
          showSnackbar("Loading new changes for Part Child Data...", 3000);
        }
      }
      var timeElapsed = new Date().getTime() - Number(alertOBJ.time);
      if (timeElapsed >= MILLIS_IN_DAY) //Delete alert if older than a day
        firebase.database().ref("change_alerts/" + childSnapshot.key).remove();
    });
  });
}

function doesChangeAlertsCacheContainMatch(changeAlert)
{
  var duplicateAlert_IndexesToRemove = [];
  for(var i = 0; i < _CHANGE_ALERTS_CACHE.length; ++i)
  {
    var matchFound = true;
    var cacheobj = _CHANGE_ALERTS_CACHE[i];
    if(matchFound && changeAlert.content_extra_db != cacheobj.content_extra_db)
      matchFound = false;
    if(matchFound && changeAlert.deleted != cacheobj.deleted)
      matchFound = false;
    if(matchFound && changeAlert.is_content != cacheobj.is_content)
      matchFound = false;
    if(matchFound && changeAlert.is_content_extra != cacheobj.is_content_extra)
      matchFound = false;
    if(matchFound && changeAlert.key != cacheobj.key)
      matchFound = false;
    if(matchFound && changeAlert.time != cacheobj.time)
    {
      duplicateAlert_IndexesToRemove.push(i);
      matchFound = false;
    }
    if(matchFound)
    {
      removeIndexesFromArray(_CHANGE_ALERTS_CACHE, duplicateAlert_IndexesToRemove);
      return true;
    }
  }
  removeIndexesFromArray(_CHANGE_ALERTS_CACHE, duplicateAlert_IndexesToRemove);
  return false;
}

function reloadContentFromChangeAlert(alertOBJ) {
  var partref = firebase.database().ref(alertOBJ.key);
  partref.once('value', function (snapshot) {
    var rownum = getContentIndexFrom_DB_ID(snapshot.key);
    if (rownum != null) //Edit Record
    {
      if (alertOBJ.deleted) //Delete Record
      {
        _content.splice(rownum, 1);
        _content_standard.splice(rownum, 1);
        populateRecordBrowser(_currentRecordBrowserStartIndex, false);
        setLargestRecordNumbers();
      }
      else //Edit Record
      {
        var content_line = [];
        for (var i = 0; i < _INDEXES.length; ++i)
          content_line.push(String(snapshot.child(_INDEXES[i]).val()));
        for (var i = 0; i < _MEMO_INDEXES.length; ++i) {
          var memolines = snapshot.child(_MEMO_INDEXES[i]).val();
          for (var j = 0; j < memolines.length; ++j)
            memolines[j] = String(memolines[j]);
          content_line.push(memolines);
        }
        for (var i = 0; i < content_line.length; ++i)
          _content[rownum][i] = content_line[i];
        generateContent_Standard_Row(rownum);
      }
      populateRecordBrowser(_currentRecordBrowserStartIndex, false);
      populateRecordViews();
    }
    else if (!alertOBJ.deleted)//New Record
    {
      var content_line = [];
      for (var i = 0; i < _INDEXES.length; ++i)
        content_line.push(String(snapshot.child(_INDEXES[i]).val()));
      for (var i = 0; i < _MEMO_INDEXES.length; ++i) {
        var memolines = snapshot.child(_MEMO_INDEXES[i]).val();
        for (var j = 0; j < memolines.length; ++j)
          memolines[j] = String(memolines[j]);
        content_line.push(memolines);
      }
      content_line.push(partref.key);
      _content.push(content_line);
      generateContent_Standard_New();
    }
  });
}

function reloadContentExtraFromChangeAlert(alertOBJ) {
  var partref = firebase.database().ref(alertOBJ.key);
  partref.once('value', function (snapshot) {
    var rownum = getContentExtraIndexFrom_DB_ID(snapshot.key, alertOBJ.content_extra_db);
    if (rownum != null) {
      if (alertOBJ.deleted) //Delete Record
      {
        _content_extra[alertOBJ.content_extra_db].splice(rownum, 1);
      }
      else //Edit Record
      {
        _content_extra[alertOBJ.content_extra_db][rownum][0] = snapshot.val();
      }
    }
    else if (!alertOBJ.deleted) //New record
    {
      var arr = [snapshot.val(), partref.key];
      _content_extra[alertOBJ.content_extra_db].push(arr);
    }
    populateRecordViews();

    _CHILD_PART_LINKS_CACHE = [];
  });
}

function startEditRecordPartReference(i1, j1) {
  var selldiv = document.getElementById("sell_div_" + i1 + "_" + j1);
  if(selldiv != null)
    document.getElementById("sell_div_" + i1 + "_" + j1).style.display = "none";
  hideRecordViewEditAndSellIcons();
  var ele = document.getElementById("record_view_partnum_input_" + i1 + "_" + j1);
  if(ele != null)
  {
    ele.style.display = "block";
    ele.focus();
    ele.select();
  }
  document.getElementById("record_view_partnum_cancel_button_" + i1 + "_" + j1).style.display = "block";
  document.getElementById("record_view_partnum_save_button_" + i1 + "_" + j1).style.display = "block";
  var text = document.getElementById("record_view_partnum_text_" + i1 + "_" + j1);
  if (text != null)
    text.style.display = "none";
}

function saveEditRecordPartReference(i1, j1) {
  // console.log("|" + document.getElementById("record_view_partnum_input_" + i1 + "_" + j1).value + "|parts_db/P&A_PRI/" + _recordViews[i1] + "/" + EXTRA_DB_ACTUAL_INDEXES[j1]);
  var rownum = getContentIndexFrom_DB_ID(_recordViews[i1]);
  var value = document.getElementById("record_view_partnum_input_" + i1 + "_" + j1).value;
  if (rownum != null) {
    edit_content(rownum, _EXTRA_DB_ACTUAL_INDEXES[j1], value);
  }
  var key = "parts_db/P&A_PRI/" + _recordViews[i1];
  var row = _content[rownum];
  var partObj = new Object();
  for (var i = 0; i < _INDEXES.length; ++i)
    partObj[_INDEXES[i]] = row[i];
  for (var i = 0; i < _MEMO_INDEXES.length; ++i)
    partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
  populateRecordViews();
  if(!_LOCAL_MODE)
    writeToDatabase(key, partObj, true, true, false, null);
}

function edit_content(rownum, field, value) {
  var index = INDEXES_CONCAT.indexOf(field);
  _content[rownum][index] = value;
  generateContent_Standard_Row(rownum);
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  populateRecordViews();
}

function saveContentExtraToDatabase(i, j)
{
  var extraobj = _content_extra[i][j][0];
  if(!_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[i] + "/" + _content_extra[i][j][1], extraobj, true, false, true, i);
  _CHILD_PART_LINKS_CACHE = [];
}

function saveEditPartChild()
{
  var extraobj = _content_extra[_selected_child_part_db][_selected_child_part_record][0];
  var newObj = new Object();
  for (let [key, value] of Object.entries(extraobj)) 
  {
    newObj[key] = document.getElementById("partchild_edit_input_" + key).value;
  }
  _content_extra[_selected_child_part_db][_selected_child_part_record][0] = newObj;
  if(!_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[_selected_child_part_db] + "/" + _content_extra[_selected_child_part_db][_selected_child_part_record][1], newObj, true, false, true, _selected_child_part_db);
  _selected_child_part_db = null;
  _selected_child_part_record = null;
  populateChildPartRecordManager();
  populateRecordViews();

  _CHILD_PART_LINKS_CACHE = [];
}

function cancelEditPartChild()
{
  _selected_child_part_db = null;
  _selected_child_part_record = null;
  populateChildPartRecordManager();
}

function startDeleteEditPartChild() {
  document.getElementById("partchild_edit_button_save").style.display = "none";
  document.getElementById("partchild_edit_button_cancel").style.display = "none";
  document.getElementById("partchild_edit_button_delete").style.display = "none";
  document.getElementById("partchild_edit_button_confirm_delete").style.display = "";
  document.getElementById("partchild_edit_button_cancel_delete").style.display = "";
}

function confirmDeleteEditPartChild() 
{
  if(!_LOCAL_MODE)
    deleteFromDatabase("parts_db/" + _EXTRA_DB[_selected_child_part_db] + "/" + _content_extra[_selected_child_part_db][_selected_child_part_record][1], true, false, true, _selected_child_part_db);
  _content_extra[_selected_child_part_db].splice(_selected_child_part_record, 1);
  _selected_child_part_db = null;
  _selected_child_part_record = null;
  populateChildPartRecordManager();
  populateRecordViews();

  _CHILD_PART_LINKS_CACHE = [];
}

function cancelNewPartChild()
{
  document.getElementById("part_child_button_new").style.display = "";
  document.getElementById("part_child_new_table_div").innerHTML = "";
}

function setNewPartChildButton()
{
  var db_index =  document.getElementById("part_child_dropdown_select").selectedIndex;
  if(db_index < _EXTRA_DB.length)
  {
    document.getElementById("part_child_button_new").innerHTML = "<span style='color: white;'>A</span>dd New Child Record in " + _EXTRA_DB[db_index] + " +";
    document.getElementById("part_child_button_new").style.display = "";
  }
  else
    document.getElementById("part_child_button_new").style.display = "none";

}

function saveNewPartChild()
{
  var db_index =  document.getElementById("part_child_dropdown_select").selectedIndex;
  var newObj = new Object();
  for (var i = 0; i < _EXTRA_DB_FIELDS[db_index].length; ++i) 
  {
    newObj[_EXTRA_DB_FIELDS[db_index][i]] = document.getElementById("partchild_new_input_" + _EXTRA_DB_FIELDS[db_index][i]).value;
  }
  var newRef = getDatabaseRef("parts_db/" + _EXTRA_DB[db_index]).push();
  _content_extra[db_index].push([newObj, newRef.key])
  if(!_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[db_index] + "/" + newRef.key, newObj, true, false, true, db_index);
  
  document.getElementById("part_child_button_new").style.display = "";
  document.getElementById("part_child_new_table_div").innerHTML = "";
  populateRecordViews();

  _CHILD_PART_LINKS_CACHE = [];
}

var TAB_DIVS = ["TAB_search", "TAB_record_views", "TAB_record_browser", "TAB_part_child_record_manager", "TAB_sort_order", "TAB_fileinput", "TAB_reorders", "TAB_invoice_history", "TAB_invoice_settings", "TAB_invoice", "TAB_mainmenu", "TAB_search_results", "TAB_add_invoice"];
var TAB_SEARCH = 0;
var TAB_RECORD_VIEWS = 1;
var TAB_RECORD_BROWSER = 2;
var TAB_PART_CHILD_RECORD_MANAGER = 3;
var TAB_SORT_ORDERS = 4;
var TAB_PDF_IMPORT = 5;
var TAB_REORDERS = 6;
var TAB_INVOICE_HISTORY = 7;
var TAB_INVOICE_SETTINGS = 8;
var TAB_INVOICE = 9;
var TAB_MAINMENU = 10;
var TAB_SEARCH_RESULTS = 11;
var TAB_ADD_INVOICE = 12;

var _selected_tab = 0;
var last_selected_tab = 0;

function setTab(num)
{
  deselectTable();
  shortcutmenu_mainmenu_available = (num == TAB_MAINMENU);
  last_selected_tab = _selected_tab;
  _selected_tab = num;
  for(var i = 0; i < TAB_DIVS.length; ++i)
  {
    document.getElementById(TAB_DIVS[i] + "_div").style.display = "none";
    document.getElementById(TAB_DIVS[i]         ).style.borderBottomColor = "#70A2FF";
    document.getElementById(TAB_DIVS[i]).style.fontWeight = "";
  }

  document.getElementById(TAB_DIVS[num] + "_div").style.display = "";
  document.getElementById(TAB_DIVS[num]).style.borderBottomColor = "transparent";
  document.getElementById(TAB_DIVS[num]).style.fontWeight = "700";

  if(num == TAB_SEARCH)
  {
    var ele = document.getElementById("search_input_" + _INDEX_ORDER[0]);
    if(ele != null && document.getElementById("radio_columns_div").style.display != "none")
    {
      ele.focus();
      ele.select();    
    }
  }

  if(num == TAB_SEARCH_RESULTS)
  {
    var cell = getCell(0, _selectedCell, _TABLE_SEARCH_RESULTS);
    if(cell != null)
    {
      onCellClick(0, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
    }
  }
  if(num == TAB_RECORD_VIEWS)
    populateRecordViews();
  if(num == TAB_RECORD_BROWSER)
  {
    populateRecordBrowser(_currentRecordBrowserStartIndex, _highlightgreen_requested);
    _highlightgreen_requested = false;
    var cell = getCell(_currentRecordBrowserStartIndex, _selectedCell, _TABLE_RECORD_BROWSER);
    if(cell != null)
      onCellClick(_currentRecordBrowserStartIndex, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
  }

  if(num == TAB_INVOICE)
  {
    document.getElementById("non_invoice_content").style.display = "none";
    document.getElementById("exit_invoice_button").style.display = "block";
    document.getElementById("invoice_content").style.display = "";
    populateInvoice();

    var ele = document.getElementById("invoice_input_invoice_no");
    if(ele != null && ele.style.display != "none")
    {
      ele.focus();
    }
  }
  else if(num == TAB_ADD_INVOICE)
  {
    populateAddNewInvoice();
    var ele = document.getElementById("invoice_input_invoice_no");
    if(ele != null && ele.style.display != "none")
    {
      ele.focus();
    }
  }
  else{
    document.getElementById("non_invoice_content").style.display = "";
    document.getElementById("exit_invoice_button").style.display = "none";
    document.getElementById("exit_invoice_from_new_button").style.display = "none";
    document.getElementById("invoice_content").style.display = "none";
    document.getElementById("add_invoice_content").style.display = "none";
    clearInvoicesContent();
  }

  document.getElementById("invoice_from_history_content").style.display = "none";

  if(num == TAB_REORDERS)
  {
    updateReorderParentIDs();
  }

  if(num == TAB_INVOICE_HISTORY)
    populateInvoiceHistory();

  if(num == TAB_INVOICE_SETTINGS)
  {
    var ele = document.getElementById("invoice_address_textarea");
    if(ele != null && ele.style.display != "none")
    {
      ele.focus();
    }
  }

  if(num != TAB_INVOICE_SETTINGS && num != TAB_INVOICE && num != TAB_ADD_INVOICE && num != TAB_SEARCH)
  {
    document.activeElement.blur();
  }
  setKeyboardShortcutBar();
}

function selectRecordView(num, scrollIntoView)
{
  if(scrollIntoView == null)
    scrollIntoView = false;
  if(scrollIntoView)
  {
    var ele = document.getElementById("record_view_" + num);
    if(ele != null)
      ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
  if(_recordViews.length > num && _selected_record_view >= 0)
  {
    _selected_record_view = num;
    _last_selected_record_view = num;
    for(var i = 0; i < _recordViews.length; ++i)
    {
      document.getElementById("record_view_" + i).style.backgroundColor = "";
    }
    if(num >= 0)
      document.getElementById("record_view_" + num).style.backgroundColor = "lightblue";
  }
}

function doesObjectArraySpecificIndexIncludeX(array, values, indexes)
{
  for(var i = 0; i < array.length; ++i)
  {
    var match = true;
    for(var j = 0; j < values.length; ++j)
    {
      if(array[i][indexes[j]] != values[j])
        match = false;
    }
    if(match)
      return true;
  }
  return false;
}

function cancelPDFAddToDatabase(index)
{
  document.getElementById("pdf_add_to_database_table_" + index).innerHTML = "";
  setPDFAddToDatabaseButtons(true);
}

function get_plus_minus_usd_string(num)
{
  if(num >= 0)
    num = "+" + num.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
  else
    num = num.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
  return num;
}

var newREGs = new Map();
var newSPLs = new Map();
var newSHOP_QTYs = new Map();
var newPNs = new Map();
var newDESCRIP1s = new Map();
var extraDBs_PDF = new Map();
var extraDBLinks_PDF = new Map();
function confirmPDFAddToDatabase(index)
{
  var extradb = extraDBs_PDF.get(index);
  var link = extraDBLinks_PDF.get(index);
  var partObj = _content_extra[extradb][link][0];
  partObj.REG = newREGs.get(index);
  partObj.SPL = newSPLs.get(index);
  partObj.SHOP_QTY = newSHOP_QTYs.get(index);
  document.getElementById("pdf_add_to_database_table_" + index).innerHTML = "";
  document.getElementById("startAddToDatabaseButton_" + index).innerHTML = "Added";
  document.getElementById("startAddToDatabaseButton_" + index).disabled = true;
  document.getElementById("startAddToDatabaseButton_" + index).className = "button_disabled";
  if(!_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[extradb] + "/" + _content_extra[extradb][link][1], partObj, true, false, true, extradb);

  // var parent_indexes = getParentRecordIndexesWithChildPart(extradb, link);
  // for(var i = 0; i < parent_indexes.length; ++i)
  // {
  //   console.log("Updating " + parent_indexes[i]);
  //   updateReorder(parent_indexes[i]);
  // }
  setPDFAddToDatabaseButtons(true);
  showSnackbar("Updated child part " + partObj.PN, 5000);
}

function startPDFNewChildRecord(index)
{
  document.getElementById("part_child_dropdown_select").selectedIndex = document.getElementById("pdf_new_partchild_select_" + index).selectedIndex;
  setNewPartChildButton();
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  startNewPartChild();
  document.getElementById("partchild_new_input_REG").value = newREGs.get(index);
  document.getElementById("partchild_new_input_SPL").value = newSPLs.get(index);
  document.getElementById("partchild_new_input_SHOP_QTY").value = newSHOP_QTYs.get(index);
  document.getElementById("partchild_new_input_DESCRIP1").value = newDESCRIP1s.get(index);
  document.getElementById("partchild_new_input_PN").value = newPNs.get(index);
}

function jumpToChildPartFromRecordView(extradb, index)
{
  document.getElementById("part_child_dropdown_select").selectedIndex = extradb;
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  _selected_child_part_db = extradb;
  _selected_child_part_record = index;
  populateChildPartRecordManager();
  clearPartChildEditAutocomplete();
  setNewPartChildButton();
  if(_content_extra[extradb].length > _selected_child_part_record)
    document.getElementById("part_child_edit_input").value = _content_extra[extradb][_selected_child_part_record][0].PN;
}

function searchChildPart(extradb, searchterm)
{
  document.getElementById("part_child_dropdown_select").selectedIndex = extradb;
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  var ele = document.getElementById("part_child_edit_input");
  ele.value = removeEndSemicolon(searchterm);
  ele.focus();
  onPartChildEditFocus();
  showPartChildEditAutocomplete();
  cancelEditPartChild();
}

function saveInvoiceInfoToDatabase()
{
  var address = document.getElementById("invoice_address_textarea").value;
  var bottom =  document.getElementById("invoice_bottom_textarea").value;
  var lastorderno =  document.getElementById("invoice_last_invoice_no_input").value;

  writeToDatabase("invoice/address", address, false, false, false, null);
  writeToDatabase("invoice/bottom", bottom, false, false, false, null);
  writeToDatabase("invoice/last_invoice_no", lastorderno, false, false, false, null);
  document.getElementById("invoice_info_button_save").style.display = "none";
}

function onInvoiceInfoChange()
{
  document.getElementById("invoice_info_button_save").style.display = "block";
}

function startSell(i1, j1)
{
  hideRecordViewEditAndSellIcons();
  document.getElementById("sell_form_" + i1 + "_" + j1).style.display = "";
  document.getElementById("sell_quantity_" + i1 + "_" + j1).focus();
}

function changeSellQuantity(i1, j1, amount)
{
  var currentval = Number(document.getElementById("sell_quantity_" + i1 + "_" + j1).value);
  document.getElementById("sell_quantity_" + i1 + "_" + j1).value = currentval + Number(amount);
}

var _invoice_objs = [];
function confirmSell(i1, j1, _content_partnum_for_extraDB, _parent_record_id)
{
  var extraDBIndex = getExtraDBLinkIndex(j1, _content_partnum_for_extraDB);
  var parentRecordIndex = getParentIndexFromID(_parent_record_id);
  var parentRecordData = _content[parentRecordIndex];
  if(extraDBIndex != null)
  {
    var partObj = _content_extra[j1][extraDBIndex][0];
    var currentAmount = Number(partObj.SHOP_QTY);
    var amountToSell = Number(document.getElementById("sell_quantity_" + i1 + "_" + j1).value);
    if(currentAmount > amountToSell)
      partObj.SHOP_QTY = currentAmount - amountToSell;
    else
      partObj.SHOP_QTY = 0;
    var partkey = _content_extra[j1][extraDBIndex][1];
    if(!_LOCAL_MODE)
    {
      writeToDatabase("parts_db/" + _EXTRA_DB[j1] + "/" + partkey, partObj, true, false, true, j1);
    }
    var invoice_obj = new Object();
    invoice_obj.amountToSell = amountToSell;
    invoice_obj.DESCRIP1 = parentRecordData[_DESCRIP1];
    invoice_obj.SELL = partObj.SELL;
    invoice_obj.extradb = j1;
    invoice_obj.partkey = partkey;
    invoice_obj.PN = partObj.PN;
    invoice_obj.equip_type = parentRecordData[_EQUIP_TYPE];
    invoice_obj.mfr = getExtraDBPartManufacturer(j1, extraDBIndex);
    invoice_obj.equip_design = parentRecordData[_EQUIP_DESIGN];
    invoice_obj.parent_record_id = _parent_record_id;
    _invoice_objs.push(invoice_obj);
    showSnackbar("Added to Invoice<br>Removed <u>" + amountToSell + "</u> " + partObj.PN + " from Inventory", 5000);
    updateReorder(parentRecordIndex);
  }
  populateRecordViews();
}

var _snackbar_times_shown = 0;
function showSnackbar(message, time_to_show)
{
  var x = document.getElementById("snackbar");
  x.style.display = "";
  x.innerHTML = message;
  if(x.className != "hide")
    if(x.className == "refresh1")
      x.className = "refresh2";
    else
      x.className = "refresh1";
  else
    x.className = "show";
  ++_snackbar_times_shown;

  setTimeout(function(){ 
    --_snackbar_times_shown;
    if(_snackbar_times_shown == 0)
    {
      x.className = "hide"; 

      setTimeout(function(){ 
        x.style.display = "none";
      }, 500);

    }
  }, time_to_show);

}

function calculateInvoiceAmounts()
{
  var numTotalRows = _invoice_objs.length;
  var total = 0;
  for(var i = 0; i < numTotalRows; ++i)
  {
    _invoice_objs[i].SELL = document.getElementById("invoice_input_sell_" + i).value;
    var amount = Number(document.getElementById("invoice_input_qty_" + i).value) * Number(document.getElementById("invoice_input_sell_" + i).value);
    total += amount;
    document.getElementById("invoice_input_amount_" + i).value = amount.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
  }
  var ele = document.getElementById("invoice_input_total");
  if(ele != null) //If Invoice has parts in it, and in turn is generating HTML
    document.getElementById("invoice_input_total").value = total.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
}

function calculateAddInvoiceAmounts()
{
  var table = document.getElementById("table_invoice_parts");
  var numTotalRows = table.rows.length - 4;
  var total = 0;
  for(var i = 0; i < numTotalRows; ++i)
  {
    var qty = Number(table.rows[i + 1].cells[0].children[0].value);
    var price = Number(table.rows[i + 1].cells[2].children[0].value);
    var amount = qty * price;
    total += amount;
    table.rows[i + 1].cells[3].children[0].value = amount.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
  }
  var ele = document.getElementById("invoice_input_total");
  if(ele != null) //If Invoice has parts in it, and in turn is generating HTML
    document.getElementById("invoice_input_total").value = total.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
}

function removeFromInvoice(index)
{
  var invoice_obj = _invoice_objs[index];
  var link = getContentExtraIndexFrom_DB_ID(invoice_obj.partkey, invoice_obj.extradb);
  if(link != null){
    var content_obj = _content_extra[invoice_obj.extradb][link][0];
    var newAmount = Number(content_obj.SHOP_QTY) + Number(invoice_obj.amountToSell);
    content_obj.SHOP_QTY = newAmount;
    if(!_LOCAL_MODE)
    {
      writeToDatabase("parts_db/" + _EXTRA_DB[invoice_obj.extradb] + "/" + invoice_obj.partkey, content_obj, true, false, true, invoice_obj.extradb);
    }
    showSnackbar("Added <u>" + invoice_obj.amountToSell + "</u> " + content_obj.PN + " back into inventory", 3000);

    var parentRecordIndex = getParentIndexFromID(invoice_obj.parent_record_id);
    if(parentRecordIndex != null)
      updateReorder(parentRecordIndex);
  }
  else
  {
    window.alert("Couldn't find part in database! Failed to add quantity back into inventory!");
  }
  _invoice_objs.splice(index, 1);
  populateInvoice();
  calculateInvoiceAmounts();
}

function printClick(){
  window.print();
  return false;
}

function finishInvoiceSale()
{
  saveInvoiceToObject();
  _invoice_objs = [];
  populateInvoice();
  setTab(TAB_MAINMENU);
  writeToDatabase("invoice/last_invoice_no", Number(document.getElementById("invoice_last_invoice_no_input").value) + 1, false, false, false, null);

  var invoiceDataListRef = getDatabaseRef('invoice_data');
  var newInvoiceRef = invoiceDataListRef.push();
  _invoice_data.bottom = null;
  writeToDatabase('invoice_data/' + newInvoiceRef.key, _invoice_data, false, false, false, null);
  _invoice_data = new Object();
  showSnackbar("Sale Finished!", 3000);
}

// function deleteObject(object)
// {
//   for (var member in object) delete object[member];
// }

function updateReordFromRecordView(parentRecordID)
{
  var rownum = getParentIndexFromID(parentRecordID);
  if(rownum != null)
  {
    updateReorder(rownum);
  }
  populateRecordViews();
}

function getParentRecordIndexesWithChildPart(extraDB_index, pn_index)
{
  var parentRecordRowNums = [];
  for(var i = 0; i < _content.length; ++i)
  {
    var parent_to_part_index = getExtraDBLinkIndex(extraDB_index, _content[i][_CONTENT_EXTRA_DB_INDEXES[extraDB_index]]);
    if(parent_to_part_index == pn_index)
      parentRecordRowNums.push(i);
  }
  return parentRecordRowNums;
}

var _invoice_data = new Object();
function saveInvoiceToObject()
{
  var ele;
  ele = document.getElementById("invoice_input_customer_order_no");
  if(ele != null)
    _invoice_data.customer_order_no = ele.value;
  ele = document.getElementById("invoice_input_name");
  if(ele != null)
    _invoice_data.name = ele.value;
  ele = document.getElementById("invoice_input_address");
  if(ele != null)
    _invoice_data.address = ele.value;
  ele = document.getElementById("invoice_input_citystatezip");
  if(ele != null)
    _invoice_data.citystatezip = ele.value;
  ele = document.getElementById("invoice_input_soldby");
  if(ele != null)
    _invoice_data.soldby = ele.value;
  ele = document.getElementById("invoice_textarea_specs");
  if(ele != null)
    _invoice_data.specs = ele.value;
  ele = document.getElementById("invoice_textarea_misc");
  if(ele != null)
    _invoice_data.misc = ele.value;
  ele = document.getElementById("invoice_input_signature");
  if(ele != null)
    _invoice_data.signature = ele.value;
  ele = document.getElementById("invoice_bottom_textarea_2");
  if(ele != null)
    _invoice_data.bottom = ele.value;
  ele = document.getElementById("invoice_input_total");
  if(ele != null)
    _invoice_data.total = ele.value;
  ele = document.getElementById("invoice_input_invoice_no");
  if(ele != null)
    _invoice_data.invoice_no = ele.value;
  ele = document.getElementById("invoice_input_date");
  if(ele != null)
    _invoice_data.date = ele.value;

  var i = 0;
  ele = document.getElementById("invoice_input_qty_" + i);
  var invoice_parts = [];
  while(ele != null)
  {
    invoice_parts.push([]);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_desc_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_sell_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_amount_" + i);
    invoice_parts[i].push(ele.value);
    ++i;
    ele = document.getElementById("invoice_input_qty_" + i);
  }
  _invoice_data.invoice_parts = invoice_parts;
}

var retrieveInvoiceDataCallback = null;
function retrieveInvoiceDataFromDatabase(callback)
{
  document.getElementById("button_update_invoice_history").style.display = "none";
  retrieveInvoiceDataCallback = callback;
  var invoiceDataRef = firebase.database().ref('invoice_data');
  invoiceDataRef.once('value', function(snapshot) {
    _content_invoice_history = [];
    snapshot.forEach(function(childSnapshot) {
      var invoice_obj = childSnapshot.val();
      invoice_obj.key = childSnapshot.key;
      _content_invoice_history.push(invoice_obj);
    });
    if(retrieveInvoiceDataCallback != null)
      retrieveInvoiceDataCallback();
    document.getElementById("button_update_invoice_history").style.display = "";
  });

}

function selectRecentRecordBrowserRow()
{
  var cell = getCell(_selectedRow, _selectedCell, _TABLE_RECORD_BROWSER);
  if(cell != null)
    onCellClick(_selectedRow, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
}

function hideRecordViewEditAndSellIcons()
{
  for (var i = 0; i < _recordViews.length; ++i)
  {
    document.getElementById("record_view_data_edit_icon_" + i).style.display = "none";
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var icon = document.getElementById("record_view_partnum_edit_icon_" + i + "_" + j);
      if (icon != null)
        icon.style.display = "none";
    }
  }
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var icon = document.getElementById("sell_button_" + i + "_" + j);
      if (icon != null)
        icon.style.display = "none";
    }
  }
}

function setPDFAddToDatabaseButtons(show)
{
  var inc = 0;
  var ele = document.getElementById("startAddToDatabaseButton_" + inc);
  while(ele != null)
  {
    if(show)
      ele.style.display = "";
    else
      ele.style.display = "none";
    ++inc;
    ele = document.getElementById("startAddToDatabaseButton_" + inc);
  }
}

function clearInvoicesContent()
{
  document.getElementById("invoice_content").innerHTML = "";
  document.getElementById("invoice_from_history_content").innerHTML = "";
  document.getElementById("add_invoice_content").innerHTML = "";
}

function addInvoice_AddTableRow()
{
  var table_ele = document.getElementById("table_invoice_parts");
  var len = table_ele.rows.length - 3;
  var row = table_ele.insertRow(len);
  row.innerHTML += "<tr class='in_td'><td>" 
  + "<input                              type='text' style='width: 53px; height: 15px; text-align: right;' onchange='calculateAddInvoiceAmounts();'></td><td>" //Quantity
  + "<input                              type='text' style='width: 493px; height: 15px;'                  ></td><td>" //Description
  + "<input id='input_addinvoice_price'  type='text' style='width: 48px; height: 15px; text-align: right;' onfocus='deselectTable();' onchange='calculateAddInvoiceAmounts();'></td><td>" //Price
  + "<input id='input_addinvoice_amount' type='text' style='width: 53px; height: 15px; text-align: right;' disabled></td><td class='no-print'>" //Amount
  + "<button id='button_addInvoice_remove_0' style='width: 20px; height: 20px; padding: 0px; color: white; background-color: red;' tabindex='-1' onclick='addInvoice_DeleteTableRow(this.parentElement.parentElement.rowIndex);'>x</button></td></tr>";
  row.cells[0].children[0].focus();
}

function addInvoice_DeleteTableRow(index)
{
  var table_ele = document.getElementById("table_invoice_parts");
  table_ele.deleteRow(index);
}

function addInvoice_Save()
{
  var _invoice_data = new Object();
  var ele;
  ele = document.getElementById("invoice_input_invoice_no");
  if(ele != null)
    _invoice_data.invoice_no = ele.value;
  ele = document.getElementById("invoice_input_date");
  if(ele != null)
    _invoice_data.date = ele.value;
  ele = document.getElementById("invoice_input_customer_order_no");
  if(ele != null)
    _invoice_data.customer_order_no = ele.value;
  ele = document.getElementById("invoice_input_name");
  if(ele != null)
    _invoice_data.name = ele.value;
  ele = document.getElementById("invoice_input_address");
  if(ele != null)
    _invoice_data.address = ele.value;
  ele = document.getElementById("invoice_input_citystatezip");
  if(ele != null)
    _invoice_data.citystatezip = ele.value;
  ele = document.getElementById("invoice_input_soldby");
  if(ele != null)
    _invoice_data.soldby = ele.value;
  ele = document.getElementById("invoice_textarea_specs");
  if(ele != null)
    _invoice_data.specs = ele.value;
  ele = document.getElementById("invoice_textarea_misc");
  if(ele != null)
    _invoice_data.misc = ele.value;
  ele = document.getElementById("invoice_input_total");
  if(ele != null)
    _invoice_data.total = ele.value;
  ele = document.getElementById("invoice_input_signature");
  if(ele != null)
    _invoice_data.signature = ele.value;
  ele = document.getElementById("invoice_bottom_textarea_2");
  if(ele != null)
    _invoice_data.bottom = ele.value;


  var table = document.getElementById("table_invoice_parts");
  var numTotalRows = table.rows.length - 4;
  var total = 0;
  var invoice_parts = [];
  for(var i = 0; i < numTotalRows; ++i)
  {
    var row = [];
    row.push(table.rows[i + 1].cells[0].children[0].value);
    row.push(table.rows[i + 1].cells[1].children[0].value);
    row.push(table.rows[i + 1].cells[2].children[0].value);
    row.push(table.rows[i + 1].cells[3].children[0].value);
    invoice_parts.push(row);
  }
  _invoice_data.invoice_parts = invoice_parts;

  var invoiceDataListRef = getDatabaseRef('invoice_data');
  var newInvoiceRef = invoiceDataListRef.push();
  _invoice_data.bottom = null;
  writeToDatabase('invoice_data/' + newInvoiceRef.key, _invoice_data, false, false, false, null);
  showSnackbar("Invoice Saved", 3000);
  exitInvoiceFromNew();
}

function startDeleteInvoice()
{
  document.getElementById("button_viewInvoice_delete").style.display = "none";
  document.getElementById("button_viewInvoice_confirmdelete").style.display = "";
  document.getElementById("button_viewInvoice_canceldelete").style.display = "";
}

function confirmDeleteInvoice()
{
  // console.log(_content_invoice_history);
  deleteFromDatabase("invoice_data/" + _current_viewed_invoice_id, false, false, false, null);
  exitInvoiceFromHistory();
  clickInvoiceHistory_Update();
}

function cancelDeleteInvoice()
{
  document.getElementById("button_viewInvoice_delete").style.display = "";
  document.getElementById("button_viewInvoice_confirmdelete").style.display = "none";
  document.getElementById("button_viewInvoice_canceldelete").style.display = "none";
}

function removeIndexesFromArray(array, indexesToRemove)
{
  for(var i = indexesToRemove.length - 1; i >= 0; --i)
  {
    var index = indexesToRemove[i];
    if(array.length > index)
    {
      array.splice(index, 1);
    }
    else
    {
      console.log("Attempted to remove index larger than array!")
    }
  }
}

var _images_googlesearch_list = [];
var _images_googlesearch_currentindex = 0;
function googlesearch_hndlr(response) {
  if(response.items != null && response.items.length > 0)
  {
    _images_googlesearch_list = response.items;
    _images_googlesearch_currentindex = 0;
    var item = response.items[0];
    // in production code, item.htmlTitle should have the HTML entities escaped.
    var div = document.getElementById("googlesearch_image_div");
    div.style.display = "";
    // div.innerHTML = "<img id='button_googlesearch_image_exit' class='clickable' src='x.png' style='position: fixed; top: -80px; right: -20px;' onclick='hideGoogleSearchImage();'><img id='image_googlesearch_image' src='" + item.link + "' style='height: 100%;'>";
    document.getElementById("image_googlesearch_image").src = "";
    document.getElementById("image_googlesearch_image").src = item.link;
    setGoogleSearchImageCount();
  }
  else
    showSnackbar("No results found", 3000);
}

function showRecordViewImage(descrip1, partSearchTerm, sitesEnum)
{
  if(_google_cse_api_key_loaded)
  {
    var searchEngineID = "";
    switch(sitesEnum)
    {
      case 0:
        searchEngineID = "de8eb9876c78e78e6"; //Entire Web
        break;
      case 1:
        searchEngineID = "01922cf7659e937bd"; //Parts Sites
        break;
    }
    var cleanPartSearchTerm = getHTMLSafeText(partSearchTerm);
    var script = document.createElement('script');
    // script.onload = function () {

    // };

    var descrip1_split = removeExtraSpaces(descrip1.replace("-", " ")).split(" ");

    descrip1 = "";
    if(descrip1_split.length > 0)
      descrip1 = descrip1_split[0];
    script.src = "https://www.googleapis.com/customsearch/v1?key=" + _google_cse_api_key + "&cx=" + searchEngineID + "&q=" + descrip1 + " " + cleanPartSearchTerm + "&callback=googlesearch_hndlr&searchType=image&num=10";

    document.getElementById("googlesearch_api_script_div").innerHTML = "";
    document.getElementById("googlesearch_api_script_div").appendChild(script);
  }
  else
  {
    showSnackbar("Google CSE Api Key not loaded yet!", 3000);
  }
}

function hideGoogleSearchImage()
{
  var div = document.getElementById("googlesearch_image_div");
  div.style.display = "none";
}

function changeGoogleSearchImage(direction)
{
  switch(direction)
  {
    case -1:
      if(_images_googlesearch_currentindex > 0 && _images_googlesearch_list.length > _images_googlesearch_currentindex - 1)
      {
        --_images_googlesearch_currentindex;
      }
      break;
    case 1:
      if(_images_googlesearch_list.length > _images_googlesearch_currentindex + 1)
      {
        ++_images_googlesearch_currentindex;
      }
      break;
  }
  if(_images_googlesearch_list.length > _images_googlesearch_currentindex)
  {
    document.getElementById("image_googlesearch_image").src = "";
    document.getElementById("image_googlesearch_image").src = _images_googlesearch_list[_images_googlesearch_currentindex].link;
    setGoogleSearchImageCount();
  }
}

function setGoogleSearchImageCount()
{
  document.getElementById("paragraph_googlesearch_image_count").innerHTML = (_images_googlesearch_currentindex + 1) + " / " + _images_googlesearch_list.length;
}

var _RECORDVIEW_FRACTIONS_TO_DECIMAL_TEXT = "1/16=.0625 1/8=.125 1/4=.25 3/8=.375 1/2=.5 5/8=.625 3/4=.75 7/8=.875";
var _RECORDVIEW_SPEC_BORDER_TOP =    "border-top:    3px black solid; border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_SPEC_BORDER_MIDDLE =                                 "border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_SPEC_BORDER_BOTTOM = "border-bottom: 3px black solid; border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_MAX_PAGES = 4;
function getRecordViewPage(rownum, page_num, i)
{
  var htmlToAdd = "";
  switch(page_num)
  {
    //-------------------------------------------------PAGE 1-------------------------------------------------------------
    case 1:
      htmlToAdd += "<table><tr>";
      htmlToAdd += "<th>Page 1</th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>";
      htmlToAdd += "<th colspan='4' style='text-align: center;'>VENDOR PICK/PACK/INV SLIP</th>";
      htmlToAdd += "<th></th><th></th><th></th><th></th><th></th><th></th>";
      
      htmlToAdd += "</tr><tr>";
      for(var j = 0; j < RECORD_VIEW_HEADERS_PAGE1.length; ++j)
      {
        if(j == 0)
          htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1[j] + ";'><p>" + RECORD_VIEW_HEADERS_PAGE1[j] + "</p></th>";
      }
      htmlToAdd += "<th>Reliable Parts</th><th>Encompass</th><th>Marcone</th><th>Image</th>";
      htmlToAdd += "</tr>";
      var parent_record_id = _content[rownum][INDEXES_CONCAT.length];
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
        {
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          if(j == _EXTRA_DB.length - 1) //Last row
            htmlToAdd += "<tr style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
          else
            htmlToAdd += "<tr>";
          var partSearchTerm = "";
          for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE1.length; ++k)
          { 
            htmlToAdd += "<td>";
            if(k == 0)
            {
              htmlToAdd += "<div style='width: 30px; display: inline-block;'>" + _EXTRA_DB[j] + "</div>";
              if(extraDBIndex != null)
                htmlToAdd += "<div style='display: inline; font-size: 20px;' id='sell_div_" + i + "_" + j + "'><br><button style='background-color: #70A2FF; color: black;' id='sell_button_" + i + "_" + j + "' onclick='startSell(" + i + "," + j + ");'><span style='color: white;'>S</span>ell</button>"
                + "<div id='sell_form_" + i + "_" + j + "' style='display: none;'>"
                + "<p>Quantity</p>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ",  1);'>+</button><br>"
                + "<input onfocus='deselectTable();' style='width: 100px; height: 50px; font-size: 30px; text-align: center;' type='number' value='1' id='sell_quantity_" + i + "_" + j + "'><br>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ", -1);'>-</button><br><br>"
                + "<button id='button_record_view_sell_confirm_" + i + "_" + j + "' style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='confirmSell(" + i + "," + j + ",\"" + _content_partnum_for_extraDB + "\",\"" + parent_record_id + "\");'>Confirm <span style='color: white;'>S</span>ell</button><br><br>"
                + "<button id='button_record_view_sell_cancel_" + i + "_" + j + "'  style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button></div></div>";
              htmlToAdd += "</td><td>";
            }
            else if(k == 1)
            {
              htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' src='pencil.png' width=25px height=25px onclick='startEditRecordPartReference(" + i + "," + j + ");' style='position: relative; bottom: -6px;'>&nbsp;&nbsp;";
              partSearchTerm = _content_partnum_for_extraDB;
              var pText = "";
              var clean_content_partnum_for_extraDB = removeExtraSpaces(_content_partnum_for_extraDB);
              if(extraDBIndex == null && clean_content_partnum_for_extraDB != "")
                pText = _content_partnum_for_extraDB + "<span style='color: red;'>&nbsp;&nbsp;&nbsp;Not Found in Child Database!</span>";
              else if(clean_content_partnum_for_extraDB == "")
              {
                pText = "";
              }
              else
                pText = "<span id='span_recordviews_jump_to_child_part_" + i + "_" + j + "' class='clickable' style='color: blue;' onclick='jumpToChildPartFromRecordView(" + j + "," + extraDBIndex + ");'><u>" + _content_partnum_for_extraDB + "</u></span>";
              htmlToAdd += "<p id='record_view_partnum_text_" + i + "_" + j + "' style='display: inline;'>" + pText + "</p><input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' value='" + getHTMLSafeText(_content_partnum_for_extraDB) + "' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>"
              + "<button id='record_view_partnum_save_button_"   + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black; margin-bottom: 2px;' onclick='saveEditRecordPartReference(" + i + "," + j + ");'><span style='color: white;'>S</span>ave</button>"
              + "<button id='record_view_partnum_cancel_button_" + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if(extraDBIndex != null){
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1[k][j]];
              if(content1 != null){
                if(k == 1) //PART#
                {
                  //Filled in with link
                }
                else if(k == 9 || k == 10 || k == 11) //"CGS",   "RETAIL",     "SELL" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1[k] + "_" + i + "_" + j + "'>" + content1.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</span>";
                }
                else if(k == 12) //"COMMENTS"
                {
                  var htmlCheck = "<input type='checkbox' disabled>";
                  if(content1.replace(" ", "").length > 0)
                  {
                    htmlCheck = "<div class='tooltip'><span class='tooltiptext'>" + content1 + "</span><input type='checkbox' checked disabled></div>";
                  }
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1[k] + "_" + i + "_" + j + "'>" + htmlCheck + "</span>";
                }
                else
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if(k != 1) //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if(k == 1)
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }
          htmlToAdd += "<td>";
          var clean_partSearchTerm = removeExtraSpaces(partSearchTerm);
          if(clean_partSearchTerm != "")
            htmlToAdd += "<a href='https://www.reliableparts.com/search?q=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
            htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          htmlToAdd += "<a href='https://beta.marcone.com/Home/SearchPartModelList?searchString=" + getStandardPNWebSearchString(partSearchTerm) + "&Type=Part' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          {
            var descrip1 = _content[rownum][_DESCRIP1].replace("\"", "");
            descrip1 = descrip1.replace("\'", "");
            htmlToAdd += "<button id='button_recordview_image_everywhere_"   + i + "_" + j + "' style='background-color: #70A2FF; color: black;'                  onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 0);'><div class='tooltip'><span class='tooltiptext'>Search entire<br>internet<br>for images</span>E<span style='color: white;'>v</span>erywhere</button>";
            htmlToAdd += "<button id='button_recordview_image_distributors_" + i + "_" + j + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 1);'><div class='tooltip'><span class='tooltiptext'>Search Encompass,<br>Marcone,<br>Reliable Parts,<br>and WL MAY<br>websites for images</span><span style='color: white;'>D</span>istributors</button>";
          }
          htmlToAdd += "</td>";
          htmlToAdd += "</tr>";
        }
      }
    
      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 80, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE],     (i + "_ADVICE"),     80, "");
      var MODEL_CONTENT =  getExpandableHTML(_content[rownum][_MODEL],      (i + "_MODEL"),      80, "");
      var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>" ;
      var INPUT_LOCATION =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>" ;
      var INPUT_MODIFIED =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>" ;
      var INPUT_KEEP =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>" ;
      var INPUT_GET =        "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>" ;
      var INPUT_LKUPPN =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>" ;
      var INPUT_ADVICE =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>" ;
      var INPUT_REORD_QTY =  "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>" ;
      var INPUT_SOURCE =     "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>" ;
      var INPUT_MODEL =      "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
      var INPUT_FROM =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>" ;
    
      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>" 
      + "<td colspan=2><b><span id='record_view_data_read_PART_NUMBR_" + i + "'>" + _content[rownum][_PART_NUMBR] + "</span>" + INPUT_PART_NUMBR + "</b></td>"
      + "<td><b><span id='record_view_data_read_LOCATION_" + i + "'>" + _content[rownum][_LOCATION] + "</span>" + INPUT_LOCATION + "</b></td>"
      + "<td colspan=4><b><span id='record_view_data_read_MODIFIED_" + i + "'>" + _content[rownum][_MODIFIED] + "</span>" + INPUT_MODIFIED + "</b></td>"
      + "<td>KEEP  <b><span id='record_view_data_read_KEEP_" + i + "'>" + _content[rownum][_KEEP] + "</span>" + INPUT_KEEP +      "</b></td>"
      + "<td>BULK <b><span id='record_view_data_read_GET_" + i + "'>" + _content[rownum][_GET] + "</span>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td>                                                 </tr>"
      + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
      + "<td colspan=2><span id='record_view_data_read_LKUPPN_" + i + "'>" + LKUPPN_CONTENT + "</span>" + INPUT_LKUPPN + "                      </td>"
      + "<td style='text-align: right;'>         ADVICE</td><td colspan=4><span id='record_view_data_read_ADVICE_" + i + "'>" + ADVICE_CONTENT + "</span>" + INPUT_ADVICE + "                    </td>"
      + "<td>REORD <b><span id='record_view_data_read_REORD_QTY_" + i + "'>" + _content[rownum][_REORD_QTY] + "</span>" + INPUT_REORD_QTY + "</b><button onclick='updateReordFromRecordView(\"" + parent_record_id + "\");'>Update</button></td><td colspan=2 style='text-align: right;'>                                          Srce</td>"
      + "<td><b><span id='record_view_data_read_SOURCE_" + i + "'>" + _content[rownum][_SOURCE] + "</span>" + INPUT_SOURCE + "</b></td></tr>"
      + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
      + "<td colspan=4><span id='record_view_data_read_MODEL_" + i + "'>" + MODEL_CONTENT + "</span>" + INPUT_MODEL + "</td>"
      + "<td colspan=4>PREF  <b><span id='record_view_data_read_FROM_" + i + "'>" + _content[rownum][_FROM] + "</span>" + INPUT_FROM + "</b></td>                                                                                                                                             </tr>"
      + "</table><br><br>";
    break;
    //-------------------------------------------------PAGE 2-------------------------------------------------------------
    case 2:
      htmlToAdd += "<table><tr>";
      htmlToAdd += "<th>Page 2</th><th></th><th></th><th></th>";
      htmlToAdd += "<th colspan='4' style='text-align: center;'>MFR PRICEBOOK</th>";
      htmlToAdd += "<th></th><th></th><th></th><th></th><th></th><th></th><th></th>";
      
      htmlToAdd += "</tr><tr>";
      for(var j = 0; j < RECORD_VIEW_HEADERS_PAGE2.length; ++j)
      {
        if(j == 0)
          htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE2[j] + ";'><p>" + RECORD_VIEW_HEADERS_PAGE2[j] + "</p></th>";
      }
      htmlToAdd += "<th>Reliable Parts</th><th>Encompass</th><th>Marcone</th><th>Image</th>";
      htmlToAdd += "</tr>";
      var parent_record_id = _content[rownum][INDEXES_CONCAT.length];
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
        {
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          if(j == _EXTRA_DB.length - 1) //Last row
            htmlToAdd += "<tr style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
          else
            htmlToAdd += "<tr>";
          var partSearchTerm = "";
          for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE2.length; ++k)
          { 
            htmlToAdd += "<td>";
            if(k == 0)
            {
              htmlToAdd += "<div style='width: 30px; display: inline-block;'>" + _EXTRA_DB[j] + "</div>";
              if(extraDBIndex != null)
                htmlToAdd += "<div style='display: inline; font-size: 20px;' id='sell_div_" + i + "_" + j + "'><br><button style='background-color: #70A2FF; color: black;' id='sell_button_" + i + "_" + j + "' onclick='startSell(" + i + "," + j + ");'><span style='color: white;'>S</span>ell</button>"
                + "<div id='sell_form_" + i + "_" + j + "' style='display: none;'>"
                + "<p>Quantity</p>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ",  1);'>+</button><br>"
                + "<input onfocus='deselectTable();' style='width: 100px; height: 50px; font-size: 30px; text-align: center;' type='number' value='1' id='sell_quantity_" + i + "_" + j + "'><br>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ", -1);'>-</button><br><br>"
                + "<button id='button_record_view_sell_confirm_" + i + "_" + j + "' style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='confirmSell(" + i + "," + j + ",\"" + _content_partnum_for_extraDB + "\",\"" + parent_record_id + "\");'>Confirm <span style='color: white;'>S</span>ell</button><br><br>"
                + "<button id='button_record_view_sell_cancel_" + i + "_" + j + "'  style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button></div></div>";
              htmlToAdd += "</td><td>";
            }
            else if(k == 1)
            {
              htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' src='pencil.png' width=25px height=25px onclick='startEditRecordPartReference(" + i + "," + j + ");' style='position: relative; bottom: -6px;'>&nbsp;&nbsp;";
              partSearchTerm = _content_partnum_for_extraDB;
              var pText = "";
              var clean_content_partnum_for_extraDB = removeExtraSpaces(_content_partnum_for_extraDB);
              if(extraDBIndex == null && clean_content_partnum_for_extraDB != "")
                pText = _content_partnum_for_extraDB + "<span style='color: red;'>&nbsp;&nbsp;&nbsp;Not Found in Child Database!</span>";
              else if(clean_content_partnum_for_extraDB == "")
              {
                pText = "";
              }
              else
                pText = "<span id='span_recordviews_jump_to_child_part_" + i + "_" + j + "' class='clickable' style='color: blue;' onclick='jumpToChildPartFromRecordView(" + j + "," + extraDBIndex + ");'><u>" + _content_partnum_for_extraDB + "</u></span>";
              htmlToAdd += "<p id='record_view_partnum_text_" + i + "_" + j + "' style='display: inline;'>" + pText + "</p><input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' value='" + getHTMLSafeText(_content_partnum_for_extraDB) + "' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>"
              + "<button id='record_view_partnum_save_button_"   + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black; margin-bottom: 2px;' onclick='saveEditRecordPartReference(" + i + "," + j + ");'><span style='color: white;'>S</span>ave</button>"
              + "<button id='record_view_partnum_cancel_button_" + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if(extraDBIndex != null){
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2[k][j]];
              if(content1 != null){
                if(k == 1) //PART#
                {
                  //Filled in with link
                }
                else if(k == 9 || k == 10 || k == 11) //"CGS",   "RETAIL",     "SELL" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2[k] + "_" + i + "_" + j + "'>" + content1.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</span>";
                }
                else if(k == 12) //"COMMENTS"
                {
                  var htmlCheck = "<input type='checkbox' disabled>";
                  if(content1.replace(" ", "").length > 0)
                  {
                    htmlCheck = "<div class='tooltip'><span class='tooltiptext'>" + content1 + "</span><input type='checkbox' checked disabled></div>";
                  }
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2[k] + "_" + i + "_" + j + "'>" + htmlCheck + "</span>";
                }
                else
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if(k != 1) //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE2[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if(k == 1)
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }
          htmlToAdd += "<td>";
          var clean_partSearchTerm = removeExtraSpaces(partSearchTerm);
          if(clean_partSearchTerm != "")
            htmlToAdd += "<a href='https://www.reliableparts.com/search?q=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
            htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          htmlToAdd += "<a href='https://beta.marcone.com/Home/SearchPartModelList?searchString=" + getStandardPNWebSearchString(partSearchTerm) + "&Type=Part' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          {
            var descrip1 = _content[rownum][_DESCRIP1].replace("\"", "");
            descrip1 = descrip1.replace("\'", "");
            htmlToAdd += "<button id='button_recordview_image_everywhere_"   + i + "_" + j + "' style='background-color: #70A2FF; color: black;'                  onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 0);'><div class='tooltip'><span class='tooltiptext'>Search entire<br>internet<br>for images</span>E<span style='color: white;'>v</span>erywhere</button>";
            htmlToAdd += "<button id='button_recordview_image_distributors_" + i + "_" + j + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 1);'><div class='tooltip'><span class='tooltiptext'>Search Encompass,<br>Marcone,<br>Reliable Parts,<br>and WL MAY<br>websites for images</span><span style='color: white;'>D</span>istributors</button>";
          }
          htmlToAdd += "</td>";
          htmlToAdd += "</tr>";
        }
      }
    
      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 80, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE],     (i + "_ADVICE"),     80, "");
      var MODEL_CONTENT =  getExpandableHTML(_content[rownum][_MODEL],      (i + "_MODEL"),      80, "");
      var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>" ;
      var INPUT_LOCATION =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>" ;
      var INPUT_MODIFIED =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>" ;
      var INPUT_KEEP =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>" ;
      var INPUT_GET =        "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>" ;
      var INPUT_LKUPPN =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>" ;
      var INPUT_ADVICE =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>" ;
      var INPUT_REORD_QTY =  "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>" ;
      var INPUT_SOURCE =     "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>" ;
      var INPUT_MODEL =      "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
      var INPUT_FROM =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>" ;
    
      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>" 
      + "<td colspan=2><b><span id='record_view_data_read_PART_NUMBR_" + i + "'>" + _content[rownum][_PART_NUMBR] + "</span>" + INPUT_PART_NUMBR + "</b></td>"
      + "<td><b><span id='record_view_data_read_LOCATION_" + i + "'>" + _content[rownum][_LOCATION] + "</span>" + INPUT_LOCATION + "</b></td>"
      + "<td colspan=4><b><span id='record_view_data_read_MODIFIED_" + i + "'>" + _content[rownum][_MODIFIED] + "</span>" + INPUT_MODIFIED + "</b></td>"
      + "<td>KEEP  <b><span id='record_view_data_read_KEEP_" + i + "'>" + _content[rownum][_KEEP] + "</span>" + INPUT_KEEP +      "</b></td>"
      + "<td>BULK <b><span id='record_view_data_read_GET_" + i + "'>" + _content[rownum][_GET] + "</span>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td>                                                 </tr>"
      + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
      + "<td colspan=2><span id='record_view_data_read_LKUPPN_" + i + "'>" + LKUPPN_CONTENT + "</span>" + INPUT_LKUPPN + "                      </td>"
      + "<td style='text-align: right;'>         ADVICE</td><td colspan=4><span id='record_view_data_read_ADVICE_" + i + "'>" + ADVICE_CONTENT + "</span>" + INPUT_ADVICE + "                    </td>"
      + "<td>REORD <b><span id='record_view_data_read_REORD_QTY_" + i + "'>" + _content[rownum][_REORD_QTY] + "</span>" + INPUT_REORD_QTY + "</b><button onclick='updateReordFromRecordView(\"" + parent_record_id + "\");'>Update</button></td><td colspan=2 style='text-align: right;'>                                          Srce</td>"
      + "<td><b><span id='record_view_data_read_SOURCE_" + i + "'>" + _content[rownum][_SOURCE] + "</span>" + INPUT_SOURCE + "</b></td></tr>"
      + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
      + "<td colspan=4><span id='record_view_data_read_MODEL_" + i + "'>" + MODEL_CONTENT + "</span>" + INPUT_MODEL + "</td>"
      + "<td colspan=4>PREF  <b><span id='record_view_data_read_FROM_" + i + "'>" + _content[rownum][_FROM] + "</span>" + INPUT_FROM + "</b></td>                                                                                                                                             </tr>"
      + "</table><br><br>";
      break;
       //-------------------------------------------------PAGE 3-------------------------------------------------------------
    case 3:
      htmlToAdd += "<table><tr><th colspan='3'>Page 3</th></tr>"
                 + "<tr><td colspan='3'>" + _content[rownum][_SPECMETHOD] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD +  1] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD +  4] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD +  7] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD +  2] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD +  5] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD +  8] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD +  3] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD +  6] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD +  9] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 10] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 13] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 16] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 11] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 14] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 17] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 12] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 15] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 18] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 19] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 22] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 25] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 20] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 23] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 26] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 21] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 24] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 27] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 28] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 31] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 34] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 29] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 32] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 35] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 30] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 33] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 36] + "</td></tr>"
                 + "<tr><td colspan='3'><br>" + _RECORDVIEW_FRACTIONS_TO_DECIMAL_TEXT + "</td></tr>"
                 + "</table><br><br>";
      break;
      //-------------------------------------------------PAGE 4-------------------------------------------------------------
    case 4:
      htmlToAdd += "<table><tr><th>Page 4</th></tr>";
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
        {
          htmlToAdd += "<tr><td><b>" + _EXTRA_DB[j] + ":</b> ";
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          if(extraDBIndex != null)
          {
            htmlToAdd += _content_extra[j][extraDBIndex][0].COMMENTS;
          }
          htmlToAdd += "</td></tr>";
        }
      }
      htmlToAdd += "<tr><td><b>NEWER:</b> "                                    + _content[rownum][_NEWER]       + "</td></tr>"
                 + "<tr><td><b>NEW:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"   + _content[rownum][_NEW]         + "</td></tr>"
                 + "<tr><td><b>QUESTIONS:</b> "                                + _content[rownum][_QUESTIONS]   + "</td></tr>"
                 + "</table><br><br>";
      break;
  }
  return htmlToAdd;
}

function setRecordViewPage(pagenum, i)
{
  var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
  if(rownum != null)
  {
    var htmlToAdd = getRecordViewPage(rownum, pagenum, i);
    _record_view_page_list[i] = pagenum;
    document.getElementById("record_view_details_" + i + "_div").innerHTML = htmlToAdd;
    var ele = document.getElementById("record_view_data_edit_icon_" + i);
    if(ele != null && pagenum != 1)
      ele.style.display = "none";
    else
      ele.style.display = "";
    setKeyboardShortcutBar();
  }
}