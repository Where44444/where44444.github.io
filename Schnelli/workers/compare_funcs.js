function COMPARE_0_0( a, b ) {
    if ( a[0][0] < b[0][0] ){
      return -1;
    }
    if ( a[0][0] > b[0][0] ){
      return 1;
    }
    return 0;
  }

  function COMPARE_NUMBERS( a, b ) {
    if ( Number(a) < Number(b) ){
      return -1;
    }
    if ( Number(a) > Number(b) ){
      return 1;
    }
    return 0;
  }

  function COMPARE_OBJECT_date(a, b)
  {
    var date_a = (new Date(a.date)).getTime();
    var date_b = (new Date(b.date)).getTime();
    if (date_a < date_b){
      return -1;
    }
    if (date_a > date_b){
      return 1;
    }
    return 0;
  }

