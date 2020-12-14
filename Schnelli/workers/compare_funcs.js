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

  function COMPARE_SEARCHRESULTS_TO_SORTED_CONTENT(a, b)
  {
    var index_a = null;
    var index_b = null;
    index_a = getContentIndexFrom_DB_ID(a.id);
    index_b = getContentIndexFrom_DB_ID(b.id);

    if(index_a != null)
      a.row = index_a;
    if(index_b != null)
      b.row = index_b;

    if(index_a != null && index_b != null)
    {
      if (index_a < index_b)
        return -1;
      if (index_a > index_b)
        return 1;
    }
    return 0;
  }