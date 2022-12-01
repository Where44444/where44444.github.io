function updateReordersWorker_Local(startIndex, endIndex) {
  var content_rownums_changed = [];
  // var content_ids_changed = [];
  for (var i = startIndex; i <= endIndex; ++i) {
    var qty = 0;
    var contentChanged = false;
    for (var j = 0; j < _CONTENT_EXTRA_DB_INDEXES.length; ++j) {
      var childPN = _content[i][_CONTENT_EXTRA_DB_INDEXES[j]];
      var partObjIndex = getExtraDBLinkIndex(j, childPN);
      // var partObjIndex = getExtraDBLinkIndex2(i, j);

      if (partObjIndex != null) {
        var partObj = _content_extra[j][partObjIndex][0];
        qty += Number(partObj[CE_SHOP_QTY]);
      }
    }
    // var reorder = Number(_content[i][_REORD_QTY]);
    var bulk = Number(_content[i][_GET]);
    var keep = Number(_content[i][_KEEP]);
    if (bulk > 0) {
      if (qty < keep) {
        if (Number(_content[i][_REORD_QTY]) != bulk) {
          _content[i][_REORD_QTY] = String(bulk);
          contentChanged = true;
        }
      }
      else {
        if (Number(_content[i][_REORD_QTY]) != 0) {
          _content[i][_REORD_QTY] = "0";
          contentChanged = true;
        }
      }
    }
    else {
      if (qty < keep) {
        if (Number(_content[i][_REORD_QTY]) != keep - qty) {
          _content[i][_REORD_QTY] = String(keep - qty);
          contentChanged = true;
        }
      }
      else {
        if (Number(_content[i][_REORD_QTY]) != 0) {
          _content[i][_REORD_QTY] = "0";
          contentChanged = true;
        }
      }
    }
    if (contentChanged) {
      content_rownums_changed.push(i);
      // content_ids_changed.push(_content[i][_content[i].length - 1]);
    }
  }
  return content_rownums_changed;
}


var _slice_start = 0;
var _sliceSize = 2000;
var _slice_end = 0;
var _MAX_REORDER_CHANGEALERTS = 20;
function updateReordersRecursive() {
  var _content_rownums_changed = updateReordersWorker_Local(_slice_start, _slice_end);

  for (var i = 0; i < _content_rownums_changed.length; ++i) {
    var rownum = _content_rownums_changed[i];
    if (rownum != null && rownum < _content.length) {
      if (_content[rownum][_ORDERED] == "true" && _content[rownum][_REORD_QTY] == "0")
        _content[rownum][_ORDERED] = "false";
      if (_numReorderChangeAlertsSent < _MAX_REORDER_CHANGEALERTS) {
        saveContentToDatabase(rownum, true);
        ++_numReorderChangeAlertsSent;
      }
      else {
        saveContentToDatabase(rownum, false);
      }
      writeToChangeHistory("Edit | Parent Record", "Edited Parent Record from Update All Reorders with OEM_PN \"" + _content[rownum][_OEM_PN] + "\" REORD_QTY: \"" + _content[rownum][_REORD_QTY] + "\"");
    }
  }

  if (_slice_end < _content.length - 1) {
    _slice_start = _slice_end + 1;
    if (_slice_end + _sliceSize > _content.length - 1)
      _slice_end = _content.length - 1;
    else
      _slice_end += _sliceSize;
    showSnackbar("Updating reorders... " + Math.floor((_slice_end / _content.length) * 100) + "%", 10000);
    setTimeout(function () {
      updateReordersRecursive();
    }, 200);
  }
  else {
    _reorders_updating = false;
    document.getElementById("button_update_reorders").style.display = "";
    document.getElementById("button_export_reorders").style.display = "";
    updateReorderParentIDs();
    if (_numReorderChangeAlertsSent < _MAX_REORDER_CHANGEALERTS)
      showSnackbar("Reorders update complete!", 3000);
    else
      showSnackbar("Reorders update complete, too many changes were made to the database, other machines running PartScouter will need to restart the program!", 10000);
  }
}

var _reorders_updating = false;
var _numReorderChangeAlertsSent = 0;
function updateReorders() {
  _slice_start = 0;
  _slice_end = _sliceSize - 1;
  if (_content.length > 0) {
    _reorders_updating = true;
    document.getElementById("table_reorders_div").innerHTML = "";
    document.getElementById("button_update_reorders").style.display = "none";
    document.getElementById("button_export_reorders").style.display = "none";
    _numReorderChangeAlertsSent = 0;
    updateReordersRecursive();
  }
}

