testing_enabled = true;
let a_click = 0;
let a_click_list = 1;
let a_valid_input = 2;
let a_valid_label = 3;
let a_valid_check = 4;
let a_valid_list_size = 5;
let a_set_input = 6;
let a_set_check = 7;
let a_stop = 8;
let a_set_input_indexed = 9;
let a_valid_input_indexed = 10;
let a_key_press = 11;

var i_test_asset = 0;
var i_test_num = 0;

var KEY_ENTER = "Enter";
var KEY_NUMPADENTER = "NumpadEnter";
var KEY_ESCAPE = "Escape";
var KEY_LEFT_ARROW = "ArrowLeft";
var KEY_UP_ARROW = "ArrowUp";
var KEY_RIGHT_ARROW = "ArrowRight";
var KEY_DOWN_ARROW = "ArrowDown";
var KEY_TAB = "Tab";
var KEY_PAGE_UP = "PageUp";
var KEY_PAGE_DOWN = "PageDown";
var KEY_SHIFT_LEFT = "ShiftLeft";
var KEY_SHIFT_RIGHT = "ShiftRight";
var KEY_CTRL_LEFT = "ControlLeft";
var KEY_CTRL_RIGHT = "ControlRight";
var KEY_ALT_LEFT = "AltLeft";
var KEY_ALT_RIGHT = "AltRight";
var KEY_A = "KeyA";
var KEY_B = "KeyB";
var KEY_C = "KeyC";
var KEY_D = "KeyD";
var KEY_E = "KeyE";
var KEY_F = "KeyF";
var KEY_G = "KeyG";
var KEY_H = "KeyH";
var KEY_I = "KeyI";
var KEY_J = "KeyJ";
var KEY_K = "KeyK";
var KEY_L = "KeyL";
var KEY_M = "KeyM";
var KEY_N = "KeyN";
var KEY_O = "KeyO";
var KEY_P = "KeyP";
var KEY_Q = "KeyQ";
var KEY_R = "KeyR";
var KEY_S = "KeyS";
var KEY_T = "KeyT";
var KEY_U = "KeyU";
var KEY_V = "KeyV";
var KEY_W = "KeyW";
var KEY_X = "KeyX";
var KEY_Y = "KeyY";
var KEY_Z = "KeyZ";
var KEY_PLUS = "Equal";
var KEY_MINUS = "Minus";
var KEY_HOME = "Home";
var KEY_END = "End";

class TestPart {
    constructor(ele, action, text, wait, indexes) {
        this.ele = ele;
        this.action = action;
        this.text = text;
        this.wait = wait;
        this.indexes = indexes;
    }
}

function t(ele, action, text, wait, indexes) {
    return new TestPart(ele, action, text, wait, indexes);
}

//!!!!!!MANUAL TESTS REQUIRED!!!!!!!
//Test adding and deleting SDS and importing template SDS

//Debug for adding invoice data
var test_parts = [[
    // t("TAB_record_browser", a_click),
    // t("", a_key_press, KEY_V),
    // t("", a_key_press, KEY_ESCAPE),
    // //Current Date
    // t("TAB_record_views", a_click),
    // t("sell_button_0_1", a_click),
    // t("sell_quantity_0_1", a_set_input, "1"),
    // t("button_record_view_sell_confirm_0_1", a_click),
    // t("sell_button_0_4", a_click),
    // t("sell_quantity_0_4", a_set_input, "3"),
    // t("button_record_view_sell_confirm_0_4", a_click),
    // t("", a_key_press, KEY_ESCAPE),
    // t("TAB_invoice", a_click),
    // t("invoice_input_customer_order_no", a_set_input, "103105"),
    // t("invoice_input_email", a_set_input, "legojedi4@gmail.com"),
    // t("invoice_input_name", a_set_input, "Aether Chavant"),
    // t("invoice_input_address", a_set_input, "1801 S Sakura St Sector B Unit 113"),
    // t("invoice_input_citystatezip", a_set_input, "Aetheron Oregon 9007402"),
    // t("invoice_input_phone", a_set_input, "1-554-5123"),
    // t("invoice_input_soldby", a_set_input, "CAL"),
    // t("invoice_textarea_specs", a_set_input, "Specifications: 5,000,000N N-Mass Drive"),
    // t("invoice_textarea_misc", a_set_input, "Bring to Hyperion Dockyards"),
    // t("invoice_input_signature", a_set_input, "Kleinlin Arether"),
    // t("invoice_bottom_textarea_2", a_set_input,
    //     "Cold Fusion and special order parts\n" +
    //     "are not returnable. All others\n" +
    //     "subject to 20% return handling fees.\n" +
    //     "All returns payable by check only.\n" +
    //     "Thank you."),
    // t("invoice_input_sell_0", a_set_input, "15.25"),
    // t("invoice_input_sell_1", a_set_input, "1.55"),
    // t("button_finish_sale", a_click),
    // //8/1/2022
    // t("TAB_record_views", a_click),
    // t("sell_button_0_5", a_click),
    // t("sell_quantity_0_5", a_set_input, "2"),
    // t("button_record_view_sell_confirm_0_5", a_click),
    // t("", a_key_press, KEY_ESCAPE),
    // t("TAB_invoice", a_click),
    // t("invoice_input_date", a_set_input, "8/15/2022"),
    // t("button_finish_sale", a_click),

    // t("TAB_part_history", a_click),
]];

