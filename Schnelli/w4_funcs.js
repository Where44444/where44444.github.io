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

function getExtraDBPartManufacturer(i, j) {
  var MFR_INDEXES = ["PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"];
  var part = _content_extra[i][j][0];
  for (var k = 0; k < MFR_INDEXES.length; ++k) {
    var mfr = part[MFR_INDEXES[k]];
    if (mfr != null) {
      return mfr;
    }
  }
}

function getParentIndexFromID(id1) {
  var numRecords = _content.length;
  for (var i = 0; i < numRecords; ++i) {
    if (_content[i][_content[i].length - 1] == id1)
      return i;
  }
  return null;
}

var _extradb_link_index_cache = [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()];
function getExtraDBLinkIndex(db, pn) {
  if (pn.length > 0) {
    if (_extradb_link_index_cache[db].has(pn)) {
      var index = _extradb_link_index_cache[db].get(pn);
      if (_content_extra[db].length > index && String(_content_extra[db][index][0].PN) == pn) //Only include exact match PN in cache to ensure it doesn't load inferior match if indexes are changed
      {
        return index;
      }
      _extradb_link_index_cache[db].delete(pn); //Cache invalid
    }

    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match PN
    {
      if (String(_content_extra[db][i][0].PN) == pn) {
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
      if (String(_content_extra[db][i][0][_EXTRA_DB_FIELDS[db][_AKA_GLOBAL]]) == pn) {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0][_EXTRA_DB_FIELDS[db][_AKA_GLOBAL]])) == pn1) //General match AKA
      {
        return i;
      }
    }
  }
  return null;
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

