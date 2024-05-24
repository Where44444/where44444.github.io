window.onbeforeunload = function (e) {
  console.log("Refreshed");
  clearData();
  closeWebSocket();
};

var _startTouchTime = 0;
document.addEventListener('touchstart', function (event) {
  _startTouchTime = (new Date()).getTime();
});

document.addEventListener('touchend', function (event) {
  if ((new Date()).getTime() - _startTouchTime < 300) { //Helps to avoid clicking after a drag event
    if (isMobileDevice()) {
      let scrollY = window.scrollY;
      var shouldCancel = true;
      if (event.target.tagName == "INPUT") {
        event.target.focus();
        shouldCancel = false;
      }
      else if (event.target.parentElement != null && event.target.parentElement.tagName == "INPUT") {
        event.target.parentElement.focus();
        shouldCancel = false;
      }
      else if (event.target != null && event.target.click != null && event.target.tagName != "TD") { //TD is for selecting date from calendar widget on filter inputs, the mobile tap only registers if the default event is allowed to happen
        document.activeElement.blur();
        event.target.click();
      }
      else
        shouldCancel = false;
      // if (event.target.tagName == "INPUT")
      //   event.target.click();
      // else if (event.target.parentElement != null && event.target.parentElement.tagName == "INPUT")
      //   event.target.parentElement.click();
      if (shouldCancel && event.cancelable) {
        event.preventDefault();
      }
      window.scrollTo(window.scrollX, scrollY);
    }
  }
}, false);

document.addEventListener('click', function (event) {
  if (isMobileDevice()) {
    if (event.target.id != "nav_bar_toggle")
      setNavBar(false);
    if (event.target.id != "button_googlesearch_image_left" && event.target.id != "button_googlesearch_image_right")
      hideGoogleSearchImage();
  }
}, false);

document.addEventListener('focus', function (event) {
  event.preventDefault();
});

window.addEventListener("focus", function (event) {
  pressedKeys = {};
}, false);

window.addEventListener("blur", function (event) {
  pressedKeys = {};
}, false);

document.addEventListener('focusin', function () {
  if (document.activeElement.getBoundingClientRect().bottom > document.getElementById("key_shortcut_info_bar").getBoundingClientRect().top) //If the bottom shortcut key bar is hiding an input
  {
    window.scrollBy(0, 10 + (document.activeElement.getBoundingClientRect().bottom - document.getElementById("key_shortcut_info_bar").getBoundingClientRect().top));
  }
  if ((document.activeElement.tagName == "INPUT" && (document.activeElement.type == "text" || document.activeElement.type == "number" || document.activeElement.type == "password")) || document.activeElement.tagName == "TEXTAREA") {
    document.getElementById("key_shortcut_index_window").style.display = "none";
    deselectTable();
    _focused = true;
    setKeyboardShortcutBar();
  }
  if (document.activeElement.id == "search_input_9") {
    show_more_column_checkboxes(true);
  }
}, true);

document.addEventListener('focusout', function () {
  _focused = false;
  setKeyboardShortcutBar();
}, true);

