var _LOCAL_MODE = false;
if(_LOCAL_MODE)
{
  document.getElementById("local_mode_indicator").innerHTML = "Local Mode ON";
}

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

var _EXTRA_DB =                   ["B_DNI", "CHLX",    "DNI",  "F",    "GEM",    "H_RS",  "I_MM",  "JS",    "OEM"];
var _EXTRA_DB_ACTUAL_INDEXES =    ["B_PN",  "CHLX_PN", "Q_PN", "F_PN", "GEM_PN", "RS_PN", "MM_PN", "JS_PN", "OEM_PN"];
var _EXTRA_DB_COMMENTS_PREFIXES = ["B",     "C",       "D",    "F",    "G",      "H",     "I",     "J",     "O"];
var _CONTENT_EXTRA_DB_INDEXES =   [ 9,       10,        22,     11,     12,       13,      14,      15,      20];

var RECORD_VIEW_DB_HEADER_WIDTH = "150px";
var RECORD_VIEW_HEADERS_PAGE1 =                 ["MFR",                                                         "PART#", "S",          "LOC",        "T1",         "T2",         "U",           "VEND",   "DATE",   "CGS",   "RETAIL",     "SELL",  "COMMENT"];
var RECORD_VIEW_HEADERS_WIDTHS_PAGE1 =          ["100px",                                                       "300px", "70px",       "100px",      "70px",       "70px",       "70px",        "100px",  "200px",  "100px", "100px",      "100px", "50px"];
var RECORD_VIEW_HEADERS_PAGE2 =                 ["MFR",                                                         "PART#", "AKA",        "MFR",        "DATE",       "CGS",        "SUGG",        "FIXED",  "SELL",   "COMMENT"];
var RECORD_VIEW_HEADERS_WIDTHS_PAGE2 =          ["100px",                                                       "300px", "70px",       "100px",      "70px",       "70px",       "70px",        "100px",  "200px",  "100px"];
// var RECORD_VIEW_HEADERS_ACTUAL_INDEXES = [["PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], ["PN"],  ["SHOP_QTY"], ["LOCATION"], ["TRK1_QTY"], ["TRK2_QTY"], ["USED_QTY"],  ["FROM"], ["DATE"], ["CGS"], ["VEND_RET"], ["SELL"]];
var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1 = [
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
 ["SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL"],
 ["COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS"]
];

var RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2 = [
  ["PART_MFR", "PART_MFR", "APPL_MFR", "PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], 
  ["PN","PN","PN","PN","PN","PN","PN","PN","PN"],  
  ["AKA","AKA","AKA","AKA","AKA","AKA","AKA","JS_LINE_PN","AKA"],
  ["REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM","REG_FROM"], 
  ["REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE","REG_DATE"], 
  ["REG","REG","REG","REG","REG","REG","REG","REG","REG"],
  ["SUGG","SUGG","SUGG","SUGG","SUGG","SUGG","SUGG","SUGG","SUGG"],  
  ["FIXED","FIXED","FIXED","FIXED","FIXED","FIXED","FIXED","FIXED","FIXED"], //?
  ["SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL","SELL"],
  ["COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS","COMMENTS"]
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
var _contentSortedIndex = [0];
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

var _CHILD_PART_LINKS_CACHE = [];

function initialLoadingFinished() //Called after all parts are downloaded and processed
{
  if(!_LOCAL_MODE) //TODO Remove
    sortContentByIndex(_DESCRIP1);
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

for(var i = 0; i < INDEXES_CONCAT.length; ++i){
  _searchstring_specific_history.push(new Array());
  _searchstring_specific_history_index.push(0);
}

for(var i = 0; i < INDEXES_CONCAT.length; ++i){
  var order_id = _INDEX_ORDER[i];
  if(i <= 9){
    checkboxHTML += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 50) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\"><span class='checkmark'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
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
    checkboxHTML_More += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 50) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\"><span class='checkmark'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
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
  
  _indexesSearchResults = [];
  _indexesSimilarStrings = [];
  _indexesRecordBrowser = [];
  
  _searchstring_any_history = [];
  _searchstring_specific_history = [];
  _searchstring_specific_history_index = [];
  _CHILD_PART_LINKS_CACHE = [];
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
          childSnapshot = null; //Helps to prevent "Out of memory" errors
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
              childSnapshot = null; //Helps to prevent "Out of memory" errors
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

function search_query(clearResults)
{
  if(clearResults == null)
  {
    document.getElementById("key_shortcut_search_scope_window").style.display = "";
    _overlay_window_open = true;
    document.activeElement.blur();
  }
  else
  {
    searchQueryScope(0, true);
  } 
}

var _SEARCHSCOPE_NEW = 1;
var _SEARCHSCOPE_CURRENT = 2;
function searchQueryScope(scope, clearResults)
{
  if(clearResults == null)
    setTab(TAB_SEARCH_RESULTS);
  // document.getElementById("search_results_expander").style.display = "none";
  document.getElementById("search_results_div").style.display = "none";
  document.getElementById("similar_string_expander").style.display = "none";
  var searchstring_any = document.getElementById("search_input").value;
  if(clearResults == null)
    showSnackbar("Searching...", 6000);
  // document.getElementById("message").innerHTML = "<p><br><br><br>Searching...</p>";
  var anyChecked = document.getElementById("radio_columns_any").checked;
  if(searchstring_any == "" && anyChecked){
    if(clearResults == null)
      showSnackbar("No Results Found. Try using numbers or characters in your search", 6000);
    // document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found. Try using numbers or characters in your search</p>";
  }
  else{
    if(anyChecked && !_searchstring_any_history.includes(document.getElementById("search_input").value)){
      _searchstring_any_history.push(document.getElementById("search_input").value);
      _searchstring_any_history_index = _searchstring_any_history.length - 1;
    }
    var searchWorker = new Worker('workers/get_search_results.js');
    // var results = getSearchResults(searchstring, content_simple);

    var total_indexes_length = _INDEXES.length + _MEMO_INDEXES.length;
    var columnsToSearch = [];
    var searchstrings_specific = [];
    for(var i = 0; i < total_indexes_length; ++i){
      var specific_i = document.getElementById("search_input_" + i).value;
      if(!anyChecked && specific_i != "" && !_searchstring_specific_history[i].includes(specific_i))
      {
        _searchstring_specific_history[i].push(document.getElementById("search_input_" + i).value);
        _searchstring_specific_history_index[i] = _searchstring_specific_history[i].length - 1;
      }
      searchstrings_specific.push(specific_i);
      if(specific_i == ""){
        document.getElementById("column_checkbox_" + i).checked = false;
        columnsToSearch.push(false);
      }
      else
        columnsToSearch.push(anyChecked || document.getElementById("column_checkbox_" + i).checked);
    }
    
    var currentResultsRowsBool = [];
    if(scope == _SEARCHSCOPE_CURRENT)
    {
      for(var r = 0; r < _content.length; ++r)
        currentResultsRowsBool.push(false);
      for(var r = 0; r < _searchResults.length; ++r)
      {
        var index = getContentIndexFrom_DB_ID(_searchResults[r].id);
        currentResultsRowsBool[index] = true;
      }
    }
    searchWorker.postMessage([searchstring_any, _content_standard, _content, columnsToSearch, anyChecked, searchstrings_specific, _INDEXES, currentResultsRowsBool]);
    searchWorker.onmessage = function(e) {
      var results = e.data;
      if(results[0] == 0){
        if(clearResults == null)
          showSnackbar("Searched " + results[1] + " of " + _content.length + " records", 3000);
        // document.getElementById("message").innerHTML = "<br><br><br><p>Searched " + results[1] + " of " + _content.length + " records</p>";
      }
      else{
        if(results.length <= 1){
          if(clearResults == null)
            showSnackbar("No Results Found", 6000);
          // document.getElementById("message").innerHTML = "<p><br><br><br>No Results Found</p>";
        }
        else{
          results.splice(0,1);
          _searchResults = results;
          populateSearchResults(0, true, false, -1);
        }
      }
    }
  }
}

var _highlightgreen_requested = false;
var _RECORD_BROWSER_ROW_IDS = [];
function populateRecordBrowser(indexStart, highlight_IndexStart_Green)
{
  _highlightgreen_requested = highlight_IndexStart_Green;
  document.getElementById("wlmay_input_div").style.display = "block";

  document.getElementById("record_browser_table_div").innerHTML = "";
  var origIndexStart = indexStart;
  if(_content.length - indexStart < _recordBrowserMax)
    indexStart = _content.length - _recordBrowserMax;
  if(indexStart < 0)
    indexStart = 0;
  if(indexStart > _content.length - 1)
    indexStart = _content.length - 1;
  var indexEnd = indexStart + (_recordBrowserMax - 1);
  if(_content.length - 1 < indexEnd)
    indexEnd = _content.length - 1;
  _currentRecordBrowserStartIndex = indexStart;

  if(_content.length > 0){
    document.getElementById("part_child_record_manager").style.display = "block";
    document.getElementById("sort_order_div").style.display = "block";
    document.getElementById("search_div").style.display = "block";
    document.getElementById("message").innerHTML = "";
    document.getElementById("record_browser_div").style.display = "block";
    var tableHTML = "<p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _content.length + " Record(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
    "<p style='display: inline; background-color: #70A2FF;'>Table Si<span style='color: white;'>z</span>e</p>&nbsp;&nbsp;" + 
    "<input id=\"record_browser_max\" type=\"number\" value=" + _recordBrowserMax + " min=\"0\" onfocus='showRecordBrowserMax();' onchange='showRecordBrowserMax();'></input>" + 
    "<button id=\"save_record_browser_max\" onclick=\"updateRecordBrowserMax();\" style=\"display: none;'\">Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_record_browser_add_new_part' onclick='startNewRecord();' style='background-color: #70A2FF; color: black;'><span style='color: white;'>A</span>dd New Part +</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_record_browser_jump_top'    onclick='recordBrowserJumpToEdge(0);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>T</span>op</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_record_browser_jump_bottom' onclick='recordBrowserJumpToEdge(1);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>B</span>ottom</button>" + 
    "<p style='background-color: #70A2FF;'>R<span style='color: white;'>e</span>cord Browser</p>" +
    "<div id='add_part_table_div'></div>" +
    "<table class='clickable' id='record_browser_table'><thead><tr>";

    for(var i = 0; i < INDEXES_CONCAT.length; ++i)
    {
      var index = _INDEX_ORDER[i];
      var bgcolor = "inherit";
      if(_contentSortedIndex.includes(index))
          bgcolor = getSortColor(index);
      tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + "; position: sticky; top: 0; z-index: 2;'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
    }
    tableHTML += "</thead></tr><tbody>";

    // for(var i = 0; i < MEMO_INDEXES.length; ++i){
    //   var i2 = i + INDEXES.length;
    //   var bgcolor = "inherit";
    //   if((i2) == _contentSortedIndex)
    //     if(_contentSortedReverse)
    //       bgcolor = _sortedIndexBGColorReverse;
    //     else
    //       bgcolor = _sortedIndexBGColor;
    //   tableHTML += "<th class='clickable' onclick='sortContentByIndex(" + i2 + ");' style='background-color: " + bgcolor + ";'><div style='width: " + MEMO_INDEX_WIDTHS[i] + ";'>" + MEMO_INDEXES[i] + "</div></th>";
    // }

    _indexesRecordBrowser = [];
    var numRows = 0;
    _RECORD_BROWSER_ROW_IDS = [];
    for (var i = indexStart; i <= indexEnd; ++i) {
      tableHTML += "<tr id='record_browser_row_" + i + "'>"
      _indexesRecordBrowser.push(i);
      _RECORD_BROWSER_ROW_IDS.push(_content[i][_content[i].length - 1]);
      for(var j = 0; j < INDEXES_CONCAT.length; ++j)
      {
        var index = _INDEX_ORDER[j];
        var id2 = "record_browser_cell_" + i + "_" + j;
        if(j == 0)
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i + "_" + j + "\");' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'><img id='edit_icon_" + numRows + "' src='pencil.png' width=25px height=25px onclick='startEditRecord(\"" + _content[i][_content[i].length - 1] + "\", " + i + ", \"record_browser_row_" + i + "\");'>&nbsp;&nbsp;&nbsp;&nbsp;<img id='copy_icon_" + numRows + "' src='copy.png' width=30px height=30px onclick='startNewRecord(" + i + ");'>&nbsp;&nbsp;&nbsp;&nbsp;<div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + getHTMLSafeText(_content[i][index]) + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        else if(index < _INDEXES.length)
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i + "_" + j + "\");' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + getHTMLSafeText(_content[i][index]) + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        else{ //Memo field)
          tableHTML += "<td id='" + id2 + "' onmouseover='recordViewIconMouseOver(\"browser_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"browser_" + i + "_" + j + "\");' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + _TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + getHTMLSafeText(_content[i][1]) + "</span>" + getExpandableHTML(_content[i][index], (i + "_" + j), 100, INDEX_WIDTHS_CONCAT[index]) + "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_browser_" + i + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + _content[i][_content[i].length - 1] + "\");'></div></td>";
        }
      }
      // for(var j = 0; j < MEMO_INDEXES.length; ++j)
      // {
      //   var j2 = j + INDEXES.length;
      //   var id2 = "record_browser_cell_" + i + "_" + j2;
      //   tableHTML += "<td id='" + id2 + "' onclick='onCellClick(" + i + "," + j2 + ",\"" + id2 + "\"," + TABLE_RECORD_BROWSER + ");'><div class='tooltip'><span class='tooltiptext'>" + MEMO_INDEXES[j] + "<br><br>" + _content[i][1] + "</span>" + getExpandableHTML(_content[i][j2], (i + "_" + j2), 100, MEMO_INDEX_WIDTHS[j]) + "</div></td>";
      // }
      tableHTML += "</tr>"
      ++numRows;
    }

    tableHTML += "</tbody></table>";
    document.getElementById("record_browser_table_div").innerHTML = tableHTML;
  }
  if(highlight_IndexStart_Green && document.getElementById("record_browser_row_" + origIndexStart) != null){
    document.getElementById("record_browser_row_" + origIndexStart).style.backgroundColor = _tempTopRowColor;
  }
}

var array_trimmed = [];
var _table_HTML_0 = "";
var _select_top_row = false;
var _select_bottom_row = false;
var _row_to_select = 0;
var _adding_child_part_links = false;
var _SEARCH_RESULTS_ROW_IDS = [];
var _SIMILAR_STRINGS_ROW_IDS = [];
function populateSearchResults(indexStart, selectTopRow, selectBottomRow, rowToSelect)
{
  if(!_adding_child_part_links && _searchResults.length > 0)
  {
    _select_top_row = selectTopRow;
    _select_bottom_row = selectBottomRow;
    _row_to_select = rowToSelect;
    document.getElementById("similar_strings_div").innerHTML = "";
    if(_searchResults.length - indexStart < _searchResultsMax)
      indexStart = _searchResults.length - _searchResultsMax;
    if(indexStart < 0)
      indexStart = 0;
    if(indexStart > _searchResults.length - 1)
      indexStart = _searchResults.length - 1;
    var indexEnd = indexStart + (_searchResultsMax - 1);
    if(_searchResults.length - 1 < indexEnd)
      indexEnd = _searchResults.length - 1;

      _currentSearchResultsStartIndex = indexStart;

    var shouldHighlight = document.getElementById("search_highlight").checked;

    _indexesSearchResults = [];
    array_trimmed = [];
    // var rankings = [];
    var numRows = 0;
    for (var i = indexStart; i <= indexEnd; ++i) {
      array_trimmed.push(new Array());
      var currentIndex = _searchResults[i].row;
      //DEBUG
      // rankings.push(_searchResults[i].ranking);
      //DEBUG
      _indexesSearchResults.push(currentIndex);
      for(var j = 0; j < INDEXES_CONCAT.length; ++j){
        if(j < _INDEXES.length)
          array_trimmed[numRows].push(_content[currentIndex][j]);
        else
          array_trimmed[numRows].push(copyArray1D(_content[currentIndex][j]));
      }
      array_trimmed[numRows].push(_content[currentIndex][_content[currentIndex].length - 1]);
      ++numRows;
    }

    if(shouldHighlight){
      var actualSearchStrings = [];
      for (var i = indexStart; i <= indexEnd; ++i) {
        // var len = table.rows.length;
        // var row = table.insertRow(len);
        var matchingcells = _searchResults[i].columns;
        for(var j = 0; j < INDEXES_CONCAT.length; ++j){
            // var cell1 = row.insertCell(j);
            // cell1.innerHTML = array_trimmed[i][j];
            if(matchingcells.includes(j)){
              for(var k = 0; k < matchingcells.length; ++k){
                if(matchingcells[k] == j){
                  var stringToHighlight = _searchResults[i].strings[k];
                  if(!actualSearchStrings.includes(stringToHighlight))
                    actualSearchStrings.push(stringToHighlight);
                  // var re = new RegExp(stringToHighlight,"g");
                  // cell1.innerHTML = cell1.innerHTML.replace(re, "<span style='background: yellow;'>" + stringToHighlight + "</span>");
                }
              }
            }
        }
      }
      
      var highlightSimilarWords = document.getElementById("search_highlight_similar_words").checked;
      if(highlightSimilarWords)
      {
        //Get string repetition info---------------------------------------------
        var singleWordsToOccurences = new Map(); //Standardized (word) to      [[num occurences, color],             [actual word spellings], [row nums]]
        var doubleWordsToOccurences = new Map(); //Standardized (word word) to [[num occurences, color, word, word], [actual word spellings], [row nums]]
        for(var i = 0; i < array_trimmed.length; ++i)
        {
          var row = array_trimmed[i];
          for(var j = 0; j < INDEXES_CONCAT.length; ++j)
          {
            var index = _INDEX_ORDER[j];
            var string;
            if(index < _INDEXES.length)
              string = row[index];
            else
              string = stringifyArrayEndChar(row[index], " ");
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
                  if(singleWordsToOccurences.has(singleWordStandard)){
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

        //Populate similar strings list--------------------------------------------------------------
        var wordsToSort = []; //[[Standardized word, color], [Actual Words], [row nums]]
        for (let [key, value] of doubleWordsToOccurences) {
          if(value[0][0] >= _minRepititions && highlightSimilarWords){
            var finalValue = [[key, value[0][1]], value[1], value[2]];
            wordsToSort.push(finalValue);
          }
        }
        
        for (let [key, value] of singleWordsToOccurences) {
          if(value[0][0] >= _minRepititions && highlightSimilarWords)
          {
            var finalValue = [[key, value[0][1]], value[1], value[2]];
            wordsToSort.push(finalValue);
          }
        }
        
        wordsToSort.sort(COMPARE_0_0);
        var similarHTML = "";
        var totalRows = 0;
        _indexesSimilarStrings = [];
        _SIMILAR_STRINGS_ROW_IDS = [];
        for(var i = 0; i < wordsToSort.length; ++i)
        {
          var wordData = wordsToSort[i];
          var resultsLabel = "results";
          if(wordData[2].length == 1)
            resultsLabel = "result";
          similarHTML += "<div class='clickable' onclick='toggle_similar_string_table(" + i + ");'><p><span id='similar_string_expander_" + i + "'>+</span> " + wordData[1][0] + " (" + wordData[2].length + " " + resultsLabel + ")</p></div>";
          
          similarHTML += "<table class='clickable' style='margin-left: 20px; display: none;' id='similar_string_table_" + i + "'><tr>";
          for(var j = 0; j < INDEXES_CONCAT.length; ++j){
            var index = _INDEX_ORDER[j];
            var bgcolor = "inherit";
            if(_contentSortedIndex.includes(index))
                bgcolor = getSortColor(index);
            similarHTML += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + ";'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
          }
          similarHTML += "</tr>";
          for(var j = 0; j < wordData[2].length; ++j){
            similarHTML += "<tr id='similar_string_row_" + totalRows + "'>";
            var rownum = wordData[2][j];
            _SIMILAR_STRINGS_ROW_IDS.push(array_trimmed[rownum][array_trimmed[rownum].length - 1]);
            _indexesSimilarStrings.push(_indexesSearchResults[rownum]);
            for(var k = 0; k < INDEXES_CONCAT.length; ++k){
              var index = _INDEX_ORDER[k];
              var termToHighlightList = [];
              var preHTML_List = [];
              var postHTML_List = [];

              var string;
              if(index < _INDEXES.length) //Regular Field
                string = array_trimmed[rownum][index];
              else //Memo field, Array of Strings
                string = stringifyArrayEndChar(array_trimmed[rownum][index], " ");
              
              var color = wordData[0][1];
              var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
              for(var v = 0; v < wordData[1].length; ++v){
                // if(getRegexSafeSearchTerm(wordData[1][v]).length <= 1)
                //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(wordData[1][v]) + "|");
                termToHighlightList.push(wordData[1][v]);
                preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                postHTML_List.push("</span>");
              }
              string = highlightString(string, termToHighlightList, preHTML_List, postHTML_List);
              var id2 = "similar_string_cell_" + totalRows + "_" + k;
              similarHTML += "<td id='" + id2 + "' onclick='onCellClick(" + totalRows + "," + k + ",\"" + id2 + "\"," + _TABLE_SIMILAR_STRINGS + ");'><div class='tooltip'><span class='tooltiptext'>" + INDEXES_CONCAT[index] + " for:<br><br>" + array_trimmed[rownum][1] + "</span>" + string + "</div></td>";
            }

            similarHTML += "</tr>";
            ++totalRows;
          }
          similarHTML += "</table>";
        }
        document.getElementById("similar_string_expander").style.display = "block";
        document.getElementById("similar_strings_div").innerHTML = similarHTML;
      }
      //Highlight array strings with regex---------------------------------------------

      //Go through array of matched search term phrases
      //  Make bold and yellow background
      //
      //Go through singleword map
      //  If more than 2 values in the value array
      //    check if the standard word is in the first slot of any entries in the double word map, set typeHighlightSingle map to false
      //    else set to true
      //
      //Go through double word map
      //  If more than 2 values in the value array
      //    highlight with background
      //
      //Go through single word map
      //  If more than 2 values in the value array
      //    highlight with type from typeHighlightSingle map
      //
      if(highlightSimilarWords)
      {
        var typeHighlightBGSingle = new Map();
        for (let [key1, value1] of singleWordsToOccurences) {
          if(value1[0][0] >= _minRepititions && highlightSimilarWords)
            for (let [key2, value2] of doubleWordsToOccurences) {
              if(value2[0][0] >= _minRepititions && highlightSimilarWords)
                typeHighlightBGSingle.set(key1, (key1 != value2[0][2] && key1 != value2[0][3])); //Single word is not in a double word pair
            }
        }
      }

      for(var i = 0; i < array_trimmed.length; ++i){
        for(var j = 1; j < array_trimmed[i].length; ++j){
          var index = _INDEX_ORDER[j - 1];
          var termToHighlightList = [];
          var preHTML_List = [];
          var postHTML_List = [];
          //Highlight search terms
          for(var s = 0; s < actualSearchStrings.length; ++s){
            // if(getRegexSafeSearchTerm(actualSearchStrings[s]).length <= 1)
            //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(actualSearchStrings[s]) + "|");
            termToHighlightList.push(actualSearchStrings[s]);
            preHTML_List.push("<span style='background: yellow; color: black;'><b>");
            postHTML_List.push("</b></span>");
          }

          //Highlight double words
          if(highlightSimilarWords)
          {
            for (let [key, value] of doubleWordsToOccurences) {
              if(value[0][0] >= _minRepititions && highlightSimilarWords){
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
          }

            //Highlight single words
          if(highlightSimilarWords)
          {
            for (let [key, value] of singleWordsToOccurences) {
              if(value[0][0] >= _minRepititions && highlightSimilarWords){
                var color = value[0][1];
                var bgColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ");";
                for(var v = 0; v < value[1].length; ++v){
                  // if(getRegexSafeSearchTerm(value[1][v]) <= 1)
                  //   console.log("Small word to highlight detected |" + getRegexSafeSearchTerm(value[1][v]) + "|");
                  termToHighlightList.push(value[1][v]);
                  if(typeHighlightBGSingle.get(key)){
                    preHTML_List.push("<span style='border: 3px solid " + bgColor + " color: black;'>");
                    postHTML_List.push("</span>");
                  }
                  else{
                    preHTML_List.push("<span style='border-bottom: 3px solid " + bgColor + "'>");
                    postHTML_List.push("</span>");
                  }
                }
              }
            }
          }

          if(index < _INDEXES.length)
            array_trimmed[i][index] = highlightString(array_trimmed[i][index], termToHighlightList, preHTML_List, postHTML_List);
          else
            array_trimmed[i][index] = highlightString(stringifyArrayEndChar(array_trimmed[i][index], " "), termToHighlightList, preHTML_List, postHTML_List);

        }
      }
    } //END shouldHighlight

    //Generate search results table-----------------------------------------------------------------
    _table_HTML_0 = "<p style='display: inline;'>Showing " + (indexStart + 1) + " - " + (indexEnd + 1) + " of " + _searchResults.length + " Result(s)</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
    "<p style='display: inline; background-color: #70A2FF;'>Table <span style='color: white;'>S</span>ize</p>&nbsp;&nbsp;" + 
    "<input id=\"search_results_max\" type=\"number\" value=" + _searchResultsMax + " min=\"0\" onchange='showSearchResultsMax();' onfocus='showSearchResultsMax();'></input>" + 
    "<button id=\"save_search_results_max\" onclick=\"updateSearchResultsMax();\" style=\"display: none;\">Save</button>" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_search_results_jump_top'    onclick='searchResultsJumpToEdge(0);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>T</span>op</button>" + 
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id='button_search_results_jump_bottom' onclick='searchResultsJumpToEdge(1);' style='background-color: #70A2FF; color: black;'>Jump to <span style='color: white;'>B</span>ottom</button>" + 
    "<p style='background-color: #70A2FF;'>S<span style='color: white;'>e</span>arch Results</p>" +
    "<table id='search_results_table_table' class='clickable'><tr>";

    // //DEBUG
    // _table_HTML_0 += "<th>Ranking</th>";
    // //DEBUG

    for(var i = 0; i < INDEXES_CONCAT.length; ++i){
      var index = _INDEX_ORDER[i];
      var bgcolor = "inherit";
      if(_contentSortedIndex.includes(index))
          bgcolor = getSortColor(index);
      _table_HTML_0 += "<th class='clickable' onclick='sortContentByIndex(" + index + ");' style='background-color: " + bgcolor + "; position: sticky; top: 0; z-index: 2;'><div style='width: " + INDEX_WIDTHS_CONCAT[index] + ";'>" + INDEXES_CONCAT[index] + "</div></th>";
    }
    _table_HTML_0 += "</tr>";

    _SEARCH_RESULTS_ROW_IDS = [];
    for(var i = 0; i < array_trimmed.length; ++i)
      _SEARCH_RESULTS_ROW_IDS.push(array_trimmed[i][array_trimmed[i].length - 1]);
    var shouldAddChildPartLinks = document.getElementById("search_add_child_part_links").checked;
    if(!shouldAddChildPartLinks)
    {
      for(var i = 0; i < array_trimmed.length; ++i){
        _table_HTML_0 += "<tr id='search_results_row_" + i + "'>";
        // _table_HTML_0 += "<td>" + rankings[i] + "</td>";
        for(var j = 0; j < INDEXES_CONCAT.length; ++j){
          var index = _INDEX_ORDER[j];
          var cellContent = array_trimmed[i][index];
    
          var id2 = "search_results_cell_" + i + "_" + j;
          _table_HTML_0 += 
          "<td onmouseover='recordViewIconMouseOver(\"search_" + i + "_" + j + "\");' onmouseout='recordViewIconMouseOut(\"search_" + i + "_" + j + "\");' id='" + id2 + "' onclick='onCellClick(" + i + "," + j + ",\"" + id2 + "\"," + _TABLE_SEARCH_RESULTS + ");'>" + 
          "<div class='tooltip'><span class='tooltiptext' style='border: 3px solid black; background-color: white; color: black;'>" 
          + INDEXES_CONCAT[index] + " for:<br><br>" + array_trimmed[i][_DESCRIP1] + "</span>" + cellContent + 
          "&nbsp;&nbsp;&nbsp;<img id='record_view_icon_search_" + i + "_" + j + "' title='Open Record View' src='record_view.png' width=50px height=20px style='display: none;' onclick='addRecordView(\"" + array_trimmed[i][array_trimmed[i].length - 1] + "\");'></div></td>"
          ;
        }
        _table_HTML_0 += "</tr>";
      }
      finishPopulateSearchResults(_table_HTML_0);
    }
    else
    {
      var childPartButtonWorker = new Worker('workers/add_child_part_button_html.js');
      _adding_child_part_links = true;
      childPartButtonWorker.postMessage([_EXTRA_DB, _EXTRA_DB_COMMENTS_PREFIXES, _content_extra, array_trimmed, INDEXES_CONCAT, _DESCRIP1, _INDEX_ORDER, _DESCRIP2, _COMMENTS, _TABLE_SEARCH_RESULTS, shouldAddChildPartLinks, _CHILD_PART_LINKS_CACHE /*, /*DEBUG rankings DEBUG*/]);

      childPartButtonWorker.onmessage = function (e) {
        if(e.data[0] == 1){ //Finished
          _table_HTML_0 += e.data[1];
          _CHILD_PART_LINKS_CACHE = e.data[2];
          finishPopulateSearchResults(_table_HTML_0);
          _adding_child_part_links = false;
        }
        else //Percent status update message
        {
          showSnackbar("Adding Child Part Links... " + Math.floor(e.data[1] * 100) + "%", 3000);
          // document.getElementById("message").innerHTML = "<br><br><br><p>Adding Child Part Links... " + Math.floor(e.data[1] * 100) + "%</p>";
        }
      }//END onMessage from PartChildButton worker
    }//END shouldAddChildPartLinks
  } // (!_adding_child_part_links && _searchResults.length > 0)
} //END populateSearchResults

function finishPopulateSearchResults(_table_HTML_0)
{
  _table_HTML_0 += "</table>";
  document.getElementById("search_results_table_div").innerHTML = _table_HTML_0;

  //Make memo fields expandable HTML
  var table1 = document.getElementById("search_results_table_table");
  if(table1 != null)
  {
    var rows = table1.rows;
    for(var i = 1; i < rows.length; ++i) //Only rows after header (index 0)
    {
      var cells = rows[i].cells;
      for(var j = 0; j < cells.length; ++j)
      {
        if(_INDEX_ORDER[j] >= _INDEXES.length)
        {
          cells[j].innerHTML = getExpandableHTML(null, (i + "_" + j), 100, INDEX_WIDTHS_CONCAT[_INDEX_ORDER[j]], cells[j].innerHTML)
          // getExpandableHTML(_content[i][index], (i + "_" + j), 100, INDEX_WIDTHS_CONCAT[index])
        }
      }
    }
  }
  //Set state of divs-------------------------------------------------------
  // document.getElementById("search_results_expander").style.display = "block";
  // toggle_search_results(1);
  document.getElementById("search_results_div").style.display = "";
  document.getElementById("message").innerHTML = "";

  if(_select_top_row){
    var cell = getCell(0, _selectedCell, _TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(0, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
  else if(_select_bottom_row){
    var cell = getCell(array_trimmed.length - 1, _selectedCell, _TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(array_trimmed.length - 1, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
  else if(_row_to_select >= 0)
  {
    var cell = getCell(_row_to_select, _selectedCell, _TABLE_SEARCH_RESULTS);
    if(cell != null)
      onCellClick(_row_to_select, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
  }
}

var _SortOrderKeyCodes = [];
function populateSortOrders()
{
  _SortOrderKeyCodes = [];
  document.getElementById("sort_order_table_div").innerHTML = "";
  var newHTML = "<table>";
  var shortcut_window_html = "";
  for(var i = 0; i < _sort_orders.length; ++i)
  {
    var quickLetter = "0";
    var keyCode = "";
    if(i < _ALPHABET.length)
    {
      quickLetter = _ALPHABET[i];
      keyCode = "Key" + quickLetter;
    }
    else
    {
      quickLetter = String(i - _ALPHABET.length);
      keyCode = "Digit" + quickLetter;
    }
    _SortOrderKeyCodes.push(keyCode);
    
    var id1 = i + 1;
    newHTML += "<tr id='sort_order_row_" + id1 + "'><td>" + quickLetter + "</td><td>" + 
    "<div style='display: none; align-items: center; justify-content: center;' id='sort_order_buttons_" + id1 + "'>" +
    "<div style='flex-direction: column; width: 100px;'>" + 
    "<button id='sort_order_button_save" + id1 + "'           style='background-color: #70A2FF; color: black; width: 70px; font-size: 20px;' onclick='saveEditSortOrder(" + id1 + ");'><span style='color: white;'>S</span>ave</button>" + 
    "<button id='sort_order_button_cancel" + id1 + "'         style='background-color: #70A2FF; color: black; width: 70px; font-size: 20px; margin-top: 5px;' onclick='populateSortOrders();'><span style='color: white;'>C</span>ancel</button>" + 
    "<button id='sort_order_button_delete" + id1 + "'         style='background-color: #70A2FF; color: red;   width: 70px; font-size: 20px; margin-top: 5px;' onclick='startDeleteSortOrder(" + id1 + ");'><span style='color: white;'>D</span>elete</button>" + 
    "<button id='sort_order_button_confirm_delete" + id1 + "' style='background-color: #70A2FF; color: red;   display: none; width: 100px; font-size: 20px; margin-top: 5px;' onclick='confirmDeleteSortOrder(" + id1 + ");'>Confirm <span style='color: white;'>D</span>elete</button>" + 
    "<button id='sort_order_button_cancel_delete" + id1 + "'  style='background-color: #70A2FF; color: black; display: none; width: 100px; font-size: 20px; margin-top: 5px;' onclick='cancelDeleteSortOrder(" + id1 + ");'><span style='color: white;'>C</span>ancel Delete</button>" + 
    "</div>" +
    "<p style='font-size: 20px;'>Name&nbsp;</p><input id='sort_order_name_" + id1 + "' type='text' style='width: 500px; font-size: 20px;' onfocus='deselectTable();'>" + 
    "</div>" +
    "<div id='sort_order_static_" + id1 + "'>" +
    "<img class='clickable' style='display: inline;' id='sort_order_edit_icon_" + i + "' src='pencil.png' width=20px height=20px onclick='startEditSortOrder(" + id1 + ");'>&nbsp;&nbsp;&nbsp;&nbsp;" + 
    "<button id='sort_order_sort_button_" + id1 +"' style='font-size: 20px;' onclick='sortContentBySortOrder(" + i + ");'>Sort</button>&nbsp;&nbsp;&nbsp;&nbsp;" +
    "<p style='display: inline; font-size: 20px;'>" + getHTMLSafeText(_sort_orders[i].name) + "</p>" +
    "</div>" +
    "</td>";
    for(var j = 0; j < _sort_orders[i].sorted_indexes.length; ++j)
    {
      var index = _sort_orders[i].sorted_indexes[j];
      newHTML += getSortOrderCell(id1, j, index);
    }
    newHTML += "</tr>";

    shortcut_window_html += "<span style='color: white;'>" + quickLetter + "</span>. ." + getHTMLSafeText(_sort_orders[i].name) + "<br>";
  }
  newHTML += "</table>";
  document.getElementById("sort_order_table_div").innerHTML = newHTML;
  document.getElementById("key_shortcut_index_window").innerHTML = shortcut_window_html;
  document.getElementById("key_shortcut_index_window_edit").innerHTML = shortcut_window_html;
  setKeyboardShortcutBar();
}


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
      htmlToAdd += "<div id='record_view_" + i + "' " + bgstyle + " onclick='selectRecordView(" + i + ");'>";
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

  for(var i = 0; i < RECORD_VIEW_HEADERS_PAGE1.length; ++i){
    for(var j = 0; j < _EXTRA_DB.length; ++j)
    {
      var ele = document.getElementById("record_view_data_read_" + RECORD_VIEW_HEADERS_PAGE1[i] + "_" + index + "_" + j);
      if(ele != null)
      {
        ele.style.display = "none";
        document.getElementById("record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1[i] + "_" + index + "_" + j).style.display = "";
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
        for(var k = 0; k < RECORD_VIEW_HEADERS_PAGE1.length; ++k)
        {
          var ele = document.getElementById("record_view_data_input_" + RECORD_VIEW_HEADERS_PAGE1[k] + "_" + index + "_" + j);
          if(ele != null)
          {
            _content_extra[j][extraDBIndex][0][RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1[k][j]] = String(ele.value);
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

document.getElementById("import_wlmay_pdf_input").onchange = function(event) 
{
  if(document.getElementById("import_wlmay_pdf_input").value != "")
  {
    var file = event.target.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader();  

    fileReader.onload = function() {

        //Step 4:turn array buffer into typed array
        var typedarray = new Uint8Array(this.result);

        getPdfText(typedarray);
        document.getElementById("wlmay_input_div").style.display = "none";
        document.getElementById("wlmay_pdf_table_div").style.display = "block";
    };
    //Step 3:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  }
}

function cancelWLMAYPDF()
{
  document.getElementById("wlmay_pdf_table_div").style.display = "none";
  document.getElementById("wlmay_input_div").style.display = "block";
  document.getElementById("import_wlmay_pdf_input").value = "";
  document.activeElement.blur();
  setKeyboardShortcutBar();
}

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

function generatePDFAddToDatabaseTable(index)
{
  var desc = document.getElementById("pdf_description_" + index).value.split("\n");
  var pn = "";
  var descrip1 = "";
  var pnFound = false;
  for(var i = 0; i < desc.length; ++i)
  {
    if(removeExtraSpaces(desc[i]) != "")
    {
      if(!pnFound)
      {
        pn = removePreWP(desc[i]);
        pnFound = true;
      }
      else
      {
        descrip1 = desc[i];
        break;
      }
    }
  }
  
  var link = null;
  var extradb = -1;
  for(var i = 0; i < _EXTRA_DB.length; ++i)
  {
    link = getExtraDBLinkIndex(i, pn);
    if(link != null)
    {
      extradb = i;
      break;
    }
  }
  
  var dealerprice_ele = document.getElementById("pdf_dealerprice_" + index);
  var yourprice_ele = document.getElementById("pdf_yourprice_" + index);
  var shippedamount_ele = document.getElementById("pdf_shipped_" + index);
  var dealerprice = "";
  var yourprice = "";
  var shippedamount = "";
  var newqty = "";
  if(dealerprice_ele != null)
    dealerprice = dealerprice_ele.value;
  if(yourprice_ele != null)
    yourprice = yourprice_ele.value;
  if(shippedamount_ele != null)
  {
    shippedamount = shippedamount_ele.value;
    newqty = Math.floor(Number(shippedamount));
  }

  if(link == null){
    var notFoundHTML = "<span style='color: red;'>Could not find part number \"" + pn + "\" in any child databases!</span>";
    notFoundHTML += "<p>Add new part child record?</p>";
    notFoundHTML += "<select id='pdf_new_partchild_select_" + index + "' style='width: 300px;'>";
    for(var i = 0; i < _EXTRA_DB.length; ++i)
    {
      notFoundHTML += "<option value='" + _EXTRA_DB[0] + "'>" + _EXTRA_DB[i] + "</option>";
    }
    notFoundHTML += "</select>";
    notFoundHTML += "&nbsp;&nbsp;<button id='button_pdfimport_newpartchild_submit' style='background-color: #70A2FF; color: black;' onclick='startPDFNewChildRecord(" + index + ");'><span style='color: white;'>S</span>ubmit</button>";
    notFoundHTML += "&nbsp;&nbsp;<button id='button_pdfimport_newpartchild_cancel' style='background-color: #70A2FF; color: black;' onclick='cancelPDFAddToDatabase(" + index + ");'><span style='color: white;'>C</span>ancel</button>";
    document.getElementById("pdf_add_to_database_table_" + index).innerHTML = notFoundHTML;
    var ele = document.getElementById("pdf_new_partchild_select_" + index);
    if(ele != null)
    {
      ele.focus();
    }
  }
  else
  {
    extraDBs_PDF.set(index, extradb);
    extraDBLinks_PDF.set(index, link);
    var partObj = _content_extra[extradb][link][0];
    dealerprice = Number(partObj.REG);
    yourprice = Number(partObj.SPL);
    shippedamount = Number(partObj.SHOP_QTY);
    if(dealerprice_ele != null)
      dealerprice = dealerprice_ele.value;
    if(yourprice_ele != null)
      yourprice = yourprice_ele.value;
    if(shippedamount_ele != null)
      shippedamount = shippedamount_ele.value;
    var dealerprice_change = "";
    var yourprice_change = "";
    var shippedamount_change = "";
    //dealerprice -> REG
    //yourprice -> SPL
    //shippedamount -> SHOP_QTY
    var diff = 0;
    if(Number(dealerprice) == Number(partObj.REG) || removeExtraSpaces(dealerprice) == "")
    {
      dealerprice_change = "No Change";
      dealerprice = partObj.REG;
    }
    else{
      diff = get_plus_minus_usd_string(Number(dealerprice) - Number(partObj.REG));
      dealerprice_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }
    if(Number(yourprice) == Number(partObj.SPL) || removeExtraSpaces(yourprice) == "")
    {
      yourprice_change = "No Change";
      yourprice = partObj.SPL;
    }
    else {
      diff = get_plus_minus_usd_string(Number(yourprice) - Number(partObj.SPL));
      yourprice_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }
    if(removeExtraSpaces(shippedamount) == "")
    {
      shippedamount = 0;
    }
    newqty = 0;
    newqty += Number(shippedamount);
    newqty += Number(partObj.SHOP_QTY);
    diff = newqty - Number(partObj.SHOP_QTY);
    newqty = Math.floor(Number(newqty));
    if(diff >= 0)
      diff = "+" + diff;
    shippedamount_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    var htmlToAdd = "";
    if(removeExtraSpaces(partObj.FIXED) != "")
      htmlToAdd += "<div style='color: red;'>Fixed price found!</div>";
    htmlToAdd += "<table>"
    + "<tr><th>DB</th><th>PN</th><th>AKA</th><th>REG</th><th>SPL</th><th>SHOP_QTY</th><th>FIXED</th></tr>"
    + "<tr><td>" + _EXTRA_DB[extradb] + "</td><td>" + partObj.PN + "</td><td>" + partObj.AKA + "</td><td>" + partObj.REG + "</td><td>" + partObj.SPL + "</td><td>" + partObj.SHOP_QTY + "</td><td>" + partObj.FIXED + "</td></tr>"
    + "<tr><td></td><td></td><td></td><td>" + dealerprice_change + "</td><td>" + yourprice_change + "</td><td>" + shippedamount_change + "</td><td></td></tr>"
    + "<tr><td>" + _EXTRA_DB[extradb] + "</td><td>" + partObj.PN + "</td><td>" + partObj.AKA + "</td><td>" + dealerprice + "</td><td>" + yourprice +   "</td><td>" + newqty +           "</td><td>" + partObj.FIXED + "</td></tr>"
    + "</table>"
    + "<button id='button_pdfimport_save_addrow'   style='background-color: #70A2FF; color: black;' onclick='confirmPDFAddToDatabase(" + index + ");'><span style='color: white;'>S</span>ave</button>&nbsp;&nbsp;"
    + "<button id='button_pdfimport_cancel_addrow' style='background-color: #70A2FF; color: black;' onclick='cancelPDFAddToDatabase(" + index + ");' ><span style='color: white;'>C</span>ancel</button>";
    document.getElementById("pdf_add_to_database_table_" + index).innerHTML = htmlToAdd;
    document.getElementById("pdf_add_to_database_table_" + index).scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    document.activeElement.blur();
  }
  newREGs.set(index, dealerprice);
  newSPLs.set(index, yourprice);
  newSHOP_QTYs.set(index, newqty);
  newPNs.set(index, pn);
  newDESCRIP1s.set(index, descrip1);
  setPDFAddToDatabaseButtons(false);
}

function populateInvoice()
{
  clearInvoicesContent();
  saveInvoiceToObject();
  var numTotalRows = _invoice_objs.length;
  var htmlToAdd = "";
  var specsText = "";
  if(numTotalRows > 0){
    for(var i = 0; i < numTotalRows; ++i)
    {
      var obj = _invoice_objs[i];
      specsText += obj.equip_type + "/" + obj.mfr + "/" + obj.equip_design;
      if(i % 2 == 0)
        specsText += "           ";
      else
        specsText += "\n";
      if(i == 0)
      {
        htmlToAdd += INVOICE_PRE;
      }
      // else if(i % NUMROWS_PER_INVOICE == 0)
      // {
      //   //Add post then pre invoice html
      //   htmlToAdd += INVOICE_POST + "</div>";
      //   htmlToAdd += "<div style='position: absolute; top: " + (pageOn * 1000) + "px;'>" + INVOICE_PRE;
      // }

      if(i < _invoice_objs.length)
      {
        //Add filled row
        htmlToAdd += "<tr class='in_td'><td>"
        + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_qty_" + i + "' value='" + getHTMLSafeText(obj.amountToSell) + "' disabled></td><td>"
        + "<input type='text' style='width: 493px; height: 15px;' value='" + getHTMLSafeText(obj.PN) + " | " + getHTMLSafeText(obj.DESCRIP1) + "' id='invoice_input_desc_" + i + "' disabled></td><td>"
        + "<input type='text' style='width: 48px; height: 15px; text-align: right;' id='invoice_input_sell_" + i + "' value='" + getHTMLSafeText(obj.SELL) + "' onfocus='deselectTable();' onchange='calculateInvoiceAmounts();'></td><td>"
        + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_amount_" + i + "' disabled></td><td class='no-print'>"
        + "<button id='button_invoice_remove_" + i + "' style='width: 20px; height: 20px; padding: 0px; color: white; background-color: red;' tabindex='-1' onclick='removeFromInvoice(" + i + ");'>x</button></td></tr>";
      }
      else
      {
        //Add empty row
        htmlToAdd += "<tr class='in_td'><td></td><td></td><td></td><td></td><td class='no-print'></td></tr>";
      }
    }
    //Add post invoice html
    htmlToAdd += INVOICE_POST;
  }
  else
  {
    htmlToAdd = "<h2>No parts are queued for sale!</h2>";
  }
  document.getElementById("invoice_content").innerHTML = htmlToAdd;

  if(numTotalRows > 0){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0' + dd;
    }

    if(mm<10) {
        mm = '0' + mm;
    }

    today = mm + " / " + dd + " / " + yyyy;

    document.getElementById("invoice_input_invoice_no").value = document.getElementById("invoice_last_invoice_no_input").value;
    document.getElementById("invoice_input_date").value = today;
    document.getElementById("invoice_address_textarea_2").innerHTML = document.getElementById("invoice_address_textarea").value;
    document.getElementById("invoice_bottom_textarea_2").value = document.getElementById("invoice_bottom_textarea").value;

    if(_invoice_data.customer_order_no != null)
    {
      document.getElementById("invoice_input_customer_order_no").value = _invoice_data.customer_order_no;
      document.getElementById("invoice_input_name").value = _invoice_data.name;
      document.getElementById("invoice_input_address").value = _invoice_data.address;
      document.getElementById("invoice_input_citystatezip").value = _invoice_data.citystatezip;
      document.getElementById("invoice_input_soldby").value = _invoice_data.soldby;
      document.getElementById("invoice_textarea_misc").value = _invoice_data.misc;
      document.getElementById("invoice_input_signature").value = _invoice_data.signature;
      document.getElementById("invoice_bottom_textarea_2").value = _invoice_data.bottom;
    }
    document.getElementById("invoice_textarea_specs").value = specsText;

    calculateInvoiceAmounts();
  }
}

function updateReordersWorker_Local(startIndex, endIndex)
{
  var content_rownums_changed = [];
  var content_ids_changed = [];
  for(var i = startIndex; i <= endIndex; ++i)
  {
    var qty = 0;
    var contentChanged = false;
    for(var j = 0; j < _CONTENT_EXTRA_DB_INDEXES.length; ++j)
    {
      var childPN = _content[i][_CONTENT_EXTRA_DB_INDEXES[j]];
      var partObjIndex = getExtraDBLinkIndex(j, childPN);
      if(partObjIndex != null)
      {
        var partObj = _content_extra[j][partObjIndex][0];
        qty += Number(partObj.SHOP_QTY);
      }
    }
    // var reorder = Number(_content[i][_REORD_QTY]);
    var bulk = Number(_content[i][_GET]);
    var keep = Number(_content[i][_KEEP]);
    if(bulk > 0)
    {
      if(qty < keep)
      {
        if(Number(_content[i][_REORD_QTY]) != bulk)
        {
          _content[i][_REORD_QTY] = String(bulk);
          contentChanged = true;
        }
      }
      else
      {
        if(Number(_content[i][_REORD_QTY]) != 0)
        {
          _content[i][_REORD_QTY] = "0";
          contentChanged = true;
        }
      }
    }
    else
    {
      if(qty < keep)
      {
        if(Number(_content[i][_REORD_QTY]) != keep - qty)
        {
          _content[i][_REORD_QTY] = String(keep - qty);
          contentChanged = true;
        }
      }
      else
      {
        if(Number(_content[i][_REORD_QTY]) != 0)
        {
          _content[i][_REORD_QTY] = "0";
          contentChanged = true;
        }
      }
    }
    if(contentChanged)
    {
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
function updateReordersRecursive()
{
  var data = updateReordersWorker_Local(_slice_start, _slice_end);
  // var content_ids_changed = data[0];
  var content_rownums_changed = data[1];

  for(var i = 0; i < content_rownums_changed.length; ++i)
  {
    var rownum = content_rownums_changed[i];
    if(rownum != null)
    {
      if(_numReorderChangeAlertsSent < _MAX_REORDER_CHANGEALERTS)
      {
        saveContentToDatabase(rownum, true);
        ++_numReorderChangeAlertsSent;
      }
    }
  }

  if(_slice_end < _content.length - 1)
  {
    _slice_start = _slice_end + 1;
    if(_slice_end + _sliceSize > _content.length - 1)
      _slice_end = _content.length - 1;
    else
      _slice_end += _sliceSize;
    showSnackbar("Updating reorders... " + Math.floor((_slice_end / _content.length) * 100) + "%", 10000);
    setTimeout(function(){
      updateReordersRecursive();
    }, 200);
  }
  else
  {
    _reorders_updating = false;
    document.getElementById("button_update_reorders").style.display = "";
    updateReorderParentIDs();
    if(_numReorderChangeAlertsSent < _MAX_REORDER_CHANGEALERTS)
      showSnackbar("Reorders update complete!", 3000);
    else
      showSnackbar("Reorders update complete, too many changes were made to the database, other machines running PartScouter will need to restart the program!", 10000);
  }
}

var _reorders_updating = false;
var _numReorderChangeAlertsSent = 0;
function updateReorders()
{
  _slice_start = 0;
  _slice_end = _sliceSize - 1;
  if(_content.length > 0)
  {
    _reorders_updating = true;
    document.getElementById("table_reorders_div").innerHTML = "";
    document.getElementById("button_update_reorders").style.display = "none";
    _numReorderChangeAlertsSent = 0;
    updateReordersRecursive();
  }
}



function updateReorder(rownum)
{
  var qty = 0;
  var contentChanged = false;
  for(var j = 0; j < _CONTENT_EXTRA_DB_INDEXES.length; ++j)
  {
    var childPN = _content[rownum][_CONTENT_EXTRA_DB_INDEXES[j]];
    var partObjIndex = getExtraDBLinkIndex(j, childPN);
    if(partObjIndex != null)
    {
      var partObj = _content_extra[j][partObjIndex][0];
      qty += Number(partObj.SHOP_QTY);
    }
  }
  // var reorder = Number(_content[rownum][_REORD_QTY]);
  var bulk = Number(_content[rownum][_GET]);
  var keep = Number(_content[rownum][_KEEP]);
  if(bulk > 0)
  {
    if(qty < keep)
    {
      _content[rownum][_REORD_QTY] = String(bulk);
      contentChanged = true;
    }
    else
    {
      _content[rownum][_REORD_QTY] = "0";
      contentChanged = true;
    }
  }
  else
  {
    if(qty < keep)
    {
      _content[rownum][_REORD_QTY] = String(keep - qty);
      contentChanged = true;
    }
    else
    {
      _content[rownum][_REORD_QTY] = "0";
      contentChanged = true;
    }
  }
  if(contentChanged)
  {
    saveContentToDatabase(rownum);
    updateReorderParentIDs();
  }
}

var _reorder_parent_ids = [];
function updateReorderParentIDs()
{
  if(!_reorders_updating)
  {
    _reorder_parent_ids = [];
    for(var i = 0; i < _content.length; ++i)
    {
      if(Number(_content[i][_REORD_QTY]) > 0)
      {
        _reorder_parent_ids.push(_content[i][_content[i].length - 1]);
      }
    }

    var table_html = "<table><tr><th></th>"
    + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Descrip 1</th>"
    + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Descrip 2</th>"
    + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Reord</th>"
    + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Keep</th>"
    + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Bulk</th></tr>";
    var inc = 0;
    for(var i = 0; i < _reorder_parent_ids.length; ++i)
    {
      var parent_id = _reorder_parent_ids[i];
      var rownum = getParentIndexFromID(parent_id);
      if(rownum != null)
      {
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
    if(!set_tableReorders_SelectedRow(_table_reorders_selected_row))
      set_tableReorders_SelectedRow(0);
  }
}

var _invoice_filter_date_start = -1;
var _invoice_filter_date_end = -1;
function populateInvoiceHistory()
{
  var table_html = "<table><tr>"
  + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Date</th>"
  + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Name</th>"
  + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Total</th>"
  + "<th style='background-color: white; position: sticky; top: 0; z-index: 2;'>Invoice No.</th></tr>";
  var filter_name = document.getElementById("invoice_history_filter_name").value;
  var filter_total = document.getElementById("invoice_history_filter_total").value;
  var filter_invoice_no = document.getElementById("invoice_history_filter_invoice_no").value;
  var filter_any_field = document.getElementById("invoice_history_filter_invoice_any_field").value;
  var do_filter_name = (filter_name.replace(" ", "").length > 0);
  var do_filter_total = (filter_total.replace(" ", "").length > 0);
  var do_filter_invoice_no = (filter_invoice_no.replace(" ", "").length > 0);
  var do_filter_any_field = (filter_any_field.replace(" ", "").length > 0);
  var inc = 0;
  _content_invoice_history.sort(COMPARE_OBJECT_date);
  for(var i = _content_invoice_history.length - 1; i >= 0; --i)
  {
    var invoice_obj = _content_invoice_history[i];
    var match_failed = false;
    if(!match_failed && _invoice_filter_date_start != -1)
    {
      var date = new Date(String(invoice_obj.date));
      var time = date.getTime();
      if(!isNaN(time) && (date < _invoice_filter_date_start || date >= _invoice_filter_date_end))
        match_failed = true;
    }
    if(!match_failed && do_filter_name)
    {
      var result = String(invoice_obj.name).toLowerCase().match(getRegexSafeSearchTerm(filter_name).toLowerCase());
      if(result == null)
        match_failed = true;
    }
    if(!match_failed && do_filter_total)
    {
      var result = String(invoice_obj.total).toLowerCase().match(getRegexSafeSearchTerm(filter_total).toLowerCase());
      if(result == null)
        match_failed = true;
    }
    if(!match_failed && do_filter_invoice_no)
    {
      var result = String(invoice_obj.invoice_no).toLowerCase().match(getRegexSafeSearchTerm(filter_invoice_no).toLowerCase());
      if(result == null)
        match_failed = true;
    }
    if(!match_failed && do_filter_any_field)
    {
      var any_field_match_found = false;
      for (let [key, value] of Object.entries(invoice_obj)) 
      {
        if(!any_field_match_found){
          var result = String(value).toLowerCase().match(getRegexSafeSearchTerm(filter_any_field).toLowerCase());
          if(result != null)
            any_field_match_found = true;
        }
      }
      if(!any_field_match_found)
        match_failed = true;
    }

    
    if(!match_failed)
    {
      table_html += "<tr id='invoicehistory_table_row_" + inc + "' class='clickable' onclick='viewInvoiceFromHistory(" + i + ");'>"
      + "<td>" + invoice_obj.date + "</td>"
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
  if(!set_tableInvoiceHistory_SelectedRow(_table_invoicehistory_selected_row))
    set_tableInvoiceHistory_SelectedRow(0);
}

var _current_viewed_invoice_id = null;
function viewInvoiceFromHistory(index)
{
  _current_viewed_invoice_id = _content_invoice_history[index].key;
  clearInvoicesContent();
  document.getElementById("non_invoice_content").style.display = "none";
  document.getElementById("invoice_history_internal_div").style.display = "none";
  document.getElementById("invoice_from_history_content").style.display = "";
  document.getElementById("exit_invoice_from_history_button").style.display = "";
  var _invoice_obj = _content_invoice_history[index];
  var htmlToAdd = INVOICE_PRE;
  for(var i = 0; i < _invoice_obj.invoice_parts.length; ++i)
  {
    var invoice_parts = _invoice_obj.invoice_parts[i];

    // if(i < _invoice_objs.length)
    // {
      //Add filled row
      htmlToAdd += "<tr class='in_td'><td>"
      + "<input type='text' style='width: 53px; height: 15px; text-align: right;' id='invoice_input_qty_" + i + "' value='" + getHTMLSafeText(invoice_parts[0]) + "' ></td><td>"
      + "<input type='text' style='width: 493px; height: 15px;' value='" + getHTMLSafeText(invoice_parts[1]) +"' id='invoice_input_desc_" + i + "' ></td><td>"
      + "<input type='text' style='width: 48px; height: 15px; text-align: right;' id='invoice_input_sell_" + i + "' value='" + getHTMLSafeText(invoice_parts[2]) + "' onfocus='deselectTable();' onchange='calculateInvoiceAmounts();'></td><td>"
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

  document.getElementById("invoice_from_history_content").innerHTML = htmlToAdd;

  document.getElementById("invoice_input_invoice_no").value = _invoice_obj.invoice_no;
  document.getElementById("invoice_input_date").value = _invoice_obj.date;
  document.getElementById("invoice_input_customer_order_no").value = _invoice_obj.customer_order_no;
  document.getElementById("invoice_input_name").value = _invoice_obj.name;
  document.getElementById("invoice_input_address").value = _invoice_obj.address;
  document.getElementById("invoice_input_citystatezip").value = _invoice_obj.citystatezip;
  document.getElementById("invoice_input_soldby").value = _invoice_obj.soldby;
  document.getElementById("invoice_textarea_specs").value = _invoice_obj.specs;
  document.getElementById("invoice_textarea_misc").value = _invoice_obj.misc;
  document.getElementById("invoice_input_total").value = _invoice_obj.total;
  document.getElementById("invoice_input_signature").value = _invoice_obj.signature;
  document.getElementById("invoice_bottom_textarea_2").style.display = "none";
  document.getElementById("button_finish_sale").style.display = "none";
}

function exitInvoiceFromHistory()
{
  document.getElementById("non_invoice_content").style.display = "";
  document.getElementById("invoice_history_internal_div").style.display = "";
  document.getElementById("invoice_from_history_content").style.display = "none";
  document.getElementById("exit_invoice_from_history_button").style.display = "none";
}

function exitInvoiceFromNew()
{
  if(last_selected_tab != TAB_ADD_INVOICE)
    setTab(last_selected_tab);
  else
    setTab(TAB_MAINMENU);
}

function clearInvoiceFilters()
{
  var date0 = new Date(0);
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

function exitInvoice()
{
  if(last_selected_tab != TAB_INVOICE)
    setTab(last_selected_tab);
  else
    setTab(TAB_MAINMENU);
}

function populateAddNewInvoice()
{
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
