var _recordViews = [];
// var _recordViews_Key_To_Details_Open = new Map();
var _recordViewHightlightType = 0;
var _selected_record_view = 0;
var _last_selected_record_view = 0;
var _RECORDVIEW_COMPAREALL_MINREPITITIONS = 2;
const rv_fontsize = "12px";

var _record_view_to_edit = null;
function populateRecordViews() {
  var i = 0;
  while (i < _recordViews.length) { //Remove record views that have been deleted in record browser or elsewhere
    var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
    if (rownum != null)
      ++i;
    else
      _recordViews.splice(i, 1);
  }

  var singleWordsToOccurences = new Map(); //Standardized (word) to      [[num occurences, color],             [actual word spellings], [row nums]]
  var doubleWordsToOccurences = new Map(); //Standardized (word word) to [[num occurences, color, word, word], [actual word spellings], [row nums]]
  var termToHighlightList = [];
  var preHTML_List = [];
  var postHTML_List = [];
  if (_recordViewHightlightType == 2) //Show Compare All
  {
    var array1 = [];
    for (var i = 0; i < _recordViews.length; ++i) {
      array1.push([]);
      var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
      if (rownum != null) {
        var equip_type_text = _content[rownum][_EQUIP_TYPE];
        var appl_brand_text = _content[rownum][_APPL_BRAND];
        var descrip1_text = _content[rownum][_DESCRIP1];
        var descrip2_text = _content[rownum][_DESCRIP2];
        var comments_text = _content[rownum][_COMMENTS];
        array1[i] = [equip_type_text, appl_brand_text, descrip1_text, descrip2_text, comments_text];
      }
    }
    //Get string repetition info---------------------------------------------
    for (var i = 0; i < array1.length; ++i) {
      var row = array1[i];
      for (var j = 0; j < 5; ++j) {
        var string = row[j];
        var lastCharWasSpace = true;
        var start0 = 0;
        var end = 0;
        var start1 = 0;
        for (var k = 0; k < string.length; ++k) {
          var char = string[k];
          var charIsSpace = (char == " ");
          var endOfString = (k + 1 == string.length);
          if (lastCharWasSpace && !charIsSpace) { //Beginning of word
            start0 = start1;
            start1 = k;
          }
          else if ((!lastCharWasSpace && charIsSpace) || endOfString) { //Space at end of word or end of string
            if (endOfString)
              end = k + 1;
            else
              end = k;
            var singleWord = string.substring(start1, end);
            var singleWordStandard = standardizeString(singleWord);
            if (!_WORDS_TO_IGNORE.includes(singleWordStandard) && singleWordStandard.length > 1) {
              if (singleWordsToOccurences.has(singleWordStandard)) {
                var value = singleWordsToOccurences.get(singleWordStandard)
                value[0][0] = value[0][0] + 1;
                if (!value[2].includes(i))
                  value[2].push(i);
                if (!value[1].includes(singleWord)) {
                  value[1].push(singleWord);
                }
              }
              else {
                // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                var color = getColorFromString(singleWordStandard);
                var value = [[1, color], [singleWord], [i]];
                singleWordsToOccurences.set(singleWordStandard, value);
              }
            }
            if (start0 != start1) {
              var doubleWord = string.substring(start0, end);
              var doubleWordStandard = standardizeString(doubleWord);
              var doubleWordSplit = doubleWordStandard.split(" ");
              if (!_WORDS_TO_IGNORE.includes(doubleWordSplit[0]) && !_WORDS_TO_IGNORE.includes(doubleWordSplit[1]) && doubleWordStandard.length > 3) {
                if (doubleWordsToOccurences.has(doubleWordStandard)) {
                  var value = doubleWordsToOccurences.get(doubleWordStandard)
                  value[0][0] = value[0][0] + 1;
                  if (!value[2].includes(i))
                    value[2].push(i);
                  if (!value[1].includes(doubleWord)) {
                    value[1].push(doubleWord);
                  }
                }
                else {
                  // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                  var color = getColorFromString(doubleWordStandard);
                  var value = [[1, color, doubleWordSplit[0], doubleWordSplit[1]], [doubleWord], [i]];
                  doubleWordsToOccurences.set(doubleWordStandard, value);
                }
              }
            }
          }
          lastCharWasSpace = charIsSpace;
        }
      }
    }
  }

  // var typeHighlightBGSingle = new Map();
  // for (let [key1, value1] of singleWordsToOccurences) {
  //   if(value1[0][0] >= _RECORDVIEW_COMPAREALL_MINREPITITIONS)
  //     for (let [key2, value2] of doubleWordsToOccurences) {
  //       if(value2[0][0] >= _RECORDVIEW_COMPAREALL_MINREPITITIONS)
  //         typeHighlightBGSingle.set(key1, (key1 != value2[0][2] && key1 != value2[0][3])); //Single word is not in a double word pair
  //     }
  // }

  //Highlight double words
  for (let [key, value] of doubleWordsToOccurences) {
    if (value[0][0] >= _RECORDVIEW_COMPAREALL_MINREPITITIONS) {
      var color = value[0][1];
      var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
      for (var v = 0; v < value[1].length; ++v) {
        // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
        //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
        termToHighlightList.push(value[1][v]);
        preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
        postHTML_List.push("</span>");
      }
    }
  }

  //Highlight single words
  for (let [key, value] of singleWordsToOccurences) {
    if (value[0][0] >= _RECORDVIEW_COMPAREALL_MINREPITITIONS) {
      var color = value[0][1];
      var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
      for (var v = 0; v < value[1].length; ++v) {
        // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
        //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
        termToHighlightList.push(value[1][v]);
        // if(typeHighlightBGSingle.get(key)){
        preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
        postHTML_List.push("</span>");
        // }
        // else{
        //   preHTML_List.push("<span style='border-bottom: 3px solid " + bgColor + "'>");
        //   postHTML_List.push("</span>");
        // }
      }
    }
  }

  if (_selected_record_view == -1)
    _selected_record_view = 0;
  var tab_text = "Record Views";
  if (_recordViews.length > 0)
    tab_text += "&nbsp;&nbsp;<span style='background-color: red; color: white; font-weight: bold; border-radius: 5px;'>&nbsp;" + _recordViews.length + "&nbsp;</span>";
  document.getElementById("TAB_record_views").innerHTML = tab_text;
  document.getElementById("record_views_div").innerHTML = "";
  var htmlToAdd = "";
  var differences_checked = "";
  var similarities_checked = "";
  var compareall_checked = "";
  if (_recordViewHightlightType == 0)
    differences_checked = "checked";
  else if (_recordViewHightlightType == 1)
    similarities_checked = "checked";
  else if (_recordViewHightlightType == 2)
    compareall_checked = "checked";
  if (_recordViews.length > 0) {
    var bottom_dist = "40px";
    if (isMobileDevice())
      bottom_dist = "0px"; //Mobile heads to bottom shortcut bar
    htmlToAdd +=
      "<div id='record_views_table_div' style='font-size: 16px;'>" +
      "<div style='position: fixed; bottom: " + bottom_dist + "; left: 0px; background-color: lightblue; width: 100%; z-index: 2;'>" +
      "<label class='radiobutton_container' style='display: inline;'>Show Differences&nbsp;&nbsp; <input onchange='setRecordViewHighlightType(event, 0);' type='radio' id='radio_record_views_differences'  name='radio_record_views_highlighting'" + differences_checked + "><span class='radiomark'></span></label>" +
      "<label class='radiobutton_container' style='display: inline;'>Show Similarities&nbsp;&nbsp;<input onchange='setRecordViewHighlightType(event, 1);' type='radio' id='radio_record_views_similarities' name='radio_record_views_highlighting'" + similarities_checked + "><span class='radiomark'></span></label>" +
      "<label class='radiobutton_container' style='display: inline;'>Show Compare All&nbsp;&nbsp; <input onchange='setRecordViewHighlightType(event, 2);' type='radio' id='radio_record_views_compareall'   name='radio_record_views_highlighting'" + compareall_checked + "><span class='radiomark'></span></label>" +
      "</div>" +
      "<br>";
  }

  var first_record_rownum = 0;
  for (var i = 0; i < _recordViews.length; ++i) {
    var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
    if (rownum != null) {
      var equip_type_text = _content[rownum][_EQUIP_TYPE];
      var appl_brand_text = _content[rownum][_APPL_BRAND];
      var descrip1_text = _content[rownum][_DESCRIP1];
      var descrip2_text = _content[rownum][_DESCRIP2];
      var comments_text = _content[rownum][_COMMENTS];

      if (_recordViewHightlightType == 2) {
        equip_type_text = highlightString(equip_type_text, termToHighlightList, preHTML_List, postHTML_List);
        appl_brand_text = highlightString(appl_brand_text, termToHighlightList, preHTML_List, postHTML_List);
        descrip1_text = highlightString(descrip1_text, termToHighlightList, preHTML_List, postHTML_List);
        descrip2_text = highlightString(descrip2_text, termToHighlightList, preHTML_List, postHTML_List);
        comments_text = highlightString(comments_text, termToHighlightList, preHTML_List, postHTML_List);
      }
      else {
        if (i == 0) {
          first_record_rownum = rownum;
        }
        else {
          var equip_type_indexes = getWordCompareIndexes(_content[first_record_rownum][_EQUIP_TYPE], equip_type_text, _recordViewHightlightType);
          var appl_brand_indexes = getWordCompareIndexes(_content[first_record_rownum][_APPL_BRAND], appl_brand_text, _recordViewHightlightType);
          var descrip1_indexes = getWordCompareIndexes(_content[first_record_rownum][_DESCRIP1], descrip1_text, _recordViewHightlightType);
          var descrip2_indexes = getWordCompareIndexes(_content[first_record_rownum][_DESCRIP2], descrip2_text, _recordViewHightlightType);
          var comments_indexes = getWordCompareIndexes(_content[first_record_rownum][_COMMENTS], comments_text, _recordViewHightlightType);
          var preHTML = "<span style='background: salmon;'>";
          if (_recordViewHightlightType == 1)
            preHTML = "<span style='background: lightgreen;'>";
          var postHTML = "</span>";
          equip_type_text = highlightStringBasic(equip_type_text, equip_type_indexes.startIndexes, equip_type_indexes.endIndexes, preHTML, postHTML);
          appl_brand_text = highlightStringBasic(appl_brand_text, appl_brand_indexes.startIndexes, appl_brand_indexes.endIndexes, preHTML, postHTML);
          descrip1_text = highlightStringBasic(descrip1_text, descrip1_indexes.startIndexes, descrip1_indexes.endIndexes, preHTML, postHTML);
          descrip2_text = highlightStringBasic(descrip2_text, descrip2_indexes.startIndexes, descrip2_indexes.endIndexes, preHTML, postHTML);
          comments_text = highlightStringBasic(comments_text, comments_indexes.startIndexes, comments_indexes.endIndexes, preHTML, postHTML);
        }
      }

      comments_text = getPartChildButtonHTML_NonWorker(comments_text);

      var bgstyle = "";
      if (i == _selected_record_view)
        bgstyle = "style='background-color: lightblue;'";
      htmlToAdd += "<div class='recordview' id='record_view_" + i + "' " + bgstyle + " onclick='selectRecordView(" + i + ");'>";
      htmlToAdd += "<div style='display: flex; flex-direction: row;'><div style='flex-grow: 1;'>";
      htmlToAdd += "<span style='color: white; background-color: #70A2FF; font-size: 30px;'>&nbsp;" + (i + 1) + "&nbsp;</span>&nbsp;";
      htmlToAdd += "<button style='width: 50px; background-color: #70A2FF; font-size: " + rv_fontsize + ";' onclick='removeRecordView(" + i + ");' id='button_record_view_exit_" + i + "'>X</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='populateRecordBrowser(" + rownum + ",true); setTab(" + TAB_RECORD_BROWSER + "); onCellClick(0,0,\"record_browser_cell_0_0\",2);' id='button_record_view_jump_to_browser_" + i + "'><span style='color: white;'>B</span>rowser</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='recordViewUp();' id='button_record_view_up_" + i + "'>Record &uarr;</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='recordViewDown();' id='button_record_view_down_" + i + "'>Record &darr;</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='recordViewPageUp();' id='button_record_view_page_up_" + i + "'>Page Up &uarr;</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='recordViewPageDown();' id='button_record_view_page_down_" + i + "'>Page Down &darr;</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='recordView_JumpToAka();' id='button_record_view_aka_" + i + "'>AKA</button> "
        + "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='recordView_Copy(" + i + ");' id='button_record_view_copy_" + i + "'>Copy</button> ";
      if (_subscribed_mode && !_writeable_mode)
        htmlToAdd += "<img id='record_view_data_edit_icon_" + i + "' style='width: 0px; height: 0px;'>"
      else
        htmlToAdd += "<img class='clickable' id='record_view_data_edit_icon_" + i + "' src='pencil.png' onclick='startEditRecordViewData(" + i + ")'; width=25px height=25px style='position: relative; top: 6px;'>"
      htmlToAdd += "<button id='record_view_data_save_button_" + i + "' style='width: 70px; display: none; background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='saveEditRecordViewData(" + i + ");'><span style='color: white;'>S</span>ave</button>&nbsp;"
        + "<button id='record_view_data_cancel_button_" + i + "'  style='width: 70px; display: none; background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>"
        + "</div><div style='flex-grow: 1;'>";

      var attn = stringifyArrayEndChar(_content[rownum][_ATTN], " ");
      if (standardizeString(attn) != "")
        htmlToAdd += "<div style='width: 200px; height: 25px; background-color: red; margin-left: auto; color: white;' title='" + getHTMLSafeText(attn) + "'>ATTN: " + getExpandableHTML(_content[rownum][_ATTN], "attn_" + i, 10, "50px") + "</div>";

      htmlToAdd += "</div></div>"
        + "<div style='display: flex;'><div class='border_center' style='flex-grow: 1;'></div>"
        + "<div class='text1'>"
        + "<span id='record_view_data_read_equip_type_" + i + "'>" + equip_type_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_equip_type_" + i + "' style='width: 50px; display: none;' value='" + getHTMLSafeText(_content[rownum][_EQUIP_TYPE]) + "'>" + " / "
        + "<span id='record_view_data_read_appl_brand_" + i + "'>" + appl_brand_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_appl_brand_" + i + "' style='width: 50px; display: none;' value='" + getHTMLSafeText(_content[rownum][_APPL_BRAND]) + "'>" + "</div>"
        + "<div class='border_center' style='flex-grow: 8;'></div></div>"
        + "<div style='display: block; border-left: solid; border-bottom: solid; border-right: solid; border-width: 2px; border-color: black;'>"
        + "<div style='padding-left: 10px;'><b>DESCRIP1:</b> <span id='record_view_data_read_descrip1_" + i + "'>" + descrip1_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_descrip1_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_DESCRIP1]) + "'><br>"
        + "<b>DESCRIP2: </b><span id='record_view_data_read_descrip2_" + i + "'>" + descrip2_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_descrip2_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_DESCRIP2]) + "'></div>"
        + "<div style='padding-left: 10px;'><b>COMMENTS:</b> <span id='record_view_data_read_comments_" + i + "'>" + comments_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_comments_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_COMMENTS]) + "'></div>";
      // var details_expanded = true;
      // if (_recordViews_Key_To_Details_Open.has(_recordViews[i]) && !_recordViews_Key_To_Details_Open.get(_recordViews[i]))
      //   details_expanded = false;
      if (_record_views_expanded) {
        htmlToAdd += "</div><div id='div_recordview_collapser_" + i + "' class=clickable style='background-color: #96BBFF' onclick='toggleDiv(null, \"record_view_details_" + i + "\")'><span id='record_view_details_" + i + "_expander_icon' style='color: white;'>-</span> Details</div>";
        htmlToAdd += "<div id='record_view_details_" + i + "_div' style='display: block;'>";
      }
      else {
        htmlToAdd += "</div><div id='div_recordview_collapser_" + i + "' class=clickable style='background-color: #96BBFF' onclick='toggleDiv(null, \"record_view_details_" + i + "\")'><span id='record_view_details_" + i + "_expander_icon' style='color: white;'>+</span> Details</div>";
        htmlToAdd += "<div id='record_view_details_" + i + "_div' style='display: none;' >";
      }
      // htmlToAdd += getRecordViewPage(rownum, _record_view_page_list[i], i);
      htmlToAdd += "</div>";
    }
    htmlToAdd += "</div>";
  }
  // if(_recordViews.length > 0)
  //   htmlToAdd += "</div>";
  document.getElementById("record_views_div").innerHTML = htmlToAdd;
  for (var i = 0; i < _recordViews.length; ++i) {
    setRecordViewPage(_record_view_page_list[i], i);
    var ele = document.getElementById("expandable_html_str_attn_" + i);
    if (ele != null) {
      ele.style.backgroundColor = "red";
      ele.style.color = "white";
      ele.style.position = "relative";
    }
  }
  selectRecordView(_last_selected_record_view);

  if (_record_view_to_edit != null) {
    startEditRecordViewData(_record_view_to_edit);
    _record_view_to_edit = null;
  }
}

