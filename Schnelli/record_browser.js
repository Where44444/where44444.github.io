var _highlightgreen_requested = false;
var _RECORD_BROWSER_ROW_IDS = [];
var _record_browser_filter_string_Standardized = null;
function populateRecordBrowser(indexStart, highlight_IndexStart_Green, populateFromBottom) {
  if (populateFromBottom == null)
    populateFromBottom = false;

  _highlightgreen_requested = highlight_IndexStart_Green;
  document.getElementById("wlmay_input_div").style.display = "block";

  document.getElementById("record_browser_table_div").innerHTML = "";

  var populate_indexes = [indexStart];
  var endFound = false;

  if (populateFromBottom)
    for (var i = 0; i < _recordBrowserMax - 1; ++i) {
      if (!endFound) {
        var nextIndex = getNextContentIndexInSortOrder(populate_indexes[0], _contentSortedReverse, null, _record_browser_filter_string_Standardized);
        if (nextIndex != null)
          populate_indexes.unshift(nextIndex);
        else //If at end of sorted record array
          endFound = true;
      }
      if (endFound) {
        var nextIndex = getNextContentIndexInSortOrder(populate_indexes[populate_indexes.length - 1], !_contentSortedReverse, null, _record_browser_filter_string_Standardized);
        if (nextIndex != null)
          populate_indexes.push(nextIndex); //Add to front of array
      }
    }
  else
    for (var i = 0; i < _recordBrowserMax - 1; ++i) {
      if (!endFound) {
        var nextIndex = getNextContentIndexInSortOrder(populate_indexes[populate_indexes.length - 1], !_contentSortedReverse, null, _record_browser_filter_string_Standardized);
        if (nextIndex != null)
          populate_indexes.push(nextIndex);
        else //If at end of sorted record array
          endFound = true;
      }
      if (endFound) {
        var nextIndex = getNextContentIndexInSortOrder(populate_indexes[0], _contentSortedReverse, null, _record_browser_filter_string_Standardized);
        if (nextIndex != null)
          populate_indexes.unshift(nextIndex); //Add to front of array
      }
    }

  hideSnackbar_No_Anim();
  var origIndexStart = indexStart;
  // if(_content.length - indexStart < _recordBrowserMax)
  //   indexStart = _content.length - _recordBrowserMax;
  // if(indexStart < 0)
  //   indexStart = 0;
  // if(indexStart > _content.length - 1)
  //   indexStart = _content.length - 1;
  // var indexEnd = indexStart + (_recordBrowserMax - 1);
  // if(_content.length - 1 < indexEnd)
  //   indexEnd = _content.length - 1;

  _currentRecordBrowserStartIndex = populate_indexes[0];
  var startHighlight = "<span style='background: yellow;'>";
  var endHighlight = "</span>";

  if (_content.length > 0) {
    document.getElementById("part_child_record_manager").style.display = "block";
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("message").innerHTML = "";
    document.getElementById("record_browser_div").style.display = "block";
    // var tableHTML = "<p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _content.length + " Record(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
    var tableHTML = "<p style='display: inline;'>Showing " + _recordBrowserMax + " of " + _content.length + " Record(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      "<p style='display: inline; background-color: #70A2FF;'>Table Si<span style='color: white;'>z</span>e</p>&nbsp;&nbsp;" +
      "<input id=\"record_browser_max\" type=\"number\" value=" + _recordBrowserMax + " min=\"0\" onfocus='showRecordBrowserMax();' onchange='showRecordBrowserMax();'></input>" +
      "<button id=\"save_record_browser_max\" onclick=\"updateRecordBrowserMax();\" style=\"display: none;'\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if (!_subscribed_mode)
      tableHTML += "<button id='button_record_browser_add_new_part' onclick='startNewRecord();' style='background-color: #70A2FF; color: black;'><span style='color: white;'>A</span>dd New Part +</button>";
    tableHTML += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_record_browser_jump_top'    onclick='recordBrowserJumpToEdge(false);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>T</span>op</button>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_record_browser_jump_bottom' onclick='recordBrowserJumpToEdge(true);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>B</span>ottom</button>" +
      "<p style='background-color: #70A2FF;'>R<span style='color: white;'>e</span>cord Browser</p>" +

      "<div id='add_part_table_div'></div>" +
      "<table class='clickable' id='record_browser_table'><thead><tr>";

    for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
      var index = _INDEX_ORDER[i];
      var bgcolor = "inherit";
      if (_contentSortedIndexes.includes(index))
        bgcolor = getSortColor(index);
      tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + "; position: sticky; top: 0; z-index: 4;'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
    }
    tableHTML += "</thead></tr><tbody>";

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
    _RECORD_BROWSER_ROW_IDS = [];
    // for (var i = indexStart; i <= indexEnd; ++i) {
    for (var i1 = 0; i1 < populate_indexes.length; ++i1) {
      var i = populate_indexes[i1];
      tableHTML += "<tr id='record_browser_row_" + i1 + "'>"
      _indexesRecordBrowser.push(i);
      _RECORD_BROWSER_ROW_IDS.push(_content[i][_content[i].length - 1]);
      for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
        var index = _INDEX_ORDER[j];
        var id2 = "record_browser_cell_" + i1 + "_" + j;
        var contentText;
        if (j == 0) {
          if (_record_browser_filter_string_Standardized != null)
            contentText = highlightStringEZ(_content[i][index], _record_browser_filter_string_Standardized, startHighlight, endHighlight);
          else
            contentText = getHTMLSafeText(_content[i][index]);
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i1 + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i1 + "_" + j + "\");' onclick='onCellClick(" + i1 + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'>";
          if (!_subscribed_mode)
            tableHTML += "<img id='edit_icon_" + numRows + "' src='pencil.png' width=25px height=25px onclick='startEditRecord(\"" + _content[i][_content[i].length - 1] + "\", " + i1 + ", \"record_browser_row_" + i1 + "\");'>&nbsp;&nbsp;&nbsp;&nbsp;<img id='copy_icon_" + numRows + "' src='copy.png' width=30px height=30px onclick='startNewRecord(" + i + ");'>&nbsp;&nbsp;&nbsp;&nbsp;";
          tableHTML += "<div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + contentText + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i1 + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        }
        else if (index == _SPECMETHOD) {
          if (_record_browser_filter_string_Standardized != null)
            contentText = getExpandableHTML(null, (i1 + "_" + j), 100, INDEX_WIDTHS_CONCAT[index], null, _content[i][index], _record_browser_filter_string_Standardized);
          else
            contentText = getExpandableHTML([_content[i][index]], (i1 + "_" + j), 100, INDEX_WIDTHS_CONCAT[index]);
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i1 + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i1 + "_" + j + "\");' onclick='onCellClick(" + i1 + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + contentText + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i1 + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        }
        else if (index < _INDEXES.length) {
          if (_record_browser_filter_string_Standardized != null)
            contentText = highlightStringEZ(_content[i][index], _record_browser_filter_string_Standardized, startHighlight, endHighlight);
          else
            contentText = getHTMLSafeText(_content[i][index]);
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i1 + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i1 + "_" + j + "\");' onclick='onCellClick(" + i1 + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + contentText + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i1 + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        }
        else { //Memo field)
          if (_record_browser_filter_string_Standardized != null)
            contentText = getExpandableHTML(null, (i1 + "_" + j), 100, INDEX_WIDTHS_CONCAT[index], null, stringifyArrayEndChar(_content[i][index], " "), _record_browser_filter_string_Standardized);
          else
            contentText = getExpandableHTML(_content[i][index], (i1 + "_" + j), 100, INDEX_WIDTHS_CONCAT[index]);
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i1 + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i1 + "_" + j + "\");' onclick='onCellClick(" + i1 + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + contentText + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i1 + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
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

    tableHTML += "</tbody></table>";
    document.getElementById("record_browser_table_div").innerHTML = tableHTML;
  }
  if (highlight_IndexStart_Green && document.getElementById("record_browser_row_" + origIndexStart) != null) {
    document.getElementById("record_browser_row_" + origIndexStart).style.backgroundColor = _tempTopRowColor;
  }
}

function startEditRecord(record_id, rownum, row_id) {
  var rownum = getContentIndexFrom_DB_ID(record_id);
  if (rownum != null) {
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
    if (ele != null) {
      ele.focus();
      ele.select();
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

  if (!_DEBUG_LOCAL_MODE) {
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
    if (i == 0) {
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
  if (ele != null) {
    ele.focus();
    ele.select();
  }
  ele = document.getElementById("new_textarea_" + _INDEX_ORDER.indexOf(_OEM_PN));
  if (ele != null) {
    ele.value = "OEM" + (_largestOEMNumber + 1);
  }
  ele = document.getElementById("new_textarea_" + _INDEX_ORDER.indexOf(_RECORD_NUMBER));
  if (ele != null) {
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
  if (!_DEBUG_LOCAL_MODE)
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
  if (_DEBUG_LOCAL_MODE)
    row.push(newPartRef); //Add key to end
  else
    row.push(newPartRef.key);

  generateContent_Standard_New();
  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  clearSearchResults();

  if (!_DEBUG_LOCAL_MODE) {
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
  if (!_DEBUG_LOCAL_MODE) {
    deleteFromDatabase('parts_db/P&A_PRI/' + _content[rownum][_content[rownum].length - 1], true, true, false, null);
  }

  _content.splice(rownum, 1);
  _content_standard.splice(rownum, 1);

  populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  setLargestRecordNumbers();
  clearSearchResults();
}

function recordBrowserJumpToEdge(forward) {
  var index = getMaxContentIndexInSortOrder(forward, null, _record_browser_filter_string_Standardized);
  populateRecordBrowser(index, false);
  if (forward) {
    var cell = getCell(_recordBrowserMax - 1, _selectedCell, _TABLE_RECORD_BROWSER);
    if (cell != null) {
      onCellClick(_recordBrowserMax - 1, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
      return;
    }
    for (var i = 0; i < _recordBrowserMax; ++i) { //For when record browser has less rows than the max (e.g. filtered or small database)
      var cell1 = getCell(i, _selectedCell, _TABLE_RECORD_BROWSER);
      if (cell1 != null)
        cell = cell1;
      else if (cell != null) {
        onCellClick(i - 1, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
        break;
      }
    }
  }
  else {
    var cell = getCell(0, _selectedCell, _TABLE_RECORD_BROWSER);
    if (cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
  }
}

function showRecordBrowserMax() {
  document.getElementById('save_record_browser_max').style.display = 'inline';
  deselectTable();
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

function selectRecentRecordBrowserRow() {
  var cell = getCell(_selectedRow, _selectedCell, _TABLE_RECORD_BROWSER);
  if (cell != null)
    onCellClick(_selectedRow, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
}