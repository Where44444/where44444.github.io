onmessage = function(e) {
    var searchstring = e.data[0];
    var content_standard = e.data[1];
    var content = e.data[2];
    var columnsToSearch = e.data[3];
    var exactMatch = e.data[4];
    var results = [];

    for(var i = 0; i < content.length; ++i){
        var row;
        if(exactMatch)
            row = content[i];
        else
            row = content_standard[i];
        var rowHasMatch = false;
        var match = [0, [], []];
        for(var j = 1; j < row.length; ++j){
            if(columnsToSearch[j - 1]){
                var result = row[j].toLowerCase().match(getRegexSafeSearchTerm(searchstring));
                if(result != null)
                {
                    var content_string = content[i][j];
                    var s = 0;
                    var start = 0;
                    var end = 0;
                    var lastCharWasSpace = false;
                    for(var n = 0; n < content_string.length; ++n){
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
            }
        }
        if(rowHasMatch)
            results.push(match);
    }
    // return results;
    postMessage(results);
}

function removeExtraSpacesLower(str){
    var str2 = str.toLowerCase();

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

function is_standardized(str){
    return /^[a-z0-9 ]+$/i.test(str);
}

function getRegexSafeSearchTerm(str)
{
  //Remove non numbers and letters and spaces
  var str2 = str.replace(/\(/g, "\\(");
  str2 = str2.replace(/\)/g, "\\)");
  str2 = str2.replace(/\+/g, "\\+");
  str2 = str2.replace(/\-/g, "\\-");
  str2 = str2.replace(/\?/g, "\\?");
  str2 = str2.replace(/\!/g, "\\!");
  str2 = str2.replace(/\\/g, "\\");
  str2 = str2.replace(/\*/g, "\\*");
  str2 = str2.replace(/\,/g, "\\,");
  str2 = str2.replace(/\./g, "\\.");
  str2 = str2.replace(/\^/g, "\\^");
  str2 = str2.replace(/\$/g, "\\$");
  return str2;
}

function standardizeString(str){
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