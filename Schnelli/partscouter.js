//Debug Time Profiling
// var time1 = (new Date()).getTime();
// var time2 = (new Date()).getTime();
// console.log(time2 - time1);

// const _DATABASE_PREFIX = _DATABASE_PREFIX__; //TODO Set this back to "" when uploading to github
const _DATABASE_PREFIX = "";
// const _DEBUG_LOCAL_MODE = _DEBUG_LOCAL_MODE__;
const _DEBUG_LOCAL_MODE = false;
// const _DEBUG_SKIP_PART_LOADING = _DEBUG_SKIP_PART_LOADING__;
const _DEBUG_SKIP_PART_LOADING_ = false;

if (_DEBUG_LOCAL_MODE) {
  document.getElementById("local_mode_indicator").innerHTML = "Local Mode ON";
}

var _SESSION_ID = -1;
var _admin_uid = "";
var _admin_email = "";
var _admin_password = "";
var FILTER_TIME_START = 631180800000; //Jan 1 1990
var PROFILING_STARTTIME = 0;
var PROFILING_ENDTIME = 0;

var _overlay_window_open = false;
const _INDEX_ORDER = [20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 76, 77, 78, 79, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 0];
const _INDEXES = ["RECORD_NUMBER", "DESCRIP1", "DESCRIP2", "COMMENTS", "EQUIP_TYPE", "EQUIP_DSGN", "APPL_BRAND", "APPL_MFR", "PART_TYPE", "B_PN", "CHLX_PN", "F_PN", "GEM_PN", "RS_PN", "MM_PN", "JS_PN", "K_PN", "L_PN", "M_PN", "N_PN", "OEM_PN", "PART_NUMBR", "Q_PN", "SOURCE", "UNIT", "KEEP", "REORD_QTY", "GET", "PICKED", "TAG", "FROM", "CGS", "DATE", "FRT_IN", "QUESTIONS", "MODIFIED", "NEW", "NEWER", "LOCATION", "SPECMETHOD", "SPEC01NAME", "SPEC01HINT", "SPEC01DATA", "SPEC02NAME", "SPEC02HINT", "SPEC02DATA", "SPEC03NAME", "SPEC03HINT", "SPEC03DATA", "SPEC04NAME", "SPEC04HINT", "SPEC04DATA", "SPEC05NAME", "SPEC05HINT", "SPEC05DATA", "SPEC06NAME", "SPEC06HINT", "SPEC06DATA", "SPEC07NAME", "SPEC07HINT", "SPEC07DATA", "SPEC08NAME", "SPEC08HINT", "SPEC08DATA", "SPEC09NAME", "SPEC09HINT", "SPEC09DATA", "SPEC10NAME", "SPEC10HINT", "SPEC10DATA", "SPEC11NAME", "SPEC11HINT", "SPEC11DATA", "SPEC12NAME", "SPEC12HINT", "SPEC12DATA"];
const _INDEX_WIDTHS = ["initial", "200px", "200px", "400px", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "400px", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial", "initial"];
const _MEMO_INDEXES = ["LOOK_UP_PN", "ADVICE", "ATTN", "MODEL"]; //76, 77, 78, 79 LOCATION = 38
const _MEMO_INDEX_WIDTHS = ["400px", "400px", "400px", "400px"];
const _WORDS_TO_IGNORE = ["the", "at", "there", "some", "my", "of", "be", "use", "her", "than", "and", "this", "an", "would", "a", "have", "each", "make", "to", "from", "which", "like", "been", "in", "or", "she", "him", "call", "is", "one", "do", "into", "who", "you", "had", "how", "time", "that", "by", "their", "has", "its", "it", "word", "if", "look", "now", "he", "but", "will", "two", "find", "was", "not", "up", "more", "for", "what", "down", "on", "all", "about", "go", "day", "are", "were", "out", "see", "did", "as", "we", "get", "with", "when", "then", "no", "come", "his", "your", "them", "way", "made", "they", "can", "these", "could", "may", "i", "said", "so"];
const _EXTRA_DB_FIELDS = /*B_DNI*/[["PN", "AKA", "PART_NUMBR", "COMMON_PN", "DESCRIP1", "COMMENTS", "PART_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT", "POST_APPND"]
                       /*CHLX*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "PART_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*DNI*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "APPL_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "COMMON_PN", "CGS", "FROM", "DATE", "OEM_PN2", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT", "POST_APPND"]
                       /*F*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "PART_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*GEM*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "GEM_ID", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*H_RS*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "RS_ID", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*I_MM*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "MM_ID", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*JS*/, ["PN", "JS_LINE_PN", "PART_NUMBR", "DESCRIP1", "COMMENTS", "JS_LINE", "JS_ID", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*OEM*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "APPL_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "COMMON_PN", "CGS", "FROM", "DATE", "OEM_PN2", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT", "POST_APPND"]];
const _AKA_GLOBAL = 1;
const _EXTRA_DB = ["B_DNI", "CHLX", "DNI", "F", "GEM", "H_RS", "I_MM", "JS", "OEM"];
const _EXTRA_DB_OEM = _EXTRA_DB.indexOf("OEM");
const _EXTRA_DB_ACTUAL_INDEXES = ["B_PN", "CHLX_PN", "Q_PN", "F_PN", "GEM_PN", "RS_PN", "MM_PN", "JS_PN", "OEM_PN"];
const _EXTRA_DB_COMMENTS_PREFIXES = ["B", "C", "D", "F", "G", "H", "I", "J", "O"];
const _CONTENT_EXTRA_DB_INDEXES = [9, 10, 22, 11, 12, 13, 14, 15, 20];

const RECORD_VIEW_DB_HEADER_WIDTH = "150px";
const RECORD_VIEW_HEADERS_PAGE1_0 = ["MFR", "PART#", "S", "LOC", "T1", "T2", "U", "VEND", "DATE", "CGS", "RETAIL", "COMMENT"];
const RECORD_VIEW_HEADERS_WIDTHS_PAGE1_0 = ["100px", "300px", "70px", "100px", "70px", "70px", "70px", "100px", "200px", "100px", "100px", "50px"];
const RECORD_VIEW_HEADERS_PAGE1_1 = ["SELL"];
const RECORD_VIEW_HEADERS_WIDTHS_PAGE1_1 = ["100px"];
const RECORD_VIEW_HEADERS_PAGE2_0 = ["MFR", "PART#", "AKA", "MFR", "DATE", "CGS", "SUGG", "FIXED", "COMMENT"];
const RECORD_VIEW_HEADERS_WIDTHS_PAGE2_0 = ["100px", "300px", "70px", "100px", "70px", "70px", "70px", "100px", "100px"];
const RECORD_VIEW_HEADERS_PAGE2_1 = ["SELL"];
const RECORD_VIEW_HEADERS_WIDTHS_PAGE2_1 = ["200px"];

const RECORD_VIEW_HEADERS_PAGE1_CONCAT = RECORD_VIEW_HEADERS_PAGE1_0.concat(RECORD_VIEW_HEADERS_PAGE1_1);
const RECORD_VIEW_HEADERS_PAGE2_CONCAT = RECORD_VIEW_HEADERS_PAGE2_0.concat(RECORD_VIEW_HEADERS_PAGE2_1);

// var RECORD_VIEW_HEADERS_ACTUAL_INDEXES = [["PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"], ["PN"],  ["SHOP_QTY"], ["LOCATION"], ["TRK1_QTY"], ["TRK2_QTY"], ["USED_QTY"],  ["FROM"], ["DATE"], ["CGS"], ["VEND_RET"], ["SELL"]];
const RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0 = [
  ["PART_MFR", "PART_MFR", "APPL_MFR", "PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"],
  ["PN", "PN", "PN", "PN", "PN", "PN", "PN", "PN", "PN"],
  ["SHOP_QTY", "SHOP_QTY", "SHOP_QTY", "SHOP_QTY", "SHOP_QTY", "SHOP_QTY", "SHOP_QTY", "SHOP_QTY", "SHOP_QTY"],
  ["LOCATION", "LOCATION", "LOCATION", "LOCATION", "LOCATION", "LOCATION", "LOCATION", "LOCATION", "LOCATION"],
  ["TRK1_QTY", "TRK1_QTY", "TRK1_QTY", "TRK1_QTY", "TRK1_QTY", "TRK1_QTY", "TRK1_QTY", "TRK1_QTY", "TRK1_QTY"],
  ["TRK2_QTY", "TRK2_QTY", "TRK2_QTY", "TRK2_QTY", "TRK2_QTY", "TRK2_QTY", "TRK2_QTY", "TRK2_QTY", "TRK2_QTY"],
  ["USED_QTY", "USED_QTY", "USED_QTY", "USED_QTY", "USED_QTY", "USED_QTY", "USED_QTY", "USED_QTY", "USED_QTY"],
  ["FROM", "FROM", "FROM", "FROM", "FROM", "FROM", "FROM", "FROM", "FROM"],
  ["DATE", "DATE", "DATE", "DATE", "DATE", "DATE", "DATE", "DATE", "DATE"],
  ["CGS", "CGS", "CGS", "CGS", "CGS", "CGS", "CGS", "CGS", "CGS"],
  ["VEND_RET", "VEND_RET", "VEND_RET", "VEND_RET", "VEND_RET", "VEND_RET", "VEND_RET", "VEND_RET", "VEND_RET"],
  ["COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS"]
];

const RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_1 = [
  ["SELL", "SELL", "SELL", "SELL", "SELL", "SELL", "SELL", "SELL", "SELL"]
];

const RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_CONCAT = RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_0.concat(RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE1_1);

const RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_0 = [
  ["PART_MFR", "PART_MFR", "APPL_MFR", "PART_MFR", "GEM_ID", "RS_ID", "MM_ID", "JS_ID", "APPL_MFR"],
  ["PN", "PN", "PN", "PN", "PN", "PN", "PN", "PN", "PN"],
  ["AKA", "AKA", "AKA", "AKA", "AKA", "AKA", "AKA", "JS_LINE_PN", "AKA"],
  ["REG_FROM", "REG_FROM", "REG_FROM", "REG_FROM", "REG_FROM", "REG_FROM", "REG_FROM", "REG_FROM", "REG_FROM"],
  ["REG_DATE", "REG_DATE", "REG_DATE", "REG_DATE", "REG_DATE", "REG_DATE", "REG_DATE", "REG_DATE", "REG_DATE"],
  ["REG", "REG", "REG", "REG", "REG", "REG", "REG", "REG", "REG"],
  ["SUGG", "SUGG", "SUGG", "SUGG", "SUGG", "SUGG", "SUGG", "SUGG", "SUGG"],
  ["FIXED", "FIXED", "FIXED", "FIXED", "FIXED", "FIXED", "FIXED", "FIXED", "FIXED"], //?
  ["COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS", "COMMENTS"]
];
const RECORD_VIEW_HEADERS_ACTUAL_INDEXES_PAGE2_1 = [
  ["SELL", "SELL", "SELL", "SELL", "SELL", "SELL", "SELL", "SELL", "SELL"]
];

const _RECORD_NUMBER = 0;
const _DESCRIP1 = 1;
const _DESCRIP2 = 2;
const _COMMENTS = 3;
const _EQUIP_TYPE = 4;
const _EQUIP_DESIGN = 5;
const _APPL_BRAND = 6;
const _OEM_PN = 20;
const _PART_NUMBR = 21;
const _SOURCE = 23;
const _KEEP = 25;
const _REORD_QTY = 26;
const _GET = 27;
const _FROM = 30;
const _QUESTIONS = 34;
const _MODIFIED = 35;
const _NEW = 36;
const _NEWER = 37;
const _LOCATION = 38;
const _SPECMETHOD = 39;
const _SPEC01DATA = 42;
const _SPEC02DATA = 45;
const _SPEC03DATA = 48;
const _SPEC04DATA = 51;
const _SPEC05DATA = 54;
const _SPEC06DATA = 57;
const _SPEC07DATA = 60;
const _SPEC08DATA = 63;
const _SPEC09DATA = 66;
const _SPEC10DATA = 69;
const _SPEC11DATA = 72;
const _SPEC12DATA = 75;
const _LOOK_UP_PN = 76;
const _ADVICE = 77;
const _ATTN = 78;
const _MODEL = 79;
const _SPEC_DATA_INDEXES = [_SPEC01DATA, _SPEC02DATA, _SPEC03DATA, _SPEC04DATA, _SPEC05DATA, _SPEC06DATA, _SPEC07DATA, _SPEC08DATA, _SPEC09DATA, _SPEC10DATA, _SPEC11DATA, _SPEC12DATA];

const _ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var _content = null;
var _content_standard = null;
var _content_invoice_history = null;

var _content_extra = null;
// var _indexToContentID;
var _contentSortedIndexes = [0];
var _contentSortedReverse = false;
const _sortedIndexBGColor = "#70A2FF"; //Light blue
const _sortedIndexBGColorReverse = "#FF7070"; //Salmon
const _selectedRowColor = "#96BBFF"; //Light blue
const _selectedCellColor = "#70A2FF"; //Slightly Less Light blue
const _tempTopRowColor = "#A0FF77"; //Light green

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

function showContentDiv() {
  document.getElementById("content_div").style.display = "block";
  if (_LOCAL_SERVER_MODE)
    document.getElementById("database_identifier").innerHTML = "Server: <b>Local</b> <span style='color: lightgray;'>Google Firebase</span>";
  else
    document.getElementById("database_identifier").innerHTML = "Server: <span style='color: lightgray;'>Local</span> <b>Google Firebase</b>";
}

function initialLoadingFinished() //Called after all parts are downloaded and processed
{
  sortContentByIndex(_OEM_PN);

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

  document.getElementById("sync_db_div").style.display = "none";
  document.getElementById("main_loader").style.display = "none";
  document.getElementById("main_loading_text").style.display = "none";
  showContentDiv();
  setTab(TAB_MAINMENU);
  setKeyboardShortcutBar();
  if (_intent_people && _current_employee != null && _current_employee.admin) {
    setTab(TAB_PEOPLE);
  }
  if (_newClient_for_info != null) {
    viewInfo(null, _newClient_for_info);
    _newClient_for_info = null;
  }
}

$(function () {
  $('input[name=invoice_history_filter_time]').daterangepicker({
    // timePicker: true,
    // singleDatePicker: true,
    showDropdowns: true,
    startDate: new Date(FILTER_TIME_START),
    endDate: new Date(),
    // startDate: moment().startOf('hour'),
    locale: {
      format: 'MM/DD/YYYY'
    }
  }, function (start, end, label) {
    _invoice_filter_date_start = start;
    _invoice_filter_date_end = end;
    populateInvoiceHistory();
    // console.log("Date Picker|" + start + "|" + end + "|"); //Start and end are milliseconds, start is time at start of day and end is end of day
    // var date1 = new Date("08 / 31 / 2020");
    // console.log("Date|" + date1.getTime());
  });
});

$(function () {
  $('input[name=part_history_filter_time]').daterangepicker({
    showDropdowns: true,
    startDate: new Date(FILTER_TIME_START),
    endDate: new Date(),
    locale: {
      format: 'MM/DD/YYYY'
    }
  }, function (start, end, label) {
    _part_filter_date_start = start;
    _part_filter_date_end = end;
    populatePartHistory();
  });
});

//Initial Generation--------------------------------------------------------------------------------
for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
  _searchstring_specific_history.push(new Array());
  _searchstring_specific_history_index.push(0);
}

