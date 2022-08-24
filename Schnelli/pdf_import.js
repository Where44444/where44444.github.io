document.getElementById("import_wlmay_pdf_input").onchange = function (event) {
  _pdf_or_ocr_mode = 0;
  if (document.getElementById("import_wlmay_pdf_input").value != "") {
    var file = event.target.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader();

    fileReader.onload = function () {

      //Step 4:turn array buffer into typed array
      var typedarray = new Uint8Array(this.result);

      getPdfText(typedarray);
      document.getElementById("fileinput_controls").style.display = "none";
      document.getElementById("wlmay_pdf_table_div").style.display = "block";
    };
    //Step 3:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  }
}

function cancelWLMAYPDF() {
  document.getElementById("wlmay_pdf_table_div").style.display = "none";
  document.getElementById("fileinput_controls").style.display = "";
  document.getElementById("import_wlmay_pdf_input").value = "";
  document.activeElement.blur();
  setKeyboardShortcutBar();
}

var _current_FROM = "";
var _pdf_or_ocr_mode = 0;
function generatePDFAddToDatabaseTable(index) {
  var desc = document.getElementById("pdf_description_" + index).value.split("\n");
  var pn = "";
  var descrip1 = "";
  var pnFound = false;
  for (var i = 0; i < desc.length; ++i) {
    if (removeExtraSpaces(desc[i]) != "") {
      if (!pnFound) {
        pn = removePreWP(desc[i]);
        pnFound = true;
      }
      else {
        descrip1 = desc[i];
        break;
      }
    }
  }

  var link = null;
  var extradb = -1;
  for (var i = 0; i < _EXTRA_DB.length; ++i) {
    link = getExtraDBLinkIndex(i, pn);
    if (link != null) {
      extradb = i;
      break;
    }
  }

  // var shippedamount_ele = document.getElementById("pdf_shipped_" + index);
  var stock_ele = document.getElementById("input_stock_" + index);
  var descrip = "";
  var make = "";
  var date = "";
  var from = _current_FROM;
  var cgs = "";
  var reg = "";
  var spl = "";
  if (document.getElementById("pdf_descrip_" + index) != null)
    descrip = document.getElementById("pdf_descrip_" + index).value;
  if (document.getElementById("pdf_make_" + index) != null)
    make = document.getElementById("pdf_make_" + index).value;
  if (document.getElementById("ocr_import_date") != null)
    date = document.getElementById("ocr_import_date").value;
  else if (document.getElementById("wlmay_pdf_invoice_date_input") != null)
    date = document.getElementById("wlmay_pdf_invoice_date_input").value;
  if (document.getElementById("pdf_yourprice_" + index) != null) {
    cgs = document.getElementById("pdf_yourprice_" + index).value;
    reg = cgs;
  }
  if (document.getElementById("pdf_reg_" + index) != null) {
    reg = document.getElementById("pdf_reg_" + index).value;
    spl = cgs;
  }
  var stockamount = "";
  var newqty = "";
  if (stock_ele != null) {
    stockamount = stock_ele.value;
    newqty = Math.floor(Number(stockamount));
  }

  if (link == null) {
    var notFoundHTML = "<span id='import_part_form_not_found_" + index + "' style='color: red;'>Could not find part number \"" + pn + "\" in any child databases!</span>";
    notFoundHTML += "<p>Add new part child record?</p>";
    notFoundHTML += "<select id='pdf_new_partchild_select_" + index + "' style='width: 300px;'>";
    for (var i = 0; i < _EXTRA_DB.length; ++i)
      notFoundHTML += "<option value='" + _EXTRA_DB[0] + "'>" + _EXTRA_DB[i] + "</option>";
    notFoundHTML += "</select>";
    notFoundHTML += "&nbsp;&nbsp;<button id='button_pdfimport_newpartchild_submit' style='background-color: #70A2FF; color: black;' onclick='startPDFNewChildRecord(" + index + ");'><span style='color: white;'>S</span>ubmit</button>";
    notFoundHTML += "&nbsp;&nbsp;<button id='button_pdfimport_newpartchild_cancel' style='background-color: #70A2FF; color: black;' onclick='cancelPDFAddToDatabase(" + index + ");'><span style='color: white;'>C</span>ancel</button>";
    document.getElementById("pdf_add_to_database_table_" + index).innerHTML = notFoundHTML;
    // var ele = document.getElementById("pdf_new_partchild_select_" + index);
    // if (ele != null) {
    //   ele.focus();
    // }
  }
  else {
    _extraDBs_PDF.set(index, extradb);
    _extraDBLinks_PDF.set(index, link);
    var partObj = _content_extra[extradb][link][0];
    stockamount = Number(partObj.SHOP_QTY);
    if (stock_ele != null)
      stockamount = stock_ele.value;
    var shippedamount_change = "";
    var make_change = "";
    var descrip_change = "";
    var date_change = "";
    var from_change = "";
    var cgs_change = "";
    var reg_change = "";
    var spl_change = "";
    //dealerprice -> REG
    //yourprice -> SPL
    //shippedamount -> SHOP_QTY
    var diff = 0;
    if (removeExtraSpaces(stockamount) == "") {
      stockamount = 0;
    }
    if (descrip == partObj.DESCRIP1 || removeExtraSpaces(descrip) == "") {
      descrip_change = "No Change";
      descrip = partObj.DESCRIP1;
    }
    else {
      descrip_change = "<img src='down_arrow.png' width=20px height=20px>";
    }
    if (make == partObj[_APPL_MFR_INDEXES[extradb]] || removeExtraSpaces(make) == "") {
      make_change = "No Change";
      make = partObj[_APPL_MFR_INDEXES[extradb]];
    }
    else {
      make_change = "<img src='down_arrow.png' width=20px height=20px>";
    }
    if (make == partObj[_APPL_MFR_INDEXES[extradb]] || removeExtraSpaces(make) == "") {
      make_change = "No Change";
      make = partObj[_APPL_MFR_INDEXES[extradb]];
    }
    else {
      make_change = "<img src='down_arrow.png' width=20px height=20px>";
    }
    if (date == partObj.DATE || removeExtraSpaces(date) == "") {
      date_change = "No Change";
      date = partObj.DATE;
    }
    else {
      date_change = "<img src='down_arrow.png' width=20px height=20px>";
    }
    if (from == partObj.FROM || removeExtraSpaces(from) == "") {
      from_change = "No Change";
      from = partObj.FROM;
    }
    else {
      from_change = "<img src='down_arrow.png' width=20px height=20px>";
    }

    if (cgs == partObj.CGS || removeExtraSpaces(cgs) == "") {
      cgs_change = "No Change";
      cgs = partObj.CGS;
    }
    else {
      diff = get_plus_minus_usd_string(Number(cgs) - Number(partObj.CGS));
      cgs_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }
    if (reg == partObj.REG || removeExtraSpaces(reg) == "") {
      reg_change = "No Change";
      reg = partObj.REG;
    }
    else {
      diff = get_plus_minus_usd_string(Number(reg) - Number(partObj.REG));
      reg_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }
    if (spl == partObj.SPL || removeExtraSpaces(spl) == "") {
      spl_change = "No Change";
      spl = partObj.SPL;
    }
    else {
      diff = get_plus_minus_usd_string(Number(spl) - Number(partObj.SPL));
      spl_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }

    newqty = 0;
    newqty += Number(stockamount);
    newqty += Number(partObj.SHOP_QTY);
    diff = newqty - Number(partObj.SHOP_QTY);
    newqty = Math.floor(Number(newqty));
    if (diff >= 0)
      diff = "+" + diff;
    shippedamount_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    var htmlToAdd = "";
    if (removeExtraSpaces(partObj.FIXED) != "")
      htmlToAdd += "<div style='color: red;'>Fixed price found!</div>";
    htmlToAdd += "<table id='import_part_form_" + index + "'>"
      + "<tr><th>DB</th><th>PN</th><th>AKA</th><th>REG</th><th>SPL</th><th>SHOP_QTY</th><th>FIXED</th><th>MAKE</th><th>DESCRIP1</th><th>DATE</th><th>FROM</th><th>CGS</th></tr>"
      + "<tr><td>" + _EXTRA_DB[extradb] + "</td><td>" + partObj.PN + "</td><td>" + partObj[_EXTRA_DB_FIELDS[extradb][_AKA_GLOBAL]] + "</td><td>" + partObj.REG + "</td><td>" + partObj.SPL + "</td><td>" + partObj.SHOP_QTY + "</td><td>" + partObj.FIXED + "</td><td>" + partObj[_APPL_MFR_INDEXES[extradb]] + "</td><td>" + partObj.DESCRIP1 + "</td><td>" + partObj.DATE + "</td><td>" + partObj.FROM + "</td><td>" + partObj.CGS + "</td></tr>"
      + "<tr><td></td><td></td><td></td><td>" + reg_change + "</td><td>" + spl_change + "</td><td>" + shippedamount_change + "</td><td></td><td>" + make_change + "</td><td>" + descrip_change + "</td><td>" + date_change + "</td><td>" + from_change + "</td><td>" + cgs_change + "</td></tr>"
      + "<tr><td>" + _EXTRA_DB[extradb] + "</td><td>" + partObj.PN + "</td><td>" + partObj[_EXTRA_DB_FIELDS[extradb][_AKA_GLOBAL]] + "</td><td>" + reg + "</td><td>" + spl + "</td><td>" + newqty + "</td><td>" + partObj.FIXED + "</td><td>" + make + "</td><td>" + descrip + "</td><td>" + date + "</td><td>" + from + "</td><td>" + cgs + "</td></tr>"
      + "</table>"
      + "<button id='button_pdfimport_save_addrow'   style='background-color: #70A2FF; color: black;' onclick='confirmPDFAddToDatabase(" + index + ");'><span style='color: white;'>S</span>ave</button>&nbsp;&nbsp;"
      + "<button id='button_pdfimport_cancel_addrow' style='background-color: #70A2FF; color: black;' onclick='cancelPDFAddToDatabase(" + index + ");' ><span style='color: white;'>C</span>ancel</button>";
    document.getElementById("pdf_add_to_database_table_" + index).innerHTML = htmlToAdd;
    document.getElementById("pdf_add_to_database_table_" + index).scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    // document.activeElement.blur();
  }
  _newREGs.set(index, reg);
  _newSPLs.set(index, spl);
  _newSHOP_QTYs.set(index, newqty);
  _newPNs.set(index, pn);
  _newDESCRIP1s.set(index, descrip1);
  _newDESCRIPs.set(index, descrip);
  _newMAKEs.set(index, make);
  _newDATEs.set(index, date);
  _newFROMs.set(index, _current_FROM);
  _newCGSs.set(index, cgs);
  setPDFAddToDatabaseButtons(false);
}

//^([0-9.]+\/)(.+\/)([0-9-.]+)
//[4]
//48.20/BIRKBY/PS/747-7493
//35.36/BOOTH/PS/337-4913 


//^([0-9.]+\/)(.+)
//[3]
//111.73/CARROLL/PS/

//^([0-9.]+\/)(.+\/)([0-9-.]+)
//6.26/PFLUM/603-6455
//58.64/SCALES/521-8140
//13.70/PARRISH,STK/747-8832
//15.56/WALKER/458-201-9839 
//0.00/MARTIN/954-9144

//^(.+\/)([0-9-.]+)
//MANLEY/PS/520-4610

//^([0-9.]+\/)(.+)
//[2]
//5.57/PFLUM
//45.94/PFLUM(2),STOCK
//26.45/RESTOCK 
//41.40/BAURER/

//^(.+\/)([0-9-.]+)
//RVSALES/689-3678
//RUPE/520-2307
//KUYKENDALL/517-1498
//WHITTAKER INVEST/953.-7032

function getPDFNumberNamePhone(str1) {
  var str = String(str1);
  var regexp = /^([0-9.]+\/)(.+\/)([0-9-.]+)/;
  var result = str.match(regexp)
  if (result != null) {
    var obj = [cleanPDFNumberNamePhoneString(result[1]), cleanPDFNumberNamePhoneString(result[2]), cleanPDFNumberNamePhoneString(result[3])];
    return obj;
  }
  regexp = /^([0-9.]+\/)(.+)/;
  result = str.match(regexp)
  if (result != null) {
    var obj = [cleanPDFNumberNamePhoneString(result[1]), cleanPDFNumberNamePhoneString(result[2]), ""];
    return obj;
  }
  regexp = /^(.+\/)([0-9-.]+)/;
  result = str.match(regexp)
  if (result != null) {
    var obj = ["", cleanPDFNumberNamePhoneString(result[1]), cleanPDFNumberNamePhoneString(result[2])];
    return obj;
  }

  return null;
}

function cleanPDFNumberNamePhoneString(str) {

  //Remove multiple spaces
  var str2 = String(str).replace(/ {2,}/g, " ");

  //Remove spaces at beginning of string
  if (str2.length > 0 && str2.charAt(0) == " ")
    str2 = str2.substring(1, str2.length);

  //Remove spaces at end of string
  if (str2.length > 0 && str2.charAt(str2.length - 1) == " ")
    str2 = str2.substring(0, str2.length - 1);

  //Remove / at beginning of string
  if (str2.length > 0 && str2.charAt(0) == "/")
    str2 = str2.substring(1, str2.length);

  //Remove / at end of string
  if (str2.length > 0 && str2.charAt(str2.length - 1) == "/")
    str2 = str2.substring(0, str2.length - 1);

  return str2;
}

//|X 421 Y    436| Pick Ticket No.
//|X  26 YMAX 377| Ordered starts (Line 55), 1 line per part 
//|X  74 YMAX 377| Shipped, 1 line per part (DATE LINE 51 IS ALSO AT X 74)
//|X 124 YMAX 377| Back order, 1 line per part
//|X 203 YMAX 377| Item No./Description, variable lines per part, always 23 lines long
//|X 458 YMAX 377| Price, 1 line per part 
//|X 516 YMAX 377| Amount, 1 line per part
//|X  38 Y     62| (LAST PAGE) Subtotal
//|X 121 Y     62| (LAST PAGE) Shipping & Handling
//|X 200 Y     62| (LAST PAGE) Tax
//|X 276 Y     62| (LAST PAGE) Subtotal
//|X 355 Y     62| (LAST PAGE) Deposit
//|X 510 Y     62| (LAST PAGE) Balance Due
//|X 181 YMAX 377| U/M 1 line per part
//WLMAY address info, 7 lines
//|X 420 YMAX 377| Retail price, variable lines per part, first non-empty string is start of part section 

//Ordered, Shipped, Back Order - parse until something with letters in it or more than 1 ., divide into 3 sections
//Next 23 lines are Item No./Description
//Price, Amount - Parse two times length of Ordered array, then divide into 2 sections, parse until theres a line with letters, then next line in x.xx number format is retail price
//Retail price, use spacing to divide out Item No./Description array


//Save array of y positions from ORDERED String Positions, multiply position by numpages - (currentpage - 1)

var pageOn = 1;
var pdfOn;
var textContentArrayAll = [];
function getPdfText(url) {
  document.getElementById("wlmay_pdf_name").innerHTML = $("#import_wlmay_pdf_input").get(0).files[0].name;
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function (pdf) {
    // console.log('PDF loaded ' + pdf.numPages);
    pageOn = 1;
    pdfOn = pdf;
    textContentArrayAll = [];
    processPage();
  });
}