function updateReorder(rownum) {
  var qty = 0;
  var contentChanged = false;
  var originalObj = objFromContentRow(rownum);
  for (var j = 0; j < _CONTENT_EXTRA_DB_INDEXES.length; ++j) {
    var childPN = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
    var partObjIndex = getExtraDBLinkIndex(j, childPN);
    // var partObjIndex = getExtraDBLinkIndex2(rownum, j);
    if (partObjIndex != null) {
      var partObj = _content_extra[j][partObjIndex][0];
      qty += Number(partObj[CE_SHOP_QTY]);
    }
  }
  // var reorder = Number(_content[rownum][_REORD_QTY]);
  var bulk = Number(_content[rownum][_GET]);
  var keep = Number(_content[rownum][_KEEP]);
  if (bulk > 0) {
    if (qty < keep) {
      _content[rownum][_REORD_QTY] = String(bulk);
      contentChanged = true;
    }
    else {
      _content[rownum][_REORD_QTY] = "0";
      contentChanged = true;
    }
  }
  else {
    if (qty < keep) {
      _content[rownum][_REORD_QTY] = String(keep - qty);
      contentChanged = true;
    }
    else {
      _content[rownum][_REORD_QTY] = "0";
      contentChanged = true;
    }
  }
  if (contentChanged) {
    if (_content[rownum][_ORDERED] == "true" && _content[rownum][_REORD_QTY] == "0")
      _content[rownum][_ORDERED] = "false";
    saveContentToDatabase(rownum);
    var compare_str = getObjectCompareString(originalObj, objFromContentRow(rownum));
    if (compare_str != null)
      writeToChangeHistory("Edit | Parent Record", "Edited Parent Record from Reorders with OEM_PN \"" + originalObj.OEM_PN + "\" " + compare_str);
    updateReorderParentIDs();
  }
}

