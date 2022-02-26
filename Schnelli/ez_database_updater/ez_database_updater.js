const _DATABASE_PREFIX = "";
// const _DATABASE_PREFIX = _DATABASE_PREFIX__; //TODO Set this back to "" when uploading online

var _INDEXES = ["RECORD_NUMBER", "DESCRIP1", "DESCRIP2", "COMMENTS", "EQUIP_TYPE", "EQUIP_DSGN", "APPL_BRAND", "APPL_MFR", "PART_TYPE", "B_PN", "CHLX_PN", "F_PN", "GEM_PN", "RS_PN", "MM_PN", "JS_PN", "K_PN", "L_PN", "M_PN", "N_PN", "OEM_PN", "PART_NUMBR", "Q_PN", "SOURCE", "UNIT", "KEEP", "REORD_QTY", "GET", "PICKED", "TAG", "FROM", "CGS", "DATE", "FRT_IN", "QUESTIONS", "MODIFIED", "NEW", "NEWER", "LOCATION", "SPECMETHOD", "SPEC01NAME", "SPEC01HINT", "SPEC01DATA", "SPEC02NAME", "SPEC02HINT", "SPEC02DATA", "SPEC03NAME", "SPEC03HINT", "SPEC03DATA", "SPEC04NAME", "SPEC04HINT", "SPEC04DATA", "SPEC05NAME", "SPEC05HINT", "SPEC05DATA", "SPEC06NAME", "SPEC06HINT", "SPEC06DATA", "SPEC07NAME", "SPEC07HINT", "SPEC07DATA", "SPEC08NAME", "SPEC08HINT", "SPEC08DATA", "SPEC09NAME", "SPEC09HINT", "SPEC09DATA", "SPEC10NAME", "SPEC10HINT", "SPEC10DATA", "SPEC11NAME", "SPEC11HINT", "SPEC11DATA", "SPEC12NAME", "SPEC12HINT", "SPEC12DATA"];
var _MEMO_INDEXES = ["LOOK_UP_PN", "ADVICE", "ATTN", "MODEL"]; //76, 77, 78, 79 LOCATION = 38
var _LOOK_UP_PN = 76;
var _ADVICE = 77;
var _ATTN = 78;
var _MODEL = 79;
var _INDEXES_CONCAT = _INDEXES.concat(_MEMO_INDEXES);

var _EXTRA_DB_FIELDS = /*B_DNI*/[["PN", "AKA", "PART_NUMBR", "COMMON_PN", "DESCRIP1", "COMMENTS", "PART_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT", "POST_APPND"]
                       /*CHLX*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "PART_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*DNI*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "APPL_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "COMMON_PN", "CGS", "FROM", "DATE", "OEM_PN2", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT", "POST_APPND"]
                       /*F*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "PART_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*GEM*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "GEM_ID", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*H_RS*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "RS_ID", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*I_MM*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "MM_ID", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*JS*/, ["PN", "JS_LINE_PN", "PART_NUMBR", "DESCRIP1", "COMMENTS", "JS_LINE", "JS_ID", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "OTHER", "CGS", "FROM", "DATE", "OEM_PN", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT"]
                       /*OEM*/, ["PN", "AKA", "PART_NUMBR", "DESCRIP1", "COMMENTS", "APPL_MFR", "VEND", "CAT", "PAGE", "SPL", "SPL_DATE", "SPL_FROM", "LOT_CT", "LOT_PR", "LOT_FROM", "REG", "REG_DATE", "REG_FROM", "SUGG", "VEND_RET", "SHOP_QTY", "TRK1_QTY", "TRK2_QTY", "TRK3_QTY", "USED_QTY", "LOCATION", "COMMON_PN", "CGS", "FROM", "DATE", "OEM_PN2", "CALCULATED", "FIXED", "SELL", "ZOOM", "SOLD_YTD", "SOLD_DATE", "SOLD_AMT", "POST_APPND"]];

var input_email = document.getElementById("email_input");
var input_password = document.getElementById("password_input");
var KEY_ENTER = "Enter";
var KEY_NUMPADENTER = "NumpadEnter"

var error1 = 0;

// Execute a function when the user releases a key on the keyboard
input_email.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("login_button").click();
  }
});