function startEditRecordViewData(index) {
  hideRecordViewEditAndSellIcons();
  deselectTable();
  document.getElementById("button_record_view_exit_" + index).style.display = "none";
  document.getElementById("button_record_view_jump_to_browser_" + index).style.display = "none";
  document.getElementById("button_record_view_up_" + index).style.display = "none";
  document.getElementById("button_record_view_down_" + index).style.display = "none";
  document.getElementById("button_record_view_page_up_" + index).style.display = "none";
  document.getElementById("button_record_view_page_down_" + index).style.display = "none";
  document.getElementById("button_record_view_aka_" + index).style.display = "none";
  document.getElementById("record_view_data_edit_icon_" + index).style.display = "none";
  document.getElementById("record_view_data_save_button_" + index).style.display = "";
  document.getElementById("record_view_data_cancel_button_" + index).style.display = "";

  document.getElementById("record_view_data_read_equip_type_" + index).style.display = "none";
  document.getElementById("record_view_data_read_appl_brand_" + index).style.display = "none";
  document.getElementById("record_view_data_read_descrip1_" + index).style.display = "none";
  document.getElementById("record_view_data_read_descrip2_" + index).style.display = "none";
  document.getElementById("record_view_data_read_comments_" + index).style.display = "none";
  document.getElementById("record_view_data_read_PART_NUMBR_" + index).style.display = "none";
  document.getElementById("record_view_data_read_LOCATION_" + index).style.display = "none";
  document.getElementById("record_view_data_read_MODIFIED_" + index).style.display = "none";
  document.getElementById("record_view_data_read_KEEP_" + index).style.display = "none";
  document.getElementById("record_view_data_read_GET_" + index).style.display = "none";
  document.getElementById("record_view_data_read_LKUPPN_" + index).style.display = "none";
  document.getElementById("record_view_data_read_ADVICE_" + index).style.display = "none";
  document.getElementById("record_view_data_read_REORD_QTY_" + index).style.display = "none";
  document.getElementById("record_view_data_read_SOURCE_" + index).style.display = "none";
  document.getElementById("record_view_data_read_MODEL_" + index).style.display = "none";
  document.getElementById("record_view_data_read_FROM_" + index).style.display = "none";

  //Top row
  document.getElementById("record_view_data_input_equip_type_" + index).style.display = "";
  document.getElementById("record_view_data_input_appl_brand_" + index).style.display = "";
  document.getElementById("record_view_data_input_descrip1_" + index).style.display = "";
  document.getElementById("record_view_data_input_descrip2_" + index).style.display = "";
  document.getElementById("record_view_data_input_comments_" + index).style.display = "";

  //Bottom row
  document.getElementById("record_view_data_input_PART_NUMBR_" + index).style.display = "";
  document.getElementById("record_view_data_input_LOCATION_" + index).style.display = "";
  document.getElementById("record_view_data_input_MODIFIED_" + index).style.display = "";
  document.getElementById("record_view_data_input_KEEP_" + index).style.display = "";
  document.getElementById("record_view_data_input_GET_" + index).style.display = "";
  document.getElementById("record_view_data_input_LKUPPN_" + index).style.display = "";
  document.getElementById("record_view_data_input_ADVICE_" + index).style.display = "";
  document.getElementById("record_view_data_input_REORD_QTY_" + index).style.display = "";
  document.getElementById("record_view_data_input_SOURCE_" + index).style.display = "";
  document.getElementById("record_view_data_input_MODEL_" + index).style.display = "";
  document.getElementById("record_view_data_input_FROM_" + index).style.display = "";

  var indexes0 = RECORD_VIEW_HEADERS_PAGE1_CONCAT;
  if (_record_view_page_list[index] == 2)
    indexes0 = RECORD_VIEW_HEADERS_PAGE2_CONCAT;
  for (var i = 0; i < indexes0.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var ele = document.getElementById("record_view_data_read_" + indexes0[i] + "_" + index + "_" + j);
      if (ele != null) {
        ele.style.display = "none";
        document.getElementById("record_view_data_input_" + indexes0[i] + "_" + index + "_" + j).style.display = "";
      }
    }
  }
  var ele2 = document.getElementById("record_view_data_input_equip_type_" + index);
  ele2.focus();
  ele2.select();
}

function saveEditRecordViewData(index) {
  var rownum = getContentIndexFrom_DB_ID(_recordViews[index]);
  if (rownum != null) {
    var original_content = objFromContentRow(rownum);
    _content[rownum][_EQUIP_TYPE] = String(document.getElementById("record_view_data_input_equip_type_" + index).value);
    _content[rownum][_APPL_BRAND] = String(document.getElementById("record_view_data_input_appl_brand_" + index).value);
    _content[rownum][_DESCRIP1] = String(document.getElementById("record_view_data_input_descrip1_" + index).value);
    _content[rownum][_DESCRIP2] = String(document.getElementById("record_view_data_input_descrip2_" + index).value);
    _content[rownum][_COMMENTS] = String(document.getElementById("record_view_data_input_comments_" + index).value);
    _content[rownum][_PART_NUMBR] = String(document.getElementById("record_view_data_input_PART_NUMBR_" + index).value);
    _content[rownum][_LOCATION] = String(document.getElementById("record_view_data_input_LOCATION_" + index).value);
    _content[rownum][_MODIFIED] = String(document.getElementById("record_view_data_input_MODIFIED_" + index).value);
    _content[rownum][_KEEP] = String(document.getElementById("record_view_data_input_KEEP_" + index).value);
    _content[rownum][_GET] = String(document.getElementById("record_view_data_input_GET_" + index).value);

    _content[rownum][_LOOK_UP_PN] = String(document.getElementById("record_view_data_input_LKUPPN_" + index).value).split("\n"); //TextArea
    _content[rownum][_ADVICE] = String(document.getElementById("record_view_data_input_ADVICE_" + index).value).split("\n"); //TextArea
    _content[rownum][_REORD_QTY] = String(document.getElementById("record_view_data_input_REORD_QTY_" + index).value);
    _content[rownum][_SOURCE] = String(document.getElementById("record_view_data_input_SOURCE_" + index).value);
    _content[rownum][_MODEL] = String(document.getElementById("record_view_data_input_MODEL_" + index).value).split("\n"); //TextArea
    _content[rownum][_FROM] = String(document.getElementById("record_view_data_input_FROM_" + index).value);
    generateContent_Standard_Row(rownum);
    var edb_indexes = [];
    var original_content_extras = [];
    var indexes0 = RECORD_VIEW_HEADERS_PAGE1_CONCAT;
    var indexes1 = RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT;
    if (_record_view_page_list[index] == 2) {
      indexes0 = RECORD_VIEW_HEADERS_PAGE2_CONCAT;
      indexes1 = RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_CONCAT;
    }

    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
      var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
      // var extraDBIndex = getExtraDBLinkIndex2(rownum, j);
      if (extraDBIndex != null) {
        edb_indexes.push(extraDBIndex);
        original_content_extras.push(copyObj(_content_extra[j][extraDBIndex][0]));
        for (var k = 0; k < indexes0.length; ++k) {
          var ele = document.getElementById("record_view_data_input_" + indexes0[k] + "_" + index + "_" + j);
          if (ele != null) {
            _content_extra[j][extraDBIndex][0][indexes1[k][j]] = String(ele.value);
          }
        }
      }
      else {
        edb_indexes.push(null);
        original_content_extras.push(null);
      }
    }
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      if (edb_indexes[j] != null) {
        saveContentExtraToDatabase(j, edb_indexes[j]);
        var content_extra_obj = _content_extra[j][edb_indexes[j]][0];
        var compare_str = getObjectCompareString(original_content_extras[j], content_extra_obj);
        if (compare_str != null && !_DEBUG_LOCAL_MODE)
          writeToChangeHistory("Edit | Child Record", "Edited Child Record in \"" + _EXTRA_DB[j] + "\" with PN \"" + content_extra_obj[CE_PN] + "\" " + compare_str);
      }
    }
    saveContentToDatabase(rownum);
    var compare_str0 = getObjectCompareString(original_content, objFromContentRow(rownum));
    if (compare_str0 != null)
      writeToChangeHistory("Edit | Parent Record", "Edited Parent Record with OEM_PN \"" + original_content.OEM_PN + "\" " + compare_str0);
  }
  populateRecordViews();
}

