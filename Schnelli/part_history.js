var _part_filter_date_start = -1;
var _part_filter_date_end = -1;
var _part_history_content_extra_objs = [];
var _part_history_table_indexes = [];

function populatePartHistory() {
  _part_history_content_extra_objs = [];
  _part_history_content_extra_objs_info = [];
  _part_history_table_indexes = [];
  for (var i = 0; i < _EXTRA_DB.length; ++i) {
    for (var j = 0; j < _content_extra[i].length; ++j) {
      if (_content_extra[i][j][0].data != null) {
        var final_obj = new Object();
        final_obj.i = i;
        final_obj.j = j;
        final_obj.content_extra = _content_extra[i][j];
        _part_history_content_extra_objs.push(final_obj);
      }
    }
  }

  var table_html = "<table><tr>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Date Last Sold</th>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Part Number</th>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Description</th>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Quantity</th></tr>";
  var filter_pn = document.getElementById("part_history_filter_pn").value;
  var filter_desc = document.getElementById("part_history_filter_desc").value;
  var filter_price = document.getElementById("part_history_filter_price").value;
  var filter_any_field = document.getElementById("part_history_filter_part_any_field").value;
  var do_filter_pn = (filter_pn.replace(/ /g, "").length > 0);
  var do_filter_desc = (filter_desc.replace(/ /g, "").length > 0);
  var do_filter_price = (filter_price.replace(/ /g, "").length > 0);
  var do_filter_any_field = (filter_any_field.replace(/ /g, "").length > 0);
  var inc = 0;
  _part_history_content_extra_objs.sort(COMPARE_CONTENT_EXTRA_date);
  for (var i = _part_history_content_extra_objs.length - 1; i >= 0; --i) {
    var obj = _part_history_content_extra_objs[i].content_extra;
    
    var latestTime = Number(obj[0].data[0].date);
    var totalQuantity = Number(obj[0].data[0].quantity);
    for (var j = 1; j < obj[0].data.length; ++j) {
      totalQuantity += Number(obj[0].data[j].quantity);
      if (Number(obj[0].data[j].date) > latestTime)
      latestTime = Number(obj[0].data[j].date);
    }
    
    var match_failed = false;
    if (!match_failed && _part_filter_date_start != -1) {
      if (!isNaN(latestTime) && (latestTime < _part_filter_date_start || latestTime >= _part_filter_date_end))
      match_failed = true;
    }
    if (!match_failed && do_filter_pn) {
      var result = String(obj[0].PN).toLowerCase().match(getRegexSafeSearchTerm(filter_pn).toLowerCase());
      if (result == null)
      match_failed = true;
    }
    if (!match_failed && do_filter_desc) {
      var result = String(obj[0].DESCRIP1).toLowerCase().match(getRegexSafeSearchTerm(filter_desc).toLowerCase());
      if (result == null)
      match_failed = true;
    }
    if (!match_failed && do_filter_price) {
      var matchFound = false;
      for (var j = 0; j < obj[0].data.length; ++j) {
        var result = String(obj[0].data[j].price).toLowerCase().match(getRegexSafeSearchTerm(filter_price).toLowerCase());
        if (result != null) {
          matchFound = true;
          break;
        }
      }
      if (!matchFound)
      match_failed = true;
    }
    if (!match_failed && do_filter_any_field) {
      var any_field_match_found = false;
      for (let [key, value] of Object.entries(obj[0])) {
        if (!any_field_match_found) {
          var result = String(value).toLowerCase().match(getRegexSafeSearchTerm(filter_any_field).toLowerCase());
          if (result != null)
          any_field_match_found = true;
        }
      }
      if (!any_field_match_found)
      match_failed = true;
    }
    
    
    var latestTimeDT = new Date(latestTime);
    
    if (!match_failed) {
      _part_history_table_indexes.push(i);
      table_html += "<tr id='parthistory_table_row_" + inc + "' class='clickable' onclick='set_tablePartHistory_SelectedRow(" + inc + ");')>"
      + "<td>" + getMMDDYYYYText(latestTimeDT) + "</td>"
      + "<td>" + obj[0].PN + "</td>"
      + "<td>" + obj[0].DESCRIP1 + "</td>"
      + "<td>" + totalQuantity + "</td>"
      + "</tr>";
      ++inc;
    }
  }
  table_html += "</table>";
  document.getElementById("table_part_history_div_list").innerHTML = table_html;
  if (!set_tablePartHistory_SelectedRow(_table_parthistory_selected_row))
    set_tablePartHistory_SelectedRow(0);
}

function savePartToHistory(db_id, db_index, date_millis, quantity, price) {
  var index = getContentExtraIndexFrom_DB_ID(db_id, db_index);
  if (index != null) {
    var partObj = _content_extra[db_index][index][0];
    var dataObj = new Object();
    dataObj.date = date_millis;
    dataObj.quantity = quantity;
    dataObj.price = price;
    dataObj.initials = getMyInitials();
    if (partObj.data == null)
      partObj.data = [dataObj];
    else
      partObj.data.push(dataObj);
    if (!_DEBUG_LOCAL_MODE) {
      writeToDatabase("parts_db/" + _EXTRA_DB[db_index] + "/" + _content_extra[db_index][index][1], partObj, true, false, true, db_index);
    }
  }
}

function clearPartFilters() {
  var date0 = new Date(FILTER_TIME_START);
  var date1 = new Date();
  $('#part_history_filter_time').data('daterangepicker').setStartDate(date0);
  $('#part_history_filter_time').data('daterangepicker').setEndDate(date1);
  document.getElementById("part_history_filter_pn").value = "";
  document.getElementById("part_history_filter_desc").value = "";
  document.getElementById("part_history_filter_price").value = "";
  document.getElementById("part_history_filter_part_any_field").value = "";
  _part_filter_date_start = date0.getTime();
  _part_filter_date_end = date1.getTime();
  populatePartHistory();
}

function populatePartHistoryView(i0) {
  var i = _part_history_table_indexes[i0];
  if (i < _part_history_content_extra_objs.length) {
    var obj_data = _part_history_content_extra_objs[i].content_extra[0].data;
    if (obj_data != null && obj_data.length > 0) {
      var html0 = "";
      var i1 = _part_history_content_extra_objs[i].i;
      var j1 = _part_history_content_extra_objs[i].j;
      var content_index = getParentRecordIndexWithChildPart_IncludingAKA(i1, j1);
      if (content_index != null) {
        var descrip1 = _content[content_index][_DESCRIP1];
        var descrip2 = _content[content_index][_DESCRIP2];
        html0 += "<table><tr><th>" + descrip1 + "</th></tr>";
        html0 += "<tr><th>" + descrip2 + "</th></tr></table>";
      }
      html0 += "<table><tr><th>Date</th><th>Quantity</th><th>Price</th><th>Sold By</th></tr>";
      for (var i = obj_data.length - 1; i >= 0; --i) {
        var dataObj = obj_data[i];
        html0 += "<tr>";
        // dataObj.date = date_millis;
        // dataObj.quantity = quantity;
        // dataObj.price = price;
        var date = new Date(dataObj.date);
        html0 += "<td>" + getMMDDYYYY_HHMMText(date) + "</td>";
        html0 += "<td>" + dataObj.quantity + "</td>";
        html0 += "<td>$" + dataObj.price + "</td>";
        html0 += "<td>" + dataObj.initials + "</td></tr>";
      }
      html0 += "</table>";
      document.getElementById("table_part_history_div_view").innerHTML = html0;
    }
    else {
      document.getElementById("table_part_history_div_view").innerHTML = "";
    }
  }
}