input_password.addEventListener("keyup", function (event) {
  if (event.key === KEY_ENTER || event.code === KEY_NUMPADENTER) {
    event.preventDefault();
    document.getElementById("login_button").click();
  }
});

function log_in() {
  document.getElementById("server_select_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";

  var persistenceVar;
  if (document.getElementById("remember_input").checked)
    persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
  else
    persistenceVar = firebase.auth.Auth.Persistence.NONE;

  firebase.auth().setPersistence(persistenceVar).then(function () {
    return firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input").value, document.getElementById("password_input").value).then(function () {
      loadContentDiv();
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("login error " + errorMessage);
      showSnackbar(errorMessage, 10000);
      document.getElementById("server_select_div").style.display = "none";
      document.getElementById("login_div").style.display = "block";
      document.getElementById("local_server_connect_div").style.display = "none";
    });
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("persistence error " + errorMessage);
    showSnackbar(errorMessage, 10000);
    document.getElementById("server_select_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("local_server_connect_div").style.display = "none";
  });
}

function loadContentDiv() {
  document.getElementById("server_select_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
  document.getElementById("content_div").style.display = "";
}

function log_out() {
  firebase.auth().signOut().then(function () {
  }).catch(function (error) {
    showSnackbar(error.message, 5000);
  });

  closeWebSocket();
  setDivsOnLogOut();
}

function setDivsOnLogOut() {
  document.getElementById("server_select_div").style.display = "block";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
  document.getElementById("content_div").style.display = "none";
}

function readSingleFile_memos(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var finalContent = processLSTDataMemos(contents);
      _content_look_up_pn = finalContent[0];
      _content_models = finalContent[1];
      _content_advice = finalContent[2];
      _content_attn = finalContent[3];
      if (_content_look_up_pn.length == _content_models.length && _content_look_up_pn.length == _content_advice.length && _content_look_up_pn.length == _content_attn.length) {
        document.getElementById("button_next_" + currentPage).style.display = "";
      }
      else {
        showSnackbar("Mismatch in number of memo field entries<br><span style='text-align: left;'>" + _content_look_up_pn.length + " - LOOK_UP_PN<br>" + _content_models.length + " - MODELS<br>" + _content_advice.length + " - ADVICE<br>" + _content_attn.length + " - ATTN</span>", 10000);
      }
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

// function readSingleFile_look_up_pn(evt) {
//   var f = evt.target.files[0];
//   if (f) {
//     var r = new FileReader();
//     r.onload = function(e) { 
//       var contents = e.target.result;
//       _content_look_up_pn = processLSTData(contents);
//       console.log("look_up_pn " + _content_look_up_pn.length);
//       document.getElementById("button_next_4").style.display = "";
//     }
//     r.readAsText(f);
//   } else {
//     alert("Failed to load file");
//   }
// }

// function readSingleFile_advice(evt) {
//   var f = evt.target.files[0];
//   if (f) {
//     var r = new FileReader();
//     r.onload = function(e) { 
//       var contents = e.target.result;
//       _content_advice = processLSTData(contents);
//       console.log("advice " + _content_advice.length);
//       if(_content_advice.length == _content_look_up_pn.length)
//       {
//         document.getElementById("button_next_5").style.display = "";
//       }
//       else
//       {
//         showSnackbar("Mismatch in number of memo field entries<br>LOOK_UP_PN - " + _content_look_up_pn.length + "<br>ADVICE - " + _content_advice.length, 10000);
//       }
//     }
//     r.readAsText(f);
//   } else {
//     alert("Failed to load file");
//   }
// }

// function readSingleFile_attn(evt) {
//   var f = evt.target.files[0];
//   if (f) {
//     var r = new FileReader();
//     r.onload = function(e) { 
//       var contents = e.target.result;
//       _content_attn = processLSTData(contents);
//       console.log("attn " + _content_attn.length);
//       if(_content_attn.length == _content_look_up_pn.length)
//       {
//         document.getElementById("button_next_6").style.display = "";
//       }
//       else
//       {
//         showSnackbar("Mismatch in number of memo field entries<br>LOOK_UP_PN - " + _content_look_up_pn.length + "<br>ATTN - " + _content_attn.length, 10000);
//       }
//     }
//     r.readAsText(f);
//   } else {
//     alert("Failed to load file");
//   }
// }

// function readSingleFile_models(evt) {
//   var f = evt.target.files[0];
//   if (f) {
//     var r = new FileReader();
//     r.onload = function(e) { 
//       var contents = e.target.result;
//       _content_models = processLSTData(contents);
//       console.log("models " + _content_models.length);
//       if(_content_models.length == _content_look_up_pn.length)
//       {
//         document.getElementById("button_next_7").style.display = "";
//       }
//       else
//       {
//         showSnackbar("Mismatch in number of memo field entries<br>LOOK_UP_PN - " + _content_look_up_pn.length + "<br>MODELS - " + _content_models.length, 10000);
//       }
//     }
//   r.readAsText(f);
//   } else {
//     alert("Failed to load file");
//   }
// }

function readSingleFile_PA_PRI(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processPA_PRI_Data(contents);
      _content_PA_PRI = data[1];
      console.log("PA_PRI " + _content_PA_PRI.length);
      console.log(_content_PA_PRI[0]);
      if (_content_PA_PRI.length == _content_look_up_pn.length) {
        if (error1 != 0) {
          console.log(error1);
        }
        else
          document.getElementById("button_next_" + currentPage).style.display = "";

      }
      else {
        showSnackbar("Mismatch in number of memo field entries<br>LOOK_UP_PN - " + _content_look_up_pn.length + "<br>P&A_PRI - " + _content_PA_PRI.length, 10000);
      }
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readSingleFile_B_DNI(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 0);
      _content_B_DNI = data[1];
      console.log("B_DNI " + _content_B_DNI.length);
      console.log(_content_B_DNI[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  }
  else {
    alert("Failed to load file");
  }
}

function readSingleFile_CHLX(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 1);
      _content_CHLX = data[1];
      console.log("CHLX " + _content_CHLX.length);
      console.log(_content_CHLX[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readSingleFile_DNI(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 2);
      _content_DNI = data[1];
      console.log("DNI " + _content_DNI.length);
      console.log(_content_DNI[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  }
  else {
    alert("Failed to load file");
  }
}

function readSingleFile_GEM(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 4);
      _content_GEM = data[1];
      console.log("GEM " + _content_GEM.length);
      console.log(_content_GEM[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readSingleFile_H_RS(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 5);
      _content_H_RS = data[1];
      console.log("H_RS " + _content_H_RS.length);
      console.log(_content_H_RS[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readSingleFile_I_MM(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 6);
      _content_I_MM = data[1];
      console.log("I_MM " + _content_I_MM.length);
      console.log(_content_I_MM[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readSingleFile_JS(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 7);
      _content_JS = data[1];
      console.log("JS " + _content_JS.length);
      console.log(_content_JS[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function readSingleFile_OEM(evt) {
  var f = evt.target.files[0];
  if (f) {
    var r = new FileReader();
    r.onload = function (e) {
      var contents = e.target.result;
      var data = processCSVData(contents, 8);
      _content_OEM = data[1];
      console.log("OEM " + _content_OEM.length);
      console.log(_content_OEM[0]);
      if (error1 == 0)
        document.getElementById("button_next_" + currentPage).style.display = "";
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

var _content_look_up_pn = [];
var _content_advice = [];
var _content_attn = [];
var _content_models = [];
var _content_PA_PRI;
var _content_B_DNI;
var _content_CHLX;
var _content_DNI;
var _content_GEM;
var _content_H_RS;
var _content_I_MM;
var _content_JS;
var _content_OEM;

document.getElementById('fileinput_memos').addEventListener('change', readSingleFile_memos, false);
// document.getElementById('fileinput_look_up_pn').addEventListener('change', readSingleFile_look_up_pn, false);
// document.getElementById('fileinput_advice').addEventListener('change', readSingleFile_advice, false);
// document.getElementById('fileinput_attn').addEventListener('change', readSingleFile_attn, false);
// document.getElementById('fileinput_models').addEventListener('change', readSingleFile_models, false);
document.getElementById('fileinput_pa_pri').addEventListener('change', readSingleFile_PA_PRI, false);
document.getElementById('fileinput_b_dni').addEventListener('change', readSingleFile_B_DNI, false);
document.getElementById('fileinput_chlx').addEventListener('change', readSingleFile_CHLX, false);
document.getElementById('fileinput_dni').addEventListener('change', readSingleFile_DNI, false);
document.getElementById('fileinput_gem').addEventListener('change', readSingleFile_GEM, false);
document.getElementById('fileinput_h_rs').addEventListener('change', readSingleFile_H_RS, false);
document.getElementById('fileinput_i_mm').addEventListener('change', readSingleFile_I_MM, false);
document.getElementById('fileinput_js').addEventListener('change', readSingleFile_JS, false);
document.getElementById('fileinput_oem').addEventListener('change', readSingleFile_OEM, false);

// function processLSTData(allText){
//   //Remove beginning gibberish and *
//   while(allText.length > 0 && allText.charAt(0) != "*")
//     allText = allText.substring(1, allText.length);
//   allText = allText.substring(1, allText.length);
//   var contents = allText.split("\n\*");
//   var finalContent = [];
//   for(var i = 0; i < contents.length; ++i){
//       var contentlines = contents[i].split("\n");
//       for(var j = 0; j < contentlines.length; ++j){
//           while(contentlines[j].length > 0 && contentlines[j][0] == " ")
//           {
//               contentlines[j] = contentlines[j].substring(1, contentlines[j].length);
//           }
//       }
//       finalContent.push(contentlines);
//   }
//   return finalContent;
// }

function processLSTDataMemos(allText) {
  //Remove beginning gibberish and *
  while (allText.length > 0 && allText.charAt(0) != "*")
    allText = allText.substring(1, allText.length);
  allText = allText.substring(1, allText.length);
  var contents = allText.split("\n\*");
  var finalContent = [[], [], [], []];
  for (var i = 0; i < contents.length; ++i) {
    var contentlines = contents[i].split("\n");
    for (var j = 0; j < contentlines.length; ++j) {
      while (contentlines[j].length > 0 && contentlines[j][0] == " ") {
        contentlines[j] = contentlines[j].substring(1, contentlines[j].length);
      }
    }
    finalContent[i % 4].push(contentlines);
  }
  return finalContent;
}

function processPA_PRI_Data(allText) {
  var row = 0;
  var column = 0;
  var start = 0;
  var end = 0;
  var _content = null;
  // _content.push([]);
  var parsingHeader = true;
  var _header = [];
  while (allText.length > 0 && allText.charAt(allText.length - 1) == "\n")
    allText = allText.substring(0, allText.length - 1);

  _content = allText.split("\n");
  for (var i = 0; i < _content.length; ++i) {
    _content[i] = _content[i].split("!#!");
    if (i == 0)
      _header = _content[0];
    else {
      if (_content[i].length != _header.length) {
        showSnackbar("Line " + i + " of P&A_PRI.ASC has " + _content[i].length + " entries, the header specifies " + _header.length + " entries", 10000);
        error1 = 1;
      }
    }
  }
  _content.splice(0, 1); //Remove header


  if (error1 == 0) {
    for (var i = 0; i < _content.length; ++i) {
      var obj = new Object();
      for (var j = 0; j < _INDEXES.length; ++j) {
        var name = _INDEXES[j];
        if (j == 0)
          obj[name] = String(i + 1); //.ASC file doesn't output record numbers, so add it manually here
        else {
          obj[name] = _content[i][j - 1];
        }
      }
      for (var j = 0; j < _MEMO_INDEXES.length; ++j) {
        var name = _MEMO_INDEXES[j];
        switch (j) {
          case 0:
            obj[name] = _content_look_up_pn[i];
            break;
          case 1:
            obj[name] = _content_advice[i];
            break;
          case 2:
            obj[name] = _content_attn[i];
            break;
          case 3:
            obj[name] = _content_models[i];
            break;
        }
      }
      _content[i] = obj;
    }
  }
  // for(var i = 0; i < allText.length; ++i)
  // {
  //     var n = allText.charAt(i);
  //     if(i <= allText.length - 3 && allText.charAt(i) == "!" && allText.charAt(i + 1) == "#" && allText.charAt(i + 2) == "!")
  //     {
  //         end = i;
  //         var str = allText.substring(start, end);
  //         if(parsingHeader)
  //           _header.push(str);
  //         else
  //           _content[row].push(str);

  //         ++column;
  //         start = i + 3;
  //         i += 2;
  //     }
  //     else if(n == '\n'){
  //       end = i;
  //       var str = allText.substring(start, end);
  //       if(parsingHeader)
  //         _header.push(str);
  //       else
  //         _content[row].push(str);

  //       if(column != _header.length - 1)
  //       {
  //         showSnackbar("Row " + row + " of CSV data doesn't match header length!", 5000);
  //       }

  //       column = 0;
  //       _content.push([]);
  //       ++row;
  //       start = i + 1;
  //       parsingHeader = false;
  //     }
  // }
  return [_header, _content];
}

function processCSVData(allText, extraDB_Index) {
  var _content = null;
  var _header = [];
  var header2 = _EXTRA_DB_FIELDS[extraDB_Index];
  while (allText.length > 0 && allText.charAt(allText.length - 1) == "\n")
    allText = allText.substring(0, allText.length - 1);

  _content = allText.split("\n");
  for (var i = 0; i < _content.length; ++i) {
    _content[i] = _content[i].split("!#!");
    if (i == 0)
      _header = _content[0];
    else {
      if (_content[i].length != header2.length) {
        showSnackbar("Line " + i + " of ASC file has " + _content[i].length + " entries, expected " + header2.length + " entries", 10000);
        error1 = 2;
      }
    }
  }
  _content.splice(0, 1); //Remove header

  if (error1 == 0) {
    for (var i = 0; i < _content.length; ++i) {
      var obj = new Object();
      for (var j = 0; j < header2.length; ++j) {
        var name = header2[j];
        obj[name] = _content[i][j];
      }
      _content[i] = obj;
    }
  }
  return [_header, _content];
}

function stripQuotations(str1) {
  var str = String(str1);
  if (str.length >= 2 && str[0] == "\"" && str[str.length - 1] == "\"") {
    return str.substring(1, str.length - 1);
  }
  if (str.length >= 3 && str[0] == "\"" && str[str.length - 2] == "\"" && str[str.length - 1] == "\r") {
    return str.substring(1, str.length - 2);
  }
  return str;
}

var _snackbar_times_shown = 0;
function showSnackbar(message, time_to_show) {
  var x = document.getElementById("snackbar");
  x.style.display = "";
  x.innerHTML = message;
  if (x.className != "hide")
    if (x.className == "refresh1")
      x.className = "refresh2";
    else
      x.className = "refresh1";
  else
    x.className = "show";
  ++_snackbar_times_shown;

  setTimeout(function () {
    --_snackbar_times_shown;
    if (_snackbar_times_shown == 0) {
      x.className = "hide";

      setTimeout(function () {
        x.style.display = "none";
      }, 500);

    }
  }, time_to_show);

}

var currentPage = 0;
function pageButtonNext() {
  document.getElementById("instructions_page_" + currentPage).style.display = "none";
  ++currentPage;
  setTimeout(function () {
    document.getElementById("instructions_page_" + currentPage).style.display = "";
  }, 10);
}

function pageButtonPrev() {
  document.getElementById("instructions_page_" + currentPage).style.display = "none";
  --currentPage;
  setTimeout(function () {
    document.getElementById("instructions_page_" + currentPage).style.display = "";
  }, 10);
}

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

var _FIREBASE_LOGGED_IN = false;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in. Has saved login info
    console.log("DETECTED AUTH STATE CHANGE|LOGGED IN");
    _FIREBASE_LOGGED_IN = true;
    // loadContentDiv();
  }
  else {
    console.log("DETECTED AUTH STATE CHANGE|LOGGED OUT");
    _FIREBASE_LOGGED_IN = false;
  }
});

function openFirebaseServerScreen() {
  if (_FIREBASE_LOGGED_IN) {
    document.getElementById("server_select_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("local_server_connect_div").style.display = "none";
    loadContentDiv();
  } else {
    document.getElementById("server_select_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("local_server_connect_div").style.display = "none";
  }
}

function exitFirebaseServerScreen() {
  document.getElementById("server_select_div").style.display = "block";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
}

var numUploaded = 0;
function startUpload() {
  upload_B_DNI();
}

function upload_B_DNI() {
  numUploaded = 0;
  document.getElementById("upload_progress_B_DNI").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/B_DNI', function () {
    console.log("Deletion complete!");
    for (var i = 0; i < _content_B_DNI.length; ++i) {
      var newRef = getNewKeyPath("parts_db/B_DNI");
      writeToDB(newRef, _content_B_DNI[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_B_DNI").innerHTML = "Uploaded " + numUploaded + " of " + _content_B_DNI.length;
        if (numUploaded == _content_B_DNI.length)
          upload_CHLX();
      });
    }
  });
}

function upload_CHLX() {
  numUploaded = 0;
  document.getElementById("upload_progress_CHLX").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/CHLX', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_CHLX.length; ++i) {
      var newRef = getNewKeyPath("parts_db/CHLX");
      writeToDB(newRef, _content_CHLX[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_CHLX").innerHTML = "Uploaded " + numUploaded + " of " + _content_CHLX.length;
        if (numUploaded == _content_CHLX.length)
          upload_DNI();
      });
    }
  });
}

function upload_DNI() {
  numUploaded = 0;
  document.getElementById("upload_progress_DNI").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/DNI', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_DNI.length; ++i) {
      var newRef = getNewKeyPath("parts_db/DNI");
      writeToDB(newRef, _content_DNI[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_DNI").innerHTML = "Uploaded " + numUploaded + " of " + _content_DNI.length;
        if (numUploaded == _content_DNI.length)
          upload_GEM();
      });
    }
  });
}

function upload_GEM() {
  numUploaded = 0;
  document.getElementById("upload_progress_GEM").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/GEM', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_GEM.length; ++i) {
      var newRef = getNewKeyPath("parts_db/GEM");
      writeToDB(newRef, _content_GEM[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_GEM").innerHTML = "Uploaded " + numUploaded + " of " + _content_GEM.length;
        if (numUploaded == _content_GEM.length)
          upload_H_RS();
      });
    }
  });
}

function upload_H_RS() {
  numUploaded = 0;
  document.getElementById("upload_progress_H_RS").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/H_RS', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_H_RS.length; ++i) {
      var newRef = getNewKeyPath("parts_db/H_RS");
      writeToDB(newRef, _content_H_RS[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_H_RS").innerHTML = "Uploaded " + numUploaded + " of " + _content_H_RS.length;
        if (numUploaded == _content_H_RS.length)
          upload_I_MM();
      });
    }
  });
}

function upload_I_MM() {
  numUploaded = 0;
  document.getElementById("upload_progress_I_MM").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/I_MM', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_I_MM.length; ++i) {
      var newRef = getNewKeyPath("parts_db/I_MM");
      writeToDB(newRef, _content_I_MM[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_I_MM").innerHTML = "Uploaded " + numUploaded + " of " + _content_I_MM.length;
        if (numUploaded == _content_I_MM.length)
          upload_JS();
      });
    }
  });
}