function recordViewIconMouseOver(id1) {
  var icon = document.getElementById("record_view_icon_" + id1);
  if (icon != null && !isMobileDevice())
    document.getElementById("record_view_icon_" + id1).style.display = "";
}

function recordViewIconMouseOut(id1) {
  var icon = document.getElementById("record_view_icon_" + id1);
  if (icon != null && !isMobileDevice())
    document.getElementById("record_view_icon_" + id1).style.display = "none";
}

var _record_view_page_list = [];
function addRecordView(key, insert) {
  showSnackbar("Added to Record Views", 3000);
  if (insert != null) {
    _recordViews.splice(insert, 0, key);
    _record_view_page_list.splice(insert, 0, 1);
  }
  else {
    _recordViews.push(key);
    _record_view_page_list.push(1);
  }
  populateRecordViews();
  setKeyboardShortcutBar();
}

function removeRecordView(pos) {
  _recordViews.splice(pos, 1);
  _record_view_page_list.splice(pos, 1);
  populateRecordViews();
  if (_recordViews.length > 0) {
    if (pos == _recordViews.length)
      selectRecordView(pos - 1, true);
    else
      selectRecordView(pos, true);
  }
  setKeyboardShortcutBar();
}

function replaceRecordView(i, key) {
  if (_recordViews.length > i) {
    _recordViews[i] = key;
    populateRecordViews();
    setKeyboardShortcutBar();
  }
}

//type: 0 = different, 1 = similar
function getWordCompareIndexes(str1, str2, type) {
  var str1_split = standardizeString(str1).split(" ");
  var str2_split = standardizeString(str2).split(" ");
  var noMatchIndexes = [];
  var matchIndexes = [];
  var ignoreIndexes = [];
  for (var i = 0; i < str2_split.length; ++i) {
    var str2_word = str2_split[i];
    if (_WORDS_TO_IGNORE.includes(str2_word)) {
      ignoreIndexes.push(i);
    }
    else {
      // var result = str1_standard.match(getRegexSafeSearchTerm(str2_word));
      if (str1_split.includes(str2_word))
        matchIndexes.push(i);
      else
        noMatchIndexes.push(i);
    }
  }

  var i2 = 0;
  var wordStartIndexes = [];
  var wordEndIndexes = [];
  var inWord = false;
  var str2_lower = str2.toLowerCase();
  while (i2 < str2_lower.length && str2_lower.charAt(i2) == " ")
    ++i2;
  var lastSpace = i2 - 1;
  while (i2 < str2_lower.length) {
    var str2_char = str2_lower.charAt(i2);
    if (str2_char != " " && is_standardized(str2_char))
      inWord = true;
    if (inWord && str2_char == " ") {
      inWord = false;
      wordStartIndexes.push(lastSpace + 1);
      wordEndIndexes.push(i2 - 1);
    }
    else if (inWord && i2 == str2_lower.length - 1) {
      inWord = false;
      wordStartIndexes.push(lastSpace + 1);
      wordEndIndexes.push(i2);
    }
    if (str2_char == " ")
      lastSpace = i2;
    ++i2;
  }

  var indexObj = new Object();
  indexObj.startIndexes = [];
  indexObj.endIndexes = [];

  if (type == 0) {
    for (var i = 0; i < noMatchIndexes.length; ++i) {
      indexObj.startIndexes.push(wordStartIndexes[noMatchIndexes[i]]);
      indexObj.endIndexes.push(wordEndIndexes[noMatchIndexes[i]]);
    }
  }
  else {
    for (var i = 0; i < matchIndexes.length; ++i) {
      indexObj.startIndexes.push(wordStartIndexes[matchIndexes[i]]);
      indexObj.endIndexes.push(wordEndIndexes[matchIndexes[i]]);
    }
  }
  return indexObj;
}

function setRecordViewHighlightType(event, type) {
  _recordViewHightlightType = type;
  populateRecordViews();
  if (type == 0)
    document.getElementById("radio_record_views_differences").checked = true;
  else if (type == 1)
    document.getElementById("radio_record_views_similarities").checked = true;
  else if (type == 2)
    document.getElementById("radio_record_views_compareall").checked = true;
}

function toggleRecordViewMemo(id1) {
  var buttonShow = document.getElementById("record_view_memo_show_" + id1);
  if (buttonShow.style.display == "none") {
    document.getElementById("record_view_memo_show_" + id1).style.display = "";
    document.getElementById("record_view_memo_hide_" + id1).style.display = "none";
  }
  else {
    document.getElementById("record_view_memo_show_" + id1).style.display = "none";
    document.getElementById("record_view_memo_hide_" + id1).style.display = "";
  }
}

function startEditRecordPartReference(i1, j1) {
  var selldiv = document.getElementById("sell_div_" + i1 + "_" + j1);
  if (selldiv != null)
    document.getElementById("sell_div_" + i1 + "_" + j1).style.display = "none";
  hideRecordViewEditAndSellIcons();
  var ele = document.getElementById("record_view_partnum_input_" + i1 + "_" + j1);
  if (ele != null) {
    ele.style.display = "block";
    ele.focus();
    ele.select();
  }
  document.getElementById("record_view_partnum_cancel_button_" + i1 + "_" + j1).style.display = "block";
  document.getElementById("record_view_partnum_save_button_" + i1 + "_" + j1).style.display = "block";
  var text = document.getElementById("record_view_partnum_text_" + i1 + "_" + j1);
  if (text != null)
    text.style.display = "none";
}

function saveEditRecordPartReference(i1, j1) {
  // console.log("|" + document.getElementById("record_view_partnum_input_" + i1 + "_" + j1).value + "|parts_db/P&A_PRI/" + _recordViews[i1] + "/" + EXTRA_DB_ACTUAL_INDEXES[j1]);
  var rownum = getContentIndexFrom_DB_ID(_recordViews[i1]);
  var value = document.getElementById("record_view_partnum_input_" + i1 + "_" + j1).value;
  var row = _content[rownum];
  var originalValue = row[INDEXES_CONCAT.indexOf(_EXTRA_DB_ACTUAL_INDEXES[j1])];
  if (rownum != null) {
    edit_content(rownum, _EXTRA_DB_ACTUAL_INDEXES[j1], value);
  }
  // var key = "parts_db/P&A_PRI/" + _recordViews[i1];
  // var partObj = new Object();
  // for (var i = 0; i < _INDEXES.length; ++i)
  //   partObj[_INDEXES[i]] = row[i];
  // for (var i = 0; i < _MEMO_INDEXES.length; ++i)
  //   partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
  populateRecordViews();
  if (!_DEBUG_LOCAL_MODE) {
    // writeToDatabase(key, partObj, true, true, false, null);
    saveContentToDatabase(rownum, true);
    writeToChangeHistory("Edit | Part Reference", "Edited part reference for " + _EXTRA_DB[j1] + " of Parent Record with OEM_PN \"" + row[_OEM_PN] + "\" from \"" + originalValue + "\" to \"" + value + "\"");
  }
}

function selectRecordView(num, scrollIntoView) {
  if (scrollIntoView == null)
    scrollIntoView = false;
  if (scrollIntoView) {
    var ele = document.getElementById("record_view_" + num);
    if (ele != null) {
      // console.log(ele.getBoundingClientRect());
      // console.log(window.innerHeight);

      // const y = ele.getBoundingClientRect().top + window.pageYOffset - 103;
      // window.scrollTo({ top: y, behavior: 'smooth' });
      // ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });

      eleSmartScroll(ele, 103, 60, 'smooth');
    }
  }
  if (_recordViews.length > num && _selected_record_view >= 0) {
    _selected_record_view = num;
    _last_selected_record_view = num;
    for (var i = 0; i < _recordViews.length; ++i) {
      document.getElementById("record_view_" + i).style.backgroundColor = "";
    }
    if (num >= 0)
      document.getElementById("record_view_" + num).style.backgroundColor = "lightblue";
  }
}

function jumpToChildPartFromRecordView(extradb, index) {
  document.getElementById("part_child_dropdown_select").selectedIndex = extradb;
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  _selected_child_part_db = extradb;
  _selected_child_part_record = index;
  populateChildPartRecordManager();
  clearPartChildEditAutocomplete();
  setNewPartChildButton();
  if (_content_extra[extradb].length > _selected_child_part_record)
    document.getElementById("part_child_edit_input").value = _content_extra[extradb][_selected_child_part_record][0][CE_PN];
}

function startSell(i1, j1) {
  hideRecordViewEditAndSellIcons();
  document.getElementById("sell_form_" + i1 + "_" + j1).style.display = "";
  document.getElementById("sell_quantity_" + i1 + "_" + j1).focus();
}

function changeSellQuantity(i1, j1, amount) {
  var currentval = Number(document.getElementById("sell_quantity_" + i1 + "_" + j1).value);
  document.getElementById("sell_quantity_" + i1 + "_" + j1).value = currentval + Number(amount);
}

var _invoice_objs = [];
function confirmSell(i1, j1, _content_partnum_for_extraDB, _parent_record_id) {
  var parentRecordIndex = getParentIndexFromID(_parent_record_id);
  var extraDBIndex = getExtraDBLinkIndex(j1, _content_partnum_for_extraDB);
  // var extraDBIndex = getExtraDBLinkIndex2(parentRecordIndex, j1);
  // var parentRecordData = _content[parentRecordIndex];
  if (extraDBIndex != null && parentRecordIndex != null) {
    var partObj = _content_extra[j1][extraDBIndex][0];
    // var currentAmount = Number(partObj[CE_SHOP_QTY]);
    var amountToSell = Number(document.getElementById("sell_quantity_" + i1 + "_" + j1).value);
    // var partkey = _content_extra[j1][extraDBIndex][1];


    addtoinvoice(amountToSell, j1, extraDBIndex, parentRecordIndex);

    // var invoice_obj = new Object();
    // invoice_obj.currentAmount = currentAmount;
    // invoice_obj.amountToSell = amountToSell;
    // invoice_obj.DESCRIP1 = parentRecordData[_DESCRIP1];
    // invoice_obj.SELL = partObj[CE_SELL];
    // invoice_obj.extradb = j1;
    // invoice_obj.partkey = partkey;
    // invoice_obj.PN = partObj[CE_PN];
    // invoice_obj.equip_type = parentRecordData[_EQUIP_TYPE];
    // invoice_obj.mfr = getExtraDBPartManufacturer(j1, extraDBIndex);
    // invoice_obj.equip_design = parentRecordData[_EQUIP_DESIGN];
    // invoice_obj.parent_record_id = _parent_record_id;
    // _invoice_objs.push(invoice_obj);
    showSnackbar("Added to Invoice", 5000);

  }
  populateRecordViews();
}

function hideRecordViewEditAndSellIcons() {
  for (var i = 0; i < _recordViews.length; ++i) {
    document.getElementById("record_view_data_edit_icon_" + i).style.display = "none";
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var icon = document.getElementById("record_view_partnum_edit_icon_" + i + "_" + j);
      if (icon != null)
        icon.style.display = "none";
    }
  }
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var icon = document.getElementById("sell_button_" + i + "_" + j);
      if (icon != null)
        icon.style.display = "none";
    }
  }
}