function processPage() {
  if (pageOn <= pdfOn.numPages) {
    pdfOn.getPage(pageOn).then(function (page) {
      page.getTextContent().then(function (textContent) {
        var textContentArray = textContent.items;
        textContentArray.sort(COMPARE_PDF_TEXT_POSITIONS);
        for (var i = 0; i < textContentArray.length; ++i) //Multiply heights to be higher at top of page
        {
          textContentArray[i].adjustedHeight = Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) + (10000 * (pdfOn.numPages - pageOn));
          // console.log("X " + textContentArray[i].transform[PDF_TRANSFORM_X] + "| Y " + textContentArray[i].adjustedHeight + "|" + textContentArray[i].str);
        }
        textContentArrayAll = textContentArrayAll.concat(textContentArray);

        if (pageOn == 1) //First Page
        {
          //Invoice NO. 523 715
          //Invoice Date. 530 693
          //Customer Purchase Order No. 43 471
          setPDFTableValue(findPDFTextContentIndexByPosition(523, 715, textContentArray, null, null), textContentArray, "wlmay_pdf_invoice_no_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(530, 693, textContentArray, null, null), textContentArray, "wlmay_pdf_invoice_date_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(43, 471, textContentArray, null, null), textContentArray, "wlmay_pdf_customer_po_no_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(421, 436, textContentArray, null, null), textContentArray, "wlmay_pdf_pick_ticket_input");
          var date = document.getElementById("wlmay_pdf_invoice_date_input").value;
          var date0 = new Date(date);
          document.getElementById("wlmay_pdf_invoice_date_input").value = getMMDDYYYYText(date0, "/");
        }

        if (pageOn == pdfOn.numPages) //Last Page
        {
          setPDFTableValue(findPDFTextContentIndexByPosition(38, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_subtotal0_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(121, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_s&h_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(200, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_tax_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(276, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_subtotal1_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(355, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_deposit_input");
          setPDFTableValue(findPDFTextContentIndexByPosition(510, 62, textContentArray, null, null), textContentArray, "wlmay_pdf_balancedue_input");

          var ORDERED_Indexes = findPDFTextContentIndexByPosition(26, null, textContentArrayAll, 377, null);
          var SHIPPED_Indexes = findPDFTextContentIndexByPosition(74, null, textContentArrayAll, 377, null);
          var BACKORDERED_Indexes = findPDFTextContentIndexByPosition(124, null, textContentArrayAll, 377, null);
          var ITEMDESC_Indexes = findPDFTextContentIndexByPosition(203, null, textContentArrayAll, 377, null);
          var RETAILPRICE_Indexes = findPDFTextContentIndexByPosition(420, null, textContentArrayAll, 377, null);
          var PRICE_Indexes = findPDFTextContentIndexByPosition(458, null, textContentArrayAll, 377, null);
          var AMOUNT_Indexes = findPDFTextContentIndexByPosition(516, null, textContentArrayAll, 377, null);
          var tableHTML = "<table id='wlmay_pdf_parts_table'><tr><th></th><th>Ordered</th><th>Shipped</th><th>Back Ordered</th><th>Item NO./Description</th><th>Retail Price</th><th>Price</th><th>Amount</th></tr>";
          var current_ITEMDESC_Index = 0;
          var columnRowIndexes = [0, 0, 0]; //RETAILPRICE, PRICE, AMOUNT
          for (var i = 0; i < ORDERED_Indexes.length; ++i) {
            tableHTML += "<tr id='table_pdfimport_row_" + i + "' style='vertical-align: top;'>";
            tableHTML += "<td><button style='background-color: #70A2FF; color: black; height: 100px;' id='startAddToDatabaseButton_" + i + "' onclick='generatePDFAddToDatabaseTable(" + i + ");'><span style='color: white;'>A</span>dd to Database</button></td>"
            tableHTML += "<td><input class='pdf_input_small' onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[ORDERED_Indexes[i]].str)) + "'     id='pdf_ordered_" + i + "'></td>";
            tableHTML += "<td><input class='pdf_input_small' onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[SHIPPED_Indexes[i]].str)) + "'     id='pdf_shipped_" + i + "'></td>";
            tableHTML += "<td><input class='pdf_input_small' onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[BACKORDERED_Indexes[i]].str)) + "' id='pdf_backordered_" + i + "'></td>";

            var nextORDEREDHeight = -1;
            if (i < ORDERED_Indexes.length - 1) //Not on last part
            {
              nextORDEREDHeight = textContentArrayAll[ORDERED_Indexes[i + 1]].adjustedHeight;
            }
            tableHTML += "<td><textarea id='pdf_description_" + i + "' onfocus='deselectTable();' style='width: 200px; height: 90px;'>";
            var numberNamePhone = null;
            while (current_ITEMDESC_Index < ITEMDESC_Indexes.length && textContentArrayAll[ITEMDESC_Indexes[current_ITEMDESC_Index]].adjustedHeight > nextORDEREDHeight) {
              var str = removeExtraSpaces(textContentArrayAll[ITEMDESC_Indexes[current_ITEMDESC_Index]].str);
              if (str != "") {
                var numberNamePhoneTemp = getPDFNumberNamePhone(str);
                if (numberNamePhoneTemp != null)
                  numberNamePhone = numberNamePhoneTemp;
                tableHTML += getHTMLSafeText(removeExtraSpaces(textContentArrayAll[ITEMDESC_Indexes[current_ITEMDESC_Index]].str)) + "\n";
              }
              ++current_ITEMDESC_Index;
            }
            if (tableHTML.charAt(tableHTML.length - 1) == "\n")
              tableHTML = tableHTML.substring(0, tableHTML.length - 1);
            tableHTML += "</textarea>";
            if (numberNamePhone != null) {
              tableHTML += "<table><tr><th>REG</th><th>Name</th><th>Phone</th></tr>"
                + "<tr>"
                + "<td><input class='pdf_input_large' onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[0]) + "' id='pdf_reg_" + i + "'></td>"
                + "<td><input class='pdf_input_large' onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[1]) + "' id='pdf_customername_" + i + "'></td>"
                + "<td><input class='pdf_input_large' onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[2]) + "' id='pdf_customerphone_" + i + "'></td>"
                + "</tr></table>";
            }
            tableHTML += "</td>";

            tableHTML += getPDFInputHTML(columnRowIndexes, 0, RETAILPRICE_Indexes, nextORDEREDHeight, "pdf_retailprice_" + i);
            tableHTML += getPDFInputHTML(columnRowIndexes, 1, PRICE_Indexes, nextORDEREDHeight, "pdf_yourprice_" + i);
            tableHTML += getPDFInputHTML(columnRowIndexes, 2, AMOUNT_Indexes, nextORDEREDHeight, "pdf_totalamount_" + i);

            tableHTML += "</tr><tr><td id='pdf_add_to_database_table_" + i + "' colspan=8></td></tr>";
          }
          tableHTML += "</table>";
          document.getElementById("wlmay_pdf_parts_table_div").innerHTML = tableHTML;
          var ele = document.getElementById("pdf_ordered_0");
          if (ele != null && ele.style.display != "none") {
            ele.focus();
            ele.select();
          }
          setKeyboardShortcutBar();
          set_tablePDFImport_SelectedRow(0);
        }
        else {
          ++pageOn;
          processPage();
        }
      });
    });
  }
}

function importInputKeyUp(index) {
  errorCheckPartsImport();
  if (document.getElementById("import_part_form_not_found_" + index) != null) {
    generatePDFAddToDatabaseTable(index);
  }
  else if (document.getElementById("import_part_form_" + index) != null) {
    generatePDFAddToDatabaseTable(index);
  }
}

function populateImportPageOBJ(objs) { //For use with non pdf file upload (ocr)
  document.getElementById("fileinput_wait_for_scan").style.display = "none";
  document.getElementById("wlmay_pdf_name").innerHTML = "";
  _import_page_populated = true;
  document.getElementById("fileinput_controls").style.display = "none";
  document.getElementById("wlmay_pdf_table_div").style.display = "block";
  var date = "";
  if (objs.length > 0) {
    date = objs[0].date;
    if (date != "") {
      var date0 = new Date(date);
      date = getMMDDYYYYText(date0, "/");
    }
  }
  var tableHTML = "<h3>Date</h3><input id='ocr_import_date' onfocus='deselectTable();' type='text' style='width: 150px; height: 30px; font-size: 20pt;' value='" + date + "'> <br>" +
    "<table id='wlmay_pdf_parts_table'><tr><th style='width: 50px;'></th><th>Ordered</th><th style='width: 50px;'>Shipped</th><th style='width: 50px;'>Back Ordered</th><th>Item NO.</th><th style='width: 30px;'>Make</th><th>Descrip</th><th style='width: 40px;'>Retail Price</th><th style='width: 40px;'>Price</th><th style='width: 40px;'>Amount</th></tr>";
  for (var i = 0; i < objs.length; ++i) {
    var reg = objs[i].reg;
    if (objs[i].make == null)
      objs[i].make = "";
    if (objs[i].descrip == null)
      objs[i].descrip = "";
    tableHTML += "<tr id='table_pdfimport_row_" + i + "' style='vertical-align: top;'>";
    tableHTML += "<td><button style='background-color: #70A2FF; color: black; height: 40px;' id='startAddToDatabaseButton_" + i + "' onclick='generatePDFAddToDatabaseTable(" + i + ");'><span style='color: white;'>A</span>dd to Database</button></td>"
    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_small' onfocus='deselectTable();' type='text' value='" + Number(objs[i].ordered) + "' id='pdf_ordered_" + i + "'>" +
      "<div style='display: flexbox; flex-direction: row;'><input onkeyup='importInputKeyUp(" + i + ");' onchange='importInputKeyUp(" + i + ");' class='pdf_input_small' onfocus='deselectTable();' type='number' min='0' value='0' id='input_willCall_" + i + "'>Will Call</div>" +
      "<div style='display: flexbox; flex-direction: row;'><input onkeyup='importInputKeyUp(" + i + ");' onchange='importInputKeyUp(" + i + ");' class='pdf_input_small' onfocus='deselectTable();' type='number' min='0' value='" + Number(objs[i].shipped) + "' id='input_stock_" + i + "'>Stock</div>" +
      "<div id='pdf_import_ordered_foot_" + i + "'></div>" +
      "</td>";
    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_small' onfocus='deselectTable();' type='text' value='" + Number(objs[i].shipped) + "' id='pdf_shipped_" + i + "'>"
    tableHTML += "<div id='pdf_import_shipped_foot_" + i + "'></div>";
    tableHTML += "</td>";
    tableHTML += "<td><input onkeyup='errorCheckPartsImport();' class='pdf_input_small' onfocus='deselectTable();' type='text' value='" + Number(objs[i].backordered) + "' id='pdf_backordered_" + i + "'></td>";

    tableHTML += "<td><textarea onkeyup='importInputKeyUp(" + i + ");' id='pdf_description_" + i + "' onfocus='deselectTable();' style='width: 100px; height: 30px;'>";
    tableHTML += getHTMLSafeText(removeExtraSpaces(objs[i].pn));
    tableHTML += "</textarea>";
    if (reg != null && reg != "")
      tableHTML += "<div style='background-color: white;'>REG<input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(reg)) + "' onfocus='deselectTable();' id='pdf_reg_" + i + "' style='width: 40px;'></div>"
    tableHTML += "</td>";

    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(objs[i].make)) + "' onfocus='deselectTable();' id='pdf_make_" + i + "' style='width: 30px;'></td>";
    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(objs[i].descrip)) + "' onfocus='deselectTable();' id='pdf_descrip_" + i + "' style='width: 100px;'></td>";
    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(objs[i].msrp)) + "' onfocus='deselectTable();' id='pdf_retailprice_" + i + "' style='width: 40px;'></td>";
    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(objs[i].price)) + "' onfocus='deselectTable();' id='pdf_yourprice_" + i + "' style='width: 40px;'></td>";
    tableHTML += "<td><input onkeyup='importInputKeyUp(" + i + ");' class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(objs[i].total)) + "' onfocus='deselectTable();' id='pdf_totalamount_" + i + "' style='width: 40px;'>";
    tableHTML += "<div id='pdf_import_amount_foot_" + i + "'></div>";
    tableHTML += "</td>";

    tableHTML += "</tr><tr><td id='pdf_add_to_database_table_" + i + "' colspan=10></td></tr>";
  }
  var timeStamp = new Date().getTime();
  tableHTML += "</table>" +
    "<button id='button_toggle_img_zoom_container' style='position: absolute; left: 800px; top: 80px;' onclick='toggle_img_zoom_container();'>Hide Image</button>" +
    "<div id='img-zoom-container' class='img-zoom-container' style='position: absolute; left: 800px; top: 100px;'>" +
    "<img id='ocr_img' src='../Scans/my_scan2.png?" + timeStamp + "' width='300' height='300'>" +
    "<div id='ocr_zoom_result' class='img-zoom-result'></div>" +
    "</div>";
  document.getElementById("wlmay_pdf_parts_table_div").innerHTML = tableHTML;
  var ele = document.getElementById("pdf_ordered_0");
  if (ele != null && ele.style.display != "none") {
    ele.focus();
    ele.select();
  }
  setKeyboardShortcutBar();
  set_tablePDFImport_SelectedRow(0);
  imageZoom("ocr_img", "ocr_zoom_result");
  errorCheckPartsImport();
}

function getPDFInputHTML(columnRowIndexes, index, CONTENTIndexes, nextORDEREDHeight, id) {
  var tableHTML = "<td>";
  while (columnRowIndexes[index] < CONTENTIndexes.length && textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].adjustedHeight > nextORDEREDHeight) {
    var str = removeExtraSpaces(textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].str);
    if (str != "")
      tableHTML += "<input class='pdf_input_large' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].str)) + "' onfocus='deselectTable();' id='" + id + "'>";
    ++columnRowIndexes[index];
  }
  tableHTML += "</td>";
  return tableHTML;
}