var htmlToAdd = "";
var i3 = 0;
for (var i = 0; i < _EXTRA_DB.length; ++i) {
  htmlToAdd += "<span style='position: absolute; left: " + (50 + (i % 5) * 250) + "px; font-size: 18px;'>" + _EXTRA_DB[i] + "</span>";
  if (((i + 1) % 5 == 0 && i != 0) || i == _EXTRA_DB.length - 1) {
    htmlToAdd += "<br>";
    for (var i2 = 0; i2 < 5 && i3 < _EXTRA_DB.length; ++i2) {
      htmlToAdd += "<div style='position: absolute; left: " + (50 + i2 * 250) + "px;'><input id='search_partnum_input_" + i3 + "' type='text' style='width: 230px;' onfocus='deselectTable();' onkeyup='search_partnum_input_keyup_event(event, " + i3 + ");' onkeydown='search_partnum_input_keydown_event(event);'>" +
        "<div id='search_partnum_autocomplete_" + i3 + "' style='position: absolute;'></div></div>";
      ++i3;
    }
    htmlToAdd += "<br><br>";
  }
}
document.getElementById("search_partnum_db_inputs_div").innerHTML = htmlToAdd;

for (var i = 0; i < INDEXES_CONCAT.length; ++i) {
  var order_id = _INDEX_ORDER[i];
  if (i <= 9) {
    checkboxHTML += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 20) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\" disabled><span class='checkmark' style='display: none;'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if ((i + 1) % 5 == 0 && i != 0) {
      checkboxHTML += "<br><br>";
      for (var j = 0; j < 5; ++j) {
        var i2 = (i - 4) + j;
        var order_id2 = _INDEX_ORDER[i2];
        checkboxHTML += "<div style='position:absolute; left:" + ((i2 % 5) * 250 + 50) + "px;'><input id='search_input_" + order_id2 + "' type='text' style='width: 230px;' onfocus='deselectTable(" + order_id2 + ");' onfocusout='onSearchInputFocusOut();' onchange='onSearchInputChanged(" + order_id2 + ")'><div id='search_autocomplete_" + order_id2 + "'></div></div>";
      }
      if (i == 4)
        checkboxHTML += "<button id='search_specific_button' style='display: inline; width: 100px; position:absolute; left:" + ((i + 1) * 250 + 50) + "px;' onclick='search_query();'>Go</button>";
      checkboxHTML += "<br><br><br>";
    }
    if (i == 9) {
      checkboxHTML += "<button onclick='show_more_column_checkboxes(true);' id=\"show_more_column_checkboxes\" style='position:absolute; left: 50px; width: 200px;'>More</button>";
    }
  }
  else {
    if (_SPEC_DATA_INDEXES.includes(order_id)) {
      checkboxHTML_More += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 20) + "px;'>" + INDEXES_CONCAT[order_id] + "<br>Accepts Range (E.G. 1/2-50)<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\" disabled><span class='checkmark' style='display: none;'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
    else
      checkboxHTML_More += "<label class='checkBox_container' style='display: inline; font-size: 18px; position:absolute; left:" + ((i % 5) * 250 + 20) + "px;'>" + INDEXES_CONCAT[order_id] + "<input type='checkbox' tabindex='-1' id=\"column_checkbox_" + order_id + "\" disabled><span class='checkmark' style='display: none;'></span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    if ((i + 1) % 5 == 0 && i != 0) {
      checkboxHTML_More += "<br><br>";
      for (var j = 0; j < 5; ++j) {
        var i2 = (i - 4) + j;
        var order_id2 = _INDEX_ORDER[i2];
        checkboxHTML_More += "<div style='position:absolute; left:" + ((i2 % 5) * 250 + 50) + "px;'><input id='search_input_" + order_id2 + "' type='text' style='width: 230px;' onfocus='deselectTable(" + order_id2 + ");' onfocusout='onSearchInputFocusOut();' onchange='onSearchInputChanged(" + order_id2 + ")'><div id='search_autocomplete_" + order_id2 + "'></div></div>";
      }
      checkboxHTML_More += "<br><br><br>";
    }
    if (i == INDEXES_CONCAT.length - 1) {
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
for (var i = 0; i < _EXTRA_DB.length; ++i) {
  partChildDropDownHTML += "<option value='" + _EXTRA_DB[0] + "'>" + _EXTRA_DB[i] + "</option>";
}
partChildDropDownHTML += "<option value='" + _EXTRA_DB[0] + "'>--All--</option>";
partChildDropDownHTML += "</select>";
document.getElementById("part_child_dropdown_div").innerHTML = partChildDropDownHTML;
setNewPartChildButton();
//              PART_MFR PART_MFR PART_MFR GEM_ID RS_ID   MM_ID   JS_ID  APPL_MFR

//END Initial Generation--------------------------------------------------------------------------------

var _suggestions_ref = null;
function setSuggestionsRef() {
  if (_suggestions_ref == null) {
    _suggestions_ref = firebase.database().ref('part_suggestions');
    _suggestions_ref.on('value', (snapshot) => {
      if (_FIREBASE_LOGGED_IN && firebase.auth().currentUser.uid == _admin_uid) {
        _part_suggestions = snapshot.val();
        updateSuggestionsBox();
      }
    });
  } else {
    if (_FIREBASE_LOGGED_IN && firebase.auth().currentUser.uid == _admin_uid) {
      readFromDB('part_suggestions', function (val0, key0) {
        _part_suggestions = val0;
        updateSuggestionsBox();
      }, _OVERRIDE_FIREBASE);
    }
  }
}

var _data_ref = null;
var _downloaded_clients = null;
var _downloaded_blacklist = null;
function setDataRef() {
  if (_data_ref != null)
    _data_ref.off();
  _data_ref = firebase.database().ref('data');
  _data_ref.on('value', (snapshot) => {
    if (_FIREBASE_LOGGED_IN && firebase.auth().currentUser.uid == _admin_uid) {
      var val0 = snapshot.val();
      _downloaded_clients = val0.clients;
      _downloaded_blacklist = val0.blacklisted_clients;
      updateClientsTable();
    }
  });
}

function openFirebaseServerScreen() {
  _LOCAL_SERVER_MODE = false;
  if (_FIREBASE_LOGGED_IN) {
    document.getElementById("server_select_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("local_server_connect_div").style.display = "none";
    loadContentDiv1();
    setKeyboardShortcutBar();
  } else {
    document.getElementById("server_select_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("local_server_connect_div").style.display = "none";
    document.getElementById("email_input").focus();
  }
}

function exitFirebaseServerScreen() {
  document.getElementById("server_select_div").style.display = "block";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
}

function exitEmployeeIDScreen() {
  document.getElementById("server_select_div").style.display = "block";
  document.getElementById("employee_id_div").style.display = "none";
}

function clearData() {
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
  if (_CHILD_PART_LINKS_CACHE != null)
    _CHILD_PART_LINKS_CACHE.clear();
  _CHANGE_ALERTS_CACHE = [];

  _google_cse_api_key = "";
  _google_cse_api_key_loaded = false;
  if (_DBID_to_ContentIndex_Cache != null)
    _DBID_to_ContentIndex_Cache.clear();
  for (var i = 0; i < _EXTRA_DB.length; ++i)
    if (_extradb_link_index_cache[i] != null)
      _extradb_link_index_cache[i].clear();

  _part_history_content_extra_objs = [];
  removeListeners();
}

var _FIREBASE_LOGGED_IN = false;
function log_out(soft, func) {
  _current_employee = null;
  if (soft == null)
    soft = false;
  if (!soft) {
    firebase.auth().signOut().then(function () {
      if (func != null)
        func();
    }).catch(function (error) {
      showSnackbar(error.message, 5000);
    });
  }
  closeWebSocket();
  setDivsOnLogOut();
  clearData();
  setKeyboardShortcutBar();
}

function setDivsOnLogOut() {
  document.getElementById("server_select_div").style.display = "block";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
  document.getElementById("employee_id_div").style.display = "none";
  document.getElementById("part_child_record_manager").style.display = "none";
  document.getElementById("sort_order_div").style.display = "none";
  document.getElementById("sync_db_div").style.display = "none";
  document.getElementById("content_div").style.display = "none";
  document.getElementById("search_div").style.display = "none";
}

var _current_email = "";
var _current_password = "";
function log_in(soft) {
  if (soft == null)
    soft = false;
  // _LOCAL_SERVER_MODE = false;
  document.getElementById("server_select_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";

  _current_email = document.getElementById("email_input").value;
  _current_password = document.getElementById("password_input").value;

  var persistenceVar;
  if (document.getElementById("remember_input").checked)
    persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
  else
    persistenceVar = firebase.auth.Auth.Persistence.NONE;

  if (soft && _FIREBASE_LOGGED_IN) {
    loadContentDiv1();
    setKeyboardShortcutBar();
  } else {
    firebase.auth().setPersistence(persistenceVar).then(function () {
      return firebase.auth().signInWithEmailAndPassword(_current_email, _current_password).then(function () {
        _FIREBASE_LOGGED_IN = true;
        loadContentDiv1();
        setKeyboardShortcutBar();
      }).catch(function (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("login error " + errorMessage);
        showSnackbar(errorMessage, 10000);
        document.getElementById("server_select_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        document.getElementById("local_server_connect_div").style.display = "none";
      });
    }).catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("persistence error " + errorMessage);
      showSnackbar(errorMessage, 10000);
      document.getElementById("server_select_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";
      document.getElementById("local_server_connect_div").style.display = "none";
    });
  }
}

function fetchJSONRecursive(index) {
  if (index < _EXTRA_DB.length) {
    fetchJSONFile("../Other/csv/" + _EXTRA_DB[index] + ".json", function (data) {
      processJSONDataExtra(data, index);
      fetchJSONRecursive(index + 1);
    });
  }
  else {
    fetchJSONFile('../Other/final.json', function (data) {
      processJSONData(data);
    });
  }
}

var _extraDBLoadedIndex = -1;
var _downloaded_employee_ids = null;
var _current_employee = null;
var _firstEmployeeIDListener = true;
function loadContentDiv1() {
  readFromDB('open_data/admin_uid', function (val0, key0) {
    if (!_LOCAL_SERVER_MODE)
      _admin_uid = val0;
    if (!_LOCAL_SERVER_MODE && firebase.auth().currentUser.uid != _admin_uid) { //A subscribed client is signing in
      readFromDB('data/blacklisted_clients', function (val0, key0) {
        if (!doesOBJContainKey(val0, firebase.auth().currentUser.uid))
          loadContentDiv2();
        else {
          log_out();
          showSnackbar("Your account has been blacklisted, contact ays-glenwood@comcast.net for more info", 7000);
        }
      }, _OVERRIDE_FIREBASE);
    }
    else {
      document.getElementById("employee_id_div").style.display = "block";
      _downloaded_employee_ids = null;
      document.getElementById("employe_id_loading").style.display = "block";
      document.getElementById("employe_id_non_loading").style.display = "none";
      _firstEmployeeIDListener = true;
      removeListeners();
      addDBListener('data/employeeids', function (val0, key0) {
        _downloaded_employee_ids = val0;
        updateEmployeeIDsTable();
        if (_firstEmployeeIDListener) {
          _firstEmployeeIDListener = false;
          document.getElementById("employe_id_loading").style.display = "none";
          document.getElementById("employe_id_non_loading").style.display = "block";
          document.getElementById("employee_id").value = "";
          document.getElementById("employee_id").focus();
        }
      });
    }
  });
}

var _subscribed_mode = false;
function loadContentDiv2() {
  _subscribed_mode = false;
  if (!_LOCAL_SERVER_MODE && firebase.auth().currentUser.uid != _admin_uid) {
    _subscribed_mode = true;
  }

  if (!_subscribed_mode) {
    var id = document.getElementById("employee_id").value;
    _current_employee = null;
    if (_downloaded_employee_ids != null)
      for (let [key, val] of Object.entries(_downloaded_employee_ids)) {
        if (val.id == id) {
          _current_employee = val;
          break;
        }
      }
  }

  if (_subscribed_mode || _current_employee != null) {
    var length = TAB_MAINMENU_DIVS.length;
    if (_subscribed_mode) {
      document.getElementById("updater_link_web").style.display = "none";
      document.getElementById("updater_link_local").style.display = "none";
      document.getElementById("part_child_button_new").style.opacity = "0";
      document.getElementById("part_child_button_new").disabled = true;
      document.getElementById("part_child_button_new").style.cursor = "default";

      document.getElementById("button_add_sort_order").style.opacity = "0";
      document.getElementById("button_add_sort_order").disabled = true;
      document.getElementById("button_add_sort_order").style.cursor = "default";

      document.getElementById("TAB_people").style.display = "none";
      document.getElementById("TAB_part_history").style.display = "none";
      document.getElementById("TAB_fileinput").style.display = "none";
      document.getElementById("TAB_reorders").style.display = "none";
      document.getElementById("TAB_invoice_history").style.display = "none";
      document.getElementById("TAB_invoice_settings").style.display = "none";
      document.getElementById("TAB_invoice").style.display = "none";
      document.getElementById("TAB_add_invoice").style.display = "none";
      document.getElementById("button_sync_databases").style.display = "none";

      var shortcuts_html = '<table style="margin: auto; font-size: 30px; border: solid 30px #70A2FF;">';
      var cellsAdded = 0;
      for (var i = 0; i < length; ++i)
        if (TAB_MAINMENU_DIVS[i] != "" && i != TAB_PEOPLE && i != TAB_PART_HISTORY && i != TAB_PDF_IMPORT && i != TAB_REORDERS && i != TAB_INVOICE_HISTORY && i != TAB_INVOICE_SETTINGS && i != TAB_INVOICE && i != TAB_ADD_INVOICE) {
          if (cellsAdded == 0)
            shortcuts_html += "<tr>";
          shortcuts_html += '<td style="background-color: #70A2FF; border: 0px;">' + TAB_MAINMENU_DIVS[i] + "</td>";
          ++cellsAdded;
          if (cellsAdded == 2) {
            cellsAdded = 0;
            shortcuts_html += "</tr>";
          }
        }
      if (cellsAdded != 0)
        shortcuts_html += '<td style="background-color: #70A2FF; border: 0px;"></td></tr>';
      shortcuts_html += "</table>";
      document.getElementById("mainmenu_shortcut_table").innerHTML = shortcuts_html;

    } else {
      document.getElementById("updater_link_web").style.display = "";
      document.getElementById("updater_link_local").style.display = "";
      document.getElementById("part_child_button_new").style.opacity = "1";
      document.getElementById("part_child_button_new").disabled = false;
      document.getElementById("part_child_button_new").style.cursor = "";
      
      document.getElementById("button_add_sort_order").style.opacity = "1";
      document.getElementById("button_add_sort_order").disabled = false;
      document.getElementById("button_add_sort_order").style.cursor = "";

      document.getElementById("TAB_people").style.display = "";
      document.getElementById("TAB_part_history").style.display = "";
      document.getElementById("TAB_fileinput").style.display = "";
      document.getElementById("TAB_reorders").style.display = "";
      document.getElementById("TAB_invoice_history").style.display = "";
      document.getElementById("TAB_invoice_settings").style.display = "";
      document.getElementById("TAB_invoice").style.display = "";
      document.getElementById("TAB_add_invoice").style.display = "";
      document.getElementById("button_sync_databases").style.display = "";
      if (_current_employee.admin)
        document.getElementById("TAB_people").style.display = "";
      else
        document.getElementById("TAB_people").style.display = "none";

      var shortcuts_html = '<table style="margin: auto; font-size: 30px; border: solid 30px #70A2FF;">';
      var cellsAdded = 0;
      for (var i = 0; i < length; ++i)
        if (TAB_MAINMENU_DIVS[i] != "") {
          if (cellsAdded == 0)
            shortcuts_html += "<tr>";
          shortcuts_html += '<td style="background-color: #70A2FF; border: 0px;">' + TAB_MAINMENU_DIVS[i] + "</td>";
          ++cellsAdded;
          if (cellsAdded == 2) {
            cellsAdded = 0;
            shortcuts_html += "</tr>";
          }
        }
      if (cellsAdded != 0)
        shortcuts_html += '<td style="background-color: #70A2FF; border: 0px;"></td></tr>';
      shortcuts_html += "</table>";
      document.getElementById("mainmenu_shortcut_table").innerHTML = shortcuts_html;
    }
    document.getElementById("employee_id_div").style.display = "none";
    document.getElementById("password_input").value = "";
    showSnackbar("Downloading parts from database... This may take up to 60 seconds", 10000);
    document.getElementById("main_loader").style.display = "block";
    document.getElementById("main_loading_text").style.display = "block";
    // document.getElementById("message").innerHTML = "<p>Downloading parts from database... This may take up to 60 seconds</p>";
    document.getElementById("record_browser_div").style.display = "none";

    //   $.ajax({
    //     type: "GET",
    //     url: "ascii_test.txt",
    //     dataType: "text",
    //     success: function(data) {processCSVData(data);}
    //  });

    if (_DEBUG_LOCAL_MODE) {
      // document.getElementById("fileinput_div").innerHTML = "<input id='fileinput_json' type='file' style='width: 500px; height: 200px;'></input><br>";
      // document.getElementById('fileinput_json').addEventListener('change', readSingleFile_json, false);
      fetchJSONRecursive(0);
    }
    else {
      _extraDBLoadedIndex = -1;
      document.getElementById("main_loading_text").innerHTML = "Downloading Part Child Database...";
      var bogus_dir = "";
      if (_DEBUG_SKIP_PART_LOADING)
        bogus_dir = "dir2/";
      for (var i = 0; i < _EXTRA_DB.length; ++i) {
        readFromDB("parts_db/" + bogus_dir + _EXTRA_DB[i], function (val0, key0) {
          var objs = [];
          var keys = [];
          for (let [key, val] of Object.entries(val0)) {
            objs.push(val);
            keys.push(key);
            // childSnapshot = null; //Helps to prevent "Out of memory" errors?
          }
          processJSONDataExtra(objs, _EXTRA_DB.indexOf(key0), keys);
          ++_extraDBLoadedIndex;
          document.getElementById("main_loading_text").innerHTML = "Downloading Part Child Database... " + (_extraDBLoadedIndex + 1) + "/" + _EXTRA_DB.length;
          if (_extraDBLoadedIndex == _EXTRA_DB.length - 1) //Load big P&A_PRI after extra Databases loaded
          {
            // var partsRef = firebase.database().ref(_DATABASE_PREFIX + 'parts_db/P&A_PRI').orderByChild('RECORD_NUMBER');
            document.getElementById("main_loading_text").innerHTML = "Downloading P&A_PRI Database... ";
            readFromDB("parts_db/" + bogus_dir + "P&A_PRI", function (val0, key0) {
              showSnackbar("Processing parts...", 3000);
              // document.getElementById("message").innerHTML = "<p>Processing parts...</p>";

              // var numChildren = snapshot.numChildren();
              _content = [];

              var numRecords = 0;
              for (let [key, val] of Object.entries(val0)) {
                var content_line = [];
                //indexToContentID[numRecords] = childSnapshot.key;
                for (var i0 = 0; i0 < _INDEXES.length; ++i0)
                  content_line.push(String(val[_INDEXES[i0]]));
                for (var i0 = 0; i0 < _MEMO_INDEXES.length; ++i0) {
                  var memolines = val[_MEMO_INDEXES[i0]];
                  for (var j = 0; j < memolines.length; ++j)
                    memolines[j] = String(memolines[j]);
                  content_line.push(memolines);
                }
                content_line.push(key);
                // document.getElementById("loading_parts").innerHTML = "<p>Processing parts...  " + (numRecords / numChildren) + "%</p>";
                _content.push(content_line);
                ++numRecords;
                // childSnapshot = null; //Helps to prevent "Out of memory" errors?
              }
              if (_LOCAL_SERVER_MODE || _FIREBASE_LOGGED_IN) { //Ensures that loading cancels if user is logged out from another login elsewhere
                generateContent_Standard();
                populateRecordBrowser(0, false);
                _contentSortedReverse = true;
                loadChangeAlerts();
                initialLoadingFinished();
              }
            });
          }
        });
      }
    }

    addDBListener('sort_orders', function (val0, key0) {
      var sortOrders = [];
      for (let [key, val] of Object.entries(val0)) {
        var sortObj = val;
        sortObj.key = key;
        sortOrders.push(sortObj);
      }
      _sort_orders = sortOrders;
      populateSortOrders();
    });

    addDBListener('invoice', function (val0, key0) {
      for (let [key, val] of Object.entries(val0)) {
        if (key == "address") {
          document.getElementById("invoice_address_textarea").value = val;
        }
        else if (key == "bottom") {
          document.getElementById("invoice_bottom_textarea").value = val;
        }
        else if (key == "last_invoice_no") {
          document.getElementById("invoice_last_invoice_no_input").value = val;
          var ele = document.getElementById("invoice_input_invoice_no");
          if (ele != null)
            ele.value = val;
        }
      }
    });

    if (!_LOCAL_SERVER_MODE && firebase.auth().currentUser.uid != _admin_uid) {
      readFromDB('open_data/session_id', function (val0, key0) {
        _SESSION_ID = val0;
        writeToDB('open_data/session_id', _SESSION_ID + 1, function () {
          writeToDB('open_data/session_ids/' + firebase.auth().currentUser.uid, _SESSION_ID, function () {
            addDBListener('open_data/session_ids', function (val0, key0) { //Check if someone else logged on with same uid, and if so their sessionid will no longer match this one
              for (let [key, val] of Object.entries(val0)) {
                if (key == firebase.auth().currentUser.uid && val != _SESSION_ID) {
                  log_out();
                }
              }
            }, _OVERRIDE_FIREBASE);
          }, _OVERRIDE_FIREBASE);
        }, _OVERRIDE_FIREBASE);
      }, _OVERRIDE_FIREBASE);
    }

    readFromDB("google_cse_api/key", function (val0, key0) {
      _google_cse_api_key = val0;
      _google_cse_api_key_loaded = true;
    });

    retrieveInvoiceDataFromDatabase(null);
  }
  else {
    showSnackbar("Employee ID does not exist", 5000);
  }
}

function processJSONData(objs) {
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
    else {
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

function localServerIPKeyUp(event) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    document.getElementById("button_server_local_connect").click();
  }
}

function exitTempLogin() {
  document.getElementById("firebase_temp_login_div").style.display = "none";
  document.getElementById("content_div").style.display = "";
  _current_login_temp_intent = -1;
}

var _current_login_temp_intent = -1;
function log_in_temp() {
  document.getElementById("login_temp_loader").style.display = "block";
  document.getElementById("email_input_temp").disabled = true;
  document.getElementById("password_input_temp").disabled = true;

  firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input_temp").value, document.getElementById("password_input_temp").value).then(function () {
    readFromDB('open_data/admin_uid', function (val0, key0) {
      _admin_uid = val0;
      _FIREBASE_LOGGED_IN = true; //Have to cheese it here to help the sync_button method work because the onauthstatechangedlistener is too slow
      document.getElementById("firebase_temp_login_div").style.display = "none";
      document.getElementById("content_div").style.display = "";
      switch (_current_login_temp_intent) {
        case TAB_SUGGESTIONS:
          setTab(TAB_SUGGESTIONS);
          break;
        default:
          setTab(TAB_PEOPLE);
          break;
      }
      document.getElementById("login_temp_loader").style.display = "none";
      document.getElementById("email_input_temp").disabled = false;
      document.getElementById("password_input_temp").disabled = false;
      _current_login_temp_intent = -1;
    }, _OVERRIDE_FIREBASE);
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("login error " + errorMessage);
    showSnackbar(errorMessage, 5000);
    document.getElementById("login_temp_loader").style.display = "none";
    document.getElementById("email_input_temp").disabled = false;
    document.getElementById("password_input_temp").disabled = false;
  });
}