var _images_googlesearch_list = [];
var _images_googlesearch_currentindex = 0;
function googlesearch_hndlr(response) {
  if (response.items != null && response.items.length > 0) {
    _images_googlesearch_list = response.items;
    _images_googlesearch_currentindex = 0;
    var item = response.items[0];
    // in production code, item.htmlTitle should have the HTML entities escaped.
    document.getElementById("googlesearch_image_div").style.display = "";
    // div.innerHTML = "<img id='button_googlesearch_image_exit' class='clickable' src='x.png' style='position: fixed; top: -80px; right: -20px;' onclick='hideGoogleSearchImage();'><img id='image_googlesearch_image' src='" + item.link + "' style='height: 100%;'>";
    document.getElementById("image_googlesearch_image").src = "";
    document.getElementById("image_googlesearch_image").src = item.link;
    _image_search_link = item.image.contextLink;
    document.getElementById("button_search_image_link").innerHTML = _image_search_link;
    setSearchImageCount();
  }
  else { //Fallback to showing local images if no internet images found, so as to not block local image viewing functionality
    document.getElementById("googlesearch_image_div").style.display = "";
    document.getElementById("image_googlesearch_image").src = "";
    showSnackbar("No results found", 3000);
    document.getElementById("radio_image_self").checked = true;
    setImageRadio();
  }
}

var _cse_image_descrip1 = "";
var _cse_image_partSearchTerm = "";

function showRecordViewImage(descrip1, partSearchTerm, sitesEnum, id) {
  _current_local_images = [];
  _current_local_images_names = [];
  if (id != null)
    _selected_image_part = id;
  document.getElementById("button_search_image_delete").style.display = "none";
  document.getElementById("button_search_image_link").style.display = "";
  if (sitesEnum == 2) {
    showRecordViewImageLocal(_selected_image_part);
    return;
  }
  if (_google_cse_api_key_loaded) {
    _cse_image_descrip1 = descrip1;
    _cse_image_partSearchTerm = partSearchTerm;
    var searchEngineID = "";
    switch (sitesEnum) {
      case 0:
        document.getElementById("radio_image_everywhere").checked = true;
        searchEngineID = "de8eb9876c78e78e6"; //Entire Web
        break;
      case 1:
        document.getElementById("radio_image_distributors").checked = true;
        searchEngineID = "01922cf7659e937bd"; //Parts Sites
        break;
    }
    var cleanPartSearchTerm = getHTMLSafeText(partSearchTerm);
    var script = document.createElement('script');
    // script.onload = function () {

    // };

    var descrip1_split = standardizeString(descrip1.replace(/-/g, " ")).split(" ");
    descrip1 = "";
    if (descrip1_split.length > 0)
      descrip1 = descrip1_split[0];
    script.src = "https://www.googleapis.com/customsearch/v1?key=" + _google_cse_api_key + "&cx=" + searchEngineID + "&q=" + descrip1 + " " + cleanPartSearchTerm + "&callback=googlesearch_hndlr&searchType=image&num=10";

    document.getElementById("googlesearch_api_script_div").innerHTML = "";
    document.getElementById("googlesearch_api_script_div").appendChild(script);
  }
  else {
    showSnackbar("Google CSE Api Key not loaded yet!", 3000);
  }
}

var _current_local_images = [];
var _current_local_images_names = [];
var _current_local_image_index = 0;
function showRecordViewImageLocal(id) {
  var listRef = firebase.storage().ref().child("child_part_images").child(id);
  listRef.listAll()
    .then(dir => {
      if (dir.items.length > 0) {
        dir.items.forEach((item) => {
          var ref = listRef.child(item.name);
          _current_local_images_names.push(item.name);
          ref.getDownloadURL()
            .then((url) => {
              _current_local_images.push(url);
              if (_current_local_images.length == 1) {
                if (!_subscribed_mode || _writeable_mode)
                  document.getElementById("button_search_image_delete").style.display = "";
                document.getElementById("button_search_image_link").style.display = "none";
                _current_local_image_index = 0;
                document.getElementById("image_googlesearch_image").src = "";
                document.getElementById("image_googlesearch_image").src = url;
              }
              setSearchImageCount();
            });
        });
      }
      else {
        document.getElementById("image_googlesearch_image").src = "";
        document.getElementById("button_search_image_link").style.display = "none";
        showSnackbar("No images found", 3000);
      }
    }).catch(error => console.error(error));
}

function getGoogleSearchTerm(descrip1, partSearchTerm) {
  var cleanPartSearchTerm = getHTMLSafeText(partSearchTerm);
  var descrip1_split = standardizeString(descrip1.replace(/-/g, " ")).split(" ");
  descrip1 = "";
  if (descrip1_split.length > 0)
    descrip1 = descrip1_split[0];
  return descrip1 + " " + cleanPartSearchTerm;
}

function hideGoogleSearchImage() {
  var div = document.getElementById("googlesearch_image_div");
  div.style.display = "none";
}

function changeGoogleSearchImage(direction) {
  if (_current_local_images.length > 0) {
    switch (direction) {
      case -1:
        if (_current_local_image_index > 0 && _current_local_images.length > _current_local_image_index - 1) {
          --_current_local_image_index;
        }
        break;
      case 1:
        if (_current_local_images.length > _current_local_image_index + 1) {
          ++_current_local_image_index;
        }
        break;
    }
    if (_current_local_images.length > _current_local_image_index) {
      document.getElementById("image_googlesearch_image").src = "";
      document.getElementById("image_googlesearch_image").src = _current_local_images[_current_local_image_index];
      setSearchImageCount();
    }
  }
  else {
    switch (direction) {
      case -1:
        if (_images_googlesearch_currentindex > 0 && _images_googlesearch_list.length > _images_googlesearch_currentindex - 1) {
          --_images_googlesearch_currentindex;
        }
        break;
      case 1:
        if (_images_googlesearch_list.length > _images_googlesearch_currentindex + 1) {
          ++_images_googlesearch_currentindex;
        }
        break;
    }
    if (_images_googlesearch_list.length > _images_googlesearch_currentindex) {
      document.getElementById("image_googlesearch_image").src = "";
      document.getElementById("image_googlesearch_image").src = _images_googlesearch_list[_images_googlesearch_currentindex].link;
      _image_search_link = _images_googlesearch_list[_images_googlesearch_currentindex].image.contextLink;
      document.getElementById("button_search_image_link").innerHTML = _image_search_link;
      document.getElementById("button_search_image_link").style.display = "";
      setSearchImageCount();
    }
  }
}

function setSearchImageCount() {
  if (_current_local_images.length > 0)
    document.getElementById("paragraph_googlesearch_image_count").innerHTML = (_current_local_image_index + 1) + " / " + _current_local_images.length;
  else
    document.getElementById("paragraph_googlesearch_image_count").innerHTML = (_images_googlesearch_currentindex + 1) + " / " + _images_googlesearch_list.length;
}

