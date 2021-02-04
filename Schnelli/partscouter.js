//Debug Time Profiling
// var time1 = (new Date()).getTime();
// var time2 = (new Date()).getTime();
// console.log(time2 - time1);


var _LOCAL_MODE = false;
if(_LOCAL_MODE)
{
  document.getElementById("local_mode_indicator").innerHTML = "Local Mode ON";
}

var PROFILING_STARTTIME = 0;
var PROFILING_ENDTIME = 0;

var _overlay_window_open = false;
var _INDEX_ORDER = [20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,   76, 77, 78, 79,   39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 0];
var _INDEXES = ["RECORD_NUMBER","DESCRIP1","DESCRIP2","COMMENTS","EQUIP_TYPE","EQUIP_DSGN","APPL_BRAND","APPL_MFR","PART_TYPE","B_PN",   "CHLX_PN","F_PN",   "GEM_PN", "RS_PN",  "MM_PN",  "JS_PN",  "K_PN",   "L_PN",   "M_PN",   "N_PN",   "OEM_PN", "PART_NUMBR", "Q_PN",   "SOURCE", "UNIT",   "KEEP",   "REORD_QTY","GET",    "PICKED", "TAG",    "FROM",   "CGS",    "DATE",   "FRT_IN", "QUESTIONS","MODIFIED","NEW",    "NEWER",  "LOCATION","SPECMETHOD","SPEC01NAME","SPEC01HINT","SPEC01DATA","SPEC02NAME","SPEC02HINT","SPEC02DATA","SPEC03NAME","SPEC03HINT","SPEC03DATA","SPEC04NAME","SPEC04HINT","SPEC04DATA","SPEC05NAME","SPEC05HINT","SPEC05DATA","SPEC06NAME","SPEC06HINT","SPEC06DATA","SPEC07NAME","SPEC07HINT","SPEC07DATA","SPEC08NAME","SPEC08HINT","SPEC08DATA","SPEC09NAME","SPEC09HINT","SPEC09DATA","SPEC10NAME","SPEC10HINT","SPEC10DATA","SPEC11NAME","SPEC11HINT","SPEC11DATA","SPEC12NAME","SPEC12HINT","SPEC12DATA"];
var _INDEX_WIDTHS = ["initial",  "200px",   "200px",   "400px",   "initial",   "initial",   "initial",   "initial", "initial",  "initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial","initial",    "initial","initial","initial","initial","initial",  "initial","initial","initial","initial","initial","initial","initial","initial",  "initial", "initial","initial","initial", "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial",   "initial"   ];
var _MEMO_INDEXES = ["LOOK_UP_PN", "ADVICE", "ATTN", "MODEL"]; //76, 77, 78, 79 LOCATION = 38
var _MEMO_INDEX_WIDTHS = ["400px",  "400px",  "400px","400px"];
var _WORDS_TO_IGNORE = ["the","at","there","some","my","of","be","use","her","than","and","this","an","would","a","have","each","make","to","from","which","like","been","in","or","she","him","call","is","one","do","into","who","you","had","how","time","that","by","their","has","its","it","word","if","look","now","he","but","will","two","find","was","not","up","more","for","what","down","on","all","about","go","day","are","were","out","see","did","as","we","get","with","when","then","no","come","his","your","them","way","made","they","can","these","could","may","i","said","so"];
var _EXTRA_DB_FIELDS = /*B_DNI*/ [["PN","AKA",       "PART_NUMBR","COMMON_PN","DESCRIP1","COMMENTS","PART_MFR","VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT","POST_APPND"]
                       /*CHLX*/ , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","PART_MFR","VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT"]
                       /*DNI*/  , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","APPL_MFR","VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","COMMON_PN","CGS","FROM","DATE","OEM_PN2","CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT","POST_APPND"]
                       /*F*/    , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","PART_MFR","VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT"]
                       /*GEM*/  , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","GEM_ID",  "VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT"]
                       /*H_RS*/ , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","RS_ID",   "VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT"]
                       /*I_MM*/ , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","MM_ID",   "VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT"]
                       /*JS*/   , ["PN","JS_LINE_PN","PART_NUMBR",            "DESCRIP1","COMMENTS","JS_LINE", "JS_ID","CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","OTHER",    "CGS","FROM","DATE","OEM_PN", "CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT"]
                       /*OEM*/  , ["PN","AKA",       "PART_NUMBR",            "DESCRIP1","COMMENTS","APPL_MFR","VEND", "CAT","PAGE","SPL","SPL_DATE","SPL_FROM","LOT_CT","LOT_PR","LOT_FROM","REG","REG_DATE","REG_FROM","SUGG","VEND_RET","SHOP_QTY","TRK1_QTY","TRK2_QTY","TRK3_QTY","USED_QTY","LOCATION","COMMON_PN","CGS","FROM","DATE","OEM_PN2","CALCULATED","FIXED","SELL","ZOOM","SOLD_YTD","SOLD_DATE","SOLD_AMT","POST_APPND"]];