function removePreWP(str) {
  var str2 = String(str).toLowerCase();
  if (str2.length >= 2 && str2.charAt(0) == 'w' && str2.charAt(1) == 'p') {
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
  var str2 = String(str).replace(/&/g, "&amp;");
  str2 = str2.replace(/</g, "&lt;");
  str2 = str2.replace(/>/g, "&gt;");
  str2 = str2.replace(/"/g, "&quot;");
  str2 = str2.replace(/'/g, "&apos;");
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


var _DBID_to_ContentIndex_Cache = new Map();
function getContentIndexFrom_DB_ID(db_id) {
  if (_DBID_to_ContentIndex_Cache.has(db_id)) {
    var index = _DBID_to_ContentIndex_Cache.get(db_id);
    if (_content.length > index && _content[index][_content[index].length - 1] == db_id) {
      return index;
    }
    else {
      _DBID_to_ContentIndex_Cache.delete(db_id);
    }
  }

  for (var i = 0; i < _content.length; ++i) {
    if (_content[i][_content[i].length - 1] == db_id) {
      _DBID_to_ContentIndex_Cache.set(db_id, i);
      return i;
    }
  }
  // console.log("Failed to find content row with id " + db_id);
  return null;
}

function getContentExtraIndexFrom_DB_ID(db_id, db_index) {
  for (var i = 0; i < _content_extra[db_index].length; ++i) {
    if (_content_extra[db_index][i][1] == db_id)
      return i;
  }
  // console.log("Failed to find content extra row with id " + db_id);
  return null;
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
  var textele_new = document.getElementById("new_textarea_1");

  if (table_enum != _TABLE_RECORD_BROWSER || (textele_edit == null && textele_new == null)) //Prevents record browser from being selected while editing
  {
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
        // if (!skipPopulate)
        //   populateRecordBrowser(_searchResults_ContentIndexes[row], true);
        break;
      case _TABLE_SIMILAR_STRINGS:
        elementRow = document.getElementById("similar_string_row_" + _selectedRow);
        // if (!skipPopulate)
        //   populateRecordBrowser(_indexesSimilarStrings[row], true);
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

function saveContentToDatabase(rownum, addChangeAlert) {
  if (addChangeAlert == null)
    addChangeAlert = true;
  if (!_DEBUG_LOCAL_MODE) {
    var row = _content[rownum];
    var partObj = new Object();
    for (var i = 0; i < _INDEXES.length; ++i)
      partObj[_INDEXES[i]] = row[i];
    for (var i = 0; i < _MEMO_INDEXES.length; ++i)
      partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
    writeToDatabase('parts_db/P&A_PRI/' + row[row.length - 1], partObj, addChangeAlert, true, false, null);
  }
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
    if (oemString.length > 3) {
      if (oemString.substring(0, 3).toLowerCase() == "oem") {
        var oemNumber = Number(oemString.substring(3, oemString.length));
        if (oemNumber > _largestOEMNumber)
          _largestOEMNumber = oemNumber;
      }
    }
  }
}

function highlightString(str1, termToHighlightList, preHTML_List, postHTML_List) {
  var matchList = [];
  let match;
  var indexToPreHTMLs = new Map();
  var indexToPostHTMLs = new Map();
  var str = String(str1);
  for (var i = 0; i < termToHighlightList.length; ++i) {
    var regexTerm = getRegexSafeSearchTerm(termToHighlightList[i]);
    if (regexTerm != "" && regexTerm != " ") {
      var regexp = new RegExp(regexTerm, "g");
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
  }

  matchList.sort(COMPARE_NUMBERS);
  for (var i = matchList.length - 1; i >= 0; --i) {
    var index = matchList[i];
    if (indexToPreHTMLs.has(index)) {
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
    if (endIndexes.includes(i)) {
      str2 = str2.substring(0, i + 1) + postHTML + str2.substring(i + 1, str2.length);
    }
    if (startIndexes.includes(i)) {
      str2 = str2.substring(0, i) + preHTML + str2.substring(i, str2.length);
    }
  }
  return str2;
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

function getExpandableHTML(str_array, id, char_limit, width, /*optional*/ html_string, /*optional*/ string_to_highlight, highlight_term) {
  var str;
  var content_str;

  if (string_to_highlight != null) {
    str = string_to_highlight;
    content_str = string_to_highlight;
  }
  else if (html_string != null) {
    str = html_string;
    content_str = html_string.replace(/(<([^>]+)>)/ig, ''); //Strip html tags
  }
  else {
    str = stringifyArrayEndChar(str_array, "<br>");
    content_str = str;
  }

  var startHighlight = "<span style='background: yellow;'>";
  var endHighlight = "</span>";
  var result = str;
  if (content_str.length > char_limit) {
    var id_str = "expandable_html_str_" + id;
    var id_str_short = "expandable_html_str_short_" + id;
    var id_more = "expandable_html_more_" + id;
    var id_less = "expandable_html_less_" + id;
    var str_short;
    if (string_to_highlight != null) {
      str = highlightStringEZ(string_to_highlight, highlight_term, startHighlight, endHighlight);
      str_short = string_to_highlight.substring(0, char_limit) + "...";
      str_short = highlightStringEZ(str_short, highlight_term, startHighlight, endHighlight);
    }
    else if (html_string != null) {
      str_short = "<div style='overflow: hidden; width: " + width + "; height: 18px; text-overflow: ellipsis; white-space: nowrap; display: block;'>" + html_string.replace(/<br>/g, " ") + "</div>";
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
  else if (highlight_term != null) {
    result = highlightStringEZ(result, highlight_term, startHighlight, endHighlight);
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

function deleteFromDatabase(key, addChangeAlert, is_content, is_content_extra, content_extra_db) {
  deleteFromDB(key, null);
  if (addChangeAlert) {
    addNewChangeAlert(key, true, is_content, is_content_extra, content_extra_db);
  }
}

function writeToDatabase(key_path, value, addChangeAlert, is_content, is_content_extra, content_extra_db, is_list) {
  writeToDB(key_path, value, null);
  if (addChangeAlert) {
    addNewChangeAlert(key_path, false, is_content, is_content_extra, content_extra_db);
  }
}

var MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
function addNewChangeAlert(key, deleted, is_content, is_content_extra, content_extra_db) {
  readFromDB("change_alerts", function (val0, key0) {
    var numChildren = objSize(val0);
    var i = 0;
    var obj = new Object();
    obj.key = key;
    obj.time = new Date().getTime();
    obj.deleted = deleted;
    obj.is_content = is_content;
    obj.is_content_extra = is_content_extra;
    obj.content_extra_db = content_extra_db;
    var ref2_keyPath = getNewKeyPath("change_alerts");
    if (numChildren == 0) {
      writeToDB(ref2_keyPath, obj, null);
    }
    else {
      for (let [key1, val] of Object.entries(val0)) {
        ++i;
        if (val.key == key)
          deleteFromDB("change_alerts/" + key1, null);

        if (i == numChildren) {
          writeToDB(ref2_keyPath, obj, null);
        }
      }
    }
  });
}

var _CHANGE_ALERTS_CACHE = [];
function loadChangeAlerts() {
  addDBListener("change_alerts", function (val0, key0) {
    for (let [key, val] of Object.entries(val0)) {
      var alertOBJ = val;
      var isCached = doesChangeAlertsCacheContainMatch(alertOBJ);
      if (!isCached) {
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
        deleteFromDB("change_alerts/" + key, null);
    }
  });
}

function doesChangeAlertsCacheContainMatch(changeAlert) {
  var duplicateAlert_IndexesToRemove = [];
  for (var i = 0; i < _CHANGE_ALERTS_CACHE.length; ++i) {
    var matchFound = true;
    var cacheobj = _CHANGE_ALERTS_CACHE[i];
    if (matchFound && changeAlert.content_extra_db != cacheobj.content_extra_db)
      matchFound = false;
    if (matchFound && changeAlert.deleted != cacheobj.deleted)
      matchFound = false;
    if (matchFound && changeAlert.is_content != cacheobj.is_content)
      matchFound = false;
    if (matchFound && changeAlert.is_content_extra != cacheobj.is_content_extra)
      matchFound = false;
    if (matchFound && changeAlert.key != cacheobj.key)
      matchFound = false;
    if (matchFound && changeAlert.time != cacheobj.time) {
      duplicateAlert_IndexesToRemove.push(i);
      matchFound = false;
    }
    if (matchFound) {
      removeIndexesFromArray(_CHANGE_ALERTS_CACHE, duplicateAlert_IndexesToRemove);
      return true;
    }
  }
  removeIndexesFromArray(_CHANGE_ALERTS_CACHE, duplicateAlert_IndexesToRemove);
  return false;
}

function reloadContentFromChangeAlert(alertOBJ) {
  readFromDB(alertOBJ.key, function (val0, key0) {
    var rownum = getContentIndexFrom_DB_ID(key0);
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
          content_line.push(String(val0[_INDEXES[i]]));
        for (var i = 0; i < _MEMO_INDEXES.length; ++i) {
          var memolines = val0[_MEMO_INDEXES[i]];
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
        content_line.push(String(val0[_INDEXES[i]]));
      for (var i = 0; i < _MEMO_INDEXES.length; ++i) {
        var memolines = val0[_MEMO_INDEXES[i]];
        for (var j = 0; j < memolines.length; ++j)
          memolines[j] = String(memolines[j]);
        content_line.push(memolines);
      }
      content_line.push(key0);
      _content.push(content_line);
      generateContent_Standard_New();
    }
  });
}

function reloadContentExtraFromChangeAlert(alertOBJ) {
  readFromDB(alertOBJ.key, function (val0, key0) {
    var rownum = getContentExtraIndexFrom_DB_ID(key0, alertOBJ.content_extra_db);
    if (rownum != null) {
      if (alertOBJ.deleted) //Delete Record
      {
        _content_extra[alertOBJ.content_extra_db].splice(rownum, 1);
      }
      else //Edit Record
      {
        _content_extra[alertOBJ.content_extra_db][rownum][0] = val0;
      }
    }
    else if (!alertOBJ.deleted) //New record
    {
      var arr = [val0, key0];
      _content_extra[alertOBJ.content_extra_db].push(arr);
    }
    populateRecordViews();

    _CHILD_PART_LINKS_CACHE.clear();
  });
}

function edit_content(rownum, field, value) {
  var index = INDEXES_CONCAT.indexOf(field);
  _content[rownum][index] = value;
  generateContent_Standard_Row(rownum);
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  populateRecordViews();
}

function saveContentExtraToDatabase(i, j) {
  var extraobj = _content_extra[i][j][0];
  if (!_DEBUG_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[i] + "/" + _content_extra[i][j][1], extraobj, true, false, true, i);
  _CHILD_PART_LINKS_CACHE.clear();
}

var TAB_DIVS = ["TAB_search", "TAB_record_views", "TAB_record_browser", "TAB_part_child_record_manager", "TAB_sort_order", "TAB_part_history", "TAB_fileinput", "TAB_reorders", "TAB_invoice_history", "TAB_invoice_settings", "TAB_invoice", "TAB_mainmenu", "TAB_search_results", "TAB_add_invoice", "TAB_people", "TAB_suggestions"];
var TAB_MAINMENU_DIVS = [
  '<span style="color:white">S</span>earch',
  'Record <span style="color:white">V</span>iews',
  'Record <span style="color:white">B</span>rowser',
  '<span style="color:white">P</span>art Child Record Manager',
  'S<span style="color:white">o</span>rt Orders',
  'Par<span style="color:white">t</span> History',
  'P<span style="color:white">D</span>F Import',
  '<span style="color:white">R</span>eorders',
  'Invoice <span style="color:white">H</span>istory',
  'Invoice S<span style="color:white">e</span>ttings',
  '<span style="color:white">I</span>nvoice',
  '',
  'Se<span style="color:white">a</span>rch Results',
  'Add <span style="color:white">N</span>ew Invoice',
  '',
  ''
];

var TAB_SEARCH = 0;
var TAB_RECORD_VIEWS = 1;
var TAB_RECORD_BROWSER = 2;
var TAB_PART_CHILD_RECORD_MANAGER = 3;
var TAB_SORT_ORDERS = 4;
var TAB_PART_HISTORY = 5;
var TAB_PDF_IMPORT = 6;
var TAB_REORDERS = 7;
var TAB_INVOICE_HISTORY = 8;
var TAB_INVOICE_SETTINGS = 9;
var TAB_INVOICE = 10;
var TAB_MAINMENU = 11;
var TAB_SEARCH_RESULTS = 12;
var TAB_ADD_INVOICE = 13;
var TAB_PEOPLE = 14;
var TAB_SUGGESTIONS = 15;
var TAB_SYNC_DB = -1;

var _selected_tab = 0;
var last_selected_tab = 0;

function setTab(num) {
  if (num == TAB_PEOPLE) {
    if (_current_employee.admin == null || !_current_employee.admin)
      return;
    else
      updateEmployeeIDsTable();
    updateClientsTable();
  }

  if (num == TAB_SUGGESTIONS) {
    if (!_FIREBASE_LOGGED_IN) {
      _current_login_temp_intent = TAB_SUGGESTIONS;
      document.getElementById("firebase_temp_login_header").innerHTML = "Login to FireBase to View Part Suggestions";
      document.getElementById("firebase_temp_login_div").style.display = "";
      document.getElementById("password_input_temp").value = "";
      document.getElementById("email_input_temp").focus();
      document.getElementById("email_input_temp").select();
      document.getElementById("content_div").style.display = "none";
      return;
    }
  }

  if (_selected_tab == TAB_INVOICE) //Leaving Invoice Tab
    saveInvoiceToObject();

  _selected_searchQuery_scope = _SEARCHSCOPE_NEW;
  document.getElementById("search_scope_indicator").innerHTML = "";
  deselectTable();
  shortcutmenu_mainmenu_available = (num == TAB_MAINMENU);
  last_selected_tab = _selected_tab;
  _selected_tab = num;
  for (var i = 0; i < TAB_DIVS.length; ++i) {
    document.getElementById(TAB_DIVS[i] + "_div").style.display = "none";
    // document.getElementById(TAB_DIVS[i]).style.borderBottomColor = "#70A2FF";
    document.getElementById(TAB_DIVS[i]).style.backgroundColor = "#70A2FF";
    document.getElementById(TAB_DIVS[i]).style.fontWeight = "";
  }

  if (num >= 0) {
    document.getElementById(TAB_DIVS[num] + "_div").style.display = "";
    // document.getElementById(TAB_DIVS[num]).style.borderBottomColor = "transparent";
    document.getElementById(TAB_DIVS[num]).style.backgroundColor = "#436199";
    document.getElementById(TAB_DIVS[num]).style.fontWeight = "700";
  }

  if (num == TAB_SEARCH) {
    clearSearchPartNumInputs();
    clearSearchStandardInputs();
    // var ele = document.getElementById("search_input_" + _INDEX_ORDER[0]);
    // if(ele != null && document.getElementById("radio_columns_div").style.display != "none")
    // {
    //   ele.focus();
    //   ele.select();    
    // }
    var ele = document.getElementById("search_div");
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }

  if (num == TAB_SEARCH_RESULTS) {
    var cell = getCell(0, _selectedCell, _TABLE_SEARCH_RESULTS);
    if (cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
    if (_search_results_resorted)
      populateSearchResults(_currentSearchResultsStartIndex, false, false, -1);
  }
  if (num == TAB_RECORD_VIEWS)
    populateRecordViews();
  if (num == TAB_RECORD_BROWSER) {
    _record_browser_filter_string_Standardized = null;
    populateRecordBrowser(_currentRecordBrowserStartIndex, _highlightgreen_requested);
    _highlightgreen_requested = false;
    var cell = getCell(_selectedRow, _selectedCell, _TABLE_RECORD_BROWSER);
    if (cell != null)
      onCellClick(_selectedRow, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
  }
  if (num == TAB_PART_HISTORY) {
    populatePartHistory();
  }
  if (num == TAB_INVOICE) {
    document.getElementById("non_invoice_content").style.display = "none";
    document.getElementById("exit_invoice_button").style.display = "block";
    document.getElementById("invoice_content").style.display = "";
    populateInvoice();

    var ele = document.getElementById("invoice_input_invoice_no");
    if (ele != null && ele.style.display != "none") {
      ele.focus();
    }
  }
  else if (num == TAB_ADD_INVOICE) {
    populateAddNewInvoice();
    var ele = document.getElementById("invoice_input_invoice_no");
    if (ele != null && ele.style.display != "none") {
      ele.focus();
    }
  }
  else {
    document.getElementById("non_invoice_content").style.display = "";
    document.getElementById("exit_invoice_button").style.display = "none";
    document.getElementById("exit_invoice_from_new_button").style.display = "none";
    document.getElementById("invoice_content").style.display = "none";
    document.getElementById("add_invoice_content").style.display = "none";
    clearInvoicesContent();
  }

  document.getElementById("invoice_from_history_content").style.display = "none";

  if (num == TAB_REORDERS) {
    updateReorderParentIDs();
  }

  if (num == TAB_INVOICE_HISTORY)
    populateInvoiceHistory();

  if (num == TAB_INVOICE_SETTINGS) {
    var ele = document.getElementById("invoice_address_textarea");
    if (ele != null && ele.style.display != "none") {
      ele.focus();
    }
  }

  if (num != TAB_INVOICE_SETTINGS && num != TAB_INVOICE && num != TAB_ADD_INVOICE && num != TAB_SEARCH) {
    document.activeElement.blur();
  }

  if (num == TAB_SUGGESTIONS) {
    updateSuggestionsBox();
  }

  setKeyboardShortcutBar();
}

function doesObjectArraySpecificIndexIncludeX(array, values, indexes) {
  for (var i = 0; i < array.length; ++i) {
    var match = true;
    for (var j = 0; j < values.length; ++j) {
      if (array[i][indexes[j]] != values[j])
        match = false;
    }
    if (match)
      return true;
  }
  return false;
}

function get_plus_minus_usd_string(num) {
  if (num >= 0)
    num = "+" + num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  else
    num = num.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  return num;
}

function searchChildPart(extradb, searchterm) {
  document.getElementById("part_child_dropdown_select").selectedIndex = extradb;
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  var ele = document.getElementById("part_child_edit_input");
  ele.value = removeEndSemicolon(searchterm);
  ele.focus();
  onPartChildEditFocus();
  showPartChildEditAutocomplete();
  cancelEditPartChild();
}

var _snackbar_times_shown = 0;
function showSnackbar(message, time_to_show) {
  var x = document.getElementById("snackbar");
  x.style.display = "";
  x.innerHTML = message;
  if (x.className != "hide")
    if (x.className == "refresh1")
      x.className = "refresh2";
    else
      x.className = "refresh1";
  else
    x.className = "show";
  ++_snackbar_times_shown;

  setTimeout(function () {
    --_snackbar_times_shown;
    if (_snackbar_times_shown == 0) {
      x.className = "hide";

      setTimeout(function () {
        x.style.display = "none";
      }, 500);

    }
  }, time_to_show);
  centerSnackbar(x);
}

function showSnackbar_No_Anim(message) {
  var x = document.getElementById("snackbar_no_anim");
  x.style.display = "";
  x.innerHTML = message;
  centerSnackbar(x);
}

function hideSnackbar_No_Anim() {
  var x = document.getElementById("snackbar_no_anim");
  x.style.display = "none";
  x.innerHTML = "";
  centerSnackbar(x);
}

function centerSnackbar(ele) {
  var left = (window.innerWidth - ele.clientWidth) / 2;
  ele.style.left = left + "px";
}

function printClick() {
  window.print();
  return false;
}

// function deleteObject(object)
// {
//   for (var member in object) delete object[member];
// }

function removeIndexesFromArray(array, indexesToRemove) {
  for (var i = indexesToRemove.length - 1; i >= 0; --i) {
    var index = indexesToRemove[i];
    if (array.length > index) {
      array.splice(index, 1);
    }
    else {
      console.log("Attempted to remove index larger than array!")
    }
  }
}

function getParentRecordIndexWithChildPart_IncludingAKA(extraDB_index, pn_index) {
  for (var i = 0; i < _content.length; ++i) {
    var parent_to_part_index = getExtraDBLinkIndex(extraDB_index, _content[i][_CONTENT_EXTRA_DB_INDEXES[extraDB_index]]);
    if (parent_to_part_index == pn_index)
      return i;
  }
  return null;
}

function getParentRecordIndexWithChildPart(extraDB_index, pn_index) {
  var child_pn = _content_extra[extraDB_index][pn_index][0].PN;
  for (var i = 0; i < _content.length; ++i) //Exact match
  {
    var parent_pn = _content[i][_CONTENT_EXTRA_DB_INDEXES[extraDB_index]];
    if (parent_pn == child_pn)
      return i;
  }
  child_pn = getStandardPNString(child_pn);
  for (var i = 0; i < _content.length; ++i) //Standard Match
  {
    var parent_pn = getStandardPNString(_content[i][_CONTENT_EXTRA_DB_INDEXES[extraDB_index]]);
    if (parent_pn == child_pn)
      return i;
  }
  return null;
}

function doesContentMatchFilter(position, filterString) {
  var regexp = new RegExp(getRegexSafeSearchTerm(filterString), "g");
  for (var i = 0; i < _content_standard[position].length - 1; ++i) {
    if ((match = regexp.exec(_content_standard[position][i])) !== null) //If match found in whole string
    {
      return true;
    }
  }
  return false;
}

function getNextContentIndexInSortOrder(position, forward, valid_positions, filterString) {
  if (forward) //Forward order
  {
    if (_contentSortedIndexes.length == 0) //If no sort order
    {
      if (position == _content.length - 1)
        return null;

      return position + 1;
    }

    var closestIndex = null;
    for (var j = 0; j < _content.length; ++j) {
      if (filterString == null || doesContentMatchFilter(j, filterString)) {
        if (j != position && (valid_positions == null || (j < valid_positions.length && valid_positions[j]))) {
          var diff1 = compareContentSortingPositions(position, j);
          if (diff1 == 1) //If comparing position is more than original
          {
            if (closestIndex == null)
              closestIndex = j;
            else {
              var diff2 = compareContentSortingPositions(closestIndex, j);
              if (diff2 == -1) //If comparing position is less than last found closest position
                closestIndex = j;
            }
          }
        }
      }
    }
    return closestIndex;
  }
  else {
    if (_contentSortedIndexes.length == 0) //If no sort order
    {
      if (position == 0)
        return null;

      return position - 1;
    }

    var closestIndex = null;
    for (var j = 0; j < _content.length; ++j) {
      if (filterString == null || doesContentMatchFilter(j, filterString)) {
        if (j != position && (valid_positions == null || (j < valid_positions.length && valid_positions[j]))) {
          var diff1 = compareContentSortingPositions(position, j);
          if (diff1 == -1) //If comparing position is less than original
          {
            if (closestIndex == null)
              closestIndex = j;
            else {
              var diff2 = compareContentSortingPositions(closestIndex, j);
              if (diff2 == 1) //If comparing position is more than last found closest position
                closestIndex = j;
            }
          }
        }
      }
    }
    return closestIndex;
  }
}

function getMaxContentIndexInSortOrder(forward, valid_positions, filterString) {
  if (forward) //Forward order
  {
    if (_contentSortedIndexes.length == 0) //If no sort order
      return _content.length - 1;

    var closestIndex = 0;
    if (filterString != null) { //Find first index that matches filter string before comparing, or it may return index that doesn't match filter
      for (var j = 0; j < _content.length; ++j) {
        if (doesContentMatchFilter(j, filterString)) {
          closestIndex = j;
          break;
        }
      }
    }
    for (var j = closestIndex; j < _content.length; ++j) //Pick up at closest index to optimize searching, no need to check previous indexes because they didn't match filter
    {
      if (filterString == null || doesContentMatchFilter(j, filterString)) {
        if (closestIndex != j && (valid_positions == null || (j < valid_positions.length && valid_positions[j]))) {
          var diff1 = compareContentSortingPositions(closestIndex, j);
          if (diff1 == 1) //If comparing position is more than original
          {
            closestIndex = j;
          }
        }
      }
    }
    return closestIndex;
  }
  else {
    if (_contentSortedIndexes.length == 0) //If no sort order
      return 0;

    var closestIndex = 0;
    if (filterString != null) { //Find first index that matches filter string before comparing, or it may return index that doesn't match filter
      for (var j = 0; j < _content.length; ++j) {
        if (doesContentMatchFilter(j, filterString)) {
          closestIndex = j;
          break;
        }
      }
    }
    for (var j = closestIndex; j < _content.length; ++j) //Pick up at closest index to optimize searching, no need to check previous indexes because they didn't match filter
    {
      if (filterString == null || doesContentMatchFilter(j, filterString)) {
        if (closestIndex != j && (valid_positions == null || (j < valid_positions.length && valid_positions[j]))) {
          var diff1 = compareContentSortingPositions(closestIndex, j);
          if (diff1 == -1) //If comparing position is less than original
          {
            closestIndex = j;
          }
        }
      }
    }
    return closestIndex;
  }
}

function compareContentSortingPositions(pos1, pos2) {
  for (var k = 0; k < _contentSortedIndexes.length; ++k) {
    var str1 = _content[pos1][_contentSortedIndexes[k]];
    var str2 = _content[pos2][_contentSortedIndexes[k]];
    if (str2 > str1)
      return 1;
    if (str2 < str1)
      return -1;
  }

  if (pos2 > pos1)
    return 1;
  if (pos2 < pos1)
    return -1;
  return 0;
}

function getStartAndEndIndexesOfString(textToSearch, standardString) {
  var startIndex = 0;
  var endIndex = 0;
  var sI = 0; //standardString Index
  var results = [[], []];
  if (standardString.length > 0) {
    for (var tI = 0; tI < textToSearch.length; ++tI) { //textToSearchIndex
      var char = textToSearch.charAt(tI).toLowerCase();
      if (is_standardized(char)) {
        if (char != standardString.charAt(sI))
          sI = 0;
        if (char == standardString.charAt(sI)) {
          if (sI == 0) {
            startIndex = tI;
          }
          ++sI;
          if (sI == standardString.length) {
            sI = 0;
            endIndex = tI;
            results[0].push(startIndex);
            results[1].push(endIndex);
          }
        }
      }
    }
  }
  return results;
}

function highlightStringEZ(str, standard_term, startHTML, endHTML) {
  if (standard_term != null) {
    var indexes = getStartAndEndIndexesOfString(str, standard_term);
    return highlightStringBasic(str, indexes[0], indexes[1], startHTML, endHTML);
  }
  return str;
}

function getMMDDYYYYText(dateTime) {
  var dd = dateTime.getDate();
  var mm = dateTime.getMonth() + 1; //January is 0!
  var yyyy = dateTime.getFullYear();
  if (dd < 10)
    dd = '0' + dd;
  if (mm < 10)
    mm = '0' + mm;
  return mm + " / " + dd + " / " + yyyy;
}

function getMMDDYYYY_HHMMText(dateTime) {
  var dd = dateTime.getDate();
  var mm = dateTime.getMonth() + 1; //January is 0!
  var yyyy = dateTime.getFullYear();
  if (dd < 10)
    dd = '0' + dd;
  if (mm < 10)
    mm = '0' + mm;

  var am_pm = "am";
  var hour = dateTime.getHours();
  if (hour > 11)
    am_pm = "pm";
  if (hour > 12)
    hour -= 12;

  var extra_minute0 = "";
  if (dateTime.getMinutes() < 10) {
    extra_minute0 = "0";
  }
  if (hour == 0)
    hour = 12;
  return mm + " / " + dd + " / " + yyyy + " " + hour + ":" + extra_minute0 + dateTime.getMinutes() + " " + am_pm;
}

function getLastNonSpaceCharInString(str) {
  if (str == null || str.length == 0)
    return null;
  else {
    for (var i = str.length - 1; i >= 0; --i) {
      if (str.charAt(i) != ' ')
        return str.charAt(i);
    }
  }
  return null;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      // console.log("Loaded " + cname + " JSON|" + JSON.parse(c.substring(name.length, c.length)) + "|");
      return JSON.parse(c.substring(name.length, c.length));
    }
  }
  return null;
}

function setCookie(cname, cvalue) {
  var exdays = 365;
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  var jvalue = JSON.stringify(cvalue);
  // console.log("Saved " + cname + " JSON|" + jvalue + "|");
  document.cookie = cname + "=" + jvalue + ";" + expires + "; SameSite=Strict; path=/";
}

function objSize(obj) {
  if (obj == null)
    return 0;
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key))
      ++size;
  }
  return size;
}

function getMyInitials() {
  var initials = "";
  if (_current_employee != null) {
    if (_current_employee.first_name != null && _current_employee.first_name.length > 0)
      initials += _current_employee.first_name[0].toUpperCase();
    if (_current_employee.middle_name != null && _current_employee.middle_name.length > 0)
      initials += _current_employee.middle_name[0].toUpperCase();
    if (_current_employee.last_name != null && _current_employee.last_name.length > 0)
      initials += _current_employee.last_name[0].toUpperCase();
  }
  return initials;
}

function isValidEmail(target) {
  let match;
  var regexp = new RegExp(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/, "");
  if ((match = regexp.exec(target)) !== null) {
    return true;
  }
  return false;
}

function doesOBJContainKey(obj, key0) {
  if (obj == null)
    return false;
  for (let [key, value] of Object.entries(obj)) {
    if (key == key0)
      return true;
  }
  return false;
}

function doesOBJContainVal(obj, val0) {
  if (obj == null)
    return false;
  for (let [key, value] of Object.entries(obj)) {
    if (value == val0)
      return true;
  }
  return false;
}

var _printTextClipboardText = "";
function startEmail(subject, message) {
  document.getElementById("content_div").style.display = "none";
  document.getElementById("do_Print").style.display = "";
  _printTextClipboardText = "<br><div style='font-size: 22px; width: 100%;'>" + subject + "</div><br><br>" + message;
  document.getElementById("print_div").innerHTML = _printTextClipboardText;
}

function printCopyPressed() {
  // navigator.clipboard.writeText(W4_Funcs.printTextClipboardText);

  var element = document.getElementById("print_div");
  window.getSelection().removeAllRanges();
  let range = document.createRange();
  range.selectNode(typeof element === 'string' ? document.getElementById(element) : element);
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();

  showSnackbar("Copied to clipboard", 5000);
}

function printPrintButtonPressed() {
  window.print();
}

function printBackArrowPressed(){
  document.getElementById("content_div").style.display = "";
  document.getElementById("do_Print").style.display = "none";
}