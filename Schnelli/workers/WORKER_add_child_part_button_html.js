var _content_extra = null;
var _EXTRA_DB = null;
var _EXTRA_DB_COMMENTS_PREFIXES = null;
var _CHILD_PART_LINKS_CACHE = null;
var _EXTRA_DB_FIELDS = null;
var _AKA_GLOBAL = null;
var _extradb_link_index_cache = null;
var _ROW_OFFSET = 0;

onmessage = function (e) {
  _EXTRA_DB = e.data[0];
  _EXTRA_DB_COMMENTS_PREFIXES = e.data[1];
  _content_extra = e.data[2];
  var array_trimmed = e.data[3];
  var INDEXES_CONCAT = e.data[4];
  var _DESCRIP1 = e.data[5];
  var _INDEX_ORDER = e.data[6];
  var _DESCRIP2 = e.data[7];
  var _COMMENTS = e.data[8];
  var _TABLE_SEARCH_RESULTS = e.data[9];
  _CHILD_PART_LINKS_CACHE = e.data[10];
  _EXTRA_DB_FIELDS = e.data[11];
  _AKA_GLOBAL = e.data[12];
  _extradb_link_index_cache = e.data[13];
  var _ROW_OFFSET = e.data[14];
  var THREAD_ID = e.data[15];
  // var rankings = e.data[16];

  var _table_HTML_0 = "";
  var numLinkCells = array_trimmed.length * 2; //_DESCRIP2 and _COMMENTS
  var numLinkCellsProcessed = 0;
  for (var i = 0; i < array_trimmed.length; ++i) {
    var i2 = i + _ROW_OFFSET;
    _table_HTML_0 += "<tr id='search_results_row_" + i2 + "'>";
    // _table_HTML_0 += "<td>" + rankings[i] + "</td>";
    for (var j = 0; j < INDEXES_CONCAT.length; ++j) {
      var index = _INDEX_ORDER[j];
      var cellContent = array_trimmed[i][index];

      if (index == _DESCRIP2 || index == _COMMENTS) {
        cellContent = getPartChildButtonHTML(cellContent);
        ++numLinkCellsProcessed;
        if (numLinkCells > 0) {
          var status = [0, numLinkCellsProcessed / numLinkCells, THREAD_ID];
          postMessage(status);
        }
      }

      var id2 = "search_results_cell_" + i2 + "_" + j;
      _table_HTML_0 +=
        "<td onmouseover='recordViewIconMouseOver(\"search_" + i2 + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"search_" + i2 + "_" + j + "\");' id='" + id2 + "' onclick='onCellClick(" + i2 + "," + j + ",\"" + id2 + "\"," + _TABLE_SEARCH_RESULTS + ");'>" +
        "<div class='tooltip'><span class='tooltiptext' style='border: 3px solid black; background-color: white; color: black;'>"
        + INDEXES_CONCAT[index] + " for:<br><br>" + array_trimmed[i][_DESCRIP1] + "</span>" + cellContent +
        "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_search_" + i2 + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + array_trimmed[i][array_trimmed[i].length - 1] + "\");'></div></td>";
    }
    _table_HTML_0 += "</tr>";
  }
  var results = [1, _table_HTML_0, _CHILD_PART_LINKS_CACHE, THREAD_ID];
  postMessage(results);

  _EXTRA_DB = null; //CLEAR DATA, Worker thread doesn't clear it very fast
  _EXTRA_DB_COMMENTS_PREFIXES = null;
  _content_extra = null;
  array_trimmed = null;
  INDEXES_CONCAT = null;
  _DESCRIP1 = null;
  _INDEX_ORDER = null;
  _DESCRIP2 = null;
  _COMMENTS = null;
  _TABLE_SEARCH_RESULTS = null;
  _CHILD_PART_LINKS_CACHE = null;
  _EXTRA_DB_FIELDS = null;
  _AKA_GLOBAL = null;
  _extradb_link_index_cache = null;
  _ROW_OFFSET = null;
  THREAD_ID = null;
}

function getExtraDBLinkIndex(db, pn) {
  if (pn.length > 0) {
    if (_extradb_link_index_cache[db].has(pn)) {
      var index = _extradb_link_index_cache[db].get(pn);
      if (_content_extra[db].length > index && String(_content_extra[db][index][0].PN) == pn) //Only include exact match PN in cache to ensure it doesn't load inferior match if indexes are changed
      {
        return index;
      }

      _extradb_link_index_cache[db].delete(pn); //Cache invalid
    }

    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match PN
    {
      if (String(_content_extra[db][i][0].PN) == pn) {
        _extradb_link_index_cache[db].set(pn, i);
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0].PN)) == pn1) //General match PN
      {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match AKA
    {
      if (String(_content_extra[db][i][0][_EXTRA_DB_FIELDS[db][_AKA_GLOBAL]]) == pn) {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0][_EXTRA_DB_FIELDS[db][_AKA_GLOBAL]])) == pn1) //General match AKA
      {
        return i;
      }
    }
  }
  return null;
}

