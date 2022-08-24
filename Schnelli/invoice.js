var _invoice_data = new Object();
function populateInvoice() {
  clearInvoicesContent();
  var numTotalRows = _invoice_objs.length;
  var htmlToAdd = "";
  var specsText = "";
  if (numTotalRows > 0) {
    for (var i = 0; i < numTotalRows; ++i) {
      var obj = _invoice_objs[i];
      // specsText += obj.equip_type + "/" + obj.mfr + "/" + obj.equip_design;
      // if (i % 2 == 0)
      //   specsText += "           ";
      // else
      //   specsText += "\n";

      if (i == 0) {
        htmlToAdd += INVOICE_PRE;
      }
      // else if(i % NUMROWS_PER_INVOICE == 0)
      // {
      //   //Add post then pre invoice html
      //   htmlToAdd += INVOICE_POST + "</div>";
      //   htmlToAdd += "<div style='position: absolute; top: " + (pageOn * 1000) + "px;'>" + INVOICE_PRE;
      // }

      if (i < _invoice_objs.length) {
        //Add filled row
        var currentAmount = Number(obj.currentAmount);
        var amountToSell = Number(obj.amountToSell);
        var newAmount = currentAmount - amountToSell;
        var specialOrderField = "<input type='text' style='display: none;' id='invoice_input_specialorder_" + i + "' value='0' disabled>";
        var specialOrderDesc = "";
        if (newAmount < 0) {
          var specialOrder = 0;
          if (Math.abs(newAmount) >= amountToSell)
            specialOrder = amountToSell;
          else
            specialOrder = Math.abs(newAmount);
          specialOrderField = "<input type='text' style='width: 20px; height: 15px; text-align: right; font-weight: bold;' id='invoice_input_specialorder_" + i + "' value='" + specialOrder + "' disabled><b> S.O.</b>";
          specialOrderDesc = " (SPECIAL ORDER)";
        }
        htmlToAdd += "<tr class='in_td'><td>"
          + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_qty_" + i + "' value='" + Number(obj.amountToSell) + "' disabled>" + specialOrderField + "</td><td>"
          + "<input type='text' style='width: 493px; height: 15px;' value='" + getHTMLSafeText(obj.PN) + " | " + getHTMLSafeText(obj.DESCRIP1) + specialOrderDesc + "' id='invoice_input_desc_" + i + "' disabled>"
        if (newAmount < 0) {
          var orderinfo = "";
          if (obj.orderinfo != null && obj.orderinfo != "NULL")
            orderinfo = obj.orderinfo;
          htmlToAdd += "<br><input type='text' style='width: 493px; height: 15px;' value='" + orderinfo + "' id='invoice_input_orderinfo_" + i + "' placeholder='Customer Name and Phone, Order Number, Tracking Number, Web Link, etc.'>";
        }
        htmlToAdd += "</td><td>"
          + "<input type='text' style='width: 48px; height: 15px; text-align: right;' id='invoice_input_sell_" + i + "' value='" + getHTMLSafeText(obj.SELL) + "' onfocus='deselectTable();' onkeyup='calculateInvoiceAmounts();' oninput='calculateInvoiceAmounts();'></td><td>" //oninput added to ensure that right click paste triggers event too, onkeyup needs to stay despite it being a subset so that enter press event is triggered
          + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_amount_" + i + "' disabled></td><td class='no-print'>"
          + "<button id='button_invoice_remove_" + i + "' style='width: 20px; height: 20px; padding: 0px; color: white; background-color: red;' tabindex='-1' onclick='removeFromInvoice(" + i + ");'>x</button></td></tr>";
      }
      else {
        //Add empty row
        htmlToAdd += "<tr class='in_td'><td></td><td></td><td></td><td></td><td class='no-print'></td></tr>";
      }
    }
    //Add post invoice html
    htmlToAdd += INVOICE_POST;
  }
  else {
    htmlToAdd = "<h2>No parts are queued for sale!</h2>";
  }
  document.getElementById("invoice_content").innerHTML = htmlToAdd;

  var soldByEle = document.getElementById("invoice_input_soldby");
  if (soldByEle != null)
    soldByEle.value = getMyInitials();

  if (numTotalRows > 0) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = mm + " / " + dd + " / " + yyyy;

    document.getElementById("invoice_input_invoice_no").value = document.getElementById("invoice_last_invoice_no_input").value;
    document.getElementById("invoice_input_date").value = today;
    document.getElementById("invoice_address_textarea_2").innerHTML = document.getElementById("invoice_address_textarea").value;
    document.getElementById("invoice_bottom_textarea_2").value = document.getElementById("invoice_bottom_textarea").value;

    if (_invoice_data.customer_order_no != null) {
      document.getElementById("invoice_input_customer_order_no").value = _invoice_data.customer_order_no;
      document.getElementById("invoice_input_name").value = _invoice_data.name;
      document.getElementById("invoice_input_address").value = _invoice_data.address;
      document.getElementById("invoice_input_citystatezip").value = _invoice_data.citystatezip;
      document.getElementById("invoice_input_phone").value = _invoice_data.phone;
      document.getElementById("invoice_input_soldby").value = _invoice_data.soldby;
      document.getElementById("invoice_textarea_misc").value = _invoice_data.misc;
      document.getElementById("invoice_input_signature").value = _invoice_data.signature;
      document.getElementById("invoice_bottom_textarea_2").value = _invoice_data.bottom;
    }
    document.getElementById("invoice_textarea_specs").value = specsText;

    calculateInvoiceAmounts();
  }
}

