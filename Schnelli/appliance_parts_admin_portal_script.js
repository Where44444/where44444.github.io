var indexes = ["RECORD_NUMBER","DESCRIP1","DESCRIP2","COMMENTS","EQUIP_TYPE","EQUIP_DSGN","APPL_BRAND","APPL_MFR","PART_TYPE","B_PN",   "CHLX_PN","F_PN",   "GEM_PN", "RS_PN",  "MM_PN",  "JS_PN",  "K_PN",   "L_PN",   "M_PN",   "N_PN",   "OEM_PN", "PART_NUMBR", "Q_PN",   "SOURCE", "UNIT",   "KEEP",   "REORD_QTY","GET",    "PICKED", "TAG",    "FROM",   "CGS",    "DATE",   "FRT_IN", "QUESTIONS","MODIFIED","NEW",    "NEWER",  "LOCATION","SPECMETHOD","SPEC01NAME","SPEC01HINT","SPEC01DATA","SPEC02NAME","SPEC02HINT","SPEC02DATA","SPEC03NAME","SPEC03HINT","SPEC03DATA","SPEC04NAME","SPEC04HINT","SPEC04DATA","SPEC05NAME","SPEC05HINT","SPEC05DATA","SPEC06NAME","SPEC06HINT","SPEC06DATA","SPEC07NAME","SPEC07HINT","SPEC07DATA","SPEC08NAME","SPEC08HINT","SPEC08DATA","SPEC09NAME","SPEC09HINT","SPEC09DATA","SPEC10NAME","SPEC10HINT","SPEC10DATA","SPEC11NAME","SPEC11HINT","SPEC11DATA","SPEC12NAME","SPEC12HINT","SPEC12DATA"];
var indexWidths = ["initial",  "200px",   "200px",   "400px",   "initial",   "initial",   "initial",   "initial", "initial",  "initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial",    "initial","initial","initial","initial","initial",  "initial","initial","initial","initial","initial","initial","initial","initial",  "initial", "initial","initial","initial", "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial"   ];
var wordsToIgnore = ["the","at","there","some","my","of","be","use","her","than","and","this","an","would","a","have","each","make","to","from","which","like","been","in","or","she","him","call","is","one","do","into","who","you","had","how","time","that","by","their","has","its","it","word","if","look","now","he","but","will","two","find","was","not","up","more","for","what","down","on","all","about","go","day","are","were","out","see","did","as","we","get","with","when","then","no","come","his","your","them","way","made","they","can","these","could","may","i","said","so"];
var _content;
var _content_standard;
// var _indexToContentID;
var _contentSortedIndex = 1;
var _contentSortedReverse = false;
var _sortedIndexBGColor = "#70A2FF"; //Light blue
var _sortedIndexBGColorReverse = "#FF7070"; //Salmon
var _selectedRowColor = "#96BBFF"; //Light blue
var _selectedCellColor = "#70A2FF"; //Slightly Less Light blue
var _tempTopRowColor = "#A0FF77"; //Light green

var _isTableSelected = false;
var _selectedTable = TABLE_RECORD_BROWSER;
var _selectedRow = 0;
var _selectedCell = 0;
var _selectedCellLastID = null;

var _searchResults = []; //[index, [cells with match], [actual string matches]]

//Only indexes of records being shown in the tables
var _currentSearchResultsStartIndex = 0;
var _currentRecordBrowserStartIndex = 0;
var _indexesSearchResults = [];
var _indexesSimilarStrings = [];
var _indexesRecordBrowser = [];

var _searchResultsMax = 6;
var _recordBrowserMax = 10;

var _largestRecordNumber = 0;

var _minRepititions = 3;

var TABLE_SEARCH_RESULTS = 0;
var TABLE_SIMILAR_STRINGS = 1;
var TABLE_RECORD_BROWSER = 2;