function upload_JS() {
  numUploaded = 0;
  document.getElementById("upload_progress_JS").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/JS', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_JS.length; ++i) {
      var newRef = getNewKeyPath("parts_db/JS");
      writeToDB(newRef, _content_JS[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_JS").innerHTML = "Uploaded " + numUploaded + " of " + _content_JS.length;
        if (numUploaded == _content_JS.length)
          upload_OEM();
      });
    }
  });
}

function upload_OEM() {
  numUploaded = 0;
  document.getElementById("upload_progress_OEM").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/OEM', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_OEM.length; ++i) {
      var newRef = getNewKeyPath("parts_db/OEM");
      writeToDB(newRef, _content_OEM[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_OEM").innerHTML = "Uploaded " + numUploaded + " of " + _content_OEM.length;
        if (numUploaded == _content_OEM.length)
          upload_PAPRI();
      });
    }
  });
}

function upload_PAPRI() {
  numUploaded = 0;
  document.getElementById("upload_progress_PAPRI").innerHTML = "Deleting original data";
  deleteFromDB('parts_db/P&A_PRI', function () {
    console.log("Deletion complete! ");
    for (var i = 0; i < _content_PA_PRI.length; ++i) {
      var newRef = getNewKeyPath("parts_db/P&A_PRI");
      writeToDB(newRef, _content_PA_PRI[i], function () {
        ++numUploaded;
        document.getElementById("upload_progress_PAPRI").innerHTML = "Uploaded " + numUploaded + " of " + _content_PA_PRI.length;
        if (numUploaded == _content_PA_PRI.length)
          document.getElementById("upload_progress_PAPRI").innerHTML += " - All Uploads Complete!";
      });
    }
  });
}