var _invoice_filter_date_start = -1;
var _invoice_filter_date_end = -1;
function populateInvoiceHistory() {
  var table_html = "<table><tr>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Date</th>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Name</th>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Total</th>"
    + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Invoice No.</th></tr>";
  var filter_name = document.getElementById("invoice_history_filter_name").value;
  var filter_total = document.getElementById("invoice_history_filter_total").value;
  var filter_invoice_no = document.getElementById("invoice_history_filter_invoice_no").value;
  var filter_any_field = document.getElementById("invoice_history_filter_invoice_any_field").value;
  var do_filter_name = (filter_name.replace(/ /g, "").length > 0);
  var do_filter_total = (filter_total.replace(/ /g, "").length > 0);
  var do_filter_invoice_no = (filter_invoice_no.replace(/ /g, "").length > 0);
  var do_filter_any_field = (filter_any_field.replace(/ /g, "").length > 0);
  var inc = 0;
  _content_invoice_history.sort(COMPARE_OBJECT_date);
  var regex_filter_name = getRegexSafeSearchTerm(filter_name).toLowerCase();
  var regex_filter_total = getRegexSafeSearchTerm(filter_total).toLowerCase();
  var regex_filter_invoice_no = getRegexSafeSearchTerm(filter_invoice_no).toLowerCase();
  var regex_filter_any_field = getRegexSafeSearchTerm(filter_any_field).toLowerCase();
  for (var i = _content_invoice_history.length - 1; i >= 0; --i) {
    var invoice_obj = _content_invoice_history[i];
    var match_failed = false;
    if (!match_failed && _invoice_filter_date_start != -1) {
      var date = new Date(String(invoice_obj.date));
      var time = date.getTime();
      if (!isNaN(time) && (date < _invoice_filter_date_start || date >= _invoice_filter_date_end))
        match_failed = true;
    }
    if (!match_failed && do_filter_name) {
      var result = String(invoice_obj.name).toLowerCase().match(regex_filter_name);
      if (result == null)
        match_failed = true;
    }
    if (!match_failed && do_filter_total) {
      var result = String(invoice_obj.total).toLowerCase().match(regex_filter_total);
      if (result == null)
        match_failed = true;
    }
    if (!match_failed && do_filter_invoice_no) {
      var result = String(invoice_obj.invoice_no).toLowerCase().match(regex_filter_invoice_no);
      if (result == null)
        match_failed = true;
    }
    if (!match_failed && do_filter_any_field) {
      var any_field_match_found = false;
      for (let [key, value] of Object.entries(invoice_obj)) {
        if (!any_field_match_found) {
          var result = String(value).toLowerCase().match(regex_filter_any_field);
          if (result != null)
            any_field_match_found = true;
        }
      }
      if (!any_field_match_found)
        match_failed = true;
    }


    if (!match_failed) {
      table_html += "<tr id='invoicehistory_table_row_" + inc + "' class='clickable' onclick='viewInvoiceFromHistory(" + i + ");'>"
        + "<td>" + getMMDDYYYY_HHMMText(new Date(invoice_obj.time)) + "</td>"
        + "<td>" + invoice_obj.name + "</td>"
        + "<td>" + invoice_obj.total + "</td>"
        + "<td>" + invoice_obj.invoice_no + "</td>"
        + "</tr>";
      ++inc;
    }
  }
  table_html += "</table>";
  document.getElementById("table_invoice_history_div").innerHTML = table_html;
  // var date1 = new Date("abc");
  // console.log("DATE" + date1.getTime() + "|" +  isNaN(date1.getTime()));
  if (!set_tableInvoiceHistory_SelectedRow(_table_invoicehistory_selected_row))
    set_tableInvoiceHistory_SelectedRow(0);
}