var _reorders_order_map = new Map();
var _reorder_parent_ids = [];
function updateReorderParentIDs() {
  if (!_reorders_updating) {
    _reorder_parent_ids = [];

    for (var i = 0; i < _content.length; ++i) {
      if (Number(_content[i][_REORD_QTY]) > 0) {
        _reorder_parent_ids.push(_content[i][_content[i].length - 1]);
      }
    }

    let purchaseOrderMap = new Map();
    for (var i = 0; i < _content_invoice_history.length; ++i) {
      var invoice = _content_invoice_history[i];
      let parts = invoice.invoice_parts;
      if (parts != null)
        for (let part of parts) {
          if (part != null && part.length >= 8) {
            var extradb = Number(part[6]);
            var id = part[7];
            var key = extradb + id;
            var obj = new Object();
            obj.po = invoice.customer_order_no;
            obj.qty = part[0];
            obj.soqty = part[4];
            obj.invoice_index = i;
            if (purchaseOrderMap.has(key)) {
              purchaseOrderMap.get(key).push(obj);
            }
            else {
              purchaseOrderMap.set(key, [obj]);
            }
          }
        }
    }

    var export_html = "<table><thead><tr>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>Description</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>Supplier/PN</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>PO's</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>Qty</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>SO Qty</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>Reord</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>Keep</th>"
      + "<th style='background-color: white; position: sticky; top: 0px; z-index: 2;'>Bulk</th></tr></thead>";
    var table_html = "<table><tr><th></th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Description</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Supplier/PN</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>PO's</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Qty</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>SO Qty</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Reord</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Keep</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Bulk</th></tr>";
    var supplierMap = new Map();
    for (var i = 0; i < _reorder_parent_ids.length; ++i) {
      var parent_id = _reorder_parent_ids[i];
      var rownum = getParentIndexFromID(parent_id);
      if (rownum != null) {
        var desc = _content[rownum][_DESCRIP1];
        for (var j = 0; j < _CONTENT_EXTRA_DB_INDEXES.length; ++j) {
          var childPN = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          if (childPN != "") {
            // desc += "<br>" + _EXTRA_DB_ACTUAL_INDEXES[j] + ": " + childPN;
            var partObjIndex = getExtraDBLinkIndex(j, childPN);
            // var partObjIndex = getExtraDBLinkIndex2(rownum, j);
            if (partObjIndex != null) {
              var id = _content_extra[j][partObjIndex][1];
              var supplier = standardizeString(_content_extra[j][partObjIndex][0][CE_FROM]);
              var pn = _content_extra[j][partObjIndex][0][CE_PN];
              if (!supplierMap.has(supplier)) {
                var obj = new Object();
                obj.name = _content_extra[j][partObjIndex][0][CE_FROM];
                obj.db = [j];
                obj.id = [id];
                obj.desc = [desc];
                obj.pn = [pn];
                obj.rownum = [rownum];
                supplierMap.set(supplier, obj);
              } else {
                supplierMap.get(supplier).db.push(j);
                supplierMap.get(supplier).id.push(id);
                supplierMap.get(supplier).desc.push(desc);
                supplierMap.get(supplier).pn.push(pn);
                supplierMap.get(supplier).rownum.push(rownum);
              }
            }
          }
        }
      }
    }

    var keys = [];
    for ([key, val] of supplierMap.entries())
      keys.push(key);
    keys.sort();

    if (keys.length > 0 && keys[0] == "") {
      keys.splice(0, 1);
      keys.push("");
    }


    var inc = 0;
    for (var key of keys) {
      var obj = supplierMap.get(key);
      if (obj.name == "")
        obj.name = "UNKNOWN";
      for (var i = 0; i < obj.db.length; ++i) {
        var rownum = obj.rownum[i];
        var desc = obj.desc[i];
        var key0 = obj.db[i] + obj.id[i];
        var pn = obj.name + " / " + obj.pn[i];
        var po = "";
        var qty = "";
        var so_qty = "";
        if (purchaseOrderMap.has(key0)) {
          var po_array = purchaseOrderMap.get(key0);
          for (var p = 0; p < po_array.length; ++p) {
            if (po != "") {
              po += "<br>";
              qty += "<br>";
              so_qty += "<br>";
            }
            po += "<span style='color: blue;' class='clickable' onclick='linkToInvoice(" + po_array[p].invoice_index + ");'><u>" + po_array[p].po + "</u></span>";
            qty += po_array[p].qty;
            so_qty += po_array[p].soqty;
          }
        }

        var parent_id = _content[rownum][_content[rownum].length - 1];
        var rowId = "\"" + parent_id + "\"";
        var orderButtonHTML = "<button id='button_reorder_order_" + inc + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='setOrdered(" + rowId + ", true);'>&nbsp;&nbsp;&nbsp;<span style='color: white;'>O</span>rder&nbsp;&nbsp;&nbsp;</button><br>";
        var rowcolor = "";
        if (_content[rownum][_ORDERED] == "true") {
          rowcolor = "lightgreen";
          orderButtonHTML = "<button id='button_reorder_order_" + inc + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='setOrdered(" + rowId + ", false);'>&nbsp;&nbsp;&nbsp;Un-<span style='color: white;'>O</span>rder&nbsp;&nbsp;&nbsp;</button><br>";
          _reorders_order_map.set(inc, true);
        }
        else
          _reorders_order_map.set(inc, false);

        table_html += "<tr id='table_reorders_row_" + inc + "' style='background: " + rowcolor + ";'>";
        table_html +=
          "<td>"
          + "<button id='button_reorder_addrecordview_" + inc + "'     style='background-color: #70A2FF; color: black;'                  onclick='addRecordView(\"" + parent_id + "\");'>Record <span style='color: white;'>V</span>iew</button><br>"
          + orderButtonHTML
          + "<button id='button_reorder_updaterow_" + inc + "'         style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='updateReorder(" + rownum + "); updateReorderParentIDs(); set_tableReorders_SelectedRow(" + inc + ");'>&nbsp;&nbsp;&nbsp;<span style='color: white;'>U</span>pdate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></td>"
          + "<td style='width: 150px;'>" + desc + "</td>"
          + "<td>" + pn + "</td>"
          + "<td>" + po + "</td>"
          + "<td>" + qty + "</td>"
          + "<td>" + so_qty + "</td>"
          + "<td>" + _content[rownum][_REORD_QTY] + "</td>"
          + "<td>" + _content[rownum][_KEEP] + "</td>"
          + "<td>" + _content[rownum][_GET] + "</td>";
        table_html += "</tr>";

        export_html += "<tr>";
        export_html +=
          "<td style='width: 150px;'>" + desc + "</td>"
          + "<td>" + pn + "</td>"
          + "<td>" + po + "</td>"
          + "<td>" + qty + "</td>"
          + "<td>" + so_qty + "</td>"
          + "<td>" + _content[rownum][_REORD_QTY] + "</td>"
          + "<td>" + _content[rownum][_KEEP] + "</td>"
          + "<td>" + _content[rownum][_GET] + "</td>";
        export_html += "</tr>";
        ++inc;
      }
    }

    table_html += "</table>";
    export_html += "</table><br><br><br>";
    document.getElementById("table_reorders_div").innerHTML = table_html;
    if (!set_tableReorders_SelectedRow(_table_reorders_selected_row)) {
      _table_reorders_selected_row = -1;
      set_tableReorders_SelectedRow(0);
    }
    if (reorder_export_requested)
      exportReorders(export_html);
  }
}

function setOrdered(rowID, bool) {
  var index = getContentIndexFrom_DB_ID(rowID);
  if (index != null) {
    _content[index][_ORDERED] = String(bool);
    saveContentToDatabase(index, true);
    updateReorderParentIDs();
  }
}

function updateReordFromRecordView(parentRecordID) {
  var rownum = getParentIndexFromID(parentRecordID);
  if (rownum != null) {
    updateReorder(rownum);
  }
  populateRecordViews();
}

var reorder_export_requested = false;
function exportReorders(text) {
  if (!reorder_export_requested) {
    reorder_export_requested = true;
    updateReorders();
  }
  else if (!_reorders_updating) {
    reorder_export_requested = false;
    startEmail("Reorders", text);
  }
}

function linkToInvoice(index) {
  viewInvoiceFromHistory(index);
}