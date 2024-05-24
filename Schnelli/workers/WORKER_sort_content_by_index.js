onmessage = function(e) {
    var content = e.data[0];
    var index = e.data[1];
    var indexes = e.data[2];
    var _contentSortedReverse = e.data[3];

    compareIndex1 = index;
    if(_contentSortedReverse){
      if(compareIndex1 <= indexes.length)
        content.sort(COMPARE_X1_REVERSE);
      else
        content.sort(COMPARE_X1_REVERSE_2D);
    }
    else{
      if(compareIndex1 <= indexes.length)
        content.sort(COMPARE_X1);
      else
        content.sort(COMPARE_X1_2D);
    }

    var results = [content];
    postMessage(results);
    content = null;
    index = null;
    indexes = null;
    _contentSortedReverse = null;
}

  var compareIndex1 = 0;
  function COMPARE_X1( a, b ) {
    if(compareIndex1 == 0){ //RECORD_NUMBER
      if ( Number(a[compareIndex1]) < Number(b[compareIndex1]) ){
        return -1;
      }
      if ( Number(a[compareIndex1]) > Number(b[compareIndex1]) ){
        return 1;
      }
    }
    else{
      var strA = String(a[compareIndex1]).toLowerCase();
      var strB = String(b[compareIndex1]).toLowerCase();
      if ( strA < strB ){
        return -1;
      }
      if ( strA > strB ){
        return 1;
      }
    }
    return 0;
  }


  function COMPARE_X1_REVERSE( a, b ) {
    if(compareIndex1 == 0){ //RECORD_NUMBER
      if ( Number(a[compareIndex1]) < Number(b[compareIndex1]) ){
        return 1;
      }
      if ( Number(a[compareIndex1]) > Number(b[compareIndex1]) ){
        return -1;
      }
    }
    else{
      var strA = String(a[compareIndex1]).toLowerCase();
      var strB = String(b[compareIndex1]).toLowerCase();
      if ( strA < strB ){
        return 1;
      }
      if ( strA > strB ){
        return -1;
      }
    }
    return 0;
  }


  function COMPARE_X1_2D( a, b ) {
    var strA = stringifyArray(a[compareIndex1]).toLowerCase();
    var strB = stringifyArray(b[compareIndex1]).toLowerCase();
    if ( strA < strB ){
      return -1;
    }
    if ( strA > strB ){
      return 1;
    }
    return 0;
  }

  function COMPARE_X1_REVERSE_2D( a, b ) {
    var strA = stringifyArray(a[compareIndex1]).toLowerCase();
    var strB = stringifyArray(b[compareIndex1]).toLowerCase();
    if ( strA < strB ){
      return 1;
    }
    if ( strA > strB ){
      return -1;
    }
    return 0;
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