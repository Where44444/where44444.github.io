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

function getExtraDBLinkIndex(_content_extra_db_index, pn)
{
  if(pn.length > 0){
    for(var i = 0; i < _content_extra[_content_extra_db_index].length; ++i)
    {
      var pn1 = getStandardPNString(pn);
      if(getStandardPNString(String(_content_extra[_content_extra_db_index][i][0].PN )) == pn1 ||
         getStandardPNString(String(_content_extra[_content_extra_db_index][i][0].AKA)) == pn1)
      {
        return i;
      }
    }
  }
  return null;
}

function processJSONData(objs){
  _content = [];
  for(var i = 0; i < objs.length; ++i){
    var content_line = [];
    var obj = objs[i];
    for(var j = 0; j < INDEXES.length; ++j){
      content_line.push(String(obj[INDEXES[j]]));
    }
    for(var j = 0; j < MEMO_INDEXES.length; ++j){
      content_line.push(obj[MEMO_INDEXES[j]]);
    }
    content_line.push(i + "n");
    // checkForExtraLink(5, content_line[15], i);
    _content.push(content_line);
  }
  generateContent_Standard();
  populateRecordBrowser(0, false);
}

function processJSONDataExtra(objs, _content_extra_index, keys){
  if(_content_extra == null){
    _content_extra = new Array(EXTRA_DB.length);
    for(var i = 0; i < EXTRA_DB.length; ++i)
      _content_extra[i] = []; 
  }

  for(var i = 0; i < objs.length; ++i){
    var content_line = [];
    var obj = objs[i];
    content_line.push(obj);
    // for(var j = 0; j < EXTRA_INDEXES.length; ++j){
    //   var item = obj[EXTRA_INDEXES[j]];
    //   if(item == null)
    //     content_line.push("");
    //   else
    //     content_line.push(String(item));
    // }
    if(keys == null)
      content_line.push(i + "e");
    else
      content_line.push(keys[i]);
    _content_extra[_content_extra_index].push(content_line);
  }
}

function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
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

function is_standardized(str){
  return /^[a-z0-9 ]+$/i.test(str);
}

function standardizeString(str){
  var str2 = str.toLowerCase();
  
  //Remove non numbers and letters and spaces
  str2 = str2.replace(/[^0-9a-z ]/g, "");

  //Remove multiple spaces
  str2 = str2.replace(/ {2,}/g, " ");

  //Remove spaces at beginning of string
  if(str2.charAt(0) == " ")
    str2 = str2.substring(1, str2.length);

  //Remove spaces at end of string
  if(str2.charAt(str2.length - 1) == " ")
    str2 = str2.substring(0, str2.length - 1);

  return str2;
}

function useBlackText(r, g, b){
  var gamma = 2.2;
  var L = 0.2126 * Math.pow( r, gamma )
          + 0.7152 * Math.pow( g, gamma )
          + 0.0722 * Math.pow( b, gamma );
  return (L > 0.5);
}

function getStandardPNString(str)
{
  var modified = true;
  while(modified)
  {
    var orig_length = str.length;
    str = removeStartingZeroes(str);
    str = removeEndTilde(str);
    str = removeEndArrow(str);
    str = removeEndExclaim(str);
    modified = (orig_length != str.length);
  }
  return str.toLowerCase();
}

function removeStartingZeroes(str)
{
  while(str.length > 0 && str[0] == "0")
    str = str.substring(1, str.length);
  return str;
}

function removeEndTilde(str)
{
  if(str.length > 0 && str[str.length - 1] == "~")
    str = str.substring(0, str.length - 1);
  return str;
}

function removeEndArrow(str)
{
  if(str.length > 1 && str[str.length - 2] == "-" && str[str.length - 1] == ">" )
    str = str.substring(0, str.length - 2);
  return str;
}

function removeEndExclaim(str)
{
  if(str.length > 0 && str[str.length - 1] == "!")
    str = str.substring(0, str.length - 1);
  return str;
}

function is_numeric(str){
  return /^\d+$/.test(str);
}

function is_alphanumeric(str){
  return /^[a-z0-9]+$/i.test(str);
}

