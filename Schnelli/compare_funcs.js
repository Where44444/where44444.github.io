function COMPARE_0_0( a, b ) {
    if ( a[0][0] < b[0][0] ){
      return -1;
    }
    if ( a[0][0] > b[0][0] ){
      return 1;
    }
    return 0;
  }