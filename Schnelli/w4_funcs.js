function processCSVData(allText) {
  var quotes = false;
  var row = 0;
  var column = 1;
  var start = 0;
  var end = 0;
  _content = new Array(25862);
  // _indexToContentID = new Array(25862);
  for (var i = 0; i < _content.length; ++i) { 
    _content[i] = new Array(indexes.length);
    _content[i][0] = i + "n";
    // _indexToContentID[i] = _content[i][0];
    for(var j = 1; j < indexes.length + 1; ++j){
      _content[i][j] = "";
    }
  } 
  for(var i = 0; i < allText.length; ++i)
  {
    var n = allText.charAt(i);
    if(n == '\"'){
      quotes = !quotes;
    }
    else if(n == ',' && !quotes){
      end = i;
      _content[row][column] = allText.substring(start, end);
      ++column;
      start = i + 1;
    }
    else if(n == '\n'){
      end = i;
      _content[row][column] = allText.substring(start, end);
      column = 1;
      ++row;
      start = i + 1;
    }
  }
  generateContent_Standard();
  populateRecordBrowser(0, false);
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

function is_numeric(str){
  return /^\d+$/.test(str);
}

function is_alphanumeric(str){
  return /^[a-z0-9]+$/i.test(str);
}

function getRegexSafeSearchTerm(str)
{
  //Remove non numbers and letters and spaces
  var str2 = str.replace(/\(/g, "\\(");
  str2 = str2.replace(/\)/g, "\\)");
  str2 = str2.replace(/\+/g, "\\+");
  str2 = str2.replace(/\-/g, "\\-");
  str2 = str2.replace(/\?/g, "\\?");
  str2 = str2.replace(/\!/g, "\\!");
  str2 = str2.replace(/\\/g, "\\");
  str2 = str2.replace(/\*/g, "\\*");
  str2 = str2.replace(/\,/g, "\\,");
  str2 = str2.replace(/\./g, "\\.");
  str2 = str2.replace(/\^/g, "\\^");
  str2 = str2.replace(/\$/g, "\\$");
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
    if(_content[i][0] == db_id)
      return i;
  }
  console.log("Failed to find row with id " + db_id);
  return 0;
}

