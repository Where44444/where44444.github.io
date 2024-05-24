function exportInventoryList(qty_only) { //VERY slow exporting when qty_only is false, use exportInventoryListTXT
    var list = [];
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
        for (var j = 0; j < _content_extra[i].length; ++j) {
            var qty = Number(_content_extra[i][j][0][CE_SHOP_QTY]);
            if (!qty_only || (qty != NaN && qty > 0))
                list.push(_content_extra[i][j][0]);
        }
    }
    list.sort(COMPARE_OBJ_LOCATION);

    var text = "<table>";
    var fields = [CE_PN, CE_DESCRIP1, CE_CGS, CE_SHOP_QTY, null, CE_LOCATION]; //Null array item isn't used - if (j != 4)
    var field_names = ["Part Number", "Description", "Cost", "Qty", "Total", "Location"];
    var totals = [];
    var grandTotal = 0;
    for (var i = 0; i < list.length; ++i) {
        var obj = list[i];

        for (var j = 0; j < fields.length; ++j) {
            if (j != 4) {
                if (obj[fields[j]] == null) {
                    obj[fields[j]] = "";
                }
            }
            else {
                var cgs = Number(obj[CE_CGS]);
                var shop_qty = Number(obj[CE_SHOP_QTY]);
                var total = "";
                if (!isNaN(cgs) && !isNaN(shop_qty)) {
                    total = String(get_USD_String(cgs * shop_qty));
                    grandTotal += cgs * shop_qty;
                }
                totals.push(total);
            }
        }
    }

    for (var i = 0; i < list.length; ++i) {
        var obj = list[i];
        if (i == 0) {
            text += "<thead><tr>"
            for (var j = 0; j < field_names.length; ++j)
                text += "<th>" + field_names[j] + "</th>";
            text += "</tr></thead>";
        }

        text += "<tr>";
        for (var j = 0; j < fields.length; ++j) {
            if (j != 4)
                text += "<td>" + obj[fields[j]] + "</td>";
            else {
                text += "<td>" + totals[i] + "</td>";

            }
        }
        text += "</tr>";
    }
    text += "</table>";

    text = "Grand Total:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + get_USD_String(grandTotal) + "<br>" + text;

    startEmail("Inventory List", text);
}

//PN, Part Name, CGS x Qty on Hand, Loc 
//Sort by Location
function exportInventoryListTXT() {
    var list = [];
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
        for (var j = 0; j < _content_extra[i].length; ++j) {
            list.push(_content_extra[i][j][0]);
        }
    }
    list.sort(COMPARE_OBJ_LOCATION);

    var text = "";
    var lengths = [];
    var fields = [CE_PN, CE_DESCRIP1, CE_CGS, CE_SHOP_QTY, null, CE_LOCATION]; //Null array item isn't used - if (j != 4)
    var field_names = ["Part Number", "Description", "Cost", "Qty", "Total", "Location"];
    var totals = [];
    for (var i = 0; i < list.length; ++i) {
        var obj = list[i];
        if (lengths.length == 0)
            for (var j = 0; j < fields.length; ++j)
                lengths.push(0);

        for (var j = 0; j < fields.length; ++j) {
            if (j != 4) {
                if (obj[fields[j]] == null) {
                    obj[fields[j]] = "";
                }
                if (obj[fields[j]].length > lengths[j])
                    lengths[j] = obj[fields[j]].length;
            }
            else {
                var cgs = Number(obj[CE_CGS]);
                var shop_qty = Number(obj[CE_SHOP_QTY]);
                var total = "";
                if (!isNaN(cgs) && !isNaN(shop_qty))
                    total = String(get_USD_String(cgs * shop_qty));
                if (total.length > lengths[j])
                    lengths[j] = total.length;
                totals.push(total);
            }
        }
    }

    for (var i = 0; i < list.length; ++i) {
        var obj = list[i];
        if (i == 0) {
            for (var j = 0; j < field_names.length; ++j) {
                text += field_names[j];
                if (j != field_names.length - 1) {
                    var spaces_needed = (lengths[j] - field_names[j].length) + 1;
                    for (var k = 0; k < spaces_needed; ++k)
                        text += " ";
                }
            }
            text += "\r\n";
        }

        for (var j = 0; j < fields.length; ++j) {
            if (j != 4) {
                text += obj[fields[j]];
                if (j != fields.length - 1) {
                    var spaces_needed = (lengths[j] - obj[fields[j]].length) + 1;
                    for (var k = 0; k < spaces_needed; ++k)
                        text += " ";
                }
            }
            else {
                text += totals[i];
                var spaces_needed = (lengths[j] - totals[i].length) + 1;
                for (var k = 0; k < spaces_needed; ++k)
                    text += " ";
            }
        }
        text += "\r\n";
    }

    download("list.txt", text);
}

