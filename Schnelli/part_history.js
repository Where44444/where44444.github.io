var _part_filter_date_start = new Date(FILTER_TIME_START);
var _part_filter_date_end = new Date();
_part_filter_date_end = new Date(_part_filter_date_end.getFullYear(), _part_filter_date_end.getMonth() + 1, _part_filter_date_end.getDate());
var _part_history_content_extra_objs = [];
var _part_history_table_indexes = [];

var partHistorySortIndex = 0;

function setPartHistorySortIndex(index) {
  if (partHistorySortIndex == index)
    partHistorySortIndex = -index;
  else
    partHistorySortIndex = index;

  populatePartHistory();
}

function populatePartHistory() {
  if (document.getElementById("part_history_filter_pn") != null) {
    _part_history_content_extra_objs = [];
    _part_history_content_extra_objs_info = [];
    _part_history_table_indexes = [];
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
      for (var j = 0; j < _content_extra[i].length; ++j) {
        if (_content_extra[i][j][0][CE_DATA] != null) {
          var final_obj = new Object();
          final_obj.i = i;
          final_obj.j = j;
          final_obj.content_extra = _content_extra[i][j];
          _part_history_content_extra_objs.push(final_obj);
        }
      }
    }

    var table_html = "<table><tr>"
      + "<th id='partHistoryHeader1' class='clickable' onclick='setPartHistorySortIndex(1)' style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Date Last Sold</th>"
      + "<th id='partHistoryHeader2' class='clickable' onclick='setPartHistorySortIndex(2)' style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Part Number</th>"
      + "<th id='partHistoryHeader3' class='clickable' onclick='setPartHistorySortIndex(3)' style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Description</th>"
      + "<th id='partHistoryHeader4' class='clickable' onclick='setPartHistorySortIndex(4)' style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Qty Time Frame</th>"
      + "<th id='partHistoryHeader5' class='clickable' onclick='setPartHistorySortIndex(5)' style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Qty All Time</th></tr>";
    var filter_pn = document.getElementById("part_history_filter_pn").value;
    var filter_desc = document.getElementById("part_history_filter_desc").value;
    var filter_price = document.getElementById("part_history_filter_price").value;
    var filter_any_field = document.getElementById("part_history_filter_part_any_field").value;
    var do_filter_pn = (filter_pn.replace(/ /g, "").length > 0);
    var do_filter_desc = (filter_desc.replace(/ /g, "").length > 0);
    var do_filter_price = (filter_price.replace(/ /g, "").length > 0);
    var do_filter_any_field = (filter_any_field.replace(/ /g, "").length > 0);
    _part_history_content_extra_objs.sort(COMPARE_CONTENT_EXTRA_date);
    var rows = [];
    var latestTime = -999999;
    for (var i = _part_history_content_extra_objs.length - 1; i >= 0; --i) {
      var obj = _part_history_content_extra_objs[i].content_extra;
      var totalQuantity = 0;
      var timeFrameQty = 0;
      var partDates = [];
      for (var j = 0; j < obj[0][CE_DATA].length; ++j) {
        totalQuantity += Number(obj[0][CE_DATA][j].quantity);
        var partDate = Number(obj[0][CE_DATA][j].date);
        if (partDate >= _part_filter_date_start && partDate < _part_filter_date_end)
          timeFrameQty += Number(obj[0][CE_DATA][j].quantity);
        if (partDate > latestTime)
          latestTime = partDate;
        partDates.push(partDate);
      }

      var match_failed = false;
      if (!match_failed && _part_filter_date_start != -1) {
        var matchFound = false;
        for (let partDate of partDates)
          if (!isNaN(partDate) && partDate >= _part_filter_date_start && partDate < _part_filter_date_end) {
            matchFound = true;
            break;
          }
        if (!matchFound)
          match_failed = true;
      }
      if (!match_failed && do_filter_pn) {
        var result = String(obj[0][CE_PN]).toLowerCase().match(getRegexSafeSearchTerm(filter_pn).toLowerCase());
        if (result == null) {
          match_failed = true;
        }
      }
      if (!match_failed && do_filter_desc) {
        var result = String(obj[0][CE_DESCRIP1]).toLowerCase().match(getRegexSafeSearchTerm(filter_desc).toLowerCase());
        if (result == null) {
          match_failed = true;
        }
      }
      if (!match_failed && do_filter_price) {
        var matchFound = false;
        for (var j = 0; j < obj[0][CE_DATA].length; ++j) {
          var result = String(obj[0][CE_DATA][j].price).toLowerCase().match(getRegexSafeSearchTerm(filter_price).toLowerCase());
          if (result != null) {
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          match_failed = true;
        }
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
        if (!any_field_match_found) {
          match_failed = true;
        }
      }

      var latestTimeDT = new Date(latestTime);

      if (!match_failed)
        rows.push([i, latestTimeDT, obj[0][CE_PN], obj[0][CE_DESCRIP1], timeFrameQty, totalQuantity]);
    }

    if (partHistorySortIndex != 0) {
      if (partHistorySortIndex > 0) {
        COMPARE_INDEX_I = partHistorySortIndex;
        rows.sort(COMPARE_INDEX);
      } else {
        COMPARE_INDEX_I = -partHistorySortIndex;
        rows.sort(COMPARE_INDEX_REVERSE);
      }
    }

    for (var i = 0; i < rows.length; ++i) {
      _part_history_table_indexes.push(rows[i][0]);
      table_html += "<tr id='parthistory_table_row_" + i + "' class='clickable' onclick='set_tablePartHistory_SelectedRow(" + i + ");')>"
        + "<td>" + getMMDDYYYYText(rows[i][1]) + "</td>"
        + "<td>" + rows[i][2] + "</td>"
        + "<td>" + rows[i][3] + "</td>"
        + "<td>" + rows[i][4] + "</td>"
        + "<td>" + rows[i][5] + "</td>"
        + "</tr>";
    }

    table_html += "</table>";
    document.getElementById("table_part_history_div_list").innerHTML = table_html;

    if (partHistorySortIndex != 0) {
      if (partHistorySortIndex > 0)
        document.getElementById("partHistoryHeader" + partHistorySortIndex).style.backgroundColor = "rgb(100,100,255)"; // Blue
      else
        document.getElementById("partHistoryHeader" + (-partHistorySortIndex)).style.backgroundColor = "rgb(255,100,100)"; // Red
    }

    if (!set_tablePartHistory_SelectedRow(_table_parthistory_selected_row))
      set_tablePartHistory_SelectedRow(0);
  }
}

