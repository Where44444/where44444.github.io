// Get the input field
var input_email = document.getElementById("email_input");
var input_password = document.getElementById("password_input");
var input_search = document.getElementById("search_input");

// Execute a function when the user releases a key on the keyboard
input_email.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("login_button").click();
    }
  });
  
  input_password.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("login_button").click();
    }
  });
  
  input_search.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("search_button").click();
    }
  });

  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;
  var KEY_TAB = 9;
  var KEY_PAGE_UP = 33;
  var KEY_PAGE_DOWN = 34;

  document.addEventListener("keydown", function(event) { 
    switch(event.keyCode){
        case KEY_LEFT: //Left Arrow
          if(_isTableSelected){
            event.preventDefault();
            moveLeft();
          }
          break;
        case KEY_UP: //Up Arrow
          if(_isTableSelected){
            event.preventDefault();
            moveUp();
          }
          break;
        case KEY_RIGHT: //Right Arrow
          if(_isTableSelected){
            event.preventDefault();
            moveRight();
          }
          break;
        case KEY_DOWN: //Down Arrow
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
      onCellClick(_selectedRow, column, cell.id, _selectedTable);
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
      onCellClick(_selectedRow, column, cell.id, _selectedTable);
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
    var row = -1;;
    if(_selectedTable == TABLE_RECORD_BROWSER && _currentRecordBrowserStartIndex > 0 && _selectedRow - _recordBrowserMax >= 0){
      populateRecordBrowser(_currentRecordBrowserStartIndex - _recordBrowserMax, false);
      row = _selectedRow - _recordBrowserMax;
    }
    
    if(_selectedTable == TABLE_SEARCH_RESULTS && _currentSearchResultsStartIndex > 0){
      populateSearchResults(_currentSearchResultsStartIndex - _searchResultsMax, false, false, _selectedRow);
    }

    if(row != -1){
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    }
  }

  function pageDown()
  {
    var row = -1;;
    if(_selectedTable == TABLE_RECORD_BROWSER && _selectedRow + _recordBrowserMax < _content.length){
      populateRecordBrowser(_currentRecordBrowserStartIndex + _recordBrowserMax, false);
      row = _selectedRow + _recordBrowserMax;
    }
    
    if(_selectedTable == TABLE_SEARCH_RESULTS){
      populateSearchResults(_currentSearchResultsStartIndex + _searchResultsMax, false, false, _selectedRow);
    }

    if(row != -1){
      var cell = getCell(row, _selectedCell, _selectedTable);
      if(cell != null)
        onCellClick(row, _selectedCell, cell.id, _selectedTable);
    }
  }

  // function moveToNextTable(){
  //   var newTable = (_selectedTable + 1) % 3;
  //   var cell = getCell(0, 0, newTable);
  //   if(cell != null)
  //     onCellClick(0, 0, cell.id, _selectedTable);
  // }