var _focused = false;
var _key_shortcut_Index_available = false;
var _key_shortcut_mainmenu_available = false;
var _key_shortcut_add_record_view_available = false;
var _key_shortcuts_record_view_available = false;
var shortcutmenu_mainmenu_available = false;
var _key_shortcut_edit_part_available = false;
var _key_shortcut_copy_part_available = false;
var _key_shortcut_compare_record_views_available = false;
var _key_shortcut_edit_record_views_pn_available = false;
var _key_shortcut_edit_record_view_whole_available = false;
var _key_shortcut_record_browser_sort_by_column = false;
var _key_shortcut_sort_order_edit_available = false;
var _key_shortcut_sort_order_new_available = false;
var _key_shortcut_sort_order_edit_addremove_available = false;
var _key_shortcut_sort_order_new_addremove_available = false;
var _key_shortcut_pdfimport_browse_available = false;
var _key_shortcut_ocrimport_marcone_available = false;
var _key_shortcut_ocrimport_reliableparts_available = false;
var _key_shortcut_ocrimport_wlmay_available = false;
var _key_shortcut_invoice_remove_available = false;
var _key_shortcut_record_views_image_available = false;
var _key_shortcut_record_views_jump_pn_available = false;
var _key_shortcut_search_results_sort_by_column = false;
var _key_shortcut_search_results_search_in_current_results = false;
function setKeyboardShortcutBar() {
  var text = "";
  _key_shortcut_Index_available = false;
  _key_shortcut_mainmenu_available = false;
  _key_shortcut_add_record_view_available = false;
  _key_shortcuts_record_view_available = false;
  _key_shortcut_edit_part_available = false;
  _key_shortcut_copy_part_available = false;
  _key_shortcut_compare_record_views_available = false;
  _key_shortcut_edit_record_views_pn_available = false;
  _key_shortcut_edit_record_view_whole_available = false;
  _key_shortcut_record_browser_sort_by_column = false;
  _key_shortcut_sort_order_edit_available = false;
  _key_shortcut_sort_order_new_available = false;
  _key_shortcut_sort_order_edit_addremove_available = false;
  _key_shortcut_sort_order_new_addremove_available = false;
  _key_shortcut_pdfimport_browse_available = false;
  _key_shortcut_ocrimport_marcone_available = false;
  _key_shortcut_ocrimport_reliableparts_available = false;
  _key_shortcut_ocrimport_wlmay_available = false;
  _key_shortcut_invoice_remove_available = false;
  _key_shortcut_record_views_image_available = false;
  _key_shortcut_record_views_jump_pn_available = false;
  _key_shortcut_search_results_sort_by_column = false;
  _key_shortcut_search_results_search_in_current_results = false;

  var content_visible = document.getElementById("content_div").style.display != "none";
  if (content_visible) {
    if (document.getElementById("key_shortcut_index_window").style.display != "none") {
      text += "<span style='color: white;'>Esc</span> Close&nbsp;&nbsp;<span style='color: white;'>Letter or Number</span> Sort by Index";
    }
    else if (_focused) {
      text += "<span style='color: white;'>Esc</span> Stop Editing";
    }
    else if (document.getElementById("TAB_mainmenu_div").style.display != "none") {

    }
    else {
      _key_shortcut_Index_available = true;
      _key_shortcut_mainmenu_available = true;
      text += "<span style='color: white;'>I</span>ndex Sort&nbsp;&nbsp;<span style='color: white;'>Esc</span> Back";
    }

    if (!_focused && _isTableSelected) {
      _key_shortcut_add_record_view_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>V</span> Add Record View";
    }
    if (!_focused && _isTableSelected && _selectedTable == _TABLE_SEARCH_RESULTS) {
      _key_shortcut_search_results_sort_by_column = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>R</span> Sort by column";
    }
    if (!_focused && _selected_tab == TAB_SAVED_SEARCHES) {
      text += "&nbsp;&nbsp;<span style='color: white;'>1-9</span> Select";
    }
    if (!_focused && _selected_tab == TAB_SEARCH) {
      text += "&nbsp;&nbsp;Save<span style='color: white;'>d</span> Searches";
    }
    if (!_focused && _selected_tab == TAB_SEARCH_RESULTS) {
      _key_shortcut_search_results_search_in_current_results = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>S</span>earch in Current Results&nbsp;&nbsp;Save<span style='color: white;'>d</span> Searches";
    }
    if (!_focused && _selected_tab == TAB_RECORD_VIEWS && _recordViews.length > 0) {
      _key_shortcuts_record_view_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>1-9</span>&nbsp;Select";
      _key_shortcut_compare_record_views_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>Q</span>&nbsp;Dif.&nbsp;&nbsp;<span style='color: white;'>W</span>&nbsp;Sim.&nbsp;&nbsp;<span style='color: white;'>A</span>&nbsp;All";
      if (_record_view_page_list[_selected_record_view] < 3 && (!_subscribed_mode || _writeable_mode)) {
        _key_shortcut_edit_record_views_pn_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>E</span>dit";
      }
      if ((_record_view_page_list[_selected_record_view] == 1 || _record_view_page_list[_selected_record_view] == 2) && (!_subscribed_mode || _writeable_mode)) {
        _key_shortcut_edit_record_view_whole_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>R</span>&nbsp;Edit Record";
      }
      _key_shortcut_record_views_jump_pn_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>J</span>ump Child Part";
      _key_shortcut_record_views_image_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>Ctrl</span>+<span style='color: white;'>A</span>KA";
    }
    if (!_focused && _isTableSelected && _selectedTable == _TABLE_RECORD_BROWSER) {
      if (!_subscribed_mode || _writeable_mode) {
        _key_shortcut_edit_part_available = true;
        _key_shortcut_copy_part_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>E</span>dit";
        text += "&nbsp;&nbsp;<span style='color: white;'>C</span>opy";
      }
      _key_shortcut_record_browser_sort_by_column = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>R</span> Sort by column";
    }
    if (!_focused && _selected_tab == TAB_SORT_ORDERS) {
      var ele = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
      var ele2 = document.getElementById("button_sortorder_new_save");
      if (ele2 != null && ele2.style.display != "none") {
        _key_shortcut_sort_order_new_addremove_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>-</span> Remove&nbsp;&nbsp;<span style='color: white;'>+</span> Add";
      }
      else if (document.getElementById("key_shortcut_index_window_edit").style.display == "none" && (ele == null || ele.style.display == "none")) {
        if (!_subscribed_mode || _writeable_mode) {
          _key_shortcut_sort_order_edit_available = true;
          _key_shortcut_sort_order_new_available = true;
          text += "&nbsp;&nbsp;<span style='color: white;'>E</span>dit&nbsp;&nbsp;<span style='color: white;'>A</span>dd New";
        }
      }
      else if (ele != null && ele.style.display != "none") {
        _key_shortcut_sort_order_edit_addremove_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>-</span> Remove&nbsp;&nbsp;<span style='color: white;'>+</span> Add";
      }

    }
    if (_selected_tab == TAB_PDF_IMPORT) {
      var ele = document.getElementById("import_marcone_ocr_input");
      // var ele = document.getElementById("wlmay_input_div");
      if (!_focused) {
        if (ele != null && ele.style.display != "none") {
          // _key_shortcut_pdfimport_browse_available = true;
          _key_shortcut_ocrimport_marcone_available = true;
          _key_shortcut_ocrimport_reliableparts_available = true;
          // _key_shortcut_ocrimport_wlmay_available = true;
          // text += "&nbsp;&nbsp;<span style='color: white;'>B</span>rowse&nbsp;&nbsp;<span style='color: white;'>M</span>arcone OCR&nbsp;&nbsp;<span style='color: white;'>R</span>eliable OCR&nbsp;&nbsp;<span style='color: white;'>W</span>LMay OCR";
          text += "&nbsp;&nbsp;<span style='color: white;'>M</span>arcone OCR&nbsp;&nbsp;<span style='color: white;'>R</span>eliable OCR";
        }
      }
      ele = document.getElementById("table_pdfimport_row_0");
      var ele2 = document.getElementById("wlmay_pdf_table_div");
      if (ele != null && ele2.style.display != "none") {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row";
      }
    }
    if (_selected_tab == TAB_REORDERS) {
      var ele = document.getElementById("table_reorders_row_0");
      if (ele != null && ele.style.display != "none") {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row";
      }
    }
    if (_selected_tab == TAB_INVOICE_HISTORY) {
      var ele = document.getElementById("invoicehistory_table_row_0");
      var ele2 = document.getElementById("invoice_from_history_content");
      if (ele != null && ele.style.display != "none" && (ele2 == null || ele2.style.display == "none")) {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row&nbsp;&nbsp;<span style='color: white;'>Enter</span> View&nbsp;&nbsp;<span style='color: white;'>S</span>elect Row";
      }
    }
    if (_selected_tab == TAB_PART_HISTORY) {
      var ele = document.getElementById("parthistory_table_row_0");
      if (ele != null && ele.style.display != "none") {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row";
      }
    }
    if (_selected_tab == TAB_INVOICE) {
      if (!_focused && _invoice_objs.length > 0) {
        _key_shortcut_invoice_remove_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>R</span>emove";
      }
    }

    document.getElementById("key_shortcut_info_bar").innerHTML = text;
    document.getElementById("key_shortcut_info_bar").style.display = "";
  }
  else //Logged out
  {
    document.getElementById("key_shortcut_info_bar").style.display = "none";
  }
}