function getRegexSafeSearchTerm(str)
{
  //Remove non numbers and letters and spaces
  var str2 = str.replace(/\\/g, "\\\\");
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

function getStringNumberHash(s)
{
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

function getColorFromString(str){
  var color = [Math.abs(getStringNumberHash(str + "!@#$%^&*()") % 256), Math.abs(getStringNumberHash(str + "!1234567890!") % 256), Math.abs(getStringNumberHash(str + "selamat pagi") % 256)];
  return color;
}

function toggle_similar_strings(){
  if(document.getElementById("similar_strings_div").style.display == "none"){
    document.getElementById("similar_strings_div").style.display = "block";
    document.getElementById("similar_strings_expander_icon").innerHTML = "-";
  }
  else{
    document.getElementById("similar_strings_div").style.display = "none";
    document.getElementById("similar_strings_expander_icon").innerHTML = "+";
  }
}

function toggle_search_results(state){ //0 hidden, 1 shown, 2 toggle
  if(state == 0){
    document.getElementById("search_results_div").style.display = "none";
    document.getElementById("search_results_expander_icon").innerHTML = "+";
  }
  else if (state == 1){
    document.getElementById("search_results_div").style.display = "block";
    document.getElementById("search_results_expander_icon").innerHTML = "-";
  }
  else{
    if(document.getElementById("search_results_div").style.display == "none"){
      document.getElementById("search_results_div").style.display = "block";
      document.getElementById("search_results_expander_icon").innerHTML = "-";
    }
    else{
      document.getElementById("search_results_div").style.display = "none";
      document.getElementById("search_results_expander_icon").innerHTML = "+";
    }
  }
}

function toggle_similar_string_table(id){
  var tableID = "similar_string_table_" + id;
  var expanderID = "similar_string_expander_" + id;
  if(document.getElementById(tableID).style.display == "none"){
    document.getElementById(tableID).style.display = "block";
    document.getElementById(expanderID).innerHTML = "-";
  }
  else{
    document.getElementById(tableID).style.display = "none";
    document.getElementById(expanderID).innerHTML = "+";
  }
}

function getContentIndexFrom_DB_ID(db_id){
  for(var i = 0; i < _content.length; ++i){
    if(_content[i][_content[i].length - 1] == db_id)
      return i;
  }
  console.log("Failed to find row with id " + db_id);
  return 0;
}

function sortContentByIndex(index)
{
  document.getElementById("message").innerHTML = "<p>Sorting by index...</p>";
  document.getElementById("sort_order_div").style.display = "none";
  document.getElementById("search_div").style.display = "none";
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("record_browser_div").style.display = "none";

  var _selectedRecord_DB_ID = null;
  if(_selectedTable == TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length){
    _selectedRecord_DB_ID = _content[_selectedRow][_content[_selectedRow].length - 1];
  }

  var index_array = [index];
  if(isArrayEqual(index_array, _contentSortedIndex)){
    _contentSortedReverse = !_contentSortedReverse;
  }
  else{
    _contentSortedReverse = false;
  }

  var sortWorker = new Worker('sort_content_by_index.js');
  sortWorker.postMessage([_content, index, INDEXES, _contentSortedReverse]);
  sortWorker.onmessage = function(e) {
    _content = e.data[0];
    generateContent_Standard();
    _contentSortedIndex = [index];
    populateRecordBrowser(0, false);
    document.getElementById("message").innerHTML = "";
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("record_browser_div").style.display = "block";
    if(_selectedTable == TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null){
      var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
      populateRecordBrowser(index1, false);
      var cell = getCell(index1, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(index1, _selectedCell, cell.id, _selectedTable);
    }
  }
}

function sortContentBySortOrder(order_index)
{
  document.getElementById("message").innerHTML = "<p>Sorting by index...</p>";
  document.getElementById("sort_order_div").style.display = "none";
  document.getElementById("search_div").style.display = "none";
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("record_browser_div").style.display = "none";

  var _selectedRecord_DB_ID = null;
  if(_selectedTable == TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length){
    _selectedRecord_DB_ID = _content[_selectedRow][_content[_selectedRow].length - 1];
  }

  var sorted_indexes = _sort_orders[order_index].sorted_indexes;
  if(isArrayEqual(sorted_indexes, _contentSortedIndex)){
    _contentSortedReverse = !_contentSortedReverse;
  }
  else{
    _contentSortedReverse = false;
  }

  var sortWorker = new Worker('sort_content_by_sort_order.js');
  sortWorker.postMessage([_content, sorted_indexes, INDEXES, _contentSortedReverse]);
  sortWorker.onmessage = function(e) {
    _content = e.data[0];
    generateContent_Standard();
    _contentSortedIndex = sorted_indexes;
    populateRecordBrowser(0, false);
    document.getElementById("message").innerHTML = "";
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("record_browser_div").style.display = "block";
    if(_selectedTable == TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null){
      var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
      populateRecordBrowser(index1, false);
      var cell = getCell(index1, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(index1, _selectedCell, cell.id, _selectedTable);
    }
  }
}

function generateContent_Standard(){
  _content_standard = [];
  for (var i = 0; i < _content.length; ++i) 
    _content_standard.push(getStandardRow(i));
  setLargestRecordNumber();
}

function generateContent_Standard_Row(rownum){
  _content_standard[rownum] = getStandardRow(rownum);
  setLargestRecordNumber();
}

function generateContent_Standard_New(){
  _content_standard.push(getStandardRow(_content.length - 1));
  setLargestRecordNumber();
}

function getStandardRow(content_index)
{
  var ilength = INDEXES.length;
  var newRow = [];
  for(var j = 0; j < ilength; ++j)
    newRow.push(standardizeString(_content[content_index][j]));
  
  for(var j = 0; j < MEMO_INDEXES.length; ++j)
  {
    var memoIndex = j + ilength;
    var array1 = [];
    for(var k = 0; k < _content[content_index][memoIndex].length; ++k)
    {
      array1.push(standardizeString(_content[content_index][memoIndex][k]));
    }
    newRow.push(array1);
  }
  newRow.push(_content[content_index][_content[content_index].length - 1]); //Copy database ID
  return newRow;
}

function onCellClick(row, cell, id, table_enum, skipPopulate)
{
  if(skipPopulate == null)
    skipPopulate = false;

  _isTableSelected = true;
  var elementRow = null;
  var elementCell = null;
  switch(_selectedTable){
    case TABLE_SEARCH_RESULTS:
      elementRow = document.getElementById("search_results_row_" + _selectedRow);
      elementCell = document.getElementById("search_results_cell_" + _selectedRow + "_" + _selectedCell);
    break;
    case TABLE_SIMILAR_STRINGS:
      elementRow = document.getElementById("similar_string_row_" + _selectedRow);
      elementCell = document.getElementById("similar_string_cell_" + _selectedRow + "_" + _selectedCell);
    break;
    case TABLE_RECORD_BROWSER:
      elementRow = document.getElementById("record_browser_row_" + _selectedRow);
      elementCell = document.getElementById("record_browser_cell_" + _selectedRow + "_" + _selectedCell);
    break;
  }
  if(elementRow != null)
    elementRow.style.backgroundColor = "";
  
  if(elementCell != null)
    elementCell.style.backgroundColor = "";
  
  _selectedTable = table_enum;
  _selectedRow = row;
  _selectedCell = cell;

  switch(_selectedTable){
    case TABLE_SEARCH_RESULTS:
      elementRow = document.getElementById("search_results_row_" + _selectedRow);
      if(!skipPopulate)
        populateRecordBrowser(_indexesSearchResults[row], true);
    break;
    case TABLE_SIMILAR_STRINGS:
      elementRow = document.getElementById("similar_string_row_" + _selectedRow);
      if(!skipPopulate)
        populateRecordBrowser(_indexesSimilarStrings[row], true);
    break;
    case TABLE_RECORD_BROWSER:
      elementRow = document.getElementById("record_browser_row_" + _selectedRow);
    break;
  }
  if(elementRow != null)
    elementRow.style.backgroundColor = _selectedRowColor;
  
  elementCell = document.getElementById(id);
  _selectedCellLastID = null;
  if(elementCell != null){
    elementCell.style.backgroundColor = _selectedCellColor;
    elementCell.scrollIntoView({behavior: "auto", block: "nearest", inline: "nearest"});
    _selectedCellLastID = id;
  }
}

function deselectTable(index){
  if(index != null)
    _selected_search_input = index;
  _isTableSelected = false;
  var elementRow;
  var elementCell;

  switch(_selectedTable){
    case TABLE_SEARCH_RESULTS:
      elementRow = document.getElementById("search_results_row_" + _selectedRow);
      elementCell = document.getElementById("search_results_cell_" + _selectedRow + "_" + _selectedCell);
    break;
    case TABLE_SIMILAR_STRINGS:
      elementRow = document.getElementById("similar_string_row_" + _selectedRow);
      elementCell = document.getElementById("similar_string_cell_" + _selectedRow + "_" + _selectedCell);
    break;
    case TABLE_RECORD_BROWSER:
      elementRow = document.getElementById("record_browser_row_" + _selectedRow);
      elementCell = document.getElementById("record_browser_cell_" + _selectedRow + "_" + _selectedCell);
    break;
  }
  if(elementRow != null)
    elementRow.style.backgroundColor = "";
  
  if(elementCell != null)
    elementCell.style.backgroundColor = "";
}

function getCell(row, column, table_enum)
{
  var elementCell = null;
  switch(table_enum){
    case TABLE_SEARCH_RESULTS:
      elementCell = document.getElementById("search_results_cell_" + row + "_" + column);
    break;
    case TABLE_SIMILAR_STRINGS:
      elementCell = document.getElementById("similar_string_cell_" + row + "_" + column);
    break;
    case TABLE_RECORD_BROWSER:
      elementCell = document.getElementById("record_browser_cell_" + row + "_" + column);
    break;
  }
  return elementCell;
}

function setRadioColumn()
{
  if(document.getElementById("radio_columns_specific").checked){
    document.getElementById("search_any_input_div").style.display = "none";
    document.getElementById("radio_columns_div").style.display = "block";
    document.getElementById("radio_columns_all_none_buttons_div").style.display = "";
  }
  else{
    document.getElementById("search_any_input_div").style.display = "block";
    document.getElementById("radio_columns_div").style.display = "none";
    document.getElementById("radio_columns_all_none_buttons_div").style.display = "none";
  }
}

function setRadioColumnsChecked(bool)
{
  var total_index_length = INDEXES.length + MEMO_INDEXES.length;
  for(var i = 0; i < total_index_length; ++i){
    document.getElementById("column_checkbox_" + i).checked = bool;
    if(!bool)
      document.getElementById("search_input_" + i).value = "";
  }
  
}

function setRadioColumnChecked(index){
  if(document.getElementById("search_input_" + index).value == "")
    document.getElementById("column_checkbox_" + index).checked = false;
  else
    document.getElementById("column_checkbox_" + index).checked = true;
}

function show_more_column_checkboxes(visible)
{
  if(visible){
    document.getElementById("show_more_column_checkboxes").style.display = "none";
    document.getElementById("radio_columns_checkboxes_more").style.display = "block";
  }
  else{
    document.getElementById("show_more_column_checkboxes").style.display = "block";
    document.getElementById("radio_columns_checkboxes_more").style.display = "none";
  }
}

function updateRecordBrowserMax(){
  var max = Number(document.getElementById("record_browser_max").value);
  document.getElementById("save_record_browser_max").style.display = "none";
  if(max > 0){
    _recordBrowserMax = max;
    populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  }
  else{
    document.getElementById("record_browser_max").value = 1;
  }
}

function updateSearchResultsMax(){
  var max = Number(document.getElementById("search_results_max").value);
  document.getElementById("save_search_results_max").style.display = "none";
  if(max > 0){
    _searchResultsMax = max;
    populateSearchResults(_currentSearchResultsStartIndex, false, false, -1);
  }
  else{
    document.getElementById("search_results_max").value = 1;
  }
}

function startEditRecord(record_id, rownum, row_id)
{
  for (var i = 0; i < _recordBrowserMax; ++i)
  {
    var icon = document.getElementById("edit_icon_" + i);
    if(icon != null)
      icon.style.display = "none";
  }
  var cells1 = document.getElementById(row_id).cells;
  for(var i = 0; i < INDEXES_CONCAT.length; ++i)
  {
    var index = INDEX_ORDER[i];
    if(index == 0){
      cells1[i].innerHTML = "<div style='display: flex; align-items: center; justify-content: center;'>" + 
      "<div style='flex-direction: column;'>" +
      "<button id='save_edit_record' onclick='saveEditRecord(" + rownum + ");' style='width: 60px;'>Save</button>" + 
      "<button id='cancel_edit_record' onclick='cancelEditRecord()' style='width: 60px; margin-top: 5px;'>Cancel</button>" + 
      "<button id='delete_edit_record' onclick='startDeleteRecord()' style='width: 60px; margin-top: 5px; color: red;'>Delete</button>" + 
      "<button id='confirm_delete_record' onclick='confirmDeleteRecord(" + rownum + ")' style='display: none; color: red;'>Confirm Delete</button>" + 
      "<button id='cancel_delete_record' onclick='cancelDeleteRecord();' style='display: none;'>Cancel Delete</button>" + 
      "</div>" +
      "<input type='text' id='edit_textarea_" + i + "' style='width: 50%;' onfocus='deselectTable();' onchange='deselectTable();' value=" + _content[rownum][index] + 
      "></input ></div>";
    }
    else if(index < INDEXES.length)
      cells1[i].innerHTML = "<input type='text' id='edit_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();' value=" + _content[rownum][index] + "></input>";
    else
      cells1[i].innerHTML = "<textarea id='edit_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'>" + stringifyArrayEndChar(_content[rownum][index], "\n") + "</textarea>";
  }
}

function saveEditRecord(rownum)
{
  for(var i = 0; i < INDEXES_CONCAT.length; ++i){
    var index = INDEX_ORDER[i];
    if(index < INDEXES.length)
      _content[rownum][index] = document.getElementById("edit_textarea_" + i).value;
    else //Memo Fields
      _content[rownum][index] = document.getElementById("edit_textarea_" + i).value.split("\n");
  }
  generateContent_Standard_Row(rownum);
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  var row = _content[rownum];
  var partObj = new Object();
  for(var i = 0; i < INDEXES.length; ++i)
    partObj[INDEXES[i]] = row[i];
  for(var i = 0; i < MEMO_INDEXES.length; ++i)
    partObj[MEMO_INDEXES[i]] = row[i + INDEXES.length];

  if(!LOCAL_MODE){
    var partRef = firebase.database().ref('parts_db/P&A_PRI/' + row[row.length - 1]);
    partRef.set(partObj);
  }
}

function cancelEditRecord(){
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
}

function startNewRecord(){
  var tableHTML = "<br><br><table><tr>";

  for(i = 0; i < INDEXES_CONCAT.length; ++i){
    var index = INDEX_ORDER[i];
    tableHTML += "<th><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
  }

  tableHTML += "</tr><tr>"

  for(var i = 0; i < INDEX_WIDTHS_CONCAT.length; ++i)
  {
    var index = INDEX_ORDER[i];
    if(index == 0){
      tableHTML += "<td><div style='display: flex; align-items: center; justify-content: center;'>" + 
      "<div style='flex-direction: column;'>" +
      "<button style='width: 60px;' onclick='saveNewRecord();'>Save</button>" + 
      "<button style='width: 60px; margin-top: 5px;' onclick='cancelNewRecord();'>Cancel</button>" + 
      "</div>" +
      "<input type='text' id='new_textarea_" + i + "' style='width: 50%;' onfocus='deselectTable();' onchange='deselectTable();' value=" + (_largestRecordNumber + 1) + "></input></div></td>";
    }
    else if(index < INDEXES.length)
      tableHTML += "<td><input type='text' id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></input></td>";
    else
      tableHTML += "<td><textarea id='new_textarea_" + i + "' style='width: " + INDEX_WIDTHS_CONCAT[index] + ";' onfocus='deselectTable();' onchange='deselectTable();'></textarea></td>";
  }

  tableHTML += "</tr></table><br>";
  document.getElementById("add_part_table_div").innerHTML = tableHTML;
}

function cancelNewRecord(){
  document.getElementById("add_part_table_div").innerHTML = "";
}

function saveNewRecord()
{
  var partsListRef = firebase.database().ref('parts_db/P&A_PRI');
  var newPartRef = (_largestRecordNumber + 1) + "n";
  if(!LOCAL_MODE) 
    newPartRef = partsListRef.push();

  _content.push(new Array(1 + INDEXES_CONCAT.length));
  var row = _content[_content.length - 1];
  for(var i = 0; i < INDEXES_CONCAT.length; ++i){
    var index = INDEX_ORDER[i];
    if(index < INDEXES.length)
      row[index] = document.getElementById("new_textarea_" + i).value;
    else
      row[index] = document.getElementById("new_textarea_" + i).value.split("\n");
  }
  if(LOCAL_MODE)
    row.push(newPartRef);
  else
    row.push(newPartRef.key);
  
  generateContent_Standard_New();
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  if(!LOCAL_MODE){
    var partObj = new Object();
    for(var i = 0; i < INDEXES.length; ++i)
      partObj[INDEXES[i]] = row[i];
    for(var i = 0; i < MEMO_INDEXES.length; ++i)
      partObj[MEMO_INDEXES[i]] = row[i + INDEXES.length];
    newPartRef.set(partObj);
  }
}

function startDeleteRecord(){
  document.getElementById("save_edit_record").style.display = "none";
  document.getElementById("cancel_edit_record").style.display = "none";
  document.getElementById("delete_edit_record").style.display = "none";
  document.getElementById("confirm_delete_record").style.display = "flex";
  document.getElementById("cancel_delete_record").style.display = "flex";
  document.getElementById("edit_textarea_0").style.display = "none";
}

function cancelDeleteRecord(){
  document.getElementById("save_edit_record").style.display = "flex";
  document.getElementById("cancel_edit_record").style.display = "flex";
  document.getElementById("delete_edit_record").style.display = "flex";
  document.getElementById("confirm_delete_record").style.display = "none";
  document.getElementById("cancel_delete_record").style.display = "none";
  document.getElementById("edit_textarea_0").style.display = "flex";
}

function confirmDeleteRecord(rownum)
{
  if(!LOCAL_MODE){
    var partRef = firebase.database().ref('parts_db/P&A_PRI/' + _content[rownum][_content[rownum].length - 1]);
    partRef.remove();
  }

  _content.splice(rownum, 1);
  _content_standard.splice(rownum, 1);

  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  setLargestRecordNumber();
  clearSearchResults();
}

function startNewSortOrder(id1){
  var newHTML = "<table><tr id='sort_order_row_" + id1 + "'><td style='width: 600px;'>" + 
  "<div style='display: flex; align-items: center; justify-content: center;'>" +
  "<div style='flex-direction: column; width: 100px;'>" + 
  "<button style='width: 70px; font-size: 20px;' onclick='saveNewSortOrder();'>Save</button><button style='width: 70px; font-size: 20px; margin-top: 5px;' onclick='cancelNewSortOrder();'>Cancel</button>" + 
  "</div>" +
  "<p style='font-size: 20px;'>Name&nbsp;</p><input id='sort_order_name_0' type='text' style='width: 500px; font-size: 20px;'>" + 
  "</div>" +
  "</td>" + getSortOrderNewCell(id1, 0) + "</tr></table>";
  document.getElementById("sort_order_table_new_div").innerHTML = newHTML;
  document.getElementById("button_add_sort_order").style.display = "none";
}

function getSortOrderNewCell(id1, id2)
{
  var newHTML = "<td id='sort_order_cell_" + id1 + "_" + id2 + "'><div style='display: flex; align-items: center; justify-content: center;'><select id='sort_order_select_" + id1 + "_" + id2 + "' style='font-size: 20px;'>";
  for(var i = 0; i < INDEXES_CONCAT.length; ++i)
  {
    var index = INDEX_ORDER[i];
    newHTML += "<option value='" + INDEXES_CONCAT[0] + "'>" + INDEXES_CONCAT[index] + "</option>";
  }
  var plusScript = "appendSortOrderCell(" + id1 + "," + id2 + ");";
  var minusScript = "removeSortOrderCell(" + id1 + "," + id2 + ");";
  var minusButton = "";
  if(id2 != 0)
    minusButton = "<button style='font-size: 20px; width: 50px; margin-top: 5px;' onclick='" + minusScript + "'>-</button>";
  newHTML += "</select>&nbsp;&nbsp;&nbsp;<div style='flex-direction: column; width: 50px;' id='sort_order_buttons_" + id1 + "_" + id2 + "'><button style='font-size: 20px; width: 50px;' onclick='" + plusScript + "'>+</button>" + minusButton + "</div></div></td>";
  return newHTML;
}

function getSortOrderCell(id1, id2, defaultIndex)
{
  var newHTML = "<td id='sort_order_cell_" + id1 + "_" + id2 + "'><div style='display: flex; align-items: center; justify-content: center;'><select id='sort_order_select_" + id1 + "_" + id2 + "' style='font-size: 20px; display: none;'>";
  for(var i = 0; i < INDEXES_CONCAT.length; ++i)
  {
    var index = INDEX_ORDER[i];
    newHTML += "<option value='" + INDEXES_CONCAT[defaultIndex] + "'>" + INDEXES_CONCAT[index] + "</option>";
  }
  var plusScript = "appendSortOrderCell(" + id1 + "," + id2 + ");";
  var minusScript = "removeSortOrderCell(" + id1 + "," + id2 + ");";
  var minusButton = "";
  if(id2 != 0)
    minusButton = "<button style='font-size: 20px; width: 50px; margin-top: 5px;' onclick='" + minusScript + "'>-</button>";
  newHTML += "</select>&nbsp;&nbsp;&nbsp;<div style='flex-direction: column; width: 50px; display: none;' id='sort_order_buttons_" + id1 + "_" + id2 + "'><button style='font-size: 20px; width: 50px;' onclick='" + plusScript + "'>+</button>" + minusButton + "</div></div>" + 
  "<p id='sort_order_static_cell_" + id1 + "_" + id2 + "' style='font-size: 15px;'>" + INDEXES_CONCAT[defaultIndex] + "</p>" +
  "</td>";
  return newHTML;
}

function appendSortOrderCell(id1, id2){
  var savedIndexes = [];
  var savedName = document.getElementById("sort_order_name_" + id1).value;
  for(var i = 0; i <= id2; ++i)
    savedIndexes.push(document.getElementById("sort_order_select_" + id1 + "_" + i).selectedIndex);
  
  document.getElementById('sort_order_row_' + id1).innerHTML += getSortOrderNewCell(id1, id2 + 1);
  document.getElementById("sort_order_buttons_" + id1 + "_" + id2).style.display = "none";
  for(var i = 0; i <= id2; ++i)
    document.getElementById("sort_order_select_" + id1 + "_" + i).selectedIndex = savedIndexes[i];
  document.getElementById("sort_order_name_" + id1).value = savedName;
}

function removeSortOrderCell(id1, id2){
  removeElement("sort_order_cell_" + id1 + "_" + id2);
  document.getElementById("sort_order_buttons_" + id1 + "_" + (id2 - 1)).style.display = "inline";
}

function cancelNewSortOrder(){
  document.getElementById("button_add_sort_order").style.display = "";
  document.getElementById("sort_order_table_new_div").innerHTML = "";
}

function saveNewSortOrder(){
  var i = 0;
  var sorted_indexes = [];
  while(document.getElementById("sort_order_select_0_" + i) != null){
    var select = document.getElementById("sort_order_select_0_" + i);
    sorted_indexes.push(select.selectedIndex);
    ++i;
  }

  if(sorted_indexes.length > 0){
    var sortObj = new Object();
    sortObj.name = document.getElementById("sort_order_name_0").value;
    sortObj.sorted_indexes = sorted_indexes;

    var sortListRef = firebase.database().ref('sort_orders');
    var newSortOrderRef = sortListRef.push();
    newSortOrderRef.set(sortObj);
  }

  cancelNewSortOrder();
}

function startEditSortOrder(id1)
{
  document.getElementById("sort_order_static_" + id1).style.display = "none";
  document.getElementById("sort_order_sort_button_" + id1).style.display = "none";
  document.getElementById("sort_order_buttons_" + id1).style.display = "flex";
  document.getElementById("sort_order_name_" + id1).value = _sort_orders[id1 - 1].name;
  var i = 0;
  while(document.getElementById("sort_order_static_cell_" + id1 + "_" + i) != null){
    document.getElementById("sort_order_static_cell_" + id1 + "_" + i).style.display = "none";
    var select1 = document.getElementById("sort_order_select_" + id1 + "_" + i);
    select1.style.display = "";
    select1.selectedIndex = _sort_orders[id1 - 1].sorted_indexes[i];
    ++i;
  }
  document.getElementById("sort_order_buttons_" + id1 + "_" + (i - 1)).style.display = "";
}

function saveEditSortOrder(id1)
{
  var i = 0;
  var sorted_indexes = [];
  while(document.getElementById("sort_order_select_" + id1 + "_" + i) != null){
    var select = document.getElementById("sort_order_select_" + id1 + "_" + i);
    sorted_indexes.push(select.selectedIndex);
    ++i;
  }

  if(sorted_indexes.length > 0){
    var sortObj = new Object();
    sortObj.name = document.getElementById("sort_order_name_" + id1).value;
    sortObj.sorted_indexes = sorted_indexes;

    var sortOrderRef = firebase.database().ref('sort_orders/' + _sort_orders[id1 - 1].key);
    sortOrderRef.set(sortObj);
  }
  populateSortOrders();
}

function startDeleteSortOrder(id1){
  document.getElementById("sort_order_button_save" + id1).style.display =   "none";
  document.getElementById("sort_order_button_cancel" + id1).style.display = "none";
  document.getElementById("sort_order_button_delete" + id1).style.display = "none";
  document.getElementById("sort_order_button_confirm_delete" + id1).style.display = "";
  document.getElementById("sort_order_button_cancel_delete" + id1).style.display =  "";
}

function cancelDeleteSortOrder(id1){
  document.getElementById("sort_order_button_save" + id1).style.display =   "";
  document.getElementById("sort_order_button_cancel" + id1).style.display = "";
  document.getElementById("sort_order_button_delete" + id1).style.display = "";
  document.getElementById("sort_order_button_confirm_delete" + id1).style.display = "none";
  document.getElementById("sort_order_button_cancel_delete" + id1).style.display =  "none";
}

function confirmDeleteSortOrder(id1)
{
  var sortOrderRef = firebase.database().ref('sort_orders/' + _sort_orders[id1 - 1].key);
  sortOrderRef.remove();
  populateSortOrders();
}

function stringifyArrayEndChar(array, endChar){
  var result = "";
  for(var i = 0; i < array.length; ++i)
  {
    result += array[i];
    if(i != array.length - 1)
      result += endChar;
  }
  return result;
}

function copyArray1D(array){
  var result = [];
  for(var i = 0; i < array.length; ++i){
    result.push(array[i]);
  }
  return result;
}

function setLargestRecordNumber(){
  _largestRecordNumber = 0;
  for (var i = 0; i < _content.length; ++i) {
    var recordnumber = Number(_content_standard[i][0]);
    if(recordnumber > _largestRecordNumber)
      _largestRecordNumber = recordnumber;
  }
}

function clearSearchResults(){
  document.getElementById("radio_columns_any").checked = true;
  document.getElementById("search_input").value = "";
  setRadioColumn();
  search_query();
}

function recordBrowserJumpToEdge(end){
  var index = 0;
  if(end == 0)
    populateRecordBrowser(0, false);
  else{
    populateRecordBrowser(_content.length - 1, false);
    index = _content.length - 1;
  }

  var cell = getCell(index, _selectedCell, TABLE_RECORD_BROWSER);
  if(cell != null)
    onCellClick(index, _selectedCell, cell.id, TABLE_RECORD_BROWSER);
}

function searchResultsJumpToEdge(end){
  var index = 0;
  if(end == 0)
    populateSearchResults(0, true, false, -1);
  else{
    populateSearchResults(_searchResults.length - 1, false, true, -1);
  }
}

function highlightString(str, termToHighlightList, preHTML_List, postHTML_List)
{
  var matchList = [];
  let match;
  var indexToPreHTMLs = new Map();
  var indexToPostHTMLs = new Map();

  for(var i = 0; i < termToHighlightList.length; ++i){
    var regexp = new RegExp(getRegexSafeSearchTerm(termToHighlightList[i]), "g");
    while ((match = regexp.exec(str)) !== null) {
      // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
      // expected output: "Found football start=6 end=14."
      // expected output: "Found foosball start=16 end=24."
      if(indexToPreHTMLs.has(match.index))
        indexToPreHTMLs.get(match.index).push(preHTML_List[i]);
      else{
        var value = [preHTML_List[i]];
        indexToPreHTMLs.set(match.index, value);
      }

      if(indexToPostHTMLs.has(regexp.lastIndex))
        indexToPostHTMLs.get(regexp.lastIndex).push(postHTML_List[i]);
      else{
        var value = [postHTML_List[i]];
        indexToPostHTMLs.set(regexp.lastIndex, value);
      }

      if(!matchList.includes(match.index))
        matchList.push(match.index);
      if(!matchList.includes(regexp.lastIndex))
        matchList.push(regexp.lastIndex);
    }
  }

  matchList.sort(COMPARE_NUMBERS);
  for(var i = matchList.length - 1; i >= 0; --i)
  {
    var index = matchList[i];
    if(indexToPreHTMLs.has(index)){
      var preHTML_List2 = indexToPreHTMLs.get(index);
      for(var j = 0; j < preHTML_List2.length; ++j)
        str = str.substring(0, index) + preHTML_List2[j] + str.substring(index, str.length);
    }

    if(indexToPostHTMLs.has(index)){
      var postHTML_List2 = indexToPostHTMLs.get(index);
      for(var j = 0; j < postHTML_List2.length; ++j)
        str = str.substring(0, index) + postHTML_List2[j] + str.substring(index, str.length);
    }
  }
  return str;
}

function highlightStringBasic(str, startIndexes, endIndexes, preHTML, postHTML)
{
  var str_length = str.length;
  var str2 = str;
  for(var i = str_length - 1; i >= 0; --i)
  {
    var debug_num = 0;
    if(endIndexes.includes(i)){
      str2 = str2.substring(0, i + 1) + postHTML + str2.substring(i + 1, str2.length);
      ++debug_num;
    }
    if(startIndexes.includes(i)){
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

function showRecordBrowserMax(){
  document.getElementById('save_record_browser_max').style.display = 'inline';
  deselectTable();
}

function showSearchResultsMax(){
  document.getElementById('save_search_results_max').style.display = 'inline';
  deselectTable();
}

function setMinRepititions(){
  _minRepititions = Number(document.getElementById("repititions_min").value);
  deselectTable();
}

function toggleDiv(bool, id1){
  if(bool != null){
    if(bool){
      document.getElementById(id1 + "_div").style.display = "block";
      document.getElementById(id1 + "_expander_icon").innerHTML = "-";
    }
    else{
      document.getElementById(id1 + "_div").style.display = "none";
      document.getElementById(id1 + "_expander_icon").innerHTML = "+";
    }
  }
  else{
    if(document.getElementById(id1 + "_div").style.display == "none"){
      document.getElementById(id1 + "_div").style.display = "block";
      document.getElementById(id1 + "_expander_icon").innerHTML = "-";
    }
    else{
      document.getElementById(id1 + "_div").style.display = "none";
      document.getElementById(id1 + "_expander_icon").innerHTML = "+";
    }
  }
}

function toggle_record_browser(bool)
{
  if(bool != null){
    if(bool){
      document.getElementById("record_browser_table_div").style.display = "block";
      document.getElementById("record_browser_expander_icon").innerHTML = "-";
    }
    else{
      document.getElementById("record_browser_table_div").style.display = "none";
      document.getElementById("record_browser_expander_icon").innerHTML = "+";
    }
  }
  else{
    if(document.getElementById("record_browser_table_div").style.display == "none"){
      document.getElementById("record_browser_table_div").style.display = "block";
      document.getElementById("record_browser_expander_icon").innerHTML = "-";
    }
    else{
      document.getElementById("record_browser_table_div").style.display = "none";
      document.getElementById("record_browser_expander_icon").innerHTML = "+";
    }
  }
}

function getExpandableHTML(str_array, id, char_limit, width)
{
  var str = stringifyArrayEndChar(str_array, "<br>");
  var result = str;
  if(str.length > char_limit){
    var id_str = "expandable_html_str_" + id;
    var id_str_short = "expandable_html_str_short_" + id;
    var id_more = "expandable_html_more_" + id;
    var id_less = "expandable_html_less_" + id;
    var str_short = stringifyArrayEndChar(str_array, " ").substring(0, char_limit) + "...";
    var scriptMore = "document.getElementById('" + id_str_short + "').style.display='none'; document.getElementById('" + id_str       + "').style.display=''; this.style.display='none'; document.getElementById('" + id_less + "').style.display=''";
    var scriptLess = "document.getElementById('" + id_str       + "').style.display='none'; document.getElementById('" + id_str_short + "').style.display=''; this.style.display='none'; document.getElementById('" + id_more + "').style.display=''";
    result = "<span id=" + id_str_short + ">" + str_short + "</span>" + 
             "<span id=" + id_str + " style='display: none;'>"       + str +       "</span><br>" + 
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

function isArrayEqual(array1, array2){
  if(array1.length != array2.length)
    return false;
  for(var i = 0; i < array1.length; ++i)
    if(array1[i] != array2[i])
      return false;

  return true;
}

function getSortColor(index)
{
  var pos = _contentSortedIndex.indexOf(index);
  var color1 = pos * (155/_contentSortedIndex.length) + 100;
  if(_contentSortedReverse){
    return ("rgb(255, " + color1 + "," + color1 + ");");
  }
  else{
    return ("rgb(" + color1 + "," + color1 + ", 255);");
  }
}

function recordViewIconMouseOver(id1){
  document.getElementById("record_view_icon_" + id1).style.display = "";
}

function recordViewIconMouseOut(id1){
  document.getElementById("record_view_icon_" + id1).style.display = "none";
}

function addRecordView(key)
{
  _recordViews.push(key);
  populateRecordViews();
}

function removeRecordView(pos)
{
  _recordViews.splice(pos, 1);
  populateRecordViews();
}

//type: 0 = different, 1 = similar
function getWordCompareIndexes(str1, str2, type)
{
  var str1_split = standardizeString(str1).split(" ");
  var str2_split = standardizeString(str2).split(" ");
  var noMatchIndexes = [];
  var matchIndexes = [];
  var ignoreIndexes = [];
  for(var i = 0; i < str2_split.length; ++i)
  {
    var str2_word = str2_split[i];
    if(WORDS_TO_IGNORE.includes(str2_word))
    {
      ignoreIndexes.push(i);
    }
    else
    {
      // var result = str1_standard.match(getRegexSafeSearchTerm(str2_word));
      if(str1_split.includes(str2_word))
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
  while(i2 < str2_lower.length && str2_lower.charAt(i2) == " ")
    ++i2;
  var lastSpace = i2 - 1;
  while(i2 < str2_lower.length)
  {
    var str2_char = str2_lower.charAt(i2);
    if(str2_char != " " && is_standardized(str2_char))
      inWord = true;
    if(inWord && str2_char == " ")
    {
      inWord = false;
      wordStartIndexes.push(lastSpace + 1);
      wordEndIndexes.push(i2 - 1);
    }
    else if(inWord && i2 == str2_lower.length - 1)
    {
      inWord = false;
      wordStartIndexes.push(lastSpace + 1);
      wordEndIndexes.push(i2);
    }
    if(str2_char == " ")
      lastSpace = i2;
    ++i2;
  }

  var indexObj = new Object();
  indexObj.startIndexes = [];
  indexObj.endIndexes = [];

  if(type == 0)
  {
    for(var i = 0; i < noMatchIndexes.length; ++i){
      indexObj.startIndexes.push(wordStartIndexes[noMatchIndexes[i]]);
      indexObj.endIndexes.push(    wordEndIndexes[noMatchIndexes[i]]);
    }
  }
  else{
    for(var i = 0; i < matchIndexes.length; ++i){
      indexObj.startIndexes.push(wordStartIndexes[matchIndexes[i]]);
      indexObj.endIndexes.push(    wordEndIndexes[matchIndexes[i]]);
    }
  }
  return indexObj;
}

function setRecordViewHighlightType(type)
{
  _recordViewHightlightType = type;
  populateRecordViews();
  if(type == 0)
    document.getElementById("radio_record_views_differences").checked = true;
  else
    document.getElementById("radio_record_views_similarities").checked = true;
}

function toggleRecordViewMemo(id1)
{
  var buttonShow = document.getElementById("record_view_memo_show_" + id1);
  if(buttonShow.style.display == "none")
  {
    document.getElementById("record_view_memo_show_" + id1).style.display = "";
    document.getElementById("record_view_memo_hide_" + id1).style.display = "none";
  }
  else
  {
    document.getElementById("record_view_memo_show_" + id1).style.display = "none";
    document.getElementById("record_view_memo_hide_" + id1).style.display = "";
  }

}