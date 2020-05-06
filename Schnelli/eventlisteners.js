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
        if(_autocomplete_matches.length > 0)
          searchInputAutocomplete();
        else
          document.getElementById("search_specific_button").click();
      }
      else if (event.keyCode === KEY_UP_ARROW) {

      }
      else if (event.keyCode === KEY_DOWN_ARROW) {

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
        if(_autocomplete_matches.length > 0)
          selectAutocompleteUp();
        else
          viewHistory(null, -1);
      }
      else if (event.keyCode === KEY_DOWN_ARROW) {
        event.preventDefault();
        if(_autocomplete_matches.length > 0)
          selectAutocompleteDown();
        else
          viewHistory(null, 1);
      }
    });
  }

  var KEY_ENTER = 13
  var KEY_LEFT_ARROW = 37;
  var KEY_UP_ARROW = 38;
  var KEY_RIGHT_ARROW = 39;
  var KEY_DOWN_ARROW = 40;
  var KEY_TAB = 9;
  var KEY_PAGE_UP = 33;
  var KEY_PAGE_DOWN = 34;

  document.addEventListener("keydown", function(event) { 
    switch(event.keyCode){
        case KEY_LEFT_ARROW: //Left Arrow
          if(_isTableSelected){
            event.preventDefault();
            moveLeft();
          }
          break;
        case KEY_UP_ARROW: //Up Arrow
          if(_isTableSelected){
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
          if(_isTableSelected){
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
          break;
    }
  });

  document.addEventListener("keyup", function(event) { 
    switch(event.keyCode){
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
  var _autocomplete_matches = new Array();
  var _selected_autocomplete = -1;
  function showSearchAutocomplete()
  {
    clearAutocomplete();
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
              if(!_autocomplete_matches.includes(matchFinal)){
                _autocomplete_matches.push(matchFinal);
                ++numMatches;
                if(numMatches >= MAX_SEARCH_SUGGESTIONS)
                  break;
              }
            }
          }
        }
        if(_autocomplete_matches.length > 0)
        {
          var htmlToAdd = "";
          for(var i = 0; i < _autocomplete_matches.length; ++i)
          {
            htmlToAdd += "<div id='autocomplete_match_" + i + "' class='clickable' style='position: absolute; width: 230px; z-index: 2; background-color: white; border-top: 2px solid; border-bottom: 2px solid; border-color: grey;' onclick='searchInputAutocomplete(\"" + _autocomplete_matches[i] + "\")'>" + getHTMLSafeText(_autocomplete_matches[i]) + "</div><br>";
          }
          document.getElementById("search_autocomplete_" + _selected_search_input).innerHTML = htmlToAdd;
        }
      }
    }
  }

  function clearAutocomplete()
  {
    _selected_autocomplete = -1;
    _autocomplete_matches = [];
    for(var i = 0; i < INDEXES_CONCAT.length; ++i)
    {
      document.getElementById("search_autocomplete_" + i).innerHTML = "";
    }
  }

  function searchInputAutocomplete()
  {
    if(_selected_autocomplete >= 0 && _selected_autocomplete < _autocomplete_matches.length)
      document.getElementById("search_input_" + _selected_search_input).value = _autocomplete_matches[_selected_autocomplete];
    clearAutocomplete();
  }

  function onSearchInputFocusOut()
  {
    clearAutocomplete();
  }

  function selectAutocompleteUp()
  {
    if(_autocomplete_matches.length > 0){      
      if(_selected_autocomplete > 0){
        for(var i = 0; i < _autocomplete_matches.length; ++i)
          document.getElementById("autocomplete_match_" + i).style.backgroundColor = "white";
        --_selected_autocomplete;
        document.getElementById("autocomplete_match_" + _selected_autocomplete).style.backgroundColor = _selectedCellColor;
      }
    }
  }

  function selectAutocompleteDown()
  {
    if(_autocomplete_matches.length > 0){      
      if(_selected_autocomplete < _autocomplete_matches.length - 1){
        for(var i = 0; i < _autocomplete_matches.length; ++i)
          document.getElementById("autocomplete_match_" + i).style.backgroundColor = "white";
        ++_selected_autocomplete;
        document.getElementById("autocomplete_match_" + _selected_autocomplete).style.backgroundColor = _selectedCellColor;
      }
    }
  }
  // function moveToNextTable(){
  //   var newTable = (_selectedTable + 1) % 3;
  //   var cell = getCell(0, 0, newTable);
  //   if(cell != null)
  //     onCellClick(0, 0, cell.id, _selectedTable);
  // }