var _AKA_GLOBAL = 1;
var _EXTRA_DB =                   ["B_DNI", "CHLX",    "DNI",  "F",    "GEM",    "H_RS",  "I_MM",  "JS",    "OEM"];
var _EXTRA_DB_ACTUAL_INDEXES =    ["B_PN",  "CHLX_PN", "Q_PN", "F_PN", "GEM_PN", "RS_PN", "MM_PN", "JS_PN", "OEM_PN"];
var _EXTRA_DB_COMMENTS_PREFIXES = ["B",     "C",       "D",    "F",    "G",      "H",     "I",     "J",     "O"];
var _CONTENT_EXTRA_DB_INDEXES =   [ 9,       10,        22,     11,     12,       13,      14,      15,      20];

var RECORD_VIEW_DB_HEADER_WIDTH = "150px";
var RECORD_VIEW_HEADERS_PAGE1_0 =                 ["MFR",                                                         "PART#", "S",          "LOC",        "T1",         "T2",         "U",           "VEND",   "DATE",   "CGS",   "RETAIL", "COMMENT"];
var RECORD_VIEW_HEADERS_WIDTHS_PAGE1_0 =          ["100px",                                                       "300px", "70px",       "100px",      "70px",       "70px",       "70px",        "100px",  "200px",  "100px", "100px",  "50px"   ];
var RECORD_VIEW_HEADERS_PAGE1_1 =                 ["SELL" ];
var RECORD_VIEW_HEADERS_WIDTHS_PAGE1_1 =          ["100px"];
var RECORD_VIEW_HEADERS_PAGE2_0 =                 ["MFR",                                                         "PART#", "AKA",        "MFR",        "DATE",       "CGS",        "SUGG",        "FIXED", "COMMENT"];
var RECORD_VIEW_HEADERS_WIDTHS_PAGE2_0 =          ["100px",                                                       "300px", "70px",       "100px",      "70px",       "70px",       "70px",        "100px", "100px"];
var RECORD_VIEW_HEADERS_PAGE2_1 =                 ["SELL"];
var RECORD_VIEW_HEADERS_WIDTHS_PAGE2_1 =          ["200px"];

var RECORD_VIEW_HEADERS_PAGE1_CONCAT = RECORD_VIEW_HEADERS_PAGE1_0.concat(RECORD_VIEW_HEADERS_PAGE1_1);
var RECORD_VIEW_HEADERS_PAGE2_CONCAT = RECORD_VIEW_HEADERS_PAGE2_0.concat(RECORD_VIEW_HEADERS_PAGE2_1);