function setPDFTableValue(index, textcontentArray, id1) {
  if (index != null)
    document.getElementById(id1).value = removeExtraSpaces(textcontentArray[index].str);
  else
    document.getElementById(id1).value = "";
}

// function sortPDFTextContentIndexes(textContentArray, indexes)
// {
//   var arrayToSort = [];
//   for(var i = 0; i < indexes.length; ++i)
//   {
//     arrayToSort.push([indexes[i], textContentArray[indexes[i]].transform[PDF_TRANSFORM_Y]]);
//   }
//   arrayToSort.sort(COMPARE_PDF_TEXT_POSITIONS);
//   var returnArray = [];
//   for(var i = 0; i < arrayToSort.length; ++i)
//   {
//     returnArray.push(arrayToSort[i][0]);
//   }
//   return returnArray;
// }

function COMPARE_PDF_TEXT_POSITIONS(a, b) {
  if (Number(a.transform[PDF_TRANSFORM_Y]) < Number(b.transform[PDF_TRANSFORM_Y])) {
    return 1;
  }
  if (Number(a.transform[PDF_TRANSFORM_Y]) > Number(b.transform[PDF_TRANSFORM_Y])) {
    return -1;
  }
  return 0;
}

var PDF_TRANSFORM_Y = 5;
var PDF_TRANSFORM_X = 4;
function findPDFTextContentIndexByPosition(px, py, textContentArray, YMaximum, YMinimum) {
  if (YMaximum != null && YMinimum != null) {
    var indexArray = [];
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) <= Number(YMaximum)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) >= Number(YMinimum))
        indexArray.push(i);
    return indexArray;
  }
  else if (YMaximum != null) {
    var indexArray = [];
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) <= Number(YMaximum))
        indexArray.push(i);
    return indexArray;
  }
  else if (YMinimum != null) {
    var indexArray = [];
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px)
        && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) >= Number(YMinimum))
        indexArray.push(i);
    return indexArray;
  }
  else {
    for (var i = 0; i < textContentArray.length; ++i)
      if (Number(textContentArray[i].transform[PDF_TRANSFORM_X]) == Number(px) && Number(textContentArray[i].transform[PDF_TRANSFORM_Y]) == Number(py))
        return i;
    return null;
  }
}

