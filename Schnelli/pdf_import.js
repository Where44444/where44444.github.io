document.getElementById("import_wlmay_pdf_input").onchange = function (event) {
  if (document.getElementById("import_wlmay_pdf_input").value != "") {
    var file = event.target.files[0];

    //Step 2: Read the file using file reader
    var fileReader = new FileReader();

    fileReader.onload = function () {

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

function cancelWLMAYPDF() {
  document.getElementById("wlmay_pdf_table_div").style.display = "none";
  document.getElementById("wlmay_input_div").style.display = "block";
  document.getElementById("import_wlmay_pdf_input").value = "";
  document.activeElement.blur();
  setKeyboardShortcutBar();
}

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

  var dealerprice_ele = document.getElementById("pdf_dealerprice_" + index);
  var yourprice_ele = document.getElementById("pdf_yourprice_" + index);
  var shippedamount_ele = document.getElementById("pdf_shipped_" + index);
  var dealerprice = "";
  var yourprice = "";
  var shippedamount = "";
  var newqty = "";
  if (dealerprice_ele != null)
    dealerprice = dealerprice_ele.value;
  if (yourprice_ele != null)
    yourprice = yourprice_ele.value;
  if (shippedamount_ele != null) {
    shippedamount = shippedamount_ele.value;
    newqty = Math.floor(Number(shippedamount));
  }

  if (link == null) {
    var notFoundHTML = "<span style='color: red;'>Could not find part number \"" + pn + "\" in any child databases!</span>";
    notFoundHTML += "<p>Add new part child record?</p>";
    notFoundHTML += "<select id='pdf_new_partchild_select_" + index + "' style='width: 300px;'>";
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
      notFoundHTML += "<option value='" + _EXTRA_DB[0] + "'>" + _EXTRA_DB[i] + "</option>";
    }
    notFoundHTML += "</select>";
    notFoundHTML += "&nbsp;&nbsp;<button id='button_pdfimport_newpartchild_submit' style='background-color: #70A2FF; color: black;' onclick='startPDFNewChildRecord(" + index + ");'><span style='color: white;'>S</span>ubmit</button>";
    notFoundHTML += "&nbsp;&nbsp;<button id='button_pdfimport_newpartchild_cancel' style='background-color: #70A2FF; color: black;' onclick='cancelPDFAddToDatabase(" + index + ");'><span style='color: white;'>C</span>ancel</button>";
    document.getElementById("pdf_add_to_database_table_" + index).innerHTML = notFoundHTML;
    var ele = document.getElementById("pdf_new_partchild_select_" + index);
    if (ele != null) {
      ele.focus();
    }
  }
  else {
    extraDBs_PDF.set(index, extradb);
    extraDBLinks_PDF.set(index, link);
    var partObj = _content_extra[extradb][link][0];
    dealerprice = Number(partObj.REG);
    yourprice = Number(partObj.SPL);
    shippedamount = Number(partObj.SHOP_QTY);
    if (dealerprice_ele != null)
      dealerprice = dealerprice_ele.value;
    if (yourprice_ele != null)
      yourprice = yourprice_ele.value;
    if (shippedamount_ele != null)
      shippedamount = shippedamount_ele.value;
    var dealerprice_change = "";
    var yourprice_change = "";
    var shippedamount_change = "";
    //dealerprice -> REG
    //yourprice -> SPL
    //shippedamount -> SHOP_QTY
    var diff = 0;
    if (Number(dealerprice) == Number(partObj.REG) || removeExtraSpaces(dealerprice) == "") {
      dealerprice_change = "No Change";
      dealerprice = partObj.REG;
    }
    else {
      diff = get_plus_minus_usd_string(Number(dealerprice) - Number(partObj.REG));
      dealerprice_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }
    if (Number(yourprice) == Number(partObj.SPL) || removeExtraSpaces(yourprice) == "") {
      yourprice_change = "No Change";
      yourprice = partObj.SPL;
    }
    else {
      diff = get_plus_minus_usd_string(Number(yourprice) - Number(partObj.SPL));
      yourprice_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    }
    if (removeExtraSpaces(shippedamount) == "") {
      shippedamount = 0;
    }
    newqty = 0;
    newqty += Number(shippedamount);
    newqty += Number(partObj.SHOP_QTY);
    diff = newqty - Number(partObj.SHOP_QTY);
    newqty = Math.floor(Number(newqty));
    if (diff >= 0)
      diff = "+" + diff;
    shippedamount_change = "<img src='down_arrow.png' width=20px height=20px> " + diff;
    var htmlToAdd = "";
    if (removeExtraSpaces(partObj.FIXED) != "")
      htmlToAdd += "<div style='color: red;'>Fixed price found!</div>";
    htmlToAdd += "<table>"
      + "<tr><th>DB</th><th>PN</th><th>AKA</th><th>REG</th><th>SPL</th><th>SHOP_QTY</th><th>FIXED</th></tr>"
      + "<tr><td>" + _EXTRA_DB[extradb] + "</td><td>" + partObj.PN + "</td><td>" + partObj[_EXTRA_DB_FIELDS[extradb][_AKA_GLOBAL]] + "</td><td>" + partObj.REG + "</td><td>" + partObj.SPL + "</td><td>" + partObj.SHOP_QTY + "</td><td>" + partObj.FIXED + "</td></tr>"
      + "<tr><td></td><td></td><td></td><td>" + dealerprice_change + "</td><td>" + yourprice_change + "</td><td>" + shippedamount_change + "</td><td></td></tr>"
      + "<tr><td>" + _EXTRA_DB[extradb] + "</td><td>" + partObj.PN + "</td><td>" + partObj[_EXTRA_DB_FIELDS[extradb][_AKA_GLOBAL]] + "</td><td>" + dealerprice + "</td><td>" + yourprice + "</td><td>" + newqty + "</td><td>" + partObj.FIXED + "</td></tr>"
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
            tableHTML += "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[ORDERED_Indexes[i]].str)) + "'     id='pdf_ordered_" + i + "'></td>";
            tableHTML += "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[SHIPPED_Indexes[i]].str)) + "'     id='pdf_shipped_" + i + "'></td>";
            tableHTML += "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[BACKORDERED_Indexes[i]].str)) + "' id='pdf_backordered_" + i + "'></td>";

            var nextORDEREDHeight = -1;
            if (i < ORDERED_Indexes.length - 1) //Not on last part
            {
              nextORDEREDHeight = textContentArrayAll[ORDERED_Indexes[i + 1]].adjustedHeight;
            }
            tableHTML += "<td><textarea id='pdf_description_" + i + "' onfocus='deselectTable();' style='width: 500px; height: 90px;'>";
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
              tableHTML += "<table><tr><th>Dealer Price</th><th>Name</th><th>Phone</th></tr>"
                + "<tr>"
                + "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[0]) + "' id='pdf_dealerprice_" + i + "'></td>"
                + "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[1]) + "' id='pdf_customername_" + i + "'></td>"
                + "<td><input onfocus='deselectTable();' type='text' value='" + getHTMLSafeText(numberNamePhone[2]) + "' id='pdf_customerphone_" + i + "'></td>"
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
          var ele = document.getElementById("wlmay_pdf_invoice_no_input");
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

function getPDFInputHTML(columnRowIndexes, index, CONTENTIndexes, nextORDEREDHeight, id) {
  var tableHTML = "<td>";
  while (columnRowIndexes[index] < CONTENTIndexes.length && textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].adjustedHeight > nextORDEREDHeight) {
    var str = removeExtraSpaces(textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].str);
    if (str != "")
      tableHTML += "<input type='text' value='" + getHTMLSafeText(removeExtraSpaces(textContentArrayAll[CONTENTIndexes[columnRowIndexes[index]]].str)) + "' onfocus='deselectTable();' id='" + id + "'>";
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

var newREGs = new Map();
var newSPLs = new Map();
var newSHOP_QTYs = new Map();
var newPNs = new Map();
var newDESCRIP1s = new Map();
var extraDBs_PDF = new Map();
var extraDBLinks_PDF = new Map();
function confirmPDFAddToDatabase(index) {
  var extradb = extraDBs_PDF.get(index);
  var link = extraDBLinks_PDF.get(index);
  var partObj = _content_extra[extradb][link][0];
  var originalObj = copyObj(partObj);
  partObj.REG = newREGs.get(index);
  partObj.SPL = newSPLs.get(index);
  partObj.SHOP_QTY = newSHOP_QTYs.get(index);
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
  document.getElementById("part_child_dropdown_select").selectedIndex = document.getElementById("pdf_new_partchild_select_" + index).selectedIndex;
  setNewPartChildButton();
  setTab(TAB_PART_CHILD_RECORD_MANAGER);
  startNewPartChild();
  document.getElementById("partchild_new_input_REG").value = newREGs.get(index);
  document.getElementById("partchild_new_input_SPL").value = newSPLs.get(index);
  document.getElementById("partchild_new_input_SHOP_QTY").value = newSHOP_QTYs.get(index);
  document.getElementById("partchild_new_input_DESCRIP1").value = newDESCRIP1s.get(index);
  document.getElementById("partchild_new_input_PN").value = newPNs.get(index);
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