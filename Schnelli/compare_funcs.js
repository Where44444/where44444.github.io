function COMPARE_0_0(a, b) {
  if (a[0][0] < b[0][0]) {
    return -1;
  }
  if (a[0][0] > b[0][0]) {
    return 1;
  }
  return 0;
}

function COMPARE_NUMBERS(a, b) {
  if (Number(a) < Number(b)) {
    return -1;
  }
  if (Number(a) > Number(b)) {
    return 1;
  }
  return 0;
}

function COMPARE_OBJECT_date(a, b) {
  var date_a = (new Date(a.date)).getTime();
  var date_b = (new Date(b.date)).getTime();
  if (date_a < date_b) {
    return -1;
  }
  if (date_a > date_b) {
    return 1;
  }
  return 0;
}

function COMPARE_OBJECT_time(a, b) {
  if (a.time < b.time) {
    return -1;
  }
  if (a.time > b.time) {
    return 1;
  }
  return 0;
}

function COMPARE_CONTENT_EXTRA_date(a, b) {

  var date_a = Number(a.content_extra[0].data[0].date);
  var date_b = Number(b.content_extra[0].data[0].date);
  for (var i = 1; i < a.content_extra[0].data.length; ++i) {
    if (Number(a.content_extra[0].data[i].date) > date_a)
      date_a = Number(a.content_extra[0].data[i].date);
  }
  for (var i = 1; i < b.content_extra[0].data.length; ++i) {
    if (Number(b.content_extra[0].data[i].date) > date_b)
      date_b = Number(b.content_extra[0].data[i].date);
  }
  if (date_a < date_b) {
    return -1;
  }
  if (date_a > date_b) {
    return 1;
  }
  return 0;
}

// function COMPARE_SEARCHRESULTS_TO_SORTED_CONTENT(a, b)
// {
//   var index_a = null;
//   var index_b = null;
//   index_a = getContentIndexFrom_DB_ID(a.id);
//   index_b = getContentIndexFrom_DB_ID(b.id);

//   if(index_a != null)
//     a.row = index_a;
//   if(index_b != null)
//     b.row = index_b;

//   if(index_a != null && index_b != null)
//   {
//     if (index_a < index_b)
//       return -1;
//     if (index_a > index_b)
//       return 1;
//   }
//   return 0;
// }

function COMPARE_MATCH_RANKINGS(a, b) {
  if (a.ranking < b.ranking) {
    return 1;
  }
  if (a.ranking > b.ranking) {
    return -1;
  }
  return 0;
}

function COMPARE_OBJ_TEXT(a, b) {
  if (a.text < b.text) {
    return -1;
  }
  if (a.text > b.text) {
    return 1;
  }
  return 0;
}

function COMPARE_OBJ_LOCATION(a, b) {
  if (a.LOCATION < b.LOCATION) {
    return -1;
  }
  if (a.LOCATION > b.LOCATION) {
    return 1;
  }
  return 0;
}