function cancelPDFAddToDatabase(index) {
  document.getElementById("pdf_add_to_database_table_" + index).innerHTML = "";
  setPDFAddToDatabaseButtons(true);
}

var _newREGs = new Map();
var _newSPLs = new Map();
var _newSHOP_QTYs = new Map();
var _newPNs = new Map();
var _newDESCRIP1s = new Map();
var _extraDBs_PDF = new Map();
var _extraDBLinks_PDF = new Map();
var _newDESCRIPs = new Map();
var _newMAKEs = new Map();
var _newDATEs = new Map();
var _newFROMs = new Map();
var _newCGSs = new Map();
function confirmPDFAddToDatabase(index) {
  var extradb = _extraDBs_PDF.get(index);
  var link = _extraDBLinks_PDF.get(index);
  var partObj = _content_extra[extradb][link][0];
  var originalObj = copyObj(partObj);
  partObj.REG = _newREGs.get(index);
  partObj.SPL = _newSPLs.get(index);
  partObj.SHOP_QTY = _newSHOP_QTYs.get(index);
  partObj.DESCRIP1 = _newDESCRIPs.get(index);
  partObj[_APPL_MFR_INDEXES[extradb]] = _newMAKEs.get(index);
  partObj.DATE = _newDATEs.get(index);
  partObj.FROM = _newFROMs.get(index);
  partObj.CGS = _newCGSs.get(index);
  document.getElementById("pdf_add_to_database_table_" + index).innerHTML = "";
  document.getElementById("startAddToDatabaseButton_" + index).innerHTML = "Added";
  document.getElementById("startAddToDatabaseButton_" + index).disabled = true;
  document.getElementById("startAddToDatabaseButton_" + index).className = "button_disabled";
  if (!_DEBUG_LOCAL_MODE) {
    writeToDatabase("parts_db/" + _EXTRA_DB[extradb] + "/" + _content_extra[extradb][link][1], partObj, true, false, true, extradb);
    var compare_str = getObjectCompareString(originalObj, partObj);
    if (compare_str != null)
      writeToChangeHistory("Edit | Child Record", "Edited Child Record from PDF Import in \"" + _EXTRA_DB[extradb] + "\" with PN \"" + originalObj.PN + "\" " + compare_str);
  }

  // var parent_indexes = getParentRecordIndexesWithChildPart(extradb, link);
  // for(var i = 0; i < parent_indexes.length; ++i)
  // {
  //   console.log("Updating " + parent_indexes[i]);
  //   updateReorder(parent_indexes[i]);
  // }
  setPDFAddToDatabaseButtons(true);
  showSnackbar("Updated child part " + partObj.PN, 5000);
}

