var INVOICE_PRE = 
"<button class='no-print' onclick=printClick(); style='width:150px; height:50px; font-size:30px; position:absolute; top:30px; left:900px;'>Print</button>"
+ "<div class='invoice_div'    style='top: 20px; left: 20px; text-align: center; width: 200px; height: 100px; font-size: 20px; color: #433C3A;' id='invoice_address_textarea_2'></div>"
+ "<div class='invoice_border' style='top: 20px; left: 500px; width: 200px; height: 40px; font-size: 18px;'>&nbsp;&nbsp;&nbsp;No.&nbsp;<input type='text' onfocus='deselectTable();' id='invoice_input_invoice_no' style='width: 133px; height: 30px; font-size: 20px;'></div>"
+ "<div class='invoice_border' style='top: 65px; left: 450px; width: 250px; height: 40px; background-color: #DFDEDB;'>"
+ "  <div>"
+ "    &nbsp;&nbsp;&nbsp;DATE&nbsp;<input type='text' onfocus='deselectTable();' id='invoice_input_date' style='width: 187px; height: 30px; font-size: 20px;'>"
+ "  </div>"
+ "</div>"
+ "<div class='invoice_border' style='top: 110px; left: 0px; width: 700px; height: 190px;'>"
+ "<div style='border-bottom: solid 2px #5B6275; height: 70px;'>&nbsp;&nbsp;&nbsp;CUSTOMER<br>&nbsp;&nbsp;&nbsp;ORDER NO. <textarea onfocus='deselectTable();' id='invoice_input_customer_order_no'         style='position: absolute; left: 80px;  top: 0px;  width: 595px; height: 60px; font-size: 20px;'></textarea></div>"
+ "  <div style='border-bottom: solid 2px #5B6275; height: 40px;'>&nbsp;&nbsp;&nbsp;NAME              <input type='text' onfocus='deselectTable();' id='invoice_input_name'         style='position: absolute; left: 50px;  top: 72px;  width: 620px; height: 30px; font-size: 20px;'></div>"
+ "  <div style='border-bottom: solid 2px #5B6275; height: 40px;'>&nbsp;&nbsp;&nbsp;ADDRESS           <input type='text' onfocus='deselectTable();' id='invoice_input_address'      style='position: absolute; left: 70px;  top: 114px; width: 600px; height: 30px; font-size: 20px;'></div>"
+ "  &nbsp;&nbsp;&nbsp;CITY, STATE,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ZIP<input type='text' onfocus='deselectTable();' id='invoice_input_citystatezip' style='position: absolute; left: 100px; top: 156px; width: 570px; height: 30px; font-size: 20px;'>"
+ "</div>"
+ "<div class='invoice_border' style='top: 305px; left: 0px; width: 700px; height: 80px;'>"
+ "  <div class='invoice_div' style='border-right: solid 2px #5B6275; width: 150px; height: 80px;'>"
+ "    &nbsp;&nbsp;&nbsp;SOLD BY<br><textarea onfocus='deselectTable();' id='invoice_input_soldby' style='width: 140px; height: 50px; font-size: 14px;'></textarea>"
+ "  </div>"
+ "  <div class='invoice_div' style='border-right: solid 2px #5B6275; width: 350px; height: 80px; left: 150px;'>"
// + "    <div style='position: absolute; top: 10px; left: 10px;  font-size: 16px;'><input type='checkbox' id='invoice_checkbox_cash'   >CASH                </div>"
// + "    <div style='position: absolute; top: 40px; left: 10px;  font-size: 16px;'><input type='checkbox' id='invoice_checkbox_charge' >CHARGE              </div>"
// + "    <div style='position: absolute; top: 10px; left: 120px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_cod'    >C.O.D.              </div>"
// + "    <div style='position: absolute; top: 40px; left: 120px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_merch'  >MERCHANDISE RETURNED</div>"
// + "    <div style='position: absolute; top: 10px; left: 240px; font-size: 16px;'><input type='checkbox' id='invoice_checkbox_paidout'>PAID OUT            </div>"
+ "  </div>"
+ "</div>"
+ "<textarea onfocus='deselectTable();' class='invoice_div' style='top: 310px; left: 160px; width: 330px; height: 70px;' id='invoice_textarea_specs'></textarea>"
+ "<textarea onfocus='deselectTable();' class='invoice_div' style='top: 310px; left: 510px; width: 180px; height: 70px;' id='invoice_textarea_misc'></textarea>"
+ "<table class='invoice_border' style='top: 390px; left: 0px; width: unset; height: unset; border-radius: 0px;'>"
+ "  <tr>"
+ "    <th style='width: 55px;'>QUANTITY</th><th style='width: 500px; text-align: center;'>DESCRIPTION</th><th style='width: 55px;'>PRICE</th><th style='width: 55px;'>AMOUNT</th><th class='no-print'></th>"
+ "  </tr>";

var INVOICE_POST =      
"<tr class='in_td'><td colspan=2 style='text-align: right;'>Total</td><td colspan=2><input type='text' onfocus='deselectTable();' id='invoice_input_total' style='width: 110px; text-align: right;' disabled></td></tr>"
+ "<tr style='height: 60px;'><td colspan=5 style='font-size: 12px;'>SIGNATURE&nbsp;&nbsp;&nbsp;<input type='text' onfocus='deselectTable();' style='width: 600px; height: 30px;' id='invoice_input_signature'></td></tr>"
+ "<tr style='height: 120px;'><td colspan=5 ><textarea onfocus='deselectTable();' id='invoice_bottom_textarea_2' style='width: 700px; height: 100px; text-align: center;'></textarea></td></tr>"
+ "</table>"
+ "<button id='button_finish_sale' class='no-print' style='width:150px; height:100px; font-size:30px; position:absolute; top:90px; left:900px;' onclick='finishInvoiceSale();'>Finish Sale</button>";