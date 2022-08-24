var _SortOrderKeyCodes = [];
function populateSortOrders() {
  _SortOrderKeyCodes = [];
  document.getElementById("sort_order_table_div").innerHTML = "";
  var newHTML = "<table>";
  var shortcut_window_html = "";
  for (var i = 0; i < _sort_orders.length; ++i) {
    var quickLetter = "0";
    var keyCode = "";
    if (i < _ALPHABET.length) {
      quickLetter = _ALPHABET[i];
      keyCode = "Key" + quickLetter;
    }
    else {
      quickLetter = String(i - _ALPHABET.length);
      keyCode = "Digit" + quickLetter;
    }
    _SortOrderKeyCodes.push(keyCode);

    var id1 = i + 1;
    newHTML += "<tr id='sort_order_row_" + id1 + "'><td>" + quickLetter + "</td><td>" +
      "<div style='display: none; align-items: center; justify-content: center;' id='sort_order_buttons_" + id1 + "'>" +
      "<div style='flex-direction: column; width: 100px;'>" +
      "<button id='sort_order_button_save" + id1 + "'           style='background-color: #70A2FF; color: black; width: 70px; font-size: 20px;' onclick='saveEditSortOrder(" + id1 + ");'><span style='color: white;'>S</span>ave</button>" +
      "<button id='sort_order_button_cancel" + id1 + "'         style='background-color: #70A2FF; color: black; width: 70px; font-size: 20px; margin-top: 5px;' onclick='populateSortOrders();'><span style='color: white;'>C</span>ancel</button>" +
      "<button id='sort_order_button_delete" + id1 + "'         style='background-color: #70A2FF; color: red;   width: 70px; font-size: 20px; margin-top: 5px;' onclick='startDeleteSortOrder(" + id1 + ");'><span style='color: white;'>D</span>elete</button>" +
      "<button id='sort_order_button_confirm_delete" + id1 + "' style='background-color: #70A2FF; color: red;   display: none; width: 100px; font-size: 20px; margin-top: 5px;' onclick='confirmDeleteSortOrder(" + id1 + ");'>Confirm <span style='color: white;'>D</span>elete</button>" +
      "<button id='sort_order_button_cancel_delete" + id1 + "'  style='background-color: #70A2FF; color: black; display: none; width: 100px; font-size: 20px; margin-top: 5px;' onclick='cancelDeleteSortOrder(" + id1 + ");'><span style='color: white;'>C</span>ancel Delete</button>" +
      "</div>" +
      "<p style='font-size: 20px;'>Name&nbsp;</p><input id='sort_order_name_" + id1 + "' type='text' style='width: 500px; font-size: 20px;' onfocus='deselectTable();'>" +
      "</div>" +
      "<div id='sort_order_static_" + id1 + "'>";
    if (!_subscribed_mode || _writeable_mode)
      newHTML += "<img class='clickable' style='display: inline;' id='sort_order_edit_icon_" + i + "' src='pencil.png' width=20px height=20px onclick='startEditSortOrder(" + id1 + ");'>&nbsp;&nbsp;&nbsp;&nbsp;";
    newHTML += "<button id='sort_order_sort_button_" + id1 + "' style='font-size: 20px;' onclick='sortContentBySortOrder(" + i + ");'>Sort</button>&nbsp;&nbsp;&nbsp;&nbsp;" +
      "<p style='display: inline; font-size: 20px;'>" + getHTMLSafeText(_sort_orders[i].name) + "</p>" +
      "</div>" +
      "</td>";
    for (var j = 0; j < _sort_orders[i].sorted_indexes.length; ++j) {
      var index = _sort_orders[i].sorted_indexes[j];
      newHTML += getSortOrderCell(id1, j, index);
    }
    newHTML += "</tr>";

    shortcut_window_html += "<span style='color: white;'>" + quickLetter + "</span>. ." + getHTMLSafeText(_sort_orders[i].name) + "<br>";
  }
  newHTML += "</table>";
  document.getElementById("sort_order_table_div").innerHTML = newHTML;
  document.getElementById("key_shortcut_index_window").innerHTML = shortcut_window_html;
  document.getElementById("key_shortcut_index_window_edit").innerHTML = shortcut_window_html;
  setKeyboardShortcutBar();
}