// var RECORD_VIEW_HEADERS_ACTUAL_INDEXES = [["PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], ["PN"],  ["SHOP_QTY"], ["LOCATION"], ["TRK1_QTY"], ["TRK2_QTY"], ["USED_QTY"],  ["FROM"], ["DATE"], ["CGS"], ["VEND_RET"], ["SELL"]];
var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0 = [
  ["PART_MFR", "PART_MFR", "APPL_MFR", "PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], 
  ["PN","PN","PN","PN","PN","PN","PN","PN","PN"],  
  ["SHOP_QTY","SHOP_QTY","SHOP_QTY","SHOP_QTY","SHOP_QTY","SHOP_QTY","SHOP_QTY","SHOP_QTY","SHOP_QTY"],
  ["LOCATION","LOCATION","LOCATION","LOCATION","LOCATION","LOCATION","LOCATION","LOCATION","LOCATION"], 
  ["TRK1_QTY","TRK1_QTY","TRK1_QTY","TRK1_QTY","TRK1_QTY","TRK1_QTY","TRK1_QTY","TRK1_QTY","TRK1_QTY"], 
  ["TRK2_QTY","TRK2_QTY","TRK2_QTY","TRK2_QTY","TRK2_QTY","TRK2_QTY","TRK2_QTY","TRK2_QTY","TRK2_QTY"],
  ["USED_QTY","USED_QTY","USED_QTY","USED_QTY","USED_QTY","USED_QTY","USED_QTY","USED_QTY","USED_QTY"],  
  ["FROM","FROM","FROM","FROM","FROM","FROM","FROM","FROM","FROM"], 
  ["DATE","DATE","DATE","DATE","DATE","DATE","DATE","DATE","DATE"], 
  ["CGS","CGS","CGS","CGS","CGS","CGS","CGS","CGS","CGS"], 
  ["VEND_RET","VEND_RET","VEND_RET","VEND_RET","VEND_RET","VEND_RET","VEND_RET","VEND_RET","VEND_RET"], 
  ["COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS"]
];

var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_1 = [
  ["SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL"]
];

var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT = RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0.concat(RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_1);

var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_0 = [
  ["PART_MFR", "PART_MFR", "APPL_MFR", "PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], 
  ["PN","PN","PN","PN","PN","PN","PN","PN","PN"],  
  ["AKA","AKA","AKA","AKA","AKA","AKA","AKA","JS_LINE_PN","AKA"],
  ["REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM"], 
  ["REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE"], 
  ["REG","REG","REG","REG","REG","REG","REG","REG","REG"],
  ["SUGG","SUGG","SUGG","SUGG","SUGG","SUGG","SUGG","SUGG","SUGG"],  
  ["FIXED","FIXED","FIXED","FIXED","FIXED","FIXED","FIXED","FIXED","FIXED"], //?
  ["COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS"]
];
var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_1 = [
  ["SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL"]
];

var _RECORD_NUMBER = 0;
var _DESCRIP1 =      1;
var _DESCRIP2 =      2;
var _COMMENTS =      3;
var _EQUIP_TYPE =    4;
var _EQUIP_DESIGN =  5;
var _APPL_BRAND =    6;
var _OEM_PN =       20;
var _PART_NUMBR =   21;
var _SOURCE =       23;
var _KEEP =         25;
var _REORD_QTY =    26;
var _GET =          27;
var _FROM =         30;
var _QUESTIONS =    34;
var _MODIFIED =     35;
var _NEW =          36;
var _NEWER =        37;
var _LOCATION =     38;
var _SPECMETHOD =   39;
var _LOOK_UP_PN =   76;
var _ADVICE =       77;
var _ATTN =         78;
var _MODEL =        79;

var _ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var _content = null;
var _content_standard = null;
var _content_invoice_history = null;

var _content_extra = null;
// var _indexToContentID;
var _contentSortedIndexes = [0];
var _contentSortedReverse = false;
var _sortedIndexBGColor = "#70A2FF"; //Light blue
var _sortedIndexBGColorReverse = "#FF7070"; //Salmon
var _selectedRowColor = "#96BBFF"; //Light blue
var _selectedCellColor = "#70A2FF"; //Slightly Less Light blue
var _tempTopRowColor = "#A0FF77"; //Light green

var _sort_orders = null;
var _google_cse_api_key = "";
var _google_cse_api_key_loaded = false;

var _isTableSelected = false;
var _selectedTable = _TABLE_RECORD_BROWSER;
var _selectedRow = 0;
var _selectedCell = 0;
var _selectedCellLastID = null;

var _searchResults = []; //[index, [cells with match], [actual string matches]]

//Only indexes of records being shown in the tables
var _currentSearchResultsStartIndex = 0;
var _currentRecordBrowserStartIndex = 0;
var _searchResults_ContentIndexes = [];
var _indexesSearchResults = [];
var _indexesSimilarStrings = [];
var _indexesRecordBrowser = [];

var _searchResultsMax = 6;
var _recordBrowserMax = 10;

var _largestRecordNumber = 0;
var _largestOEMNumber = 0;

var _minRepititions = 3;

var _TABLE_SEARCH_RESULTS = 0;
var _TABLE_SIMILAR_STRINGS = 1;
var _TABLE_RECORD_BROWSER = 2;

var _searchstring_any_history = [];
var _searchstring_specific_history = [];
var _searchstring_any_history_index = 0;
var _searchstring_specific_history_index = [];
var _selected_search_input = 0;

// var str1 = "USED WITH SPARK IGNITION; NAT/LP SELECT; KIT INCL SMALL PARTS; CNSDR C:5395S0005 KIT";
// var str2 = "USED WITH SPARK IGNITION; NAT/LP SELECT; KIT INCL SMALL PARTS; CNSDR C:5396S0012 KIT";
// var str1 = "USES TIMER MOTOR 414-064-20; INCL REQ SHORTER MOUNTING SCREWS 2X 3428970";
// var str2 = "USES TIMER MOTOR 414-386-20; INCL REQ SHORTER MOUNTING SCREWS 2X 3428970; USED ON 3 SPEED MODELS ";
// var str1 = "WITH SPECIFIC LEVER; USED AS S.C. DOOR LATCH SWITCH FOR SOLENOID; CNSDR SWAPPING LEVER TO ALTERNATE SPLIT SWITCH ";
// var str2 = "WITH SPECIFICALLY BENT LEVER; USED AS CARTRIDGE CONFIRMATION SWITCH FOR DOWNDRAFT FAN; CNSDR SWAPPING LEVER TO ALTERNATE SPLIT SWITCH ";
// getWordCompareIndexes(str1, str2, 1);

var checkboxHTML = "";
var checkboxHTML_More = "";
var INDEXES_CONCAT = _INDEXES.concat(_MEMO_INDEXES);
var INDEX_WIDTHS_CONCAT = _INDEX_WIDTHS.concat(_MEMO_INDEX_WIDTHS);

var _CHILD_PART_LINKS_CACHE = new Map();

function initialLoadingFinished() //Called after all parts are downloaded and processed
{
  if(!_LOCAL_MODE) //TODO Remove
    sortContentByIndex(_DESCRIP1);

  // var populateChildPartCacheWorker = new Worker('workers/WORKER_populate_child_part_cache.js');
  // populateChildPartCacheWorker.postMessage([_content, _content_extra, _EXTRA_DB, _extradb_link_index_cache, _CONTENT_EXTRA_DB_INDEXES, _EXTRA_DB_FIELDS, _AKA_GLOBAL]);
  // populateChildPartCacheWorker.onmessage = function (e) {
  //   if(e.data[0] == 1)
  //   { //Finished
  //     _extradb_link_index_cache = e.data[1];
  //     showSnackbar("Populating child part cache...100%", 1500);
  //   }
  //   else //Percent status update message
  //   {
  //     showSnackbar("Populating child part cache..." + Math.floor(e.data[1] * 100) + "%", 3000);
  //     // document.getElementById("message").innerHTML = "<br><br><br><p>Adding Child Part Links... " + Math.floor(e.data[1] * 100) + "%</p>";
  //   }
  // }//END onMessage from PartChildButton worker

  document.getElementById("content_div").style.display = "block";
  setTab(TAB_MAINMENU);
  setKeyboardShortcutBar();
}

$(function() {
  $('input[name=invoice_history_filter_time]').daterangepicker({
    // timePicker: true,
    // singleDatePicker: true,
    showDropdowns: true,
    startDate: new Date(0),
    endDate: new Date(),
    // startDate: moment().startOf('hour'),
    locale: {
      format: 'MM/DD/YYYY'
    }
  }, function(start, end, label) {
    _invoice_filter_date_start = start;
    _invoice_filter_date_end = end;
    populateInvoiceHistory();
    // console.log("Date Picker|" + start + "|" + end + "|"); //Start and end are milliseconds, start is time at start of day and end is end of day
    // var date1 = new Date("08 / 31 / 2020");
    // console.log("Date|" + date1.getTime());
  });
});

//Initial Generation--------------------------------------------------------------------------------
for(var i = 0; i < INDEXES_CONCAT.length; ++i)
{
  _searchstring_specific_history.push(new Array());
  _searchstring_specific_history_index.push(0);
}

var htmlToAdd = "";
var i3 = 0;
for(var i = 0; i < _EXTRA_DB.length; ++i)
{
  htmlToAdd += "<span style='position: absolute; left: " + (50 + (i % 5) * 250) + "px; font-size: 18px;'>" + _EXTRA_DB[i] + "</span>";
  if(((i + 1) % 5 == 0 && i != 0) || i == _EXTRA_DB.length - 1)
  {
    htmlToAdd += "<br>";
    for(var i2 = 0; i2 < 5 && i3 < _EXTRA_DB.length; ++i2)
    {
      htmlToAdd += "<div style='position: absolute; left: " + (50 + i2 * 250) + "px;'><input id='search_partnum_input_" + i3 + "' type='text' style='width: 230px;' onfocus='deselectTable();' onkeyup='search_partnum_input_keyup_event(event, " + i3 + ");' onkeydown='search_partnum_input_keydown_event(event);'>" +
      "<div id='search_partnum_autocomplete_" + i3 + "' style='position: absolute;'></div></div>";
      ++i3;
    }
    htmlToAdd += "<br><br>";
  }
}
document.getElementById("search_partnum_db_inputs_div").innerHTML = htmlToAdd;

for(var i = 0; i < INDEXES_CONCAT.length; ++i){
  var order_id = _INDEX_ORDER[i];
  if(i <= 9){
    checkboxHTML += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 20) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\" disabled><span class='checkmark' style='display: none;'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if((i + 1)% 5 == 0 && i != 0){
      checkboxHTML += "<br><br>";
      for(var j = 0; j < 5; ++j){
        var i2 = (i - 4) + j;
        var order_id2 = _INDEX_ORDER[i2];
        checkboxHTML += "<div style='position:absolute; left:" + ((i2 % 5) * 250 + 50) + "px;'><input id='search_input_" + order_id2 + "' type='text' style='width: 230px;' onfocus='deselectTable(" + order_id2 + ");' onfocusout='onSearchInputFocusOut();' onchange='onSearchInputChanged(" + order_id2 + ")'><div id='search_autocomplete_" + order_id2 + "'></div></div>";
      }
      if(i == 4)
        checkboxHTML += "<button id='search_specific_button' style='display: inline; width: 100px; position:absolute; left:" + ((i + 1) * 250 + 50) + "px;' onclick='search_query();'>Go</button>";
      checkboxHTML += "<br><br><br>";
    }
    if(i == 9){
      checkboxHTML += "<button onclick='show_more_column_checkboxes(true);' id=\"show_more_column_checkboxes\" style='position:absolute; left: 50px; width: 200px;'>More</button>";
    }
  }
  else{
    checkboxHTML_More += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 20) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\" disabled><span class='checkmark' style='display: none;'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if((i + 1)% 5 == 0 && i != 0){
      checkboxHTML_More += "<br><br>";
      for(var j = 0; j < 5; ++j){
        var i2 = (i - 4) + j;
        var order_id2 = _INDEX_ORDER[i2];
        checkboxHTML_More += "<div style='position:absolute; left:" + ((i2 % 5) * 250 + 50) + "px;'><input id='search_input_" + order_id2 + "' type='text' style='width: 230px;' onfocus='deselectTable(" + order_id2 + ");' onfocusout='onSearchInputFocusOut();' onchange='onSearchInputChanged(" + order_id2 + ")'><div id='search_autocomplete_" + order_id2 + "'></div></div>";
      }
      checkboxHTML_More += "<br><br><br>";
    }
    if(i == INDEXES_CONCAT.length - 1) {
      checkboxHTML_More += "<br><br><br><button onclick='show_more_column_checkboxes(false);' style='position:absolute; left: 50px; width: 200px;'>Less</button>";
    }
  }
}
document.getElementById("radio_columns_checkboxes").innerHTML = checkboxHTML;
document.getElementById("radio_columns_checkboxes_more").innerHTML = checkboxHTML_More;
setRadioColumn();
document.getElementById("repititions_min").value = _minRepititions;

