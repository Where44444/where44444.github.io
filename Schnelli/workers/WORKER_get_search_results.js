onmessage = function(e) {
    var searchstring_any = e.data[0];
    var content_standard = e.data[1];
    var content = e.data[2];
    var columnsToSearch = e.data[3];
    var anyChecked = e.data[4];
    var searchstring_specific = e.data[5];
    var indexes = e.data[6];
    var currentResultsIndexesIDs = e.data[7];
    var _DESCRIP1 = e.data[8];
    var _DESCRIP2 = e.data[9];
    var THREAD_ID = e.data[10];
    var _ROW_OFFSET = e.data[11];

    //ANY
    var searchstring_any_standard = standardizeString(searchstring_any);
    var searchstring_any_standard_regexsafe = standardizeString(searchstring_any_standard);
    var searchstring_any_regexsafe = getRegexSafeSearchTerm(searchstring_any.toLowerCase());
    var searchstrings_any = removeExtraSpaces(searchstring_any).toLowerCase().split(" ");
    var searchstrings_any_standard = [];
    
    for(var i = 0; i < searchstrings_any.length; ++i)
        searchstrings_any_standard.push(standardizeString(searchstrings_any[i]));
        
    var searchstrings_any_regexsafe = [];
    for(var i = 0; i < searchstrings_any.length; ++i)
        searchstrings_any_regexsafe.push(getRegexSafeSearchTerm(searchstrings_any[i]));

    var standard_searchstrings_any_regexsafe = [];
    for(var i = 0; i < searchstrings_any_standard.length; ++i)
        standard_searchstrings_any_regexsafe.push(getRegexSafeSearchTerm(searchstrings_any_standard[i]));
        
    //SPECIFIC
    var searchstring_specific_standard = [];
    var searchstring_specific_regexsafe = [];
    var searchstring_specific_standard_regexsafe = [];
    var searchstrings_specific = [];
    var searchstrings_specific_standard = [];
    
    for(var i = 0; i < searchstring_specific.length; ++i)
    {
        searchstrings_specific.push(removeExtraSpaces(searchstring_specific[i]).toLowerCase().split(" "));
        searchstring_specific_standard.push(standardizeString(searchstring_specific[i]));
        searchstring_specific_regexsafe.push(getRegexSafeSearchTerm(searchstring_specific[i].toLowerCase()));
        searchstring_specific_standard_regexsafe.push(getRegexSafeSearchTerm(searchstring_specific_standard[i]));

        searchstrings_specific_standard.push([]);
        for(var j = 0; j < searchstrings_specific[i].length; ++j)
            searchstrings_specific_standard[i].push(standardizeString(searchstrings_specific[i][j]));
    }
    
    var searchstrings_specific_regexsafe = [];
    var standard_searchstrings_specific_regexsafe = [];
    for(var i = 0; i < searchstrings_specific.length; ++i)
    {
        searchstrings_specific_regexsafe.push([]);
        for(var j = 0; j < searchstrings_specific[i].length; ++j)
        searchstrings_specific_regexsafe[i].push(getRegexSafeSearchTerm(searchstrings_specific[i][j]));
        
        standard_searchstrings_specific_regexsafe.push([]);
        for(var j = 0; j < searchstrings_specific_standard[i].length; ++j)
            standard_searchstrings_specific_regexsafe[i].push(getRegexSafeSearchTerm(searchstrings_specific_standard[i][j]));
    }
        

        
    var RANKING_STANDARD =                          1;    
    var RANKING_EXACT =                           100;    
    var RANKING_ALL_IN_CELL_STANDARD =          10000;    
    var RANKING_ALL_IN_CELL_EXACT =           1000000;    
    var RANKING_WHOLE_STANDARD =            100000000;    
    var RANKING_DESCRIPS =                  100000000; //Cheese the system a little here to put more value on matches found in either DESCRIP1 or DESCRIP2 fields
    var RANKING_WHOLE_EXACT =             10000000000;    
    var RANKING_SPACES_BETWEEN_PENALTY =         -100;    

    var results = [];
    for(var i = 0; i < content.length; ++i)
    {
        if(i % 100 == 0 && i != 0)
        {
            postMessage([-1, 100]);
        }
        if(currentResultsIndexesIDs.length == 0 || currentResultsIndexesIDs.includes(content[i][content[i].length - 1]))
        {
            var row = content[i];
            var row_standard = content_standard[i];
            var rowHasMatch = false;
            var match = new Object;
            match.row = 0;
            match.columns = [];
            match.strings = [];
            match.ranking = 0;
            match.id = "";
            // match.indexes = [];
            var continueSearchingRow = true;
            if(anyChecked)
            {
                rowHasMatch = false;
                for(var j = 0; j < row.length - 1; ++j)
                {
                    var content_to_search;
                    var content_to_search_standard;
                    if(j < indexes.length)
                    {
                        content_to_search = String(row[j]).toLowerCase();
                        content_to_search_standard = row_standard[j];
                    }
                    else
                    {
                        content_to_search = stringifyArray(row[j]).toLowerCase(); //Memo field array
                        content_to_search_standard = stringifyArray(row_standard[j]);
                    }

                    //First check if whole string is matched before splitting into spaces
                    var cell_indexes = [];
                    var regex = searchstring_any_regexsafe;
                    var result = content_to_search.match(regex);
                    var whole_match_found = false;
                    if(result != null)
                    {
                        match.row = i + _ROW_OFFSET;
                        match.columns.push(j);
                        match.strings.push(String(row[j]).substring(result.index, result.index + searchstring_any.length));
                        match.ranking += RANKING_WHOLE_EXACT;
                        if(j == _DESCRIP1 || j == _DESCRIP2)
                            match.ranking += RANKING_DESCRIPS;
                        match.id = row[row.length - 1]; //Row ID
                        cell_indexes.push(result.index);
                        rowHasMatch = true;
                        whole_match_found = true;
                    }

                    //Whole string standard
                    if(result == null)
                    {
                        regex = searchstring_any_standard_regexsafe;
                        result = content_to_search_standard.match(regex);
                        if(result != null)
                        {
                            var position = getStandardRegexPositionInComplexString(String(row[j]), searchstring_any_standard);
                            var matchString = String(row[j]).substring(position[0], position[1]);
                            match.row = i + _ROW_OFFSET;
                            match.columns.push(j);
                            match.strings.push(matchString);
                            match.ranking += RANKING_WHOLE_STANDARD;
                            if(j == _DESCRIP1 || j == _DESCRIP2)
                                match.ranking += RANKING_DESCRIPS;
                            match.id = row[row.length - 1]; //Row ID
                            cell_indexes.push(position[0]);
                            rowHasMatch = true;
                            whole_match_found = true;
                        }
                    }
                    
                    //Separate searchstring by spaces
                    if(result == null)
                    {
                        var num_exact_matches_in_cell = 0;
                        var num_standard_matches_in_cell = 0;
                        for(var sss = 0; sss < searchstrings_any.length; ++sss)
                        {
                            var searchstring = searchstrings_any[sss];

                            //Exact Match
                            regex = searchstrings_any_regexsafe[sss];
                            // getRegexSafeSearchTerm(searchstring);
                            result = content_to_search.match(regex);
                            if(result != null)
                            {
                                match.row = i + _ROW_OFFSET;
                                match.columns.push(j);
                                match.strings.push(String(row[j]).substring(result.index, result.index + searchstring.length));
                                match.ranking += RANKING_EXACT;
                                match.id = row[row.length - 1]; //Row ID
                                // match.indexes.push(result.index);
                                cell_indexes.push(result.index);
                                rowHasMatch = true;
                                ++num_exact_matches_in_cell;
                                
                            }
                            else //Try Standardized Match
                            {
                                regex = standard_searchstrings_any_regexsafe[sss];
                                // getRegexSafeSearchTerm(standard_searchstrings_any[sss]);
                                result = content_to_search_standard.match(regex);
                                if(result != null)
                                {
                                    var position = getStandardRegexPositionInComplexString(String(row[j]), searchstrings_any_standard[sss]);
                                    var matchString = String(row[j]).substring(position[0], position[1]);
                                    match.row = i + _ROW_OFFSET;
                                    match.columns.push(j);
                                    match.strings.push(matchString);
                                    match.ranking += RANKING_STANDARD;
                                    match.id = row[row.length - 1]; //Row ID
                                    // match.indexes.push(position[0]);
                                    cell_indexes.push(position[0]);
                                    rowHasMatch = true;
                                    ++num_standard_matches_in_cell;
                                }
                            }

                            if(result != null)
                            {
                                if(num_exact_matches_in_cell + num_standard_matches_in_cell == searchstrings_any.length)
                                {
                                    match.ranking += (RANKING_ALL_IN_CELL_EXACT * num_exact_matches_in_cell + RANKING_ALL_IN_CELL_STANDARD * num_standard_matches_in_cell); //Ranking Bonus for every word in search having match in cell
                                    if(j == _DESCRIP1 || j == _DESCRIP2)
                                        match.ranking += RANKING_DESCRIPS;
                                }
                            }
                        }
                    }

                    if(!whole_match_found)
                    {
                        var numSpaces = 0;
                        for(var i2 = 0; i2 < cell_indexes.length - 1; ++i2)
                        {
                            var str = removeExtraSpaces(content_to_search.substring(cell_indexes[i2], cell_indexes[i2 + 1]));
                            for(var j2 = 0; j2 < str.length; ++j2)
                            {
                                if(str.charAt(j2) == " ")
                                    ++numSpaces;
                            }
                        }
                        match.ranking += (RANKING_SPACES_BETWEEN_PENALTY * numSpaces);
                    }
                } //END Searching Column (row[j])
                if(rowHasMatch)
                    results.push(match);
            }
            else //Specific columns
            {
                for(var j = 0; j < row.length - 1 && continueSearchingRow; ++j)
                {
                    if(columnsToSearch[j]){
                        var searchStrings_Separated = searchstrings_specific[j];
                        
                        var content_to_search;
                        var content_to_search_standard;
                        if(j < indexes.length)
                        {
                            content_to_search = String(row[j]).toLowerCase();
                            content_to_search_standard = row_standard[j];
                        }
                        else
                        {
                            content_to_search = stringifyArray(row[j]).toLowerCase(); //Memo field array
                            content_to_search_standard = stringifyArray(row_standard[j]);
                        }
                        
                        //First check if whole exact string is matched before splitting into spaces
                        var cell_indexes = [];
                        var regex = searchstring_specific_regexsafe[j];
                        var result = content_to_search.match(regex);
                        var whole_match_found = false;
                        if(result != null)
                        {
                            match.row = i + _ROW_OFFSET;
                            match.columns.push(j);
                            match.strings.push(String(row[j]).substring(result.index, result.index + searchstring_specific[j].length));
                            match.ranking += RANKING_WHOLE_EXACT;
                            match.id = row[row.length - 1]; //Row ID
                            cell_indexes.push(result.index);
                            rowHasMatch = true;
                            whole_match_found = true;
                        }

                        //Whole string standard
                        if(result == null)
                        {
                            regex = searchstring_specific_standard_regexsafe[j];
                            result = content_to_search_standard.match(regex);
                            if(result != null)
                            {
                                var position = getStandardRegexPositionInComplexString(String(row[j]), searchstring_specific_standard[j]);
                                var matchString = String(row[j]).substring(position[0], position[1]);
                                match.row = i + _ROW_OFFSET;
                                match.columns.push(j);
                                match.strings.push(matchString);
                                match.ranking += RANKING_WHOLE_STANDARD;
                                match.id = row[row.length - 1]; //Row ID
                                cell_indexes.push(position[0]);
                                rowHasMatch = true;
                                whole_match_found = true;
                            }
                        }
                        
                        //Separate searchstring by spaces
                        if(result == null)
                        {
                            var num_exact_matches_in_cell = 0;
                            var num_standard_matches_in_cell = 0;
                            for(var sss = 0; sss < searchStrings_Separated.length && continueSearchingRow; ++sss)
                            {
                                var searchstring = searchStrings_Separated[sss];

                                //Exact Match
                                regex = searchstrings_specific_regexsafe[j][sss];
                                // getRegexSafeSearchTerm(searchstring);
                                var result = content_to_search.match(regex);
                                if(result != null)
                                {
                                    match.row = i + _ROW_OFFSET;
                                    match.columns.push(j);
                                    match.strings.push(String(row[j]).substring(result.index, result.index + searchstring.length));
                                    match.ranking += RANKING_EXACT;
                                    match.id = row[row.length - 1]; //Row ID
                                    // match.indexes.push(result.index);
                                    cell_indexes.push(result.index);
                                    rowHasMatch = true;
                                    ++num_exact_matches_in_cell;
                                }
                                else //Try Standardized Match
                                {
                                    var standard_searchstring = searchstrings_specific_standard[j][sss];
                                    // standardizeString(searchstring);
                                    regex = standard_searchstrings_specific_regexsafe[j][sss];
                                    // getRegexSafeSearchTerm(standard_searchstring);
                                    result = content_to_search_standard.match(regex);
                                    if(result != null)
                                    {
                                        var position = getStandardRegexPositionInComplexString(String(row[j]), standard_searchstring);
                                        var matchString = String(row[j]).substring(position[0], position[1]);
                                        match.row = i + _ROW_OFFSET;
                                        match.columns.push(j);
                                        match.strings.push(matchString);
                                        match.ranking += RANKING_STANDARD;
                                        match.id = row[row.length - 1]; //Row ID
                                        // match.indexes.push(position[0]);
                                        cell_indexes.push(position[0]);
                                        rowHasMatch = true;
                                        ++num_standard_matches_in_cell;
                                    }
                                }

                                //No Match
                                if(result == null)
                                {
                                    rowHasMatch = false;
                                    continueSearchingRow = false;
                                }
                                else
                                {
                                    if(num_exact_matches_in_cell + num_standard_matches_in_cell == searchStrings_Separated.length)
                                        match.ranking += (RANKING_ALL_IN_CELL_EXACT * num_exact_matches_in_cell + RANKING_ALL_IN_CELL_STANDARD * num_standard_matches_in_cell); //Ranking Bonus for every word in search having match in cell
                                }
                            }
                        } //END Searching separated search string

                        if(continueSearchingRow && !whole_match_found)
                        {
                            var numSpaces = 0;
                            for(var i2 = 0; i2 < cell_indexes.length - 1; ++i2)
                            {
                                var str = removeExtraSpaces(content_to_search.substring(cell_indexes[i2], cell_indexes[i2 + 1]));
                                for(var j2 = 0; j2 < str.length; ++j2)
                                {
                                    if(str.charAt(j2) == " ")
                                        ++numSpaces;
                                }
                            }
                            match.ranking += (RANKING_SPACES_BETWEEN_PENALTY * numSpaces);
                        }
                    } //END If columns_to_search[j]
                }  //END Searching Column (row[j])
                if(rowHasMatch)
                    results.push(match);
            }
        }
    }
    // return results;
    // results.sort(COMPARE_MATCH_RANKINGS);
    var resultID = [THREAD_ID];
    results = resultID.concat(results);
    postMessage(results);
    searchstring_any = null;
    content_standard = null;
    content = null;
    columnsToSearch = null;
    anyChecked = null;
    searchstring_specific = null;
    indexes = null;
    currentResultsIndexesIDs = null;
    _DESCRIP1 = null;
    _DESCRIP2 = null;
    THREAD_ID = null;
    _ROW_OFFSET = null;
}

