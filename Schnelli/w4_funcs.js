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

function getExtraDBLinkIndex(_content_extra_db_index, pn) {
  if (pn.length > 0) {
    for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) //Exact match PN
    {
      if (String(_content_extra[_content_extra_db_index][i][0].PN) == pn) {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[_content_extra_db_index][i][0].PN)) == pn1) //General match PN
      {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) //Exact match AKA
    {
      if (String(_content_extra[_content_extra_db_index][i][0].AKA) == pn) {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[_content_extra_db_index][i][0].AKA)) == pn1) //General match AKA
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
  var str2 = String(str).replace(/\</g, "&lt;");
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

function toggle_search_results(state) { //0 hidden, 1 shown, 2 toggle
  if (state == 0) {
    document.getElementById("search_results_div").style.display = "none";
    document.getElementById("search_results_expander_icon").innerHTML = "+";
  }
  else if (state == 1) {
    document.getElementById("search_results_div").style.display = "block";
    document.getElementById("search_results_expander_icon").innerHTML = "-";
  }
  else {
    if (document.getElementById("search_results_div").style.display == "none") {
      document.getElementById("search_results_div").style.display = "block";
      document.getElementById("search_results_expander_icon").innerHTML = "-";
    }
    else {
      document.getElementById("search_results_div").style.display = "none";
      document.getElementById("search_results_expander_icon").innerHTML = "+";
    }
  }
}

function toggle_similar_string_table(id) {
  var tableID = "similar_string_table_" + id;
  var expanderID = "similar_string_expander_" + id;
  if (document.getElementById(tableID).style.display == "none") 
  {
    document.getElementById(tableID).style.display = "block";
    document.getElementById(expanderID).innerHTML = "-";
  }
  else {
    document.getElementById(tableID).style.display = "none";
    document.getElementById(expanderID).innerHTML = "+";
  }
}

function getContentIndexFrom_DB_ID(db_id) {
  for (var i = 0; i < _content.length; ++i) {
    if (_content[i][_content[i].length - 1] == db_id)
      return i;
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
  document.getElementById("sort_order_div").style.display = "none";
  document.getElementById("search_div").style.display = "none";
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("record_browser_div").style.display = "none";

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
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("record_browser_div").style.display = "block";
    if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null) {
      var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
      if (index1 != null) {
        populateRecordBrowser(index1, false);
        var cell = getCell(index1, _selectedCell, _selectedTable);
        if (cell != null)
          onCellClick(index1, _selectedCell, cell.id, _selectedTable);
      }
    }
  }
}

function sortContentBySortOrder(order_index) {
  showSnackbar("Sorting by index...", 6000);
  // document.getElementById("message").innerHTML = "<p>Sorting by index...</p>";
  document.getElementById("sort_order_div").style.display = "none";
  document.getElementById("search_div").style.display = "none";
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("record_browser_div").style.display = "none";

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
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("record_browser_div").style.display = "block";
    if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null) {
      var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
      if (index1 != null) {
        populateRecordBrowser(index1, false);
        var cell = getCell(index1, _selectedCell, _selectedTable);
        if (cell != null)
          onCellClick(index1, _selectedCell, cell.id, _selectedTable);
      }
    }
  }
}

function generateContent_Standard() {
  _content_standard = [];
  for (var i = 0; i < _content.length; ++i)
    _content_standard.push(getStandardRow(i));
  setLargestRecordNumber();
}

function generateContent_Standard_Row(rownum) {
  _content_standard[rownum] = getStandardRow(rownum);
  setLargestRecordNumber();
}

function generateContent_Standard_New() {
  _content_standard.push(getStandardRow(_content.length - 1));
  setLargestRecordNumber();
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
  if (skipPopulate == null)
    skipPopulate = false;

  _isTableSelected = true;
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
  }
}