// document.addEventListener("keyup", function(event) { 
//   switch(event.code){
//   }
// });

// Get the input field
var input_email = document.getElementById("email_input");
var input_password = document.getElementById("password_input");
var input_search = document.getElementById("search_input");
var input_employee_id = document.getElementById("employee_id");

// Execute a function when the user releases a key on the keyboard
input_email.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("login_button").click();
  }
});

input_password.addEventListener("keyup", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("login_button").click();
  }
});

input_search.addEventListener("keydown", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("search_any_button").click();
  }
  else if (event.code === KEY_UP_ARROW) {
    event.preventDefault();
    viewHistory(-1, -1);
  }
  else if (event.code === KEY_DOWN_ARROW) {
    event.preventDefault();
    viewHistory(-1, 1);
  }
});

input_employee_id.addEventListener("keyup", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("button_employee_id").click();
  }
});

document.getElementById("email_input_temp").addEventListener("keyup", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("button_login_temp").click();
  }
});

document.getElementById("password_input_temp").addEventListener("keyup", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("button_login_temp").click();
  }
});

document.getElementById("email_input_sync").addEventListener("keyup", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("button_login_sync").click();
  }
});

document.getElementById("password_input_sync").addEventListener("keyup", function (event) {
  if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("button_login_sync").click();
  }
});

for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
  var ele = document.getElementById("search_input_" + i);
  if (ele != null) {
    ele.addEventListener("input", function (event) {
      if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {

      }
      else if (event.code === KEY_UP_ARROW) {

      }
      else if (event.code === KEY_DOWN_ARROW) {

      }
      else if (event.code === KEY_ESCAPE) {
        // clearSearchAutocomplete();
      }
      else {
        showSearchAutocomplete();
      }
    });
    ele.addEventListener("keyup", function (event) {
      if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {
        event.preventDefault();
        if (_search_autocomplete_matches.length > 0)
          searchInputAutocomplete();
        else
          document.getElementById("search_specific_button").click();
      }
      else if (event.code === KEY_UP_ARROW) {

      }
      else if (event.code === KEY_DOWN_ARROW) {

      }
      else if (event.code === KEY_ESCAPE) {
        // clearSearchAutocomplete();
      }
      else {
        showSearchAutocomplete();
      }
    });
    ele.addEventListener("keydown", function (event) {
      if (event.code === KEY_ENTER || event.code === KEY_NUMPADENTER) {

      }
      else if (event.code === KEY_UP_ARROW) {
        event.preventDefault();
        if (_search_autocomplete_matches.length > 0)
          selectSearchAutocompleteUp();
        else
          viewHistory(null, -1);
      }
      else if (event.code === KEY_DOWN_ARROW) {
        event.preventDefault();
        if (_search_autocomplete_matches.length > 0)
          selectSearchAutocompleteDown();
        else
          viewHistory(null, 1);
      }
    });
  }
}

// var KEY_ENTER = 13;
// var KEY_ESCAPE = 27;
// var KEY_LEFT_ARROW = 37;
// var KEY_UP_ARROW = 38;
// var KEY_RIGHT_ARROW = 39;
// var KEY_DOWN_ARROW = 40;
// var KEY_TAB = 9;
// var KEY_PAGE_UP = 33;
// var KEY_PAGE_DOWN = 34;
// var KEY_SHIFT = 16;
// var KEY_CTRL = 17;

var KEY_ENTER = "Enter";
var KEY_NUMPADENTER = "NumpadEnter";
var KEY_ESCAPE = "Escape";
var KEY_LEFT_ARROW = "ArrowLeft";
var KEY_UP_ARROW = "ArrowUp";
var KEY_RIGHT_ARROW = "ArrowRight";
var KEY_DOWN_ARROW = "ArrowDown";
var KEY_TAB = "Tab";
var KEY_PAGE_UP = "PageUp";
var KEY_PAGE_DOWN = "PageDown";
var KEY_SHIFT_LEFT = "ShiftLeft";
var KEY_SHIFT_RIGHT = "ShiftRight";
var KEY_CTRL_LEFT = "ControlLeft";
var KEY_CTRL_RIGHT = "ControlRight";
var KEY_ALT_LEFT = "AltLeft";
var KEY_ALT_RIGHT = "AltRight";
var KEY_A = "KeyA";
var KEY_B = "KeyB";
var KEY_C = "KeyC";
var KEY_D = "KeyD";
var KEY_E = "KeyE";
var KEY_F = "KeyF";
var KEY_G = "KeyG";
var KEY_H = "KeyH";
var KEY_I = "KeyI";
var KEY_J = "KeyJ";
var KEY_K = "KeyK";
var KEY_L = "KeyL";
var KEY_M = "KeyM";
var KEY_N = "KeyN";
var KEY_O = "KeyO";
var KEY_P = "KeyP";
var KEY_Q = "KeyQ";
var KEY_R = "KeyR";
var KEY_S = "KeyS";
var KEY_T = "KeyT";
var KEY_U = "KeyU";
var KEY_V = "KeyV";
var KEY_W = "KeyW";
var KEY_X = "KeyX";
var KEY_Y = "KeyY";
var KEY_Z = "KeyZ";
var KEY_PLUS = "Equal";
var KEY_MINUS = "Minus";
var KEY_HOME = "Home";
var KEY_END = "End";

