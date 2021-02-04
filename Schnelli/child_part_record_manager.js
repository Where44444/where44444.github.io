var _selected_child_part_db = null;
var _selected_child_part_record = null;
function populateChildPartRecordManager()
{
  clickPCRM_NewCancelButton();
  if(_selected_child_part_db != null && _selected_child_part_record != null)
  {
    var htmlToAdd = 
      "<button id='partchild_edit_button_save'           style='margin: 5px;                background-color: #70A2FF; color: black;' onclick='saveEditPartChild();'     ><span style='color: white;'>S</span>ave</button>" 
    + "<button id='partchild_edit_button_cancel'         style='margin: 5px;                background-color: #70A2FF; color: black;' onclick='cancelEditPartChild();'   ><span style='color: white;'>C</span>ancel</button>"
    + "<button id='partchild_edit_button_delete'         style='margin: 5px;                background-color: #70A2FF; color: red;'   onclick='startDeleteEditPartChild();'><span style='color: white;'>D</span>elete</button>"
    + "<button id='partchild_edit_button_confirm_delete' style='display: none; margin: 5px; background-color: #70A2FF; color: red;'   onclick='confirmDeleteEditPartChild();'>Confirm <span style='color: white;'>D</span>elete</button>"
    + "<button id='partchild_edit_button_cancel_delete'  style='display: none; margin: 5px; background-color: #70A2FF; color: black;' onclick='populateChildPartRecordManager();'><span style='color: white;'>C</span>ancel Delete</button>"
    + "<table>";
    var extraobj = _content_extra[_selected_child_part_db][_selected_child_part_record][0];
    for (let [key, value] of Object.entries(extraobj)) 
    {
      htmlToAdd += "<tr><th>" + key + "</th>";
      htmlToAdd += "<td><input type='text' onfocus='deselectTable();' id='partchild_edit_input_" + key + "' value='" + getHTMLSafeText(value) + "' style='width: 1000px;'></td></tr>";
    }
    htmlToAdd += "</table>";
    document.getElementById("part_child_edit_table_div").innerHTML = htmlToAdd;
  }
  else
    document.getElementById("part_child_edit_table_div").innerHTML = "";

  var ele = document.getElementById("partchild_edit_input_PN");
  if(ele != null)
  {
    ele.focus();
    ele.select();
  }
}

function startNewPartChild()
{
  clickPCRM_EditCancelButton();
  document.getElementById("part_child_button_new").style.display = "none";
  var db_index =  document.getElementById("part_child_dropdown_select").selectedIndex;
  if(db_index < _EXTRA_DB_COMMENTS_PREFIXES.length)
  {
    var htmlToAdd = 
    "<button id='partchild_new_button_save'           style='margin: 5px; background-color: #70A2FF; color: black;' onclick='saveNewPartChild();'  ><span style='color: white;'>S</span>ave</button>" 
  + "<button id='partchild_new_button_cancel'         style='margin: 5px; background-color: #70A2FF; color: black;' onclick='cancelNewPartChild();'><span style='color: white;'>C</span>ancel</button>"
  + "<table>";
    for (var i = 0; i < _EXTRA_DB_FIELDS[db_index].length; ++i) 
    {
      htmlToAdd += "<tr><th>" + _EXTRA_DB_FIELDS[db_index][i] + "</th>";
      htmlToAdd += "<td><input type='text' onfocus='deselectTable();' id='partchild_new_input_" + _EXTRA_DB_FIELDS[db_index][i] + "' style='width: 1000px;'></td></tr>";
    }
    htmlToAdd += "</table>";
    document.getElementById("part_child_new_table_div").innerHTML = htmlToAdd;
    var ele = document.getElementById("partchild_new_input_PN");
    if(ele != null){
      ele.focus();
      ele.select();
    }
  }
}

function saveEditPartChild()
{
  var extraobj = _content_extra[_selected_child_part_db][_selected_child_part_record][0];
  var newObj = new Object();
  for (let [key, value] of Object.entries(extraobj)) 
  {
    newObj[key] = document.getElementById("partchild_edit_input_" + key).value;
  }
  _content_extra[_selected_child_part_db][_selected_child_part_record][0] = newObj;
  if(!_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[_selected_child_part_db] + "/" + _content_extra[_selected_child_part_db][_selected_child_part_record][1], newObj, true, false, true, _selected_child_part_db);
  _selected_child_part_db = null;
  _selected_child_part_record = null;
  populateChildPartRecordManager();
  populateRecordViews();

  _CHILD_PART_LINKS_CACHE.clear();
}

function cancelEditPartChild()
{
  _selected_child_part_db = null;
  _selected_child_part_record = null;
  populateChildPartRecordManager();
}

function startDeleteEditPartChild() {
  document.getElementById("partchild_edit_button_save").style.display = "none";
  document.getElementById("partchild_edit_button_cancel").style.display = "none";
  document.getElementById("partchild_edit_button_delete").style.display = "none";
  document.getElementById("partchild_edit_button_confirm_delete").style.display = "";
  document.getElementById("partchild_edit_button_cancel_delete").style.display = "";
}

function confirmDeleteEditPartChild() 
{
  if(!_LOCAL_MODE)
    deleteFromDatabase("parts_db/" + _EXTRA_DB[_selected_child_part_db] + "/" + _content_extra[_selected_child_part_db][_selected_child_part_record][1], true, false, true, _selected_child_part_db);
  _content_extra[_selected_child_part_db].splice(_selected_child_part_record, 1);
  _selected_child_part_db = null;
  _selected_child_part_record = null;
  populateChildPartRecordManager();
  populateRecordViews();

  _CHILD_PART_LINKS_CACHE.clear();
}

function cancelNewPartChild()
{
  document.getElementById("part_child_button_new").style.display = "";
  document.getElementById("part_child_new_table_div").innerHTML = "";
}

function setNewPartChildButton()
{
  var db_index =  document.getElementById("part_child_dropdown_select").selectedIndex;
  if(db_index < _EXTRA_DB.length)
  {
    document.getElementById("part_child_button_new").innerHTML = "<span style='color: white;'>A</span>dd New Child Record in " + _EXTRA_DB[db_index] + " +";
    document.getElementById("part_child_button_new").style.display = "";
  }
  else
    document.getElementById("part_child_button_new").style.display = "none";

}

function saveNewPartChild()
{
  var db_index =  document.getElementById("part_child_dropdown_select").selectedIndex;
  var newObj = new Object();
  for (var i = 0; i < _EXTRA_DB_FIELDS[db_index].length; ++i) 
  {
    newObj[_EXTRA_DB_FIELDS[db_index][i]] = document.getElementById("partchild_new_input_" + _EXTRA_DB_FIELDS[db_index][i]).value;
  }
  var newRef = getDatabaseRef("parts_db/" + _EXTRA_DB[db_index]).push();
  _content_extra[db_index].push([newObj, newRef.key])
  if(!_LOCAL_MODE)
    writeToDatabase("parts_db/" + _EXTRA_DB[db_index] + "/" + newRef.key, newObj, true, false, true, db_index);
  
  document.getElementById("part_child_button_new").style.display = "";
  document.getElementById("part_child_new_table_div").innerHTML = "";
  populateRecordViews();

  _CHILD_PART_LINKS_CACHE.clear();
}