var _recordViews = [];
var _recordViews_Key_To_Details_Open = new Map();
var _recordViewHightlightType = 0;
var _selected_record_view = 0;
var _last_selected_record_view = 0;
var _RECORDVIEW_COMPAREALL_MINREPITITIONS = 2;

function populateRecordViews()
{
  var singleWordsToOccurences = new Map(); //Standardized (word) to      [[num occurences, color],             [actual word spellings], [row nums]]
  var doubleWordsToOccurences = new Map(); //Standardized (word word) to [[num occurences, color, word, word], [actual word spellings], [row nums]]
  var termToHighlightList = [];
  var preHTML_List = [];
  var postHTML_List = [];
  if(_recordViewHightlightType == 2) //Show Compare All
  {
    var array1 = [];
    for(var i = 0; i < _recordViews.length; ++i)
    {
      array1.push([]);
      var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
      if(rownum != null)
      {
        var equip_type_text = _content[rownum][_EQUIP_TYPE];
        var appl_brand_text = _content[rownum][_APPL_BRAND];
        var descrip1_text =   _content[rownum][_DESCRIP1];
        var descrip2_text =   _content[rownum][_DESCRIP2];
        var comments_text =   _content[rownum][_COMMENTS];
        array1[i] = [equip_type_text, appl_brand_text, descrip1_text, descrip2_text, comments_text];
      }
    }
    //Get string repetition info---------------------------------------------
    for(var i = 0; i < array1.length; ++i)
    {
      var row = array1[i];
      for(var j = 0; j < 5; ++j)
      {
        var string = row[j];
        var lastCharWasSpace = true;
        var start0 = 0;
        var end = 0;
        var start1 = 0;
        for(var k = 0; k < string.length; ++k)
        {
          var char = string[k];
          var charIsSpace = (char == " ");
          var endOfString = (k + 1 == string.length);
          if(lastCharWasSpace && !charIsSpace){ //Beginning of word
            start0 = start1;
            start1 = k;
          }
          else if((!lastCharWasSpace && charIsSpace) || endOfString){ //Space at end of word or end of string
            if(endOfString)
              end = k + 1;
            else
              end = k;
            var singleWord = string.substring(start1, end);
            var singleWordStandard = standardizeString(singleWord);
            if(!_WORDS_TO_IGNORE.includes(singleWordStandard) && singleWordStandard.length > 1){
              if(singleWordsToOccurences.has(singleWordStandard))
              {
                var value = singleWordsToOccurences.get(singleWordStandard)
                value[0][0] = value[0][0] + 1;
                if(!value[2].includes(i))
                  value[2].push(i);
                if(!value[1].includes(singleWord)){
                  value[1].push(singleWord);
                }
              }
              else{
                // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                var color = getColorFromString(singleWordStandard);
                var value = [[1, color], [singleWord], [i]];
                singleWordsToOccurences.set(singleWordStandard, value);
              }
            }
            if(start0 != start1){
              var doubleWord = string.substring(start0, end);
              var doubleWordStandard = standardizeString(doubleWord);
              var doubleWordSplit = doubleWordStandard.split(" ");
              if(!_WORDS_TO_IGNORE.includes(doubleWordSplit[0]) && !_WORDS_TO_IGNORE.includes(doubleWordSplit[1]) && doubleWordStandard.length > 3){
                if(doubleWordsToOccurences.has(doubleWordStandard)){
                  var value = doubleWordsToOccurences.get(doubleWordStandard)
                  value[0][0] = value[0][0] + 1;
                  if(!value[2].includes(i))
                    value[2].push(i);
                  if(!value[1].includes(doubleWord)){
                    value[1].push(doubleWord);
                  }
                }
                else{
                  // var color = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
                  var color = getColorFromString(doubleWordStandard);
                  var value = [   [1, color, doubleWordSplit[0], doubleWordSplit[1]],  [doubleWord], [i]];
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
    if(value[0][0] >= _RECORDVIEW_COMPAREALL_MINREPITITIONS){
      var color = value[0][1];
      var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
      for(var v = 0; v < value[1].length; ++v){
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
    if(value[0][0] >= _RECORDVIEW_COMPAREALL_MINREPITITIONS){
      var color = value[0][1];
      var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
      for(var v = 0; v < value[1].length; ++v){
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
  
  if(_selected_record_view == -1)
  _selected_record_view = 0;
  var tab_text = "Record Views";
  if(_recordViews.length > 0)
  tab_text += "&nbsp;&nbsp;<span style='background-color: red; color: white; font-weight: bold;'>&nbsp;" + _recordViews.length + "&nbsp;</span>";
  document.getElementById("TAB_record_views").innerHTML = tab_text;
  document.getElementById("record_views_div").innerHTML = "";
  var htmlToAdd = "";
  var differences_checked = "";
  var similarities_checked = "";
  var compareall_checked = "";
  if(_recordViewHightlightType == 0)
    differences_checked = "checked";
  else if(_recordViewHightlightType == 1)
    similarities_checked = "checked";
  else if(_recordViewHightlightType == 2)
    compareall_checked = "checked";
  if(_recordViews.length > 0)
  htmlToAdd += 
  // "<h1 class='clickable' onclick='toggleDiv(null, \"record_views_table\");'><span id='record_views_table_expander_icon' style='font-size: 50px; font-weight: 100;'>-</span> Record Views</h1>" + 
  "<div id='record_views_table_div'>" +
  "<label class='radiobutton_container' style='display: inline;'>Show Differences&nbsp;&nbsp; <input onchange='setRecordViewHighlightType(0);' type='radio' id='radio_record_views_differences'  name='radio_record_views_highlighting'" + differences_checked +  "><span class='radiomark'></span></label>" +
  "<label class='radiobutton_container' style='display: inline;'>Show Similarities&nbsp;&nbsp;<input onchange='setRecordViewHighlightType(1);' type='radio' id='radio_record_views_similarities' name='radio_record_views_highlighting'" + similarities_checked + "><span class='radiomark'></span></label>" +
  "<label class='radiobutton_container' style='display: inline;'>Show Compare All&nbsp;&nbsp; <input onchange='setRecordViewHighlightType(2);' type='radio' id='radio_record_views_compareall'   name='radio_record_views_highlighting'" + compareall_checked +   "><span class='radiomark'></span></label>" +
  "<br><br>";
  
  var first_record_rownum = 0;
  for(var i = 0; i < _recordViews.length; ++i)
  {
    var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
    if(rownum != null)
    {
      var equip_type_text = _content[rownum][_EQUIP_TYPE];
      var appl_brand_text = _content[rownum][_APPL_BRAND];
      var descrip1_text =   _content[rownum][_DESCRIP1];
      var descrip2_text =   _content[rownum][_DESCRIP2];
      var comments_text =   _content[rownum][_COMMENTS];
      
      if(_recordViewHightlightType == 2)
      {        
        equip_type_text = highlightString(equip_type_text, termToHighlightList, preHTML_List, postHTML_List);
        appl_brand_text = highlightString(appl_brand_text, termToHighlightList, preHTML_List, postHTML_List);
        descrip1_text = highlightString(descrip1_text, termToHighlightList, preHTML_List, postHTML_List);
        descrip2_text = highlightString(descrip2_text, termToHighlightList, preHTML_List, postHTML_List);
        comments_text = highlightString(comments_text, termToHighlightList, preHTML_List, postHTML_List);
      }
      else
      {
        if(i == 0){
          first_record_rownum = rownum;
        }
        else{
          var equip_type_indexes = getWordCompareIndexes(_content[first_record_rownum][_EQUIP_TYPE], equip_type_text, _recordViewHightlightType);
          var appl_brand_indexes = getWordCompareIndexes(_content[first_record_rownum][_APPL_BRAND], appl_brand_text, _recordViewHightlightType);
          var descrip1_indexes = getWordCompareIndexes(  _content[first_record_rownum][_DESCRIP1], descrip1_text,     _recordViewHightlightType);
          var descrip2_indexes = getWordCompareIndexes(  _content[first_record_rownum][_DESCRIP2], descrip2_text,     _recordViewHightlightType);
          var comments_indexes = getWordCompareIndexes(  _content[first_record_rownum][_COMMENTS], comments_text,     _recordViewHightlightType);
          var preHTML = "<span style='background: salmon;'>";
          if(_recordViewHightlightType == 1)
            preHTML = "<span style='background: lightgreen;'>";
          var postHTML = "</span>";
          equip_type_text = highlightStringBasic(equip_type_text, equip_type_indexes.startIndexes, equip_type_indexes.endIndexes, preHTML, postHTML);
          appl_brand_text = highlightStringBasic(appl_brand_text, appl_brand_indexes.startIndexes, appl_brand_indexes.endIndexes, preHTML, postHTML);
          descrip1_text =   highlightStringBasic(descrip1_text,   descrip1_indexes.startIndexes,   descrip1_indexes.endIndexes,   preHTML, postHTML);
          descrip2_text =   highlightStringBasic(descrip2_text,   descrip2_indexes.startIndexes,   descrip2_indexes.endIndexes,   preHTML, postHTML);
          comments_text =   highlightStringBasic(comments_text,   comments_indexes.startIndexes,   comments_indexes.endIndexes,   preHTML, postHTML);
        }
      }
      var bgstyle = "";
      if(i == _selected_record_view)
        bgstyle = "style='background-color: lightblue;'";
      htmlToAdd += "<div class='recordview' id='record_view_" + i + "' " + bgstyle + " onclick='selectRecordView(" + i + ");'>";
      htmlToAdd += "<span style='color: white; background-color: #70A2FF; font-size: 30px;'>&nbsp;" + (i + 1) + "&nbsp;</span>&nbsp;";
      htmlToAdd += "<button style='width: 50px; background-color: #70A2FF;' onclick='removeRecordView(" + i + ");' id='button_record_view_exit_" + i + "'>X</button> "
      + "<button style='background-color: #70A2FF; color: black;' onclick='populateRecordBrowser(" + rownum + ",true); setTab(" + TAB_RECORD_BROWSER + ");' id='button_record_view_jump_to_browser_" + i + "'><span style='color: white;'>B</span>rowser</button> "
      + "<img class='clickable' id='record_view_data_edit_icon_" + i + "' src='pencil.png' onclick='startEditRecordViewData(" + i + ")'; width=25px height=25px style='position: relative; top: 6px;'>"
      + "<button id='record_view_data_save_button_"   + i  + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black;' onclick='saveEditRecordViewData(" + i + ");'><span style='color: white;'>S</span>ave</button>&nbsp;"
      + "<button id='record_view_data_cancel_button_" + i + "'  style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>"
      + "<div style='display: flex;'><div class='border_center' style='flex-grow: 1;'></div>" 
      + "<div class='text1'>" 
      + "<span id='record_view_data_read_equip_type_" + i + "'>" + equip_type_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_equip_type_" + i + "' style='width: 50px; display: none;' value='" + getHTMLSafeText(_content[rownum][_EQUIP_TYPE]) + "'>" + " / " 
      + "<span id='record_view_data_read_appl_brand_" + i + "'>" + appl_brand_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_appl_brand_" + i + "' style='width: 50px; display: none;' value='" + getHTMLSafeText(_content[rownum][_APPL_BRAND]) + "'>" + "</div>"
      + "<div class='border_center' style='flex-grow: 8;'></div></div>"
      + "<div style='display: block; border-left: solid; border-bottom: solid; border-right: solid; border-width: 2px; border-color: black;'>" 
      + "<p style='padding-left: 10px;'><b>DESCRIP1:</b> <span id='record_view_data_read_descrip1_" + i + "'>" + descrip1_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_descrip1_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_DESCRIP1]) + "'><br>"
      + "<b>DESCRIP2: </b><span id='record_view_data_read_descrip2_" + i + "'>" + descrip2_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_descrip2_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_DESCRIP2]) + "'></p>"
      + "<p style='padding-left: 10px;'><b>COMMENTS:</b> <span id='record_view_data_read_comments_" + i + "'>" + comments_text + "</span><input type='text' onfocus='deselectTable();' id='record_view_data_input_comments_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_COMMENTS]) + "'></p>";
      var details_expanded = true;
      if(_recordViews_Key_To_Details_Open.has(_recordViews[i]) && !_recordViews_Key_To_Details_Open.get(_recordViews[i]))
        details_expanded = false;
      if(details_expanded)
      {
        htmlToAdd += "</div><div id='div_recordview_collapser_" + i + "' class=clickable style='font-size: 20px; background-color: #96BBFF' onclick='toggleDiv(null, \"record_view_details_" + i + "\")'><span id='record_view_details_" + i + "_expander_icon' style='font-size: 24px; color: white;'>-</span> Details</div>";
        htmlToAdd += "<div id='record_view_details_" + i + "_div' style='display: block;'>";
      }
      else
      {
        htmlToAdd += "</div><div id='div_recordview_collapser_" + i + "' class=clickable style='font-size: 20px; background-color: #96BBFF' onclick='toggleDiv(null, \"record_view_details_" + i + "\")'><span id='record_view_details_" + i + "_expander_icon' style='font-size: 24px; color: white;'>+</span> Details</div>";
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
  for(var i = 0; i < _recordViews.length; ++i)
  {
    setRecordViewPage(_record_view_page_list[i], i);
  }
  selectRecordView(_last_selected_record_view);
}

function startEditRecordViewData(index)
{
  hideRecordViewEditAndSellIcons();
  deselectTable();
  document.getElementById("button_record_view_exit_" + index).style.display = "none";
  document.getElementById("button_record_view_jump_to_browser_" + index).style.display = "none";
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

  document.getElementById("record_view_data_input_equip_type_" + index).style.display = "";
  document.getElementById("record_view_data_input_appl_brand_" + index).style.display = "";
  document.getElementById("record_view_data_input_descrip1_" + index).style.display =   "";
  document.getElementById("record_view_data_input_descrip2_" + index).style.display =   "";
  document.getElementById("record_view_data_input_comments_" + index).style.display =   "";
  document.getElementById("record_view_data_input_PART_NUMBR_" + index).style.display = "";
  document.getElementById("record_view_data_input_LOCATION_" + index).style.display =   "";
  document.getElementById("record_view_data_input_MODIFIED_" + index).style.display =   "";
  document.getElementById("record_view_data_input_KEEP_" + index).style.display =       "";
  document.getElementById("record_view_data_input_GET_" + index).style.display =        "";
  document.getElementById("record_view_data_input_LKUPPN_" + index).style.display =     "";
  document.getElementById("record_view_data_input_ADVICE_" + index).style.display =     "";
  document.getElementById("record_view_data_input_REORD_QTY_" + index).style.display =  "";
  document.getElementById("record_view_data_input_SOURCE_" + index).style.display =     "";
  document.getElementById("record_view_data_input_MODEL_" + index).style.display =      "";
  document.getElementById("record_view_data_input_FROM_" + index).style.display =       "";

  for(var i = 0; i < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++i){
    for(var j = 0; j < _EXTRA_DB.length; ++j)
    {
      var ele = document.getElementById("record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_CONCAT[i] + "_" + index + "_" + j);
      if(ele != null)
      {
        ele.style.display = "none";
        document.getElementById("record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_CONCAT[i] + "_" + index + "_" + j).style.display = "";
      }
    }
  }
  var ele2 = document.getElementById("record_view_data_input_equip_type_" + index);
  ele2.focus();
  ele2.select();
}

function saveEditRecordViewData(index)
{
  var rownum = getContentIndexFrom_DB_ID(_recordViews[index]);
  if(rownum != null)
  {
    _content[rownum][_EQUIP_TYPE] = String(document.getElementById("record_view_data_input_equip_type_" + index).value);
    _content[rownum][_APPL_BRAND] = String(document.getElementById("record_view_data_input_appl_brand_" + index).value);
    _content[rownum][_DESCRIP1  ] = String(document.getElementById("record_view_data_input_descrip1_" + index).value);
    _content[rownum][_DESCRIP2  ] = String(document.getElementById("record_view_data_input_descrip2_" + index).value);
    _content[rownum][_COMMENTS  ] = String(document.getElementById("record_view_data_input_comments_" + index).value);
    _content[rownum][_PART_NUMBR] = String(document.getElementById("record_view_data_input_PART_NUMBR_" + index).value);
    _content[rownum][_LOCATION  ] = String(document.getElementById("record_view_data_input_LOCATION_" + index).value);
    _content[rownum][_MODIFIED  ] = String(document.getElementById("record_view_data_input_MODIFIED_" + index).value);
    _content[rownum][_KEEP      ] = String(document.getElementById("record_view_data_input_KEEP_" + index).value);
    _content[rownum][_GET       ] = String(document.getElementById("record_view_data_input_GET_" + index).value);
    
    _content[rownum][_LOOK_UP_PN] = String(document.getElementById("record_view_data_input_LKUPPN_" + index).value).split("\n"); //TextArea
    _content[rownum][_ADVICE    ] = String(document.getElementById("record_view_data_input_ADVICE_" + index).value).split("\n"); //TextArea
    _content[rownum][_REORD_QTY ] = String(document.getElementById("record_view_data_input_REORD_QTY_" + index).value);
    _content[rownum][_SOURCE    ] = String(document.getElementById("record_view_data_input_SOURCE_" + index).value);
    _content[rownum][_MODEL     ] = String(document.getElementById("record_view_data_input_MODEL_" + index).value).split("\n"); //TextArea
    _content[rownum][_FROM      ] = String(document.getElementById("record_view_data_input_FROM_" + index).value);
    generateContent_Standard_Row(rownum);
    var edb_indexes = [];
    for(var j = 0; j < _EXTRA_DB.length; ++j)
    {
      var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
      var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
      if(extraDBIndex != null)
      {
        edb_indexes.push(extraDBIndex);
        for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_CONCAT.length; ++k)
        {
          var ele = document.getElementById("record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_CONCAT[k] + "_" + index + "_" + j);
          if(ele != null)
          {
            _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT[k][j]] = String(ele.value);
          }
        }
      }
      else
        edb_indexes.push(null);
    }
    for(var j = 0; j < _EXTRA_DB.length; ++j)
    {
      if(edb_indexes[j] != null)
        saveContentExtraToDatabase(j, edb_indexes[j]); 
    }
    saveContentToDatabase(rownum);
  }
  populateRecordViews();
}

function recordViewIconMouseOver(id1) {
  var icon = document.getElementById("record_view_icon_" + id1);
  if (icon != null)
    document.getElementById("record_view_icon_" + id1).style.display = "";
}

function recordViewIconMouseOut(id1) {
  var icon = document.getElementById("record_view_icon_" + id1);
  if (icon != null)
    document.getElementById("record_view_icon_" + id1).style.display = "none";
}

var _record_view_page_list = [];
function addRecordView(key) {
  showSnackbar("Added to Record Views", 3000);
  _recordViews.push(key);
  _record_view_page_list.push(1);
  populateRecordViews();
  setKeyboardShortcutBar();
}

function removeRecordView(pos) {
  _recordViews.splice(pos, 1);
  _record_view_page_list.splice(pos, 1);
  populateRecordViews();
  if(_recordViews.length > 0)
  {
    if(pos == _recordViews.length)
      selectRecordView(pos - 1, true);
    else
      selectRecordView(pos, true);
  }
  setKeyboardShortcutBar();
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

function setRecordViewHighlightType(type) {
  _recordViewHightlightType = type;
  populateRecordViews();
  if (type == 0)
    document.getElementById("radio_record_views_differences").checked = true;
  else if(type == 1)
    document.getElementById("radio_record_views_similarities").checked = true;
  else if(type == 2)
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
  if(selldiv != null)
    document.getElementById("sell_div_" + i1 + "_" + j1).style.display = "none";
  hideRecordViewEditAndSellIcons();
  var ele = document.getElementById("record_view_partnum_input_" + i1 + "_" + j1);
  if(ele != null)
  {
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
  if (rownum != null) {
    edit_content(rownum, _EXTRA_DB_ACTUAL_INDEXES[j1], value);
  }
  var key = "parts_db/P&A_PRI/" + _recordViews[i1];
  var row = _content[rownum];
  var partObj = new Object();
  for (var i = 0; i < _INDEXES.length; ++i)
    partObj[_INDEXES[i]] = row[i];
  for (var i = 0; i < _MEMO_INDEXES.length; ++i)
    partObj[_MEMO_INDEXES[i]] = row[i + _INDEXES.length];
  populateRecordViews();
  if(!_LOCAL_MODE)
    writeToDatabase(key, partObj, true, true, false, null);
}

function selectRecordView(num, scrollIntoView)
{
  if(scrollIntoView == null)
    scrollIntoView = false;
  if(scrollIntoView)
  {
    var ele = document.getElementById("record_view_" + num);
    if(ele != null)
      ele.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
  }
  if(_recordViews.length > num && _selected_record_view >= 0)
  {
    _selected_record_view = num;
    _last_selected_record_view = num;
    for(var i = 0; i < _recordViews.length; ++i)
    {
      document.getElementById("record_view_" + i).style.backgroundColor = "";
    }
    if(num >= 0)
      document.getElementById("record_view_" + num).style.backgroundColor = "lightblue";
  }
}

function jumpToChildPartFromRecordView(extradb, index)
{
  document.getElementById("part_child_dropdown_select").selectedIndex = extradb;
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  _selected_child_part_db = extradb;
  _selected_child_part_record = index;
  populateChildPartRecordManager();
  clearPartChildEditAutocomplete();
  setNewPartChildButton();
  if(_content_extra[extradb].length > _selected_child_part_record)
    document.getElementById("part_child_edit_input").value = _content_extra[extradb][_selected_child_part_record][0].PN;
}

function startSell(i1, j1)
{
  hideRecordViewEditAndSellIcons();
  document.getElementById("sell_form_" + i1 + "_" + j1).style.display = "";
  document.getElementById("sell_quantity_" + i1 + "_" + j1).focus();
}

function changeSellQuantity(i1, j1, amount)
{
  var currentval = Number(document.getElementById("sell_quantity_" + i1 + "_" + j1).value);
  document.getElementById("sell_quantity_" + i1 + "_" + j1).value = currentval + Number(amount);
}

var _invoice_objs = [];
function confirmSell(i1, j1, _content_partnum_for_extraDB, _parent_record_id)
{
  var extraDBIndex = getExtraDBLinkIndex(j1, _content_partnum_for_extraDB);
  var parentRecordIndex = getParentIndexFromID(_parent_record_id);
  var parentRecordData = _content[parentRecordIndex];
  if(extraDBIndex != null)
  {
    var partObj = _content_extra[j1][extraDBIndex][0];
    var currentAmount = Number(partObj.SHOP_QTY);
    var amountToSell = Number(document.getElementById("sell_quantity_" + i1 + "_" + j1).value);
    if(currentAmount > amountToSell)
      partObj.SHOP_QTY = currentAmount - amountToSell;
    else
      partObj.SHOP_QTY = 0;
    var partkey = _content_extra[j1][extraDBIndex][1];
    if(!_LOCAL_MODE)
    {
      writeToDatabase("parts_db/" + _EXTRA_DB[j1] + "/" + partkey, partObj, true, false, true, j1);
    }
    var invoice_obj = new Object();
    invoice_obj.amountToSell = amountToSell;
    invoice_obj.DESCRIP1 = parentRecordData[_DESCRIP1];
    invoice_obj.SELL = partObj.SELL;
    invoice_obj.extradb = j1;
    invoice_obj.partkey = partkey;
    invoice_obj.PN = partObj.PN;
    invoice_obj.equip_type = parentRecordData[_EQUIP_TYPE];
    invoice_obj.mfr = getExtraDBPartManufacturer(j1, extraDBIndex);
    invoice_obj.equip_design = parentRecordData[_EQUIP_DESIGN];
    invoice_obj.parent_record_id = _parent_record_id;
    _invoice_objs.push(invoice_obj);
    showSnackbar("Added to Invoice<br>Removed <u>" + amountToSell + "</u> " + partObj.PN + " from Inventory", 5000);
    updateReorder(parentRecordIndex);
  }
  populateRecordViews();
}

function hideRecordViewEditAndSellIcons()
{
  for (var i = 0; i < _recordViews.length; ++i)
  {
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
  if(response.items != null && response.items.length > 0)
  {
    _images_googlesearch_list = response.items;
    _images_googlesearch_currentindex = 0;
    var item = response.items[0];
    // in production code, item.htmlTitle should have the HTML entities escaped.
    var div = document.getElementById("googlesearch_image_div");
    div.style.display = "";
    // div.innerHTML = "<img id='button_googlesearch_image_exit' class='clickable' src='x.png' style='position: fixed; top: -80px; right: -20px;' onclick='hideGoogleSearchImage();'><img id='image_googlesearch_image' src='" + item.link + "' style='height: 100%;'>";
    document.getElementById("image_googlesearch_image").src = "";
    document.getElementById("image_googlesearch_image").src = item.link;
    setGoogleSearchImageCount();
  }
  else
    showSnackbar("No results found", 3000);
}

function showRecordViewImage(descrip1, partSearchTerm, sitesEnum)
{
  if(_google_cse_api_key_loaded)
  {
    var searchEngineID = "";
    switch(sitesEnum)
    {
      case 0:
        searchEngineID = "de8eb9876c78e78e6"; //Entire Web
        break;
      case 1:
        searchEngineID = "01922cf7659e937bd"; //Parts Sites
        break;
    }
    var cleanPartSearchTerm = getHTMLSafeText(partSearchTerm);
    var script = document.createElement('script');
    // script.onload = function () {

    // };

    var descrip1_split = standardizeString(descrip1.replace(/-/g, " ")).split(" ");

    descrip1 = "";
    if(descrip1_split.length > 0)
      descrip1 = descrip1_split[0];
    script.src = "https://www.googleapis.com/customsearch/v1?key=" + _google_cse_api_key + "&cx=" + searchEngineID + "&q=" + descrip1 + " " + cleanPartSearchTerm + "&callback=googlesearch_hndlr&searchType=image&num=10";

    document.getElementById("googlesearch_api_script_div").innerHTML = "";
    document.getElementById("googlesearch_api_script_div").appendChild(script);
  }
  else
  {
    showSnackbar("Google CSE Api Key not loaded yet!", 3000);
  }
}

function hideGoogleSearchImage()
{
  var div = document.getElementById("googlesearch_image_div");
  div.style.display = "none";
}

function changeGoogleSearchImage(direction)
{
  switch(direction)
  {
    case -1:
      if(_images_googlesearch_currentindex > 0 && _images_googlesearch_list.length > _images_googlesearch_currentindex - 1)
      {
        --_images_googlesearch_currentindex;
      }
      break;
    case 1:
      if(_images_googlesearch_list.length > _images_googlesearch_currentindex + 1)
      {
        ++_images_googlesearch_currentindex;
      }
      break;
  }
  if(_images_googlesearch_list.length > _images_googlesearch_currentindex)
  {
    document.getElementById("image_googlesearch_image").src = "";
    document.getElementById("image_googlesearch_image").src = _images_googlesearch_list[_images_googlesearch_currentindex].link;
    setGoogleSearchImageCount();
  }
}

function setGoogleSearchImageCount()
{
  document.getElementById("paragraph_googlesearch_image_count").innerHTML = (_images_googlesearch_currentindex + 1) + " / " + _images_googlesearch_list.length;
}

var _RECORDVIEW_FRACTIONS_TO_DECIMAL_TEXT = "1/16=.0625 1/8=.125 1/4=.25 3/8=.375 1/2=.5 5/8=.625 3/4=.75 7/8=.875";
var _RECORDVIEW_SPEC_BORDER_TOP =    "border-top:    3px black solid; border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_SPEC_BORDER_MIDDLE =                                 "border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_SPEC_BORDER_BOTTOM = "border-bottom: 3px black solid; border-left: 3px black solid; border-right: 3px black solid;";
var _RECORDVIEW_MAX_PAGES = 4;
function getRecordViewPage(rownum, page_num, i)
{
  var htmlToAdd = "";
  switch(page_num)
  {
    //-------------------------------------------------PAGE 1-------------------------------------------------------------
    case 1:
      htmlToAdd += "<table class='recordview'><tr>";
      htmlToAdd += "<th>Page 1</th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>";
      htmlToAdd += "<th colspan='4' style='text-align: center;'>VENDOR PICK/PACK/INV SLIP</th>";
      htmlToAdd += "<th></th><th></th><th></th><th></th><th></th><th></th>";
      
      htmlToAdd += "</tr><tr>";
      for(var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_0.length; ++j)
      {
        if(j == 0)
          htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1_0[j] + ";'><p>" + RECORD_VIEW_HEADERS_PAGE1_0[j] + "</p></th>";
      }
      htmlToAdd += "<th>Reliable Parts/Encompass/Marcone</th><th>Image</th>";
      for(var j = 0; j < RECORD_VIEW_HEADERS_PAGE1_1.length; ++j)
      {
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE1_1[j] + ";'><p>" + RECORD_VIEW_HEADERS_PAGE1_1[j] + "</p></th>";
      }
      htmlToAdd += "</tr>";
      var parent_record_id = _content[rownum][INDEXES_CONCAT.length];
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
        {
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          if(j == _EXTRA_DB.length - 1) //Last row
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");' style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
          else
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");'>";
          var partSearchTerm = "";
          for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_0.length; ++k)
          {
            htmlToAdd += "<td>";
            if(k == 0)
            {
              htmlToAdd += "<div style='width: 30px; display: inline-block;'>" + _EXTRA_DB[j] + "</div>";
              if(extraDBIndex != null)
                htmlToAdd += "<div style='display: inline; font-size: 20px;' id='sell_div_" + i + "_" + j + "'><br><button style='background-color: #70A2FF; color: black;' id='sell_button_" + i + "_" + j + "' onclick='startSell(" + i + "," + j + ");'><span style='color: white;'>S</span>ell</button>"
                + "<div id='sell_form_" + i + "_" + j + "' style='display: none;'>"
                + "<p>Quantity</p>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ",  1);'>+</button><br>"
                + "<input onfocus='deselectTable();' style='width: 100px; height: 50px; font-size: 30px; text-align: center;' type='number' value='1' id='sell_quantity_" + i + "_" + j + "'><br>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ", -1);'>-</button><br><br>"
                + "<button id='button_record_view_sell_confirm_" + i + "_" + j + "' style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='confirmSell(" + i + "," + j + ",\"" + _content_partnum_for_extraDB + "\",\"" + parent_record_id + "\");'>Confirm <span style='color: white;'>S</span>ell</button><br><br>"
                + "<button id='button_record_view_sell_cancel_" + i + "_" + j + "'  style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button></div></div>";
              htmlToAdd += "</td><td>";
            }
            else if(k == 1) //PART#
            {
              htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' src='pencil.png' width=25px height=25px onclick='startEditRecordPartReference(" + i + "," + j + ");' style='position: relative; bottom: -6px;'>&nbsp;&nbsp;";
              partSearchTerm = _content_partnum_for_extraDB;
              var pText = "";
              var clean_content_partnum_for_extraDB = removeExtraSpaces(_content_partnum_for_extraDB);
              if(extraDBIndex == null && clean_content_partnum_for_extraDB != "")
                pText = _content_partnum_for_extraDB + "<span style='color: red;'>&nbsp;&nbsp;&nbsp;Not Found in Child Database!</span>";
              else if(clean_content_partnum_for_extraDB == "")
              {
                pText = "";
              }
              else
                pText = "<span id='span_recordviews_jump_to_child_part_" + i + "_" + j + "' class='clickable' style='color: blue;' onclick='jumpToChildPartFromRecordView(" + j + "," + extraDBIndex + ");'><u>" + _content_partnum_for_extraDB + "</u></span>";
              htmlToAdd += "<p id='record_view_partnum_text_" + i + "_" + j + "' style='display: inline;'>" + pText + "</p><input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' value='" + getHTMLSafeText(_content_partnum_for_extraDB) + "' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>"
              + "<button id='record_view_partnum_save_button_"   + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black; margin-bottom: 2px;' onclick='saveEditRecordPartReference(" + i + "," + j + ");'><span style='color: white;'>S</span>ave</button>"
              + "<button id='record_view_partnum_cancel_button_" + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if(extraDBIndex != null){
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0[k][j]];
              if(content1 != null)
              {
                if(k == 1) //PART#
                {
                  //Filled in with link
                }
                else if(k == 9 || k == 10) //"CGS",   "RETAIL" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_0[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</span>";
                }
                else if(k == 11) //"COMMENTS"
                {
                  var htmlCheck = "<input type='checkbox' disabled>";
                  if(content1.replace(/ /g, "").length > 0)
                  {
                    htmlCheck = "<div class='tooltip'><span class='tooltiptext'>" + content1 + "</span><input type='checkbox' checked disabled></div>";
                  }
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_0[k] + "_" + i + "_" + j + "'>" + htmlCheck + "</span>";
                }
                else
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_0[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if(k != 1) //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_0[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if(k == 1)
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }
          htmlToAdd += "<td>";
          var clean_partSearchTerm = removeExtraSpaces(partSearchTerm);
          if(clean_partSearchTerm != "")
          {
            htmlToAdd += "<a href='https://www.reliableparts.com/search?q=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'><img src='search_r.png' width=40px title='Reliable Parts'></a>";
            htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'><img src='search_e.png' width=40px title='Encompass'></a>";
            htmlToAdd += "<a href='https://beta.marcone.com/Home/SearchPartModelList?searchString=" + getStandardPNWebSearchString(partSearchTerm) + "&Type=Part' target='_blank'><img src='search_m.png' width=40px title='Marcone'></a>";
          }
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          {
            var descrip1 = _content[rownum][_DESCRIP1].replace(/"/g, "");
            descrip1 = descrip1.replace(/'/g, "");
            htmlToAdd += "<button id='button_recordview_image_everywhere_"   + i + "_" + j + "' style='background-color: #70A2FF; color: black;'                  onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 0);'><div class='tooltip'><span class='tooltiptext'>Search entire<br>internet<br>for images</span>E<span style='color: white;'>v</span>erywhere</button>";
            htmlToAdd += "<button id='button_recordview_image_distributors_" + i + "_" + j + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 1);'><div class='tooltip'><span class='tooltiptext'>Search Appliance Parts Pros,<br>Repair Clinic,<br>Encompass,<br>Marcone,<br>Reliable Parts,<br>and WL MAY<br>websites for images</span><span style='color: white;'>D</span>istributors</button>";
          }
          htmlToAdd += "</td>";

          for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE1_1.length; ++k)
          {
            htmlToAdd += "<td>";
            if(extraDBIndex != null)
            {
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_1[k][j]];
              if(content1 != null)
              {
                if(k == 0) //"SELL" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</span>";
                }
                else
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                //Add input for editing values
                htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1_1[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
              }
            }
            htmlToAdd += "</td>";
          }

          htmlToAdd += "</tr>";
        }
      }
    
      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 80, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE],     (i + "_ADVICE"),     80, "");
      var MODEL_CONTENT =  getExpandableHTML(_content[rownum][_MODEL],      (i + "_MODEL"),      80, "");
      var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>" ;
      var INPUT_LOCATION =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>" ;
      var INPUT_MODIFIED =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>" ;
      var INPUT_KEEP =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>" ;
      var INPUT_GET =        "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>" ;
      var INPUT_LKUPPN =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>" ;
      var INPUT_ADVICE =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>" ;
      var INPUT_REORD_QTY =  "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>" ;
      var INPUT_SOURCE =     "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>" ;
      var INPUT_MODEL =      "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
      var INPUT_FROM =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>" ;
    
      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>" 
      + "<td colspan=2><b><span id='record_view_data_read_PART_NUMBR_" + i + "'>" + _content[rownum][_PART_NUMBR] + "</span>" + INPUT_PART_NUMBR + "</b></td>"
      + "<td><b><span id='record_view_data_read_LOCATION_" + i + "'>" + _content[rownum][_LOCATION] + "</span>" + INPUT_LOCATION + "</b></td>"
      + "<td colspan=4><b><span id='record_view_data_read_MODIFIED_" + i + "'>" + _content[rownum][_MODIFIED] + "</span>" + INPUT_MODIFIED + "</b></td>"
      + "<td>KEEP  <b><span id='record_view_data_read_KEEP_" + i + "'>" + _content[rownum][_KEEP] + "</span>" + INPUT_KEEP +      "</b></td>"
      + "<td>BULK <b><span id='record_view_data_read_GET_" + i + "'>" + _content[rownum][_GET] + "</span>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td>                                                 </tr>"
      + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
      + "<td colspan=2><span id='record_view_data_read_LKUPPN_" + i + "'>" + LKUPPN_CONTENT + "</span>" + INPUT_LKUPPN + "                      </td>"
      + "<td style='text-align: right;'>         ADVICE</td><td colspan=4><span id='record_view_data_read_ADVICE_" + i + "'>" + ADVICE_CONTENT + "</span>" + INPUT_ADVICE + "                    </td>"
      + "<td>REORD <b><span id='record_view_data_read_REORD_QTY_" + i + "'>" + _content[rownum][_REORD_QTY] + "</span>" + INPUT_REORD_QTY + "</b><button onclick='updateReordFromRecordView(\"" + parent_record_id + "\");'>Update</button></td><td colspan=2 style='text-align: right;'>                                          Srce</td>"
      + "<td><b><span id='record_view_data_read_SOURCE_" + i + "'>" + _content[rownum][_SOURCE] + "</span>" + INPUT_SOURCE + "</b></td></tr>"
      + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
      + "<td colspan=4><span id='record_view_data_read_MODEL_" + i + "'>" + MODEL_CONTENT + "</span>" + INPUT_MODEL + "</td>"
      + "<td colspan=4>PREF  <b><span id='record_view_data_read_FROM_" + i + "'>" + _content[rownum][_FROM] + "</span>" + INPUT_FROM + "</b></td>                                                                                                                                             </tr>"
      + "</table><br><br>";
    break;
    //-------------------------------------------------PAGE 2-------------------------------------------------------------
    case 2:
      htmlToAdd += "<table class='recordview'><tr>";
      htmlToAdd += "<th>Page 2</th><th></th><th></th><th></th>";
      htmlToAdd += "<th colspan='4' style='text-align: center;'>MFR PRICEBOOK</th>";
      htmlToAdd += "<th></th><th></th><th></th><th></th><th></th><th></th><th></th>";
      
      htmlToAdd += "</tr><tr>";
      for(var j = 0; j < RECORD_VIEW_HEADERS_PAGE2_0.length; ++j)
      {
        if(j == 0)
          htmlToAdd += "<th style='width: " + RECORD_VIEW_DB_HEADER_WIDTH + ";'></th>";
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE2_0[j] + ";'><p>" + RECORD_VIEW_HEADERS_PAGE2_0[j] + "</p></th>";
      }
      htmlToAdd += "<th>Reliable Parts</th><th>Encompass</th><th>Marcone</th><th>Image</th>";
      for(var j = 0; j < RECORD_VIEW_HEADERS_PAGE2_1.length; ++j)
      {
        htmlToAdd += "<th style='width: " + RECORD_VIEW_HEADERS_WIDTHS_PAGE2_1[j] + ";'><p>" + RECORD_VIEW_HEADERS_PAGE2_1[j] + "</p></th>";
      }
      htmlToAdd += "</tr>";
      var parent_record_id = _content[rownum][INDEXES_CONCAT.length];
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
        {
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          if(j == _EXTRA_DB.length - 1) //Last row
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");' style='border-top: solid; border-bottom: solid; border-width: 4px; border-color: black;'>";
          else
            htmlToAdd += "<tr id='record_view_parts_row_" + i + "_" + j + "' onclick='onRecordViewPartsRowClick(" + i + "," + j + ");'>";
          var partSearchTerm = "";
          for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE2_0.length; ++k)
          { 
            htmlToAdd += "<td>";
            if(k == 0)
            {
              htmlToAdd += "<div style='width: 30px; display: inline-block;'>" + _EXTRA_DB[j] + "</div>";
              if(extraDBIndex != null)
                htmlToAdd += "<div style='display: inline; font-size: 20px;' id='sell_div_" + i + "_" + j + "'><br><button style='background-color: #70A2FF; color: black;' id='sell_button_" + i + "_" + j + "' onclick='startSell(" + i + "," + j + ");'><span style='color: white;'>S</span>ell</button>"
                + "<div id='sell_form_" + i + "_" + j + "' style='display: none;'>"
                + "<p>Quantity</p>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ",  1);'>+</button><br>"
                + "<input onfocus='deselectTable();' style='width: 100px; height: 50px; font-size: 30px; text-align: center;' type='number' value='1' id='sell_quantity_" + i + "_" + j + "'><br>"
                + "<button style='width: 100px;' onclick='changeSellQuantity(" + i + "," + j + ", -1);'>-</button><br><br>"
                + "<button id='button_record_view_sell_confirm_" + i + "_" + j + "' style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='confirmSell(" + i + "," + j + ",\"" + _content_partnum_for_extraDB + "\",\"" + parent_record_id + "\");'>Confirm <span style='color: white;'>S</span>ell</button><br><br>"
                + "<button id='button_record_view_sell_cancel_" + i + "_" + j + "'  style='width: 150px; height: 30px; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button></div></div>";
              htmlToAdd += "</td><td>";
            }
            else if(k == 1) //PART#
            {
              htmlToAdd += "<img class='clickable' id='record_view_partnum_edit_icon_" + i + "_" + j + "' src='pencil.png' width=25px height=25px onclick='startEditRecordPartReference(" + i + "," + j + ");' style='position: relative; bottom: -6px;'>&nbsp;&nbsp;";
              partSearchTerm = _content_partnum_for_extraDB;
              var pText = "";
              var clean_content_partnum_for_extraDB = removeExtraSpaces(_content_partnum_for_extraDB);
              if(extraDBIndex == null && clean_content_partnum_for_extraDB != "")
                pText = _content_partnum_for_extraDB + "<span style='color: red;'>&nbsp;&nbsp;&nbsp;Not Found in Child Database!</span>";
              else if(clean_content_partnum_for_extraDB == "")
              {
                pText = "";
              }
              else
                pText = "<span id='span_recordviews_jump_to_child_part_" + i + "_" + j + "' class='clickable' style='color: blue;' onclick='jumpToChildPartFromRecordView(" + j + "," + extraDBIndex + ");'><u>" + _content_partnum_for_extraDB + "</u></span>";
              htmlToAdd += "<p id='record_view_partnum_text_" + i + "_" + j + "' style='display: inline;'>" + pText + "</p><input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' value='" + getHTMLSafeText(_content_partnum_for_extraDB) + "' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>"
              + "<button id='record_view_partnum_save_button_"   + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black; margin-bottom: 2px;' onclick='saveEditRecordPartReference(" + i + "," + j + ");'><span style='color: white;'>S</span>ave</button>"
              + "<button id='record_view_partnum_cancel_button_" + i + "_" + j + "' style='width: 70px; font-size: 20px; display: none; background-color: #70A2FF; color: black;' onclick='populateRecordViews();'><span style='color: white;'>C</span>ancel</button>" + "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            if(extraDBIndex != null){
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_0[k][j]];
              if(content1 != null){
                if(k == 1) //PART#
                {
                  //Filled in with link
                }
                else if(k == 5 || k == 6 || k == 7) //"CGS",   "SUGG",     "FIXED" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_0[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</span>";
                }
                else if(k == 8) //"COMMENTS"
                {
                  var htmlCheck = "<input type='checkbox' disabled>";
                  if(content1.replace(/ /g, "").length > 0)
                  {
                    htmlCheck = "<div class='tooltip'><span class='tooltiptext'>" + content1 + "</span><input type='checkbox' checked disabled></div>";
                  }
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_0[k] + "_" + i + "_" + j + "'>" + htmlCheck + "</span>";
                }
                else
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_0[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if(k != 1) //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE2_0[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if(k == 1) //PART#
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }
          
          htmlToAdd += "<td>";
          var clean_partSearchTerm = removeExtraSpaces(partSearchTerm);
          if(clean_partSearchTerm != "")
            htmlToAdd += "<a href='https://www.reliableparts.com/search?q=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
            htmlToAdd += "<a href='https://encompass.com/search?searchTerm=" + getStandardPNWebSearchString(partSearchTerm) + "' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          htmlToAdd += "<a href='https://beta.marcone.com/Home/SearchPartModelList?searchString=" + getStandardPNWebSearchString(partSearchTerm) + "&Type=Part' target='_blank'>Search</a>";
          htmlToAdd += "</td>";
          htmlToAdd += "<td>";
          if(clean_partSearchTerm != "")
          {
            var descrip1 = _content[rownum][_DESCRIP1].replace(/"/g, "");
            descrip1 = descrip1.replace(/'/g, "");
            htmlToAdd += "<button id='button_recordview_image_everywhere_"   + i + "_" + j + "' style='background-color: #70A2FF; color: black;'                  onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 0);'><div class='tooltip'><span class='tooltiptext'>Search entire<br>internet<br>for images</span>E<span style='color: white;'>v</span>erywhere</button>";
            htmlToAdd += "<button id='button_recordview_image_distributors_" + i + "_" + j + "' style='background-color: #70A2FF; color: black; margin-top: 2px;' onclick='showRecordViewImage(\"" + descrip1 + "\",\"" + partSearchTerm + "\", 1);'><div class='tooltip'><span class='tooltiptext'>Search Appliance Parts Pros,<br>Repair Clinic,<br>Encompass,<br>Marcone,<br>Reliable Parts,<br>and WL MAY<br>websites for images</span><span style='color: white;'>D</span>istributors</button>";
          }
          htmlToAdd += "</td>";

          for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE2_1.length; ++k)
          { 
            htmlToAdd += "<td>";
            if(extraDBIndex != null){
              var content1 = _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_1[k][j]];
              if(content1 != null){
                if(k == 0) //"SELL" in usd format
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "'>" + Number(content1).toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2}) + "</span>";
                }
                else
                {
                  htmlToAdd += "<span id='record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "'>" + content1 + "</span>";
                }
                if(k != 1) //Add input for editing values
                {
                  htmlToAdd += "<input type='text' onfocus='deselectTable();' id='record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE2_1[k] + "_" + i + "_" + j + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(content1) + "'>";
                }
              }
            }
            else //No matching link found in Extra DB, usually Part# is blank
            {
              if(k == 1) //PART#
              {
                htmlToAdd += "<input type='text' style='display: none;' id='record_view_partnum_input_" + i + "_" + j +"' onfocus='onPartNumFocus(" + i + "," + j + ");' onkeyup='partnum_input_keyup_event(event);' onkeydown='partnum_input_keydown_event(event);'><div style='position: absolute;' id='partnum_autocomplete_" + i + "_" + j + "'></div>";
              }
            }
            htmlToAdd += "</td>";
          }

          htmlToAdd += "</tr>";
        }
      }
    
      var LKUPPN_CONTENT = getExpandableHTML(_content[rownum][_LOOK_UP_PN], (i + "_LOOK_UP_PN"), 80, "");
      var ADVICE_CONTENT = getExpandableHTML(_content[rownum][_ADVICE],     (i + "_ADVICE"),     80, "");
      var MODEL_CONTENT =  getExpandableHTML(_content[rownum][_MODEL],      (i + "_MODEL"),      80, "");
      var INPUT_PART_NUMBR = "<input type='text' onfocus='deselectTable();' id='record_view_data_input_PART_NUMBR_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_PART_NUMBR]) + "'>" ;
      var INPUT_LOCATION =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_LOCATION_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_LOCATION]) + "'>" ;
      var INPUT_MODIFIED =   "<input type='text' onfocus='deselectTable();' id='record_view_data_input_MODIFIED_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_MODIFIED]) + "'>" ;
      var INPUT_KEEP =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_KEEP_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_KEEP]) + "'>" ;
      var INPUT_GET =        "<input type='text' onfocus='deselectTable();' id='record_view_data_input_GET_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_GET]) + "'>" ;
      var INPUT_LKUPPN =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_LKUPPN_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_LOOK_UP_PN], "\n")) + "</textarea>" ;
      var INPUT_ADVICE =     "<textarea          onfocus='deselectTable();' id='record_view_data_input_ADVICE_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_ADVICE], "\n")) + "</textarea>" ;
      var INPUT_REORD_QTY =  "<input type='text' onfocus='deselectTable();' id='record_view_data_input_REORD_QTY_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_REORD_QTY]) + "'>" ;
      var INPUT_SOURCE =     "<input type='text' onfocus='deselectTable();' id='record_view_data_input_SOURCE_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_SOURCE]) + "'>" ;
      var INPUT_MODEL =      "<textarea          onfocus='deselectTable();' id='record_view_data_input_MODEL_" + i + "' style='width: 90%; display: none;'>" + getHTMLSafeText(stringifyArrayEndChar(_content[rownum][_MODEL], "\n")) + "</textarea>";
      var INPUT_FROM =       "<input type='text' onfocus='deselectTable();' id='record_view_data_input_FROM_" + i + "' style='width: 90%; display: none;' value='" + getHTMLSafeText(_content[rownum][_FROM]) + "'>" ;
    
      htmlToAdd += "<tr><td colspan=2 style='text-align: right;'>LAST</td>" 
      + "<td colspan=2><b><span id='record_view_data_read_PART_NUMBR_" + i + "'>" + _content[rownum][_PART_NUMBR] + "</span>" + INPUT_PART_NUMBR + "</b></td>"
      + "<td><b><span id='record_view_data_read_LOCATION_" + i + "'>" + _content[rownum][_LOCATION] + "</span>" + INPUT_LOCATION + "</b></td>"
      + "<td colspan=4><b><span id='record_view_data_read_MODIFIED_" + i + "'>" + _content[rownum][_MODIFIED] + "</span>" + INPUT_MODIFIED + "</b></td>"
      + "<td>KEEP  <b><span id='record_view_data_read_KEEP_" + i + "'>" + _content[rownum][_KEEP] + "</span>" + INPUT_KEEP +      "</b></td>"
      + "<td>BULK <b><span id='record_view_data_read_GET_" + i + "'>" + _content[rownum][_GET] + "</span>" + INPUT_GET + "</b></td><td colspan=2 style='text-align: right;'>Aside</td>                                                 </tr>"
      + "<tr><td colspan=2 style='text-align: right;'>LKUPPN</td>"
      + "<td colspan=2><span id='record_view_data_read_LKUPPN_" + i + "'>" + LKUPPN_CONTENT + "</span>" + INPUT_LKUPPN + "                      </td>"
      + "<td style='text-align: right;'>         ADVICE</td><td colspan=4><span id='record_view_data_read_ADVICE_" + i + "'>" + ADVICE_CONTENT + "</span>" + INPUT_ADVICE + "                    </td>"
      + "<td>REORD <b><span id='record_view_data_read_REORD_QTY_" + i + "'>" + _content[rownum][_REORD_QTY] + "</span>" + INPUT_REORD_QTY + "</b><button onclick='updateReordFromRecordView(\"" + parent_record_id + "\");'>Update</button></td><td colspan=2 style='text-align: right;'>                                          Srce</td>"
      + "<td><b><span id='record_view_data_read_SOURCE_" + i + "'>" + _content[rownum][_SOURCE] + "</span>" + INPUT_SOURCE + "</b></td></tr>"
      + "<tr><td colspan=4></td><td style='text-align: right;'>MODEL</td>"
      + "<td colspan=4><span id='record_view_data_read_MODEL_" + i + "'>" + MODEL_CONTENT + "</span>" + INPUT_MODEL + "</td>"
      + "<td colspan=4>PREF  <b><span id='record_view_data_read_FROM_" + i + "'>" + _content[rownum][_FROM] + "</span>" + INPUT_FROM + "</b></td>                                                                                                                                             </tr>"
      + "</table><br><br>";
      break;
       //-------------------------------------------------PAGE 3-------------------------------------------------------------
    case 3:
      htmlToAdd += "<table class='recordview'><tr><th colspan='3'>Page 3</th></tr>"
                 + "<tr><td colspan='3'>" + _content[rownum][_SPECMETHOD] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD +  1] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD +  4] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD +  7] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD +  2] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD +  5] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD +  8] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD +  3] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD +  6] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD +  9] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 10] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 13] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 16] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 11] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 14] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 17] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 12] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 15] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 18] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 19] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 22] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 25] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 20] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 23] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 26] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 21] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 24] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 27] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 28] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 31] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_TOP +    "'>" + _content[rownum][_SPECMETHOD + 34] + "</td></tr>"
                 + "<tr style='background-color: #dddddd;'><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 29] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 32] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_MIDDLE + "'>" + _content[rownum][_SPECMETHOD + 35] + "</td></tr>"
                 + "<tr style='background-color: white;'  ><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 30] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 33] + "</td><td style='" + _RECORDVIEW_SPEC_BORDER_BOTTOM + "'>" + _content[rownum][_SPECMETHOD + 36] + "</td></tr>"
                 + "<tr><td colspan='3'><br>" + _RECORDVIEW_FRACTIONS_TO_DECIMAL_TEXT + "</td></tr>"
                 + "</table><br><br>";
      break;
      //-------------------------------------------------PAGE 4-------------------------------------------------------------
    case 4:
      htmlToAdd += "<table class='recordview'><tr><th>Page 4</th></tr>";
      for(var j = 0; j < _EXTRA_DB.length; ++j)
      {
        if(j != 2) //Skip DNI ExtraDB
        {
          htmlToAdd += "<tr><td><b>" + _EXTRA_DB[j] + ":</b> ";
          var _content_partnum_for_extraDB = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
          var extraDBIndex = getExtraDBLinkIndex(j, _content_partnum_for_extraDB);
          if(extraDBIndex != null)
          {
            htmlToAdd += _content_extra[j][extraDBIndex][0].COMMENTS;
          }
          htmlToAdd += "</td></tr>";
        }
      }
      htmlToAdd += "<tr><td><b>NEWER:</b> "                                    + _content[rownum][_NEWER]       + "</td></tr>"
                 + "<tr><td><b>NEW:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"   + _content[rownum][_NEW]         + "</td></tr>"
                 + "<tr><td><b>QUESTIONS:</b> "                                + _content[rownum][_QUESTIONS]   + "</td></tr>"
                 + "</table><br><br>";
      break;
  }
  return htmlToAdd;
}