function sortContentByIndex(index) {

  var index_array = [index];
  if (isArrayEqual(index_array, _contentSortedIndexes)) {
    _contentSortedReverse = !_contentSortedReverse;
  }
  else {
    _contentSortedReverse = false;
  }
  _contentSortedIndexes = index_array;
  if (_selected_tab == TAB_RECORD_BROWSER) {
    populateRecordBrowser(_currentRecordBrowserStartIndex, false);
    var cell = getCell(0, _selectedCell, _TABLE_RECORD_BROWSER);
    if (cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
  }
  re_sort_searchResults();

  // showSnackbar("Sorting by index...", 6000);
  // document.getElementById("content_div").style.display = "none";

  // var _selectedRecord_DB_ID = null;
  // if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length) {
  //   _selectedRecord_DB_ID = _content[_selectedRow][_content[_selectedRow].length - 1];
  // }

  // var index_array = [index];
  // if (isArrayEqual(index_array, _contentSortedIndex)) {
  //   _contentSortedReverse = !_contentSortedReverse;
  // }
  // else {
  //   _contentSortedReverse = false;
  // }

  // var sortWorker = new Worker('workers/WORKER_sort_content_by_index.js');
  // sortWorker.postMessage([_content, index, _INDEXES, _contentSortedReverse]);
  // sortWorker.onmessage = function (e) {
  //   _content = e.data[0];
  //   generateContent_Standard();
  //   _contentSortedIndex = [index];
  //   populateRecordBrowser(0, false);
  //   document.getElementById("message").innerHTML = "";
  //   document.getElementById("content_div").style.display = "";
  //   if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null) {
  //     var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
  //     if (index1 != null) {
  //       populateRecordBrowser(index1, false);
  //       var cell = getCell(index1, _selectedCell, _selectedTable);
  //       if (cell != null)
  //         onCellClick(index1, _selectedCell, cell.id, _selectedTable);
  //     }
  //   }
  //   showSnackbar("Sorting search results...", 3000);
  //   re_sort_searchResults();
  //   setTab(_selected_tab);
  // }
}

function sortContentBySortOrder(order_index) {

  var index_array = _sort_orders[order_index].sorted_indexes;
  if (isArrayEqual(index_array, _contentSortedIndexes)) {
    _contentSortedReverse = !_contentSortedReverse;
  }
  else {
    _contentSortedReverse = false;
  }
  _contentSortedIndexes = index_array;
  if (_selected_tab == TAB_RECORD_BROWSER) {
    populateRecordBrowser(_currentRecordBrowserStartIndex, false);
    var cell = getCell(0, _selectedCell, _TABLE_RECORD_BROWSER);
    if (cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
  }
  re_sort_searchResults();

  // showSnackbar("Sorting by index...", 6000);
  // document.getElementById("content_div").style.display = "none";

  // var _selectedRecord_DB_ID = null;
  // if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow >= 0 && _selectedRow < _content.length) {
  //   _selectedRecord_DB_ID = _content[_selectedRow][_content[_selectedRow].length - 1];
  // }

  // var sorted_indexes = _sort_orders[order_index].sorted_indexes;
  // if (isArrayEqual(sorted_indexes, _contentSortedIndex)) {
  //   _contentSortedReverse = !_contentSortedReverse;
  // }
  // else {
  //   _contentSortedReverse = false;
  // }

  // var sortWorker = new Worker('workers/WORKER_sort_content_by_sort_order.js');
  // sortWorker.postMessage([_content, sorted_indexes, _INDEXES, _contentSortedReverse]);
  // sortWorker.onmessage = function (e) {
  //   _content = e.data[0];
  //   generateContent_Standard();
  //   _contentSortedIndex = sorted_indexes;
  //   populateRecordBrowser(0, false);
  //   document.getElementById("message").innerHTML = "";
  //   document.getElementById("content_div").style.display = "";
  //   if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRecord_DB_ID != null) {
  //     var index1 = getContentIndexFrom_DB_ID(_selectedRecord_DB_ID);
  //     if (index1 != null) {
  //       populateRecordBrowser(index1, false);
  //       var cell = getCell(index1, _selectedCell, _selectedTable);
  //       if (cell != null)
  //       onCellClick(index1, _selectedCell, cell.id, _selectedTable);
  //     }
  //   }
  //   showSnackbar("Sorting search results...", 3000);
  //   re_sort_searchResults();
  //   setTab(_selected_tab);
  // }
}

function re_sort_searchResults() {
  // _searchResults.sort(COMPARE_SEARCHRESULTS_TO_SORTED_CONTENT);
  _search_results_resorted = true;
  if (_selected_tab == TAB_SEARCH_RESULTS) {
    populateSearchResults(_currentSearchResultsStartIndex, false, false, -1);
    var cell = getCell(0, _selectedCell, _TABLE_SEARCH_RESULTS);
    if (cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
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
    savedIndexes.push(_INDEX_ORDER[document.getElementById("sort_order_select_" + id1 + "_" + i).selectedIndex]);

  document.getElementById('sort_order_row_' + id1).innerHTML += getSortOrderNewCell(id1, id2 + 1);
  document.getElementById("sort_order_buttons_" + id1 + "_" + id2).style.display = "none";
  for (var i = 0; i <= id2; ++i)
    document.getElementById("sort_order_select_" + id1 + "_" + i).selectedIndex = _INDEX_ORDER.indexOf(savedIndexes[i]);
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
    sorted_indexes.push(_INDEX_ORDER[select.selectedIndex]);
    ++i;
  }

  if (sorted_indexes.length > 0) {
    var sortObj = new Object();
    sortObj.name = document.getElementById("sort_order_name_0").value;
    sortObj.sorted_indexes = sorted_indexes;

    var sortListRef = getDatabaseRef('sort_orders');
    var newSortOrderRef = sortListRef.push();
    writeToDatabase('sort_orders/' + newSortOrderRef.key, sortObj, false, false, false, null);
    writeToChangeHistory("Add | Sort Order", "New Sort Order \"" + sortObj.name + "\" | Order: " + getSortOrderString(sortObj));
  }

  cancelNewSortOrder();
}

var _current_sort_order_editing = 0;
function startEditSortOrder(id1) {
  _current_sort_order_editing = id1;
  document.getElementById("sort_order_static_" + id1).style.display = "none";
  for (var i = 0; i < _sort_orders.length && (!_subscribed_mode || _writeable_mode); ++i)
    document.getElementById("sort_order_edit_icon_" + i).style.display = "none";
  document.getElementById("sort_order_sort_button_" + id1).style.display = "none";
  document.getElementById("sort_order_buttons_" + id1).style.display = "flex";
  document.getElementById("sort_order_name_" + id1).value = _sort_orders[id1 - 1].name;
  var i = 0;
  while (document.getElementById("sort_order_static_cell_" + id1 + "_" + i) != null) {
    document.getElementById("sort_order_static_cell_" + id1 + "_" + i).style.display = "none";
    var select1 = document.getElementById("sort_order_select_" + id1 + "_" + i);
    select1.style.display = "";
    select1.selectedIndex = _INDEX_ORDER.indexOf(_sort_orders[id1 - 1].sorted_indexes[i]);
    ++i;
  }
  document.getElementById("sort_order_buttons_" + id1 + "_" + (i - 1)).style.display = "";
}

function saveEditSortOrder(id1) {
  var i = 0;
  var sorted_indexes = [];
  while (document.getElementById("sort_order_select_" + id1 + "_" + i) != null) {
    var select = document.getElementById("sort_order_select_" + id1 + "_" + i);
    sorted_indexes.push(_INDEX_ORDER[select.selectedIndex]);
    ++i;
  }

  if (sorted_indexes.length > 0) {
    var sortObj = new Object();
    sortObj.name = document.getElementById("sort_order_name_" + id1).value;
    sortObj.sorted_indexes = sorted_indexes;

    writeToDatabase('sort_orders/' + _sort_orders[id1 - 1].key, sortObj, false, false, false, null);
    writeToChangeHistory("Edit | Sort Order", "Edited Sort Order \"" + sortObj.name + "\" | Order: " + getSortOrderString(sortObj));
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
  var sortObj = _sort_orders[id1 - 1];
  deleteFromDatabase('sort_orders/' + _sort_orders[id1 - 1].key, false, false, false, null);
  writeToChangeHistory("Delete | Sort Order", "Deleted Sort Order \"" + sortObj.name + "\" | Order: " + getSortOrderString(sortObj));
  populateSortOrders();
}

function getSortColor(index) {
  var pos = _contentSortedIndexes.indexOf(index);
  var color1 = pos * (155 / _contentSortedIndexes.length) + 100;
  if (_contentSortedReverse) {
    return ("rgb(255, " + color1 + "," + color1 + ")");
  }
  else {
    return ("rgb(" + color1 + "," + color1 + ", 255)");
  }
}