onmessage = function(e) {
    var searchstring_any = e.data[0];
    var content_standard = e.data[1];
    var content = e.data[2];
    var columnsToSearch = e.data[3];
    var exactMatch = e.data[4];
    var anyChecked = e.data[5];
    var searchstrings_specific = e.data[6];
    var indexes = e.data[7];

    var results = [1];
    for(var i = 0; i < content.length; ++i){
        if(i % 100 == 0)
        {
            postMessage([0, i]);
        }
        var row;
        if(exactMatch)
            row = content[i];
        else
            row = content_standard[i];
        var rowHasMatch = false;
        var continueSearchingRow = true;
        var match = [0, [], []];
        for(var j = 0; j < row.length - 1 && continueSearchingRow; ++j){
            if(anyChecked || columnsToSearch[j]){
                var searchstring;
                if(anyChecked)
                    searchstring = searchstring_any;
                else
                    searchstring = searchstrings_specific[j];

                var searchStrings_Separated = [];
                if(exactMatch)
                    searchStrings_Separated.push(searchstring);
                else
                    searchStrings_Separated = removeExtraSpaces(searchstring).split(" ");
                
                var content_to_search;
                if(j < indexes.length)
                    content_to_search = String(row[j]).toLowerCase();
                else
                    content_to_search = stringifyArray(row[j]).toLowerCase();
                for(var sss = 0; sss < searchStrings_Separated.length && continueSearchingRow; ++sss){
                    searchstring = String(searchStrings_Separated[sss]);
                    var result = content_to_search.match(getRegexSafeSearchTerm(searchstring));
                    if(result != null)
                    {
                        var content_string;
                        if(j < indexes.length)
                            content_string = String(content[i][j]);
                        else
                            content_string = stringifyArray(content[i][j]);
                        var s = 0;
                        var start = 0;
                        var end = 0;
                        var lastCharWasSpace = false;
                        for(var n = 0; n < content_string.length; ++n)
                        {
                            var content_char = content_string.charAt(n).toLowerCase();
                            if((is_standardized(content_char) || exactMatch) && !(lastCharWasSpace && content_char == " "))
                            {
                                if(content_char != searchstring.charAt(s).toLowerCase())
                                    s = 0;
                                if(content_char == searchstring.charAt(s).toLowerCase()){
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
                        
                        var matchStr = content_string.substring(start, end);
                        match[0] = i;
                        match[1].push(j);
                        match[2].push(matchStr);
                        rowHasMatch = true;
                    }
                    else{ //No match
                        if(!anyChecked){
                            rowHasMatch = false;
                            continueSearchingRow = false;
                        }
                    }
                }
            }
        }
        if(rowHasMatch)
            results.push(match);
    }
    // return results;
    postMessage(results);
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