var _price_array = [];
var _price_page = 0;
let VEND_LIST = ["wlmay", "encompass", "reliable", "marcone"];
function exportPriceComparison() {
    var table = "<input id='price_search' placeholder='Search' class='no-print' onkeyup='updatePriceComparison(true);'>&nbsp;&nbsp;<span class='no-print'>Table Size</span> <input id='price_table_size' style='width: 50px;' type='number' class='no-print' onkeyup='updatePriceComparison();' value='10'>" +
        "<div id='price_table'></div>";

    var rows = [];
    for (var c = 0; c < _content.length; ++c) {
        var prices = new Map();
        var parts = new Map();
        for (var i = 0; i < _CONTENT_EXTRA_DB_INDEXES.length; ++i) {
            var index = getExtraDBLinkIndex(i, _content[c][_CONTENT_EXTRA_DB_INDEXES[i]]);
            if (index != null) {
                let partObj = _content_extra[i][index][0];
                var vend = standardizeString(partObj[CE_FROM]);
                var price = Number(partObj[CE_CGS]);
                if (price == 0)
                    price = Number(partObj[CE_SPL]);
                if (price == 0)
                    price = Number(partObj[CE_REG]);
                if (price != 0)
                    if (!prices.has(vend) || price < prices.get(vend)) {
                        prices.set(vend, price);
                        parts.set(vend, _content[c][_CONTENT_EXTRA_DB_INDEXES[i]]);
                    }
            }
        }

        if (prices.size > 0) {
            var priceFound = false;
            var table0 = "";
            table0 += "<tr><td>" + _content[c][_DESCRIP1] + "</td>";
            for (let vend of VEND_LIST) {
                table0 += "<td>";
                if (prices.has(vend)) {
                    table0 += "$" + get_USD_String(prices.get(vend)) + "<br>" + parts.get(vend);
                    priceFound = true;
                }
                table0 += "</td>";
            }
            table0 += "</tr>";
            if (priceFound)
                rows.push([_content[c][_DESCRIP1], table0]);
        }
    }


    COMPARE_INDEX_I = 0;
    rows.sort(COMPARE_INDEX);

    _price_array = [];
    for (let row of rows) {
        // table += row[1];
        _price_array.push(row[1]);
    }

    startEmail("Price Comparison", table);
    _price_page = 0;
    updatePriceComparison();
}

function updatePriceComparison(search, traverse) {
    if (search)
        _price_page = 0;
    var search_text = document.getElementById("price_search").value;
    var size = Number(document.getElementById("price_table_size").value);
    if (isNaN(size))
        size = 10;
    var table_html = "";
    var numRowsAdded = 0;
    var numRowsInc = 0;

    if (search_text.length > 0) { //Need to check if we can advance to next page here
        var regexp = new RegExp(search_text, "gi");
        for (let row of _price_array) {
            if (numRowsAdded == size)
                break;
            if (regexp.exec(row) !== null) {
                if (Math.floor(numRowsInc / size) == _price_page)
                    ++numRowsAdded;
                ++numRowsInc;
            }
        }
    }
    else {
        for (let row of _price_array) {
            if (numRowsAdded == size)
                break;
            if (Math.floor(numRowsInc / size) == _price_page) {
                ++numRowsAdded;
            }
            ++numRowsInc;
        }
    }

    var page_changed = false;
    if (traverse == -1)
        if (_price_page > 0) {
            --_price_page;
            page_changed = true;
        }
    if (traverse == 1 && numRowsAdded == size) {
        ++_price_page;
        page_changed = true;
    }

    numRowsAdded = 0;
    numRowsInc = 0;
    if (search_text.length > 0) { //Need to add rows here
        var regexp = new RegExp(search_text, "gi");
        for (let row of _price_array) {
            if (numRowsAdded == size)
                break;
            if (regexp.exec(row) !== null) {
                if (Math.floor(numRowsInc / size) == _price_page) {
                    table_html += row;
                    ++numRowsAdded;
                }
                ++numRowsInc;
            }
        }
    }
    else {
        for (let row of _price_array) {
            if (numRowsAdded == size)
                break;
            if (Math.floor(numRowsInc / size) == _price_page) {
                table_html += row;
                ++numRowsAdded;
            }
            ++numRowsInc;
        }
    }

    var table = "<span class='no-print'><b>Page " + (_price_page + 1) + "</b>&nbsp;&nbsp;&nbsp;&nbsp; Press <button onclick='exportPageUp(event);'><b>Page Up</b></button>/<button onclick='exportPageDown(event);'><b>Page Down</b></button> to traverse</span><table><thead><tr><th style='background-color: inherit; position: sticky; top: 0px; z-index: 4;'>Description</th>";
    for (let vend of VEND_LIST)
        table += "<th style='background-color: inherit; position: sticky; top: 0px; z-index: 4;'>" + vend.toUpperCase() + "</th>";
    table += "</tr></thead>";
    table_html = table + table_html + "</table>";

    document.getElementById("price_table").innerHTML = table_html;
    return page_changed;
}

function exportPageUp(event) {
    if (!_focused && _selected_tab == TAB_EXPORT) {
        var ele = document.getElementById("do_Print");
        var ele2 = document.getElementById("price_table");
        if (ele != null && ele.style.display != "none" && ele2 != null && updatePriceComparison(false, -1))
            event.preventDefault();
    }
}