// var key_ctrl_held = false;
// var key_shift_held = false;

function moveLeft() {
  var preventDefault = true;
  if (_selectedCell == 0)
    preventDefault = false;
  if (preventDefault) {
    var column = _selectedCell - 1;
    var cell = getCell(_selectedRow, column, _selectedTable);
    if (cell != null)
      onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
  }
  return preventDefault;
}

function moveUp() {
  var preventDefault = true;
  var nextRBIndex = null;
  var nextSRIndex = null;
  if (_selectedTable == _TABLE_RECORD_BROWSER) {
    if (_selectedRow == 0) {
      nextRBIndex = getNextContentIndexInSortOrder(_indexesRecordBrowser[0], _contentSortedReverse, null, _record_browser_filter_string_Standardized);
      if (nextRBIndex == null)
        preventDefault = false;
    }
  }

  if (_selectedTable == _TABLE_SEARCH_RESULTS)
    if (_search_results_resorted) {
      if (_selectedRow == 0) {
        nextSRIndex = getNextContentIndexInSortOrder(_searchResults[_indexesSearchResults[0]].row, _contentSortedReverse, _search_results_indexes_bool);
        if (nextSRIndex == null)
          preventDefault = false;
      }
    }
    else {
      if (_selectedRow == 0 && _currentSearchResultsStartIndex == 0)
        preventDefault = false;
    }

  var row = _selectedRow - 1;
  if (preventDefault) {
    if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow == 0) {
      populateRecordBrowser(nextRBIndex, false); //Shift table bounds
      row = _selectedRow;
    }

    if (_selectedTable == _TABLE_SEARCH_RESULTS)
      if (_search_results_resorted) {
        if (_selectedRow == 0) {
          populateSearchResults(_search_results_row_to_result_index.get(nextSRIndex), true, false, -1); //Shift table bounds
          row = _selectedRow;
        }
      }
      else {
        if (_currentSearchResultsStartIndex > 0 && _selectedRow == 0)
          populateSearchResults(_currentSearchResultsStartIndex - 1, true, false, -1); //Shift table bounds
      }
  }
  var cell = getCell(row, _selectedCell, _selectedTable);
  if (cell != null)
    onCellClick(row, _selectedCell, cell.id, _selectedTable);
  return preventDefault;
}

function moveRight() {
  var preventDefault = true;
  if (_selectedCell == INDEXES_CONCAT.length - 1)
    preventDefault = false;
  if (preventDefault) {
    var column = _selectedCell + 1;
    var cell = getCell(_selectedRow, column, _selectedTable);
    if (cell != null)
      onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
  }
  return preventDefault;
}

function moveDown() {
  var preventDefault = true;
  var nextRBIndex = null;
  var nextSRIndex = null;
  if (_selectedTable == _TABLE_RECORD_BROWSER) {
    if (_selectedRow == _recordBrowserMax - 1) {
      nextRBIndex = getNextContentIndexInSortOrder(_indexesRecordBrowser[_recordBrowserMax - 1], !_contentSortedReverse, null, _record_browser_filter_string_Standardized);
      if (nextRBIndex == null)
        preventDefault = false;
    }
  }

  if (_selectedTable == _TABLE_SEARCH_RESULTS)
    if (_search_results_resorted) {
      if (_selectedRow == _searchResultsMax - 1) {
        nextSRIndex = getNextContentIndexInSortOrder(_searchResults[_indexesSearchResults[_searchResultsMax - 1]].row, !_contentSortedReverse, _search_results_indexes_bool);
        if (nextSRIndex == null)
          preventDefault = false;
      }
    }
    else {
      if (_selectedRow == _searchResultsMax - 1 && _currentSearchResultsStartIndex == _searchResults.length - _searchResultsMax)
        preventDefault = false;
    }

  var row = _selectedRow + 1;
  if (preventDefault) {
    if (_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow == _recordBrowserMax - 1) {
      populateRecordBrowser(nextRBIndex, false, true); //Shift table bounds
      row = _selectedRow;
    }
    if (_selectedTable == _TABLE_SEARCH_RESULTS)
      if (_search_results_resorted) {
        if (_selectedRow == _searchResultsMax - 1) {
          populateSearchResults(_search_results_row_to_result_index.get(nextSRIndex), false, true, -1, true); //Shift table bounds
          row = _selectedRow;
        }
      }
      else {
        if (_currentSearchResultsStartIndex < _searchResults.length - 1 && _selectedRow == _searchResults_ContentIndexes.length - 1) {
          populateSearchResults(_currentSearchResultsStartIndex + 1, false, true, -1); //Shift table bounds
        }
      }
  }
  var cell = getCell(row, _selectedCell, _selectedTable);
  if (cell != null)
    onCellClick(row, _selectedCell, cell.id, _selectedTable);
  return preventDefault;
}