var _LOCAL_SERVER_MODE = false;

const REQUESTTYPE_READ = "r"
const REQUESTTYPE_WRITE = "w"
const REQUESTTYPE_DELETE = "e"
const REQUESTTYPE_ADDLISTENER = "l"
const REQUESTTYPE_DELETELISTENER = "d"
const REQUESTTYPE_REPLY_READ = "R"
const REQUESTTYPE_REPLY_WRITE = "W"
const REQUESTTYPE_REPLY_DELETE = "E"
const REQUESTTYPE_REPLY_LISTENERUPDATED = "U"
const REQUESTTYPE_REPLY_LISTENERDELETED = "D"
var listeners = [];
var socketListeners = new Map();
var readFunctions = new Map();
var writeFunctions = new Map();
var deleteFunctions = new Map();

function socketRecievedMessage(event) {
  var json1 = JSON.parse(event.data);
  var key = json1["key"];
  var val = json1["val"];
  if (val == null)
    val = new Object();
  switch (json1["req"]) {
    case REQUESTTYPE_REPLY_READ:
      if (readFunctions.has(key)) {
        readFunctions.get(key)(val, getKeyFromPath(key)); //Todo, send key of data
        readFunctions.delete(key);
      }
      break;
    case REQUESTTYPE_REPLY_WRITE:
      if (writeFunctions.has(key)) {
        writeFunctions.get(key)();
        writeFunctions.delete(key);
      }
      break;
    case REQUESTTYPE_REPLY_DELETE:
      if (deleteFunctions.has(key)) {
        deleteFunctions.get(key)();
        deleteFunctions.delete(key);
      }
      break;
    case REQUESTTYPE_REPLY_LISTENERUPDATED:
      if (socketListeners.has(key)) {
        socketListeners.get(key)(val, getKeyFromPath(key));
      }
      break;
    case REQUESTTYPE_REPLY_LISTENERDELETED:
      break;

  }
}