// Extra:
// MFR -> PART_MFR, APPL_MFR
// PART# -> PN
// S -> SHOP_QTY
// LOC -> LOCATION
// T1 -> TRK1_QTY
// T2 -> TRK2_QTY
// U -> 
// VEND -> FROM
// DATE -> DATE
// CGS -> CGS
// RETAIL -> VEND_RET
// SELL -> SELL

//Highlighting differences
//For each record view
//   For each text field
//      For each word in the text field
//          Check if word is in standardized word array of original, if no, save 0, if yes, save 1, if word_to_ignore, save -1
//If highlight differences is checked, make reverse start and end index array, ignore start end indexes that are one char long
//Else highlight similarities

// var EXTRA_INDEXES = ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM",* "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]; //JS has no AKA, VEND   DNI and OEM has no OTHER, OEM_PN

var partChildDropDownHTML = "<span style='background-color: #70A2FF; color: black;'>Da<span style='color: white;'>t</span>abase&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><select id='part_child_dropdown_select' onchange='setNewPartChildButton();' style='width: 300px;'>";
for(var i = 0; i < _EXTRA_DB.length; ++i)
{
  partChildDropDownHTML += "<option value='" + _EXTRA_DB[0] + "'>" + _EXTRA_DB[i] + "</option>";
}
partChildDropDownHTML += "<option value='" + _EXTRA_DB[0] + "'>--All--</option>";
partChildDropDownHTML += "</select>";
document.getElementById("part_child_dropdown_div").innerHTML = partChildDropDownHTML;
setNewPartChildButton();
//              PART_MFR PART_MFR PART_MFR GEM_ID RS_ID   MM_ID   JS_ID  APPL_MFR

