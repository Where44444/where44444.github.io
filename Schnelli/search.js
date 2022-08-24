function search_query(clearResults) {
  _search_results_resorted = false;
  if (clearResults == null) {
    // document.getElementById("key_shortcut_search_scope_window").style.display = "";
    // _overlay_window_open = true;
    // document.activeElement.blur();
    searchQueryScope(_selected_searchQuery_scope);
  }
  else {
    searchQueryScope(0, true);
  }
}

var _SEARCHSCOPE_NEW = 1;
var _SEARCHSCOPE_CURRENT = 2;
var _selected_searchQuery_scope = _SEARCHSCOPE_NEW;
var _snackbar_update_num_rows_searched = 0;
var _searchresults_threads_recieved = [];
var _snackbar_update_clearresults = null;
var NUM_SEARCH_THREADS = 4;
var NUM_CONTENT_PER_THREAD = 0;
var _search_results_indexes_bool = [];
var _search_results_row_to_result_index = new Map();
var _search_results_resorted = false;
function searchQueryScope(scope, clearResults) {
  _snackbar_update_clearresults = clearResults;
  if (_snackbar_update_clearresults == null)
    setTab(TAB_SEARCH_RESULTS);
  // document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("similar_string_expander").style.display = "none";
  var searchstring_any = document.getElementById("search_input").value;
  if (_snackbar_update_clearresults == null)
    showSnackbar("Searching...", 6000);
  // document.getElementById("message").innerHTML = "<p><br><br><br>Searching...</p>";
  var anyChecked = document.getElementById("radio_columns_any").checked;
  if (searchstring_any == "" && anyChecked) {
    if (_snackbar_update_clearresults == null)
      showSnackbar("No Results Found. Try using numbers or characters in your search", 6000);
    // document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found. Try using numbers or characters in your search</p>";
  }
  else {
    if (anyChecked && !_searchstring_any_history.includes(document.getElementById("search_input").value)) {
      _searchstring_any_history.push(document.getElementById("search_input").value);
      _searchstring_any_history_index = _searchstring_any_history.length;
    }
    // var results = getSearchResults(searchstring, content_simple);

    var total_indexes_length = _INDEXES.length + _MEMO_INDEXES.length;
    var columnsToSearch = [];
    var searchstrings_specific = [];
    for (var i = 0; i < total_indexes_length; ++i) {
      var specific_i = document.getElementById("search_input_" + i).value;
      if (!anyChecked && specific_i != "" && !_searchstring_specific_history[i].includes(specific_i)) {
        _searchstring_specific_history[i].push(document.getElementById("search_input_" + i).value);
        _searchstring_specific_history_index[i] = _searchstring_specific_history[i].length;
      }
      if (_SPEC_DATA_INDEXES.includes(i)) { //If searching for a single number in specdata, make a range of x-x
        var specific_i2 = removeExtraSpaces(specific_i);
        var regexp_number = new RegExp(/(\d*\.?\d+)/, "g");
        var match0 = regexp_number.exec(specific_i2);
        if (match0 != null && match0[0].length == specific_i2.length) {
          specific_i = specific_i2 + "-" + specific_i2;
        }
      }
      searchstrings_specific.push(specific_i);
      if (specific_i == "") {
        document.getElementById("column_checkbox_" + i).checked = false;
        columnsToSearch.push(false);
      }
      else
        columnsToSearch.push(anyChecked || document.getElementById("column_checkbox_" + i).checked);
    }

    var currentResultsRowsIDs = [];
    if (scope == _SEARCHSCOPE_CURRENT) {
      // for(var r = 0; r < _content.length; ++r)
      //   currentResultsRowsBool.push(false);
      // for(var r = 0; r < _searchResults.length; ++r)
      // {
      //   var index = getContentIndexFrom_DB_ID(_searchResults[r].id);
      //   currentResultsRowsBool[index] = true;
      // }
      for (var r = 0; r < _searchResults.length; ++r) {
        currentResultsRowsIDs.push(_searchResults[r].id);
      }
    }

    NUM_CONTENT_PER_THREAD = Math.ceil(_content.length / NUM_SEARCH_THREADS);
    var indexStart = 0;
    _snackbar_update_num_rows_searched = 0;
    _searchresults_threads_recieved = [];
    _searchResults = [];
    for (var i = 0; i < NUM_SEARCH_THREADS; ++i)
      _searchresults_threads_recieved.push(false);
    for (var i = 0; i < NUM_SEARCH_THREADS; ++i) {
      var _content_slice = [];
      var _content_standard_slice = [];
      var indexEnd = indexStart + NUM_CONTENT_PER_THREAD;
      var orig_indexStart = indexStart;
      for (var j = indexStart; j < indexEnd && j < _content.length; ++j) {
        _content_slice.push(_content[j]);
        _content_standard_slice.push(_content_standard[j]);
      }
      indexStart = indexEnd;
      var searchWorker = new Worker('workers/WORKER_get_search_results.js');
      searchWorker.postMessage([searchstring_any, _content_standard_slice, _content_slice, columnsToSearch, anyChecked, searchstrings_specific, _INDEXES, currentResultsRowsIDs, _DESCRIP1, _DESCRIP2, i, orig_indexStart, _SPEC_DATA_INDEXES]);
      searchWorker.onmessage = function (e) {
        var results = e.data;
        if (results[0] == -1) {
          _snackbar_update_num_rows_searched += results[1];
          if (_snackbar_update_clearresults == null)
            showSnackbar("Searched " + _snackbar_update_num_rows_searched + " of " + _content.length + " records", 3000);
          // document.getElementById("message").innerHTML = "<br><br><br><p>Searched " + results[1] + " of " + _content.length + " records</p>";
        }
        else {
          _searchresults_threads_recieved[results[0]] = true;
          results.splice(0, 1);
          _searchResults = _searchResults.concat(results);
          var searchFinished = true;
          for (var i = 0; i < NUM_SEARCH_THREADS; ++i) {
            if (!_searchresults_threads_recieved[i]) {
              searchFinished = false;
              break;
            }
          }
          if (searchFinished) {
            if (_searchResults.length == 0) {
              if (_snackbar_update_clearresults == null)
                showSnackbar("No Results Found", 6000);
            }
            else {
              showSnackbar("Search complete", 1000);
              _searchResults.sort(COMPARE_MATCH_RANKINGS);
              _search_results_indexes_bool = new Array(_content.length);
              _search_results_indexes_bool.fill(false);
              _search_results_row_to_result_index.clear();
              for (var i = 0; i < _searchResults.length; ++i) {
                _search_results_indexes_bool[_searchResults[i].row] = true;
                _search_results_row_to_result_index.set(_searchResults[i].row, i);
              }
              populateSearchResults(0, true, false, -1);
            }
          }

          // if(results.length <= 1){
          //   if(clearResults == null)
          //     showSnackbar("No Results Found", 6000);
          // }
          // else{
          //   results.splice(0,1);
          //   _searchResults = results;
          //   _searchResults.sort(COMPARE_MATCH_RANKINGS);
          //   populateSearchResults(0, true, false, -1);
          // }
        }
      }
    }
  }
}


