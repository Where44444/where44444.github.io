const INVOICE_PRE =
    "<button id='button_invoice_print' class='no-print' onclick=printClick(); style='width:150px; height:50px; font-size:30px; position:absolute; top:30px; left:900px; background-color: #70A2FF; color: black;'><span style='color: white;'>P</span>rint</button>"
    + "<div class='invoice_div' style='top: 20px; left: 20px; text-align: center; width: 300px; height: 100px; font-size: 18px; color: #433C3A;' id='invoice_address_textarea_2'></div>"
    + "<div class='invoice_border' style='top: 20px; left: 500px; width: 200px; height: 40px; font-size: 18px;'>&nbsp;&nbsp;&nbsp;No.&nbsp;<input type='text' onfocus='deselectTable();' id='invoice_input_invoice_no' style='width: 133px; height: 30px; font-size: 20px;'></div>"
    + "<div class='invoice_border' style='top: 65px; left: 450px; width: 250px; height: 40px; background-color: #DFDEDB;'>"
    + " <div>"
    + " &nbsp;&nbsp;&nbsp;DATE&nbsp;<input type='text' onfocus='deselectTable();' id='invoice_input_date' style='width: 187px; height: 30px; font-size: 20px;'>"
    + " </div>"
    + "</div>"
    + "<div class='invoice_border' style='top: 110px; left: 0px; width: 700px; height: 232px;'>"
    + "<div style='border-bottom: solid 2px #5B6275; height: 44px;'>&nbsp;&nbsp;&nbsp;CUSTOMER<br>&nbsp;&nbsp;&nbsp;P.O. <textarea id='invoice_input_customer_order_no' onfocus='deselectTable();' style='position: absolute; left: 100px; top: 0px; width: 570px; height: 38px; font-size: 20px; overflow: hidden;'></textarea></div>"
    + " <div style='border-bottom: solid 2px #5B6275; height: 36px;'>&nbsp;&nbsp;&nbsp;EMAIL <input id='invoice_input_email' type='text' onfocus='deselectTable();' onkeyup='validateEmail();' oninput='validateEmail();' style='position: absolute; left: 100px; top: 47px; width: 570px; height: 30px; font-size: 20px;'></div>"
    + " <div id='invalid_email' class='no-print' style='color: red; display: none; position: absolute; left: 10px; top: 60px;'>Invalid E-Mail</div>"
    + " <div style='border-bottom: solid 2px #5B6275; height: 36px;'>&nbsp;&nbsp;&nbsp;NAME <input id='invoice_input_name' type='text' onfocus='deselectTable();' style='position: absolute; left: 100px; top: 85px; width: 570px; height: 30px; font-size: 20px;'></div>"
    + " <div style='border-bottom: solid 2px #5B6275; height: 36px;'>&nbsp;&nbsp;&nbsp;ADDRESS <input id='invoice_input_address' type='text' onfocus='deselectTable();' style='position: absolute; left: 100px; top: 123px; width: 570px; height: 30px; font-size: 20px;'></div>"
    + " <div style='border-bottom: solid 2px #5B6275; height: 36px;'>"
    + " &nbsp;&nbsp;&nbsp;CITY <input id='invoice_input_city' type='text' onfocus='deselectTable();' style='position: absolute; left: 100px; top: 161px; width: 200px; height: 30px; font-size: 20px;'>"
    + " <div style='position: absolute; left: 310px; top: 161px;'>STATE </div><input id='invoice_input_state' type='text' onfocus='deselectTable();' style='position: absolute; left: 350px; top: 161px; width: 200px; height: 30px; font-size: 20px;'>"
    + " <div style='position: absolute; left: 560px; top: 161px;'>ZIP </div><input id='invoice_input_zip' type='text' onfocus='deselectTable();' style='position: absolute; left: 585px; top: 161px; width: 100px; height: 30px; font-size: 20px;'>"
    + " </div>"
    + " &nbsp;&nbsp;&nbsp;PHONE<input id='invoice_input_phone' type='text' onfocus='deselectTable();'  style='position: absolute; left: 100px; top: 199px; width: 570px; height: 30px; font-size: 20px;'>"
    + "</div>"
    + "<div class='invoice_border' style='top: 347px; left: 0px; width: 700px; height: 80px;'>"
    + " <div class='invoice_div' style='border-right: solid 2px #5B6275; width: 150px; height: 80px;'>"
    + " &nbsp;&nbsp;&nbsp;SOLD BY<br><textarea onfocus='deselectTable();' id='invoice_input_soldby' style='width: 140px; height: 25px; font-size: 14px;'></textarea><br>"
    + " <input id='invoice_input_unpaid' type='checkbox'><div style='margin-left: 20px; margin-top: -20px;'>Un-Paid</div>"
    + " </div>"
    + " <div class='invoice_div' style='border-right: solid 2px #5B6275; width: 350px; height: 80px; left: 150px;'>"
    // + " <div style='position: absolute; top: 10px; left: 10px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_cash' >CASH </div>"
    // + " <div style='position: absolute; top: 40px; left: 10px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_charge' >CHARGE </div>"
    // + " <div style='position: absolute; top: 10px; left: 120px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_cod' >C.O.D. </div>"
    // + " <div style='position: absolute; top: 40px; left: 120px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_merch' >MERCHANDISE RETURNED</div>"
    // + " <div style='position: absolute; top: 10px; left: 240px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_paidout'>PAID OUT </div>"
    + " </div>"
    + "</div>"
    + "<textarea id='invoice_textarea_specs' onfocus='deselectTable();' class='invoice_div' style='font-size: 14px; top: 352px; left: 160px; width: 330px; height: 70px;' ></textarea>"
    + "<textarea id='invoice_textarea_misc' onfocus='deselectTable();' class='invoice_div' style='font-size: 14px; top: 352px; left: 510px; width: 180px; height: 70px;' ></textarea>"
    + "<table id='table_invoice_parts' class='invoice_border' style='top: 432px; left: 0px; width: unset; height: unset; border-radius: 0px;'>"
    + " <tr>"
    + " <th style='width: 55px;'>QUANTITY</th><th style='width: 500px; text-align: center;'>DESCRIPTION</th><th style='width: 55px;'>PRICE</th><th style='width: 55px;'>AMOUNT</th><th class='no-print'></th>"
    + " </tr>";