function savePartToHistory(db_id, db_index, date_millis, quantity, price, invoiceID) {
  var index = getContentExtraIndexFrom_DB_ID(db_id, db_index);
  if (index != null) {
    var partObj = _content_extra[db_index][index][0];
    var dataObj = new Object();
    dataObj.date = date_millis;
    dataObj.quantity = quantity;
    dataObj.price = price;
    dataObj.initials = getMyInitials();
    dataObj.invoiceID = invoiceID;
    if (partObj[CE_DATA] == null)
      partObj[CE_DATA] = [dataObj];
    else
      partObj[CE_DATA].push(dataObj);
    if (!_DEBUG_LOCAL_MODE) {
      var partObj0 = getContentExtraObj(db_index, index);
      writeToDatabase("parts_db/" + _EXTRA_DB[db_index] + "/" + _content_extra[db_index][index][1], partObj0, true, false, true, db_index, null); //Parent record MODIFIED is already updated in function that calls this
    }
  }
}

function clearPartFilters() {
  var date0 = new Date(FILTER_TIME_START);
  var date1 = new Date();
  var date1 = new Date(date1.getFullYear(), date1.getMonth() + 1, date1.getDate());
  if (document.getElementById("part_history_filter_time") != null) {
    $('#part_history_filter_time').data('daterangepicker').setStartDate(date0);
    $('#part_history_filter_time').data('daterangepicker').setEndDate(date1);
    document.getElementById("part_history_filter_pn").value = "";
    document.getElementById("part_history_filter_desc").value = "";
    document.getElementById("part_history_filter_price").value = "";
    document.getElementById("part_history_filter_part_any_field").value = "";
  }
  _part_filter_date_start = date0;
  _part_filter_date_end = date1;
  partHistorySortIndex = 0;
  populatePartHistory();
  savePartHistoryFilters();
}