function deselectTable(index) {
  _selected_record_view = -1;
  if (index != null)
    _selected_search_input = index;
  _isTableSelected = false;
  var elementRow;
  var elementCell;

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
  }
  var cells1 = document.getElementById(row_id).cells;
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var index = _INDEX_ORDER[i];
    if (index == 0) {
      cells1[i].innerHTML = "<div style='display: flex; align-items: center; justify-content: center;'>" +
        "<div style='flex-direction: column;'>" +
        "<button id='save_edit_record' onclick='saveEditRecord(" + rownum + ");' style='width: 60px;'>Save</button>" +
        "<button id='cancel_edit_record' onclick='cancelEditRecord()' style='width: 60px; margin-top: 5px;'>Cancel</button>" +
        "<button id='delete_edit_record' onclick='startDeleteRecord()' style='width: 60px; margin-top: 5px; color: red;'>Delete</button>" +
        "<button id='confirm_delete_record' onclick='confirmDeleteRecord(" + rownum + ")' style='display: none; color: red;'>Confirm Delete</button>" +
        "<button id='cancel_delete_record' onclick='cancelDeleteRecord();' style='display: none;'>Cancel Delete</button>" +
        "</div>" +
        "<input type='text' id='edit_textarea_" + i + "' style='width: 50%;' onfocus='deselectTable();' onchange='deselectTable();'></input></div>";
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

function saveContentToDatabase(rownum)
{
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

function cancelEditRecord() {
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
}

function startNewRecord(indexToCopy) {
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
    if (index == 0) {
      tableHTML += "<td><div style='display: flex; align-items: center; justify-content: center;'>" +
        "<div style='flex-direction: column;'>" +
        "<button style='width: 60px;' onclick='saveNewRecord();'>Save</button>" +
        "<button style='width: 60px; margin-top: 5px;' onclick='cancelNewRecord();'>Cancel</button>" +
        "</div>" +
        "<input type='text' id='new_textarea_" + i + "' style='width: 50%;' onfocus='deselectTable();' onchange='deselectTable();' value=" + (_largestRecordNumber + 1) + "></input></div></td>";
    }
    else if (index < _INDEXES.length)
      tableHTML += "<td><input type='text' id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></input></td>";
    else
      tableHTML += "<td><textarea id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></textarea></td>";
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
}

function cancelNewRecord() {
  document.getElementById("add_part_table_div").innerHTML = "";
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
  setLargestRecordNumber();
  clearSearchResults();
}

function startNewSortOrder(id1) {
  var newHTML = "<table><tr id='sort_order_row_" + id1 + "'><td style='width: 600px;'>" +
    "<div style='display: flex; align-items: center; justify-content: center;'>" +
    "<div style='flex-direction: column; width: 100px;'>" +
    "<button style='width: 70px; font-size: 20px;' onclick='saveNewSortOrder();'>Save</button><button style='width: 70px; font-size: 20px; margin-top: 5px;' onclick='cancelNewSortOrder();'>Cancel</button>" +
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
    minusButton = "<button style='font-size: 20px; width: 50px; margin-top: 5px;' onclick='" + minusScript + "'>-</button>";
  newHTML += "</select>&nbsp;&nbsp;&nbsp;<div style='flex-direction: column; width: 50px;' id='sort_order_buttons_" + id1 + "_" + id2 + "'><button style='font-size: 20px; width: 50px;' onclick='" + plusScript + "'>+</button>" + minusButton + "</div></div></td>";
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
    minusButton = "<button style='font-size: 20px; width: 50px; margin-top: 5px;' onclick='" + minusScript + "'>-</button>";
  newHTML += "</select>&nbsp;&nbsp;&nbsp;<div style='flex-direction: column; width: 50px; display: none;' id='sort_order_buttons_" + id1 + "_" + id2 + "'><button style='font-size: 20px; width: 50px;' onclick='" + plusScript + "'>+</button>" + minusButton + "</div></div>" +
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

function startEditSortOrder(id1) {
  document.getElementById("sort_order_static_" + id1).style.display = "none";
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

function setLargestRecordNumber() {
  _largestRecordNumber = 0;
  for (var i = 0; i < _content.length; ++i) {
    var recordnumber = Number(_content_standard[i][0]);
    if (recordnumber > _largestRecordNumber)
      _largestRecordNumber = recordnumber;
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

function getExpandableHTML(str_array, id, char_limit, width) {
  var str = stringifyArrayEndChar(str_array, "<br>");
  var result = str;
  if (str.length > char_limit) {
    var id_str = "expandable_html_str_" + id;
    var id_str_short = "expandable_html_str_short_" + id;
    var id_more = "expandable_html_more_" + id;
    var id_less = "expandable_html_less_" + id;
    var str_short = stringifyArrayEndChar(str_array, " ").substring(0, char_limit) + "...";
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
    return ("rgb(255, " + color1 + "," + color1 + ");");
  }
  else {
    return ("rgb(" + color1 + "," + color1 + ", 255);");
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

function addRecordView(key) {
  showSnackbar("Added to Record Views", 3000);
  _recordViews.push(key);
  populateRecordViews();
}

function removeRecordView(pos) {
  _recordViews.splice(pos, 1);
  populateRecordViews();
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
  else
    document.getElementById("radio_record_views_similarities").checked = true;
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
    console.log('PDF loaded ' + pdf.numPages);
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
            tableHTML += "<tr style='vertical-align: top;'>";
            tableHTML += "<td><button style='height: 100px;' id='startAddToDatabaseButton_" + i + "' onclick='generatePDFAddToDatabaseTable(" + i + ");'>Add to Database</button></td>"
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

function loadChangeAlerts() {
  var ref = firebase.database().ref("change_alerts");
  ref.on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var alertOBJ = childSnapshot.val();

      if (alertOBJ.is_content) {
        reloadContentFromChangeAlert(alertOBJ);
      }
      else if (alertOBJ.is_content_extra) {
        reloadContentExtraFromChangeAlert(alertOBJ);
      }

      var timeElapsed = new Date().getTime() - Number(alertOBJ.time);
      if (timeElapsed >= MILLIS_IN_DAY) //Delete alert if older than a day
        firebase.database().ref("change_alerts/" + childSnapshot.key).remove();
    });
  });
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
        setLargestRecordNumber();
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
    // console.log(rowNum);
    // console.log(snapshot.val());
    // console.log(_content_extra[alertOBJ.content_extra_db][rowNum][0]);
    populateRecordViews();

    _CHILD_PART_LINKS_CACHE = [];
  });
}

function startEditRecordPartReference(i1, j1) {
  var selldiv = document.getElementById("sell_div_" + i1 + "_" + j1);
  if(selldiv != null)
    document.getElementById("sell_div_" + i1 + "_" + j1).style.display = "none";
  for (var i = 0; i < _recordViews.length; ++i) {
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
  document.getElementById("record_view_partnum_input_" + i1 + "_" + j1).style.display = "block";
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
    document.getElementById("part_child_button_new").innerHTML = "Add New Child Record in " + _EXTRA_DB[db_index] + " +";
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

var TAB_DIVS = ["TAB_search", "TAB_record_views", "TAB_record_browser", "TAB_part_child_record_manager", "TAB_sort_order", "TAB_fileinput", "TAB_reorders", "TAB_invoice_history", "TAB_invoice_settings", "TAB_invoice"];
var TAB_SEARCH = 0;
var TAB_RECORD_VIEWS = 1;
var TAB_RECORD_BROWSER = 2;
var TAB_PART_CHILD_RECORD_MANAGER = 3;
var TAB_REORDERS = 6;
var TAB_INVOICE_HISTORY = 7;
var TAB_INVOICE = 9;

var _selected_tab = 0;
var last_selected_tab = 0;

function setTab(num)
{
  last_selected_tab = _selected_tab;
  _selected_tab = num;
  for(var i = 0; i < TAB_DIVS.length; ++i){
    document.getElementById(TAB_DIVS[i] + "_div").style.display = "none";
    document.getElementById(TAB_DIVS[i]         ).style.borderBottomColor = "#70A2FF";
  }
  if(num == TAB_RECORD_VIEWS)
    populateRecordViews();
  if(num == TAB_RECORD_BROWSER){
    populateRecordBrowser(_currentRecordBrowserStartIndex, _highlightgreen_requested);
    _highlightgreen_requested = false;
  }
  document.getElementById(TAB_DIVS[num] + "_div").style.display = "";
  document.getElementById(TAB_DIVS[num]).style.borderBottomColor = "transparent";
  if(num == TAB_INVOICE)
  {
    document.getElementById("non_invoice_content").style.display = "none";
    document.getElementById("exit_invoice_button").style.display = "block";
    document.getElementById("invoice_content").style.display = "";
    populateInvoice();
  }
  else{
    document.getElementById("non_invoice_content").style.display = "";
    document.getElementById("exit_invoice_button").style.display = "none";
    document.getElementById("invoice_content").style.display = "none";
  }

  document.getElementById("invoice_from_history_content").style.display = "none";

  if(num == TAB_REORDERS)
  {
    updateReorderParentIDs();
  }

  if(num != TAB_SEARCH && num != TAB_RECORD_VIEWS)
    deselectTable();

  if(num == TAB_INVOICE_HISTORY)
    populateInvoiceHistory();
}

function selectRecordView(num)
{
  if(_recordViews.length > num && _selected_record_view >= 0)
  {
    _selected_record_view = num;
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
}

function searchChildPart(extradb, searchterm)
{
  document.getElementById("part_child_dropdown_select").selectedIndex = extradb;
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  document.getElementById("part_child_edit_input").value = removeEndSemicolon(searchterm);
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
  for (var i = 0; i < _recordViews.length; ++i) {
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
  document.getElementById("sell_form_" + i1 + "_" + j1).style.display = "";
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
  setTab(last_selected_tab);
  writeToDatabase("invoice/last_invoice_no", Number(document.getElementById("invoice_last_invoice_no_input").value) + 1, false, false, false, null);

  var invoiceDataListRef = getDatabaseRef('invoice_data');
  var newInvoiceRef = invoiceDataListRef.push();
  _invoice_data.bottom = null;
  writeToDatabase('invoice_data/' + newInvoiceRef.key, _invoice_data, false, false, false, null);
  _invoice_data = new Object();
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
      _content_invoice_history.push(childSnapshot.val());
    });
    if(retrieveInvoiceDataCallback != null)
      retrieveInvoiceDataCallback();
    document.getElementById("button_update_invoice_history").style.display = "";
  });

}