onmessage = function(e) {
    var content = e.data[0];
    sorted_indexes = e.data[1];
    var indexes = e.data[2];
    var _contentSortedReverse = e.data[3];

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
    sorted_indexes = null;
    indexes = null;
    _contentSortedReverse = null;
}

  var sorted_indexes = [];
  var compareIndex1 = 0;
  var checkingNextIndex = false;

  function resetState(){
    compareIndex1 = 0;
    checkingNextIndex = false;
  }

  function COMPARE_X1( a, b ) {
    if(sorted_indexes[compareIndex1] == 0){ //RECORD_NUMBER
      if ( Number(a[sorted_indexes[compareIndex1]]) < Number(b[sorted_indexes[compareIndex1]]) ){
        resetState();
        return -1;
      }
      if ( Number(a[sorted_indexes[compareIndex1]]) > Number(b[sorted_indexes[compareIndex1]]) ){
        resetState();
        return 1;
      }
    }
    else{
      var strA = String(a[sorted_indexes[compareIndex1]]).toLowerCase();
      var strB = String(b[sorted_indexes[compareIndex1]]).toLowerCase();
      if ( strA < strB ){
        resetState();
        return -1;
      }
      if ( strA > strB ){
        resetState();
        return 1;
      }
    }
    if(compareIndex1 < sorted_indexes.length - 1){
        checkingNextIndex = true;
        ++compareIndex1;
        return COMPARE_X1(a, b);
    }
    resetState();
    return 0;
  }


  function COMPARE_X1_REVERSE( a, b ) {
    if(sorted_indexes[compareIndex1] == 0){ //RECORD_NUMBER
      if ( Number(a[sorted_indexes[compareIndex1]]) < Number(b[sorted_indexes[compareIndex1]]) ){
        resetState();
        return 1;
      }
      if ( Number(a[sorted_indexes[compareIndex1]]) > Number(b[sorted_indexes[compareIndex1]]) ){
        resetState();
        return -1;
      }
    }
    else{
      var strA = String(a[sorted_indexes[compareIndex1]]).toLowerCase();
      var strB = String(b[sorted_indexes[compareIndex1]]).toLowerCase();
      if ( strA < strB ){
        resetState();
        return 1;
      }
      if ( strA > strB ){
        resetState();
        return -1;
      }
    }
    if(compareIndex1 < sorted_indexes.length - 1){
        checkingNextIndex = true;
        ++compareIndex1;
        return COMPARE_X1_REVERSE(a, b);
    }
    resetState();
    return 0;
  }


  function COMPARE_X1_2D( a, b ) {
    var strA = stringifyArray(a[sorted_indexes[compareIndex1]]).toLowerCase();
    var strB = stringifyArray(b[sorted_indexes[compareIndex1]]).toLowerCase();
    if ( strA < strB ){
        resetState();
        return -1;
    }
    if ( strA > strB ){
        resetState();
        return 1;
    }
    if(compareIndex1 < sorted_indexes.length - 1){
        checkingNextIndex = true;
        ++compareIndex1;
        return COMPARE_X1_2D(a, b);
    }
    resetState();
    return 0;
  }

  function COMPARE_X1_REVERSE_2D( a, b ) {
    var strA = stringifyArray(a[sorted_indexes[compareIndex1]]).toLowerCase();
    var strB = stringifyArray(b[sorted_indexes[compareIndex1]]).toLowerCase();
    if ( strA < strB ){
        resetState();
        return 1;
    }
    if ( strA > strB ){
        resetState();
        return -1;
    }
    if(compareIndex1 < sorted_indexes.length - 1){
        checkingNextIndex = true;
        ++compareIndex1;
        return COMPARE_X1_REVERSE_2D(a, b);
    }
    resetState();
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