function pageUp() {
  var preventDefault = true;
  var row = null;
  if (_selectedTable == _TABLE_RECORD_BROWSER && _selected_tab == TAB_RECORD_BROWSER) {
    var nextRBIndex = getNextContentIndexInSortOrder(_indexesRecordBrowser[0], _contentSortedReverse);
    if (nextRBIndex != null) {
      populateRecordBrowser(nextRBIndex, false, true);
      row = _selectedRow;
    }
    else {
      preventDefault = false;
      row = 0;
    }
  }
  else if (_selectedTable == _TABLE_SEARCH_RESULTS && _selected_tab == TAB_SEARCH_RESULTS) {
    if (_search_results_resorted) {
      var nextSRIndex = getNextContentIndexInSortOrder(_searchResults[_indexesSearchResults[0]].row, _contentSortedReverse, _search_results_indexes_bool);
      if (nextSRIndex != null) {
        populateSearchResults(_search_results_row_to_result_index.get(nextSRIndex), false, false, _selectedRow, true);
        row = _selectedRow;
      }
      else {
        preventDefault = false;
        row = 0;
      }
    }
    else {
      if (_selectedRow == 0 && _currentSearchResultsStartIndex == 0)
        preventDefault = false;
      if (preventDefault) {
        if (_currentSearchResultsStartIndex == 0)
          populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, true, false, -1);
        else
          populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, false, false, _selectedRow);
      }
    }
  }

  if (row != null) {
    var cell = getCell(row, _selectedCell, _selectedTable);
    if (cell != null)
      onCellClick(row, _selectedCell, cell.id, _selectedTable);
  }
  return preventDefault;
}

function pageDown() {
  var preventDefault = true;
  var row = null;
  if (_selectedTable == _TABLE_RECORD_BROWSER && _selected_tab == TAB_RECORD_BROWSER) {
    var nextRBIndex = getNextContentIndexInSortOrder(_indexesRecordBrowser[_recordBrowserMax - 1], !_contentSortedReverse);
    if (nextRBIndex != null) {
      populateRecordBrowser(nextRBIndex, false);
      row = _selectedRow;
    }
    else {
      preventDefault = false;
      row = _recordBrowserMax - 1;
    }
  }
  else if (_selectedTable == _TABLE_SEARCH_RESULTS && _selected_tab == TAB_SEARCH_RESULTS) {
    if (_search_results_resorted) {
      var nextSRIndex = getNextContentIndexInSortOrder(_searchResults[_indexesSearchResults[_searchResultsMax - 1]].row, !_contentSortedReverse, _search_results_indexes_bool);
      if (nextSRIndex != null) {
        populateSearchResults(_search_results_row_to_result_index.get(nextSRIndex), false, false, _selectedRow);
        row = _selectedRow;
      }
      else {
        preventDefault = false;
        row = _searchResultsMax - 1;
      }
    }
    else {
      if (_selectedRow == _searchResultsMax - 1 && _currentSearchResultsStartIndex == _searchResults.length - _searchResultsMax)
        preventDefault = false;
      if (preventDefault) {
        if (_currentSearchResultsStartIndex >= _searchResults.length - _searchResultsMax)
          populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, true, -1);
        else
          populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, false, _selectedRow);
      }
    }
  }

  if (row != null) {
    var cell = getCell(row, _selectedCell, _selectedTable);
    if (cell != null)
      onCellClick(row, _selectedCell, cell.id, _selectedTable);
  }
  return preventDefault;
}

function moveToHome() {
  var preventDefault = true;
  if (_selectedCell == 0)
    preventDefault = false;
  if (preventDefault) {
    var column = 0;
    var cell = getCell(_selectedRow, column, _selectedTable);
    if (cell != null)
      onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
  }
  return preventDefault;
}

function moveToEnd() {
  var preventDefault = true;
  if (_selectedCell == INDEXES_CONCAT.length - 1)
    preventDefault = false;
  if (preventDefault) {
    var column = INDEXES_CONCAT.length - 1;
    var cell = getCell(_selectedRow, column, _selectedTable);
    if (cell != null)
      onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
  }
  return preventDefault;
}

//index -1 = search any, dir -1 = back, 1 = forward
function viewHistory(index, dir) {
  if (index != null) {
    if (dir == -1) {
      if (_searchstring_any_history_index > 0)
        --_searchstring_any_history_index;
      if (_searchstring_any_history_index >= _searchstring_any_history.length)
        _searchstring_any_history_index = _searchstring_any_history.length - 1;
      if (_searchstring_any_history_index >= 0 && _searchstring_any_history_index < _searchstring_any_history.length)
        document.getElementById("search_input").value = _searchstring_any_history[_searchstring_any_history_index];

    }
    else {
      if (_searchstring_any_history_index < _searchstring_any_history.length - 1) {
        ++_searchstring_any_history_index;
        if (_searchstring_any_history_index >= _searchstring_any_history.length)
          _searchstring_any_history_index = _searchstring_any_history.length - 1;
        document.getElementById("search_input").value = _searchstring_any_history[_searchstring_any_history_index];
      }
    }
  }
  else {
    index = _selected_search_input;
    if (dir == -1) {
      if (_searchstring_specific_history_index[index] > 0)
        --_searchstring_specific_history_index[index];
      if (_searchstring_specific_history_index[index] >= _searchstring_specific_history[index].length)
        _searchstring_specific_history_index[index] = _searchstring_specific_history[index].length - 1;
      if (_searchstring_specific_history_index[index] >= 0 && _searchstring_specific_history_index[index] < _searchstring_specific_history[index].length)
        document.getElementById("search_input_" + index).value = _searchstring_specific_history[index][_searchstring_specific_history_index[index]];

    }
    else {
      if (_searchstring_specific_history_index[index] < _searchstring_specific_history[index].length - 1) {
        ++_searchstring_specific_history_index[index];
        if (_searchstring_specific_history_index[index] >= _searchstring_specific_history[index].length)
          _searchstring_specific_history_index[index] = _searchstring_specific_history[index].length - 1;
        document.getElementById("search_input_" + index).value = _searchstring_specific_history[index][_searchstring_specific_history_index[index]];
      }
    }
  }
}

