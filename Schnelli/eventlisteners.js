// Get the input field
var input_email = document.getElementById("email_input");
var input_password = document.getElementById("password_input");
var input_search = document.getElementById("search_input");

// Execute a function when the user releases a key on the keyboard
input_email.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === KEY_ENTER) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("login_button").click();
    }
  });
  
  input_password.addEventListener("keyup", function(event) {
    if (event.keyCode === KEY_ENTER) {
      event.preventDefault();
      document.getElementById("login_button").click();
    }
  });
  
  input_search.addEventListener("keyup", function(event) {
    if (event.keyCode === KEY_ENTER) {
      event.preventDefault();
      document.getElementById("search_any_button").click();
    }
    else if (event.keyCode === KEY_UP_ARROW) {
      event.preventDefault();
      viewHistory(-1, -1);
    }
    else if (event.keyCode === KEY_DOWN_ARROW) {
      event.preventDefault();
      viewHistory(-1, 1);
    }
  });

  for(var i = 0; i < INDEXES_CONCAT.length; ++i){
    document.getElementById("search_input_" + i).addEventListener("keyup", function(event) {
      if (event.keyCode === KEY_ENTER) {
        event.preventDefault();
        if(_search_autocomplete_matches.length > 0)
          searchInputAutocomplete();
        else
          document.getElementById("search_specific_button").click();
      }
      else if (event.keyCode === KEY_UP_ARROW) {

      }
      else if (event.keyCode === KEY_DOWN_ARROW) {

      }
      else if (event.keyCode === KEY_ESCAPE) {
        clearSearchAutocomplete();
      }
      else{
        showSearchAutocomplete();
      }
    });
    document.getElementById("search_input_" + i).addEventListener("keydown", function(event) {
      if (event.keyCode === KEY_ENTER) {

      }
      else if (event.keyCode === KEY_UP_ARROW) {
        event.preventDefault();
        if(_search_autocomplete_matches.length > 0)
          selectSearchAutocompleteUp();
        else
          viewHistory(null, -1);
      }
      else if (event.keyCode === KEY_DOWN_ARROW) {
        event.preventDefault();
        if(_search_autocomplete_matches.length > 0)
          selectSearchAutocompleteDown();
        else
          viewHistory(null, 1);
      }
    });
  }

  var KEY_ENTER = 13;
  var KEY_ESCAPE = 27;
  var KEY_LEFT_ARROW = 37;
  var KEY_UP_ARROW = 38;
  var KEY_RIGHT_ARROW = 39;
  var KEY_DOWN_ARROW = 40;
  var KEY_TAB = 9;
  var KEY_PAGE_UP = 33;
  var KEY_PAGE_DOWN = 34;
  var KEY_SHIFT = 16;
  var KEY_CTRL = 17;

  // var key_ctrl_held = false;
  // var key_shift_held = false;

  document.addEventListener("keydown", function(event) { 
    switch(event.keyCode){
        case KEY_LEFT_ARROW: //Left Arrow
          if(_isTableSelected){
            event.preventDefault();
            moveLeft();
          }
          break;
        case KEY_UP_ARROW: //Up Arrow
          if(_selected_tab == TAB_RECORD_VIEWS)
          {
            event.preventDefault();
            changeRecordViewUp();
          }
          else if(_isTableSelected){
            event.preventDefault();
            moveUp();
          }
          break;
        case KEY_RIGHT_ARROW: //Right Arrow
          if(_isTableSelected){
            event.preventDefault();
            moveRight();
          }
          break;
        case KEY_DOWN_ARROW: //Down Arrow
          if(_selected_tab == TAB_RECORD_VIEWS)
          {
            event.preventDefault();
            changeRecordViewDown();
          }
          else if(_isTableSelected){
            event.preventDefault();
            moveDown();
          }
          break;
        case KEY_PAGE_UP:
          if(_isTableSelected){
            event.preventDefault();
            pageUp();
          }
          break;
        case KEY_PAGE_DOWN:
          if(_isTableSelected){
            event.preventDefault();
            pageDown();
          }
        // case KEY_CTRL:
        //   key_ctrl_held = true;
        //   break;
        // case KEY_SHIFT:
        //   key_shift_held = true;
        //   break;
        // case KEY_TAB: //Doesn't work, browser overrides and switches to next tab
        //         event.preventDefault();
        //   if(key_ctrl_held)
        //   {
        //     console.log("Pressed");
        //     if(key_shift_held)
        //     {
        //       if(_selected_tab > 0)
        //       {
        //         event.preventDefault();
        //         setTab(_selected_tab - 1);
        //       }
        //     }
        //     else
        //     {
        //       if(_selected_tab < TAB_DIVS.length - 1)
        //       {
        //         event.preventDefault();
        //         setTab(_selected_tab + 1);
        //       }
        //     }
        //   }
        //   break;
    }
  });

  document.addEventListener("keyup", function(event) { 
    switch(event.keyCode){
      // case KEY_CTRL:
      //   key_ctrl_held = false;
      //   break;
      // case KEY_SHIFT:
      //   key_shift_held = false;
      //   break;
        // case KEY_LEFT: //Left Arrow
        //     event.preventDefault();
        //     down_Left = false;
        //     moveLeft();
        //     break;
        // case KEY_UP: //Up Arrow
        //     event.preventDefault();
        //     moveUp();
        //     break;
        // case KEY_RIGHT: //Right Arrow
        //     event.preventDefault();
        //     moveRight();
        //     break;
        // case KEY_DOWN: //Down Arrow
        //     event.preventDefault();
        //     moveDown();
        //     break;
        // case KEY_TAB: //Tab
        //     event.preventDefault();
        //     moveToNextTable();
        //     break;
    }
  });

  function moveLeft(){
    var column = _selectedCell - 1;
    var cell = getCell(_selectedRow, column, _selectedTable);
    if(cell != null)
      onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
  }

  function moveUp(){
    var row = _selectedRow - 1;
    if(_selectedTable == TABLE_RECORD_BROWSER && _indexesRecordBrowser[0] > 0 && _indexesRecordBrowser[0] > row) //Shift table bounds
        populateRecordBrowser(_indexesRecordBrowser[0] - 1, false);
    if(_selectedTable == TABLE_SEARCH_RESULTS && _currentSearchResultsStartIndex > 0 && _selectedRow == 0) //Shift table bounds
        populateSearchResults(_currentSearchResultsStartIndex - 1, true, false, -1);
    
    var cell = getCell(row, _selectedCell, _selectedTable);
    if(cell != null)
      onCellClick(row, _selectedCell, cell.id, _selectedTable);
  }

  function moveRight(){
    var column = _selectedCell + 1;
    var cell = getCell(_selectedRow, column, _selectedTable);
    if(cell != null)
      onCellClick(_selectedRow, column, cell.id, _selectedTable, true);
  }

  function moveDown(){
    var row = _selectedRow + 1;
    if(_selectedTable == TABLE_RECORD_BROWSER && _indexesRecordBrowser[_indexesRecordBrowser.length - 1] < _content.length - 1 && _indexesRecordBrowser[_indexesRecordBrowser.length - 1] < row) //Shift table bounds
      populateRecordBrowser(_indexesRecordBrowser[0] + 1, false);
    if(_selectedTable == TABLE_SEARCH_RESULTS && _currentSearchResultsStartIndex < _searchResults.length - 1 && _selectedRow == _indexesSearchResults.length - 1) //Shift table bounds
      populateSearchResults(_currentSearchResultsStartIndex + 1, false, true, -1);
    var cell = getCell(row, _selectedCell, _selectedTable);
    if(cell != null)
      onCellClick(row, _selectedCell, cell.id, _selectedTable);
  }

  function pageUp()
  {
    var row = null;
    if(_selectedTable == TABLE_RECORD_BROWSER){
      populateRecordBrowser(_currentRecordBrowserStartIndex - _recordBrowserMax, false);
      row = _selectedRow - _recordBrowserMax;
      if(row < 0)
        row = 0;
      if(row >= _content.length)
        row = _content.length - 1;
    }
    
    if(_selectedTable == TABLE_SEARCH_RESULTS){
      if(_currentSearchResultsStartIndex == 0)
        populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, true, false, -1);
      else
        populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, false, false, _selectedRow);
    }

    if(row != null){
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    }
  }

  function pageDown()
  {
    var row = null;
    if(_selectedTable == TABLE_RECORD_BROWSER){
      populateRecordBrowser(_currentRecordBrowserStartIndex + _recordBrowserMax, false);
      row = _selectedRow + _recordBrowserMax;
      if(row < 0)
        row = 0;
      if(row >= _content.length)
        row = _content.length - 1;
    }
    
    if(_selectedTable == TABLE_SEARCH_RESULTS){
      if(_currentSearchResultsStartIndex >= _searchResults.length - _searchResultsMax)
        populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, true, -1);
      else
        populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, false, _selectedRow);
    }

    if(row != null){
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    }
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
            htmlToAdd += "<div id='search_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 2; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='searchInputAutocomplete(\"" + _search_autocomplete_matches[i] + "\")'>" + getHTMLSafeText(_search_autocomplete_matches[i]) + "</div><br>";
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

  function onSearchInputFocusOut()
  {
    clearSearchAutocomplete();
  }

  function selectSearchAutocompleteUp()
  {
    if(_selected_search_autocomplete >= _search_autocomplete_matches.length)
      _selected_search_autocomplete = 0;
    if(_search_autocomplete_matches.length > 0){      
      for(var i = 0; i < _search_autocomplete_matches.length; ++i)
        document.getElementById("search_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_search_autocomplete > 0)
        --_selected_search_autocomplete;
      document.getElementById("search_autocomplete_match_" + _selected_search_autocomplete).style.backgroundColor = _selectedCellColor;
    }
  }

  function selectSearchAutocompleteDown()
  {
    if(_selected_search_autocomplete >= _search_autocomplete_matches.length)
      _selected_search_autocomplete = 0;
    if(_search_autocomplete_matches.length > 0){      
      for(var i = 0; i < _search_autocomplete_matches.length; ++i)
        document.getElementById("search_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_search_autocomplete < _search_autocomplete_matches.length - 1)
        ++_selected_search_autocomplete;
      document.getElementById("search_autocomplete_match_" + _selected_search_autocomplete).style.backgroundColor = _selectedCellColor;
    }
  }
  // function moveToNextTable(){
  //   var newTable = (_selectedTable + 1) % 3;
  //   var cell = getCell(0, 0, newTable);
  //   if(cell != null)
  //     onCellClick(0, 0, cell.id, _selectedTable);
  // }

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
        htmlToAdd += "<div id='partnum_autocomplete_match_" + i + "' class='text1' style='position: absolute; width: 230px; z-index: 2; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;'>" + getHTMLSafeText(_partnum_autocomplete_matches[i]) + "</div><br>";
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
      for(var j = 0; j < EXTRA_DB.length; ++j)
      {
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

  function onPartNumFocus(indexi, indexj)
  {
    _selected_partnum_input_i = indexi;
    _selected_partnum_input_j = indexj;
    deselectTable();
  }

  function partnum_input_keyup_event(event)
  {
    if(event.keyCode == KEY_ENTER)
    {
      partNumInputAutocomplete();
    }
    else if (event.keyCode === KEY_ESCAPE) {
      clearPartNumAutocomplete();
    }
    else if(event.keyCode == KEY_UP_ARROW)
    {

    }
    else if(event.keyCode == KEY_DOWN_ARROW)
    {
      
    }
    else{
      showPartNumAutocomplete();
    }
  }

  function partnum_input_keydown_event(event)
  {
    if(event.keyCode == KEY_UP_ARROW)
    {
      selectPartNumAutocompleteUp();
    }
    else if(event.keyCode == KEY_DOWN_ARROW)
    {
      selectPartNumAutocompleteDown();
    }
  }

  function selectPartNumAutocompleteUp()
  {
    if(_selected_partnum_autocomplete >= _partnum_autocomplete_matches.length)
      _selected_partnum_autocomplete = 0;
    if(_partnum_autocomplete_matches.length > 0){      
      for(var i = 0; i < _partnum_autocomplete_matches.length; ++i)
        document.getElementById("partnum_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_partnum_autocomplete > 0)
        --_selected_partnum_autocomplete;
      document.getElementById("partnum_autocomplete_match_" + _selected_partnum_autocomplete).style.backgroundColor = _selectedCellColor;
    }
  }

  function selectPartNumAutocompleteDown()
  {
    if(_selected_partnum_autocomplete >= _partnum_autocomplete_matches.length)
      _selected_partnum_autocomplete = 0;
    if(_partnum_autocomplete_matches.length > 0){     
      for(var i = 0; i < _partnum_autocomplete_matches.length; ++i)
        document.getElementById("partnum_autocomplete_match_" + i).style.backgroundColor = "white";
      if(_selected_partnum_autocomplete < _partnum_autocomplete_matches.length - 1)
        ++_selected_partnum_autocomplete;
      document.getElementById("partnum_autocomplete_match_" + _selected_partnum_autocomplete).style.backgroundColor = _selectedCellColor;
    }
  }


//PART CHILD EDIT AUTOCOMPLETE

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
    if(event.keyCode == KEY_ENTER)
    {
      // partNumInputAutocomplete();
      _selected_child_part_db = document.getElementById("part_child_dropdown_select").selectedIndex;
      _selected_child_part_record = _partchild_edit_autocomplete_matches[_selected_partchild_edit_autocomplete];
      populateChildPartRecordManager();
      clearPartChildEditAutocomplete();
    }
    else if (event.keyCode === KEY_ESCAPE) {
      clearPartChildEditAutocomplete();
    }
    else if(event.keyCode == KEY_UP_ARROW)
    {

    }
    else if(event.keyCode == KEY_DOWN_ARROW)
    {
      
    }
    else{
      showPartChildEditAutocomplete();
    }
  }

  function partchild_edit_input_keydown_event(event)
  {
    if(event.keyCode == KEY_UP_ARROW)
    {
      selectPartChildEditAutocompleteUp();
    }
    else if(event.keyCode == KEY_DOWN_ARROW)
    {
      selectPartChildEditAutocompleteDown();
    }
  }

  function selectPartChildEditAutocompleteUp()
  {
    if(_selected_partchild_edit_autocomplete >= _partchild_edit_autocomplete_matches.length)
      _selected_partchild_edit_autocomplete = 0;
    if(_partchild_edit_autocomplete_matches.length > 0){
        for(var i = 0; i < _partchild_edit_autocomplete_matches.length; ++i)
          document.getElementById("partchild_edit_autocomplete_match_" + i).style.backgroundColor = "";
        if(_selected_partchild_edit_autocomplete > 0)
          --_selected_partchild_edit_autocomplete;
        document.getElementById("partchild_edit_autocomplete_match_" + _selected_partchild_edit_autocomplete).style.backgroundColor = _selectedCellColor;
    }
  }

  function selectPartChildEditAutocompleteDown()
  {
    if(_selected_partchild_edit_autocomplete >= _partchild_edit_autocomplete_matches.length)
      _selected_partchild_edit_autocomplete = 0;
    if(_partchild_edit_autocomplete_matches.length > 0){      
      for(var i = 0; i < _partchild_edit_autocomplete_matches.length; ++i)
        document.getElementById("partchild_edit_autocomplete_match_" + i).style.backgroundColor = "";
      if(_selected_partchild_edit_autocomplete < _partchild_edit_autocomplete_matches.length - 1)
        ++_selected_partchild_edit_autocomplete;
      document.getElementById("partchild_edit_autocomplete_match_" + _selected_partchild_edit_autocomplete).style.backgroundColor = _selectedCellColor;
      
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
      for(var i = 0; i < _content_extra[_selected_extra_db].length; ++i)
      {
        var part_child_edit_string = _content_extra[_selected_extra_db][i][0].PN;
        if ((match = regexp.exec(part_child_edit_string.toLowerCase())) !== null) //If match found in whole string
        { 
          if(!_partchild_edit_autocomplete_matches.includes(i))
          {
            _partchild_edit_autocomplete_matches.push(i);
            ++numMatches;
            if(numMatches >= MAX_PARTCHILDEDIT_SUGGESTIONS)
              break;
          }
        }
      }
    }
    if(_partchild_edit_autocomplete_matches.length > 0)
    {
      htmlToAdd += "<table style='position: absolute; z-index: 2;'><tr>";
      for(var j = 0; j < RECORD_VIEW_HEADERS.length; ++j)
      {
        htmlToAdd += "<th><p>" + RECORD_VIEW_HEADERS[j] + "</p></th>";
      }
      htmlToAdd += "</tr>";
      for(var j = 0; j < _partchild_edit_autocomplete_matches.length; ++j)
      {
        var extraDBIndex = _partchild_edit_autocomplete_matches[j];
        htmlToAdd += "<tr id='partchild_edit_autocomplete_match_" + j + "'>";
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
    if(_recordViews.length > _selected_record_view)
    {
      var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
      if(rownum != null)
      {
        if(rownum > 0)
        {
          var newID = _content[rownum - 1][_content[rownum - 1].length - 1];
          if(_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && _recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
            _recordViews_Key_To_Details_Open.set(newID, true);
          else
            _recordViews_Key_To_Details_Open.set(newID, false);
          _recordViews[_selected_record_view] = newID
          populateRecordViews();
        }
      }
    }
  }

  function changeRecordViewDown()
  {
    if(_recordViews.length > _selected_record_view)
    {
      var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
      if(rownum != null)
      {
        if(rownum < _content.length - 1)
        {
          var newID = _content[rownum + 1][_content[rownum + 1].length - 1];
          if(_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && _recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
            _recordViews_Key_To_Details_Open.set(newID, true);
          else
            _recordViews_Key_To_Details_Open.set(newID, false);
          _recordViews[_selected_record_view] = newID
          populateRecordViews();
        }
      }
    }
  }