const INVOICE_POST =
    "<tr class='in_td'><td colspan=2 style='text-align: right;'>Total</td><td colspan=2><input type='text' onfocus='deselectTable();' id='invoice_input_total' style='width: 110px; text-align: right;' disabled></td></tr>"
    + "<tr style='height: 60px;'><td colspan=5 style='font-size: 12px;'>SIGNATURE&nbsp;&nbsp;&nbsp;<input type='text' onfocus='deselectTable();' style='width: 600px; height: 30px;' id='invoice_input_signature'></td></tr>"
    + "<tr style='height: 120px;'><td colspan=5 ><textarea onfocus='deselectTable();' id='invoice_bottom_textarea_2' style='width: 700px; height: 100px; text-align: center; margin-bottom: 40px;'></textarea></td></tr>"
    + "</table><br><br><br>"
    + "<button id='button_finish_sale' class='no-print' style='width:150px; height:100px; font-size:30px; position:absolute; top:90px; left:900px; background-color: #70A2FF; color: black;' onclick='finishInvoiceSale();'><span style='color: white;'>F</span>inish Sale</button>";

const INVOICE_XML_PRE =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<?qbxml version="15.0"?>' +
    '<QBXML>' +
    '<QBXMLMsgsRq onError="stopOnError">' +
    '<InvoiceAddRq>' +
    '<InvoiceAdd>' +
    '<CustomerRef>' +
    '<FullName>W4CUSTOMER</FullName>' +
    '</CustomerRef>' +
    '<TxnDate>W4DATE</TxnDate>' +
    '<RefNumber>W4REFNUMBER</RefNumber>' +
    '<BillAddress>' +
    '<Addr1>W4ADDR1</Addr1>' +
    '<City>W4CITY</City>' +
    '<State>W4STATE</State>' +
    '<PostalCode>W4POSTALCODE</PostalCode>' +
    '<Country>United States</Country>' +
    '<Note>W4NOTE</Note>' +  //Limited to 41 Chars
    '</BillAddress>' +
    '<IsPending>W4IS_PENDING</IsPending>' +
    '<PONumber>W4PONUMBER</PONumber>' +
    '<FOB>W4PHONE</FOB>' +
    '<ItemSalesTaxRef>' +
    '<FullName>PartscouterTax</FullName>' +
    '</ItemSalesTaxRef>' +
    '<Memo>W4MEMO</Memo>' +
    '<Other>W4OTHER</Other>';

const INVOICE_XML_ITEM =
    '<InvoiceLineAdd>' +
    '<ItemRef>' +
    '<FullName>W4FULLNAME</FullName>' +
    '</ItemRef>' +
    '<Desc>W4DESC</Desc>' +
    '<Quantity>W4QUANTITY</Quantity>' +
    '<Amount>W4AMOUNT</Amount>' +
    '<Other1>W4OTHER1</Other1>' +
    '<Other2>W4OTHER2</Other2>' +
    '</InvoiceLineAdd>';

const INVOICE_XML_POST =
    '</InvoiceAdd>' +
    '</InvoiceAddRq>' +
    '</QBXMLMsgsRq>' +
    '</QBXML>';

const RECEIPT_XML_PRE =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<?qbxml version="15.0"?>' +
    '<QBXML>' +
    '<QBXMLMsgsRq onError="stopOnError">' +
    '<SalesReceiptAddRq>' +
    '<SalesReceiptAdd>' +
    '<TxnDate>W4DATE</TxnDate>' +
    '<RefNumber>W4REFNUMBER</RefNumber>' +
    '<BillAddress>' +
    '<Addr1>W4ADDR1</Addr1>' +
    '<City>W4CITY</City>' +
    '<State>W4STATE</State>' +
    '<PostalCode>W4POSTALCODE</PostalCode>' +
    '<Country>United States</Country>' +
    '<Note>W4NOTE</Note>' +  //Limited to 41 Chars
    '</BillAddress>' +
    '<IsPending>W4IS_PENDING</IsPending>' +
    '<FOB>W4PHONE</FOB>' +
    '<ItemSalesTaxRef>' +
    '<FullName>PartscouterTax</FullName>' +
    '</ItemSalesTaxRef>' +
    '<Memo>W4MEMO</Memo>' +
    '<Other>W4OTHER</Other>';

const RECEIPT_XML_ITEM =
    '<SalesReceiptLineAdd>' +
    '<ItemRef>' +
    '<FullName>W4FULLNAME</FullName>' +
    '</ItemRef>' +
    '<Desc>W4DESC</Desc>' +
    '<Quantity>W4QUANTITY</Quantity>' +
    '<Amount>W4AMOUNT</Amount>' +
    '<Other1>W4OTHER1</Other1>' +
    '<Other2>W4OTHER2</Other2>' +
    '</SalesReceiptLineAdd>';

const RECEIPT_XML_POST =
    '</SalesReceiptAdd>' +
    '</SalesReceiptAddRq>' +
    '</QBXMLMsgsRq>' +
    '</QBXML>';