var checkboxHTML = "";
var checkboxHTML_More = "";
for(var i = 0; i < indexes.length; ++i){
  if(i <= 9){
    checkboxHTML += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 50) + "px;'>" + indexes[i] + "<input type='checkbox' id=\"column_checkbox_" + i + "\"><span class='checkmark'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if((i + 1)% 5 == 0 && i != 0)
      checkboxHTML += "<br><br><br>";
    if(i == 9){
      checkboxHTML += "<button onclick='show_more_column_checkboxes(true);' id=\"show_more_column_checkboxes\" style='position:absolute; left: 50px; width: 200px;'>More</button>";
    }
  }
  else{
    checkboxHTML_More += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 50) + "px;'>" + indexes[i] + "<input type='checkbox' id=\"column_checkbox_" + i + "\"><span class='checkmark'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if((i + 1)% 5 == 0 && i != 0)
      checkboxHTML_More += "<br><br><br>";
    if(i == indexes.length - 1) {
      checkboxHTML_More += "<br><br><br><button onclick='show_more_column_checkboxes(false);' style='position:absolute; left: 50px; width: 200px;'>Less</button>";
    }
  }
}
document.getElementById("radio_columns_checkboxes").innerHTML = checkboxHTML;
document.getElementById("radio_columns_checkboxes_more").innerHTML = checkboxHTML_More;
setRadioColumn();
document.getElementById("repititions_min").value = _minRepititions;

var firebaseConfig = {
  apiKey: "AIzaSyBiHDF9LJepi4QyOhHeayZT_etKN5AjlGs",
  authDomain: "appliance-parts-f45cd.firebaseapp.com",
  databaseURL: "https://appliance-parts-f45cd.firebaseio.com",
  projectId: "appliance-parts-f45cd",
  storageBucket: "appliance-parts-f45cd.appspot.com",
  messagingSenderId: "671454569102",
  appId: "1:671454569102:web:479b1d3a11bedf601c1fdf"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    loadContentDiv();
  }
  else {
    document.getElementById("login_div").style.display = "block";
  }
});

function log_out(){
  firebase.auth().signOut().then(function() {
    document.getElementById("login_div").style.display = "block";
    document.getElementById("content_div").style.display = "none";
    document.getElementById("search_div").style.display = "none";
  }).catch(function(error) {
    window.alert(errorMessage);
  });
}

function log_in(){
  document.getElementById("login_div").style.display = "none";

  var persistenceVar;
  if(document.getElementById("remember_input").checked)
    persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
  else
    persistenceVar = firebase.auth.Auth.Persistence.NONE;

    firebase.auth().setPersistence(persistenceVar).then(function() {
        return firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input").value, document.getElementById("password_input").value).then(function() {
          loadContentDiv();
          }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("login error " + errorMessage);
          window.alert(errorMessage);
          // ...
          document.getElementById("login_div").style.display = "block";
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("persistence error " + errorMessage);
        window.alert(errorMessage);
  });
}

function loadContentDiv(){
  document.getElementById("email_input").value = "";
  document.getElementById("password_input").value = "";
  document.getElementById("content_div").style.display = "block";
  document.getElementById("message").innerHTML = "<p>Downloading parts from database... This may take up to 60 seconds</p>";
  document.getElementById("record_browser_table_div").style.display = "none";

  $.ajax({
    type: "GET",
    url: "ascii_test.txt",
    dataType: "text",
    success: function(data) {processCSVData(data);}
 });

  // var partsRef = firebase.database().ref('parts').orderByChild('RECORD_NUMBER');
  // partsRef.once('value', function(snapshot) {
  //   document.getElementById("message").innerHTML = "<p>Processing parts...</p>";

  //   var numIndexes = indexes.length;
  //   var numChildren = snapshot.numChildren();
  //   _content = new Array(numChildren);
  //   for (var i = 0; i < numChildren; i++)
  //     _content[i] = new Array(numIndexes + 1); 
    
  //   var numRecords = 0;
  //   snapshot.forEach(function(childSnapshot) {
  //     _content[numRecords][0] = childSnapshot.key;
  //     //indexToContentID[numRecords] = childSnapshot.key;
  //     for(var i = 0; i < numIndexes; ++i)
  //       _content[numRecords][i + 1] = String(childSnapshot.child(indexes[i]).val());
      
  //     // document.getElementById("loading_parts").innerHTML = "<p>Processing parts...  " + (numRecords / numChildren) + "%</p>";
  //     ++numRecords;
  //   });
  //   generateContent_Standard();
  //   populateRecordBrowser(0, false);
  //   _contentSortedReverse = true;
  //   sortContentByIndex(1);
  // });

}