var _current_viewed_invoice_data = null;
var _current_viewed_invoice_id = null;
function viewInvoiceFromHistory(index) {
  _current_viewed_invoice_id = _content_invoice_history[index].key;
  clearInvoicesContent();
  document.getElementById("non_invoice_content").style.display = "none";
  document.getElementById("invoice_history_internal_div").style.display = "none";
  document.getElementById("invoice_from_history_content").style.display = "";
  document.getElementById("exit_invoice_from_history_button").style.display = "";
  var _invoice_obj = _content_invoice_history[index];
  _current_viewed_invoice_data = _invoice_obj;
  var htmlToAdd = INVOICE_PRE;
  for (var i = 0; i < _invoice_obj.invoice_parts.length; ++i) {
    var invoice_parts = _invoice_obj.invoice_parts[i];

    // if(i < _invoice_objs.length)
    // {
    //Add filled row
    var specialOrder = 0;
    if (invoice_parts.length > 4)
      specialOrder = Number(invoice_parts[4]);
    var specialOrderField = "";
    if (specialOrder > 0) {
      specialOrderField = "<input type='text' style='width: 20px; height: 15px; text-align: right; font-weight: bold;' id='invoice_input_specialorder_" + i + "' value='" + specialOrder + "'><b> S.O.</b>";
    }
    htmlToAdd += "<tr class='in_td'><td>"
      + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_qty_" + i + "' value='" + getHTMLSafeText(invoice_parts[0]) + "'>" + specialOrderField + "</td><td>"
      + "<input type='text' style='width: 493px; height: 15px;' value='" + getHTMLSafeText(invoice_parts[1]) + "' id='invoice_input_desc_" + i + "' >";
    var orderinfo = ""; //Helps ensure that past orders before update have the chance to have order info added
    if (invoice_parts.length > 5) {
      if (invoice_parts[5] == "NULL")
        orderinfo = null;
      else
        orderinfo = invoice_parts[5];
    }
    if (orderinfo != null)
      htmlToAdd += "<br><input type='text' style='width: 493px; height: 15px;' value='" + getHTMLSafeText(orderinfo) + "' id='invoice_input_orderinfo_" + i + "' placeholder='Customer Name and Phone, Order Number, Tracking Number, Web Link, etc.'>";

    htmlToAdd += "</td><td>"
      + "<input type='text' style='width: 48px; height: 15px; text-align: right;' id='invoice_input_sell_" + i + "' value='" + getHTMLSafeText(invoice_parts[2]) + "' onfocus='deselectTable();' onkeyup='calculateInvoiceAmounts();' oninput='calculateInvoiceAmounts();'></td><td>"
      + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_amount_" + i + "' value='" + getHTMLSafeText(invoice_parts[3]) + "' ></td><td class='no-print'></tr>";
    // }
    // else
    // {
    //Add empty row
    // htmlToAdd += "<tr class='in_td'><td></td><td></td><td></td><td></td><td class='no-print'></td></tr>";
    // }
  }
  //Add post invoice html
  htmlToAdd += INVOICE_POST;
  htmlToAdd += "<button id='button_viewInvoice_delete'        style='               position: absolute; left: 750px;            background-color: #70A2FF; color: red;'   onclick='startDeleteInvoice();'  ><span style='color: white;'>D</span>elete</button>";
  htmlToAdd += "<button id='button_viewInvoice_confirmdelete' style='display: none; position: absolute; left: 750px;            background-color: #70A2FF; color: red;'   onclick='confirmDeleteInvoice();'>Confirm <span style='color: white;'>D</span>elete</button>";
  htmlToAdd += "<button id='button_viewInvoice_canceldelete'  style='display: none; position: absolute; left: 750px; top: 60px; background-color: #70A2FF; color: black;' onclick='cancelDeleteInvoice();' ><span style='color: white;'>C</span>ancel Delete</button>";
  htmlToAdd += "<button id='button_invoice_save' class='no-print' onclick=saveInvoiceFromHistory(); style='width:150px; height:50px; font-size:30px; position:absolute; top:90px; left:900px; background-color: #70A2FF; color: black;'><span style='color: white;'>S</span>ave</button>";

  document.getElementById("invoice_from_history_content").innerHTML = htmlToAdd;

  document.getElementById("invoice_input_invoice_no").value = _invoice_obj.invoice_no;
  document.getElementById("invoice_input_date").value = _invoice_obj.date;
  document.getElementById("invoice_input_customer_order_no").value = _invoice_obj.customer_order_no;
  document.getElementById("invoice_input_name").value = _invoice_obj.name;
  document.getElementById("invoice_input_address").value = _invoice_obj.address;
  document.getElementById("invoice_input_citystatezip").value = _invoice_obj.citystatezip;
  document.getElementById("invoice_input_phone").value = _invoice_obj.phone;
  document.getElementById("invoice_input_soldby").value = _invoice_obj.soldby;
  document.getElementById("invoice_textarea_specs").value = _invoice_obj.specs;
  document.getElementById("invoice_textarea_misc").value = _invoice_obj.misc;
  document.getElementById("invoice_input_total").value = _invoice_obj.total;
  document.getElementById("invoice_input_signature").value = _invoice_obj.signature;
  document.getElementById("invoice_bottom_textarea_2").style.display = "none";
  document.getElementById("button_finish_sale").style.display = "none";
}