function startPDFNewChildRecord(index) {
  var child_index = document.getElementById("pdf_new_partchild_select_" + index).selectedIndex;
  document.getElementById("part_child_dropdown_select").selectedIndex = child_index;
  setNewPartChildButton();
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  startNewPartChild();
  document.getElementById("partchild_new_input_REG").value = _newREGs.get(index);
  document.getElementById("partchild_new_input_SPL").value = _newSPLs.get(index);
  document.getElementById("partchild_new_input_SHOP_QTY").value = _newSHOP_QTYs.get(index);
  var descrip = _newDESCRIP1s.get(index);
  if (_newDESCRIPs.get(index) != "") //Descrip added for OCR with Marcone and ReliableParts
    descrip = _newDESCRIPs.get(index);
  document.getElementById("partchild_new_input_DESCRIP1").value = descrip;
  document.getElementById("partchild_new_input_PN").value = _newPNs.get(index);
  document.getElementById("partchild_new_input_" + _APPL_MFR_INDEXES[child_index]).value = _newMAKEs.get(index);
  document.getElementById("partchild_new_input_DATE").value = _newDATEs.get(index);
  document.getElementById("partchild_new_input_FROM").value = _newFROMs.get(index);
  document.getElementById("partchild_new_input_CGS").value = _newCGSs.get(index);
}

function setPDFAddToDatabaseButtons(show) {
  var inc = 0;
  var ele = document.getElementById("startAddToDatabaseButton_" + inc);
  while (ele != null) {
    if (show)
      ele.style.display = "";
    else
      ele.style.display = "none";
    ++inc;
    ele = document.getElementById("startAddToDatabaseButton_" + inc);
  }
}

//0 100 - 3 errors
// 4 96 - 4 errors
// 5 95 - 2 errors
// 7 92 - 3 errors
// 9 89 - 3 errors
//10 90 - 2 errors
//11 91 - 2 errors
//15 85 - 3 errors
//20 80 - 3 errors
//Prices $972 $34 03


// -Repeat
// -Move down lines until backordered, shipped, or ordered is found, move back 3, 2, 1 lines for each
// -Search every word on the line for a matching PN, if multiple found, use the longest found, if none found, use the one with a number letter mix
// -Skip to next line
// -First number is amount ordered, next number is price, account for spaces between numbers as decimals OCR missed and numbers and signs mixed in
// -Skip to next line
// -First number is shipped, next is total
// -Skip to next line
// -First number is backordered, next is MSRP

var _import_page_populated = false;

