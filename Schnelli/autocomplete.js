//SEARCH SPECIFIC AUTOCOMPLETE----------------------------------------------------------
var MAX_SEARCH_SUGGESTIONS = 50;
var _search_autocomplete_matches = new Array();
var _selected_search_autocomplete = -1;
function showSearchAutocomplete() {
  clearSearchAutocomplete();
  clearSearchPartNumAutocomplete();
  if (_selected_search_input >= 1 && _selected_search_input <= 8) //DESCRIP1 through PART_TYPE
  {
    var numMatches = 0;
    // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
    // expected output: "Found football start=6  end=14."
    // expected output: "Found foosball start=16 end=24."
    var searchstring = document.getElementById("search_input_" + _selected_search_input).value;
    if (searchstring != "") {
      var std0 = getRegexSafeSearchTerm(standardizeString(searchstring));
      for (var i = 0; i < _content.length; ++i) {
        var content_string = _content[i][_selected_search_input];
        var regexp = new RegExp(std0, "g");
        if (regexp.exec(standardizeString(content_string)) !== null) //If match found in whole string
        {
          var s = 0;
          var start = 0;
          var end = 0;
          var lastCharWasSpace = false;
          for (var n = 0; n < content_string.length; ++n)//Find individual word(s) for display
          {
            var content_char = content_string.charAt(n).toLowerCase();
            if (!(lastCharWasSpace && content_char == " ")) //If not a duplicate space
            {
              if (content_char != searchstring.charAt(s).toLowerCase())
                s = 0;
              if (content_char == searchstring.charAt(s).toLowerCase() && (s != 0 || n == 0 || lastCharWasSpace)) { //Checks that beginning of search string is at beginning of word in content
                if (s == 0)
                  start = n;
                ++s;
                if (s == searchstring.length) { //At end of search string
                  end = n + 1;
                  break;
                }
              }
              else
                s = 0;
            }
            lastCharWasSpace = (content_char == " ");
          }
          if (end != 0) { //Found match at beginning of word
            var end2 = end;
            while (end < content_string.length && content_string.charAt(end) != " ") //Go until end of word or whole string
            {
              ++end;
              end2 = end;
              if (end < content_string.length && content_string.charAt(end) != " ")
                end2 = end + 1;
            }

            var matchFinal = content_string.substring(start, end2);
            if (!_search_autocomplete_matches.includes(matchFinal)) {
              _search_autocomplete_matches.push(matchFinal);
              ++numMatches;
              if (numMatches >= MAX_SEARCH_SUGGESTIONS)
                break;
            }
          }
        }
      }

      if (_search_autocomplete_matches.length > 0) {
        _search_autocomplete_matches.sort();
        var htmlToAdd = "";
        for (var i = 0; i < _search_autocomplete_matches.length; ++i) {
          htmlToAdd += "<div class='clickable' id='search_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 5; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='searchInputOnClick(" + i + ");'>" + getHTMLSafeText(_search_autocomplete_matches[i]) + "</div><br>";
        }
        document.getElementById("search_autocomplete_" + _selected_search_input).innerHTML = htmlToAdd;
      }
    }
  }
}

function clearSearchAutocomplete() {
  _selected_search_autocomplete = -1;
  _search_autocomplete_matches = [];
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    var ele = document.getElementById("search_autocomplete_" + i);
    if (ele != null)
      ele.innerHTML = "";
  }
}

function searchInputAutocomplete() {
  if (_selected_search_autocomplete >= 0 && _selected_search_autocomplete < _search_autocomplete_matches.length)
    document.getElementById("search_input_" + _selected_search_input).value = _search_autocomplete_matches[_selected_search_autocomplete];
  clearSearchAutocomplete();
}

function searchInputOnClick(index) {
  _selected_search_autocomplete = index;
  searchInputAutocomplete();
}

function onSearchInputFocusOut() {
  // clearSearchAutocomplete();
}