function saveInvoiceFromHistory() {
  var ele;
  ele = document.getElementById("invoice_input_customer_order_no");
  if (ele != null)
    _current_viewed_invoice_data.customer_order_no = ele.value;
  ele = document.getElementById("invoice_input_name");
  if (ele != null)
    _current_viewed_invoice_data.name = ele.value;
  ele = document.getElementById("invoice_input_address");
  if (ele != null)
    _current_viewed_invoice_data.address = ele.value;
  ele = document.getElementById("invoice_input_citystatezip");
  if (ele != null)
    _current_viewed_invoice_data.citystatezip = ele.value;
  ele = document.getElementById("invoice_input_phone");
  if (ele != null)
    _current_viewed_invoice_data.phone = ele.value;
  ele = document.getElementById("invoice_input_soldby");
  if (ele != null)
    _current_viewed_invoice_data.soldby = ele.value;
  ele = document.getElementById("invoice_textarea_specs");
  if (ele != null)
    _current_viewed_invoice_data.specs = ele.value;
  ele = document.getElementById("invoice_textarea_misc");
  if (ele != null)
    _current_viewed_invoice_data.misc = ele.value;
  ele = document.getElementById("invoice_input_signature");
  if (ele != null)
    _current_viewed_invoice_data.signature = ele.value;
  ele = document.getElementById("invoice_bottom_textarea_2");
  if (ele != null)
    _current_viewed_invoice_data.bottom = ele.value;
  ele = document.getElementById("invoice_input_total");
  if (ele != null)
    _current_viewed_invoice_data.total = ele.value;
  ele = document.getElementById("invoice_input_invoice_no");
  if (ele != null)
    _current_viewed_invoice_data.invoice_no = ele.value;
  ele = document.getElementById("invoice_input_date");
  if (ele != null)
    _current_viewed_invoice_data.date = ele.value;

  var i = 0;
  ele = document.getElementById("invoice_input_qty_" + i);
  var invoice_parts = [];
  while (ele != null) {
    invoice_parts.push([]);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_desc_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_sell_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_amount_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_specialorder_" + i);
    if (ele != null)
      invoice_parts[i].push(ele.value);
    else
      invoice_parts[i].push("0");

    ele = document.getElementById("invoice_input_orderinfo_" + i);
    if (ele != null)
      invoice_parts[i].push(ele.value);
    else
      invoice_parts[i].push("NULL");
    ++i;
    ele = document.getElementById("invoice_input_qty_" + i);
  }
  _current_viewed_invoice_data.invoice_parts = invoice_parts;
  writeToDatabase('invoice_data/' + _current_viewed_invoice_data.key, _current_viewed_invoice_data, false, false, false, null);
  document.getElementById("exit_invoice_from_history_button").click();
  document.getElementById("button_update_invoice_history").click();
  showSnackbar("Invoice successfully saved", 3000);
}