//END Initial Generation--------------------------------------------------------------------------------

var firebaseConfig = {
  apiKey: "AIzaSyBiHDF9LJepi4QyOhHeayZT_etKN5AjlGs",
  authDomain: "appliance-parts-f45cd.firebaseapp.com",
  databaseURL: "https://appliance-parts-f45cd.firebaseio.com",
  projectId: "appliance-parts-f45cd",
  storageBucket: "appliance-parts-f45cd.appspot.com",
  messagingSenderId: "671454569102",
  appId: "1:671454569102:web:479b1d3a11bedf601c1fdf"
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in. Has saved login info
    loadContentDiv();
    _LOGGED_IN = true;
  }
  else {
    document.getElementById("login_div").style.display = "block";
  }
setKeyboardShortcutBar();
});

function clearData()
{
  _content = null;
  _content_standard = null;
  _content_invoice_history = null;
  
  _content_extra = null;
  _sort_orders = null;
  _selectedCellLastID = null;
  
  _searchResults = [];
  
  _searchResults_ContentIndexes = [];
  _indexesSearchResults = [];
  _indexesSimilarStrings = [];
  _indexesRecordBrowser = [];
  
  _searchstring_any_history = [];
  _searchstring_specific_history = [];
  _searchstring_specific_history_index = [];
  _CHILD_PART_LINKS_CACHE.clear();
  _CHANGE_ALERTS_CACHE = [];

  _google_cse_api_key = "";
  _google_cse_api_key_loaded = false;
  _DBID_to_ContentIndex_Cache.clear();
  for(var i = 0; i < _EXTRA_DB.length; ++i)
    _extradb_link_index_cache[i].clear();
}

