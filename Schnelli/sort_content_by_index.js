onmessage = function(e) {
    var content = e.data[0];
    var index = e.data[1];
    var indexes = e.data[2];
    var _contentSortedReverse = e.data[3];

    compareIndex1 = index;
    if(_contentSortedReverse)
      content.sort(COMPARE_X1_REVERSE);
    else
      content.sort(COMPARE_X1);
    var content_standard = getContent_Standard(content, indexes);

    var results = [content, content_standard];
    postMessage(results);
}

function getContent_Standard(content1, indexes){
    var content_standard1 = [];
    for (var i = 0; i < content1.length; ++i) {
      content_standard1.push(new Array(indexes.length + 1));
      content_standard1[i][0] = content1[i][0]; //Copy database ID
      for(var j = 1; j < indexes.length + 1; ++j)
      {
        content_standard1[i][j] = standardizeString(content1[i][j]);
      }
    }
    return content_standard1;
  }

  var compareIndex1 = 0;
  function COMPARE_X1( a, b ) {
    if(compareIndex1 == 1){ //RECORD_NUMBER
      if ( Number(a[compareIndex1]) < Number(b[compareIndex1]) ){
        return -1;
      }
      if ( Number(a[compareIndex1]) > Number(b[compareIndex1]) ){
        return 1;
      }
    }
    else{
      if ( a[compareIndex1] < b[compareIndex1] ){
        return -1;
      }
      if ( a[compareIndex1] > b[compareIndex1] ){
        return 1;
      }
    }
    return 0;
  }


  function COMPARE_X1_REVERSE( a, b ) {
    if(compareIndex1 == 1){ //RECORD_NUMBER
      if ( Number(a[compareIndex1]) < Number(b[compareIndex1]) ){
        return 1;
      }
      if ( Number(a[compareIndex1]) > Number(b[compareIndex1]) ){
        return -1;
      }
    }
    else{
      if ( a[compareIndex1] < b[compareIndex1] ){
        return 1;
      }
      if ( a[compareIndex1] > b[compareIndex1] ){
        return -1;
      }
    }
    return 0;
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