function sortContentByIndex(index)
{
  document.getElementById("message").innerHTML = "<p>Sorting by index...</p>";
  document.getElementById("search_div").style.display = "none";
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("record_browser_table_div").style.display = "none";

  var _selectedRecord_DB_ID = null;
  if(_selectedTable == TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length){
    _selectedRecord_DB_ID = _content[_selectedRow][0];
  }

  if(index == _contentSortedIndex){
    _contentSortedReverse = !_contentSortedReverse;
  }
  else{
    _contentSortedReverse = false;
  }

  var sortWorker = new Worker('sort_content_by_index.js');
  sortWorker.postMessage([_content, index, indexes, _contentSortedReverse]);
  sortWorker.onmessage = function(e) {
    _content = e.data[0];
    _content_standard = e.data[1];
    _contentSortedIndex = index;
    populateRecordBrowser(0, false);
    document.getElementById("message").innerHTML = "";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("record_browser_table_div").style.display = "block";
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
  for (var i = 0; i < _content.length; ++i) {
    _content_standard.push(new Array(indexes.length + 1));
    _content_standard[i][0] = _content[i][0]; //Copy database ID
    for(var j = 1; j < indexes.length + 1; ++j)
    {
      _content_standard[i][j] = standardizeString(_content[i][j]);
    }
  }
  setLargestRecordNumber();
}

function generateContent_Standard_Row(rownum){
  for(var j = 1; j < indexes.length + 1; ++j)
  {
    _content_standard[rownum][j] = standardizeString(_content[rownum][j]);
  }
  setLargestRecordNumber();
}

function generateContent_Standard_New(){
  _content_standard.push(new Array());
  var row = _content_standard[_content_standard.length - 1];
  row.push("");
  var index = _content.length - 1;
  for(var j = 1; j < indexes.length + 1; ++j)
  {
    row.push(standardizeString(_content[index][j]));
  }
  setLargestRecordNumber();
}

function onCellClick(row, cell, id, table_enum)
{
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
      populateRecordBrowser(_indexesSearchResults[row], true);
    break;
    case TABLE_SIMILAR_STRINGS:
      elementRow = document.getElementById("similar_string_row_" + _selectedRow);
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

function deselectTable(){
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
  if(document.getElementById("radio_columns_specific").checked)
    document.getElementById("radio_columns_checkboxes").style.display = "block";
  else
    document.getElementById("radio_columns_checkboxes").style.display = "none";
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
  for(var i = 0; i < cells1.length; ++i)
  {
    if(i == 0){
      cells1[i].innerHTML = "<div style='display: flex; align-items: center; justify-content: center;'>" + 
      "<div flex-direction: column;>" +
      "<button id='save_edit_record' onclick='saveEditRecord(" + rownum + ");' style='width: 60px;'>Save</button>" + 
      "<button id='cancel_edit_record' onclick='cancelEditRecord()' style='width: 60px;'>Cancel</button>" + 
      "<button id='delete_edit_record' onclick='startDeleteRecord()' style='width: 60px; color: red;'>Delete</button>" + 
      "<button id='confirm_delete_record' onclick='confirmDeleteRecord(" + rownum + ")' style='display: none; color: red;'>Confirm Delete</button>" + 
      "<button id='cancel_delete_record' onclick='cancelDeleteRecord();' style='display: none;'>Cancel Delete</button>" + 
      "</div>" +
      "<textarea id='edit_textarea_" + i + "' style='width: 50%;' onfocus='deselectTable();' onchange='deselectTable();'>" + _content[rownum][i + 1] + 
      "</textarea ></div>";
    }
    else
      cells1[i].innerHTML = "<textarea id='edit_textarea_" + i + "' style='width: " + indexWidths[i] + ";' onfocus='deselectTable();' onchange='deselectTable();'>" + _content[rownum][i + 1] + "</textarea >";
  }
}

function saveEditRecord(rownum)
{
  for(var i = 0; i < indexes.length; ++i)
    _content[rownum][i + 1] = document.getElementById("edit_textarea_" + i).value;
  
  generateContent_Standard_Row(rownum);
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  var row = _content[rownum];
  var partObj = new Object();
  for(var i = 0; i < indexes.length; ++i)
    partObj[indexes[i]] = row[i + 1];
  
  var partRef = firebase.database().ref('parts/' + row[0]);
  partRef.set(partObj);
}

function cancelEditRecord(){
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
}

function startNewRecord(){
  var tableHTML = "<br><br><table><tr>";

  for(i = 0; i < indexes.length; ++i)
    tableHTML += "<th><div style='width: " + indexWidths[i] + ";'>" + indexes[i] + "</div></th>";

  tableHTML += "</tr><tr>"

  for(var i = 0; i < indexes.length; ++i)
  {
    if(i == 0){
      tableHTML += "<td><div style='display: flex; align-items: center; justify-content: center;'>" + 
      "<div flex-direction: column;>" +
      "<button style='width: 60px;' onclick='saveNewRecord();'>Save</button>" + 
      "<button style='width: 60px;' onclick='cancelNewRecord();'>Cancel</button>" + 
      "</div>" +
      "<textarea id='new_textarea_" + i + "' style='width: 50%;' onfocus='deselectTable();' onchange='deselectTable();'>" + (_largestRecordNumber + 1) + "</textarea ></div></td>";
    }
    else
      tableHTML += "<td><textarea id='new_textarea_" + i + "' style='width: " + indexWidths[i] + ";' onfocus='deselectTable();' onchange='deselectTable();'></textarea ></td>";
  }

  tableHTML += "</tr></table><br>";
  document.getElementById("add_part_table_div").innerHTML = tableHTML;
}

function cancelNewRecord(){
  document.getElementById("add_part_table_div").innerHTML = "";
}

function saveNewRecord()
{
  var partsListRef = firebase.database().ref('parts');
  var newPartRef = partsListRef.push();
  _content.push(new Array);
  var row = _content[_content.length - 1];
  row.push(newPartRef.key);
  for(var i = 0; i < indexes.length; ++i){
    row.push(document.getElementById("new_textarea_" + i).value);
  }
  
  generateContent_Standard_New();
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  var partObj = new Object();
  for(var i = 0; i < indexes.length; ++i)
    partObj[indexes[i]] = row[i + 1];
  
  newPartRef.set(partObj);
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

function confirmDeleteRecord(rownum){
  var partRef = firebase.database().ref('parts/' + _content[rownum][0]);
  partRef.remove();

  _content.splice(rownum, 1);
  _content_standard.splice(rownum, 1);

  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  setLargestRecordNumber();
  clearSearchResults();
}

function setLargestRecordNumber(){
  _largestRecordNumber = 0;
  for (var i = 0; i < _content.length; ++i) {
    var recordnumber = Number(_content_standard[i][1]);
    if(recordnumber > _largestRecordNumber)
      _largestRecordNumber = recordnumber;
  }
}

function clearSearchResults(){
  document.getElementById("search_input").value = "";
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
}