function removeExtraSpaces(str1){
    //Remove multiple spaces
    var str = String(str1);
    var str2 = str.replace(/ {2,}/g, " ");
  
    //Remove spaces at beginning of string
    if(str2.charAt(0) == " ")
      str2 = str2.substring(1, str2.length);
  
    //Remove spaces at end of string
    if(str2.charAt(str2.length - 1) == " ")
      str2 = str2.substring(0, str2.length - 1);
  
    return str2;
}

function is_standardized(str1){
    var str = String(str1);
    return /^[a-z0-9 ]+$/i.test(str);
}

function getRegexSafeSearchTerm(str1)
{
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

function standardizeString(str1){
    var str = String(str1);
    var str2 = str.toLowerCase();
    
    //Remove non numbers and letters and spaces
    str2 = str2.replace(/[^0-9a-z ]/g, "");
  
    //Remove multiple spaces
    str2 = str2.replace(/ {2,}/g, " ");
  
    //Remove spaces at beginning of string
    if(str2.charAt(0) == " ")
      str2 = str2.substring(1, str2.length);
  
    //Remove spaces at end of string
    if(str2.charAt(str2.length - 1) == " ")
      str2 = str2.substring(0, str2.length - 1);
  
    return str2;
  }

  function stringifyArray(array){
      var result = "";
      for(var i = 0; i < array.length; ++i){
          result += String(array[i]);
          if(i != array.length - 1)
              result += " ";
      }
      return result;
  }

  function getStandardRegexPositionInComplexString(content_string, searchstring)
  {
    var s = 0;
    var start = 0;
    var end = 0;
    var lastCharWasSpace = false;
    searchstring = searchstring.toLowerCase();
    for(var n = 0; n < content_string.length; ++n)
    {
        var content_char = content_string.charAt(n).toLowerCase();
        if(is_standardized(content_char) && !(lastCharWasSpace && content_char == " "))
        {
            if(content_char != searchstring.charAt(s))
                s = 0;
            if(content_char == searchstring.charAt(s)){
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
    return [start, end];
  }