function search_query()
{
  document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("similar_string_expander").style.display = "none";
  var searchstring = standardizeString(document.getElementById("search_input").value);
  document.getElementById("message").innerHTML = "<p><br><br><br>Searching...</p>";
  if(searchstring == ""){
    document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found</p>";
  }
  else{
    var searchWorker = new Worker('get_search_results.js');
    // var results = getSearchResults(searchstring, content_simple);
    var columnsToSearch = [];
    var anyChecked = document.getElementById("radio_columns_any").checked;
    for(var i = 0; i < indexes.length; ++i){
      columnsToSearch.push(anyChecked || document.getElementById("column_checkbox_" + i).checked);
    }
    var exactMatch = document.getElementById("search_exact_match").checked;
    if(exactMatch)
      searchstring = document.getElementById("search_input").value.toLowerCase();
    searchWorker.postMessage([searchstring, _content_standard, _content, columnsToSearch, exactMatch]);
    searchWorker.onmessage = function(e) {
      var results = e.data;
      if(results.length == 0)
        document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found</p>";
      else{
        _searchResults = results;
        populateSearchResults(0, false, false, -1);
      }
    }
  }
}

function populateRecordBrowser(indexStart, highlight_IndexStart_Green)
{
  document.getElementById("record_browser_table_div").innerHTML = "";

  var origIndexStart = indexStart;
  if(_content.length - indexStart < _recordBrowserMax)
    indexStart = _content.length - _recordBrowserMax;
  if(indexStart < 0)
    indexStart = 0;
  if(indexStart > _content.length - 1)
    indexStart = _content.length - 1;
  var indexEnd = indexStart + (_recordBrowserMax - 1);
  if(_content.length - 1 < indexEnd)
    indexEnd = _content.length - 1;
  _currentRecordBrowserStartIndex = indexStart;

  if(_content.length > 0){
    document.getElementById("search_div").style.display = "block";
    document.getElementById("message").innerHTML = "";
    document.getElementById("record_browser_table_div").style.display = "block";
    var numIndexes = indexes.length;
    var tableHTML = "<h1>Record Browser</h1><p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _content.length + " Record(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
    "<p style='display: inline;'>Table Size</p>&nbsp;&nbsp;" + 
    "<input id=\"record_browser_max\" type=\"number\" value=" + _recordBrowserMax + " min=\"0\" onfocus='showRecordBrowserMax();' onchange='showRecordBrowserMax();'></input>" + 
    "<button id=\"save_record_browser_max\" onclick=\"updateRecordBrowserMax();\" style=\"display: none;\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='startNewRecord();'>Add New Part +</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='recordBrowserJumpToEdge(0);'>Jump to Top</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='recordBrowserJumpToEdge(1);'>Jump to Bottom</button>" + 
    "<div id='add_part_table_div'></div>" +
    "<table class='clickable' id='record_browser_table'><tr>";
    for(i = 0; i < numIndexes; ++i){
      var bgcolor = "inherit";
      if((i + 1) == _contentSortedIndex)
        if(_contentSortedReverse)
          bgcolor = _sortedIndexBGColorReverse;
        else
          bgcolor = _sortedIndexBGColor;
      tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + (i + 1) + ");' style='background-color: " + bgcolor + ";'><div style='width: " + indexWidths[i] + ";'>" + indexes[i] + "</div></th>";
    }

    _indexesRecordBrowser = [];
    var numRows = 0;
    for (var i = indexStart; i <= indexEnd; ++i) {
      tableHTML += "<tr id='record_browser_row_" + i + "'>"
      _indexesRecordBrowser.push(i);
      for(var j = 0; j < numIndexes; ++j)
      {
        var id2 = "record_browser_cell_" + i + "_" + j;
        if(j == 0)
          tableHTML += "<td id='" + id2 + "' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><img id='edit_icon_" + numRows + "' src='pencil.png' width=20px height=20px onclick='startEditRecord(\"" + _content[i][0] + "\", " + i + ", \"record_browser_row_" + i + "\");'>&nbsp;&nbsp;&nbsp;&nbsp;<div class='tooltip'><span class='tooltiptext'>" + indexes[j] + "<br><br>" + _content[i][2] + "</span>" + _content[i][j + 1] + "</div></td>";
        else
          tableHTML += "<td id='" + id2 + "' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + indexes[j] + "<br><br>" + _content[i][2] + "</span>" + _content[i][j + 1] + "</div></td>";
      }
      tableHTML += "</tr>"
      ++numRows;
    }

    tableHTML += "</tr></table>";
    document.getElementById("record_browser_table_div").innerHTML = tableHTML;
  }
  if(highlight_IndexStart_Green && document.getElementById("record_browser_row_" + origIndexStart) != null){
    document.getElementById("record_browser_row_" + origIndexStart).style.backgroundColor = _tempTopRowColor;
  }
}

function populateSearchResults(indexStart, selectTopRow, selectBottomRow, rowToSelect)
{
  document.getElementById("similar_strings_div").innerHTML = "";
  if(_searchResults.length - indexStart < _searchResultsMax)
    indexStart = _searchResults.length - _searchResultsMax;
  if(indexStart < 0)
    indexStart = 0;
  if(indexStart > _searchResults.length - 1)
    indexStart = _searchResults.length - 1;
  var indexEnd = indexStart + (_searchResultsMax - 1);
  if(_searchResults.length - 1 < indexEnd)
    indexEnd = _searchResults.length - 1;

    _currentSearchResultsStartIndex = indexStart;

  var shouldHighlight = document.getElementById("search_highlight_similar_words").checked;
  var numIndexes = indexes.length;
  // var tableHTML = "<h1>Search Results</h1><table id='record_browser_table'><tr>";
  // for(i = 0; i < numIndexes; ++i)
  //     tableHTML += "<th>" + indexes[i] + "</th>";
  // tableHTML += "</tr></table>";
  // document.getElementById("search_results_table_div").innerHTML = tableHTML;
  // var table = document.getElementById("record_browser_table");

  _indexesSearchResults = [];
  var array_trimmed = [];
  var numRows = 0;
  for (var i = indexStart; i <= indexEnd; ++i) {
    array_trimmed.push(new Array(numIndexes));
    var currentIndex = _searchResults[i][0];
    _indexesSearchResults.push(currentIndex);
    for(var j = 0; j < numIndexes + 1; ++j)
    {
      array_trimmed[numRows][j] = _content[currentIndex][j];
    }
    ++numRows;
  }

  if(shouldHighlight){
    var actualSearchStrings = [];
    for (var i = indexStart; i <= indexEnd; ++i) {
      // var len = table.rows.length;
      // var row = table.insertRow(len);
      var matchingcells = _searchResults[i][1];
      for(var j = 1; j < numIndexes + 1; ++j){
          // var cell1 = row.insertCell(j);
          // cell1.innerHTML = array_trimmed[i][j];
          if(matchingcells.includes(j)){
            var stringToHighlight = _searchResults[i][2][matchingcells.indexOf(j)];
            if(!actualSearchStrings.includes(stringToHighlight))
              actualSearchStrings.push(stringToHighlight);
            // var re = new RegExp(stringToHighlight,"g");
            // cell1.innerHTML = cell1.innerHTML.replace(re, "<span style='background: yellow;'>" + stringToHighlight + "</span>");
          }
      }
    }

    //Get string repetition info---------------------------------------------
    var singleWordsToOccurences = new Map(); //Standardized (word) to      [[num occurences, color],             [actual word spellings], [row nums]]
    var doubleWordsToOccurences = new Map(); //Standardized (word word) to [[num occurences, color, word, word], [actual word spellings], [row nums]]
    for(var i = 0; i < array_trimmed.length; ++i)
    {
      var row = array_trimmed[i];
      for(var j = 1; j < row.length; ++j)
      {
        var string = row[j];
        var lastCharWasSpace = true;
        var start0 = 0;
        var end = 0;
        var start1 = 0;
        for(var k = 0; k < string.length; ++k)
        {
          var char = string[k];
          var charIsSpace = (char == " ");
          var endOfString = (k + 1 == string.length);
          if(lastCharWasSpace && !charIsSpace){ //Beginning of word
            start0 = start1;
            start1 = k;
          }
          else if((!lastCharWasSpace && charIsSpace) || endOfString){ //Space at end of word or end of string
            if(endOfString)
              end = k + 1;
            else
              end = k;
            var singleWord = string.substring(start1, end);
            var singleWordStandard = standardizeString(singleWord);
            if(!wordsToIgnore.includes(singleWordStandard) && singleWordStandard.length > 1){
              if(singleWordsToOccurences.has(singleWordStandard)){
                var value = singleWordsToOccurences.get(singleWordStandard)
                value[0][0] = value[0][0] + 1;
                if(!value[2].includes(i))
                  value[2].push(i);
                if(!value[1].includes(singleWord)){
                  value[1].push(singleWord);
                }
              }
              else{
                // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                var color = getColorFromString(singleWordStandard);
                var value = [[1, color], [singleWord], [i]];
                singleWordsToOccurences.set(singleWordStandard, value);
              }
            }
            if(start0 != start1){
              var doubleWord = string.substring(start0, end);
              var doubleWordStandard = standardizeString(doubleWord);
              var doubleWordSplit = doubleWordStandard.split(" ");
              if(!wordsToIgnore.includes(doubleWordSplit[0]) && !wordsToIgnore.includes(doubleWordSplit[1]) && doubleWordStandard.length > 3){
                if(doubleWordsToOccurences.has(doubleWordStandard)){
                  var value = doubleWordsToOccurences.get(doubleWordStandard)
                  value[0][0] = value[0][0] + 1;
                  if(!value[2].includes(i))
                    value[2].push(i);
                  if(!value[1].includes(doubleWord)){
                    value[1].push(doubleWord);
                  }
                }
                else{
                  // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                  var color = getColorFromString(doubleWordStandard);
                  var value = [   [1, color, doubleWordSplit[0], doubleWordSplit[1]],  [doubleWord], [i]];
                  doubleWordsToOccurences.set(doubleWordStandard, value);
                }
              }
            }
          }
          lastCharWasSpace = charIsSpace;
        }
      }
    }

    //Populate similar strings list--------------------------------------------------------------
    var wordsToSort = []; //[[Standardized word, color], [Actual Words], [row nums]]
    for (let [key, value] of doubleWordsToOccurences) {
      if(value[0][0] >= _minRepititions){
        var finalValue = [[key, value[0][1]], value[1], value[2]];
        wordsToSort.push(finalValue);
      }
    }
    
    for (let [key, value] of singleWordsToOccurences) {
      if(value[0][0] >= _minRepititions){
        var finalValue = [[key, value[0][1]], value[1], value[2]];
        wordsToSort.push(finalValue);
      }
    }
    
    wordsToSort.sort(COMPARE_0_0);
    var similarHTML = "";
    var totalRows = 0;
    _indexesSimilarStrings = [];

    for(var i = 0; i < wordsToSort.length; ++i)
    {
      var wordData = wordsToSort[i];
      var resultsLabel = "results";
      if(wordData[2].length == 1)
        resultsLabel = "result";
      similarHTML += "<div class='clickable' onclick='toggle_similar_string_table(" + i + ");'><p><span id='similar_string_expander_" + i + "'>+</span> " + wordData[1][0] + " (" + wordData[2].length + " " + resultsLabel + ")</p></div>";
      
      similarHTML += "<table class='clickable' style='margin-left: 20px; display: none;' id='similar_string_table_" + i + "'><tr>";
      for(var j = 0; j < indexes.length; ++j){
        var bgcolor = "inherit";
        if((j + 1) == _contentSortedIndex)
          if(_contentSortedReverse)
            bgcolor = _sortedIndexBGColorReverse;
          else
            bgcolor = _sortedIndexBGColor;
        similarHTML += "<th class='clickable' onclick='sortContentByIndex(" + (j + 1) + ");' style='background-color: " + bgcolor + ";'><div style='width: " + indexWidths[j] + ";'>" + indexes[j] + "</div></th>";
      }
      similarHTML += "</tr>";
      for(var j = 0; j < wordData[2].length; ++j){
        similarHTML += "<tr id='similar_string_row_" + totalRows + "'>";
        var rownum = wordData[2][j];
        _indexesSimilarStrings.push(_indexesSearchResults[rownum]);
        for(var k = 0; k < indexes.length; ++k){
          
          var termToHighlightList = [];
          var preHTML_List = [];
          var postHTML_List = [];

          var string = array_trimmed[rownum][k + 1];
          var color = wordData[0][1];
          var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
          for(var v = 0; v < wordData[1].length; ++v){
            // if(getRegexSafeSearchTerm(wordData[1][v]).length <= 1)
            //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(wordData[1][v]) + "|");
            termToHighlightList.push(wordData[1][v]);
            preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
            postHTML_List.push("</span>");
          }
          string = highlightString(string, termToHighlightList, preHTML_List, postHTML_List);
          var id2 = "similar_string_cell_" + totalRows + "_" + k;
          similarHTML += "<td id='" + id2 + "' onclick='onCellClick(" + totalRows + "," + k + ",\"" + id2 + "\"," + TABLE_SIMILAR_STRINGS + ");'><div class='tooltip'><span class='tooltiptext'>" + indexes[k] + "<br><br>" + array_trimmed[rownum][2] + "</span>" + string + "</div></td>";
        }

        similarHTML += "</tr>";
        ++totalRows;
      }
      similarHTML += "</table>";
    }
    document.getElementById("similar_string_expander").style.display = "block";
    document.getElementById("similar_strings_div").innerHTML = similarHTML;

    //Highlight array strings with regex---------------------------------------------

    //Go through array of matched search term phrases
    //  Make bold and yellow background
    //
    //Go through singleword map
    //  If more than 2 values in the value array
    //    check if the standard word is in the first slot of any entries in the double word map, set typeHighlightSingle map to false
    //    else set to true
    //
    //Go through double word map
    //  If more than 2 values in the value array
    //    highlight with background
    //
    //Go through single word map
    //  If more than 2 values in the value array
    //    highlight with type from typeHighlightSingle map
    //
    var typeHighlightBGSingle = new Map();
      for (let [key1, value1] of singleWordsToOccurences) {
        if(value1[0][0] >= _minRepititions)
          for (let [key2, value2] of doubleWordsToOccurences) {
            if(value2[0][0] >= _minRepititions)
              typeHighlightBGSingle.set(key1, (key1 != value2[0][2] && key1 != value2[0][3])); //Single word is not in a double word pair
          }
      }

    for(var i = 0; i < array_trimmed.length; ++i){
      for(var j = 1; j < array_trimmed[i].length; ++j){

        var termToHighlightList = [];
        var preHTML_List = [];
        var postHTML_List = [];
        //Highlight search terms
        for(var s = 0; s < actualSearchStrings.length; ++s){
          // if(getRegexSafeSearchTerm(actualSearchStrings[s]).length <= 1)
          //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(actualSearchStrings[s]) + "|");
          termToHighlightList.push(actualSearchStrings[s]);
          preHTML_List.push("<span style='background: yellow; color: black;'><b>");
          postHTML_List.push("</b></span>");
        }

        //Highlight double words
          for (let [key, value] of doubleWordsToOccurences) {
            if(value[0][0] >= _minRepititions){
              var color = value[0][1];
              var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
              for(var v = 0; v < value[1].length; ++v){
                // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                termToHighlightList.push(value[1][v]);
                preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                postHTML_List.push("</span>");
              }
            }
          }

          //Highlight single words
          for (let [key, value] of singleWordsToOccurences) {
            if(value[0][0] >= _minRepititions){
              var color = value[0][1];
              var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
              for(var v = 0; v < value[1].length; ++v){
                // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                termToHighlightList.push(value[1][v]);
                if(typeHighlightBGSingle.get(key)){
                  preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                  postHTML_List.push("</span>");
                }
                else{
                  preHTML_List.push("<span style='border-bottom: 3px solid " + bgColor + "'>");
                  postHTML_List.push("</span>");
                }
              }
            }
          }

          array_trimmed[i][j] = highlightString(array_trimmed[i][j], termToHighlightList, preHTML_List, postHTML_List);

      }
    }
  }

  //Generate search results table-----------------------------------------------------------------
  var tableHTML = "<p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _searchResults.length + " Result(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
  "<p style='display: inline;'>Table Size</p>&nbsp;&nbsp;" + 
  "<input id=\"search_results_max\" type=\"number\" value=" + _searchResultsMax + " min=\"0\" onchange='showSearchResultsMax();' onfocus='showSearchResultsMax();'></input>" + 
  "<button id=\"save_search_results_max\" onclick=\"updateSearchResultsMax();\" style=\"display: none;\">Save</button>" +
  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='searchResultsJumpToEdge(0);'>Jump to Top</button>" + 
  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onclick='searchResultsJumpToEdge(1);'>Jump to Bottom</button>" + 
  "<table class='clickable'><tr>";
  for(var i = 0; i < indexes.length; ++i){
    var bgcolor = "inherit";
    if((i + 1) == _contentSortedIndex)
      if(_contentSortedReverse)
        bgcolor = _sortedIndexBGColorReverse;
      else
        bgcolor = _sortedIndexBGColor;
    tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + (i + 1) + ");' style='background-color: " + bgcolor + ";'><div style='width: " + indexWidths[i] + ";'>" + indexes[i] + "</div></th>";
  }
  tableHTML += "</tr>";
  for(var i = 0; i < array_trimmed.length; ++i){
    tableHTML += "<tr id='search_results_row_" + i + "'>";
    for(var j = 0; j < array_trimmed[i].length - 1; ++j){
      var id2 = "search_results_cell_" + i + "_" + j;
      tableHTML += "<td id='" + id2 + "' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + TABLE_SEARCH_RESULTS + ");'><div class='tooltip'><span class='tooltiptext' style='border: 3px solid black; background-color: white; color: black;'>" + indexes[j] + "<br><br>" + array_trimmed[i][2] + "</span>" + array_trimmed[i][j + 1] + "</div></td>";
    }
      // tableHTML += "<td><div style='width: " + headerWidths[j] + ";'>" + array[i][j] + "</div></td>";
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  document.getElementById("search_results_table_div").innerHTML = tableHTML;

  //Set state of divs-------------------------------------------------------
  document.getElementById("search_results_expander").style.display = "block";
  toggle_search_results(1);
  document.getElementById("message").innerHTML = "";

  if(selectTopRow){
    var cell = getCell(0, _selectedCell, TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(0, _selectedCell, cell.id, TABLE_SEARCH_RESULTS);
  }
  else if(selectBottomRow){
    var cell = getCell(array_trimmed.length - 1, _selectedCell, TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(array_trimmed.length - 1, _selectedCell, cell.id, TABLE_SEARCH_RESULTS);
  }
  else if(rowToSelect >= 0){
    var cell = getCell(rowToSelect, _selectedCell, TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(rowToSelect, _selectedCell, cell.id, TABLE_SEARCH_RESULTS);
  }
} //END populateSearchResults