var _LOGGED_IN = false;
function log_out(){
  firebase.auth().signOut().then(function() {
    document.getElementById("login_div").style.display = "block";
    document.getElementById("part_child_record_manager").style.display = "none";
    document.getElementById("sort_order_div").style.display = "none";
    document.getElementById("content_div").style.display = "none";
    document.getElementById("search_div").style.display = "none";
    clearData();
    _LOGGED_IN = false;
    setKeyboardShortcutBar();

  }).catch(function(error) {
    window.alert(errorMessage);
  });
}

function log_in(){
  document.getElementById("login_div").style.display = "none";

  var persistenceVar;
  if(document.getElementById("remember_input").checked)
    persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
  else
    persistenceVar = firebase.auth.Auth.Persistence.NONE;

    firebase.auth().setPersistence(persistenceVar).then(function() {
        return firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input").value, document.getElementById("password_input").value).then(function() {
          loadContentDiv();
          _LOGGED_IN = true;
          setKeyboardShortcutBar();
          }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("login error " + errorMessage);
          window.alert(errorMessage);
          // ...
          document.getElementById("login_div").style.display = "block";
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("persistence error " + errorMessage);
        window.alert(errorMessage);
  });
}

function fetchJSONRecursive(index)
{
  if(index < _EXTRA_DB.length){
    fetchJSONFile("../Other/csv/" + _EXTRA_DB[index] + ".json", function(data){
      processJSONDataExtra(data, index);
      fetchJSONRecursive(index + 1);
    });
  }
  else{
    fetchJSONFile('../Other/final.json', function(data){
      processJSONData(data);
    });
  }
}