function exportPageDown(event) {
    if (!_focused && _selected_tab == TAB_EXPORT) {
        var ele = document.getElementById("do_Print");
        var ele2 = document.getElementById("price_table");
        if (ele != null && ele.style.display != "none" && ele2 != null && updatePriceComparison(false, 1))
            event.preventDefault();
    }
}

var _export_sold_date_start = null;
var _export_sold_date_end = null;

function exportSold() {
    _export_sold_date_start = (new Date(FILTER_TIME_START)).getTime();
    _export_sold_date_end = (new Date()).getTime();
    updateExportSoldTable();
}

function updateExportSoldTable() {
    var table = '<table><tr><td>Date</td></tr><tr><td><input style="width: 200px;" type="text" id="export_sold_date" name="export_sold_date" value=""></td></tr></table>';
    table += "<table><tr><th>Descrip1</th><th>Part #</th><th>Qty</th><th>Amount</th><th>% of Sales</th><th>Avg Price</th><th>COGS</th><th>Avg COGS</th><th>Gross Margin</th><th>Gross Margin %</th></tr>";

    var part_history_content_extra_objs = [];
    for (var i = 0; i < _EXTRA_DB.length; ++i) {
        for (var j = 0; j < _content_extra[i].length; ++j) {
            if (_content_extra[i][j][0][CE_DATA] != null) {
                var final_obj = new Object();
                final_obj.i = i;
                final_obj.j = j;
                final_obj.content_extra = _content_extra[i][j];
                part_history_content_extra_objs.push(final_obj);
            }
        }
    }

    var tableObjs = [];
    for (var i = part_history_content_extra_objs.length - 1; i >= 0; --i) { //Iterate through each part
        var obj = part_history_content_extra_objs[i].content_extra;
        var timeFrameQty = 0;
        var totalCost = 0;
        for (var j = 0; j < obj[0][CE_DATA].length; ++j) { //Iterate through each sale
            var partDate = Number(obj[0][CE_DATA][j].date);
            if (partDate >= _export_sold_date_start && partDate < _export_sold_date_end) {
                var qty = Number(obj[0][CE_DATA][j].quantity);
                if (isNaN(qty))
                    qty = 0;
                timeFrameQty += qty;
                var totalCost0 = Number(obj[0][CE_DATA][j].price) * qty;
                if (!isNaN(totalCost0))
                    totalCost += totalCost0;
            }
        }
        if (timeFrameQty > 0) {
            var obj0 = new Object();
            var index = getParentRecordIndexWithChildPart_IncludingAKA(part_history_content_extra_objs[i].i, part_history_content_extra_objs[i].j);
            obj0.descrip1 = _content[index][_DESCRIP1];
            obj0.pn = obj[0][CE_PN] + " / <b>OEM:</b> " + _content[index][_OEM_PN];
            obj0.qty = timeFrameQty;
            var cgs0 = Number(obj[0][CE_CGS]);
            if (isNaN(cgs0))
                cgs0 = 0;
            obj0.cgs = cgs0 * timeFrameQty;
            obj0.amount = totalCost;
            tableObjs.push(obj0);
        }
    }

    var totalAmount = 0;
    var totalQty = 0;
    for (let obj0 of tableObjs) {
        totalAmount += obj0.amount;
        totalQty += obj0.qty;
    }
    for (let obj0 of tableObjs) {
        if (totalAmount == 0)
            totalAmount = 1; //Avoid divide by zero error for times when parts are selling for free?
        var percentOfSales = get_Percent_String((obj0.amount / totalAmount) * 100) + "%";
        var avgPrice = get_USD_String(obj0.amount / obj0.qty);
        var avgCGS = get_USD_String(obj0.cgs / obj0.qty);
        var grossMargin = get_USD_String(obj0.amount - obj0.cgs);
        var grossMarginPercent = get_Percent_String((grossMargin / obj0.amount) * 100) + "%";

        table += "<tr><td>" + obj0.descrip1
            + "</td><td>" + obj0.pn
            + "</td><td>" + obj0.qty
            + "</td><td>" + get_USD_String(obj0.amount)
            + "</td><td>" + percentOfSales
            + "</td><td>" + avgPrice
            + "</td><td>" + get_USD_String(obj0.cgs)
            + "</td><td>" + avgCGS
            + "</td><td>" + grossMargin
            + "</td><td>" + grossMarginPercent
            + "</td></tr>";
    }
    var totalAvgPrice = totalAmount / totalQty;

    table += "<tr><th>Total</th><td></td><td>" + totalQty + "</td><td>" + get_USD_String(totalAmount) + "</td><td>100.0%</td><td>" + get_USD_String(totalAvgPrice) + "</td></tr>";
    table += "</table>";

    startEmail("Parts Sold", table);
    $(function () {
        $('input[name=export_sold_date]').daterangepicker({
            // timePicker: true,
            // singleDatePicker: true,
            showDropdowns: true,
            startDate: _export_sold_date_start,
            endDate: _export_sold_date_end,
            // startDate: moment().startOf('hour'),
            locale: {
                format: 'MM/DD/YYYY'
            }
        }, function (start, end, label) {
            _export_sold_date_start = start;
            _export_sold_date_end = end;
            updateExportSoldTable();
        });
    });
}