onChangeShouldHighlight();
function onChangeShouldHighlight() {
  if (document.getElementById("search_highlight").checked) {
    document.getElementById("search_highlight_div").style.display = "block";
  }
  else {
    document.getElementById("search_highlight_div").style.display = "none";
  }
}

function clickRecordViewPNSaveButton() {
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var ele = document.getElementById("record_view_partnum_save_button_" + i + "_" + j);
      if (ele != null && ele.style.display != "none") {
        ele.click();
        return true;
      }
    }
  }
  return false;
}

function clickRecordViewPNCancelButton() {
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var ele = document.getElementById("record_view_partnum_cancel_button_" + i + "_" + j);
      if (ele != null && ele.style.display != "none") {
        ele.click();
        return true;
      }
    }
  }
  return false;
}

function checkForRecordViewSellButtons() {
  if (!_subscribed_mode || _writeable_mode) {
    if (!_overlay_window_open) {
      var foundIndexes = [];
      for (var i = 0; i < _EXTRA_DB.length; ++i) {
        if (i != 2) //Skip DNI extradb
        {
          var ele = document.getElementById("sell_button_" + _selected_record_view + "_" + i);
          if (ele != null && ele.style.display != "none")
            foundIndexes.push(i);
        }
      }
      if (foundIndexes.length > 0) {
        var html1 = "";
        for (var i = 0; i < foundIndexes.length; ++i) {
          var i2 = foundIndexes[i];
          html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i2] + "</span>. ." + _EXTRA_DB[i2] + "<br>";
        }
        document.getElementById("key_shortcut_extra_db_sell_window").innerHTML = html1;
        document.getElementById("key_shortcut_extra_db_sell_window").style.display = "";
        _overlay_window_open = true;
        return true;
      }
    }
  }
  return false;
}

function checkForRecordViewEditButtons() {
  if (!_overlay_window_open) {
    var html1 = "";
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
      var ele = document.getElementById("record_view_partnum_edit_icon_" + _selected_record_view + "_" + i);
      if (ele != null && ele.style.display != "none")
        html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i] + "</span>. ." + _EXTRA_DB[i] + "<br>";
    }
    document.getElementById("key_shortcut_extra_db_edit_window").innerHTML = html1;
    document.getElementById("key_shortcut_extra_db_edit_window").style.display = "";
    _overlay_window_open = true;
    return true;
  }
  return false;
}

function checkForRecordViewImageButtons() {
  if (!_overlay_window_open) {
    var html1 = "";
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
      var ele = document.getElementById("button_recordview_image_everywhere_" + _selected_record_view + "_" + i);
      if (ele != null && ele.style.display != "none")
        html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i] + "</span>. ." + _EXTRA_DB[i] + "<br>";
    }
    document.getElementById("key_shortcut_extra_db_image_window").innerHTML = html1;
    document.getElementById("key_shortcut_extra_db_image_window").style.display = "";
    _overlay_window_open = true;
    return true;
  }
  return false;
}

function checkForRecordViewJumpChildPartButtons() {
  if (!_overlay_window_open) {
    var html1 = "";
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
      var ele = document.getElementById("span_recordviews_jump_to_child_part_" + _selected_record_view + "_" + i);
      if (ele != null && ele.style.display != "none")
        html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i] + "</span>. ." + _EXTRA_DB[i] + "<br>";
    }
    document.getElementById("key_shortcut_extra_db_jumpPN_window").innerHTML = html1;
    document.getElementById("key_shortcut_extra_db_jumpPN_window").style.display = "";
    _overlay_window_open = true;
    return true;
  }
  return false;
}

function clickRecordViewSellConfirmButton() {
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var ele = document.getElementById("button_record_view_sell_confirm_" + i + "_" + j);
      var ele2 = document.getElementById("sell_form_" + i + "_" + j);
      if (ele != null && ele2.style.display != "none") {
        ele.click();
        return true;
      }
    }
  }
  return false;
}

function clickRecordViewSellCancelButton() {
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var ele = document.getElementById("button_record_view_sell_cancel_" + i + "_" + j);
      var ele2 = document.getElementById("sell_form_" + i + "_" + j);
      if (ele != null && ele2.style.display != "none") {
        ele.click();
        return true;
      }
    }
  }
  return false;
}

function clickRecordViewEditWholeSaveButton() {
  for (var i = 0; i < _recordViews.length; ++i) {
    var ele = document.getElementById("record_view_data_save_button_" + i);
    if (ele != null && ele.style.display != "none") {
      ele.click();
      return true;
    }
  }
  return false;
}

function clickRecordViewEditWholeCancelButton() {
  for (var i = 0; i < _recordViews.length; ++i) {
    var ele = document.getElementById("record_view_data_cancel_button_" + i);
    if (ele != null && ele.style.display != "none") {
      ele.click();
      return true;
    }
  }
  return false;
}