var _extraDBLoadedIndex = -1;
function loadContentDiv(){
  document.getElementById("email_input").value = "";
  document.getElementById("password_input").value = "";
  showSnackbar("Downloading parts from database... This may take up to 60 seconds", 10000);
  // document.getElementById("message").innerHTML = "<p>Downloading parts from database... This may take up to 60 seconds</p>";
  document.getElementById("record_browser_div").style.display = "none";

  // var partRef = firebase.database().ref('parts_db/D_DNI');
  // partRef.remove();

  //   $.ajax({
  //     type: "GET",
  //     url: "ascii_test.txt",
  //     dataType: "text",
  //     success: function(data) {processCSVData(data);}
  //  });

  if(_LOCAL_MODE) {
    // document.getElementById("fileinput_div").innerHTML = "<input id='fileinput_json' type='file' style='width: 500px; height: 200px;'></input><br>";
    // document.getElementById('fileinput_json').addEventListener('change', readSingleFile_json, false);
    fetchJSONRecursive(0);
  }
  else {
    for(var i = 0; i < _EXTRA_DB.length; ++i)
    {
      var extraDBRef = firebase.database().ref('parts_db/' + _EXTRA_DB[i]);
      extraDBRef.once('value', function(snapshot) {
        var objs = [];
        var keys = [];
        snapshot.forEach(function(childSnapshot) {
          objs.push(childSnapshot.val());
          keys.push(childSnapshot.key);
          childSnapshot = null; //Helps to prevent "Out of memory" errors?
        });
        processJSONDataExtra(objs, _EXTRA_DB.indexOf(snapshot.key), keys);
        ++_extraDBLoadedIndex;
        if(_extraDBLoadedIndex == _EXTRA_DB.length - 1) //Load big P&A_PRI after extra Databases loaded
        {
          var partsRef = firebase.database().ref('parts_db/P&A_PRI').orderByChild('RECORD_NUMBER');
          partsRef.once('value', function(snapshot) {
            showSnackbar("Processing parts...", 3000);
            // document.getElementById("message").innerHTML = "<p>Processing parts...</p>";
            
            // var numChildren = snapshot.numChildren();
            _content = [];
            
            var numRecords = 0;
            snapshot.forEach(function(childSnapshot) {
              var content_line = [];
              //indexToContentID[numRecords] = childSnapshot.key;
              for(var i = 0; i < _INDEXES.length; ++i)
              content_line.push(String(childSnapshot.child(_INDEXES[i]).val()));
              for(var i = 0; i < _MEMO_INDEXES.length; ++i){
                var memolines = childSnapshot.child(_MEMO_INDEXES[i]).val();
                for(var j = 0; j < memolines.length; ++j)
                  memolines[j] = String(memolines[j]);
                content_line.push(memolines);
              }
              content_line.push(childSnapshot.key);
              // document.getElementById("loading_parts").innerHTML = "<p>Processing parts...  " + (numRecords / numChildren) + "%</p>";
              _content.push(content_line);
              ++numRecords;
              childSnapshot = null; //Helps to prevent "Out of memory" errors?
            });
            generateContent_Standard();
            populateRecordBrowser(0, false);
            _contentSortedReverse = true;
            loadChangeAlerts();
            initialLoadingFinished();
          });
        }
      });
    }
  }

  var sortOrdersRef = firebase.database().ref('sort_orders');
  sortOrdersRef.on('value', function(snapshot) {
    var sortOrders = [];
    snapshot.forEach(function(childSnapshot) {
      var sortObj = childSnapshot.val();
      sortObj.key = childSnapshot.key;
      sortOrders.push(sortObj);
    });
    _sort_orders = sortOrders;
    populateSortOrders();
  });

  var invoiceRef = firebase.database().ref('invoice');
  invoiceRef.on('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if(childSnapshot.key == "address")
      {
        document.getElementById("invoice_address_textarea").value = childSnapshot.val();
      }
      else if(childSnapshot.key == "bottom")
      {
        document.getElementById("invoice_bottom_textarea").value = childSnapshot.val();
      }
      else if(childSnapshot.key == "last_invoice_no")
      {
        document.getElementById("invoice_last_invoice_no_input").value = childSnapshot.val();
        var ele = document.getElementById("invoice_input_invoice_no");
        if(ele != null)
          ele.value = childSnapshot.val();
      }
    });
  });

  var googleCSEAPI_Ref = firebase.database().ref('google_cse_api/key');
  googleCSEAPI_Ref.once('value', function(snapshot) {
    _google_cse_api_key = snapshot.val();
    _google_cse_api_key_loaded = true;
  });

  retrieveInvoiceDataFromDatabase(null);
}