function populatePartHistoryView(i0) {
  var i = _part_history_table_indexes[i0];
  if (i < _part_history_content_extra_objs.length) {
    var obj_data = _part_history_content_extra_objs[i].content_extra[0][CE_DATA];
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
      html0 += "<table><tr><th>Date</th><th>Quantity</th><th>Price</th><th>Sold By</th><th>Customer</th></tr>";

      var dateMap = new Map();
      for (var i = obj_data.length - 1; i >= 0; --i) {
        var filter_price = document.getElementById("part_history_filter_price").value;
        var do_filter_price = (filter_price.replace(/ /g, "").length > 0);
        var dataObj = obj_data[i];
        var match_failed = false;
        if (!match_failed && _part_filter_date_start != -1) {
          if (!isNaN(dataObj.date) && (dataObj.date < _part_filter_date_start || dataObj.date >= _part_filter_date_end)) {
            match_failed = true;
          }
        }

        if (!match_failed && do_filter_price) {
          var result = String(dataObj.price).toLowerCase().match(getRegexSafeSearchTerm(filter_price).toLowerCase());
          if (result == null) {
            match_failed = true;
          }
        }

        if (!match_failed) {
          html0 += "<tr>";
          var date = new Date(dataObj.date);
          html0 += "<td>" + getMMDDYYYY_HHMMText(date) + "</td>";
          html0 += "<td>" + dataObj.quantity + "</td>";
          html0 += "<td>$" + dataObj.price + "</td>";
          html0 += "<td>" + dataObj.initials + "</td>";
          var invoice_index = getInvoiceByID(dataObj.invoiceID);
          var customerName = "";
          if (invoice_index != null) {
            var invoice = _content_invoice_history[invoice_index];
            if (standardizeString(invoice.name) == "")
              customerName = "<span style='color: blue;' class='clickable' onclick='linkToInvoice(" + invoice_index + ");'><u>Unknown</u></span>";
            else
              customerName = "<span style='color: blue;' class='clickable' onclick='linkToInvoice(" + invoice_index + ");'><u>" + invoice.name + "</u></span>";
          }
          html0 += "<td>" + customerName + "</td>";
          html0 += "</tr>";

          if (dateMap.has(dataObj.date))
            dateMap.set(dataObj.date, dateMap.get(dataObj.date) + dataObj.quantity);
          else
            dateMap.set(dataObj.date, dataObj.quantity);
        }
      }

      var x_axis = [];
      var y_axis = [];
      for (let [key, val] of dateMap) {
        let date = new Date(key);
        x_axis.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
        y_axis.push(val);
      }

      var trace1 = {
        x: x_axis,
        y: y_axis,
        type: 'scatter',
        name: 'Quantity',
        showlegend: false
      };

      var layout = {
        // title: '',
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 0,
          pad: 4
        },
        showlegend: true
      };

      Plotly.newPlot('part_history_graph', [trace1], layout, { scrollZoom: true });

      html0 += "</table>";
      document.getElementById("table_part_history_div_view").innerHTML = html0;
    }
    else {
      document.getElementById("table_part_history_div_view").innerHTML = "";
    }
  }
}

function savePartHistoryFilters() {
  _part_history_filters[0] = document.getElementById("part_history_filter_time").value;
  _part_history_filters[1] = document.getElementById("part_history_filter_pn").value;
  _part_history_filters[2] = document.getElementById("part_history_filter_desc").value;
  _part_history_filters[3] = document.getElementById("part_history_filter_price").value;
  _part_history_filters[4] = document.getElementById("part_history_filter_part_any_field").value;
}