function import_Marcone_OCR_Text() {
  _pdf_or_ocr_mode = 1;
  var ocr_results = [];
  fetch("./Scans/ocr.txt")
    .then(function (response) {
      response.text().then(function (text) {
        text = text.replace(/\r/g, "");
        var textArray = text.split("\n");
        for (var i = 0; i < textArray.length; ++i)
          textArray[i] = textArray[i].split(" ");
        var textArrayFinal = [];

        //Cull empty lines and non standard symbol words
        for (var i = 0; i < textArray.length; ++i) {
          var words = [];
          for (var j = 0; textArray[i] != null && i < textArray.length && j < textArray[i].length; ++j) {
            var std = standardizeString(textArray[i][j]);
            if (std.length > 0 || textArray[i][j] == "|")
              words.push(textArray[i][j]);
          }
          if (words.length > 0)
            textArrayFinal.push(words);
        }

        let keywords = ["ordered", "shipped", "backordered"];
        if (textArrayFinal.length > 0) {
          var line = 0;
          //Main loop for each part order
          var date = "";
          var date_found = false;
          var func = function () {
            let match;
            for (var i2 = 0; !date_found && line < textArrayFinal.length && i2 < textArrayFinal[line].length; ++i2) {
              //Match xx/xx/xx pattern
              var regexp = new RegExp(/\d+\/\d+\/\d+/, "g");
              if ((match = regexp.exec(textArrayFinal[line][i2])) !== null) {
                date_found = true;
                date = match[0];
              }
            }

            var pn = "";
            var link = null;
            var pns = [];
            var line2 = null;
            //Check for a part number on the current line
            for (var i = 0; pn == "" && i < textArrayFinal[line].length; ++i) {
              var word = textArrayFinal[line][i].toLowerCase();
              for (var k = keywords.length - 1; pn == "" && k >= 0; --k) { //Go backwards through list because backordered could be detected as ordered
                var regexp = new RegExp(keywords[k], "g");
                if (regexp.exec(word) !== null) {
                  line2 = line - (k + 1); //Go back up to pn line by distance that keyword is set at
                  for (var i2 = 0; i2 < textArrayFinal[line2].length; ++i2) { //Search each word on that line
                    var pn0 = textArrayFinal[line2][i2];
                    for (var j = 0; j < _EXTRA_DB.length; ++j) {
                      link = getExtraDBLinkIndex(j, pn0);
                      if (link != null) {
                        pns.push(pn0);
                      }
                    }
                  }
                  if (pns.length > 0) {
                    pn = longestString(pns);
                  } else { //No words from line matched a PN in the database
                    for (var i2 = 0; i2 < textArrayFinal[line2].length; ++i2) { //Search each word on that line
                      var pn0 = textArrayFinal[line2][i2];
                      if (isStringNumberLetterMix(pn0)) {
                        pn = pn0;
                        break;
                      }
                    }
                    if (pn == "") { //If no numberlettermix string found, search for all numeric one
                      for (var i2 = 0; i2 < textArrayFinal[line2].length; ++i2) { //Search each word on that line
                        var pn0 = standardizeString(textArrayFinal[line2][i2]);
                        if (is_numeric(pn0)) {
                          pn = pn0;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
            if (pn == "") {
              ++line;
            }
            else {
              if (line2 != null) {
                var len = textArrayFinal[line2].length - 1;
                var descrip = "";
                while (len >= 0) {
                  var descrip0 = textArrayFinal[line2][len];
                  if (descrip0 != pn) {
                    if (descrip != "")
                      descrip = descrip0 + " " + descrip;
                    else
                      descrip = descrip0;
                  }
                  else
                    break;
                  --len;
                }

                len = 0;
                var make = "";
                while (len < textArrayFinal[line2].length) {
                  var make0 = textArrayFinal[line2][len];
                  if (make0 != pn) {
                    if (make != "")
                      make = make + " " + make0;
                    else
                      make = make0;
                  }
                  else
                    break;
                  ++len;
                }

                var line0 = line2 + 1;
                //If number found, check if next index is also a number and add a decimal point between them
                var results_obj = new Object();
                results_obj.pn = pn;
                results_obj.make = make;
                results_obj.descrip = descrip;
                results_obj.date = date;
                _current_FROM = "MARCONE";
                for (var i0 = 0; i0 < 3; ++i0) {
                  var lastMatch = null;
                  var number1 = "";
                  var number2 = "";
                  for (var i = textArrayFinal[line0].length - 1; i >= 0; --i) {
                    var number = numberize_OCR_String(textArrayFinal[line0][i]);
                    var regexp = new RegExp("[0-9]+", "g");
                    if (regexp.exec(number) !== null) {
                      if (lastMatch != null) { //If OCR replaced the decimal with a space, adds it back in
                        if (number2 != "") {
                          number2 = number + "." + lastMatch;
                        }
                        else if (number1 != "") {
                          number1 = number + "." + lastMatch;
                        }
                        lastMatch = null;
                      }
                      else {
                        if (number1 == "") {
                          number1 = number;
                        }
                        else if (number2 == "") {
                          number2 = number;
                        }
                        lastMatch = number;
                      }
                    }
                    else
                      lastMatch = null;
                  }
                  switch (i0) {
                    case 0:
                      results_obj.ordered = number2;
                      results_obj.price = number1;
                      break;
                    case 1:
                      results_obj.shipped = number2;
                      results_obj.total = number1;
                      break;
                    case 2:
                      results_obj.backordered = number2;
                      results_obj.msrp = number1;
                      break;
                  }
                  ++line0;
                }

                if (Number(results_obj.ordered) == 0 && Number(results_obj.shipped != 0))
                  results_obj.ordered = results_obj.shipped;

                ocr_results.push(results_obj);
                line = line0;
              }
            }
            if (line < textArrayFinal.length) {
              showSnackbar("Processing line " + (line + 1) + " of " + textArrayFinal.length, 1000);
              setTimeout(func, 20); //Timeout to allow snackbar to show progress
            }
            else {
              populateImportPageOBJ(ocr_results);
            }
          };
          func();
        } else {
          showSnackbar("Too little recognizable text found", 3000);
        }
      });
    });
  if (!_import_page_populated) {
    document.getElementById("fileinput_controls").style.display = "";
    document.getElementById("fileinput_wait_for_scan").style.display = "none";
  }
  _import_page_populated = false;
}
// 30 80 - 4 - Not usable, breaks up into 2 columns
// 40 70 - 6
//Qty - I | l i i!

// -Repeat
// -Search for a line that has ordered, shipped, backorder, product, suggested on it
// -Skip to next line
// -Look for EA
// -Look at word before and after EA for numbers for Ordered and Shipped
// -Look for word after second number that's more than 2 letters long for PN
// -Look at last 3 words and account for spaces to find MSRP, Price, Amount
function import_ReliableParts_OCR_Text() {
  _pdf_or_ocr_mode = 1;
  var ocr_results = [];
  fetch("./Scans/ocr.txt")
    .then(function (response) {
      response.text().then(function (text) {
        text = text.replace(/\r/g, "");
        var textArray = text.split("\n");
        for (var i = 0; i < textArray.length; ++i)
          textArray[i] = textArray[i].split(" ");
        var textArrayFinal = [];

        //Cull empty lines and non standard symbol words
        for (var i = 0; i < textArray.length; ++i) {
          var words = [];
          for (var j = 0; textArray[i] != null && i < textArray.length && j < textArray[i].length; ++j) {
            var std = standardizeString(textArray[i][j]);
            if (std.length > 0 || textArray[i][j] == "|")
              words.push(textArray[i][j]);
          }
          if (words.length > 0)
            textArrayFinal.push(words);
        }

        let keywords = ["ordered", "shipped", "backorder", "product", "suggested"];
        if (textArrayFinal.length > 0) {
          var line = -1;
          var keyword_found = false;
          var date = "";
          var date_found = false;
          //Main loop for each part order
          var func = function () {
            ++line;
            //Check for a part number on the current line

            let match;
            for (var i2 = 0; !date_found && line < textArrayFinal.length && i2 < textArrayFinal[line].length; ++i2) {
              //Match xx/xx/xx pattern
              var regexp = new RegExp(/\d+\/\d+\/\d+/, "g");
              if ((match = regexp.exec(textArrayFinal[line][i2])) !== null) {
                date_found = true;
                date = match[0];
              }
            }

            if (!keyword_found) {
              for (var i = 0; !keyword_found && line < textArrayFinal.length && i < textArrayFinal[line].length; ++i) {
                var word = textArrayFinal[line][i].toLowerCase();
                for (var k = 0; !keyword_found && k < keywords.length; ++k) {
                  var regexp = new RegExp(keywords[k], "g");
                  if (regexp.exec(word) !== null) {
                    keyword_found = true;
                    ++line;
                  }
                }
              }
            }
            if (keyword_found && line < textArrayFinal.length) {
              var ea_found = false;
              for (var i = 0; !ea_found && i < textArrayFinal[line].length; ++i) {
                if (textArrayFinal[line][i].toLowerCase() == "ea") {
                  ea_found = true;
                  var ordered = "";
                  var shipped = "";
                  var backordered = "";
                  var replacements_map = new Map();
                  replacements_map.set("I", "1");
                  replacements_map.set("|", "1");
                  replacements_map.set("l", "1");
                  replacements_map.set("i", "1");
                  if (i > 0)
                    ordered = numberize_OCR_String(textArrayFinal[line][i - 1], replacements_map);
                  if (i < textArrayFinal[line].length - 1)
                    shipped = numberize_OCR_String(textArrayFinal[line][i + 1], replacements_map);

                  //Find PN
                  var i3 = i + 2;
                  var pn = "";
                  var pn_i = -1;
                  while (i3 < textArrayFinal[line].length) {
                    if (textArrayFinal[line][i3].length > 2) {
                      pn = textArrayFinal[line][i3];
                      pn_i = i3;
                      break;
                    }
                    else
                      backordered = numberize_OCR_String(textArrayFinal[line][i3], replacements_map);
                    ++i3;
                  }

                  var last_nums = getNumsBeforePointInArray2(textArrayFinal[line], textArrayFinal[line].length, 3);
                  // last_nums.reverse();

                  // _lastNums_lastIndex //This is a global variable that getNumsBeforePointInArray2 sets so we can find the smallest index that a number was found in
                  var make = "";
                  --_lastNums_lastIndex;
                  if (_lastNums_lastIndex > pn_i)
                    make = textArrayFinal[line][_lastNums_lastIndex];

                  var descrip = "";
                  if (pn_i >= 0)
                    for (var i4 = pn_i + 1; i4 < _lastNums_lastIndex; ++i4) {
                      if (descrip == "")
                        descrip = textArrayFinal[line][i4];
                      else
                        descrip += " " + textArrayFinal[line][i4];
                    }


                  var results_obj = new Object();
                  results_obj.pn = pn;
                  results_obj.ordered = ordered;
                  results_obj.shipped = shipped;
                  results_obj.backordered = backordered;
                  results_obj.make = make;
                  results_obj.descrip = descrip;
                  results_obj.date = date;
                  _current_FROM = "RELIABLE";
                  if (last_nums.length > 0)
                    results_obj.total = last_nums[0];
                  if (last_nums.length > 1)
                    results_obj.price = last_nums[1];
                  if (last_nums.length > 2)
                    results_obj.msrp = last_nums[2];

                  if (Number(results_obj.ordered) == 0 && Number(results_obj.shipped != 0))
                    results_obj.ordered = results_obj.shipped;

                  ocr_results.push(results_obj);
                  break;
                }
              }
            }

            if (line < textArrayFinal.length) {
              showSnackbar("Processing line " + (line + 1) + " of " + textArrayFinal.length, 1000);
              setTimeout(func, 20); //Timeout to allow snackbar to show progress
            }
            else {
              populateImportPageOBJ(ocr_results);
            }
          }
          func();
        } else {
          showSnackbar("Too little recognizable text found", 3000);
        }
      });
    });
  if (!_import_page_populated) {
    document.getElementById("fileinput_controls").style.display = "";
    document.getElementById("fileinput_wait_for_scan").style.display = "none";
  }
  _import_page_populated = false;
}

// | in between prices
// 79 79 interpreted as 79.79 should be .79 .79

// -Repeat
// -Search for a line that has ordered, shipped, description, retail, price, amount
// -Skip to next line
// -Look for EA
// -Look at numbers before EA for ordered, shipped, backordered
// -Look for word after EA that's more than 3 letters long for PN, remove | [ ] \ / { } at beginning if it exists
// -Look at last 3 words and account for spaces to find MSRP, Price, Amount
function import_WLMay_OCR_Text() {
  _pdf_or_ocr_mode = 1;
  var ocr_results = [];
  fetch("./Scans/ocr.txt")
    .then(function (response) {
      response.text().then(function (text) {
        text = text.replace(/\r/g, "");
        var textArray = text.split("\n");
        for (var i = 0; i < textArray.length; ++i)
          textArray[i] = textArray[i].split(" ");
        var textArrayFinal = [];

        //Cull empty lines and non standard symbol words
        for (var i = 0; i < textArray.length; ++i) {
          var words = [];
          for (var j = 0; textArray[i] != null && i < textArray.length && j < textArray[i].length; ++j) {
            var std = standardizeString(textArray[i][j]);
            if (std.length > 0 || textArray[i][j] == "|")
              words.push(textArray[i][j]);
          }
          if (words.length > 0)
            textArrayFinal.push(words);
        }

        let keywords = ["ordered", "shipped", "description", "retail", "price", "amount"];
        if (textArrayFinal.length > 0) {
          var line = -1;
          var keyword_found = false;
          var date = "";
          var date_found = false;
          //Main loop for each part order
          var descrip = "";
          var reg = "";
          var func = function () {
            ++line;

            //Check for date on this line
            let match;
            for (var i2 = 0; !date_found && line < textArrayFinal.length && i2 < textArrayFinal[line].length; ++i2) {
              //Match xx/xx/xx pattern
              var regexp = new RegExp(/\d+\/\d+\/\d+/, "g");
              if ((match = regexp.exec(textArrayFinal[line][i2])) !== null) {
                date_found = true;
                date = match[0];
              }
            }

            //Check for a part number on the current line
            if (!keyword_found) {
              for (var i = 0; !keyword_found && line < textArrayFinal.length && i < textArrayFinal[line].length; ++i) {
                var word = textArrayFinal[line][i].toLowerCase();
                for (var k = 0; !keyword_found && k < keywords.length; ++k) {
                  var regexp = new RegExp(keywords[k], "g");
                  if (regexp.exec(word) !== null) {
                    keyword_found = true;
                    ++line;
                  }
                }
              }
            }
            if (keyword_found && line < textArrayFinal.length) {
              var ea_found = false;
              var descrip_temp = "";
              for (var i = 0; !ea_found && line < textArrayFinal.length && i < textArrayFinal[line].length; ++i) {
                if (ocr_results.length > 0 && line != textArrayFinal.length - 1) { //Don't check for descrip on last line
                  let match;
                  var regexp = new RegExp(/\d+\.\d+\//, "g"); //Find regular price with slash after it
                  if ((match = regexp.exec(textArrayFinal[line][i])) != null) {
                    reg = match[0].substring(0, match[0].length - 1);
                  }
                  regexp = new RegExp("stock", "g");
                  if (regexp.exec(textArrayFinal[line][i].toLowerCase()) == null) {
                    if (descrip_temp == "")
                      descrip_temp = textArrayFinal[line][i];
                    else
                      descrip_temp += " " + textArrayFinal[line][i];
                  }
                }

                regexp = new RegExp("ea", "g");
                if (regexp.exec(textArrayFinal[line][i].toLowerCase()) !== null) {
                  ea_found = true;
                  var ordered = "";
                  var shipped = "";
                  var backordered = "";

                  var last_nums = getNumsBeforePointInArray(textArrayFinal[line], i, 3);

                  if (last_nums.length > 0)
                    backordered = last_nums[0];
                  if (last_nums.length > 1)
                    shipped = last_nums[1];
                  if (last_nums.length > 2)
                    ordered = last_nums[2];

                  //Find PN
                  var i3 = i + 1;
                  var pn = "";
                  while (i3 < textArrayFinal[line].length) {
                    if (textArrayFinal[line][i3].length > 3) {
                      pn = textArrayFinal[line][i3];
                      var c = pn.charAt(0);
                      if (c == '|' || c == '[' || c == ']' || c == '\\' || c == '/' || c == '{' || c == '}')
                        pn = pn.substring(1, pn.length);
                      break;
                    }
                    ++i3;
                  }

                  last_nums = getNumsBeforePointInArray(textArrayFinal[line], textArrayFinal[line].length, 3, 2);

                  var results_obj = new Object();
                  results_obj.pn = pn;
                  results_obj.ordered = ordered;
                  results_obj.shipped = shipped;
                  results_obj.backordered = backordered;
                  results_obj.date = date;
                  results_obj.reg = reg;
                  _current_FROM = "WLMAY";
                  if (last_nums.length > 0)
                    results_obj.total = last_nums[0];
                  if (last_nums.length > 1)
                    results_obj.price = last_nums[1];
                  if (last_nums.length > 2)
                    results_obj.msrp = last_nums[2];

                  if (Number(results_obj.ordered) == 0 && Number(results_obj.shipped != 0))
                    results_obj.ordered = results_obj.shipped;

                  ocr_results.push(results_obj);
                  break;
                }
              }
              if (ea_found) {
                if (ocr_results.length > 1) {
                  ocr_results[ocr_results.length - 2].descrip = descrip;
                  ocr_results[ocr_results.length - 2].reg = reg;
                  descrip = "";
                  reg = "";
                }
              }
              else if (line == textArrayFinal.length - 1) {
                if (ocr_results.length > 0) {
                  ocr_results[ocr_results.length - 1].descrip = descrip;
                  ocr_results[ocr_results.length - 1].reg = reg;
                  descrip = "";
                  reg = "";
                }
              }
              else {
                if (descrip == "")
                  descrip = descrip_temp; //Only get first line under each part for Descrip
                // else
                //   descrip += " " + descrip_temp;
              }
            }

            if (line < textArrayFinal.length) {
              showSnackbar("Processing line " + (line + 1) + " of " + textArrayFinal.length, 1000);
              setTimeout(func, 20); //Timeout to allow snackbar to show progress
            }
            else {
              populateImportPageOBJ(ocr_results);
            }
          }
          func();
        } else {
          showSnackbar("Too little recognizable text found", 3000);
        }
      });
    });

  if (!_import_page_populated) {
    document.getElementById("fileinput_controls").style.display = "";
    document.getElementById("fileinput_wait_for_scan").style.display = "none";
  }
  _import_page_populated = false;
}

var _OCR_M = 0;
var _OCR_RP = 1;
var _OCR_W = 2;
var _waitingForScan = false;
var _last_ocrtxt_dm = null;
function waitForScan(source) {
  if (!_waitingForScan) {
    _waitingForScan = true;
    document.getElementById("fileinput_controls").style.display = "none";
    document.getElementById("fileinput_wait_for_scan").style.display = "";

    try {
      var req = new XMLHttpRequest();
      req.open("HEAD", "Scans/ocr.txt", false);
      req.send(null);
      if (req.status == 200) {
        _last_ocrtxt_dm = req.getResponseHeader('Last-Modified');
      }
      // else return false;
    } catch (er) {
      // return er.message;
    }

    var func = function () {
      if (_waitingForScan) {
        try {
          var req = new XMLHttpRequest();
          req.open("HEAD", "Scans/ocr.txt", false);
          req.send(null);
          if (req.status == 200) {
            var dm = req.getResponseHeader('Last-Modified');
            if (dm != _last_ocrtxt_dm) {
              fetch("./Scans/ocr.txt")
                .then(function (response) {
                  response.text().then(function (text) {
                    if (text != "") {
                      _waitingForScan = false;
                      setTimeout(function () {
                        switch (source) {
                          case _OCR_M:
                            import_Marcone_OCR_Text();
                            break;
                          case _OCR_RP:
                            import_ReliableParts_OCR_Text();
                            break;
                          case _OCR_W:
                            import_WLMay_OCR_Text();
                            break;
                        }
                      }, 2000);
                    }
                  });
                });
            }
          }
          // else return false;
        } catch (er) {
          // return er.message;
        }
        setTimeout(func, 1000);
      }
    }
    func();
  }
}

function cancel_scan() {
  _waitingForScan = false;
  document.getElementById("fileinput_controls").style.display = "";
  document.getElementById("fileinput_wait_for_scan").style.display = "none";
}

function errorCheckPartsImport() {
  var i = 0;
  var ele = document.getElementById("pdf_ordered_" + 0);
  while (ele != null) {
    var ordered = document.getElementById("pdf_ordered_" + i).value;
    var shipped = document.getElementById("pdf_shipped_" + i).value;
    var price = document.getElementById("pdf_yourprice_" + i).value;
    var amount = document.getElementById("pdf_totalamount_" + i).value;
    var stock = document.getElementById("input_stock_" + i).value;
    var willCall = document.getElementById("input_willCall_" + i).value;
    var pdf_ordered_color = "";
    var pdf_shipped_color = "";
    var pdf_yourprice_color = "";
    var pdf_totalamount_color = "";
    var input_stock_color = "";
    var input_willCall_color = "";

    if (multDecimalStr(ordered) != multDecimalStr(shipped)) {
      pdf_ordered_color = "Khaki";
      pdf_shipped_color = "Khaki";
      document.getElementById("pdf_import_shipped_foot_" + i).innerHTML = "<div style='background-color: Khaki; border-radius: 10px; padding: 5px;'>Warning: Confirm Ordered and Shipped amounts are different?</div>";
    }
    else {
      document.getElementById("pdf_import_shipped_foot_" + i).innerHTML = "";
    }
    if (multDecimalStr(ordered) * multDecimalStr(price) != multDecimalStr(amount) * 100) {
      pdf_ordered_color = "LightCoral";
      pdf_yourprice_color = "LightCoral";
      pdf_totalamount_color = "LightCoral";
      document.getElementById("pdf_import_amount_foot_" + i).innerHTML = "<div style='background-color: LightCoral; border-radius: 10px; padding: 5px;'>Error: Ordered Quantity X Price does not equal Amount</div>";
    } else {
      document.getElementById("pdf_import_amount_foot_" + i).innerHTML = "";
    }
    if (multDecimalStr(shipped) != (multDecimalStr(stock) + multDecimalStr(willCall))) {
      pdf_shipped_color = "LightCoral";
      input_stock_color = "LightCoral";
      input_willCall_color = "LightCoral";
      document.getElementById("pdf_import_ordered_foot_" + i).innerHTML = "<div style='background-color: LightCoral; border-radius: 10px; padding: 5px;'>Error: Will Call + Stock does not equal Amount Shipped</div>";
    } else {
      document.getElementById("pdf_import_ordered_foot_" + i).innerHTML = "";
    }

    document.getElementById("pdf_ordered_" + i).style.backgroundColor = pdf_ordered_color;
    document.getElementById("pdf_shipped_" + i).style.backgroundColor = pdf_shipped_color;
    document.getElementById("pdf_yourprice_" + i).style.backgroundColor = pdf_yourprice_color;
    document.getElementById("pdf_totalamount_" + i).style.backgroundColor = pdf_totalamount_color;
    document.getElementById("input_stock_" + i).style.backgroundColor = input_stock_color;
    document.getElementById("input_willCall_" + i).style.backgroundColor = input_willCall_color;
    ++i;
    ele = document.getElementById("pdf_ordered_" + i);
  }
}

function toggle_img_zoom_container() {
  if (document.getElementById("img-zoom-container").style.display == "none") {
    document.getElementById("button_toggle_img_zoom_container").innerHTML = "Hide Image";
    document.getElementById("img-zoom-container").style.display = "";
  }
  else {
    document.getElementById("button_toggle_img_zoom_container").innerHTML = "Show Image";
    document.getElementById("img-zoom-container").style.display = "none";
  }
}