function removeListeners() {
  if (_LOCAL_SERVER_MODE) {
    for (let [key, value] of socketListeners) {
      var obj = new Object();
      obj["req"] = REQUESTTYPE_DELETELISTENER;
      obj["key"] = key;
      _socket.send(JSON.stringify(obj));
    }
    socketListeners.clear();
  }
  else {
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i].off();
    }
    listeners = [];
  }
}

function addDBListener(reff, function1) {
  if (_LOCAL_SERVER_MODE) {
    socketListeners.set(reff, function1);
    var obj = new Object();
    obj["req"] = REQUESTTYPE_ADDLISTENER;
    obj["key"] = reff;
    _socket.send(JSON.stringify(obj));
  }
  else {
    var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
    ref.on('value', function (snapshot) {
      var val = snapshot.val();
      if (val == null)
        val = new Object();
      function1(val, snapshot.key);
      snapshot = null; //Helps to prevent "Out of memory" errors?
    });
    listeners.push(ref);
  }
}

function readFromDB(reff, function1) {
  if (_LOCAL_SERVER_MODE) {
    readFunctions.set(reff, function1);
    var obj = new Object();
    obj["req"] = REQUESTTYPE_READ;
    obj["key"] = reff;
    _socket.send(JSON.stringify(obj));
  }
  else {
    var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
    ref.once('value', function (snapshot) {
      var val = snapshot.val();
      if (val == null)
        val = new Object();
      // console.log("Snapshot|" + reff + "|" + objSize(val) + "|" + (val == null) + "|");
      function1(val, snapshot.key);
      snapshot = null; //Helps to prevent "Out of memory" errors?
    });
  }
}