var array_trimmed = [];
var _table_HTML_0 = "";
var _select_top_row = false;
var _select_bottom_row = false;
var _row_to_select = 0;
var _adding_child_part_links = false;
var _SEARCH_RESULTS_ROW_IDS = [];
var _SIMILAR_STRINGS_ROW_IDS = [];
var NUM_ADD_CHILD_PART_HTML_THREADS = 3;
var NUM_ARRAY_TRIMMED_PER_THREAD = 0;
var _snackbar_update_percent_child_part_html_added = [];
var _add_child_part_html_threads_recieved = [];
var _add_child_part_html_results = [];
function populateSearchResults(indexStart, selectTopRow, selectBottomRow, rowToSelect, populateFromBottom) {
  if (!_adding_child_part_links && _searchResults.length > 0) {
    if (populateFromBottom == null)
      populateFromBottom = false;

    _select_top_row = selectTopRow;
    _select_bottom_row = selectBottomRow;
    _row_to_select = rowToSelect;
    document.getElementById("similar_strings_div").innerHTML = "";

    var populate_indexes = [];
    if (_search_results_resorted) {
      populate_indexes.push(indexStart);
      var endFound = false;
      if (populateFromBottom)
        for (var i = 0; i < _searchResultsMax - 1; ++i) {
          if (!endFound) {
            var nextIndex = getNextContentIndexInSortOrder(_searchResults[populate_indexes[0]].row, _contentSortedReverse, _search_results_indexes_bool);
            if (nextIndex != null)
              populate_indexes.unshift(_search_results_row_to_result_index.get(nextIndex));
            else //If at end of sorted record array
            {
              endFound = true;
            }
          }
          if (endFound) {
            var nextIndex = getNextContentIndexInSortOrder(_searchResults[populate_indexes[populate_indexes.length - 1]].row, !_contentSortedReverse, _search_results_indexes_bool);
            if (nextIndex != null)
              populate_indexes.push(_search_results_row_to_result_index.get(nextIndex)); //Add to front of array
          }
        }
      else
        for (var i = 0; i < _searchResultsMax - 1; ++i) {
          if (!endFound) {
            var nextIndex = getNextContentIndexInSortOrder(_searchResults[populate_indexes[populate_indexes.length - 1]].row, !_contentSortedReverse, _search_results_indexes_bool);
            if (nextIndex != null)
              populate_indexes.push(_search_results_row_to_result_index.get(nextIndex));
            else //If at end of sorted record array
            {
              endFound = true;
            }
          }
          if (endFound) {
            var nextIndex = getNextContentIndexInSortOrder(_searchResults[populate_indexes[0]].row, _contentSortedReverse, _search_results_indexes_bool);
            if (nextIndex != null)
              populate_indexes.unshift(_search_results_row_to_result_index.get(nextIndex)); //Add to front of array
          }
        }
    }
    else //Ranking order
    {
      if (_searchResults.length - indexStart < _searchResultsMax)
        indexStart = _searchResults.length - _searchResultsMax;
      if (indexStart < 0)
        indexStart = 0;
      if (indexStart > _searchResults.length - 1)
        indexStart = _searchResults.length - 1;
      var indexEnd = indexStart + (_searchResultsMax - 1);
      if (_searchResults.length - 1 < indexEnd)
        indexEnd = _searchResults.length - 1;
      for (var i = indexStart; i <= indexEnd; ++i) {
        populate_indexes.push(i);
      }
    }

    _currentSearchResultsStartIndex = indexStart;

    var shouldHighlight = document.getElementById("search_highlight").checked;

    _searchResults_ContentIndexes = [];
    array_trimmed = [];
    // var rankings = [];
    var numRows = 0;
    _indexesSearchResults = [];
    for (var i1 = 0; i1 < populate_indexes.length; ++i1) {
      var i = populate_indexes[i1];
      _indexesSearchResults.push(i);
      array_trimmed.push(new Array());
      var currentIndex = _searchResults[i].row;
      //DEBUG
      // rankings.push(_searchResults[i].ranking);
      //DEBUG
      _searchResults_ContentIndexes.push(currentIndex);
      for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
        if (j < _INDEXES.length)
          array_trimmed[numRows].push(_content[currentIndex][j]);
        else
          array_trimmed[numRows].push(copyArray1D(_content[currentIndex][j]));
      }
      array_trimmed[numRows].push(_content[currentIndex][_content[currentIndex].length - 1]);
      ++numRows;
    }

    if (shouldHighlight) {
      var actualSearchStrings = [];
      for (var i1 = 0; i1 < populate_indexes.length; ++i1) {
        var i = populate_indexes[i1];
        // var len = table.rows.length;
        // var row = table.insertRow(len);
        var matchingcells = _searchResults[i].columns;
        for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
          // var cell1 = row.insertCell(j);
          // cell1.innerHTML = array_trimmed[i][j];
          if (matchingcells.includes(j)) {
            for (var k = 0; k < matchingcells.length; ++k) {
              if (matchingcells[k] == j) {
                var stringToHighlight = _searchResults[i].strings[k];
                if (!actualSearchStrings.includes(stringToHighlight))
                  actualSearchStrings.push(stringToHighlight);
                // var re = new RegExp(stringToHighlight,"g");
                // cell1.innerHTML = cell1.innerHTML.replace(re, "<span style='background: yellow;'>" + stringToHighlight + "</span>");
              }
            }
          }
        }
      }

      var highlightSimilarWords = document.getElementById("search_highlight_similar_words").checked;
      if (highlightSimilarWords) {
        //Get string repetition info---------------------------------------------
        var singleWordsToOccurences = new Map(); //Standardized (word) to      [[num occurences, color],             [actual word spellings], [row nums]]
        var doubleWordsToOccurences = new Map(); //Standardized (word word) to [[num occurences, color, word, word], [actual word spellings], [row nums]]
        for (var i = 0; i < array_trimmed.length; ++i) {
          var row = array_trimmed[i];
          for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
            var index = _INDEX_ORDER[j];
            var string;
            if (index < _INDEXES.length)
              string = row[index];
            else
              string = stringifyArrayEndChar(row[index], " ");
            var lastCharWasSpace = true;
            var start0 = 0;
            var end = 0;
            var start1 = 0;
            for (var k = 0; k < string.length; ++k) {
              var char = string[k];
              var charIsSpace = (char == " ");
              var endOfString = (k + 1 == string.length);
              if (lastCharWasSpace && !charIsSpace) { //Beginning of word
                start0 = start1;
                start1 = k;
              }
              else if ((!lastCharWasSpace && charIsSpace) || endOfString) { //Space at end of word or end of string
                if (endOfString)
                  end = k + 1;
                else
                  end = k;
                var singleWord = string.substring(start1, end);
                var singleWordStandard = standardizeString(singleWord);
                if (!_WORDS_TO_IGNORE.includes(singleWordStandard) && singleWordStandard.length > 1) {
                  if (singleWordsToOccurences.has(singleWordStandard)) {
                    var value = singleWordsToOccurences.get(singleWordStandard)
                    value[0][0] = value[0][0] + 1;
                    if (!value[2].includes(i))
                      value[2].push(i);
                    if (!value[1].includes(singleWord)) {
                      value[1].push(singleWord);
                    }
                  }
                  else {
                    // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                    var color = getColorFromString(singleWordStandard);
                    var value = [[1, color], [singleWord], [i]];
                    singleWordsToOccurences.set(singleWordStandard, value);
                  }
                }
                if (start0 != start1) {
                  var doubleWord = string.substring(start0, end);
                  var doubleWordStandard = standardizeString(doubleWord);
                  var doubleWordSplit = doubleWordStandard.split(" ");
                  if (!_WORDS_TO_IGNORE.includes(doubleWordSplit[0]) && !_WORDS_TO_IGNORE.includes(doubleWordSplit[1]) && doubleWordStandard.length > 3) {
                    if (doubleWordsToOccurences.has(doubleWordStandard)) {
                      var value = doubleWordsToOccurences.get(doubleWordStandard)
                      value[0][0] = value[0][0] + 1;
                      if (!value[2].includes(i))
                        value[2].push(i);
                      if (!value[1].includes(doubleWord)) {
                        value[1].push(doubleWord);
                      }
                    }
                    else {
                      // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                      var color = getColorFromString(doubleWordStandard);
                      var value = [[1, color, doubleWordSplit[0], doubleWordSplit[1]], [doubleWord], [i]];
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
          if (value[0][0] >= _minRepititions && highlightSimilarWords) {
            var finalValue = [[key, value[0][1]], value[1], value[2]];
            wordsToSort.push(finalValue);
          }
        }

        for (let [key, value] of singleWordsToOccurences) {
          if (value[0][0] >= _minRepititions && highlightSimilarWords) {
            var finalValue = [[key, value[0][1]], value[1], value[2]];
            wordsToSort.push(finalValue);
          }
        }

        wordsToSort.sort(COMPARE_0_0);
        var similarHTML = "";
        var totalRows = 0;
        _indexesSimilarStrings = [];
        _SIMILAR_STRINGS_ROW_IDS = [];
        for (var i = 0; i < wordsToSort.length; ++i) {
          var wordData = wordsToSort[i];
          var resultsLabel = "results";
          if (wordData[2].length == 1)
            resultsLabel = "result";
          similarHTML += "<div class='clickable' onclick='toggle_similar_string_table(" + i + ");'><p><span id='similar_string_expander_" + i + "'>+</span> " + wordData[1][0] + " (" + wordData[2].length + " " + resultsLabel + ")</p></div>";

          similarHTML += "<table class='clickable' style='margin-left: 20px; display: none;' id='similar_string_table_" + i + "'><tr>";
          for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
            var index = _INDEX_ORDER[j];
            var bgcolor = "inherit";
            if (_contentSortedIndexes.includes(index) && _search_results_resorted)
              bgcolor = getSortColor(index);
            similarHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + ";'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
          }
          similarHTML += "</tr>";
          for (var j = 0; j < wordData[2].length; ++j) {
            similarHTML += "<tr id='similar_string_row_" + totalRows + "'>";
            var rownum = wordData[2][j];
            _SIMILAR_STRINGS_ROW_IDS.push(array_trimmed[rownum][array_trimmed[rownum].length - 1]);
            _indexesSimilarStrings.push(_searchResults_ContentIndexes[rownum]);
            for (var k = 0; k < INDEXES_CONCAT.length; ++k) {
              var index = _INDEX_ORDER[k];
              var termToHighlightList = [];
              var preHTML_List = [];
              var postHTML_List = [];

              var string;
              if (index < _INDEXES.length) //Regular Field
                string = array_trimmed[rownum][index];
              else //Memo field, Array of Strings
                string = stringifyArrayEndChar(array_trimmed[rownum][index], " ");

              var color = wordData[0][1];
              var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
              for (var v = 0; v < wordData[1].length; ++v) {
                // if(getRegexSafeSearchTerm(wordData[1][v]).length <= 1)
                //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(wordData[1][v]) + "|");
                termToHighlightList.push(wordData[1][v]);
                preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                postHTML_List.push("</span>");
              }
              string = highlightString(string, termToHighlightList, preHTML_List, postHTML_List);
              var id2 = "similar_string_cell_" + totalRows + "_" + k;
              similarHTML += "<td id='" + id2 + "' onclick='onCellClick(" + totalRows + "," + k + ",\"" + id2 + "\"," + _TABLE_SIMILAR_STRINGS + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + array_trimmed[rownum][1] + "</span>" + string + "</div></td>";
            }

            similarHTML += "</tr>";
            ++totalRows;
          }
          similarHTML += "</table>";
        }
        document.getElementById("similar_string_expander").style.display = "block";
        document.getElementById("similar_strings_div").innerHTML = similarHTML;
      } //END Highlight similar words
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
      if (highlightSimilarWords) {
        var typeHighlightBGSingle = new Map();
        for (let [key1, value1] of singleWordsToOccurences) {
          if (value1[0][0] >= _minRepititions && highlightSimilarWords)
            for (let [key2, value2] of doubleWordsToOccurences) {
              if (value2[0][0] >= _minRepititions && highlightSimilarWords)
                typeHighlightBGSingle.set(key1, (key1 != value2[0][2] && key1 != value2[0][3])); //Single word is not in a double word pair
            }
        }
      }

      for (var i = 0; i < array_trimmed.length; ++i) {
        for (var j = 1; j < array_trimmed[i].length; ++j) {
          var index = _INDEX_ORDER[j - 1];
          var termToHighlightList = [];
          var preHTML_List = [];
          var postHTML_List = [];
          //Highlight search terms
          for (var s = 0; s < actualSearchStrings.length; ++s) {
            // if(getRegexSafeSearchTerm(actualSearchStrings[s]).length <= 1)
            //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(actualSearchStrings[s]) + "|");
            termToHighlightList.push(actualSearchStrings[s]);
            preHTML_List.push("<span style='background: yellow; color: black;'><b>");
            postHTML_List.push("</b></span>");
          }

          //Highlight double words
          if (highlightSimilarWords) {
            for (let [key, value] of doubleWordsToOccurences) {
              if (value[0][0] >= _minRepititions && highlightSimilarWords) {
                var color = value[0][1];
                var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
                for (var v = 0; v < value[1].length; ++v) {
                  // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                  //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                  termToHighlightList.push(value[1][v]);
                  preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                  postHTML_List.push("</span>");
                }
              }
            }
          }

          //Highlight single words
          if (highlightSimilarWords) {
            for (let [key, value] of singleWordsToOccurences) {
              if (value[0][0] >= _minRepititions && highlightSimilarWords) {
                var color = value[0][1];
                var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
                for (var v = 0; v < value[1].length; ++v) {
                  // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                  //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                  termToHighlightList.push(value[1][v]);
                  if (typeHighlightBGSingle.get(key)) {
                    preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                    postHTML_List.push("</span>");
                  }
                  else {
                    preHTML_List.push("<span style='border-bottom: 3px solid " + bgColor + "'>");
                    postHTML_List.push("</span>");
                  }
                }
              }
            }
          }

          if (index < _INDEXES.length) {
            array_trimmed[i][index] = highlightString(array_trimmed[i][index], termToHighlightList, preHTML_List, postHTML_List);
          }
          else {
            array_trimmed[i][index] = highlightString(stringifyArrayEndChar(array_trimmed[i][index], " "), termToHighlightList, preHTML_List, postHTML_List);
          }
        }
      }
    } //END shouldHighlight

    //Generate search results table-----------------------------------------------------------------
    _table_HTML_0 = "<p style='display: inline;'>Showing " + _indexesSearchResults.length + " of " + _searchResults.length + " Result(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      "<p style='display: inline; background-color: #70A2FF;'>Table Si<span style='color: white;'>z</span>e</p>&nbsp;&nbsp;" +
      "<input id=\"search_results_max\" type=\"number\" value=" + _searchResultsMax + " min=\"0\" onchange='showSearchResultsMax();' onfocus='showSearchResultsMax();'></input>" +
      "<button id=\"save_search_results_max\" onclick=\"updateSearchResultsMax();\" style=\"display: none;\">Save</button>" +
      // "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_search_results_jump_top'    onclick='searchResultsJumpToEdge(0);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>T</span>op</button>" + 
      // "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_search_results_jump_bottom' onclick='searchResultsJumpToEdge(1);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>B</span>ottom</button>" + 
      "<p style='background-color: #70A2FF;'>S<span style='color: white;'>e</span>arch Results</p>" +
      "<table id='search_results_table_table' class='clickable'><tr>";

    // //DEBUG
    // _table_HTML_0 += "<th>Ranking</th>";
    // //DEBUG

    for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
      var index = _INDEX_ORDER[i];
      var bgcolor = "inherit";
      if (_contentSortedIndexes.includes(index) && _search_results_resorted)
        bgcolor = getSortColor(index);
      _table_HTML_0 += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + "; position: sticky; top: " + _top_bar_height + "; z-index: 4;'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
    }
    _table_HTML_0 += "</tr>";

    _SEARCH_RESULTS_ROW_IDS = [];
    for (var i = 0; i < array_trimmed.length; ++i)
      _SEARCH_RESULTS_ROW_IDS.push(array_trimmed[i][array_trimmed[i].length - 1]);
    var shouldAddChildPartLinks = document.getElementById("search_add_child_part_links").checked;
    if (!shouldAddChildPartLinks) {
      for (var i = 0; i < array_trimmed.length; ++i) {
        _table_HTML_0 += "<tr id='search_results_row_" + i + "'>";
        // _table_HTML_0 += "<td>" + rankings[i] + "</td>";
        for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
          var index = _INDEX_ORDER[j];
          var cellContent = array_trimmed[i][index];

          var id2 = "search_results_cell_" + i + "_" + j;
          _table_HTML_0 +=
            "<td onmouseover='recordViewIconMouseOver(\"search_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"search_" + i + "_" + j + "\");' id='" + id2 + "' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + _TABLE_SEARCH_RESULTS + ");'>" +
            "<div class='tooltip'><span class='tooltiptext' style='border: 3px solid black; background-color: white; color: black;'>"
            + INDEXES_CONCAT[index] + " for:<br><br>" + array_trimmed[i][_DESCRIP1] + "</span>" + cellContent +
            "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_search_" + i + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + array_trimmed[i][array_trimmed[i].length - 1] + "\");'></div></td>"
            ;
        }
        _table_HTML_0 += "</tr>";
      }
      finishPopulateSearchResults(_table_HTML_0);
    }
    else //Should add child part links
    {
      NUM_ARRAY_TRIMMED_PER_THREAD = Math.ceil(array_trimmed.length / NUM_ADD_CHILD_PART_HTML_THREADS);
      var indexStart = 0;
      _snackbar_update_percent_child_part_html_added = [];
      _add_child_part_html_threads_recieved = [];
      _add_child_part_html_results = [];
      for (var i = 0; i < NUM_ADD_CHILD_PART_HTML_THREADS; ++i) {
        _add_child_part_html_threads_recieved.push(false);
        _add_child_part_html_results.push("");
        _snackbar_update_percent_child_part_html_added.push(0);
      }
      for (var i = 0; i < NUM_ADD_CHILD_PART_HTML_THREADS; ++i) {
        var array_trimmed_slice = [];
        var indexEnd = indexStart + NUM_ARRAY_TRIMMED_PER_THREAD;
        var orig_indexStart = indexStart;
        for (var j = indexStart; j < indexEnd && j < array_trimmed.length; ++j) {
          array_trimmed_slice.push(array_trimmed[j]);
        }
        indexStart = indexEnd;

        var childPartButtonWorker = new Worker('workers/WORKER_add_child_part_button_html.js');
        _adding_child_part_links = true;
        childPartButtonWorker.postMessage([_EXTRA_DB, _EXTRA_DB_COMMENTS_PREFIXES, _content_extra, array_trimmed_slice, INDEXES_CONCAT, _DESCRIP1, _INDEX_ORDER, _DESCRIP2, _COMMENTS, _TABLE_SEARCH_RESULTS, _CHILD_PART_LINKS_CACHE, _EXTRA_DB_FIELDS, _AKA_GLOBAL, _extradb_link_index_cache, orig_indexStart, i /*, /*DEBUG rankings DEBUG*/]);

        childPartButtonWorker.onmessage = function (e) {
          if (e.data[0] == 1) { //Finished
            _add_child_part_html_results[e.data[3]] = e.data[1];
            // _table_HTML_0 += e.data[1];
            _CHILD_PART_LINKS_CACHE = new Map([..._CHILD_PART_LINKS_CACHE, ...e.data[2]]); //Merge old with new, new map with same entries overwrites old one
            _add_child_part_html_threads_recieved[e.data[3]] = true;
            var searchFinished = true;
            for (var i = 0; i < NUM_ADD_CHILD_PART_HTML_THREADS; ++i) {
              if (!_add_child_part_html_threads_recieved[i]) {
                searchFinished = false;
                break;
              }
            }
            if (searchFinished) {
              for (var i = 0; i < _add_child_part_html_results.length; ++i)
                _table_HTML_0 += _add_child_part_html_results[i];
              finishPopulateSearchResults(_table_HTML_0);
              _adding_child_part_links = false;
            }
          }
          else //Percent status update message
          {
            _snackbar_update_percent_child_part_html_added[e.data[2]] = e.data[1];
            var progress = 0;
            for (var i = 0; i < _snackbar_update_percent_child_part_html_added.length; ++i)
              progress += _snackbar_update_percent_child_part_html_added[i];
            progress /= _snackbar_update_percent_child_part_html_added.length;
            showSnackbar("Adding Child Part Links... " + Math.floor(progress * 100) + "%", 3000);
            // document.getElementById("message").innerHTML = "<br><br><br><p>Adding Child Part Links... " + Math.floor(e.data[1] * 100) + "%</p>";
          }
        }//END onMessage from PartChildButton worker
      }
    }//END shouldAddChildPartLinks
  } // (!_adding_child_part_links && _searchResults.length > 0)
} //END populateSearchResults