var _RECORDVIEW_FRACTIONS_TO_DECIMAL_TEXT = "1/16=.0625 1/8=.125 1/4=.25 3/8=.375 1/2=.5 5/8=.625 3/4=.75 7/8=.875";
var _RECORDVIEW_SPEC_BORDER_TOP = "border-top:    3px black solid; border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_SPEC_BORDER_MIDDLE = "border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_SPEC_BORDER_BOTTOM = "border-bottom: 3px black solid; border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_MAX_PAGES = 4;
var _websearch_part_term_map = new Map();
function getRecordViewPage(rownum, page_num, i) {
  var htmlToAdd = "";
  switch (page_num) {
    //Not necessary since you can just add a new record view then auto-click the edit button for the copied record
    //-------------------------------------------------PAGE 0 (New Record)-------------------------------------------------------------
    // case 0:
    //   htmlToAdd += "<table class='recordview'><tr>";
    //   htmlToAdd += "<th>New Record</th>"
    //     + "<th></th>"
    //     + "<th></th>"
    //     + "<th></th>"
    //     + "<th></th>"
    //     + "<th></th>"
    //     + "<th></th>"
    //     + "<th></th>"
    //     + "<th></th>";
    //   htmlToAdd += "<th colspan='4' style='text-align: center;'>VENDOR PICK/PACK/INV SLIP</th>";
    //   htmlToAdd += "<th></th><th></th>";

    //   htmlToAdd += "</tr><tr>";
    //   for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_0.length; ++j) {
    //     if (j == 0)
    //       htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
    //     htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1_0[j] + ";'><div>" + RECORD_VIEW_HEADERS_PAGE1_0[j] + "</div></th>";
    //   }
    //   htmlToAdd += "<th></th><th></th>";
    //   for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_1.length; ++j) {
    //     htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1_1[j] + ";'><div>" + RECORD_VIEW_HEADERS_PAGE1_1[j] + "</div></th>";
    //   }
    //   htmlToAdd += "</tr>";
    //   var parent_record_id = _content[rownum][_content[rownum].length - 1];
    //   for (var j = 0; j < _EXTRA_DB.length; ++j) {
    //     if (j != 2) //Skip DNI ExtraDB
    //     {
    //       if (j == _EXTRA_DB.length - 1) //Last row
    //         htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");' style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
    //       else
    //         htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");'>";
    //       for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++k) {
    //         htmlToAdd += "<td>";
    //         if (RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k] != null)
    //           htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_CONCAT[k] + "_" + i + "_" + j + "' style='width: 90%;' value=''>";
    //         htmlToAdd += "</td>";
    //       }
    //       htmlToAdd += "<td></td><td></td>";

    //       htmlToAdd += "</tr>";
    //     }
    //   }

    //   var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>";
    //   var INPUT_LOCATION = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>";
    //   var INPUT_MODIFIED = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>";
    //   var INPUT_KEEP = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>";
    //   var INPUT_GET = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>";
    //   var INPUT_LKUPPN = "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>";
    //   var INPUT_ADVICE = "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>";
    //   var INPUT_REORD_QTY = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>";
    //   var INPUT_SOURCE = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>";
    //   var INPUT_MODEL = "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
    //   var INPUT_FROM = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>";

    //   htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>"
    //     + "<td colspan=2><b>" + INPUT_PART_NUMBR + "</b></td>"
    //     + "<td><b>" + INPUT_LOCATION + "</b></td>"
    //     + "<td colspan=4><b>" + INPUT_MODIFIED + "</b></td>"
    //     + "<td>KEEP  <b>" + INPUT_KEEP + "</b></td>"
    //     + "<td>BULK <b>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td></tr>"
    //     + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
    //     + "<td colspan=2>" + INPUT_LKUPPN + "</td>"
    //     + "<td style='text-align: right;'> ADVICE</td><td colspan=4>" + INPUT_ADVICE + "</td>"
    //     + "<td>REORD <b>" + INPUT_REORD_QTY + "</b>";
    //   htmlToAdd += "</td><td colspan=2 style='text-align: right;'> Srce</td>"
    //     + "<td><b>" + INPUT_SOURCE + "</b></td></tr>"
    //     + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
    //     + "<td colspan=4>" + INPUT_MODEL + "</td>"
    //     + "<td colspan=4>PREF <b>" + INPUT_FROM + "</b></td></tr>"
    //     + "</table>";
    //   break;

    //-------------------------------------------------PAGE 1-------------------------------------------------------------
    case 1:
      htmlToAdd += "<table class='recordview'><tr>";
      htmlToAdd += "<th>Page 1</th>"
        + "<th></th>"
        + "<th></th>"
        + "<th></th>"
        + "<th></th>";
      htmlToAdd += "<th>"
        + "<div style='display: flex; flex-direction: row;'>"
        + "<a id='web_search_r_all_" + i + "' class='clickable' target='_blank'><img src='search_r.png' width=25px title='Search Reliable Parts for every part number'></a>"
        // + "<a id='web_search_e_all_" + i + "' class='clickable' target='_blank'><img src='search_e.png' width=25px title='Search Encompass for every part number'></a>"
        + "<a id='web_search_m_all_" + i + "' class='clickable' target='_blank'><img src='search_m.png' width=25px title='Search Marcone for every part number'></a>"
        // + "<a id='web_search_w_all_" + i + "' class='clickable' target='_blank'><img src='search_w.png' width=25px title='Search WLMAY for every part number'></a>"
        + "<a id='web_search_u_all_" + i + "' class='clickable' target='_blank'><img src='search_u.png' width=25px title='Search Union Electronic Distributors for every part number'></a>"
        + "<a id='web_search_a_all_" + i + "' class='clickable' target='_blank'><img src='search_a.png' width=25px title='Search Appliance Parts Pros for every part number'></a>"
        + "<a id='web_search_p_all_" + i + "' class='clickable' target='_blank'><img src='search_p.png' width=25px title='Search Parts Town for every part number'></a>"
        + "<a id='web_search_g_all_" + i + "' class='clickable' target='_blank'><img src='search_g.png' width=25px title='Search Google for every part number'></a>"
        + "</div>"
        + "</th>";
      htmlToAdd += "<th></th>"
        + "<th></th>"
        + "<th></th>";
      htmlToAdd += "<th colspan='4' style='text-align: center;'>VENDOR PICK/PACK/INV SLIP</th>";
      htmlToAdd += "<th></th><th></th>";

      htmlToAdd += "</tr><tr>";
      for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_0.length; ++j) {
        if (j == 0)
          htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1_0[j] + ";'><div>" + RECORD_VIEW_HEADERS_PAGE1_0[j] + "</div></th>";
      }
      htmlToAdd += "<th style='width: 300px;'>Sites</th><th>Image</th>";
      for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_1.length; ++j) {
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1_1[j] + ";'><div>" + RECORD_VIEW_HEADERS_PAGE1_1[j] + "</div></th>";
      }
      htmlToAdd += "</tr>";
      var parent_record_id = _content[rownum][INDEXES_CONCAT.length];
      _websearch_part_term_map.set(i, []);
      for (var j = 0; j < _EXTRA_DB.length; ++j) {
        if (j != 2) //Skip DNI ExtraDB
        {
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          // var extraDBIndex = getExtraDBLinkIndex2(rownum, j);
          if (j == _EXTRA_DB.length - 1) //Last row
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");' style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
          else
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");'>";
          var partSearchTerm = "";
          for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_0.length; ++k) {
            htmlToAdd += "<td>";
            if (RECORD_VIEW_HEADERS_PAGE1_0[k] == "MFR") {
              htmlToAdd += "<div style='display: flex; flex-direction: row;'>";
              htmlToAdd += "<div style='width: 30px; display: inline-block;'>" + _EXTRA_DB[j] + "</div>";
              if (extraDBIndex != null) {
                htmlToAdd += "<div style='margin-left: 10px; margin-top: -20px;' id='sell_div_" + i + "_" + j + "'><br>";
                if (!_subscribed_mode || _writeable_mode)
                  htmlToAdd += "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' id='sell_button_" + i + "_" + j + "' onclick='startSell(" + i + "," + j + ");'><span style='color: white;'>S</span>ell</button>";
              }
              htmlToAdd += "<div id='sell_form_" + i + "_" + j + "' style='display: none;'>"
                + "<div>Quantity</div>"
                + "<button style='width: 100px; font-size: " + rv_fontsize + ";' onclick='changeSellQuantity(" + i + "," + j + ",  1);'>+</button><br>"
                + "<input onfocus='deselectTable();' style='width: 100px; height: 50px; text-align: center;' type='number' value='1' id='sell_quantity_" + i + "_" + j + "'><br>"
                + "<button style='width: 100px; font-size: " + rv_fontsize + ";' onclick='changeSellQuantity(" + i + "," + j + ", -1);'>-</button><br><br>"
                + "<button id='button_record_view_sell_confirm_" + i + "_" + j + "' style='width: 150px; height: 30px; background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='confirmSell(" + i + "," + j + ",\"" + _content_partnum_for_extraDB + "\",\"" + parent_record_id + "\");'>Confirm <span style='color: white;'>S</span>ell</button><br><br>"
                + "<button id='button_record_view_sell_cancel_" + i + "_" + j + "'  style='width: 150px; height: 30px; background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button></div></div>";
              htmlToAdd += "</div></td><td>";
            }
            else if (RECORD_VIEW_HEADERS_PAGE1_0[k] == "PN") //PN
            {
              if (_subscribed_mode && !_writeable_mode)
                htmlToAdd += "<img id='record_view_partnum_edit_icon_" + i + "_" + j + "' style='width: 0px; height: 0px;'>";
              else
                htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' src='pencil.png' width=25px height=25px onclick='startEditRecordPartReference(" + i + "," + j + ");' style='position: relative; bottom: 0px;'>&nbsp;&nbsp;";
              partSearchTerm = _content_partnum_for_extraDB;
              var pText = "";
              var clean_content_partnum_for_extraDB = removeExtraSpaces(_content_partnum_for_extraDB);
              if (extraDBIndex == null && clean_content_partnum_for_extraDB != "")
                pText = _content_partnum_for_extraDB + "<span style='color: red;'>&nbsp;&nbsp;&nbsp;Not Found in Child Database!</span>";
              else if (clean_content_partnum_for_extraDB == "") {
                pText = "";
              }
              else {
                var regexp = new RegExp(";", "g");
                var highlighted_partnum = _content_partnum_for_extraDB;
                if (regexp.exec(_content_partnum_for_extraDB) !== null) { //If match found in whole string
                  highlighted_partnum = "<span style='background: orange;'>" + _content_partnum_for_extraDB + "</span>";
                }
                pText = "<span id='span_recordviews_jump_to_child_part_" + i + "_" + j + "' class='clickable' style='color: blue;' onclick='jumpToChildPartFromRecordView(" + j + "," + extraDBIndex + ");'><u>" + highlighted_partnum + "</u></span>";
              }
              htmlToAdd += "<div id='record_view_partnum_text_" + i + "_" + j + "' style='display: inline;'>" + pText + "</div>"
                + "<div id='record_view_partnum_search_text_" + i + "_" + j + "' style='position: absolute; left: 0px; top: 0px; display: none;'>" + getStandardPNWebSearchString(partSearchTerm) + "</div>"
                + "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j + "' onfocus='onPartNumFocus(" + i + "," + j + ");' value='" + getHTMLSafeText(_content_partnum_for_extraDB) + "' onkeyup='partnum_input_keyup_event(event);' oninput='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>"
                + "<button id='record_view_partnum_save_button_" + i + "_" + j + "' style='width: 70px; display: none; background-color: #70A2FF; color: black; margin-bottom: 2px;' onclick='saveEditRecordPartReference(" + i + "," + j + ");'><span style='color: white;'>S</span>ave</button>"
                + "<button id='record_view_partnum_cancel_button_" + i + "_" + j + "' style='width: 70px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if (extraDBIndex != null) {
              var content1 = null;
              var content_extra_id = _content_extra[j][extraDBIndex][1];
              if (RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0[k] != null)
                content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0[k][j]];
              if (content1 != null) {
                if (RECORD_VIEW_HEADERS_PAGE1_0[k] == "PN") //PN
                {
                  //Filled in with link
                }
                else {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_0[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if (RECORD_VIEW_HEADERS_PAGE1_0[k] != "PN") //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_0[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
              if (RECORD_VIEW_HEADERS_PAGE1_0[k] == "T") //Truck
              {
                if (_truck_data != null && _current_employee != null) {
                  for (let [key, truck] of Object.entries(_truck_data)) {
                    if (truck.employee_id == _current_employee.key && truck.parts[content_extra_id] != null) {
                      htmlToAdd += String(truck.parts[content_extra_id].qty);
                    }
                  }
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if (RECORD_VIEW_HEADERS_PAGE1_0[k] == "PN") {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j + "' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' oninput='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }
          htmlToAdd += "<td>";
          var clean_partSearchTerm = removeExtraSpaces(partSearchTerm);
          if (clean_partSearchTerm != "") {
            var term = getStandardPNWebSearchString(partSearchTerm);
            if (!_websearch_part_term_map.get(i).includes(term))
              _websearch_part_term_map.get(i).push(term);
            htmlToAdd += "<div style='display: flex; flex-direction: row;'>";
            htmlToAdd += "<img class='clickable' id='web_search_r_" + i + "_" + j + "' src='search_r.png' width='25px' height='25px' title='Reliable Parts' onclick='newWindow(\"https://www.reliableparts.com/catalogsearch/result/?cat=2&q=" + term + "\");'>";
            // htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + term + "' target='_blank'><img id='web_search_e_" + i + "_" + j + "' src='search_e.png' width=25px title='Encompass'></a>";
            htmlToAdd += "<img class='clickable' id='web_search_m_" + i + "_" + j + "' src='search_m.png' width='25px' height='25px' title='Marcone' onclick='newWindow(\"https://beta.marcone.com/Home/SearchPartModelList?searchString=" + term + "&Type=Part\");'>";
            // htmlToAdd += "<img class='clickable' id='web_search_w_" + i + "_" + j + "' src='search_w_warning.png' width='25px' height='25px' title='WLMAY part# copy (Right click -> \"paste\" in search field on WLMAY website)' onclick='clickedWebSearch(1," + i + "," + j + "); newWindow(\"https://www.wlmay.com\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_u_" + i + "_" + j + "' src='search_u_warning.png' width='25px' height='25px' title='UED part# copy (Right click -> \"paste\" in search field on UED website)' onclick='clickedWebSearch(1," + i + "," + j + "); newWindow(\"https://www.ued.net\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_a_" + i + "_" + j + "' src='search_a.png' width='25px' height='25px' title='Appliance Parts Pros' onclick='newWindow(\"https://www.appliancepartspros.com/search.aspx?p=" + term + "\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_p_" + i + "_" + j + "' src='search_p.png' width='25px' height='25px' title='Parts Town' onclick='newWindow(\"https://www.partstown.com/parts?q=" + term + "\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_g_" + i + "_" + j + "' src='search_g.png' width='25px' height='25px' title='Google' onclick='newWindow(\"https://www.google.com/search?q=" + getGoogleSearchTerm(_content[rownum][_DESCRIP1], term) + "\");'>";
            htmlToAdd += "<table style='margin-left: 5px;'>"
              + "<tr style='background-color: #00000000;'>"
              + "<td style='padding: 0px; border: 0px;'>"
              + "<img class='clickable' src='search_r.png' width='25px' height='25px' title='Reliable Parts'>"
              + "</td>"
              + "<td style='padding: 0px; border: 0px;' id='rp_api_data_" + i + "_" + j + "'><div class='loader' style='display: block; width: 1px; height: 1px;'></div></td>"
              + "</tr>"
              // + "<tr>"
              // + "<td style='padding: 0px; border: 0px;'>"
              // + "<img class='clickable' src='search_e.png' width='25px' height='25px' title='Encompass'>"
              // + "</td>"
              // + "<td style='padding: 0px; border: 0px;'>N/A</td>"
              // + "</tr>"
              + "</table>";
            htmlToAdd += "</div>";
            request_RP_API_data(rownum, i, j);
          }
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if (clean_partSearchTerm != "") {
            var descrip1 = _content[rownum][_DESCRIP1].replace(/"/g, "");
            descrip1 = descrip1.replace(/'/g, "");
            if (extraDBIndex != null) {
              htmlToAdd += "<button id='button_recordview_image_everywhere_" + i + "_" + j + "'   style='padding-top: 0px; font-size: " + rv_fontsize + "; height: 16px; background-color: #70A2FF; color: black;'                  onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 0, \"" + _content_extra[j][extraDBIndex][1] + "\");'>I<span style='color: white;'>m</span>age</button>";
              htmlToAdd += "<button id='button_recordview_image_upload_" + i + "_" + j + "'       style='padding-top: 0px; font-size: " + rv_fontsize + "; height: 16px; background-color: #70A2FF; color: black;'                  onclick='uploadRecordViewImage(\"" + _content_extra[j][extraDBIndex][1] + "\");'>Upload</button>";
            }
            // htmlToAdd += "<button id='button_recordview_image_distributors_" + i + "_" + j + "' style='padding-top: 0px; font-size: 14px; height: 16px; background-color: #70A2FF; color: black; margin-top: 2px;' onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 1);'><div class='tooltip'><span class='tooltiptext'>Search Appliance Parts Pros,<br>Repair Clinic,<br>Encompass,<br>Marcone,<br>Reliable Parts,<br>and WL MAY<br>websites for images</span><span style='color: white;'>D</span>istributors</button>";
          }
          htmlToAdd += "</td>";

          for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_1.length; ++k) {
            htmlToAdd += "<td>";
            if (extraDBIndex != null) {
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_1[k][j]];
              if (content1 != null) {
                if (RECORD_VIEW_HEADERS_PAGE1_1[k] == "SELL") //"SELL" in usd format
                {
                  // htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</span>";
                  htmlToAdd += "<span>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</span>";
                }
                else if (RECORD_VIEW_HEADERS_PAGE1_1[k] == "CGS" || RECORD_VIEW_HEADERS_PAGE1_1[k] == "RETAIL") //"CGS",   "RETAIL" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</span>";
                }
                else if (RECORD_VIEW_HEADERS_PAGE1_1[k] == "COMMENT") //"COMMENTS"
                {
                  var htmlCheck = "<input type='checkbox' disabled>";
                  var styles = "";
                  if (content1.replace(/ /g, "").length > 0) {
                    var buttonText = "Hide";
                    if (_record_view_hidden_comments_shown == "none")
                      buttonText = "Show";
                    var buttonHTML = "";
                    if (isMobileDevice())
                      buttonHTML = "<button onclick='showRecordViewComments();'>" + buttonText + "</button>";

                    htmlCheck = "<div class='tooltip'><span class='tooltiptext'>" + content1 + "</span><input type='checkbox' checked disabled></div><span style='display: " + _record_view_hidden_comments_shown + ";'>" + content1 + "</span>" + buttonHTML;
                    styles = "style='background-color: lightgreen;'";
                  }
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "'" + styles + ">" + htmlCheck + "</span>";
                }
                else {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                //Add input for editing values
                if (RECORD_VIEW_HEADERS_PAGE1_1[k] != "SELL")
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
              }
            }
            htmlToAdd += "</td>";
          }

          htmlToAdd += "</tr>";
        }
      }

      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 18, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE], (i + "_ADVICE"), 18, "");
      var MODEL_CONTENT = getExpandableHTML(_content[rownum][_MODEL], (i + "_MODEL"), 18, "");
      var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>";
      var INPUT_LOCATION = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>";
      var INPUT_MODIFIED = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>";
      var INPUT_KEEP = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>";
      var INPUT_GET = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>";
      var INPUT_LKUPPN = "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>";
      var INPUT_ADVICE = "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>";
      var INPUT_REORD_QTY = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>";
      var INPUT_SOURCE = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>";
      var INPUT_MODEL = "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
      var INPUT_FROM = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>";

      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>"
        + "<td colspan=2><b><span id='record_view_data_read_PART_NUMBR_" + i + "'>" + _content[rownum][_PART_NUMBR] + "</span>" + INPUT_PART_NUMBR + "</b></td>"
        + "<td><b><span id='record_view_data_read_LOCATION_" + i + "'>" + _content[rownum][_LOCATION] + "</span>" + INPUT_LOCATION + "</b></td>"
        + "<td colspan=4><b><span id='record_view_data_read_MODIFIED_" + i + "'>" + _content[rownum][_MODIFIED] + "</span>" + INPUT_MODIFIED + "</b></td>"
        + "<td>KEEP  <b><span id='record_view_data_read_KEEP_" + i + "'>" + _content[rownum][_KEEP] + "</span>" + INPUT_KEEP + "</b></td>"
        + "<td>BULK <b><span id='record_view_data_read_GET_" + i + "'>" + _content[rownum][_GET] + "</span>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td>                                                 </tr>"
        + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
        + "<td colspan=2><span id='record_view_data_read_LKUPPN_" + i + "'>" + LKUPPN_CONTENT + "</span>" + INPUT_LKUPPN + "                      </td>"
        + "<td style='text-align: right;'>         ADVICE</td><td colspan=4><span id='record_view_data_read_ADVICE_" + i + "'>" + ADVICE_CONTENT + "</span>" + INPUT_ADVICE + "                    </td>"
        + "<td>REORD <b><span id='record_view_data_read_REORD_QTY_" + i + "'>" + _content[rownum][_REORD_QTY] + "</span>" + INPUT_REORD_QTY + "</b>";
      if (!_subscribed_mode || _writeable_mode)
        htmlToAdd += "<button style='font-size: " + rv_fontsize + ";' onclick='updateReordFromRecordView(\"" + parent_record_id + "\");'>Update</button>";
      htmlToAdd += "</td><td colspan=2 style='text-align: right;'>                                          Srce</td>"
        + "<td><b><span id='record_view_data_read_SOURCE_" + i + "'>" + _content[rownum][_SOURCE] + "</span>" + INPUT_SOURCE + "</b></td></tr>"
        + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
        + "<td colspan=4><span id='record_view_data_read_MODEL_" + i + "'>" + MODEL_CONTENT + "</span>" + INPUT_MODEL + "</td>"
        + "<td colspan=4>PREF  <b><span id='record_view_data_read_FROM_" + i + "'>" + _content[rownum][_FROM] + "</span>" + INPUT_FROM + "</b></td>                                                                                                                                             </tr>"
        + "</table>";
      break;
    //-------------------------------------------------PAGE 2-------------------------------------------------------------
    case 2:
      htmlToAdd += "<table class='recordview'><tr>";
      htmlToAdd += "<th>Page 2</th>"
        + "<th></th>"
        + "<th></th>"
        + "<th></th>";
      htmlToAdd += "<th><div style='display: flex; flex-direction: row;'>"
        + "<a id='web_search_r_all_" + i + "' class='clickable' target='_blank'><img src='search_r.png' width=25px title='Search Reliable Parts for every part number'></a>"
        // + "<a id='web_search_e_all_" + i + "' class='clickable' target='_blank'><img src='search_e.png' width=25px title='Search Encompass for every part number'></a>"
        + "<a id='web_search_m_all_" + i + "' class='clickable' target='_blank'><img src='search_m.png' width=25px title='Search Marcone for every part number'></a>"
        // + "<a id='web_search_w_all_" + i + "' class='clickable' target='_blank'><img src='search_w.png' width=25px title='Search WLMAY for every part number'></a>"
        + "<a id='web_search_u_all_" + i + "' class='clickable' target='_blank'><img src='search_u.png' width=25px title='Search Union Electronic Distributors for every part number'></a>"
        + "<a id='web_search_a_all_" + i + "' class='clickable' target='_blank'><img src='search_a.png' width=25px title='Search Appliance Parts Pros for every part number'></a>"
        + "<a id='web_search_p_all_" + i + "' class='clickable' target='_blank'><img src='search_p.png' width=25px title='Search Parts Town for every part number'></a>"
        + "<a id='web_search_g_all_" + i + "' class='clickable' target='_blank'><img src='search_g.png' width=25px title='Search Google for every part number'></a>"
        + "</div></th>";
      htmlToAdd += "<th></th>"
      htmlToAdd += "<th colspan='4' style='text-align: center;'>MFR PRICEBOOK</th>";
      htmlToAdd += "<th></th>"
        + "<th></th>"
        + "<th></th>";

      htmlToAdd += "</tr><tr>";
      for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE2_0.length; ++j) {
        if (j == 0)
          htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE2_0[j] + ";'><div>" + RECORD_VIEW_HEADERS_PAGE2_0[j] + "</div></th>";
      }
      htmlToAdd += "<th>Sites</th><th>Image</th>";
      for (var j = 0; j < RECORD_VIEW_HEADERS_PAGE2_1.length; ++j) {
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE2_1[j] + ";'><div>" + RECORD_VIEW_HEADERS_PAGE2_1[j] + "</div></th>";
      }
      htmlToAdd += "</tr>";
      var parent_record_id = _content[rownum][INDEXES_CONCAT.length];
      for (var j = 0; j < _EXTRA_DB.length; ++j) {
        if (j != 2) //Skip DNI ExtraDB
        {
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          // var extraDBIndex = getExtraDBLinkIndex2(rownum, j);
          if (j == _EXTRA_DB.length - 1) //Last row
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");' style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
          else
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");'>";
          var partSearchTerm = "";
          for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE2_0.length; ++k) {
            htmlToAdd += "<td>";
            if (RECORD_VIEW_HEADERS_PAGE2_0[k] == "MFR") {
              htmlToAdd += "<div style='display: flex; flex-direction: row;'>";
              htmlToAdd += "<div style='width: 30px; display: inline-block;'>" + _EXTRA_DB[j] + "</div>";
              if (extraDBIndex != null) {
                htmlToAdd += "<div style='margin-left: 10px; margin-top: -20px;' id='sell_div_" + i + "_" + j + "'><br>";
                if (!_subscribed_mode || _writeable_mode)
                  htmlToAdd += "<button style='background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' id='sell_button_" + i + "_" + j + "' onclick='startSell(" + i + "," + j + ");'><span style='color: white;'>S</span>ell</button>";
              }
              htmlToAdd += "<div id='sell_form_" + i + "_" + j + "' style='display: none;'>"
                + "<div>Quantity</div>"
                + "<button style='width: 100px; font-size: " + rv_fontsize + ";' onclick='changeSellQuantity(" + i + "," + j + ",  1);'>+</button><br>"
                + "<input onfocus='deselectTable();' style='width: 100px; height: 50px; text-align: center;' type='number' value='1' id='sell_quantity_" + i + "_" + j + "'><br>"
                + "<button style='width: 100px; font-size: " + rv_fontsize + ";' onclick='changeSellQuantity(" + i + "," + j + ", -1);'>-</button><br><br>"
                + "<button id='button_record_view_sell_confirm_" + i + "_" + j + "' style='width: 150px; height: 30px; background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='confirmSell(" + i + "," + j + ",\"" + _content_partnum_for_extraDB + "\",\"" + parent_record_id + "\");'>Confirm <span style='color: white;'>S</span>ell</button><br><br>"
                + "<button id='button_record_view_sell_cancel_" + i + "_" + j + "'  style='width: 150px; height: 30px; background-color: #70A2FF; color: black; font-size: " + rv_fontsize + ";' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button></div></div>";
              htmlToAdd += "</div></td><td>";
            }
            else if (RECORD_VIEW_HEADERS_PAGE2_0[k] == "PN") //PN
            {
              if (_subscribed_mode && !_writeable_mode)
                htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' style='width: 0px; height: 0px;'>";
              else
                htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' src='pencil.png' width=25px height=25px onclick='startEditRecordPartReference(" + i + "," + j + ");' style='position: relative; bottom: 0px;'>&nbsp;&nbsp;";
              partSearchTerm = _content_partnum_for_extraDB;
              var pText = "";
              var clean_content_partnum_for_extraDB = removeExtraSpaces(_content_partnum_for_extraDB);
              if (extraDBIndex == null && clean_content_partnum_for_extraDB != "")
                pText = _content_partnum_for_extraDB + "<span style='color: red;'>&nbsp;&nbsp;&nbsp;Not Found in Child Database!</span>";
              else if (clean_content_partnum_for_extraDB == "") {
                pText = "";
              }
              else {
                var regexp = new RegExp(";", "g");
                var highlighted_partnum = _content_partnum_for_extraDB;
                if (regexp.exec(_content_partnum_for_extraDB) !== null) { //If match found in whole string
                  highlighted_partnum = "<span style='background: orange;'>" + _content_partnum_for_extraDB + "</span>";
                }
                pText = "<span id='span_recordviews_jump_to_child_part_" + i + "_" + j + "' class='clickable' style='color: blue;' onclick='jumpToChildPartFromRecordView(" + j + "," + extraDBIndex + ");'><u>" + highlighted_partnum + "</u></span>";
              }
              htmlToAdd += "<div id='record_view_partnum_text_" + i + "_" + j + "' style='display: inline;'>" + pText + "</div>"
                + "<div id='record_view_partnum_search_text_" + i + "_" + j + "' style='position: absolute; left: 0px; top: 0px; display: none;'>" + getStandardPNWebSearchString(partSearchTerm) + "</div>"
                + "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j + "' onfocus='onPartNumFocus(" + i + "," + j + ");' value='" + getHTMLSafeText(_content_partnum_for_extraDB) + "' onkeyup='partnum_input_keyup_event(event);' oninput='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>"
                + "<button id='record_view_partnum_save_button_" + i + "_" + j + "' style='width: 70px; display: none; background-color: #70A2FF; color: black; margin-bottom: 2px;' onclick='saveEditRecordPartReference(" + i + "," + j + ");'><span style='color: white;'>S</span>ave</button>"
                + "<button id='record_view_partnum_cancel_button_" + i + "_" + j + "' style='width: 70px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if (extraDBIndex != null) {
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_0[k][j]];
              if (content1 != null) {
                if (RECORD_VIEW_HEADERS_PAGE2_0[k] == "PN") //PN
                {
                  //Filled in with link
                }
                else {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_0[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if (RECORD_VIEW_HEADERS_PAGE2_0[k] != "PN") //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE2_0[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if (RECORD_VIEW_HEADERS_PAGE2_0[k] == "PN") //PN
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j + "' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' oninput='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }

          htmlToAdd += "<td>";
          var clean_partSearchTerm = removeExtraSpaces(partSearchTerm);
          if (clean_partSearchTerm != "") {
            var term = getStandardPNWebSearchString(partSearchTerm);
            htmlToAdd += "<div style='display: flex; flex-direction: row;'>";
            htmlToAdd += "<img class='clickable' id='web_search_r_" + i + "_" + j + "' src='search_r.png' width='25px' height='25px' title='Reliable Parts' onclick='newWindow(\"https://www.reliableparts.com/catalogsearch/result/?cat=2&q=" + term + "\");'>";
            // htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + term + "' target='_blank'><img id='web_search_e_" + i + "_" + j + "' src='search_e.png' width=25px title='Encompass'></a>";
            htmlToAdd += "<img class='clickable' id='web_search_m_" + i + "_" + j + "' src='search_m.png' width='25px' height='25px' title='Marcone' onclick='newWindow(\"https://beta.marcone.com/Home/SearchPartModelList?searchString=" + term + "&Type=Part\");'>";
            // htmlToAdd += "<img class='clickable' id='web_search_w_" + i + "_" + j + "' src='search_w_warning.png' width='25px' height='25px' title='WLMAY part# copy (Right click -> \"paste\" in search field on WLMAY website)' onclick='clickedWebSearch(1," + i + "," + j + "); newWindow(\"https://www.wlmay.com\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_u_" + i + "_" + j + "' src='search_u_warning.png' width='25px' height='25px' title='UED part# copy (Right click -> \"paste\" in search field on UED website)' onclick='clickedWebSearch(1," + i + "," + j + "); newWindow(\"https://www.ued.net\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_a_" + i + "_" + j + "' src='search_a.png' width='25px' height='25px' title='Appliance Parts Pros' onclick='newWindow(\"https://www.appliancepartspros.com/search.aspx?p=" + term + "\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_p_" + i + "_" + j + "' src='search_p.png' width='25px' height='25px' title='Parts Town' onclick='newWindow(\"https://www.partstown.com/parts?q=" + term + "\");'>";
            htmlToAdd += "<img class='clickable' id='web_search_g_" + i + "_" + j + "' src='search_g.png' width='25px' height='25px' title='Google' onclick='newWindow(\"https://www.google.com/search?q" + getGoogleSearchTerm(_content[rownum][_DESCRIP1], term) + "\");'>";
            htmlToAdd += "</div>";
          }
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if (clean_partSearchTerm != "") {
            var descrip1 = _content[rownum][_DESCRIP1].replace(/"/g, "");
            descrip1 = descrip1.replace(/'/g, "");
            if (extraDBIndex != null) {
              htmlToAdd += "<button id='button_recordview_image_everywhere_" + i + "_" + j + "'   style='padding-top: 0px; font-size: " + rv_fontsize + "; height: 16px; background-color: #70A2FF; color: black;'                  onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 0, \"" + _content_extra[j][extraDBIndex][1] + "\");'>I<span style='color: white;'>m</span>age</button>";
              htmlToAdd += "<button id='button_recordview_image_upload_" + i + "_" + j + "'       style='padding-top: 0px; font-size: " + rv_fontsize + "; height: 16px; background-color: #70A2FF; color: black;'                  onclick='uploadRecordViewImage(\"" + _content_extra[j][extraDBIndex][1] + "\");'>Upload</button>";
            }
            // htmlToAdd += "<button id='button_recordview_image_distributors_" + i + "_" + j + "' style='padding-top: 0px; font-size: 14px; height: 16px; background-color: #70A2FF; color: black; margin-top: 2px;' onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 1);'><div class='tooltip'><span class='tooltiptext'>Search Appliance Parts Pros,<br>Repair Clinic,<br>Encompass,<br>Marcone,<br>Reliable Parts,<br>and WL MAY<br>websites for images</span><span style='color: white;'>D</span>istributors</button>";
          }
          htmlToAdd += "</td>";

          for (var k = 0; k < RECORD_VIEW_HEADERS_PAGE2_1.length; ++k) {
            htmlToAdd += "<td>";
            if (extraDBIndex != null) {
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_1[k][j]];
              if (content1 != null) {
                if (RECORD_VIEW_HEADERS_PAGE2_1[k] == "SELL") //"SELL" in usd format
                {
                  // htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</span>";
                  htmlToAdd += "<span>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</span>";
                }
                else if (RECORD_VIEW_HEADERS_PAGE2_1[k] == "CGS" || RECORD_VIEW_HEADERS_PAGE2_1[k] == "SUGG" || RECORD_VIEW_HEADERS_PAGE2_1[k] == "FIXED") //"CGS",   "SUGG",     "FIXED" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }) + "</span>";
                }
                else if (RECORD_VIEW_HEADERS_PAGE2_1[k] == "COMMENT") //"COMMENTS"
                {
                  var htmlCheck = "<input type='checkbox' disabled>";
                  var styles = "";
                  if (content1.replace(/ /g, "").length > 0) {
                    var buttonText = "Hide";
                    if (_record_view_hidden_comments_shown == "none")
                      buttonText = "Show";
                    var buttonHTML = "";
                    if (isMobileDevice())
                      buttonHTML = "<button onclick='showRecordViewComments();'>" + buttonText + "</button>";
                    htmlCheck = "<div class='tooltip'><span class='tooltiptext'>" + content1 + "</span><input type='checkbox' checked disabled></div><span style='display: " + _record_view_hidden_comments_shown + ";'>" + content1 + "</span>" + buttonHTML;
                    styles = "style='background-color: lightgreen;'";
                  }
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "'" + styles + ">" + htmlCheck + "</span>";
                }
                else {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }

                if (RECORD_VIEW_HEADERS_PAGE2_1[k] != "SELL")
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";

              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if (RECORD_VIEW_HEADERS_PAGE2_1[k] == "PN") //PN
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j + "' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' oninput='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }

          htmlToAdd += "</tr>";
        }
      }

      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 80, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE], (i + "_ADVICE"), 80, "");
      var MODEL_CONTENT = getExpandableHTML(_content[rownum][_MODEL], (i + "_MODEL"), 80, "");
      var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>";
      var INPUT_LOCATION = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>";
      var INPUT_MODIFIED = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>";
      var INPUT_KEEP = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>";
      var INPUT_GET = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>";
      var INPUT_LKUPPN = "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>";
      var INPUT_ADVICE = "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>";
      var INPUT_REORD_QTY = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>";
      var INPUT_SOURCE = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>";
      var INPUT_MODEL = "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
      var INPUT_FROM = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>";

      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>"
        + "<td colspan=2><b><span id='record_view_data_read_PART_NUMBR_" + i + "'>" + _content[rownum][_PART_NUMBR] + "</span>" + INPUT_PART_NUMBR + "</b></td>"
        + "<td><b><span id='record_view_data_read_LOCATION_" + i + "'>" + _content[rownum][_LOCATION] + "</span>" + INPUT_LOCATION + "</b></td>"
        + "<td colspan=4><b><span id='record_view_data_read_MODIFIED_" + i + "'>" + _content[rownum][_MODIFIED] + "</span>" + INPUT_MODIFIED + "</b></td>"
        + "<td>KEEP  <b><span id='record_view_data_read_KEEP_" + i + "'>" + _content[rownum][_KEEP] + "</span>" + INPUT_KEEP + "</b></td>"
        + "<td>BULK <b><span id='record_view_data_read_GET_" + i + "'>" + _content[rownum][_GET] + "</span>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td>                                                 </tr>"
        + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
        + "<td colspan=2><span id='record_view_data_read_LKUPPN_" + i + "'>" + LKUPPN_CONTENT + "</span>" + INPUT_LKUPPN + "                      </td>"
        + "<td style='text-align: right;'>         ADVICE</td><td colspan=4><span id='record_view_data_read_ADVICE_" + i + "'>" + ADVICE_CONTENT + "</span>" + INPUT_ADVICE + "                    </td>"
        + "<td>REORD <b><span id='record_view_data_read_REORD_QTY_" + i + "'>" + _content[rownum][_REORD_QTY] + "</span>" + INPUT_REORD_QTY + "</b>";
      if (!_subscribed_mode || _writeable_mode)
        htmlToAdd += "<button style='font-size: " + rv_fontsize + ";' onclick='updateReordFromRecordView(\"" + parent_record_id + "\");'>Update</button>";
      htmlToAdd += "</td><td colspan=2 style='text-align: right;'>                                          Srce</td>"
        + "<td><b><span id='record_view_data_read_SOURCE_" + i + "'>" + _content[rownum][_SOURCE] + "</span>" + INPUT_SOURCE + "</b></td></tr>"
        + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
        + "<td colspan=4><span id='record_view_data_read_MODEL_" + i + "'>" + MODEL_CONTENT + "</span>" + INPUT_MODEL + "</td>"
        + "<td colspan=4>PREF  <b><span id='record_view_data_read_FROM_" + i + "'>" + _content[rownum][_FROM] + "</span>" + INPUT_FROM + "</b></td>                                                                                                                                             </tr>"
        + "</table>";
      break;
    //-------------------------------------------------PAGE 3-------------------------------------------------------------
    case 3:
      htmlToAdd += "<table class='recordview'><tr><th colspan='3'>Page 3</th></tr>"
        + "<tr><td colspan='3'>" + _content[rownum][_SPECMETHOD] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 1] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 4] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 7] + "</td></tr>"
        + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 2] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 5] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 8] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 3] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 6] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 9] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 10] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 13] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 16] + "</td></tr>"
        + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 11] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 14] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 17] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 12] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 15] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 18] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 19] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 22] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 25] + "</td></tr>"
        + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 20] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 23] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 26] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 21] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 24] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 27] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 28] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 31] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP + "'>" + _content[rownum][_SPECMETHOD + 34] + "</td></tr>"
        + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 29] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 32] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 35] + "</td></tr>"
        + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 30] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 33] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 36] + "</td></tr>"
        + "<tr><td colspan='3'><br>" + _RECORDVIEW_FRACTIONS_TO_DECIMAL_TEXT + "</td></tr>"
        + "</table>";
      break;
    //-------------------------------------------------PAGE 4-------------------------------------------------------------
    case 4:
      htmlToAdd += "<table class='recordview'><tr><th>Page 4</th></tr>";
      for (var j = 0; j < _EXTRA_DB.length; ++j) {
        if (j != 2) //Skip DNI ExtraDB
        {
          htmlToAdd += "<tr><td><b>" + _EXTRA_DB[j] + ":</b> ";
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          // var extraDBIndex = getExtraDBLinkIndex2(rownum, j);
          if (extraDBIndex != null) {
            htmlToAdd += _content_extra[j][extraDBIndex][0][CE_COMMENTS];
          }
          htmlToAdd += "</td></tr>";
        }
      }
      htmlToAdd += "<tr><td><b>NEWER:</b> " + _content[rownum][_NEWER] + "</td></tr>"
        + "<tr><td><b>NEW:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + _content[rownum][_NEW] + "</td></tr>"
        + "<tr><td><b>QUESTIONS:</b> " + _content[rownum][_QUESTIONS] + "</td></tr>"
        + "</table>";
      break;
  }
  return htmlToAdd;
}