function recursive_set_obj_w4_datemodified(obj) {
  let nonObjectFound = false;
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value != "object") {
      let date = new Date();
      obj.w4_dm = date.getTime();
      nonObjectFound = true;
      break;
    }
  }

  if (!nonObjectFound) {
    for (let [key, value] of Object.entries(obj)) {
      recursive_set_obj_w4_datemodified(value);
    }
  }
}

function writeToDB(reff, object, function1) {
  recursive_set_obj_w4_datemodified(object);
  if (_LOCAL_SERVER_MODE) {
    if (function1 != null)
      writeFunctions.set(reff, function1);
    var obj = new Object();
    obj["req"] = REQUESTTYPE_WRITE;
    obj["key"] = reff;
    obj["val"] = object;
    _socket.send(JSON.stringify(obj));
  }
  else {
    var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
    ref.set(object, function1);
  }
}

function deleteFromDB(reff, function1) {
  if (_LOCAL_SERVER_MODE) {
    if (function1 != null)
      deleteFunctions.set(reff, function1);
    var obj = new Object();
    obj["req"] = REQUESTTYPE_DELETE;
    obj["key"] = reff;
    _socket.send(JSON.stringify(obj));
  }
  else {
    var ref = firebase.database().ref(_DATABASE_PREFIX + reff);
    ref.remove(function1);
  }
}