function processJSONData(objs) 
{
  _content = [];
  for (var i = 0; i < objs.length; ++i) {
    var content_line = [];
    var obj = objs[i];
    for (var j = 0; j < _INDEXES.length; ++j) {
      content_line.push(String(obj[_INDEXES[j]]));
    }
    for (var j = 0; j < _MEMO_INDEXES.length; ++j) {
      content_line.push(obj[_MEMO_INDEXES[j]]);
    }
    content_line.push(i + "n");
    _content.push(content_line);
    // var in1 = 6;
    // var link = getExtraDBLinkIndex(in1, content_line[CONTENT_EXTRA_DB_INDEXES[in1]]);
    // if(link == null)
    //   console.log(content_line[CONTENT_EXTRA_DB_INDEXES[in1]]);
  }
  generateContent_Standard();
  populateRecordBrowser(0, false);
  initialLoadingFinished();
}

function processJSONDataExtra(objs, _content_extra_db, keys) {
  if (_content_extra == null) {
    _content_extra = new Array(_EXTRA_DB.length);
    for (var i = 0; i < _EXTRA_DB.length; ++i)
      _content_extra[i] = [];
  }

  for (var i = 0; i < objs.length; ++i) {
    var content_line = [];
    content_line.push(objs[i]);
    // for(var j = 0; j < EXTRA_INDEXES.length; ++j){
    //   var item = obj[EXTRA_INDEXES[j]];
    //   if(item == null)
    //     content_line.push("");
    //   else
    //     content_line.push(String(item));
    // }
    if (keys == null)
      content_line.push(i + "e");
    else
    {
      content_line.push(keys[i]);
      keys[i] = null; //Helps to prevent "Out of memory" errors?
    }
    objs[i] = null; //Helps to prevent "Out of memory" errors?
    _content_extra[_content_extra_db].push(content_line);
  }
  
  _CHILD_PART_LINKS_CACHE.clear();
}

function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}