var error_found = false;
function errorlog(log) {
    error_found = true;
    // console.log("%c" + log, "color: red");
    console.error(log);
}

function simulateKeyPress(character) {
    var event = Object();
    event.code = character;
    w4keypress(event);
}

if (testing_enabled) {
    setTimeout(function () {
        document.getElementById("button_server_select_firebase").click();
        setTimeout(function () {
            document.getElementById("employee_id").value = "1212";
            document.getElementById("button_employee_id").click();
        }, 200);
        login_loop();
    },
        600);
}
document.getElementById("TEST_WARNING").style.display = "block";

function login_loop() {
    if (document.getElementById("content_div").style.display != "none") {
        setTimeout(testing, 1000);
    }
    else {
        setTimeout(login_loop, 100);
    }
}


function testing() {
    if (i_test_asset < test_parts.length && i_test_num < test_parts[i_test_asset].length) {
        var t = test_parts[i_test_asset][i_test_num];
        switch (t.action) {
            case a_click:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for click|" + t.ele);
                else
                    ele.click();
                break;
            case a_click_list:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for click|" + t.ele);
                else {
                    if (t.text >= ele.children.length)
                        errorlog("Element has " + ele.children.length + " children|" + t.ele + "| Requested index " + t.text);
                    else
                        for (var i = 0; i < ele.children[t.text].children.length; ++i) {
                            var ele0 = ele.children[t.text].children[i];
                            if (ele0.tagName == "BUTTON") {
                                ele0.click();
                                break;
                            }
                        }
                }
                break;
            case a_valid_input:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid|" + t.ele);
                else
                    if (ele.value != t.text)
                        errorlog("Failed to validate text|" + t.ele + "|" + t.text);
                break;
            case a_valid_label:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid|" + t.ele);
                else
                    if (ele.innerHTML != t.text)
                        errorlog("Failed to validate label|" + t.ele + "|" + t.text);
                break;
            case a_valid_check:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid|" + t.ele);
                else
                    if (ele.checked != t.text)
                        errorlog("Failed to validate checkbox|" + t.ele + "|" + t.text);
                break;
            case a_valid_list_size:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for valid list size|" + t.ele);
                else
                    if (ele.children.length != t.text)
                        errorlog("Failed to validate list size|" + t.ele + "|" + t.text);
                break;
            case a_set_input:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set|" + t.ele);
                else
                    ele.value = t.text;
                break;
            case a_set_input_indexed:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set indexed|" + t.ele);
                else {
                    for (var i = 0; i < t.indexes.length; ++i) {
                        var index = t.indexes[i];
                        if (index >= ele.children.length) {
                            errorlog("Element" + i + " has " + ele.children.length + " children|" + t.ele + "| Requested index " + index);
                            break;
                        }
                        else {
                            ele = ele.children[index];
                            if (i == t.indexes.length - 1)
                                ele.value = t.text;
                        }

                    }
                }
                break;
            case a_valid_input_indexed:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set indexed|" + t.ele);
                else {
                    for (var i = 0; i < t.indexes.length; ++i) {
                        var index = t.indexes[i];
                        if (index >= ele.children.length) {
                            errorlog("Element" + i + " has " + ele.children.length + " children|" + t.ele + "| Requested index " + index);
                            break;
                        }
                        else {
                            ele = ele.children[index];
                            if (i == t.indexes.length - 1)
                                if (ele.value != t.text)
                                    errorlog("Failed to validate text|" + t.ele + "|" + t.text);
                        }

                    }
                }
                break;
            case a_set_check:
                var ele = document.getElementById(t.ele);
                if (ele == null)
                    errorlog("Failed to find for set|" + t.ele);
                else
                    ele.checked = t.text;
                break;
            case a_key_press:
                simulateKeyPress(t.text);
                break;
        }
        ++i_test_num;
        if (i_test_num >= test_parts[i_test_asset].length) {
            i_test_num = 0;
            ++i_test_asset;
        }
        if (t.wait == null)
            t.wait = 0;
        if (error_found || t.action == a_stop) {
            // document.getElementById("TEST_CONTINUE_BUTTON").style.display = "block";
        }
        else
            setTimeout(testing, t.wait);
    }
    else
        console.log("Testing complete");
}

function test_continue() {
    // document.getElementById("TEST_CONTINUE_BUTTON").style.display = "none";
    error_found = false;
    testing();
}