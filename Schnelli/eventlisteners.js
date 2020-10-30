window.onbeforeunload = function(e) {
  console.log("Refreshed");
  clearData();
};

document.addEventListener('focusin', function() {
  if((document.activeElement.tagName == "INPUT" && (document.activeElement.type == "text" || document.activeElement.type == "number" || document.activeElement.type == "password")) || document.activeElement.tagName == "TEXTAREA")
  {
    document.getElementById("key_shortcut_index_window").style.display = "none";
    deselectTable();
    _focused = true;
    setKeyboardShortcutBar();
  }
  if(document.activeElement.id == "search_input_9")
  {
    show_more_column_checkboxes(true);
  }
}, true);

document.addEventListener('focusout', function() {
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
var _key_shortcut_invoice_remove_available = false;
var _key_shortcut_record_views_image_available = false;
var _key_shortcut_record_views_jump_pn_available = false;
function setKeyboardShortcutBar()
{
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
  _key_shortcut_invoice_remove_available = false;
  _key_shortcut_record_views_image_available = false;
  _key_shortcut_record_views_jump_pn_available = false;

  if(_LOGGED_IN)
  {
    if(document.getElementById("key_shortcut_index_window").style.display != "none")
    {
      text += "<span style='color: white;'>Esc</span> Close&nbsp;&nbsp;<span style='color: white;'>Letter or Number</span> Sort by Index";
    }
    else if(_focused)
    {
      text += "<span style='color: white;'>Esc</span> Stop Editing";
    }
    else if(document.getElementById("TAB_mainmenu_div").style.display != "none")
    {
      
    }
    else
    {
      _key_shortcut_Index_available = true;
      _key_shortcut_mainmenu_available = true;
      text += "<span style='color: white;'>I</span>ndex Sort&nbsp;&nbsp;<span style='color: white;'>Esc</span> Back";
    }
    
    if(!_focused && _isTableSelected)
    {
      _key_shortcut_add_record_view_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>V</span> Add Record View";
    }
    if(!_focused && _selected_tab == TAB_RECORD_VIEWS && _recordViews.length > 0)
    {
      _key_shortcuts_record_view_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>1-9</span>&nbsp;Select";
      _key_shortcut_compare_record_views_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>Q</span>&nbsp;Dif.&nbsp;&nbsp;<span style='color: white;'>W</span>&nbsp;Sim.";
      _key_shortcut_edit_record_views_pn_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>E</span>dit";
      _key_shortcut_edit_record_view_whole_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>R</span>&nbsp;Edit Record";
      _key_shortcut_record_views_jump_pn_available = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>J</span>ump Child Part";
      _key_shortcut_record_views_image_available = true;
    }
    if(!_focused && _isTableSelected && _selectedTable == _TABLE_RECORD_BROWSER)
    {
      _key_shortcut_edit_part_available = true;
      _key_shortcut_copy_part_available = true;
      _key_shortcut_record_browser_sort_by_column = true;
      text += "&nbsp;&nbsp;<span style='color: white;'>E</span>dit&nbsp;&nbsp;<span style='color: white;'>C</span>opy&nbsp;&nbsp;<span style='color: white;'>R</span> Sort by column";
    }
    if(!_focused && _selected_tab == TAB_SORT_ORDERS)
    {
      var ele = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
      var ele2 = document.getElementById("button_sortorder_new_save");
      if(ele2 != null && ele2.style.display != "none")
      {
        _key_shortcut_sort_order_new_addremove_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>-</span> Remove&nbsp;&nbsp;<span style='color: white;'>+</span> Add";
      }
      else if(document.getElementById("key_shortcut_index_window_edit").style.display == "none" && (ele == null || ele.style.display == "none"))
      {
        _key_shortcut_sort_order_edit_available = true;
        _key_shortcut_sort_order_new_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>E</span>dit&nbsp;&nbsp;<span style='color: white;'>A</span>dd New";
      }
      else if(ele != null && ele.style.display != "none")
      {
        _key_shortcut_sort_order_edit_addremove_available = true;
        text += "&nbsp;&nbsp;<span style='color: white;'>-</span> Remove&nbsp;&nbsp;<span style='color: white;'>+</span> Add";
      }
      
    }
    if(_selected_tab == TAB_PDF_IMPORT)
    {
      var ele = document.getElementById("wlmay_input_div");
      if(!_focused)
      {
        if(ele != null && ele.style.display != "none")
        {
          _key_shortcut_pdfimport_browse_available = true;
          text += "&nbsp;&nbsp;<span style='color: white;'>B</span>rowse";
        }
      }
      ele = document.getElementById("table_pdfimport_row_0");
      var ele2 = document.getElementById("wlmay_pdf_table_div");
      if(ele != null && ele2.style.display != "none")
      {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row";
      }
    }
    if(_selected_tab == TAB_REORDERS)
    {
      var ele = document.getElementById("table_reorders_row_0");
      if(ele != null && ele.style.display != "none")
      {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row";
      }
    }
    if(_selected_tab == TAB_INVOICE_HISTORY)
    {
      var ele = document.getElementById("invoicehistory_table_row_0");
      var ele2 = document.getElementById("invoice_from_history_content");
      if(ele != null && ele.style.display != "none" && (ele2 == null || ele2.style.display == "none"))
      {
        text += "&nbsp;&nbsp;<span style='color: white;'>&uarr; &darr;</span>Select Row&nbsp;&nbsp;<span style='color: white;'>Enter</span> View";
      }
    }
    if(_selected_tab == TAB_INVOICE)
    {
      if(!_focused && _invoice_objs.length > 0)
      {
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

// Execute a function when the user releases a key on the keyboard
input_email.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.code === KEY_ENTER) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("login_button").click();
    }
  });
  
  input_password.addEventListener("keyup", function(event) {
    if (event.code === KEY_ENTER) {
      event.preventDefault();
      document.getElementById("login_button").click();
    }
  });
  
  input_search.addEventListener("keydown", function(event) {
    if (event.code === KEY_ENTER) {
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

  for(var i = 0; i < INDEXES_CONCAT.length; ++i){
    document.getElementById("search_input_" + i).addEventListener("keyup", function(event) {
      if (event.code === KEY_ENTER) {
        event.preventDefault();
        if(_search_autocomplete_matches.length > 0)
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
      else{
        showSearchAutocomplete();
      }
    });
    document.getElementById("search_input_" + i).addEventListener("keydown", function(event) {
      if (event.code === KEY_ENTER) {

      }
      else if (event.code === KEY_UP_ARROW) {
        event.preventDefault();
        if(_search_autocomplete_matches.length > 0)
          selectSearchAutocompleteUp();
        else
          viewHistory(null, -1);
      }
      else if (event.code === KEY_DOWN_ARROW) {
        event.preventDefault();
        if(_search_autocomplete_matches.length > 0)
          selectSearchAutocompleteDown();
        else
          viewHistory(null, 1);
      }
    });
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
  var KEY_ESCAPE = "Escape";
  var KEY_LEFT_ARROW = "ArrowLeft";
  var KEY_UP_ARROW = "ArrowUp";
  var KEY_RIGHT_ARROW = "ArrowRight";
  var KEY_DOWN_ARROW = "ArrowDown";
  var KEY_TAB = "Tab";
  var KEY_PAGE_UP = "PageUp";
  var KEY_PAGE_DOWN = "PageDown";
  var KEY_SHIFT = "ShiftLeft";
  var KEY_CTRL = "ControlLeft";
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

  function moveLeft()
  {
    var preventDefault = true;
    if(_selectedCell == 0)
      preventDefault = false;
    if(preventDefault)
    {
      var column = _selectedCell - 1;
      var cell = getCell(_selectedRow, column, _selectedTable);
      if(cell != null)
        onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
    }
    return preventDefault;
  }

  function moveUp(){
    var preventDefault = true;
    if(_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow == 0)
      preventDefault = false;
    else if(_selectedTable == _TABLE_SEARCH_RESULTS && _selectedRow == 0 && _currentSearchResultsStartIndex == 0)
      preventDefault = false;
    var row = _selectedRow - 1;
    if(preventDefault){
      if(_selectedTable == _TABLE_RECORD_BROWSER && _indexesRecordBrowser[0] > 0 && _indexesRecordBrowser[0] > row) //Shift table bounds
          populateRecordBrowser(_indexesRecordBrowser[0] - 1, false);
      if(_selectedTable == _TABLE_SEARCH_RESULTS && _currentSearchResultsStartIndex > 0 && _selectedRow == 0) //Shift table bounds
          populateSearchResults(_currentSearchResultsStartIndex - 1, true, false, -1);
    }
    var cell = getCell(row, _selectedCell, _selectedTable);
    if(cell != null)
      onCellClick(row, _selectedCell, cell.id, _selectedTable);
    return preventDefault;
  }

  function moveRight(){
    var preventDefault = true;
    if(_selectedCell == INDEXES_CONCAT.length - 1)
      preventDefault = false;
    if(preventDefault)
    {
      var column = _selectedCell + 1;
      var cell = getCell(_selectedRow, column, _selectedTable);
      if(cell != null)
        onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
    }
    return preventDefault;
  }

  function moveDown(){
    var preventDefault = true;
    if(_selectedTable == _TABLE_RECORD_BROWSER && _selectedRow == _content.length - 1)
      preventDefault = false;
    else if(_selectedTable == _TABLE_SEARCH_RESULTS && _selectedRow == _searchResultsMax - 1 && _currentSearchResultsStartIndex == _searchResults.length - _searchResultsMax)
      preventDefault = false;
      var row = _selectedRow + 1;
      if(preventDefault){
        if(_selectedTable == _TABLE_RECORD_BROWSER && _indexesRecordBrowser[_indexesRecordBrowser.length - 1] < _content.length - 1 && _indexesRecordBrowser[_indexesRecordBrowser.length - 1] < row) //Shift table bounds
          populateRecordBrowser(_indexesRecordBrowser[0] + 1, false);
        if(_selectedTable == _TABLE_SEARCH_RESULTS && _currentSearchResultsStartIndex < _searchResults.length - 1 && _selectedRow == _indexesSearchResults.length - 1) //Shift table bounds
        populateSearchResults(_currentSearchResultsStartIndex + 1, false, true, -1);
      }
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    return preventDefault;
  }

  function pageUp()
  {
    var preventDefault = true;
    var row = null;
    if(_selectedTable == _TABLE_RECORD_BROWSER){
      populateRecordBrowser(_currentRecordBrowserStartIndex - _recordBrowserMax, false);
      if(_selectedRow == 0)
        preventDefault = false;
      row = _selectedRow - _recordBrowserMax;
      if(row < 0)
        row = 0;
      if(row >= _content.length)
        row = _content.length - 1;
    }
    else if(_selectedTable == _TABLE_SEARCH_RESULTS)
    {
      if(_selectedRow == 0 && _currentSearchResultsStartIndex == 0)
        preventDefault = false;
      if(preventDefault)
      {
        if(_currentSearchResultsStartIndex == 0)
          populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, true, false, -1);
        else
          populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, false, false, _selectedRow);
      }
    }

    if(row != null){
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    }
    return preventDefault;
  }

  function pageDown()
  {
    var preventDefault = true;
    var row = null;
    if(_selectedTable == _TABLE_RECORD_BROWSER){
      populateRecordBrowser(_currentRecordBrowserStartIndex + _recordBrowserMax, false);
      if(_selectedRow == _content.length - 1)
        preventDefault = false;
      row = _selectedRow + _recordBrowserMax;
      if(row < 0)
        row = 0;
      if(row >= _content.length)
        row = _content.length - 1;
    }
    else if(_selectedTable == _TABLE_SEARCH_RESULTS){
      if(_selectedRow == _searchResultsMax - 1 && _currentSearchResultsStartIndex == _searchResults.length - _searchResultsMax)
        preventDefault = false;
      if(preventDefault){
        if(_currentSearchResultsStartIndex >= _searchResults.length - _searchResultsMax)
          populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, true, -1);
        else
          populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, false, _selectedRow);
      }
    }

    if(row != null)
    {
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    }
    return preventDefault;
  }

  function moveToHome()
  {
    var preventDefault = true;
    if(_selectedCell == 0)
      preventDefault = false;
    if(preventDefault)
    {
      var column = 0;
      var cell = getCell(_selectedRow, column, _selectedTable);
      if(cell != null)
        onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
    }
    return preventDefault;
  }

  function moveToEnd()
  {
    var preventDefault = true;
    if(_selectedCell == INDEXES_CONCAT.length - 1)
      preventDefault = false;
    if(preventDefault)
    {
      var column = INDEXES_CONCAT.length - 1;
      var cell = getCell(_selectedRow, column, _selectedTable);
      if(cell != null)
        onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
    }
    return preventDefault;
  }

  //index -1 = search any, dir -1 = back, 1 = forward
  function viewHistory(index, dir)
  {
    if(index != null){
      if(dir == -1){
        if(_searchstring_any_history_index > 0)
        {
          --_searchstring_any_history_index;
          if(_searchstring_any_history_index >= _searchstring_any_history.length)
            _searchstring_any_history_index = _searchstring_any_history.length - 1;
          document.getElementById("search_input").value = _searchstring_any_history[_searchstring_any_history_index];
        }
      }
      else{
        if(_searchstring_any_history_index < _searchstring_any_history.length - 1)
        {
          ++_searchstring_any_history_index;
          if(_searchstring_any_history_index >= _searchstring_any_history.length)
            _searchstring_any_history_index = _searchstring_any_history.length - 1;
          document.getElementById("search_input").value = _searchstring_any_history[_searchstring_any_history_index];
        }
      }
    }
    else{
      index = _selected_search_input;
      if(dir == -1){
        if(_searchstring_specific_history_index[index] > 0)
        {
          --_searchstring_specific_history_index[index];
          if(_searchstring_specific_history_index[index] >= _searchstring_specific_history[index].length)
            _searchstring_specific_history_index[index] = _searchstring_specific_history[index].length - 1;
          document.getElementById("search_input_" + index).value = _searchstring_specific_history[index][_searchstring_specific_history_index[index]];
        }
      }
      else{
        if(_searchstring_specific_history_index[index] < _searchstring_specific_history[index].length - 1)
        {
          ++_searchstring_specific_history_index[index];
          if(_searchstring_specific_history_index[index] >= _searchstring_specific_history[index].length)
            _searchstring_specific_history_index[index] = _searchstring_specific_history[index].length - 1;
          document.getElementById("search_input_" + index).value = _searchstring_specific_history[index][_searchstring_specific_history_index[index]];
        }
      }
    }
  }

  //SEARCH SPECIFIC AUTOCOMPLETE----------------------------------------------------------
  var MAX_SEARCH_SUGGESTIONS = 50;
  var _search_autocomplete_matches = new Array();
  var _selected_search_autocomplete = -1;
  function showSearchAutocomplete()
  {
    clearSearchAutocomplete();
    if(_selected_search_input >= 1 && _selected_search_input <= 8) //DESCRIP1 through PART_TYPE
    {
      var numMatches = 0;
        // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
        // expected output: "Found football start=6  end=14."
        // expected output: "Found foosball start=16 end=24."
      let match;
      var searchstring = document.getElementById("search_input_" + _selected_search_input).value;
      if(searchstring != ""){
        var regexp = new RegExp(getRegexSafeSearchTerm(standardizeString(searchstring)), "g");
        for(var i = 0; i < _content.length; ++i)
        {
          var content_string = _content[i][_selected_search_input];
          if ((match = regexp.exec(standardizeString(content_string))) !== null) //If match found in whole string
          { 
            var s = 0;
            var start = 0;
            var end = 0;
            var lastCharWasSpace = false;
            for(var n = 0; n < content_string.length; ++n)//Find individual word(s) for display
            {
              var content_char = content_string.charAt(n).toLowerCase();
              if(!(lastCharWasSpace && content_char == " ")) //If not a duplicate space
              {
                  if(content_char != searchstring.charAt(s).toLowerCase())
                      s = 0;
                  if(content_char == searchstring.charAt(s).toLowerCase() && (s != 0 || n == 0 || lastCharWasSpace)){ //Checks that beginning of search string is at beginning of word in content
                    if(s == 0)
                        start = n;
                    ++s;
                    if(s == searchstring.length){ //At end of search string
                        end = n + 1;
                        break;
                    }
                  }
                  else
                      s = 0;
              }
              lastCharWasSpace = (content_char == " ");
            }
            if(end != 0) { //Found match at beginning of word
              var end2 = end;
              while(end < content_string.length && content_string.charAt(end) != " ") //Go until end of word or whole string
              {
                ++end;
                end2 = end;
                if(end < content_string.length && content_string.charAt(end) != " ")
                  end2 = end + 1;
              }

              var matchFinal = content_string.substring(start, end2);
              if(!_search_autocomplete_matches.includes(matchFinal))
              {
                _search_autocomplete_matches.push(matchFinal);
                ++numMatches;
                if(numMatches >= MAX_SEARCH_SUGGESTIONS)
                  break;
              }
            }
          }
        }
        if(_search_autocomplete_matches.length > 0)
        {
          var htmlToAdd = "";
          for(var i = 0; i < _search_autocomplete_matches.length; ++i)
          {
            htmlToAdd += "<div class='clickable' id='search_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 2; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='searchInputOnClick(" + i + ");'>" + getHTMLSafeText(_search_autocomplete_matches[i]) + "</div><br>";
          }
          document.getElementById("search_autocomplete_" + _selected_search_input).innerHTML = htmlToAdd;
        }
      }
    }
  }

  function clearSearchAutocomplete()
  {
    _selected_search_autocomplete = -1;
    _search_autocomplete_matches = [];
    for(var i = 0; i < INDEXES_CONCAT.length; ++i)
    {
      document.getElementById("search_autocomplete_" + i).innerHTML = "";
    }
  }
  
  function searchInputAutocomplete()
  {
    if(_selected_search_autocomplete >= 0 && _selected_search_autocomplete < _search_autocomplete_matches.length)
      document.getElementById("search_input_" + _selected_search_input).value = _search_autocomplete_matches[_selected_search_autocomplete];
    clearSearchAutocomplete();
  }

  function searchInputOnClick(index)
  {
    _selected_search_autocomplete = index;
    searchInputAutocomplete();
  }

  function onSearchInputFocusOut()
  {
    // clearSearchAutocomplete();
  }

  function selectSearchAutocompleteUp()
  {
    if(_selected_search_autocomplete >= _search_autocomplete_matches.length)
      _selected_search_autocomplete = 0;
    if(_selected_search_autocomplete < 0)
      _selected_search_autocomplete = 0;
    if(_search_autocomplete_matches.length > 0)
    {      
      for(var i = 0; i < _search_autocomplete_matches.length; ++i)
        document.getElementById("search_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_search_autocomplete > 0)
        --_selected_search_autocomplete;
      var ele = document.getElementById("search_autocomplete_match_" + _selected_search_autocomplete);
      ele.style.backgroundColor = _selectedCellColor;
      ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }
  }

  function selectSearchAutocompleteDown()
  {
    if(_selected_search_autocomplete >= _search_autocomplete_matches.length)
      _selected_search_autocomplete = 0;
    if(_selected_search_autocomplete < 0)
      _selected_search_autocomplete = 0;
    if(_search_autocomplete_matches.length > 0){      
      for(var i = 0; i < _search_autocomplete_matches.length; ++i)
        document.getElementById("search_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_search_autocomplete < _search_autocomplete_matches.length - 1)
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
  function showPartNumAutocomplete()
  {
    clearPartNumAutocomplete();
    var numMatches = 0;
    let match;
    var searchstring = document.getElementById("record_view_partnum_input_" + _selected_partnum_input_i + "_" + _selected_partnum_input_j).value;
    if(searchstring != "")
    {
      var regexp = new RegExp(getRegexSafeSearchTerm(searchstring.toLowerCase()), "g");
      for(var i = 0; i < _content_extra[_selected_partnum_input_j].length; ++i)
      {
        var part_num_string = _content_extra[_selected_partnum_input_j][i][0].PN;
        if ((match = regexp.exec(part_num_string.toLowerCase())) !== null) //If match found in whole string
        { 
          if(!_partnum_autocomplete_matches.includes(part_num_string))
          {
            _partnum_autocomplete_matches.push(part_num_string);
            ++numMatches;
            if(numMatches >= MAX_PARTNUM_SUGGESTIONS)
              break;
          }
        }
      }
    }
    if(_partnum_autocomplete_matches.length > 0)
    {
      var htmlToAdd = "";
      for(var i = 0; i < _partnum_autocomplete_matches.length; ++i)
      {
        htmlToAdd += "<div class='clickable' id='partnum_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 2; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='partNumInputOnClick(" + i + ");'>" + getHTMLSafeText(_partnum_autocomplete_matches[i]) + "</div><br>";
      }
      document.getElementById("partnum_autocomplete_" + _selected_partnum_input_i + "_" + _selected_partnum_input_j).innerHTML = htmlToAdd;
    }
  }

  function clearPartNumAutocomplete()
  {
    _partnum_autocomplete_matches = [];
    _selected_partnum_autocomplete = -1;
    for (var i = 0; i < _recordViews.length; ++i)
    {
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
          document.getElementById("partnum_autocomplete_" + i + "_" + j).innerHTML = "";
      }
    }
  }

  function partNumInputAutocomplete()
  {
    if(_selected_partnum_autocomplete >= 0 && _selected_partnum_autocomplete < _partnum_autocomplete_matches.length)
      document.getElementById("record_view_partnum_input_" + _selected_partnum_input_i + "_" + _selected_partnum_input_j).value = _partnum_autocomplete_matches[_selected_partnum_autocomplete];
      clearPartNumAutocomplete();
  }

  function partNumInputOnClick(index)
  {
    _selected_partnum_autocomplete = index;
    partNumInputAutocomplete();
  }

  function onPartNumFocus(indexi, indexj)
  {
    _selected_partnum_input_i = indexi;
    _selected_partnum_input_j = indexj;
    deselectTable();
  }

  function partnum_input_keyup_event(event)
  {
    if(event.code == KEY_ENTER)
    {
      event.preventDefault();
      partNumInputAutocomplete();
    }
    else if (event.code === KEY_ESCAPE) {
      // clearPartNumAutocomplete();
    }
    else if(event.code == KEY_UP_ARROW)
    {

    }
    else if(event.code == KEY_DOWN_ARROW)
    {
      
    }
    else{
      showPartNumAutocomplete();
    }
  }

  var partnum_input_was_pressed_first = false;
  function partnum_input_keydown_event(event)
  {
    partnum_input_was_pressed_first = true;
    if(event.code == KEY_UP_ARROW)
    {
      event.preventDefault();
      selectPartNumAutocompleteUp();
    }
    else if(event.code == KEY_DOWN_ARROW)
    {
      event.preventDefault();
      selectPartNumAutocompleteDown();
    }
  }

  function selectPartNumAutocompleteUp()
  {
    if(_selected_partnum_autocomplete >= _partnum_autocomplete_matches.length)
      _selected_partnum_autocomplete = 0;
    if(_selected_partnum_autocomplete < 0)
      _selected_partnum_autocomplete = 0;
    if(_partnum_autocomplete_matches.length > 0)
    {
      for(var i = 0; i < _partnum_autocomplete_matches.length; ++i)
        document.getElementById("partnum_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_partnum_autocomplete > 0)
        --_selected_partnum_autocomplete;
      var ele = document.getElementById("partnum_autocomplete_match_" + _selected_partnum_autocomplete);
      ele.style.backgroundColor = _selectedCellColor;
      ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }
  }

  function selectPartNumAutocompleteDown()
  {
    if(_selected_partnum_autocomplete >= _partnum_autocomplete_matches.length)
      _selected_partnum_autocomplete = 0;
    if(_selected_partnum_autocomplete < 0)
      _selected_partnum_autocomplete = 0;
    if(_partnum_autocomplete_matches.length > 0){     
      for(var i = 0; i < _partnum_autocomplete_matches.length; ++i)
        document.getElementById("partnum_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_partnum_autocomplete < _partnum_autocomplete_matches.length - 1)
        ++_selected_partnum_autocomplete;
      var ele = document.getElementById("partnum_autocomplete_match_" + _selected_partnum_autocomplete);
      ele.style.backgroundColor = _selectedCellColor;
      ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }
  }
//END PART NUM AUTOCOMPLETE----------------------------------------------------------

//PART CHILD EDIT AUTOCOMPLETE----------------------------------------------------------
function clearPartChildEditAutocomplete()
{
  _partchild_edit_autocomplete_matches = [];
  document.getElementById("partchild_edit_autocomplete").innerHTML = "";
}

  function onPartChildEditFocus()
  {
    deselectTable();
  }

  function partchild_edit_input_keyup_event(event)
  {
    if(event.code == KEY_ENTER)
    {
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
    else if(event.code == KEY_UP_ARROW)
    {

    }
    else if(event.code == KEY_DOWN_ARROW)
    {
      
    }
    else{
      showPartChildEditAutocomplete();
    }
  }

  function partchild_edit_row_click(index)
  {
    _selected_child_part_db = _partchild_edit_autocomplete_matches[index].db;
    _selected_child_part_record = _partchild_edit_autocomplete_matches[index].row;
    populateChildPartRecordManager();
    clearPartChildEditAutocomplete();
  }

  function partchild_edit_input_keydown_event(event)
  {
    if(event.code == KEY_UP_ARROW)
    {
      event.preventDefault();
      selectPartChildEditAutocompleteUp();
    }
    else if(event.code == KEY_DOWN_ARROW)
    {
      event.preventDefault();
      selectPartChildEditAutocompleteDown();
    }
  }

  function selectPartChildEditAutocompleteUp()
  {
    if(_selected_partchild_edit_autocomplete >= _partchild_edit_autocomplete_matches.length)
      _selected_partchild_edit_autocomplete = 0;
    if(_selected_partchild_edit_autocomplete < 0)
      _selected_partchild_edit_autocomplete = 0;
    if(_partchild_edit_autocomplete_matches.length > 0)
    {
        for(var i = 0; i < _partchild_edit_autocomplete_matches.length; ++i)
          document.getElementById("partchild_edit_autocomplete_match_" + i).style.backgroundColor = "";
        if(_selected_partchild_edit_autocomplete > 0)
          --_selected_partchild_edit_autocomplete;
        var ele = document.getElementById("partchild_edit_autocomplete_match_" + _selected_partchild_edit_autocomplete);
        ele.style.backgroundColor = _selectedCellColor;
        ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    }
  }

  function selectPartChildEditAutocompleteDown()
  {
    if(_selected_partchild_edit_autocomplete >= _partchild_edit_autocomplete_matches.length)
      _selected_partchild_edit_autocomplete = 0;
    if(_selected_partchild_edit_autocomplete < 0)
      _selected_partchild_edit_autocomplete = 0;
    if(_partchild_edit_autocomplete_matches.length > 0){      
      for(var i = 0; i < _partchild_edit_autocomplete_matches.length; ++i)
        document.getElementById("partchild_edit_autocomplete_match_" + i).style.backgroundColor = "";
      if(_selected_partchild_edit_autocomplete < _partchild_edit_autocomplete_matches.length - 1)
        ++_selected_partchild_edit_autocomplete;
      var ele = document.getElementById("partchild_edit_autocomplete_match_" + _selected_partchild_edit_autocomplete);
      ele.style.backgroundColor = _selectedCellColor;
      ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });      
    }
  }

  var _partchild_edit_autocomplete_matches = [];
  var _selected_partchild_edit_autocomplete = 0;
  var MAX_PARTCHILDEDIT_SUGGESTIONS = 15;
  function showPartChildEditAutocomplete()
  {
    var htmlToAdd = "";
    clearPartChildEditAutocomplete();
    var numMatches = 0;
      // console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
      // expected output: "Found football start=6  end=14."
      // expected output: "Found foosball start=16 end=24."
    let match;
    var searchstring = document.getElementById("part_child_edit_input").value;
    var _selected_extra_db = document.getElementById("part_child_dropdown_select").selectedIndex;
    if(searchstring != "")
    {
      var regexp = new RegExp(getRegexSafeSearchTerm(searchstring.toLowerCase()), "g");
      if(_selected_extra_db >= _EXTRA_DB.length) //Search any
      {
        for(var h = 0; h < _EXTRA_DB.length; ++h)
        {
          for(var i = 0; i < _content_extra[h].length; ++i)
          {
            var part_child_edit_string = _content_extra[h][i][0].PN;
            if ((match = regexp.exec(part_child_edit_string.toLowerCase())) !== null) //If match found in whole string
            { 
              if(!doesObjectArraySpecificIndexIncludeX(_partchild_edit_autocomplete_matches, [h, i], ["db", "row"]))
              {
                var obj = new Object();
                obj.db = h;
                obj.row = i;
                _partchild_edit_autocomplete_matches.push(obj);
                ++numMatches;
                if(numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
                  break;
              }
            }
          }
        }
      }
      else //Search specific db
      {
        for(var i = 0; i < _content_extra[_selected_extra_db].length; ++i)
        {
          var part_child_edit_string = _content_extra[_selected_extra_db][i][0].PN;
          if ((match = regexp.exec(part_child_edit_string.toLowerCase())) !== null) //If match found in whole string
          { 
            if(!doesObjectArraySpecificIndexIncludeX(_partchild_edit_autocomplete_matches, [_selected_extra_db, i], ["db", "row"]))
            {
              var obj = new Object();
              obj.db = _selected_extra_db;
              obj.row = i;
              _partchild_edit_autocomplete_matches.push(obj);
              ++numMatches;
              if(numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
                break;
            }
          }
        }
      }
    }
    if(_partchild_edit_autocomplete_matches.length > 0)
    {
      htmlToAdd += "<table style='position: absolute; z-index: 2;'><tr>";
      htmlToAdd += "<th><p>DB</p></th>";
      for(var j = 0; j < RECORD_VIEW_HEADERS.length; ++j)
      {
        htmlToAdd += "<th><p>" + RECORD_VIEW_HEADERS[j] + "</p></th>";
      }
      htmlToAdd += "</tr>";
      for(var j = 0; j < _partchild_edit_autocomplete_matches.length; ++j)
      {
        var extraDBIndex = _partchild_edit_autocomplete_matches[j].row;
        _selected_extra_db = _partchild_edit_autocomplete_matches[j].db;
        htmlToAdd += "<tr class='clickable' id='partchild_edit_autocomplete_match_" + j + "' onclick='partchild_edit_row_click(" + j + ");'>";
        htmlToAdd += "<td><p>" + _EXTRA_DB[_selected_extra_db] + "</p></td>";
        for(var k = 0; k < RECORD_VIEW_HEADERS.length; ++k)
        { 
          htmlToAdd += "<td>";
          if(extraDBIndex != null){
            for(var d = 0; d < RECORD_VIEW_HEADERS_ACTUAL_INDEXES[k].length; ++d){
              var content1 = _content_extra[_selected_extra_db][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES[k][d]];
              if(content1 != null){
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
      htmlToAdd += "</tr>";
      }
    }
    document.getElementById("partchild_edit_autocomplete").innerHTML = htmlToAdd;
  }

  function changeRecordViewUp()
  {
    if(!partnum_input_was_pressed_first)
    {
      if(_recordViews.length > _selected_record_view && _selected_record_view >= 0)
      {
        var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
        if(rownum != null)
        {
          if(rownum > 0)
          {
            var newID = _content[rownum - 1][_content[rownum - 1].length - 1];
            if(_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && !_recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
              _recordViews_Key_To_Details_Open.set(newID, false);
            else
              _recordViews_Key_To_Details_Open.set(newID, true);
            _recordViews[_selected_record_view] = newID
            populateRecordViews();
          }
        }
      }
    }
  }
  //END PART CHILD EDIT AUTOCOMPLETE----------------------------------------------------------
  
  function changeRecordViewDown()
  {
    if(!partnum_input_was_pressed_first)
    {
      if(_recordViews.length > _selected_record_view && _selected_record_view >= 0)
      {
        var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
        if(rownum != null)
        {
          if(rownum < _content.length - 1)
          {
            var newID = _content[rownum + 1][_content[rownum + 1].length - 1];
            if(_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && !_recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
              _recordViews_Key_To_Details_Open.set(newID, false);
            else
              _recordViews_Key_To_Details_Open.set(newID, true);
            _recordViews[_selected_record_view] = newID
            populateRecordViews();
          }
        }
      }
    }
  }

  onChangeShouldHighlight();
  function onChangeShouldHighlight()
  {
    if(document.getElementById("search_highlight").checked)
    {
      document.getElementById("search_highlight_div").style.display = "block";
    }
    else
    {
      document.getElementById("search_highlight_div").style.display = "none";
    }
  }

  function clickRecordViewPNSaveButton()
  {
    for(var i = 0; i < _recordViews.length; ++i)
    {
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        var ele = document.getElementById("record_view_partnum_save_button_" + i + "_" + j);
        if(ele != null && ele.style.display != "none")
        {
          ele.click();
          return true;
        }
      }
    }
    return false;
  }

  function clickRecordViewPNCancelButton()
  {
    for(var i = 0; i < _recordViews.length; ++i)
    {
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        var ele = document.getElementById("record_view_partnum_cancel_button_" + i + "_" + j);
        if(ele != null && ele.style.display != "none")
        {
          ele.click();
          return true;
        }
      }
    }
    return false;
  }

  function checkForRecordViewSellButtons()
  {
    if(!_overlay_window_open)
    {
      var foundIndexes = [];
      for(var i = 0; i < _EXTRA_DB.length; ++i)
      {
        if(i != 2) //Skip DNI extradb
        {
          var ele = document.getElementById("sell_button_" + _selected_record_view + "_" + i);
          if(ele != null && ele.style.display != "none")
            foundIndexes.push(i);
        }
      }
      if(foundIndexes.length > 0)
      {
        var html1 = "";
        for(var i = 0; i < foundIndexes.length; ++i)
        {
          var i2 = foundIndexes[i];
          html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i2] + "</span>. ." + _EXTRA_DB[i2] + "<br>";
        }
        document.getElementById("key_shortcut_extra_db_sell_window").innerHTML = html1;
        document.getElementById("key_shortcut_extra_db_sell_window").style.display = "";
        _overlay_window_open = true;
        return true;
      }
    }
    return false;
  }

  function checkForRecordViewEditButtons()
  {
    if(!_overlay_window_open)
    {
      var html1 = "";
      for(var i = 0; i < _EXTRA_DB.length; ++i)
      {
        var ele = document.getElementById("record_view_partnum_edit_icon_" + _selected_record_view + "_" + i);
        if(ele != null && ele.style.display != "none")
          html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i] + "</span>. ." + _EXTRA_DB[i] + "<br>";
      }
      document.getElementById("key_shortcut_extra_db_edit_window").innerHTML = html1;
      document.getElementById("key_shortcut_extra_db_edit_window").style.display = "";
      _overlay_window_open = true;
      return true;
    }
    return false;
  }

  function checkForRecordViewImageButtons()
  {
    if(!_overlay_window_open)
    {
      var html1 = "";
      for(var i = 0; i < _EXTRA_DB.length; ++i)
      {
        var ele = document.getElementById("button_recordview_image_everywhere_" + _selected_record_view + "_" + i);
        if(ele != null && ele.style.display != "none")
          html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i] + "</span>. ." + _EXTRA_DB[i] + "<br>";
      }
      document.getElementById("key_shortcut_extra_db_image_window").innerHTML = html1;
      document.getElementById("key_shortcut_extra_db_image_window").style.display = "";
      _overlay_window_open = true;
      return true;
    }
    return false;
  }

  function checkForRecordViewJumpChildPartButtons()
  {
    if(!_overlay_window_open)
    {
      var html1 = "";
      for(var i = 0; i < _EXTRA_DB.length; ++i)
      {
        var ele = document.getElementById("span_recordviews_jump_to_child_part_" + _selected_record_view + "_" + i);
        if(ele != null && ele.style.display != "none")
          html1 += "<span style='color: white;'>" + _EXTRA_DB_COMMENTS_PREFIXES[i] + "</span>. ." + _EXTRA_DB[i] + "<br>";
      }
      document.getElementById("key_shortcut_extra_db_jumpPN_window").innerHTML = html1;
      document.getElementById("key_shortcut_extra_db_jumpPN_window").style.display = "";
      _overlay_window_open = true;
      return true;
    }
    return false;
  }

  function clickRecordViewSellConfirmButton()
  {
    for(var i = 0; i < _recordViews.length; ++i)
    {
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        var ele = document.getElementById("button_record_view_sell_confirm_" + i + "_" + j);
        var ele2 = document.getElementById("sell_form_" + i + "_" + j);
        if(ele != null && ele2.style.display != "none")
        {
          ele.click();
          return true;
        }
      }
    }
    return false;
  }
  
  function clickRecordViewSellCancelButton()
  {
    for(var i = 0; i < _recordViews.length; ++i)
    {
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        var ele = document.getElementById("button_record_view_sell_cancel_" + i + "_" + j);
        var ele2 = document.getElementById("sell_form_" + i + "_" + j);
        if(ele != null && ele2.style.display != "none")
        {
          ele.click();
          return true;
        }
      }
    }
    return false;
  }

  function clickRecordViewEditWholeSaveButton()
  {
    for(var i = 0; i < _recordViews.length; ++i)
    {
      var ele = document.getElementById("record_view_data_save_button_" + i);
      if(ele != null && ele.style.display != "none")
      {
        ele.click();
        return true;
      }
    }
    return false;
  }

  function clickRecordViewEditWholeCancelButton()
  {
    for(var i = 0; i < _recordViews.length; ++i)
    {
      var ele = document.getElementById("record_view_data_cancel_button_" + i);
      if(ele != null && ele.style.display != "none")
      {
        ele.click();
        return true;
      }
    }
    return false;
  }

  function clickRecordBrowserEditSaveButton()
  {
    var ele = document.getElementById("save_edit_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordBrowserEditCancelButton()
  {
    var ele = document.getElementById("cancel_edit_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordBrowserEditDeleteButton()
  {
    var ele = document.getElementById("delete_edit_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordBrowserEditDeleteConfirmButton()
  {
    var ele = document.getElementById("confirm_delete_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordBrowserEditDeleteCancelButton()
  {
    var ele = document.getElementById("cancel_delete_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordBrowserNewSaveButton()
  {
    var ele = document.getElementById("save_new_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordBrowserNewCancelButton()
  {
    var ele = document.getElementById("cancel_new_record");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPCRM_NewSaveButton()
  {
    var ele = document.getElementById("partchild_new_button_save");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPCRM_NewCancelButton()
  {
    var ele = document.getElementById("partchild_new_button_cancel");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPCRM_EditSaveButton()
  {
    var ele = document.getElementById("partchild_edit_button_save");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPCRM_EditCancelButton()
  {
    var ele = document.getElementById("partchild_edit_button_cancel");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPCRM_EditDeleteButton()
  {
    var ele = document.getElementById("partchild_edit_button_delete");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPCRM_EditDeleteConfirmButton()
  {
    var ele = document.getElementById("partchild_edit_button_confirm_delete");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }
  
  function clickPCRM_EditDeleteCancelButton()
  {
    var ele = document.getElementById("partchild_edit_button_cancel_delete");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickSortOrder_NewSaveButton()
  {
    var ele = document.getElementById("button_sortorder_new_save");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickSortOrder_NewCancelButton()
  {
    var ele = document.getElementById("button_sortorder_new_cancel");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickSortOrder_EditSaveButton()
  {
    var ele = document.getElementById("sort_order_button_save" + _current_sort_order_editing);
    var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickSortOrder_EditCancelButton()
  {
    var ele = document.getElementById("sort_order_button_cancel" + _current_sort_order_editing);
    var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickSortOrder_EditDeleteButton()
  {
    var ele = document.getElementById("sort_order_button_delete" + _current_sort_order_editing);
    var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickSortOrder_EditDeleteConfirmButton()
  {
    var ele = document.getElementById("sort_order_button_confirm_delete" + _current_sort_order_editing);
    var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }
  
  function clickSortOrder_EditDeleteCancelButton()
  {
    var ele = document.getElementById("sort_order_button_cancel_delete" + _current_sort_order_editing);
    var ele2 = document.getElementById("sort_order_buttons_" + _current_sort_order_editing);
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPdfImport_WLMAY_CancelButton()
  {
    var ele = document.getElementById("button_pdfimport_wlmay_cancel");
    var ele2 = document.getElementById("wlmay_pdf_table_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPdfImport_WLMAY_CancelAddRowButton()
  {
    var ele = document.getElementById("button_pdfimport_cancel_addrow");
    var ele2 = document.getElementById("wlmay_pdf_table_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }
  
  function clickPdfImport_WLMAY_SaveAddRowButton()
  {
    var ele = document.getElementById("button_pdfimport_save_addrow");
    var ele2 = document.getElementById("wlmay_pdf_table_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }
  
  var _table_pdf_import_selected_row = 0;
  
  function set_tablePDFImport_SelectedRow(newRow)
  {
    if(document.activeElement != null && (document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "SELECT"))
    {
      
    }
    else
    {
      var inc = 0;
      var ele = document.getElementById("table_pdfimport_row_" + inc);
      var ele2 = document.getElementById("table_pdfimport_row_" + newRow);
      if(ele2 != null)
      {
        while(ele != null)
        {
          ele.style.backgroundColor = "";
          ++inc;
          ele = document.getElementById("table_pdfimport_row_" + inc);
        }
        ele2.style.backgroundColor = "#96BBFF";
        _table_pdf_import_selected_row = newRow;
        ele = document.getElementById("pdf_ordered_" + _table_pdf_import_selected_row);
        if(ele != null)
        {
          ele.focus();
          ele.select();
        }
        ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
        return true;
      }
    }
    return false;
  }
    
  function clickPdfImport_WLMAY_AddPartChild_Cancel()
  {
    var ele = document.getElementById("button_pdfimport_newpartchild_cancel");
    var ele2 = document.getElementById("wlmay_pdf_table_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickPdfImport_WLMAY_AddPartChild_Submit()
  {
    var ele = document.getElementById("button_pdfimport_newpartchild_submit");
    var ele2 = document.getElementById("wlmay_pdf_table_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  var _table_reorders_selected_row = 0;
  
  function set_tableReorders_SelectedRow(newRow)
  {
    var inc = 0;
    var ele = document.getElementById( "table_reorders_row_" + inc);
    var ele2 = document.getElementById("table_reorders_row_" + newRow);
    if(ele2 != null)
    {
      while(ele != null)
      {
        ele.style.backgroundColor = "";
        ++inc;
        ele = document.getElementById("table_reorders_row_" + inc);
      }
      ele2.style.backgroundColor = "#96BBFF";
      _table_reorders_selected_row = newRow;
      ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
      return true;
    }
    return false;
  }

  function clickReorders_UpdateAllReorders()
  {
    var ele = document.getElementById("button_update_reorders");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickReorders_AddRecordView()
  {
    var ele = document.getElementById("button_reorder_addrecordview_" + _table_reorders_selected_row);
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickReorders_JumpBrowser()
  {
    var ele = document.getElementById("button_reorder_jumprecordbrowser_" + _table_reorders_selected_row);
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickReorders_UpdateRow()
  {
    var ele = document.getElementById("button_reorder_updaterow_" + _table_reorders_selected_row);
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickInvoiceHistory_Update()
  {
    var ele = document.getElementById("button_update_invoice_history");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickInvoiceHistory_ClearFilters()
  {
    var ele = document.getElementById("button_clear_invoice_filters");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  var _table_invoicehistory_selected_row = 0;
  function set_tableInvoiceHistory_SelectedRow(newRow)
  {
    var inc = 0;
    var ele = document.getElementById( "invoicehistory_table_row_" + inc);
    var ele2 = document.getElementById("invoicehistory_table_row_" + newRow);
    if(ele2 != null)
    {
      while(ele != null)
      {
        ele.style.backgroundColor = "";
        ++inc;
        ele = document.getElementById("invoicehistory_table_row_" + inc);
      }
      ele2.style.backgroundColor = "#96BBFF";
      _table_invoicehistory_selected_row = newRow;
      ele2.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
      return true;
    }
    return false;
  }


  function clickInvoiceHistory_ExitInvoice()
  {
    var ele = document.getElementById("exit_invoice_from_history_button");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickInvoice_ExitInvoice()
  {
    var ele = document.getElementById("exit_invoice_button");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }
  
  function clickInvoiceSettings_Save()
  {
    var ele = document.getElementById("invoice_info_button_save");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickAddInvoice_AddRow()
  {
    var ele = document.getElementById("button_addInvoice_addrow");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickAddInvoice_Save()
  {
    var ele = document.getElementById("button_addInvoice_save");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickAddInvoice_Cancel()
  {
    var ele = document.getElementById("button_addInvoice_cancel");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickInvoice_Print()
  {
    var ele = document.getElementById("button_invoice_print");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickViewInvoice_Delete()
  {
    var ele = document.getElementById("button_viewInvoice_delete");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickViewInvoice_ConfirmDelete()
  {
    var ele = document.getElementById("button_viewInvoice_confirmdelete");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickViewInvoice_CancelDelete()
  {
    var ele = document.getElementById("button_viewInvoice_canceldelete");
    if(ele != null && ele.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordView_Image_Exit()
  {
    var ele = document.getElementById("button_googlesearch_image_exit");
    var ele2 = document.getElementById("googlesearch_image_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordView_Image_Left()
  {
    var ele = document.getElementById("button_googlesearch_image_left");
    var ele2 = document.getElementById("googlesearch_image_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }

  function clickRecordView_Image_Right()
  {
    var ele = document.getElementById("button_googlesearch_image_right");
    var ele2 = document.getElementById("googlesearch_image_div");
    if(ele != null && ele.style.display != "none" && ele2 != null && ele2.style.display != "none")
    {
      ele.click();
      return true;
    }
    return false;
  }