function setRecordViewPage(pagenum, i) {
  var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
  if (rownum != null) {
    var htmlToAdd = getRecordViewPage(rownum, pagenum, i);
    _record_view_page_list[i] = pagenum;
    document.getElementById("record_view_details_" + i + "_div").innerHTML = htmlToAdd;
    var ele = document.getElementById("web_search_r_all_" + i);
    if (ele != null) {
      document.getElementById("web_search_r_all_" + i).href = getWebSearchURL(0, i, rownum);
      // document.getElementById("web_search_e_all_" + i).href = getWebSearchURL(1, i);
      document.getElementById("web_search_m_all_" + i).href = getWebSearchURL(2, i, rownum);
      // document.getElementById("web_search_w_all_" + i).href = getWebSearchURL(4, i);
      document.getElementById("web_search_u_all_" + i).href = getWebSearchURL(6, i, rownum);
      document.getElementById("web_search_a_all_" + i).href = getWebSearchURL(3, i, rownum);
      document.getElementById("web_search_p_all_" + i).href = getWebSearchURL(4, i, rownum);
      document.getElementById("web_search_g_all_" + i).href = getWebSearchURL(5, i, rownum);
    }
    ele = document.getElementById("record_view_data_edit_icon_" + i);
    if (ele != null && pagenum != 1 && pagenum != 2)
      ele.style.display = "none";
    else
      ele.style.display = "";
    setKeyboardShortcutBar();
  }
}