function exitInvoiceFromHistory() {
  document.getElementById("non_invoice_content").style.display = "";
  document.getElementById("invoice_history_internal_div").style.display = "";
  document.getElementById("invoice_from_history_content").style.display = "none";
  document.getElementById("exit_invoice_from_history_button").style.display = "none";
}

function exitInvoiceFromNew() {
  if (last_selected_tab != TAB_ADD_INVOICE)
    setTab(last_selected_tab);
  else
    setTab(TAB_MAINMENU);
}

function clearInvoiceFilters() {
  var date0 = new Date(FILTER_TIME_START);
  var date1 = new Date();
  $('#invoice_history_filter_time').data('daterangepicker').setStartDate(date0);
  $('#invoice_history_filter_time').data('daterangepicker').setEndDate(date1);
  document.getElementById("invoice_history_filter_name").value = "";
  document.getElementById("invoice_history_filter_total").value = "";
  document.getElementById("invoice_history_filter_invoice_no").value = "";
  document.getElementById("invoice_history_filter_invoice_any_field").value = "";
  _invoice_filter_date_start = date0.getTime();
  _invoice_filter_date_end = date1.getTime();
  populateInvoiceHistory();
}

function exitInvoice() {
  if (last_selected_tab != TAB_INVOICE)
    setTab(last_selected_tab);
  else
    setTab(TAB_MAINMENU);
}

function populateAddNewInvoice() {
  clearInvoicesContent();
  document.getElementById("non_invoice_content").style.display = "none";
  document.getElementById("add_invoice_content").style.display = "";
  document.getElementById("exit_invoice_from_new_button").style.display = "";
  var htmlToAdd = INVOICE_PRE;
  htmlToAdd += INVOICE_POST;
  htmlToAdd += "<button id='button_addInvoice_save'   style='position: absolute;             left: 750px; background-color: #70A2FF; color: black;' onclick='addInvoice_Save();'       ><span style='color: white;'>S</span>ave</button>";
  htmlToAdd += "<button id='button_addInvoice_cancel' style='position: absolute;             left: 810px; background-color: #70A2FF; color: black;' onclick='exitInvoiceFromNew();'    ><span style='color: white;'>C</span>ancel</button>";
  htmlToAdd += "<button id='button_addInvoice_addrow' style='position: absolute; top: 420px; left: 750px; background-color: #70A2FF; color: black;' onclick='addInvoice_AddTableRow();'><span style='color: white;'>A</span>dd Row</button>";
  document.getElementById("add_invoice_content").innerHTML = htmlToAdd;
  // document.getElementById("invoice_input_total").disabled = false;
  addInvoice_AddTableRow();
  removeElement("button_finish_sale");
}

function saveInvoiceInfoToDatabase() {
  var address = document.getElementById("invoice_address_textarea").value;
  var bottom = document.getElementById("invoice_bottom_textarea").value;
  var lastorderno = document.getElementById("invoice_last_invoice_no_input").value;

  var obj = new Object();
  obj.address = address;
  obj.bottom = bottom;
  obj.last_invoice_no = lastorderno;
  writeToDatabase("invoice", obj, false, false, false, null);
  writeToChangeHistory("Edit | Invoice Settings", "Edited Invoice Settings | Address: \"" + obj.address + "\" | Info at bottom: \"" + obj.bottom + "\" | Invoice No: \"" + obj.last_invoice_no + "\"");

  // writeToDatabase("invoice/address", address, false, false, false, null);
  // writeToDatabase("invoice/bottom", bottom, false, false, false, null);
  // writeToDatabase("invoice/last_invoice_no", lastorderno, false, false, false, null);
  document.getElementById("invoice_info_button_save").style.display = "none";
}