function getNewKeyPath(reff) {
  var ref = firebase.database().ref(_DATABASE_PREFIX + reff).push();
  return reff + "/" + ref.key;
}

function getNewKey(reff) {
  var ref = firebase.database().ref(_DATABASE_PREFIX + reff).push();
  return ref.key;
}

function getKeyFromPath(pathAndKey) {
  for (var i = pathAndKey.length; i >= 0; --i) {
    if (pathAndKey[i] == '/') {
      return pathAndKey.substring(i + 1, pathAndKey.length);
    }
  }
  return pathAndKey;
}

function getDatabaseRef(key) {
  return firebase.database().ref(_DATABASE_PREFIX + key);
}

var _socket = null;

function openLocalServerScreen() {
  document.getElementById("server_select_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "block";
  var ip = localStorage.getItem("local_server_ip");
  if (ip != null) {
    document.getElementById("input_local_server_ip").value = ip;
  }
  document.getElementById("input_local_server_ip").focus();
  document.getElementById("input_local_server_ip").select();
}

function exitLocalServerScreen() {
  document.getElementById("server_select_div").style.display = "block";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
}

function connectToLocalServer() {
  closeWebSocket();

  var ip = document.getElementById("input_local_server_ip").value;
  localStorage.setItem("local_server_ip", ip); //Cookies cannot be stored for local files
  // localStorage.clear();


  _socket = new WebSocket('ws://' + ip + ':5444'); //192.168.1.227
  _socket.addEventListener('open', socketOpened);
  _socket.addEventListener('message', socketRecievedMessage);
  _socket.addEventListener('close', socketClosed);

  document.getElementById("local_server_connect_div_loading").style.display = "block";
  document.getElementById("local_server_connect_div_non_loading").style.display = "none";

}

function cancelConnectToLocalServer() {
  closeWebSocket();
  document.getElementById("local_server_connect_div_loading").style.display = "none";
  document.getElementById("local_server_connect_div_non_loading").style.display = "block";
}

function closeWebSocket() {
  if (_socket != null) {
    _socket.removeEventListener('open', socketOpened);
    _socket.removeEventListener('message', socketRecievedMessage);
    _socket.close();
  }
  _socket = null;
  _LOCAL_SERVER_MODE = false;
}

function socketOpened(event) {
  _LOCAL_SERVER_MODE = true;
  document.getElementById("server_select_div").style.display = "none";
  document.getElementById("login_div").style.display = "none";
  document.getElementById("local_server_connect_div").style.display = "none";
  loadContentDiv();
}

function socketClosed(event) {
  // console.log("Socket closed");
  // console.log(event);
}

function localServerIPKeyUp(event) {
  if (event.code == KEY_ENTER || event.code == KEY_NUMPADENTER) {
    document.getElementById("button_server_local_connect").click();
  }
}