function onRecordViewPartsRowClick(recordview, row) {
  for (var i = 0; i < _recordViews.length; ++i) {
    for (var j = 0; j < _EXTRA_DB.length; ++j) {
      var ele = document.getElementById("record_view_parts_row_" + i + "_" + j);
      if (ele != null)
        ele.style.backgroundColor = "";
    }
  }

  var ele = document.getElementById("record_view_parts_row_" + recordview + "_" + row);
  if (ele != null)
    ele.style.backgroundColor = "lightblue";
}

function changeRecordViewDown() {
  if (!partnum_input_was_pressed_first) {
    if (_recordViews.length > _selected_record_view && _selected_record_view >= 0) {
      var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
      if (rownum != null) {
        var nextIndex = getNextContentIndexInSortOrder(rownum, !_contentSortedReverse);
        if (nextIndex != null) {
          var newID = _content[nextIndex][_content[nextIndex].length - 1];
          // if (_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && !_recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
          //   _recordViews_Key_To_Details_Open.set(newID, false);
          // else
          //   _recordViews_Key_To_Details_Open.set(newID, true);
          _recordViews[_selected_record_view] = newID
          populateRecordViews();
        }
        // }
      }
    }
  }
}

function changeRecordViewUp() {
  if (!partnum_input_was_pressed_first) {
    if (_recordViews.length > _selected_record_view && _selected_record_view >= 0) {
      var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
      if (rownum != null) {
        // if(rownum > 0)
        // {
        var nextIndex = getNextContentIndexInSortOrder(rownum, _contentSortedReverse);
        if (nextIndex != null) {
          // var newID = _content[rownum - 1][_content[rownum - 1].length - 1];
          var newID = _content[nextIndex][_content[nextIndex].length - 1];
          // if (_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && !_recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
          //   _recordViews_Key_To_Details_Open.set(newID, false);
          // else
          //   _recordViews_Key_To_Details_Open.set(newID, true);
          _recordViews[_selected_record_view] = newID
          populateRecordViews();
        }
        // }
      }
    }
  }
}