function getStandardPNString(str1) {
  var str = String(str1);
  var modified = true;
  while (modified) {
    var orig_length = str.length;
    // str = removeStartingZeroes(str);
    str = removeEndTilde(str);
    str = removeEndArrow(str);
    str = removeEndExclaim(str);
    str = removeEndSemicolon(str);
    modified = (orig_length != str.length);
  }
  return str.toLowerCase();
}

function removeEndTilde(str1) {
  var str = String(str1);
  if (str.length > 0 && str[str.length - 1] == "~")
    str = str.substring(0, str.length - 1);
  return str;
}

function removeEndArrow(str1) {
  var str = String(str1);
  if (str.length > 1 && str[str.length - 2] == "-" && str[str.length - 1] == ">")
    str = str.substring(0, str.length - 2);
  return str;
}

function removeEndExclaim(str1) {
  var str = String(str1);
  if (str.length > 0 && str[str.length - 1] == "!")
    str = str.substring(0, str.length - 1);
  return str;
}

function removeEndSemicolon(str1) {
  var str = String(str1);
  if (str.length > 0 && str[str.length - 1] == ";")
    str = str.substring(0, str.length - 1);
  return str;
}

function getRegexSafeSearchTerm(str1) {
  var str = String(str1);
  //Remove non numbers and letters and spaces
  var str2 = str.replace(/\\/g, "\\\\");
  str2 = str2.replace(/\)/g, "\\)");
  str2 = str2.replace(/\(/g, "\\(");
  str2 = str2.replace(/\+/g, "\\+");
  str2 = str2.replace(/\-/g, "\\-");
  str2 = str2.replace(/\?/g, "\\?");
  str2 = str2.replace(/\|/g, "\\|");
  str2 = str2.replace(/\!/g, "\\!");
  str2 = str2.replace(/\//g, "\\/");
  str2 = str2.replace(/\*/g, "\\*");
  str2 = str2.replace(/\,/g, "\\,");
  str2 = str2.replace(/\./g, "\\.");
  str2 = str2.replace(/\^/g, "\\^");
  str2 = str2.replace(/\$/g, "\\$");
  str2 = str2.replace(/\[/g, "\\[");
  str2 = str2.replace(/\{/g, "\\{");
  return str2;
}

function getPartChildButtonHTML(cellContent) {
  let match;
  var html0 = cellContent.replace(/(<([^>]+)>)/ig, ''); //Strip HTML tags
  html0 = html0.replace(/&nbsp;/g, ' '); //Replace &nbsp; tags with spaces
  html0 = html0.replace(/ {2,}/g, ' '); //Remove extra spaces
  var htmls = html0.split(" ");
  var matchedWords = [];
  for (var i = 0; i < htmls.length; ++i) {
    var word = htmls[i];
    var cacheOBJ = null;
    if (_CHILD_PART_LINKS_CACHE.has(word))
      cacheOBJ = _CHILD_PART_LINKS_CACHE.get(word);
    var buttonAdded = false;
    if (cacheOBJ == null) {
      if (!matchedWords.includes(word)) {
        matchedWords.push(word);
        if (word.length > 1 && word[1] == ":") //PN with B: C: etc prefix before it
        {
          var prefix_index = -1;
          for (var j = 0; j < _EXTRA_DB_COMMENTS_PREFIXES.length; ++j) {
            if (word[0] == _EXTRA_DB_COMMENTS_PREFIXES[j]) {
              prefix_index = j;
            }
          }
          if (prefix_index != -1) {
            var extraDBIndex = getExtraDBLinkIndex(prefix_index, word.substring(2, word.length));
            if (extraDBIndex != null) {
              var regexp = new RegExp(getRegexSafeSearchTerm(word), "g");
              var indexesToAddSpan = [];
              while ((match = regexp.exec(cellContent)) !== null) {
                var start = match.index;
                var end = regexp.lastIndex;
                if ((start == 0 || cellContent[start - 1] == ">" || cellContent[start - 1] == " ") && //Ensures word has no spaces
                  (end == cellContent.length || cellContent[end] == "<" || cellContent[end] == " ")) {
                  indexesToAddSpan.push([start, end]);
                }
              }
              if (indexesToAddSpan.length > 0) {
                var obj = new Object();
                obj.buttonAdded = true;
                obj.searchterm = word.substring(2, word.length);
                obj.prefix_index = prefix_index;
                _CHILD_PART_LINKS_CACHE.set(word, obj);
              }
              for (var j = indexesToAddSpan.length - 1; j >= 0; --j) {
                buttonAdded = true;
                var start = indexesToAddSpan[j][0];
                var end = indexesToAddSpan[j][1];
                cellContent = cellContent.substring(0, end) + "</u></span>" + cellContent.substring(end, cellContent.length);
                // html1 = html1.substring(0, start) + "<span style='color: blue;' onclick='jumpToChildPartFromRecordView(" + prefix_index + "," + extraDBIndex + ");'><u>" + html1.substring(start, html1.length);
                cellContent = cellContent.substring(0, start) + "<span style='color: blue;' onclick='searchChildPart(" + prefix_index + ",\"" + word.substring(2, word.length) + "\");'><u>" + cellContent.substring(start, cellContent.length);
              }
            }
          }
        }

        if (word.length > 1 && !buttonAdded) //PN without B: C: etc prefix before it
        {
          var extraDBIndex = null;
          for (var j = 0; j < _EXTRA_DB.length; ++j) {
            extraDBIndex = getExtraDBLinkIndex(j, word);
            if (extraDBIndex != null)
              break;
          }
          if (extraDBIndex != null) {
            var regexp = new RegExp(getRegexSafeSearchTerm(word), "g");
            var indexesToAddSpan = [];
            while ((match = regexp.exec(cellContent)) !== null) {
              var start = match.index;
              var end = regexp.lastIndex;
              if ((start == 0 || cellContent[start - 1] == ">" || cellContent[start - 1] == " ") && //Ensures word has no spaces
                (end == cellContent.length || cellContent[end] == "<" || cellContent[end] == " ")) {
                indexesToAddSpan.push([start, end]);
              }
            }
            if (indexesToAddSpan.length > 0) {
              var obj = new Object();
              obj.buttonAdded = true;
              obj.searchterm = word;
              obj.prefix_index = _EXTRA_DB.length;
              _CHILD_PART_LINKS_CACHE.set(word, obj);
            }
            for (var j = indexesToAddSpan.length - 1; j >= 0; --j) {
              buttonAdded = true;
              var start = indexesToAddSpan[j][0];
              var end = indexesToAddSpan[j][1];
              cellContent = cellContent.substring(0, end) + "</u></span>" + cellContent.substring(end, cellContent.length);
              // html1 = html1.substring(0, start) + "<span style='color: blue;' onclick='jumpToChildPartFromRecordView(" + prefix_index + "," + extraDBIndex + ");'><u>" + html1.substring(start, html1.length);
              cellContent = cellContent.substring(0, start) + "<span style='color: blue;' onclick='searchChildPart(" + _EXTRA_DB.length + ",\"" + word + "\");'><u>" + cellContent.substring(start, cellContent.length);
            }
          }
        }
      }
      if (!buttonAdded) {
        var obj = new Object();
        obj.buttonAdded = false;
        obj.searchterm = word;
        obj.prefix_index = -1;
        _CHILD_PART_LINKS_CACHE.set(word, obj);
      }
    }
    else //Cacheobj found
    {
      if (cacheOBJ.buttonAdded) {
        var regexp = new RegExp(getRegexSafeSearchTerm(word), "g");
        var indexesToAddSpan = [];
        while ((match = regexp.exec(cellContent)) !== null) {
          var start = match.index;
          var end = regexp.lastIndex;
          if ((start == 0 || cellContent[start - 1] == ">" || cellContent[start - 1] == " ") && //Ensures word has no spaces
            (end == cellContent.length || cellContent[end] == "<" || cellContent[end] == " ")) {
            indexesToAddSpan.push([start, end]);
          }
        }
        for (var j = indexesToAddSpan.length - 1; j >= 0; --j) {
          buttonAdded = true;
          var start = indexesToAddSpan[j][0];
          var end = indexesToAddSpan[j][1];
          cellContent = cellContent.substring(0, end) + "</u></span>" + cellContent.substring(end, cellContent.length);
          // html1 = html1.substring(0, start) + "<span style='color: blue;' onclick='jumpToChildPartFromRecordView(" + prefix_index + "," + extraDBIndex + ");'><u>" + html1.substring(start, html1.length);
          cellContent = cellContent.substring(0, start) + "<span style='color: blue;' onclick='searchChildPart(" + cacheOBJ.prefix_index + ",\"" + cacheOBJ.searchterm + "\");'><u>" + cellContent.substring(start, cellContent.length);
        }
      }
    }
  }
  return cellContent;
}

  // function searchChildPartLinksCache(word)
  // {
  //   for(var i = 0; i < _CHILD_PART_LINKS_CACHE.length; ++i)
  //   {
  //     if(_CHILD_PART_LINKS_CACHE[i].word == word)
  //     {
  //       return _CHILD_PART_LINKS_CACHE[i];
  //     }
  //   }
  //   return null;
  // }