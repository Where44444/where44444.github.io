function updateReordersWorker_Local(startIndex, endIndex) {
  var content_rownums_changed = [];
  var content_ids_changed = [];
  for (var i = startIndex; i <= endIndex; ++i) {
    var qty = 0;
    var contentChanged = false;
    for (var j = 0; j < _CONTENT_EXTRA_DB_INDEXES.length; ++j) {
      var childPN = _content[i][_CONTENT_EXTRA_DB_INDEXES[j]];
      var partObjIndex = getExtraDBLinkIndex(j, childPN);
      if (partObjIndex != null) {
        var partObj = _content_extra[j][partObjIndex][0];
        qty += Number(partObj.SHOP_QTY);
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
      content_ids_changed.push(_content[i][_content[i].length - 1]);
    }
  }
  return [content_ids_changed, content_rownums_changed];
}


var _slice_start = 0;
var _sliceSize = 2000;
var _slice_end = 0;
var _MAX_REORDER_CHANGEALERTS = 20;
function updateReordersRecursive() {
  var data = updateReordersWorker_Local(_slice_start, _slice_end);
  // var content_ids_changed = data[0];
  var content_rownums_changed = data[1];

  for (var i = 0; i < content_rownums_changed.length; ++i) {
    var rownum = content_rownums_changed[i];
    if (rownum != null) {
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
    if (partObjIndex != null) {
      var partObj = _content_extra[j][partObjIndex][0];
      qty += Number(partObj.SHOP_QTY);
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
    saveContentToDatabase(rownum);
    var compare_str = getObjectCompareString(originalObj, objFromContentRow(rownum));
    if (compare_str != null)
      writeToChangeHistory("Edit | Parent Record", "Edited Parent Record from Reorders with OEM_PN \"" + originalObj.OEM_PN + "\" " + compare_str);
    updateReorderParentIDs();
  }
}

var _reorder_parent_ids = [];
function updateReorderParentIDs() {
  if (!_reorders_updating) {
    _reorder_parent_ids = [];
    for (var i = 0; i < _content.length; ++i) {
      if (Number(_content[i][_REORD_QTY]) > 0) {
        _reorder_parent_ids.push(_content[i][_content[i].length - 1]);
      }
    }

    var table_html = "<table><tr><th></th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Descrip 1</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Descrip 2</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Reord</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Keep</th>"
      + "<th style='background-color: white; position: sticky; top: " + _top_bar_height + "; z-index: 2;'>Bulk</th></tr>";
    var inc = 0;
    for (var i = 0; i < _reorder_parent_ids.length; ++i) {
      var parent_id = _reorder_parent_ids[i];
      var rownum = getParentIndexFromID(parent_id);
      if (rownum != null) {
        table_html += "<tr id='table_reorders_row_" + inc + "'>";
        table_html +=
          "<td>"
          + "<button id='button_reorder_addrecordview_" + inc + "'     style='background-color: #70A2FF; color: black;'                  onclick='addRecordView(\"" + parent_id + "\");'>Record <span style='color: white;'>V</span>iew</button><br>"
          + "<button id='button_reorder_jumprecordbrowser_" + inc + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='populateRecordBrowser(" + rownum + ",true); setTab(" + TAB_RECORD_BROWSER + ");'>&nbsp;&nbsp;&nbsp;<span style='color: white;'>B</span>rowser&nbsp;&nbsp;&nbsp;</button><br>"
          + "<button id='button_reorder_updaterow_" + inc + "'         style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='updateReorder(" + rownum + "); updateReorderParentIDs();'>&nbsp;&nbsp;&nbsp;<span style='color: white;'>U</span>pdate&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button></td><td>"
          + _content[rownum][_DESCRIP1] + "</td><td>"
          + _content[rownum][_DESCRIP2] + "</td><td>"
          + _content[rownum][_REORD_QTY] + "</td><td>"
          + _content[rownum][_KEEP] + "</td><td>"
          + _content[rownum][_GET] + "</td>";
        table_html += "</tr>";
        ++inc;
      }
    }
    table_html += "</table>";
    document.getElementById("table_reorders_div").innerHTML = table_html;
    if (!set_tableReorders_SelectedRow(_table_reorders_selected_row))
      set_tableReorders_SelectedRow(0);
  }
}

function updateReordFromRecordView(parentRecordID) {
  var rownum = getParentIndexFromID(parentRecordID);
  if (rownum != null) {
    updateReorder(rownum);
  }
  populateRecordViews();
}