function selectSearchAutocompleteUp() {
  if (_selected_search_autocomplete >= _search_autocomplete_matches.length)
    _selected_search_autocomplete = -1;
  if (_selected_search_autocomplete < 0)
    _selected_search_autocomplete = -1;
  if (_search_autocomplete_matches.length > 0) {
    for (var i = 0; i < _search_autocomplete_matches.length; ++i)
      document.getElementById("search_autocomplete_match_" + i).style.backgroundColor = "white";
    if (_selected_search_autocomplete > 0)
      --_selected_search_autocomplete;
    var ele = document.getElementById("search_autocomplete_match_" + _selected_search_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

function selectSearchAutocompleteDown() {
  if (_selected_search_autocomplete >= _search_autocomplete_matches.length)
    _selected_search_autocomplete = -1;
  if (_selected_search_autocomplete < 0)
    _selected_search_autocomplete = -1;
  if (_search_autocomplete_matches.length > 0) {
    for (var i = 0; i < _search_autocomplete_matches.length; ++i)
      document.getElementById("search_autocomplete_match_" + i).style.backgroundColor = "white";
    if (_selected_search_autocomplete < _search_autocomplete_matches.length - 1)
      ++_selected_search_autocomplete;
    var ele = document.getElementById("search_autocomplete_match_" + _selected_search_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}
//END SEARCH SPECIFIC AUTOCOMPLETE----------------------------------------------------------

//PART NUM AUTOCOMPLETE----------------------------------------------------------
var MAX_PARTNUM_SUGGESTIONS = 50;
var _partnum_autocomplete_matches = new Array();
var _selected_partnum_autocomplete = -1;
var _selected_partnum_input_i = 0;
var _selected_partnum_input_j = 0;
function showPartNumAutocomplete() {
  clearPartNumAutocomplete();
  var numMatches = 0;
  var searchstring = document.getElementById("record_view_partnum_input_" + _selected_partnum_input_i + "_" + _selected_partnum_input_j).value;
  if (searchstring != "") {
    var std0 = getRegexSafeSearchTerm(searchstring.toLowerCase());
    for (var i = 0; i < _content_extra[_selected_partnum_input_j].length; ++i) {
      var part_num_string = _content_extra[_selected_partnum_input_j][i][0][CE_PN];
      var regexp = new RegExp(std0, "g");
      if (regexp.exec(part_num_string.toLowerCase()) !== null) //If match found in whole string
      {
        if (!_partnum_autocomplete_matches.includes(part_num_string)) {
          _partnum_autocomplete_matches.push(part_num_string);
          ++numMatches;
          if (numMatches >= MAX_PARTNUM_SUGGESTIONS)
            break;
        }
      }
    }
  }
  if (_partnum_autocomplete_matches.length > 0) {
    _partnum_autocomplete_matches.sort();
    var htmlToAdd = "";
    for (var i = 0; i < _partnum_autocomplete_matches.length; ++i) {
      htmlToAdd += "<div class='clickable' id='partnum_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 5; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='partNumInputOnClick(" + i + ");'>" + getHTMLSafeText(_partnum_autocomplete_matches[i]) + "</div><br>";
    }
    document.getElementById("partnum_autocomplete_" + _selected_partnum_input_i + "_" + _selected_partnum_input_j).innerHTML = htmlToAdd;
  }
}

function clearPartNumAutocomplete() {
  _partnum_autocomplete_matches = [];
  _selected_partnum_autocomplete = -1;
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      if (j != 2) //Skip DNI ExtraDB
      {
        var ele = document.getElementById("partnum_autocomplete_" + i + "_" + j);
        if (ele != null)
          ele.innerHTML = "";
      }
    }
  }
}

function partNumInputAutocomplete() {
  if (_selected_partnum_autocomplete >= 0 && _selected_partnum_autocomplete < _partnum_autocomplete_matches.length)
    document.getElementById("record_view_partnum_input_" + _selected_partnum_input_i + "_" + _selected_partnum_input_j).value = _partnum_autocomplete_matches[_selected_partnum_autocomplete];
  clearPartNumAutocomplete();
}

function partNumInputOnClick(index) {
  _selected_partnum_autocomplete = index;
  partNumInputAutocomplete();
}

function onPartNumFocus(indexi, indexj) {
  _selected_partnum_input_i = indexi;
  _selected_partnum_input_j = indexj;
  deselectTable();
}

function partnum_input_keyup_event(event) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    event.preventDefault();
    partNumInputAutocomplete();
  }
  else if (event.code === KEY_ESCAPE) {
    // clearPartNumAutocomplete();
  }
  else if (event.code == KEY_UP_ARROW) {

  }
  else if (event.code == KEY_DOWN_ARROW) {

  }
  else {
    showPartNumAutocomplete();
  }
}

var partnum_input_was_pressed_first = false;
function partnum_input_keydown_event(event) {
  partnum_input_was_pressed_first = true;
  if (event.code == KEY_UP_ARROW) {
    event.preventDefault();
    selectPartNumAutocompleteUp();
  }
  else if (event.code == KEY_DOWN_ARROW) {
    event.preventDefault();
    selectPartNumAutocompleteDown();
  }
}

function selectPartNumAutocompleteUp() {
  if (_selected_partnum_autocomplete >= _partnum_autocomplete_matches.length)
    _selected_partnum_autocomplete = -1;
  if (_selected_partnum_autocomplete < 0)
    _selected_partnum_autocomplete = -1;
  if (_partnum_autocomplete_matches.length > 0) {
    for (var i = 0; i < _partnum_autocomplete_matches.length; ++i)
      document.getElementById("partnum_autocomplete_match_" + i).style.backgroundColor = "white";
    if (_selected_partnum_autocomplete > 0)
      --_selected_partnum_autocomplete;
    var ele = document.getElementById("partnum_autocomplete_match_" + _selected_partnum_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

function selectPartNumAutocompleteDown() {
  if (_selected_partnum_autocomplete >= _partnum_autocomplete_matches.length)
    _selected_partnum_autocomplete = -1;
  if (_selected_partnum_autocomplete < 0)
    _selected_partnum_autocomplete = -1;
  if (_partnum_autocomplete_matches.length > 0) {
    for (var i = 0; i < _partnum_autocomplete_matches.length; ++i)
      document.getElementById("partnum_autocomplete_match_" + i).style.backgroundColor = "white";
    if (_selected_partnum_autocomplete < _partnum_autocomplete_matches.length - 1)
      ++_selected_partnum_autocomplete;
    var ele = document.getElementById("partnum_autocomplete_match_" + _selected_partnum_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}
//END PART NUM AUTOCOMPLETE----------------------------------------------------------

//PART CHILD EDIT AUTOCOMPLETE----------------------------------------------------------
function clearPartChildEditAutocomplete() {
  _selected_partchild_edit_autocomplete = -1;
  _partchild_edit_autocomplete_matches = [];
  document.getElementById("partchild_edit_autocomplete").innerHTML = "";
}

function onPartChildEditFocus() {
  deselectTable();
}

function partchild_edit_input_keyup_event(event) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    event.preventDefault();
    // partNumInputAutocomplete();
    _selected_child_part_db = _partchild_edit_autocomplete_matches[_selected_partchild_edit_autocomplete].db;
    _selected_child_part_record = _partchild_edit_autocomplete_matches[_selected_partchild_edit_autocomplete].row;
    populateChildPartRecordManager();
    clearPartChildEditAutocomplete();
  }
  else if (event.code === KEY_ESCAPE) {
    // clearPartChildEditAutocomplete();
  }
  else if (event.code == KEY_UP_ARROW) {

  }
  else if (event.code == KEY_DOWN_ARROW) {

  }
  else {
    showPartChildEditAutocomplete();
  }
}

function partchild_edit_row_click(index) {
  _selected_child_part_db = _partchild_edit_autocomplete_matches[index].db;
  _selected_child_part_record = _partchild_edit_autocomplete_matches[index].row;
  populateChildPartRecordManager();
  clearPartChildEditAutocomplete();
}

function partchild_edit_input_keydown_event(event) {
  if (event.code == KEY_UP_ARROW) {
    event.preventDefault();
    selectPartChildEditAutocompleteUp();
  }
  else if (event.code == KEY_DOWN_ARROW) {
    event.preventDefault();
    selectPartChildEditAutocompleteDown();
  }
}

function selectPartChildEditAutocompleteUp() {
  if (_selected_partchild_edit_autocomplete >= _partchild_edit_autocomplete_matches.length)
    _selected_partchild_edit_autocomplete = -1;
  if (_selected_partchild_edit_autocomplete < 0)
    _selected_partchild_edit_autocomplete = -1;
  if (_partchild_edit_autocomplete_matches.length > 0) {
    for (var i = 0; i < _partchild_edit_autocomplete_matches.length; ++i)
      document.getElementById("partchild_edit_autocomplete_match_" + i).style.backgroundColor = "";
    if (_selected_partchild_edit_autocomplete > 0)
      --_selected_partchild_edit_autocomplete;
    var ele = document.getElementById("partchild_edit_autocomplete_match_" + _selected_partchild_edit_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

function selectPartChildEditAutocompleteDown() {
  if (_selected_partchild_edit_autocomplete >= _partchild_edit_autocomplete_matches.length)
    _selected_partchild_edit_autocomplete = -1;
  if (_selected_partchild_edit_autocomplete < 0)
    _selected_partchild_edit_autocomplete = -1;
  if (_partchild_edit_autocomplete_matches.length > 0) {
    for (var i = 0; i < _partchild_edit_autocomplete_matches.length; ++i)
      document.getElementById("partchild_edit_autocomplete_match_" + i).style.backgroundColor = "";
    if (_selected_partchild_edit_autocomplete < _partchild_edit_autocomplete_matches.length - 1)
      ++_selected_partchild_edit_autocomplete;
    var ele = document.getElementById("partchild_edit_autocomplete_match_" + _selected_partchild_edit_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

var _partchild_edit_autocomplete_matches = [];
var _selected_partchild_edit_autocomplete = -1;
var MAX_PARTCHILDEDIT_SUGGESTIONS = 15;
function showPartChildEditAutocomplete() {
  var htmlToAdd = "";
  clearPartChildEditAutocomplete();
  var numMatches = 0;
  // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
  // expected output: "Found football start=6  end=14."
  // expected output: "Found foosball start=16 end=24."
  var searchstring = document.getElementById("part_child_edit_input").value;
  var std0 = getRegexSafeSearchTerm(searchstring.toLowerCase());
  var _selected_extra_db = document.getElementById("part_child_dropdown_select").selectedIndex;
  if (searchstring != "") {
    if (_selected_extra_db >= _EXTRA_DB.length) //Search any
    {
      for (var h = 0; h < _EXTRA_DB.length; ++h) {
        for (var i = 0; i < _content_extra[h].length; ++i) {
          var part_child_edit_string = _content_extra[h][i][0][CE_PN];
          var regexp = new RegExp(std0, "g");
          if (regexp.exec(part_child_edit_string.toLowerCase()) !== null) //If match found in whole string
          {
            if (!doesObjectArraySpecificIndexIncludeX(_partchild_edit_autocomplete_matches, [h, i], ["db", "row"])) {
              var obj = new Object();
              obj.db = h;
              obj.row = i;
              obj.text = part_child_edit_string;
              _partchild_edit_autocomplete_matches.push(obj);
              ++numMatches;
              if (numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
                break;
            }
          }
        }
      }
    }
    else //Search specific db
    {
      for (var i = 0; i < _content_extra[_selected_extra_db].length; ++i) {
        var part_child_edit_string = _content_extra[_selected_extra_db][i][0][CE_PN];
        var regexp = new RegExp(std0, "g");
        if (regexp.exec(part_child_edit_string.toLowerCase()) !== null) //If match found in whole string
        {
          if (!doesObjectArraySpecificIndexIncludeX(_partchild_edit_autocomplete_matches, [_selected_extra_db, i], ["db", "row"])) {
            var obj = new Object();
            obj.db = _selected_extra_db;
            obj.row = i;
            obj.text = part_child_edit_string;
            _partchild_edit_autocomplete_matches.push(obj);
            ++numMatches;
            if (numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
              break;
          }
        }
      }
    }
  }
  if (_partchild_edit_autocomplete_matches.length > 0) {
    _partchild_edit_autocomplete_matches.sort(COMPARE_OBJ_TEXT);
    htmlToAdd += "<table style='position: absolute; z-index: 5;'><tr>";
    htmlToAdd += "<th><p>DB</p></th>";
    for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++j) {
      htmlToAdd += "<th><p>" + RECORD_VIEW_HEADERS_PAGE1_CONCAT[j] + "</p></th>";
    }
    htmlToAdd += "</tr>";
    for (var j = 0; j < _partchild_edit_autocomplete_matches.length; ++j) {
      var extraDBIndex = _partchild_edit_autocomplete_matches[j].row;
      _selected_extra_db = _partchild_edit_autocomplete_matches[j].db;
      htmlToAdd += "<tr class='clickable' id='partchild_edit_autocomplete_match_" + j + "' onclick='partchild_edit_row_click(" + j + ");'>";
      htmlToAdd += "<td><p>" + _EXTRA_DB[_selected_extra_db] + "</p></td>";
      for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++k) {
        htmlToAdd += "<td>";
        if (extraDBIndex != null) {
          for (var d = 0; RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k] != null && d < RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k].length; ++d) {
            var content1 = _content_extra[_selected_extra_db][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k][d]];
            if (content1 != null) {
              if (k == 9 || k == 10 || k == 11) //"CGS",   "RETAIL",     "SELL" in usd format
              {
                htmlToAdd += "<p>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</p>";
              }
              else {
                htmlToAdd += "<p>" + content1 + "</p>";
              }
              break;
            }
          }
        }
        htmlToAdd += "</td>";
      }
      htmlToAdd += "</tr>";
    }
  }
  document.getElementById("partchild_edit_autocomplete").innerHTML = htmlToAdd;
}
//END PART CHILD EDIT AUTOCOMPLETE----------------------------------------------------------

//SEARCH PART NUMBER INSTANT AUTOCOMPLETE----------------------------------------------------------
var _search_partnum_autocomplete_matches = [];
var _selected_search_partnum_autocomplete = -1;
var MAX_SEARCHPARTNUM_SUGGESTIONS = 15;
function showSearchPartNumAutocomplete(extradb) {
  if (extradb == null)
    extradb = _EXTRA_DB.length;
  var htmlToAdd = "";
  clearSearchPartNumAutocomplete();
  clearSearchAutocomplete();
  var numMatches = 0;
  // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
  // expected output: "Found football start=6  end=14."
  // expected output: "Found foosball start=16 end=24."
  var searchstring;
  if (extradb < _EXTRA_DB.length)
    searchstring = document.getElementById("search_partnum_input_" + extradb).value;
  else
    searchstring = document.getElementById("search_partnum_any_input").value;

  if (searchstring != "") {
    var std0 = getRegexSafeSearchTerm(searchstring.toLowerCase());
    if (extradb >= _EXTRA_DB.length) //Search any
    {
      for (var h = 0; h < _EXTRA_DB.length; ++h) {
        for (var i = 0; i < _content_extra[h].length; ++i) {
          var matchFound = false;
          var isAKA = false;
          var part_child_string = _content_extra[h][i][0][CE_PN];
          var regexp = new RegExp(std0, "g");
          if (regexp.exec(part_child_string.toLowerCase()) !== null) //If match found in whole string of PN
            matchFound = true;
          else {
            part_child_string = _content_extra[h][i][0][CE_AKA];
            var regexp = new RegExp(std0, "g");
            if (part_child_string != null && regexp.exec(part_child_string.toLowerCase()) !== null) //If match found in whole string of AKA/JS_LINE_PN
            {
              matchFound = true;
              isAKA = true;
            }
          }
          if (matchFound) {
            if (!doesObjectArraySpecificIndexIncludeX(_search_partnum_autocomplete_matches, [h, i], ["db", "row"])) {
              var obj = new Object();
              obj.db = h;
              obj.row = i;
              obj.isAKA = isAKA;
              obj.text = part_child_string
              _search_partnum_autocomplete_matches.push(obj);
              ++numMatches;
              if (numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
                break;
            }
          }
        }
      }
    }
    else //Search specific db
    {
      for (var i = 0; i < _content_extra[extradb].length; ++i) {
        var matchFound = false;
        var isAKA = false;
        var part_child_string = _content_extra[extradb][i][0][CE_PN];
        var regexp = new RegExp(std0, "g");
        if (part_child_string != null && regexp.exec(part_child_string.toLowerCase()) !== null) //If match found in whole string
        {
          matchFound = true;
        }
        else {
          part_child_string = _content_extra[extradb][i][0][CE_AKA];
          var regexp = new RegExp(std0, "g");
          if (part_child_string != null && regexp.exec(part_child_string.toLowerCase()) !== null) //If match found in whole string of AKA/JS_LINE_PN
          {
            matchFound = true;
            isAKA = true;
          }
        }
        if (matchFound) {
          if (!doesObjectArraySpecificIndexIncludeX(_search_partnum_autocomplete_matches, [extradb, i], ["db", "row"])) {
            var obj = new Object();
            obj.db = extradb;
            obj.row = i;
            obj.isAKA = isAKA;
            obj.text = part_child_string
            _search_partnum_autocomplete_matches.push(obj);
            ++numMatches;
            if (numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
              break;
          }
        }
      }
    }
  }

  if (_search_partnum_autocomplete_matches.length > 0) {
    _search_partnum_autocomplete_matches.sort(COMPARE_OBJ_TEXT);
    for (var j = 0; j < _search_partnum_autocomplete_matches.length; ++j) {
      var extraDBIndex = _search_partnum_autocomplete_matches[j].row;
      var db = _search_partnum_autocomplete_matches[j].db;
      var isAKA = _search_partnum_autocomplete_matches[j].isAKA;
      var content1 = null;
      if (isAKA)
        content1 = _content_extra[db][extraDBIndex][0][CE_AKA] + " <b>(AKA)</b>";
      else
        content1 = _content_extra[db][extraDBIndex][0][CE_PN];
      if (content1 != null) {
        htmlToAdd += "<div class='clickable' id='search_partnum_autocomplete_match_" + j + "' style='position: absolute; width: 230px; z-index: 5; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='search_partnum_row_click(" + j + ");'>" + content1 + "</div><br>";
      }
    }
  }
  if (extradb >= _EXTRA_DB.length)
    document.getElementById("search_partnum_autocomplete_any").innerHTML = htmlToAdd;
  else
    document.getElementById("search_partnum_autocomplete_" + extradb).innerHTML = htmlToAdd;
}

function clearSearchPartNumAutocomplete() {
  _selected_search_partnum_autocomplete = -1;
  _search_partnum_autocomplete_matches = [];
  document.getElementById("search_partnum_autocomplete_any").innerHTML = "";
  for (var i = 0; i < _EXTRA_DB.length; ++i)
    document.getElementById("search_partnum_autocomplete_" + i).innerHTML = "";
}

function search_partnum_input_keyup_event(event, db) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    event.preventDefault();
    search_partnum_row_click(_selected_search_partnum_autocomplete);
  }
  else if (event.code === KEY_ESCAPE) {

  }
  else if (event.code == KEY_UP_ARROW) {

  }
  else if (event.code == KEY_DOWN_ARROW) {

  }
  else {
    showSearchPartNumAutocomplete(db);
  }
  clearSearchPartNumInputs();
}

function search_partnum_row_click(index) {
  if (index >= 0 && index < _search_partnum_autocomplete_matches.length) {
    var db = _search_partnum_autocomplete_matches[index].db;
    var row = _search_partnum_autocomplete_matches[index].row;
    var isAKA = _search_partnum_autocomplete_matches[index].isAKA;
    clearSearchPartNumAutocomplete();
    var p_index = null;
    if (isAKA)
      p_index = getParentRecordIndexWithChildPart_IncludingAKA(db, row);
    else
      p_index = getParentRecordIndexWithChildPart(db, row);
    if (p_index != null) {
      addRecordView(_content[p_index][_content[p_index].length - 1]);
      setTab(TAB_RECORD_VIEWS);
      selectRecordView(_recordViews.length - 1, true);
    }
    else {
      showSnackbar("Child record found, but no parent record links to it", 3000);
    }
  }
}

function search_partnum_input_keydown_event(event) {
  if (event.code == KEY_UP_ARROW) {
    event.preventDefault();
    selectSearchPartnumAutocompleteUp();
  }
  else if (event.code == KEY_DOWN_ARROW) {
    event.preventDefault();
    selectSearchPartnumAutocompleteDown();
  }
}

function selectSearchPartnumAutocompleteUp() {
  if (_selected_search_partnum_autocomplete >= _search_partnum_autocomplete_matches.length)
    _selected_search_partnum_autocomplete = -1;
  if (_selected_search_partnum_autocomplete < 0)
    _selected_search_partnum_autocomplete = -1;
  if (_search_partnum_autocomplete_matches.length > 0) {
    for (var i = 0; i < _search_partnum_autocomplete_matches.length; ++i)
      document.getElementById("search_partnum_autocomplete_match_" + i).style.backgroundColor = "white";
    if (_selected_search_partnum_autocomplete > 0)
      --_selected_search_partnum_autocomplete;
    var ele = document.getElementById("search_partnum_autocomplete_match_" + _selected_search_partnum_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

function selectSearchPartnumAutocompleteDown() {
  if (_selected_search_partnum_autocomplete >= _search_partnum_autocomplete_matches.length)
    _selected_search_partnum_autocomplete = -1;
  if (_selected_search_partnum_autocomplete < 0)
    _selected_search_partnum_autocomplete = -1;
  if (_search_partnum_autocomplete_matches.length > 0) {
    for (var i = 0; i < _search_partnum_autocomplete_matches.length; ++i)
      document.getElementById("search_partnum_autocomplete_match_" + i).style.backgroundColor = "white";
    if (_selected_search_partnum_autocomplete < _search_partnum_autocomplete_matches.length - 1)
      ++_selected_search_partnum_autocomplete;
    var ele = document.getElementById("search_partnum_autocomplete_match_" + _selected_search_partnum_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}
//END SEARCH PART NUMBER INSTANT AUTOCOMPLETE----------------------------------------------------------

// //SUGGESTION P&A_PRI AUTOCOMPLETE----------------------------------------------------------
// var MAX_SUGGESTION_SUGGESTIONS = 50;
// var _suggestion_autocomplete_matches = new Array();
// var _selected_suggestion_autocomplete = -1;
// var _selected_suggestion_input = -1;
// function showSuggestionAutocomplete(input_i) {
//   _selected_suggestion_input = input_i;
//   clearSuggestionAutocomplete();
//   var numMatches = 0;
//   // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
//   // expected output: "Found football start=6  end=14."
//   // expected output: "Found foosball start=16 end=24."
//   let match;
//   var searchstring = document.getElementById("suggestion_input_" + input_i).value;
//   if (searchstring != "") {
//     var regexp = new RegExp(getRegexSafeSearchTerm(standardizeString(searchstring)), "g");
//     for (var i = 0; i < _content.length; ++i) {
//       var content_string = _content[i][input_i];
//       if ((match = regexp.exec(standardizeString(content_string))) !== null) //If match found in whole string
//       {
//         var s = 0;
//         var start = 0;
//         var end = 0;
//         var lastCharWasSpace = false;
//         for (var n = 0; n < content_string.length; ++n)//Find individual word(s) for display
//         {
//           var content_char = content_string.charAt(n).toLowerCase();
//           if (!(lastCharWasSpace && content_char == " ")) //If not a duplicate space
//           {
//             if (content_char != searchstring.charAt(s).toLowerCase())
//               s = 0;
//             if (content_char == searchstring.charAt(s).toLowerCase() && (s != 0 || n == 0 || lastCharWasSpace)) { //Checks that beginning of search string is at beginning of word in content
//               if (s == 0)
//                 start = n;
//               ++s;
//               if (s == searchstring.length) { //At end of search string
//                 end = n + 1;
//                 break;
//               }
//             }
//             else
//               s = 0;
//           }
//           lastCharWasSpace = (content_char == " ");
//         }
//         if (end != 0) { //Found match at beginning of word
//           var end2 = end;
//           while (end < content_string.length && content_string.charAt(end) != " ") //Go until end of word or whole string
//           {
//             ++end;
//             end2 = end;
//             if (end < content_string.length && content_string.charAt(end) != " ")
//               end2 = end + 1;
//           }

//           var matchFinal = content_string.substring(start, end2);
//           if (!_suggestion_autocomplete_matches.includes(matchFinal)) {
//             _suggestion_autocomplete_matches.push(matchFinal);
//             ++numMatches;
//             if (numMatches >= MAX_SUGGESTION_SUGGESTIONS)
//               break;
//           }
//         }
//       }
//     }

//     if (_suggestion_autocomplete_matches.length > 0) {
//       _suggestion_autocomplete_matches.sort();
//       var htmlToAdd = "";
//       for (var i = 0; i < _suggestion_autocomplete_matches.length; ++i) {
//         htmlToAdd += "<div class='clickable' id='suggestion_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 5; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='suggestionInputOnClick(" + i + ");'>" + getHTMLSafeText(_suggestion_autocomplete_matches[i]) + "</div><br>";
//       }
//       document.getElementById("suggestion_autocomplete_" + input_i).innerHTML = htmlToAdd;
//     }
//   }
// }

// function clearSuggestionAutocomplete() {
//   _selected_suggestion_autocomplete = -1;
//   _suggestion_autocomplete_matches = [];
//   for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
//     document.getElementById("suggestion_autocomplete_" + i).innerHTML = "";
//   }
// }

// function suggestionInputAutocomplete() {
//   if (_selected_suggestion_autocomplete >= 0 && _selected_suggestion_autocomplete < _suggestion_autocomplete_matches.length)
//     document.getElementById("suggestion_input_" + _selected_suggestion_input).value = _suggestion_autocomplete_matches[_selected_suggestion_autocomplete];
//   clearSuggestionAutocomplete();
// }

// function suggestionInputOnClick(index) {
//   _selected_suggestion_autocomplete = index;
//   suggestionInputAutocomplete();
// }

// function selectSuggestionAutocompleteUp() {
//   if (_selected_suggestion_autocomplete >= _suggestion_autocomplete_matches.length)
//     _selected_suggestion_autocomplete = -1;
//   if (_selected_suggestion_autocomplete < 0)
//     _selected_suggestion_autocomplete = -1;
//   if (_suggestion_autocomplete_matches.length > 0) {
//     for (var i = 0; i < _suggestion_autocomplete_matches.length; ++i)
//       document.getElementById("suggestion_autocomplete_match_" + i).style.backgroundColor = "white";
//     if (_selected_suggestion_autocomplete > 0)
//       --_selected_suggestion_autocomplete;
//     var ele = document.getElementById("suggestion_autocomplete_match_" + _selected_suggestion_autocomplete);
//     ele.style.backgroundColor = _selectedCellColor;
//     ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
//   }
// }

// function selectSuggestionAutocompleteDown() {
//   if (_selected_suggestion_autocomplete >= _suggestion_autocomplete_matches.length)
//     _selected_suggestion_autocomplete = -1;
//   if (_selected_suggestion_autocomplete < 0)
//     _selected_suggestion_autocomplete = -1;
//   if (_suggestion_autocomplete_matches.length > 0) {
//     for (var i = 0; i < _suggestion_autocomplete_matches.length; ++i)
//       document.getElementById("suggestion_autocomplete_match_" + i).style.backgroundColor = "white";
//     if (_selected_suggestion_autocomplete < _suggestion_autocomplete_matches.length - 1)
//       ++_selected_suggestion_autocomplete;
//     var ele = document.getElementById("suggestion_autocomplete_match_" + _selected_suggestion_autocomplete);
//     ele.style.backgroundColor = _selectedCellColor;
//     ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
//   }
// }
// //END SUGGESTION P&A_PRI AUTOCOMPLETE----------------------------------------------------------

//TRUCK PART AUTOCOMPLETE----------------------------------------------------------
var _TruckPart_autocomplete_matches = [];
var _selected_TruckPart_autocomplete = -1;
var MAX_TRUCKPART_SUGGESTIONS = 15;

function clearTruckPartAutocomplete() {
  _selected_TruckPart_autocomplete = -1;
  _TruckPart_autocomplete_matches = [];
  document.getElementById("TruckPart_autocomplete").innerHTML = "";
}

function onTruckPartFocus() {
  deselectTable();
}

function onTruckPartKeyUpEvent(event) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    event.preventDefault();
    addPartToTruck(_TruckPart_autocomplete_matches[_selected_TruckPart_autocomplete].row, _TruckPart_autocomplete_matches[_selected_TruckPart_autocomplete].db);
    clearTruckPartAutocomplete();
  }
  else if (event.code === KEY_ESCAPE) {
    // clearPartChildEditAutocomplete();
  }
  else if (event.code == KEY_UP_ARROW) {

  }
  else if (event.code == KEY_DOWN_ARROW) {

  }
  else {
    showTruckPartAutocomplete();
  }
}

function TruckPart_row_click(index) {
  addPartToTruck(_TruckPart_autocomplete_matches[index].row, _TruckPart_autocomplete_matches[index].db);
  clearTruckPartAutocomplete();
}

function onTruckPartKeyDownEvent(event) {
  if (event.code == KEY_UP_ARROW) {
    event.preventDefault();
    selectTruckPartAutocompleteUp();
  }
  else if (event.code == KEY_DOWN_ARROW) {
    event.preventDefault();
    selectTruckPartAutocompleteDown();
  }
}

function selectTruckPartAutocompleteUp() {
  if (_selected_TruckPart_autocomplete >= _TruckPart_autocomplete_matches.length)
    _selected_TruckPart_autocomplete = -1;
  if (_selected_TruckPart_autocomplete < 0)
    _selected_TruckPart_autocomplete = -1;
  if (_TruckPart_autocomplete_matches.length > 0) {
    for (var i = 0; i < _TruckPart_autocomplete_matches.length; ++i)
      document.getElementById("TruckPart_autocomplete_match_" + i).style.backgroundColor = "";
    if (_selected_TruckPart_autocomplete > 0)
      --_selected_TruckPart_autocomplete;
    var ele = document.getElementById("TruckPart_autocomplete_match_" + _selected_TruckPart_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

function selectTruckPartAutocompleteDown() {
  if (_selected_TruckPart_autocomplete >= _TruckPart_autocomplete_matches.length)
    _selected_TruckPart_autocomplete = -1;
  if (_selected_TruckPart_autocomplete < 0)
    _selected_TruckPart_autocomplete = -1;
  if (_TruckPart_autocomplete_matches.length > 0) {
    for (var i = 0; i < _TruckPart_autocomplete_matches.length; ++i)
      document.getElementById("TruckPart_autocomplete_match_" + i).style.backgroundColor = "";
    if (_selected_TruckPart_autocomplete < _TruckPart_autocomplete_matches.length - 1)
      ++_selected_TruckPart_autocomplete;
    var ele = document.getElementById("TruckPart_autocomplete_match_" + _selected_TruckPart_autocomplete);
    ele.style.backgroundColor = _selectedCellColor;
    ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
}

function showTruckPartAutocomplete() {
  var htmlToAdd = "";
  clearTruckPartAutocomplete();
  var numMatches = 0;
  // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
  // expected output: "Found football start=6  end=14."
  // expected output: "Found foosball start=16 end=24."
  var searchstring = document.getElementById("addTruckPartInput").value;
  var std0 = getRegexSafeSearchTerm(searchstring.toLowerCase());
  if (searchstring != "") {
    for (var h = 0; h < _EXTRA_DB.length; ++h) {
      for (var i = 0; i < _content_extra[h].length; ++i) {
        var truckPart_string = _content_extra[h][i][0][CE_PN];
        var regexp = new RegExp(std0, "g");
        if (regexp.exec(truckPart_string.toLowerCase()) !== null) //If match found in whole string
        {
          if (!doesObjectArraySpecificIndexIncludeX(_TruckPart_autocomplete_matches, [h, i], ["db", "row"])) {
            var obj = new Object();
            obj.db = h;
            obj.row = i;
            obj.text = truckPart_string;
            _TruckPart_autocomplete_matches.push(obj);
            ++numMatches;
            if (numMatches >= MAX_TRUCKPART_SUGGESTIONS)
              break;
          }
        }
      }
    }

  }
  if (_TruckPart_autocomplete_matches.length > 0) {
    _TruckPart_autocomplete_matches.sort(COMPARE_OBJ_TEXT);
    htmlToAdd += "<table style='position: absolute; z-index: 5;'><tr>";
    htmlToAdd += "<th><p>DB</p></th>";
    for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++j) {
      htmlToAdd += "<th><p>" + RECORD_VIEW_HEADERS_PAGE1_CONCAT[j] + "</p></th>";
    }
    htmlToAdd += "</tr>";
    for (var j = 0; j < _TruckPart_autocomplete_matches.length; ++j) {
      var extraDBIndex = _TruckPart_autocomplete_matches[j].row;
      _selected_extra_db = _TruckPart_autocomplete_matches[j].db;
      htmlToAdd += "<tr class='clickable' id='TruckPart_autocomplete_match_" + j + "' onclick='TruckPart_row_click(" + j + ");'>";
      htmlToAdd += "<td><p>" + _EXTRA_DB[_selected_extra_db] + "</p></td>";
      for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++k) {
        htmlToAdd += "<td>";
        if (extraDBIndex != null) {
          for (var d = 0; RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k] != null && d < RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k].length; ++d) {
            var content1 = _content_extra[_selected_extra_db][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k][d]];
            if (content1 != null) {
              if (k == 9 || k == 10 || k == 11) //"CGS",   "RETAIL",     "SELL" in usd format
              {
                htmlToAdd += "<p>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</p>";
              }
              else {
                htmlToAdd += "<p>" + content1 + "</p>";
              }
              break;
            }
          }
        }
        htmlToAdd += "</td>";
      }
      htmlToAdd += "</tr>";
    }
  }
  document.getElementById("TruckPart_autocomplete").innerHTML = htmlToAdd;
}
//END TRUCK PART AUTOCOMPLETE----------------------------------------------------------