function onInvoiceInfoChange() {
  document.getElementById("invoice_info_button_save").style.display = "block";
}

function calculateInvoiceAmounts() {
  var numTotalRows = _invoice_objs.length;
  var total = 0;
  for (var i = 0; i < numTotalRows; ++i) {
    _invoice_objs[i].SELL = document.getElementById("invoice_input_sell_" + i).value;
    var amount = Number(document.getElementById("invoice_input_qty_" + i).value) * Number(document.getElementById("invoice_input_sell_" + i).value);
    total += amount;
    document.getElementById("invoice_input_amount_" + i).value = amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  }
  var ele = document.getElementById("invoice_input_total");
  if (ele != null) //If Invoice has parts in it, and in turn is generating HTML
    document.getElementById("invoice_input_total").value = total.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function calculateAddInvoiceAmounts() {
  var table = document.getElementById("table_invoice_parts");
  var numTotalRows = table.rows.length - 4;
  var total = 0;
  for (var i = 0; i < numTotalRows; ++i) {
    var qty = Number(table.rows[i + 1].cells[0].children[0].value);
    var price = Number(table.rows[i + 1].cells[2].children[0].value);
    var amount = qty * price;
    total += amount;
    table.rows[i + 1].cells[3].children[0].value = amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  }
  var ele = document.getElementById("invoice_input_total");
  if (ele != null) //If Invoice has parts in it, and in turn is generating HTML
    document.getElementById("invoice_input_total").value = total.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function removeFromInvoice(index) {
  var invoice_obj = _invoice_objs[index];
  var link = getContentExtraIndexFrom_DB_ID(invoice_obj.partkey, invoice_obj.extradb);
  if (link != null) {
    var content_obj = _content_extra[invoice_obj.extradb][link][0];
    var newAmount = Number(content_obj.SHOP_QTY) + Number(invoice_obj.amountToSell);
    content_obj.SHOP_QTY = newAmount;
    if (!_DEBUG_LOCAL_MODE) {
      writeToDatabase("parts_db/" + _EXTRA_DB[invoice_obj.extradb] + "/" + invoice_obj.partkey, content_obj, true, false, true, invoice_obj.extradb);
    }
    showSnackbar("Added <u>" + invoice_obj.amountToSell + "</u> " + content_obj.PN + " back into inventory", 3000);

    var parentRecordIndex = getParentIndexFromID(invoice_obj.parent_record_id);
    if (parentRecordIndex != null)
      updateReorder(parentRecordIndex);
  }
  else {
    window.alert("Couldn't find part in database! Failed to add quantity back into inventory!");
  }
  _invoice_objs.splice(index, 1);
  populateInvoice();
  calculateInvoiceAmounts();
}

function finishInvoiceSale() {
  saveInvoiceToObject();
  for (var i = 0; i < _invoice_objs.length; ++i) { //Save part history to database
    var obj = _invoice_objs[i];
    var obj2 = _invoice_data.invoice_parts[i];
    var quantity = obj2[0];
    var price = obj2[2];
    // var date = new Date(String(_invoice_data.date));
    var datenow = new Date();
    savePartToHistory(obj.partkey, obj.extradb, datenow.getTime(), quantity, price);
  }

  _invoice_objs = [];
  populateInvoice();
  writeToDatabase("invoice/last_invoice_no", Number(document.getElementById("invoice_last_invoice_no_input").value) + 1, false, false, false, null);

  var invoiceDataListRef = getDatabaseRef('invoice_data');
  var newInvoiceRef = invoiceDataListRef.push();
  _invoice_data.bottom = null;
  _invoice_data.time = datenow.getTime();
  writeToDatabase('invoice_data/' + newInvoiceRef.key, _invoice_data, false, false, false, null);
  _invoice_data = new Object();
  showSnackbar("Sale Finished!", 3000);
  setTab(TAB_MAINMENU);
}

function saveInvoiceToObject() {
  var ele;
  ele = document.getElementById("invoice_input_customer_order_no");
  if (ele != null)
    _invoice_data.customer_order_no = ele.value;
  ele = document.getElementById("invoice_input_name");
  if (ele != null)
    _invoice_data.name = ele.value;
  ele = document.getElementById("invoice_input_address");
  if (ele != null)
    _invoice_data.address = ele.value;
  ele = document.getElementById("invoice_input_citystatezip");
  if (ele != null)
    _invoice_data.citystatezip = ele.value;
  ele = document.getElementById("invoice_input_phone");
  if (ele != null)
    _invoice_data.phone = ele.value;
  ele = document.getElementById("invoice_input_soldby");
  if (ele != null)
    _invoice_data.soldby = ele.value;
  ele = document.getElementById("invoice_textarea_specs");
  if (ele != null)
    _invoice_data.specs = ele.value;
  ele = document.getElementById("invoice_textarea_misc");
  if (ele != null)
    _invoice_data.misc = ele.value;
  ele = document.getElementById("invoice_input_signature");
  if (ele != null)
    _invoice_data.signature = ele.value;
  ele = document.getElementById("invoice_bottom_textarea_2");
  if (ele != null)
    _invoice_data.bottom = ele.value;
  ele = document.getElementById("invoice_input_total");
  if (ele != null)
    _invoice_data.total = ele.value;
  ele = document.getElementById("invoice_input_invoice_no");
  if (ele != null)
    _invoice_data.invoice_no = ele.value;
  ele = document.getElementById("invoice_input_date");
  if (ele != null)
    _invoice_data.date = ele.value;

  var i = 0;
  ele = document.getElementById("invoice_input_qty_" + i);
  var invoice_parts = [];
  while (ele != null) {
    invoice_parts.push([]);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_desc_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_sell_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_amount_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_specialorder_" + i);
    invoice_parts[i].push(ele.value);
    ele = document.getElementById("invoice_input_orderinfo_" + i);
    if (ele != null) {
      _invoice_objs[i].orderinfo = ele.value;
      invoice_parts[i].push(ele.value);
    }
    else {
      _invoice_objs[i].orderinfo = "NULL";
      invoice_parts[i].push("NULL");
    }

    ++i;
    ele = document.getElementById("invoice_input_qty_" + i);
  }
  _invoice_data.invoice_parts = invoice_parts;
}

var retrieveInvoiceDataCallback = null;
function retrieveInvoiceDataFromDatabase(callback) {
  if (_LOCAL_SERVER_MODE || _firebaseAuthUID == _admin_uid || _writeable_mode) {
    document.getElementById("button_update_invoice_history").style.display = "none";
    retrieveInvoiceDataCallback = callback;
    readFromDB("invoice_data", function (val0, key0) {
      _content_invoice_history = [];
      for (let [key, val] of Object.entries(val0)) {
        var invoice_obj = val;
        invoice_obj.key = key;
        _content_invoice_history.push(invoice_obj);
      }
      if (retrieveInvoiceDataCallback != null)
        retrieveInvoiceDataCallback();
      document.getElementById("button_update_invoice_history").style.display = "";
    });
  }
}

function clearInvoicesContent() {
  document.getElementById("invoice_content").innerHTML = "";
  document.getElementById("invoice_from_history_content").innerHTML = "";
  document.getElementById("add_invoice_content").innerHTML = "";
}

function addInvoice_AddTableRow() {
  var table_ele = document.getElementById("table_invoice_parts");
  var len = table_ele.rows.length - 3;
  var row = table_ele.insertRow(len);
  row.innerHTML += "<tr class='in_td'><td>"
    + "<input                              type='text' style='width: 53px; height: 15px; text-align: right;' onkeyup='calculateAddInvoiceAmounts();' oninput='calculateAddInvoiceAmounts();'></td><td>" //Quantity
    + "<input                              type='text' style='width: 493px; height: 15px;'                  ></td><td>" //Description
    + "<input id='input_addinvoice_price'  type='text' style='width: 48px; height: 15px; text-align: right;' onfocus='deselectTable();' onkeyup='calculateAddInvoiceAmounts();' oninput='calculateAddInvoiceAmounts();'></td><td>" //Price
    + "<input id='input_addinvoice_amount' type='text' style='width: 53px; height: 15px; text-align: right;' disabled></td><td class='no-print'>" //Amount
    + "<button id='button_addInvoice_remove_0' style='width: 20px; height: 20px; padding: 0px; color: white; background-color: red;' tabindex='-1' onclick='addInvoice_DeleteTableRow(this.parentElement.parentElement.rowIndex);'>x</button></td></tr>";
  row.cells[0].children[0].focus();
}

function addInvoice_DeleteTableRow(index) {
  var table_ele = document.getElementById("table_invoice_parts");
  table_ele.deleteRow(index);
}

function addInvoice_Save() {
  var _invoice_data = new Object();
  var ele;
  ele = document.getElementById("invoice_input_invoice_no");
  if (ele != null)
    _invoice_data.invoice_no = ele.value;
  ele = document.getElementById("invoice_input_date");
  if (ele != null)
    _invoice_data.date = ele.value;
  ele = document.getElementById("invoice_input_customer_order_no");
  if (ele != null)
    _invoice_data.customer_order_no = ele.value;
  ele = document.getElementById("invoice_input_name");
  if (ele != null)
    _invoice_data.name = ele.value;
  ele = document.getElementById("invoice_input_address");
  if (ele != null)
    _invoice_data.address = ele.value;
  ele = document.getElementById("invoice_input_citystatezip");
  if (ele != null)
    _invoice_data.citystatezip = ele.value;
  ele = document.getElementById("invoice_input_phone");
  if (ele != null)
    _invoice_data.phone = ele.value;
  ele = document.getElementById("invoice_input_soldby");
  if (ele != null)
    _invoice_data.soldby = ele.value;
  ele = document.getElementById("invoice_textarea_specs");
  if (ele != null)
    _invoice_data.specs = ele.value;
  ele = document.getElementById("invoice_textarea_misc");
  if (ele != null)
    _invoice_data.misc = ele.value;
  ele = document.getElementById("invoice_input_total");
  if (ele != null)
    _invoice_data.total = ele.value;
  ele = document.getElementById("invoice_input_signature");
  if (ele != null)
    _invoice_data.signature = ele.value;
  ele = document.getElementById("invoice_bottom_textarea_2");
  if (ele != null)
    _invoice_data.bottom = ele.value;

  var table = document.getElementById("table_invoice_parts");
  var numTotalRows = table.rows.length - 4;
  var total = 0;
  var invoice_parts = [];
  for (var i = 0; i < numTotalRows; ++i) {
    var row = [];
    row.push(table.rows[i + 1].cells[0].children[0].value);
    row.push(table.rows[i + 1].cells[1].children[0].value);
    row.push(table.rows[i + 1].cells[2].children[0].value);
    row.push(table.rows[i + 1].cells[3].children[0].value);
    if (table.rows[i + 1].cells[1].children.length > 1)
      row.push(table.rows[i + 1].cells[1].children[1].value);
    else
      row.push("NULL");
    invoice_parts.push(row);
  }
  _invoice_data.invoice_parts = invoice_parts;

  var invoiceDataListRef = getDatabaseRef('invoice_data');
  var newInvoiceRef = invoiceDataListRef.push();
  _invoice_data.bottom = null;
  writeToDatabase('invoice_data/' + newInvoiceRef.key, _invoice_data, false, false, false, null);
  writeToChangeHistory("Add | Invoice", "New Invoice no. \"" + _invoice_data.invoice_no + "\"");
  showSnackbar("Invoice Saved", 3000);
  exitInvoiceFromNew();
}

function startDeleteInvoice() {
  document.getElementById("button_viewInvoice_delete").style.display = "none";
  document.getElementById("button_viewInvoice_confirmdelete").style.display = "";
  document.getElementById("button_viewInvoice_canceldelete").style.display = "";
}

function confirmDeleteInvoice() {
  // console.log(_content_invoice_history);
  deleteFromDatabase("invoice_data/" + _current_viewed_invoice_id, false, false, false, null);
  exitInvoiceFromHistory();
  clickInvoiceHistory_Update();
}

function cancelDeleteInvoice() {
  document.getElementById("button_viewInvoice_delete").style.display = "";
  document.getElementById("button_viewInvoice_confirmdelete").style.display = "none";
  document.getElementById("button_viewInvoice_canceldelete").style.display = "none";
}