function clickRecordBrowserEditSaveButton() {
  var ele = document.getElementById("save_edit_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordBrowserEditCancelButton() {
  var ele = document.getElementById("cancel_edit_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordBrowserEditDeleteButton() {
  var ele = document.getElementById("delete_edit_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordBrowserEditDeleteConfirmButton() {
  var ele = document.getElementById("confirm_delete_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordBrowserEditDeleteCancelButton() {
  var ele = document.getElementById("cancel_delete_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordBrowserNewSaveButton() {
  var ele = document.getElementById("save_new_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordBrowserNewCancelButton() {
  var ele = document.getElementById("cancel_new_record");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_NewSaveButton() {
  var ele = document.getElementById("partchild_new_button_save");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_NewCancelButton() {
  var ele = document.getElementById("partchild_new_button_cancel");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_EditSaveButton() {
  var ele = document.getElementById("partchild_edit_button_save");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_EditCancelButton() {
  var ele = document.getElementById("partchild_edit_button_cancel");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_EditDeleteButton() {
  var ele = document.getElementById("partchild_edit_button_delete");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_EditDeleteConfirmButton() {
  var ele = document.getElementById("partchild_edit_button_confirm_delete");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPCRM_EditDeleteCancelButton() {
  var ele = document.getElementById("partchild_edit_button_cancel_delete");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_NewSaveButton() {
  var ele = document.getElementById("button_sortorder_new_save");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_NewCancelButton() {
  var ele = document.getElementById("button_sortorder_new_cancel");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_EditSaveButton() {
  var ele = document.getElementById("sort_order_button_save" + _current_sort_order_editing);
  var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_EditCancelButton() {
  var ele = document.getElementById("sort_order_button_cancel" + _current_sort_order_editing);
  var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_EditDeleteButton() {
  var ele = document.getElementById("sort_order_button_delete" + _current_sort_order_editing);
  var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_EditDeleteConfirmButton() {
  var ele = document.getElementById("sort_order_button_confirm_delete" + _current_sort_order_editing);
  var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickSortOrder_EditDeleteCancelButton() {
  var ele = document.getElementById("sort_order_button_cancel_delete" + _current_sort_order_editing);
  var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPdfImport_WLMAY_CancelButton() {
  var ele = document.getElementById("button_pdfimport_wlmay_cancel");
  var ele2 = document.getElementById("wlmay_pdf_table_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPdfImport_WLMAY_CancelAddRowButton() {
  var ele = document.getElementById("button_pdfimport_cancel_addrow");
  var ele2 = document.getElementById("wlmay_pdf_table_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPdfImport_WLMAY_SaveAddRowButton() {
  var ele = document.getElementById("button_pdfimport_save_addrow");
  var ele2 = document.getElementById("wlmay_pdf_table_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

var _table_pdf_import_selected_row = 0;
function set_tablePDFImport_SelectedRow(newRow) {
  if (document.activeElement != null && (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "SELECT" || document.activeElement.type == "number")) {

  }
  else {
    var inc = 0;
    var ele = document.getElementById("table_pdfimport_row_" + inc);
    var ele2 = document.getElementById("table_pdfimport_row_" + newRow);
    if (ele2 != null) {
      while (ele != null) {
        ele.style.backgroundColor = "";
        ++inc;
        ele = document.getElementById("table_pdfimport_row_" + inc);
      }
      ele2.style.backgroundColor = "#96BBFF";
      _table_pdf_import_selected_row = newRow;
      ele = document.getElementById("pdf_ordered_" + _table_pdf_import_selected_row);
      if (ele != null) {
        ele.focus();
        ele.select();
      }
      eleSmartScroll(ele2, 103, 60);
      // ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
      return true;
    }
  }
  return false;
}

function clickPdfImport_WLMAY_AddPartChild_Cancel() {
  var ele = document.getElementById("button_pdfimport_newpartchild_cancel");
  var ele2 = document.getElementById("wlmay_pdf_table_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPdfImport_WLMAY_AddPartChild_Submit() {
  var ele = document.getElementById("button_pdfimport_newpartchild_submit");
  var ele2 = document.getElementById("wlmay_pdf_table_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

var _table_reorders_selected_row = -1;
function set_tableReorders_SelectedRow(newRow) {
  var inc = 0;
  var ele = document.getElementById("table_reorders_row_" + inc);
  var rowNum = -1;
  while (ele != null) {
    if (_reorders_order_map.has(inc) && _reorders_order_map.get(inc))
      ele.style.backgroundColor = "lightgreen";
    else
      ele.style.backgroundColor = "";
    rowNum = inc;
    ++inc;
    ele = document.getElementById("table_reorders_row_" + inc);
  }

  var newRow2 = newRow;
  if (newRow2 > rowNum)
    newRow2 = rowNum;
  if (newRow2 < 0)
    newRow2 = 0;

  var ele2 = document.getElementById("table_reorders_row_" + newRow2);
  if (ele2 != null) {
    var newColor = "#96BBFF";
    if (_reorders_order_map.has(newRow2) && _reorders_order_map.get(newRow2))
      newColor = "greenyellow";

    ele2.style.backgroundColor = newColor;
    eleSmartScroll(ele2, 103, 60);
    // ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    if (newRow2 != _table_reorders_selected_row) {
      _table_reorders_selected_row = newRow2;
      return true;
    }
  }
  return false;
}

function clickReorders_UpdateAllReorders() {
  var ele = document.getElementById("button_update_reorders");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickReorders_AddRecordView() {
  var ele = document.getElementById("button_reorder_addrecordview_" + _table_reorders_selected_row);
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

// function clickReorders_JumpBrowser() {
//   var ele = document.getElementById("button_reorder_jumprecordbrowser_" + _table_reorders_selected_row);
//   if (ele != null && ele.style.display != "none") {
//     ele.click();
//     return true;
//   }
//   return false;
// }

function clickReorders_Order() {
  var ele = document.getElementById("button_reorder_order_" + _table_reorders_selected_row);
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickReorders_UpdateRow() {
  var ele = document.getElementById("button_reorder_updaterow_" + _table_reorders_selected_row);
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

// function clickInvoiceHistory_Update() {
//   var ele = document.getElementById("button_update_invoice_history");
//   if (ele != null && ele.style.display != "none") {
//     ele.click();
//     return true;
//   }
//   return false;
// }

function clickInvoiceHistory_ClearFilters() {
  var ele = document.getElementById("button_clear_invoice_filters");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickPartHistory_ClearFilters() {
  var ele = document.getElementById("button_clear_part_filters");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickChangeHistory_Update() {
  var ele = document.getElementById("button_update_change_history");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickChangeHistory_ClearFilters() {
  var ele = document.getElementById("button_clear_change_filters");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

var _table_invoicehistory_selected_row = 0;
function set_tableInvoiceHistory_SelectedRow(newRow) {
  var inc = 0;
  var ele = document.getElementById("invoicehistory_table_row_" + inc);
  var ele2 = document.getElementById("invoicehistory_table_row_" + newRow);
  if (ele2 != null) {
    while (ele != null) {
      ele.style.backgroundColor = "";
      ++inc;
      ele = document.getElementById("invoicehistory_table_row_" + inc);
    }
    ele2.style.backgroundColor = "#96BBFF";
    _table_invoicehistory_selected_row = newRow;
    eleSmartScroll(ele2, 103, 60);
    // ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    return true;
  }
  return false;
}

var _table_parthistory_selected_row = 0;
function set_tablePartHistory_SelectedRow(newRow) {
  var inc = 0;
  var ele = document.getElementById("parthistory_table_row_" + inc);
  if (ele == null) //If list is empty
    document.getElementById("table_part_history_div_view").innerHTML = "";

  var rowNum = -1;
  while (ele != null) {
    ele.style.backgroundColor = "";
    rowNum = inc;
    ++inc;
    ele = document.getElementById("parthistory_table_row_" + inc);
  }

  var newRow2 = newRow;
  if (newRow2 > rowNum)
    newRow2 = rowNum;
  if (newRow2 < 0)
    newRow2 = 0;

  var ele2 = document.getElementById("parthistory_table_row_" + newRow2);
  if (ele2 != null) {
    populatePartHistoryView(newRow2);

    ele2.style.backgroundColor = "#96BBFF";
    eleSmartScroll(ele2, 103, 60);
    // ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    if (newRow2 != _table_parthistory_selected_row) {
      _table_parthistory_selected_row = newRow2;
      return true;
    }
  }
  return false;
}

var _table_changehistory_selected_row = 0;
function set_tableChangeHistory_SelectedRow(newRow) {
  var inc = 0;
  var ele = document.getElementById("changehistory_table_row_" + inc);
  var ele2 = document.getElementById("changehistory_table_row_" + newRow);
  if (ele2 != null) {
    while (ele != null) {
      ele.style.backgroundColor = "";
      ++inc;
      ele = document.getElementById("changehistory_table_row_" + inc);
    }
    ele2.style.backgroundColor = "#96BBFF";
    _table_changehistory_selected_row = newRow;
    eleSmartScroll(ele2, 103, 60);
    // ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    return true;
  }
  return false;
}

function clickInvoiceHistory_ExitInvoice() {
  var ele = document.getElementById("exit_invoice_from_history_button");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickInvoice_ExitInvoice() {
  var ele = document.getElementById("exit_invoice_button");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickInvoiceSettings_Save() {
  var ele = document.getElementById("invoice_info_button_save");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickAddInvoice_AddRow() {
  var ele = document.getElementById("button_addInvoice_addrow");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickAddInvoice_Save() {
  var ele = document.getElementById("button_addInvoice_save");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickAddInvoice_Cancel() {
  var ele = document.getElementById("button_addInvoice_cancel");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickInvoice_Print() {
  var ele = document.getElementById("button_invoice_print");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickInvoice_Save() {
  var ele = document.getElementById("button_invoice_save");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickViewInvoice_Delete() {
  var ele = document.getElementById("button_viewInvoice_delete");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickViewInvoice_ConfirmDelete() {
  var ele = document.getElementById("button_viewInvoice_confirmdelete");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickViewInvoice_CancelDelete() {
  var ele = document.getElementById("button_viewInvoice_canceldelete");
  if (ele != null && ele.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordView_Image_Exit() {
  var ele = document.getElementById("button_googlesearch_image_exit");
  var ele2 = document.getElementById("googlesearch_image_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordView_Image_Left() {
  var ele = document.getElementById("button_googlesearch_image_left");
  var ele2 = document.getElementById("googlesearch_image_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickRecordView_Image_Right() {
  var ele = document.getElementById("button_googlesearch_image_right");
  var ele2 = document.getElementById("googlesearch_image_div");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}

function clickCancelScan() {
  var ele = document.getElementById("button_cancel_scan");
  var ele2 = document.getElementById("fileinput_wait_for_scan");
  if (ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none") {
    ele.click();
    return true;
  }
  return false;
}


function applyRecordBrowserFilter() {
  showSnackbar_No_Anim("Filtering...");
  setTimeout(function () {
    _record_browser_filter_string_Standardized = standardizeString(document.getElementById("record_browser_filter_input").value);
    if (_record_browser_filter_string_Standardized == "")
      _record_browser_filter_string_Standardized = null;
    populateRecordBrowser(_currentRecordBrowserStartIndex, _highlightgreen_requested);
    recordBrowserJumpToEdge(false);
  }, 100);
}

function recordBrowserFilterKeyUpEvent(event) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    applyRecordBrowserFilter();
  }
  else {
    _record_browser_filter_string_Standardized = standardizeString(document.getElementById("record_browser_filter_input").value);
    if (_record_browser_filter_string_Standardized == "")
      _record_browser_filter_string_Standardized = null;
  }
}