function recordView_JumpToAka() {
  if (_recordViews.length > _selected_record_view) {
    var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
    if (rownum != null) {
      var content_extra_pn = _content[rownum][_OEM_PN];
      var extraDBIndex = getExtraDBLinkIndex(_EXTRA_DB_OEM, content_extra_pn);
      // var extraDBIndex = getExtraDBLinkIndex2(rownum, _EXTRA_DB_OEM);
      if (extraDBIndex != null) {
        var akaPN = _content_extra[_EXTRA_DB_OEM][extraDBIndex][0][CE_AKA];
        if (akaPN != null && akaPN.length > 0) {
          var extraDBIndex_aka = getExtraDBLinkIndex(_EXTRA_DB_OEM, akaPN);
          if (extraDBIndex_aka != null) {
            var rownum_aka = getParentRecordIndexWithChildPart_IncludingAKA(_EXTRA_DB_OEM, extraDBIndex_aka);
            if (rownum_aka != null)
              replaceRecordView(_selected_record_view, _content[rownum_aka][INDEXES_CONCAT.length]);
          }
          else
            showSnackbar("Couldn't find AKA Part Number in Database", 5000);
        }
        else
          showSnackbar("Couldn't find AKA Part Number for this part", 5000);
      }
      else
        showSnackbar("Couldn't find child part", 5000);
    }
    else
      showSnackbar("Couldn't find part", 5000);
  }
}

function setImageRadio() {
  if (document.getElementById("radio_image_everywhere").checked) {
    showRecordViewImage(_cse_image_descrip1, _cse_image_partSearchTerm, 0);
  }
  else if (document.getElementById("radio_image_distributors").checked) {
    showRecordViewImage(_cse_image_descrip1, _cse_image_partSearchTerm, 1);
  }
  else {
    showRecordViewImage(_cse_image_descrip1, _cse_image_partSearchTerm, 2);
  }
}

function getWebSearchURL(site, i, rownum) {
  // for (var j = 0; j < _EXTRA_DB.length; ++j) { //Firefox blocks it due to lack of user activation
  //   var ele = document.getElementById(ele_name + "_" + i + "_" + j);
  //   if (ele != null)
  //     ele.click();
  // }

  var sitename = "";
  switch (site) {
    case 0:
      sitename = "reliableparts.com";
      break;
    case 1:
      sitename = "encompass.com";
      break;
    case 2:
      sitename = "marcone.com";
      break;
    case 3:
      sitename = "appliancepartspros.com";
      break;
    case 4:
      sitename = "partstown.com";
      break;
    // case 4:
    //   sitename = "wlmay.com";
    //   break;
    case 6:
      sitename = "ued.net";
      break;
  }

  if (_websearch_part_term_map.has(i)) {
    if (site == 5) //Google General
      sitename = "https://www.google.com/search?q=";
    else
      sitename = "https://www.google.com/search?q=site%3Ahttps%3A%2F%2F" + sitename;

    var arr = _websearch_part_term_map.get(i);
    for (var i = 0; i < arr.length; ++i) {
      if (i != 0)
        sitename += "+OR";
      else if (site == 5) { //Google General
        var descrip1_split = standardizeString(_content[rownum][_DESCRIP1].replace(/-/g, " ")).split(" ");
        var descrip1 = "";
        if (descrip1_split.length > 0)
          descrip1 = descrip1_split[0];
        sitename += "+" + descrip1;
      }
      sitename += "+" + arr[i];
    }
    if (site == 0) //reliableparts.com
      sitename += " -lookup";
  }
  return sitename;
}

function clickedWebSearch(num, i, j) {
  var ele = document.getElementById("record_view_partnum_search_text_" + i + "_" + j);
  if (ele != null) {
    ele.style.display = "";
    copyTextInEle("record_view_partnum_search_text_" + i + "_" + j);
    ele.style.display = "none";
  }
}

function recordViewPageUp() {
  if (_record_view_page_list[_selected_record_view] > 1) {
    setRecordViewPage(_record_view_page_list[_selected_record_view] - 1, _selected_record_view);
  }
}

function recordViewPageDown() {
  if (_record_view_page_list[_selected_record_view] < _RECORDVIEW_MAX_PAGES) {
    setRecordViewPage(_record_view_page_list[_selected_record_view] + 1, _selected_record_view);
  }
}

function recordViewUp(event) {
  if (_selected_record_view >= 0) {
    changeRecordViewUp();
    if (event)
      event.preventDefault();
  }
}

function recordViewDown(event) {
  if (_selected_record_view >= 0) {
    changeRecordViewDown();
    if (event)
      event.preventDefault();
  }
}

document.getElementById("recordViewImageInput").addEventListener('change', recordViewReadImageInput, false);
var _selected_image_part = null;
function uploadRecordViewImage(id) {
  _selected_image_part = id;
  document.getElementById("recordViewImageInput").click();
}

function recordViewReadImageInput(evt) {
  for (let f of evt.target.files) {
    if (f) {
      showSnackbar("Uploading...", 2000);

      var reff = firebase.database().ref().push();
      var Ref = firebase.storage().ref().child("child_part_images").child(_selected_image_part).child(reff.key + "." + getExtension(f.name));
      Ref.put(f).then((snapshot) => {
        showSnackbar("Upload complete!", 2000);
        return snapshot.ref.getDownloadURL();
      })
        .then(downloadURL => {
        })
        .catch((error) => {
          console.error("File upload failed:|" + error.code + "|" + error.message);
        });
    } else {
      alert("Failed to load file");
    }
  }
  document.getElementById("recordViewImageInput").value = "";
}

function deleteSearchImage() {
  firebase.storage().ref().child("child_part_images").child(_selected_image_part).child(_current_local_images_names[_current_local_image_index]).delete()
    .then(() => {
      showRecordViewImage("", "", 2);
      showSnackbar("Deletion successful!", 2000);
    }).catch((error) => {
      showSnackbar("Deletion failure!", 2000);
    });
}

var _record_view_hidden_comments_shown = "none";
function showRecordViewComments() {
  if (_record_view_hidden_comments_shown == "none")
    _record_view_hidden_comments_shown = "";
  else
    _record_view_hidden_comments_shown = "none";
  populateRecordViews();
}

var _image_search_link = "";
function linkSearchImage() {
  var windowReference = window.open();
  windowReference.location = _image_search_link;
}

function recordView_Copy(i) {
  copyParentRecord(_recordViews[i]); //Key of parent record
  addRecordView(_content[_content.length - 1][_content[_content.length - 1].length - 1], i + 1);
  _record_view_to_edit = i + 1;
  // startEditRecordViewData(i + 1); //Can't call this because populateRecordViews() is called from reloadContentExtraFromChangeAlert() with a slight delay and cancels editing
}

function request_RP_API_data(rownum, i, j) {
  if (rownum != null) {
    var handleResponse = function (data) {
      // console.log(data);
      if (data.partSearchNewResponse.errorCode == "100" && data.partSearchNewResponse.partSearchList != null && data.partSearchNewResponse.partSearchList.partSearchData.length > 0) {
        var price = Number(data.partSearchNewResponse.partSearchList.partSearchData[0].partPrice);
        var qty = data.partSearchNewResponse.partSearchList.partSearchData[0].quantityOnHand;
        var style = "";
        if (qty == 0)
          style = "style='color: red;'";
        if (isNaN(price))
          price = 0;
        price = get_USD_String(price);
        document.getElementById("rp_api_data_" + i + "_" + j).innerHTML = "$" + price + " <span " + style + ">" + qty + "</span>";
      }
      else
        document.getElementById("rp_api_data_" + i + "_" + j).innerHTML = "N/A";
    }

    var handleError = function (error) {
      console.error(error);
      document.getElementById("rp_api_data_" + i + "_" + j).innerHTML = "N/A";
    }

    var pn = getStandardPNWebSearchString(_content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]]).toUpperCase();
    fetch('https://stgapi.reliableparts.net:8077/ws/rest/ReliablePartsBoomiAPI/partSearch/v2/query', {
      method: 'POST',
      headers: {
        'X-API-Key': '8cbb261d-c32b-41ac-b9bb-8918116564d1',
        'Authorization': 'Basic MDQwMzcyOlJQQFN0Z0FwaUFhQXF1QXBwIzIwMjM=',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "PartSearchNewRequest": {
          "distanceMeasure": "",
          "partNumber": pn,
          "postalCode": "97402",
          "quantity": "",
          "warehouse": ""
        }
      })
    })
      .then(response => response.json())
      .then(data => handleResponse(data))
      .catch(error => handleError(error))
  }
  else
    document.getElementById("rp_api_data_" + i + "_" + j).innerHTML = "N/A";
}