function setRecordViewPage(pagenum, i)
{
  var rownum = getContentIndexFrom_DB_ID(_recordViews[i]);
  if(rownum != null)
  {
    var htmlToAdd = getRecordViewPage(rownum, pagenum, i);
    _record_view_page_list[i] = pagenum;
    document.getElementById("record_view_details_" + i + "_div").innerHTML = htmlToAdd;
    var ele = document.getElementById("record_view_data_edit_icon_" + i);
    if(ele != null && pagenum != 1)
      ele.style.display = "none";
    else
      ele.style.display = "";
    setKeyboardShortcutBar();
  }
}

function onRecordViewPartsRowClick(recordview, row)
{
  for(var i = 0; i < _recordViews.length; ++i)
  {
    for(var j = 0; j < _EXTRA_DB.length; ++j)
    {
      var ele = document.getElementById("record_view_parts_row_" + i + "_" + j);
      if(ele != null)
        ele.style.backgroundColor = "";
    }
  }

  var ele = document.getElementById("record_view_parts_row_" + recordview + "_" + row);
  if(ele != null)
    ele.style.backgroundColor = "lightblue";
}

function changeRecordViewDown()
{
  if(!partnum_input_was_pressed_first)
  {
    if(_recordViews.length > _selected_record_view && _selected_record_view >= 0)
    {
      var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
      if(rownum != null)
      {
        // if(rownum < _content.length - 1)
        // {
        var nextIndex = getNextContentIndexInSortOrder(rownum, !_contentSortedReverse);
        if(nextIndex != null)
        {
          // var newID = _content[rownum + 1][_content[rownum + 1].length - 1];
          var newID = _content[nextIndex][_content[nextIndex].length - 1];
          if(_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && !_recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
            _recordViews_Key_To_Details_Open.set(newID, false);
          else
            _recordViews_Key_To_Details_Open.set(newID, true);
          _recordViews[_selected_record_view] = newID
          populateRecordViews();
        }
        // }
      }
    }
  }
}

function changeRecordViewUp()
{
  if(!partnum_input_was_pressed_first)
  {
    if(_recordViews.length > _selected_record_view && _selected_record_view >= 0)
    {
      var rownum = getContentIndexFrom_DB_ID(_recordViews[_selected_record_view]);
      if(rownum != null)
      {
        // if(rownum > 0)
        // {
          var nextIndex = getNextContentIndexInSortOrder(rownum, _contentSortedReverse);
          if(nextIndex != null)
          {
            // var newID = _content[rownum - 1][_content[rownum - 1].length - 1];
            var newID = _content[nextIndex][_content[nextIndex].length - 1];
            if(_recordViews_Key_To_Details_Open.has(_recordViews[_selected_record_view]) && !_recordViews_Key_To_Details_Open.get(_recordViews[_selected_record_view]))
              _recordViews_Key_To_Details_Open.set(newID, false);
            else
              _recordViews_Key_To_Details_Open.set(newID, true);
            _recordViews[_selected_record_view] = newID
            populateRecordViews();
          }
        // }
      }
    }
  }
}