function finishPopulateSearchResults(_table_HTML_0) {
  _table_HTML_0 += "</table>";
  document.getElementById("search_results_table_div").innerHTML = _table_HTML_0;

  //Make memo fields expandable HTML
  var table1 = document.getElementById("search_results_table_table");
  if (table1 != null) {
    var rows = table1.rows;
    for (var i = 1; i < rows.length; ++i) //Only rows after header (index 0)
    {
      var cells = rows[i].cells;
      for (var j = 0; j < cells.length; ++j) {
        if (_INDEX_ORDER[j] >= _INDEXES.length) {
          cells[j].innerHTML = getExpandableHTML(null, (i + "_" + j), 100, INDEX_WIDTHS_CONCAT[_INDEX_ORDER[j]], cells[j].innerHTML)
          // getExpandableHTML(_content[i][index], (i + "_" + j), 100, INDEX_WIDTHS_CONCAT[index])
        }
      }
    }
  }
  //Set state of divs-------------------------------------------------------
  // document.getElementById("search_results_expander").style.display = "block";
  // toggle_search_results(1);
  document.getElementById("search_results_div").style.display = "";

  if (_select_top_row) {
    var cell = getCell(0, _selectedCell, _TABLE_SEARCH_RESULTS);
    if (cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
  else if (_select_bottom_row) {
    var cell = getCell(array_trimmed.length - 1, _selectedCell, _TABLE_SEARCH_RESULTS);
    if (cell != null)
      onCellClick(array_trimmed.length - 1, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
  else if (_row_to_select >= 0) {
    var cell = getCell(_row_to_select, _selectedCell, _TABLE_SEARCH_RESULTS);
    if (cell != null)
      onCellClick(_row_to_select, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
}

function toggle_similar_strings() {
  if (document.getElementById("similar_strings_div").style.display == "none") {
    document.getElementById("similar_strings_div").style.display = "block";
    document.getElementById("similar_strings_expander_icon").innerHTML = "-";
  }
  else {
    document.getElementById("similar_strings_div").style.display = "none";
    document.getElementById("similar_strings_expander_icon").innerHTML = "+";
  }
}

// function toggle_search_results(state) { //0 hidden, 1 shown, 2 toggle
//   if (state == 0) {
//     document.getElementById("search_results_div").style.display = "none";
//     document.getElementById("search_results_expander_icon").innerHTML = "+";
//   }
//   else if (state == 1) {
//     document.getElementById("search_results_div").style.display = "block";
//     document.getElementById("search_results_expander_icon").innerHTML = "-";
//   }
//   else {
//     if (document.getElementById("search_results_div").style.display == "none") {
//       document.getElementById("search_results_div").style.display = "block";
//       document.getElementById("search_results_expander_icon").innerHTML = "-";
//     }
//     else {
//       document.getElementById("search_results_div").style.display = "none";
//       document.getElementById("search_results_expander_icon").innerHTML = "+";
//     }
//   }
// }

function toggle_similar_string_table(id) {
  var tableID = "similar_string_table_" + id;
  var expanderID = "similar_string_expander_" + id;
  if (document.getElementById(tableID).style.display == "none") {
    document.getElementById(tableID).style.display = "block";
    document.getElementById(expanderID).innerHTML = "-";
  }
  else {
    document.getElementById(tableID).style.display = "none";
    document.getElementById(expanderID).innerHTML = "+";
  }
}

function setRadioColumn() {
  if (document.getElementById("radio_columns_specific").checked) {
    document.getElementById("search_any_input_div").style.display = "none";
    document.getElementById("radio_columns_div").style.display = "block";
    document.getElementById("radio_columns_all_none_buttons_div").style.display = "";
  }
  else {
    document.getElementById("search_any_input_div").style.display = "block";
    document.getElementById("radio_columns_div").style.display = "none";
    document.getElementById("radio_columns_all_none_buttons_div").style.display = "none";
  }
  var ele = document.getElementById("search_input_" + _INDEX_ORDER[0]);
  if (ele != null && document.getElementById("radio_columns_div").style.display != "none") {
    ele.focus();
    ele.select();
  }
}

function setRadioColumnsChecked(bool) {
  var total_index_length = _INDEXES.length + _MEMO_INDEXES.length;
  for (var i = 0; i < total_index_length; ++i) {
    document.getElementById("column_checkbox_" + i).checked = bool;
    if (!bool)
      document.getElementById("search_input_" + i).value = "";
  }

}

function onSearchInputChanged(index) {
  if (document.getElementById("search_input_" + index).value == "")
    document.getElementById("column_checkbox_" + index).checked = false;
  else
    document.getElementById("column_checkbox_" + index).checked = true;
}

function show_more_column_checkboxes(visible) {
  if (visible) {
    document.getElementById("show_more_column_checkboxes").style.display = "none";
    document.getElementById("radio_columns_checkboxes_more").style.display = "block";
  }
  else {
    document.getElementById("show_more_column_checkboxes").style.display = "block";
    document.getElementById("radio_columns_checkboxes_more").style.display = "none";
  }
}

function updateRecordBrowserMax() {
  var max = Number(document.getElementById("record_browser_max").value);
  document.getElementById("save_record_browser_max").style.display = "none";
  if (max > 0) {
    _recordBrowserMax = max;
    populateRecordBrowser(_currentRecordBrowserStartIndex, false);
  }
  else {
    document.getElementById("record_browser_max").value = 1;
  }
}

function updateSearchResultsMax() {
  var max = Number(document.getElementById("search_results_max").value);
  document.getElementById("save_search_results_max").style.display = "none";
  if (max > 0) {
    _searchResultsMax = max;
    populateSearchResults(_currentSearchResultsStartIndex, false, false, -1);
  }
  else {
    document.getElementById("search_results_max").value = 1;
  }
}

function clearSearchResults() {
  document.getElementById("radio_columns_any").checked = true;
  document.getElementById("search_input").value = "";
  setRadioColumn();
  search_query(true);
}

function searchResultsJumpToEdge(end) {
  var index = 0;
  if (end == 0)
    populateSearchResults(0, true, false, -1);
  else {
    populateSearchResults(_searchResults.length - 1, false, true, -1);
  }
}


function showSearchResultsMax() {
  document.getElementById('save_search_results_max').style.display = 'inline';
  deselectTable();
}

function setMinRepititions() {
  _minRepititions = Number(document.getElementById("repititions_min").value);
  deselectTable();
}

function clearSearchPartNumInputs() {
  var ele = document.getElementById("search_partnum_any_input");
  if (document.activeElement == null || document.activeElement.id != ele.id) {
    ele.value = "";
  }
  for (var i = 0; i < _EXTRA_DB.length; ++i) {
    ele = document.getElementById("search_partnum_input_" + i);
    if (document.activeElement == null || document.activeElement.id != ele.id) {
      ele.value = "";
    }
  }
}

function clearSearchStandardInputs() {
  document.getElementById("search_input").value = "";
  for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
    document.getElementById("search_input_" + i).value = "";
  }
}

function focusSearchInput(event) {
  if (document.getElementById("radio_columns_any").checked) {
    document.getElementById("search_input").focus();
    event.preventDefault();
  }
  else {
    var ele1 = document.getElementById("search_input_" + _INDEX_ORDER[0]);
    if (ele1 != null && document.getElementById("radio_columns_div").style.display != "none") {
      ele1.focus();
      ele1.select();
    }
    event.preventDefault();
  }
}