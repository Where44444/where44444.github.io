// var _CTRL_HELD = false;
// var _SHIFT_HELD = false;
var _invoice_history_last_active_element = null;
var _IMAGE_EVERYWHERE = 0;
var _IMAGE_DISTRIBUTORS = 1;
var _selected_imagesource = _IMAGE_EVERYWHERE;

var pressedKeys = {};
window.onkeyup = function (e) {
  pressedKeys[e.code] = false;
}
window.onkeydown = function (e) {
  pressedKeys[e.code] = true;
}

// document.addEventListener("keyup", function(event) {
//   if(event.code == KEY_CTRL)
//     _CTRL_HELD = false;
//   if(event.code == KEY_SHIFT)
//     _SHIFT_HELD = false;
// });

document.addEventListener("keydown", function (event) {
  // console.log("|" + event.code + "|" + _focused + "|" + pressedKeys);
  // if(event.code == KEY_CTRL)
  //   _CTRL_HELD = true;
  // if(event.code == KEY_SHIFT)
  //   _SHIFT_HELD = true;
  w4keypress(event);
});

function w4keypress(event) {
  var content_div_visible = document.getElementById("content_div").style.display != "none";
  if (!pressedKeys[KEY_CTRL_LEFT] && !pressedKeys[KEY_SHIFT_LEFT] && !pressedKeys[KEY_ALT_LEFT]
    && !pressedKeys[KEY_CTRL_RIGHT] && !pressedKeys[KEY_SHIFT_RIGHT] && !pressedKeys[KEY_ALT_RIGHT]) {
    if (event.code == KEY_ESCAPE) {
      if (document.getElementById("firebase_temp_login_div").style.display != "none") {
        if (!_focused) {
          document.getElementById("button_exit_temp_login").click();
        }
        document.activeElement.blur();
        _focused = false;
      }
    }
  }

  if (content_div_visible) {
    if (!pressedKeys[KEY_CTRL_LEFT] && !pressedKeys[KEY_SHIFT_LEFT] && !pressedKeys[KEY_ALT_LEFT]
      && !pressedKeys[KEY_CTRL_RIGHT] && !pressedKeys[KEY_SHIFT_RIGHT] && !pressedKeys[KEY_ALT_RIGHT]) {
      if (event.code == KEY_ESCAPE) {
        var record_browser_edit_cancel_clicked = false;
        var invoice_history_exit_clicked = false;
        var ele1 = document.getElementById("key_shortcut_index_window");
        var ele2 = document.getElementById("key_shortcut_index_window_edit");
        var ele3 = document.getElementById("key_shortcut_extra_db_sell_window");
        var ele4 = document.getElementById("key_shortcut_extra_db_edit_window");
        var ele5 = document.getElementById("key_shortcut_extra_db_image_window");
        var ele6 = document.getElementById("key_shortcut_invoice_remove_window");
        var ele7 = document.getElementById("key_shortcut_extra_db_jumpPN_window");
        var ele8 = document.getElementById("key_shortcut_search_scope_window");
        if (ele1.style.display != "none") {
          ele1.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele2.style.display != "none") {
          ele2.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele3.style.display != "none") {
          ele3.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele4.style.display != "none") {
          ele4.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele5.style.display != "none") {
          ele5.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele6.style.display != "none") {
          ele6.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele7.style.display != "none") {
          ele7.style.display = "none";
          _overlay_window_open = false;
        }
        else if (ele8.style.display != "none") {
          ele8.style.display = "none";
          _overlay_window_open = false;
        }
        else if (!_focused && _selected_tab == TAB_RECORD_VIEWS && clickRecordView_Image_Exit()) { }
        else if (!_focused && _selected_tab == TAB_RECORD_VIEWS && clickRecordViewPNCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_RECORD_VIEWS && clickRecordViewSellCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_RECORD_VIEWS && clickRecordViewEditWholeCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_RECORD_BROWSER && clickRecordBrowserEditCancelButton()) {
          record_browser_edit_cancel_clicked = true;
        }
        else if (!_focused && _selected_tab == TAB_RECORD_BROWSER && clickRecordBrowserEditDeleteCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_RECORD_BROWSER && clickRecordBrowserNewCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER && clickPCRM_NewCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER && clickPCRM_EditCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER && clickPCRM_EditDeleteCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_SORT_ORDERS && clickSortOrder_NewCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_SORT_ORDERS && clickSortOrder_EditCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_SORT_ORDERS && clickSortOrder_EditDeleteCancelButton()) { }
        else if (!_focused && _selected_tab == TAB_PDF_IMPORT && clickPdfImport_WLMAY_AddPartChild_Cancel()) { }
        else if (!_focused && _selected_tab == TAB_PDF_IMPORT && clickPdfImport_WLMAY_CancelAddRowButton()) { }
        // else if (!_focused && _selected_tab == TAB_PDF_IMPORT && clickPdfImport_WLMAY_CancelButton()) { }   //Dont do anything, better to manually click than to have to start scanning and OCR process all over again
        else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY && clickInvoiceHistory_ExitInvoice()) {
          invoice_history_exit_clicked = true;
        }
        else if (!_focused && _selected_tab == TAB_INVOICE && clickInvoice_ExitInvoice()) { }
        else if (!_focused && _selected_tab == TAB_PDF_IMPORT && clickCancelScan()) { }
        else if (_key_shortcut_mainmenu_available) {
          setTab(TAB_MAINMENU);
        }
        deselectTable();
        clearSearchAutocomplete();
        clearPartNumAutocomplete();
        clearPartChildEditAutocomplete();
        clearSearchPartNumAutocomplete();
        if (!_focused)
          setTab(_selected_tab);
        document.activeElement.blur();
        _focused = false;
        if (_selected_tab == TAB_INVOICE_HISTORY && _invoice_history_last_active_element != null && invoice_history_exit_clicked)
          _invoice_history_last_active_element.focus();
        if (_selected_tab == TAB_RECORD_BROWSER && record_browser_edit_cancel_clicked) {
          var cell = getCell(_selectedRow, _selectedCell, _TABLE_RECORD_BROWSER);
          if (cell != null)
            onCellClick(_selectedRow, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
        }
        setKeyboardShortcutBar();
      }
      else if (!_overlay_window_open) {
        for (var i = 0; i <= 9; ++i) {
          if (event.code == "Digit" + i) {
            if (!_focused && _selected_tab == TAB_RECORD_VIEWS && i > 0 && i <= _recordViews.length) {
              selectRecordView(i - 1, true);
            }
            break;
          }
        }

        switch (event.code) {
          case KEY_TAB:
            if (_focused && _selected_tab == TAB_ADD_INVOICE && document.activeElement.id == "input_addinvoice_price") {
              var row = document.activeElement.parentElement.parentElement;
              var table = document.activeElement.parentElement.parentElement.parentElement;
              if (row.rowIndex == table.rows.length - 4) {
                if (clickAddInvoice_AddRow())
                  event.preventDefault();
              }
            }
            break;
          case KEY_ENTER:
          case KEY_NUMPADENTER:
            if (_selected_tab == TAB_RECORD_VIEWS) {
              if (clickRecordViewSellConfirmButton()) {
                _focused = false; //Sell input is deleted and activeelement becomes <body> and blur doesn't work, manually blur here
                setKeyboardShortcutBar();
              }
            }
            else if (_selected_tab == TAB_INVOICE_HISTORY) {
              if (document.activeElement != null && document.activeElement.id == "qwc_password") {
                document.getElementById("button_qwc_apply").click();
              }
              else {
                var ele1 = document.getElementById("invoicehistory_table_row_" + _table_invoicehistory_selected_row);
                var ele2 = document.getElementById("invoice_from_history_content");
                if (ele1 != null && ele1.style.display != "none" && ele2.style.display == "none") {
                  ele1.children[1].click();
                  event.preventDefault();
                  _invoice_history_last_active_element = document.activeElement;
                  document.activeElement.blur();
                }
              }
            }
            else if (_selected_tab == TAB_PART_HISTORY) {
              var ele1 = document.getElementById("parthistory_table_row_" + _table_parthistory_selected_row);
              if (ele1 != null && ele1.style.display != "none") {
                ele1.click();
                event.preventDefault();
                document.activeElement.blur();
              }
            }
            else if (_selected_tab == TAB_CHANGE_HISTORY) {
              var ele1 = document.getElementById("changehistory_table_row_" + _table_changehistory_selected_row);
              if (ele1 != null && ele1.style.display != "none") {
                ele1.click();
                event.preventDefault();
                document.activeElement.blur();
              }
            }
            else if (_focused && document.activeElement.id == "search_results_max") {
              var ele1 = document.getElementById("save_search_results_max");
              if (ele1 != null) {
                document.activeElement.blur();
                ele1.click();
              }
            }
            else if (_focused && document.activeElement.id == "record_browser_max") {
              var ele1 = document.getElementById("save_record_browser_max");
              if (ele1 != null) {
                document.activeElement.blur();
                ele1.click();
              }
            }
            break;
          case KEY_LEFT_ARROW: //Left Arrow
            if (_isTableSelected) {
              if (moveLeft())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              if (clickRecordView_Image_Left())
                event.preventDefault();
            }
            break;
          case KEY_UP_ARROW: //Up Arrow
            if (_selected_tab == TAB_INVOICE_HISTORY) {
              if (set_tableInvoiceHistory_SelectedRow(_table_invoicehistory_selected_row - 1))
                event.preventDefault();
            }
            if (_selected_tab == TAB_PART_HISTORY) {
              if (set_tablePartHistory_SelectedRow(_table_parthistory_selected_row - 1))
                event.preventDefault();
            }
            if (_selected_tab == TAB_CHANGE_HISTORY) {
              if (set_tableChangeHistory_SelectedRow(_table_changehistory_selected_row - 1))
                event.preventDefault();
            }
            if (_selected_tab == TAB_PDF_IMPORT) {
              if (set_tablePDFImport_SelectedRow(_table_pdf_import_selected_row - 1))
                event.preventDefault();
            }
            else if (_selected_tab == TAB_REORDERS) {
              if (set_tableReorders_SelectedRow(_table_reorders_selected_row - 1))
                event.preventDefault();
            }
            else if (_selected_tab == TAB_RECORD_VIEWS) {
              if (_selected_record_view >= 0) {
                changeRecordViewUp();
                event.preventDefault();
              }
            }
            else if (_isTableSelected) {
              if (moveUp())
                event.preventDefault();
            }
            break;
          case KEY_RIGHT_ARROW: //Right Arrow
            if (_isTableSelected) {
              if (moveRight())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              if (clickRecordView_Image_Right())
                event.preventDefault();
            }
            break;
          case KEY_DOWN_ARROW: //Down Arrow
            if (_selected_tab == TAB_INVOICE_HISTORY) {
              if (set_tableInvoiceHistory_SelectedRow(_table_invoicehistory_selected_row + 1))
                event.preventDefault();
            }
            if (_selected_tab == TAB_PART_HISTORY) {
              if (set_tablePartHistory_SelectedRow(_table_parthistory_selected_row + 1))
                event.preventDefault();
            }
            if (_selected_tab == TAB_CHANGE_HISTORY) {
              if (set_tableChangeHistory_SelectedRow(_table_changehistory_selected_row + 1))
                event.preventDefault();
            }
            else if (_selected_tab == TAB_PDF_IMPORT) {
              if (set_tablePDFImport_SelectedRow(_table_pdf_import_selected_row + 1))
                event.preventDefault();
            }
            else if (_selected_tab == TAB_REORDERS) {
              if (set_tableReorders_SelectedRow(_table_reorders_selected_row + 1))
                event.preventDefault();
            }
            else if (_selected_tab == TAB_RECORD_VIEWS) {
              if (_selected_record_view >= 0) {
                changeRecordViewDown();
                event.preventDefault();
              }
            }
            else if (_isTableSelected) {
              if (moveDown())
                event.preventDefault();
            }
            break;
          case KEY_PAGE_UP:
            if (_isTableSelected) {
              if (pageUp())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              if (_record_view_page_list[_selected_record_view] > 1) {
                setRecordViewPage(_record_view_page_list[_selected_record_view] - 1, _selected_record_view);
              }
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_REORDERS) {
              if (set_tableReorders_SelectedRow(_table_reorders_selected_row - 6))
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_PART_HISTORY) {
              if (set_tablePartHistory_SelectedRow(_table_parthistory_selected_row - 10))
                event.preventDefault();
            }
            break;
          case KEY_PAGE_DOWN:
            if (_isTableSelected) {
              if (pageDown())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              if (_record_view_page_list[_selected_record_view] < _RECORDVIEW_MAX_PAGES) {
                setRecordViewPage(_record_view_page_list[_selected_record_view] + 1, _selected_record_view);
              }
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_REORDERS) {
              if (set_tableReorders_SelectedRow(_table_reorders_selected_row + 6))
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_PART_HISTORY) {
              if (set_tablePartHistory_SelectedRow(_table_parthistory_selected_row + 10))
                event.preventDefault();
            }
            break;
          case KEY_HOME:
            if (_isTableSelected) {
              if (moveToHome())
                event.preventDefault();
            }
            break;
          case KEY_END:
            if (_isTableSelected) {
              if (moveToEnd())
                event.preventDefault();
            }
            break;
          case KEY_A:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_SEARCH_RESULTS);
            else if (!_focused && _selected_tab == TAB_SEARCH) {
              document.getElementById("radio_columns_any").click();
              document.getElementById("search_input").focus();
              event.preventDefault();
            }
            else if (!_focused && _key_shortcut_compare_record_views_available) {
              var ele1 = document.getElementById("radio_record_views_compareall");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              if (!_subscribed_mode || _writeable_mode) {
                var ele1 = document.getElementById("button_record_browser_add_new_part");
                if (ele1 != null) {
                  ele1.click();
                  event.preventDefault();
                }
              }
            }
            else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER) {
              var ele1 = document.getElementById("part_child_button_new");
              if (ele1 != null) {
                ele1.click();
                event.preventDefault();
                ele1 = document.getElementById("partchild_new_input_PN");
                if (ele1 != null)
                  ele1.focus();
              }
            }
            else if (!_focused && _key_shortcut_sort_order_new_available) {
              var ele1 = document.getElementById("button_add_sort_order");
              if (ele1 != null && ele1.style.display != "none") {
                ele1.click();
                event.preventDefault();
                ele1 = document.getElementById("sort_order_name_0");
                if (ele1 != null && ele1.style.display != "none")
                  ele1.focus();
              }
            }
            else if (_selected_tab == TAB_PDF_IMPORT) {
              if (!_focused || document.activeElement.id == "pdf_ordered_" + _table_pdf_import_selected_row) {
                var ele1 = document.getElementById("startAddToDatabaseButton_" + _table_pdf_import_selected_row);
                if (ele1 != null) {
                  ele1.click();
                  event.preventDefault();
                }
              }
            }
            else if (!_focused && _selected_tab == TAB_ADD_INVOICE) {
              if (clickAddInvoice_AddRow())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_EXPORT) {
              document.getElementById("button_export_inventory_all").click();
            }
            break;
          case KEY_B:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_RECORD_BROWSER);
            else if (!_focused && _selected_tab == TAB_SEARCH_RESULTS) {
              var ele1 = document.getElementById("button_search_results_jump_bottom");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _key_shortcuts_record_view_available) {
              var ele1 = document.getElementById("button_record_view_jump_to_browser_" + _selected_record_view);
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              var ele1 = document.getElementById("button_record_browser_jump_bottom");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_PDF_IMPORT) {
              var ele1 = document.getElementById("import_wlmay_pdf_input");
              if (ele1 != null && _key_shortcut_pdfimport_browse_available) {
                ele1.click();
              }
            }
            break;
          case KEY_C:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_CHANGE_HISTORY);
            else if (!_focused && _selected_tab == TAB_SEARCH)
              document.getElementById("search_add_child_part_links").click();
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER && _key_shortcut_copy_part_available) {
              var ele1 = document.getElementById("copy_icon_" + (_selectedRow));
              if (ele1 != null) {
                ele1.click();
                event.preventDefault();
              }
              deselectTable();
            }
            else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER) {
              if (clickPCRM_EditCancelButton()) { }
              else if (clickPCRM_NewCancelButton()) { }
              else if (clickPCRM_EditDeleteCancelButton()) {
                event.preventDefault();
              }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              if (clickRecordViewPNCancelButton()) { }
              else if (clickRecordViewSellCancelButton()) { }
              else if (clickRecordViewEditWholeCancelButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              if (clickRecordBrowserEditCancelButton()) { }
              else if (clickRecordBrowserEditDeleteCancelButton()) { }
              else if (clickRecordBrowserNewCancelButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_SORT_ORDERS) {
              if (clickSortOrder_EditCancelButton()) { }
              else if (clickSortOrder_EditDeleteCancelButton()) { }
              else if (clickSortOrder_NewCancelButton()) { }
            }
            else if (_selected_tab == TAB_PDF_IMPORT) {
              if (!_focused || document.activeElement.id == "pdf_ordered_" + _table_pdf_import_selected_row) {
                if (clickPdfImport_WLMAY_AddPartChild_Cancel()) {
                  event.preventDefault();
                }
                else if (clickPdfImport_WLMAY_CancelAddRowButton()) {
                  event.preventDefault();
                }
                else if (clickPdfImport_WLMAY_CancelButton()) {
                  event.preventDefault();
                }
              }
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY) {
              if (document.getElementById("invoice_from_history_content").style.display != "none") {
                clickViewInvoice_CancelDelete();
              }
              else if (clickInvoiceHistory_ClearFilters()) { }
            }
            else if (!_focused && _selected_tab == TAB_PART_HISTORY) {
              clickPartHistory_ClearFilters();
            }
            else if (!_focused && _selected_tab == TAB_CHANGE_HISTORY) {
              clickChangeHistory_ClearFilters();
            }
            else if (!_focused && _selected_tab == TAB_ADD_INVOICE) {
              if (clickAddInvoice_Cancel())
                event.preventDefault();
            }
            break;
          case KEY_D:
            if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              if (clickRecordBrowserEditDeleteButton()) { }
              else if (clickRecordBrowserEditDeleteConfirmButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER) {
              if (clickPCRM_EditDeleteButton()) { }
              else if (clickPCRM_EditDeleteConfirmButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_SORT_ORDERS) {
              if (clickSortOrder_EditDeleteButton()) { }
              else if (clickSortOrder_EditDeleteConfirmButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY && document.getElementById("invoice_from_history_content").style.display != "none") {
              if (clickViewInvoice_Delete()) { }
              else if (clickViewInvoice_ConfirmDelete()) {
                event.preventDefault();
              }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS && document.getElementById("googlesearch_image_div").style.display != "none") {
              document.getElementById("radio_image_distributors").click();
            }
            // else if (!_focused && _key_shortcut_record_views_image_available) {
            //   _selected_imagesource = _IMAGE_DISTRIBUTORS;
            //   checkForRecordViewImageButtons();
            // }
            break;
          case KEY_E:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_EXPORT);
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_SEARCH) {
              var ele = document.getElementById("search_partnum_any_input");
              ele.focus();
              ele.select();
              event.preventDefault();
            }
            // else if(!_focused && _selected_tab == TAB_SEARCH)
            //   document.getElementById("search_exact_match").click();
            else if (!_focused && _selected_tab == TAB_SEARCH_RESULTS) {
              var cell = getCell(0, _selectedCell, _TABLE_SEARCH_RESULTS);
              if (cell != null)
                onCellClick(0, _selectedCell, cell.id, _TABLE_SEARCH_RESULTS);
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              if (!_isTableSelected) {
                var cell = getCell(0, _selectedCell, _TABLE_RECORD_BROWSER);
                if (cell != null)
                  onCellClick(0, _selectedCell, cell.id, _TABLE_RECORD_BROWSER);
              }
              else if (_key_shortcut_edit_part_available) //Edit row
              {
                var ele1 = document.getElementById("edit_icon_" + _selectedRow);
                if (ele1 != null) {
                  ele1.click();
                  event.preventDefault();
                }
                deselectTable();
              }
            } else if (!_focused && _selected_tab == TAB_REORDERS) {
              document.getElementById("button_export_reorders").click();
            }
            else if (!_focused && _key_shortcut_edit_record_views_pn_available) {
              checkForRecordViewEditButtons();
            }
            else if (!_focused && _key_shortcut_sort_order_edit_available) {
              document.getElementById("key_shortcut_index_window_edit").style.display = "";
              _overlay_window_open = true;
              setKeyboardShortcutBar();
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY) {
              document.getElementById("button_export_invoices").click();
            }
            break;
          case KEY_F:
            if (!_focused && _selected_tab == TAB_INVOICE_HISTORY) {
              var ele1 = document.getElementById("invoice_history_filter_time");
              if (ele1 != null && ele1.style.display != "none") {
                ele1.focus();
                ele1.select();
                event.preventDefault();
              }
            }
            if (!_focused && _selected_tab == TAB_PART_HISTORY) {
              var ele1 = document.getElementById("part_history_filter_time");
              if (ele1 != null && ele1.style.display != "none") {
                ele1.focus();
                ele1.select();
                event.preventDefault();
              }
            }
            if (!_focused && _selected_tab == TAB_CHANGE_HISTORY) {
              var ele1 = document.getElementById("change_history_filter_time");
              if (ele1 != null && ele1.style.display != "none") {
                ele1.focus();
                ele1.select();
                event.preventDefault();
              }
            }
            else if (!_focused && _selected_tab == TAB_INVOICE) {
              var ele1 = document.getElementById("button_finish_sale");
              if (ele1 != null && ele1.style.display != "none") {
                ele1.click();
                event.preventDefault();
              }
            }
            break;
          case KEY_G:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_INVOICE_SETTINGS);
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_SEARCH)
              document.getElementById("search_highlight_similar_words").click();
            break;
          case KEY_H:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_INVOICE_HISTORY);
            else if (!_focused && _selected_tab == TAB_SEARCH)
              document.getElementById("search_highlight").click();
            break;
          case KEY_I:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_INVOICE);
              event.preventDefault();
            }
            else if (!_overlay_window_open && document.getElementById("non_invoice_content").style.display != "none" && _key_shortcut_Index_available) {
              document.getElementById("key_shortcut_index_window").style.display = "";
              _overlay_window_open = true;
            }
            setKeyboardShortcutBar();
            break;
          case KEY_J:
            if (!_focused && _key_shortcut_record_views_jump_pn_available) {
              checkForRecordViewJumpChildPartButtons();
            }
            break;
          case KEY_L:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_PEOPLE);
            }
            break;
          case KEY_M:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_PDF_IMPORT);
            else if (!_focused && _key_shortcut_record_views_image_available) {
              _selected_imagesource = _IMAGE_EVERYWHERE;
              checkForRecordViewImageButtons();
            }
            else if (!_focused && _selected_tab == TAB_PDF_IMPORT) {
              var ele1 = document.getElementById("import_marcone_ocr_input");
              if (ele1 != null && _key_shortcut_ocrimport_marcone_available) {
                ele1.click();
              }
            }
            break;
          case KEY_N:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_ADD_INVOICE);
              event.preventDefault();
            }
            break;
          case KEY_O:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_SORT_ORDERS);
            else if (!_focused && _selected_tab == TAB_REORDERS) {
              clickReorders_Order();
            }
            break;
          case KEY_P:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_PART_CHILD_RECORD_MANAGER);
            else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER) {
              var ele1 = document.getElementById("part_child_edit_input");
              if (ele1 != null) {
                ele1.focus();
                event.preventDefault();
              }
            }
            else if (!_focused && _selected_tab == TAB_INVOICE) {
              if (clickInvoice_Print())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY) {
              if (clickInvoice_Print())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_ADD_INVOICE) {
              if (clickInvoice_Print())
                event.preventDefault();
            }
            // else if(!_focused && _selected_tab == TAB_SEARCH)
            // {
            //   document.getElementById("search_ignore_special_characters").click();
            //   event.preventDefault();
            // }
            break;
          case KEY_Q:
            if (!_focused && _key_shortcut_compare_record_views_available) {
              var ele1 = document.getElementById("radio_record_views_differences");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_EXPORT) {
              document.getElementById("button_export_inventory_qty").click();
            }
            break;
          case KEY_R:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_REORDERS);
            else if (!_focused && _selected_tab == TAB_SEARCH) {
              document.getElementById("repititions_min").focus();
              event.preventDefault();
            }
            else if (!_focused && _key_shortcut_edit_record_view_whole_available) {
              var ele1 = document.getElementById("record_view_data_edit_icon_" + _selected_record_view);
              if (ele1 != null && ele1.style.display != "none") {
                ele1.click();
                event.preventDefault();
              }
            }
            else if (!_focused && _key_shortcut_record_browser_sort_by_column) {
              sortContentByIndex(_INDEX_ORDER[_selectedCell]);
            }
            else if (!_focused && _key_shortcut_search_results_sort_by_column) {
              sortContentByIndex(_INDEX_ORDER[_selectedCell]);
            }
            else if (!_focused && _selected_tab == TAB_REORDERS) {
              clickReorders_UpdateAllReorders();
            }
            else if (!_focused && _key_shortcut_invoice_remove_available) {
              var ele1 = document.getElementById("key_shortcut_invoice_remove_window");
              var inc = 0;
              var ele2 = document.getElementById("invoice_input_desc_" + inc);
              var text = "";
              while (ele2 != null && inc < 9) {
                text += "<span style='color: white;'>" + (inc + 1) + "</span>. ." + ele2.value + "<br>";
                ++inc;
                ele2 = document.getElementById("invoice_input_desc_" + inc);
              }
              if (inc > 0) {
                ele1.style.display = "";
                _overlay_window_open = true;
                ele1.innerHTML = text;
              }
            }
            else if (!_focused && _selected_tab == TAB_PDF_IMPORT) {
              var ele1 = document.getElementById("import_reliable_ocr_input");
              if (ele1 != null && _key_shortcut_ocrimport_reliableparts_available) {
                ele1.click();
              }
            }
            break;
          case KEY_S:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_SEARCH);
              focusSearchInput(event);
            }
            else if (_key_shortcut_search_results_search_in_current_results) {
              setTab(TAB_SEARCH);
              focusSearchInput(event);
              _selected_searchQuery_scope = _SEARCHSCOPE_CURRENT;
              document.getElementById("search_scope_indicator").innerHTML = "<b>(Searching in Current Results)</b>";
            }
            else if (!_focused && _selected_tab == TAB_SEARCH) {
              document.getElementById("radio_columns_specific").click();
              var ele1 = document.getElementById("search_input_" + _INDEX_ORDER[0]);
              if (ele1 != null && document.getElementById("radio_columns_div").style.display != "none") {
                ele1.focus();
                ele1.select();
              }
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER) {
              if (clickPCRM_EditSaveButton()) { }
              else if (clickPCRM_NewSaveButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              if (clickRecordViewSellConfirmButton()) { }
              else if (clickRecordViewPNSaveButton()) { }
              else if (checkForRecordViewSellButtons()) { }
              else if (clickRecordViewEditWholeSaveButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              if (clickRecordBrowserEditSaveButton()) { }
              else if (clickRecordBrowserNewSaveButton()) { }
            }
            else if (!_focused && _selected_tab == TAB_SORT_ORDERS) {
              if (clickSortOrder_EditSaveButton()) { }
              else if (clickSortOrder_NewSaveButton()) { }
            }
            else if (_selected_tab == TAB_PDF_IMPORT) {
              if (!_focused || document.activeElement.id == "pdf_ordered_" + _table_pdf_import_selected_row) {
                if (clickPdfImport_WLMAY_AddPartChild_Submit()) {
                  event.preventDefault();
                }
                else if (clickPdfImport_WLMAY_SaveAddRowButton()) {
                  event.preventDefault();
                }
              }
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_SETTINGS) {
              clickInvoiceSettings_Save();
            }
            else if (!_focused && _selected_tab == TAB_ADD_INVOICE) {
              if (clickAddInvoice_Save())
                event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY) {
              if (document.getElementById("invoice_from_history_content").style.display != "none" && clickInvoice_Save())
                event.preventDefault();
              else
                document.getElementById("invoice_checkbox_" + _table_invoicehistory_selected_row).click();
            }
            break;
          case KEY_T:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_PART_HISTORY);
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_SEARCH_RESULTS) {
              var ele1 = document.getElementById("button_search_results_jump_top");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              var ele1 = document.getElementById("button_record_browser_jump_top");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_PART_CHILD_RECORD_MANAGER) {
              var ele1 = document.getElementById("part_child_dropdown_select");
              if (ele1 != null) {
                ele1.focus();
                event.preventDefault();
              }
            }
            break;
          case KEY_U:
            if (shortcutmenu_mainmenu_available) {
              setTab(TAB_SUGGESTIONS);
              event.preventDefault();
            }
            else if (!_focused && _selected_tab == TAB_REORDERS) {
              clickReorders_UpdateRow();
            }
            else if (!_focused && _selected_tab == TAB_INVOICE_HISTORY) {
              // clickInvoiceHistory_Update();
            }
            else if (!_focused && _selected_tab == TAB_CHANGE_HISTORY) {
              clickChangeHistory_Update();
            }
            break;
          case KEY_V:
            if (shortcutmenu_mainmenu_available)
              setTab(TAB_RECORD_VIEWS);
            else if (_key_shortcut_add_record_view_available) {
              switch (_selectedTable) {
                case _TABLE_SEARCH_RESULTS:
                  addRecordView(_SEARCH_RESULTS_ROW_IDS[_selectedRow]);
                  break;
                case _TABLE_SIMILAR_STRINGS:
                  addRecordView(_SIMILAR_STRINGS_ROW_IDS[_selectedRow]);
                  break;
                case _TABLE_RECORD_BROWSER:
                  addRecordView(_RECORD_BROWSER_ROW_IDS[_selectedRow]);
                  break;
              }
            }
            else if (!_focused && _selected_tab == TAB_REORDERS) {
              clickReorders_AddRecordView();
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS && document.getElementById("googlesearch_image_div").style.display != "none") {
              document.getElementById("radio_image_everywhere").click();
            }
            break;
          case KEY_W:
            if (!_focused && _key_shortcut_compare_record_views_available) {
              var ele1 = document.getElementById("radio_record_views_similarities");
              if (ele1 != null)
                ele1.click();
            }
            else if (!_focused && _selected_tab == TAB_PDF_IMPORT) {
              var ele1 = document.getElementById("import_wlmay_ocr_input");
              if (ele1 != null && _key_shortcut_ocrimport_wlmay_available) {
                ele1.click();
              }
            }
            break;
          case KEY_X:
            if (!_focused && _key_shortcuts_record_view_available) {
              var ele1 = document.getElementById("button_record_view_exit_" + _selected_record_view);
              if (ele1 != null)
                ele1.click();
            }
            break;
          case KEY_Z:
            if (!_focused && _selected_tab == TAB_SEARCH_RESULTS) {
              var ele1 = document.getElementById("search_results_max");
              if (ele1 != null) {
                ele1.focus();
                event.preventDefault();
              }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_BROWSER) {
              var ele1 = document.getElementById("record_browser_max");
              if (ele1 != null) {
                ele1.focus();
                event.preventDefault();
              }
            }
            break;
          case KEY_MINUS:
            if (!_focused && _key_shortcut_sort_order_edit_addremove_available) {
              var inc = 1;
              var ele1 = document.getElementById("button_sortorder_edit_minus_" + _current_sort_order_editing + "_" + inc);
              var lastele = null;
              while (ele1 != null) {
                lastele = ele1;
                ++inc;
                ele1 = document.getElementById("button_sortorder_edit_minus_" + _current_sort_order_editing + "_" + inc);
              }
              if (lastele != null && lastele.style.display != "none") {
                lastele.click();
                event.preventDefault();
                ele1 = document.getElementById("sort_order_select_" + _current_sort_order_editing + "_" + (inc - 2));
                if (ele1 != null && ele1.style.display != "none")
                  ele1.focus();
              }
            }
            else if (!_focused && _key_shortcut_sort_order_new_addremove_available) {
              var inc = 1;
              var ele1 = document.getElementById("button_sortorder_edit_minus_0_" + inc);
              var lastele = null;
              while (ele1 != null) {
                lastele = ele1;
                ++inc;
                ele1 = document.getElementById("button_sortorder_edit_minus_0_" + inc);
              }
              if (lastele != null && lastele.style.display != "none") {
                lastele.click();
                event.preventDefault();
                ele1 = document.getElementById("sort_order_select_0_" + (inc - 2));
                if (ele1 != null && ele1.style.display != "none")
                  ele1.focus();
              }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              var i = 0;
              var ele1 = document.getElementById("div_recordview_collapser_" + i);
              var ele2 = document.getElementById("record_view_details_" + i + "_div");
              if (ele1 != null && ele1.style.display != "none" && ele2 != null && ele2.style.display != "none")
                toggleDiv(null, "record_view_details_" + i);

            }
            break;
          case KEY_PLUS:
            if (!_focused && _key_shortcut_sort_order_edit_addremove_available) {
              var inc = 0;
              var ele1 = document.getElementById("button_sortorder_edit_plus_" + _current_sort_order_editing + "_" + inc);
              var lastele = null;
              while (ele1 != null) {
                lastele = ele1;
                ++inc;
                ele1 = document.getElementById("button_sortorder_edit_plus_" + _current_sort_order_editing + "_" + inc);
              }
              if (lastele != null && lastele.style.display != "none") {
                lastele.click();
                event.preventDefault();
                ele1 = document.getElementById("sort_order_select_" + _current_sort_order_editing + "_" + inc);
                if (ele1 != null && ele1.style.display != "none")
                  ele1.focus();
              }
            }
            else if (!_focused && _key_shortcut_sort_order_new_addremove_available) {
              var inc = 0;
              var ele1 = document.getElementById("button_sortorder_edit_plus_0_" + inc);
              var lastele = null;
              while (ele1 != null) {
                lastele = ele1;
                ++inc;
                ele1 = document.getElementById("button_sortorder_edit_plus_0_" + inc);
              }
              if (lastele != null && lastele.style.display != "none") {
                lastele.click();
                event.preventDefault();
                ele1 = document.getElementById("sort_order_select_0_" + inc);
                if (ele1 != null && ele1.style.display != "none")
                  ele1.focus();
              }
            }
            else if (!_focused && _selected_tab == TAB_RECORD_VIEWS) {
              var i = 0;
              var ele1 = document.getElementById("div_recordview_collapser_" + i);
              var ele2 = document.getElementById("record_view_details_" + i + "_div");
              if (ele1 != null && ele1.style.display != "none" && ele2 != null && ele2.style.display == "none")
                toggleDiv(null, "record_view_details_" + i);
            }
            break;
        }
        partnum_input_was_pressed_first = false;
      } //end !_overlay_window_open
      else {
        if (document.getElementById("key_shortcut_index_window").style.display != "none") {
          for (var i = 0; i < _SortOrderKeyCodes.length; ++i) {
            if (event.code == _SortOrderKeyCodes[i]) {
              document.getElementById("key_shortcut_index_window").style.display = "none";
              _overlay_window_open = false;
              setKeyboardShortcutBar();
              sortContentBySortOrder(i);
              event.preventDefault();
              break;
            }
          }
        }
        else if (document.getElementById("key_shortcut_index_window_edit").style.display != "none") {
          for (var i = 0; i < _SortOrderKeyCodes.length; ++i) {
            if (event.code == _SortOrderKeyCodes[i]) {
              document.getElementById("key_shortcut_index_window_edit").style.display = "none";
              _overlay_window_open = false;
              var ele1 = document.getElementById("sort_order_edit_icon_" + i);
              if (ele1 != null && ele1.style.display != "none") {
                ele1.click();
                ele1 = document.getElementById("sort_order_name_" + (i + 1));
                if (ele1 != null) {
                  ele1.focus();
                  ele1.select();
                }
              }
              setKeyboardShortcutBar();
              event.preventDefault();
              break;
            }
          }
        }
        else if (document.getElementById("key_shortcut_extra_db_sell_window").style.display != "none") {
          for (var i = 0; i < _EXTRA_DB_COMMENTS_PREFIXES.length; ++i) {
            var ele1 = document.getElementById("sell_button_" + _selected_record_view + "_" + i);
            if (event.code == "Key" + _EXTRA_DB_COMMENTS_PREFIXES[i] && ele1 != null && ele1.style.display != "none") {
              document.getElementById("key_shortcut_extra_db_sell_window").style.display = "none"
              _overlay_window_open = false;
              ele1.click();
              setKeyboardShortcutBar();
              event.preventDefault();
              break;
            }
          }
        }
        else if (document.getElementById("key_shortcut_extra_db_edit_window").style.display != "none") {
          for (var i = 0; i < _EXTRA_DB_COMMENTS_PREFIXES.length; ++i) {
            var ele1 = document.getElementById("record_view_partnum_edit_icon_" + _selected_record_view + "_" + i);
            if (event.code == "Key" + _EXTRA_DB_COMMENTS_PREFIXES[i] && ele1 != null && ele1.style.display != "none") {
              document.getElementById("key_shortcut_extra_db_edit_window").style.display = "none"
              _overlay_window_open = false;
              ele1.click();
              setKeyboardShortcutBar();
              event.preventDefault();
              break;
            }
          }
        }
        else if (document.getElementById("key_shortcut_extra_db_image_window").style.display != "none") {
          for (var i = 0; i < _EXTRA_DB_COMMENTS_PREFIXES.length; ++i) {
            var ele1;
            if (_selected_imagesource == _IMAGE_EVERYWHERE)
              ele1 = document.getElementById("button_recordview_image_everywhere_" + _selected_record_view + "_" + i);
            else
              ele1 = document.getElementById("button_recordview_image_distributors_" + _selected_record_view + "_" + i);
            if (event.code == "Key" + _EXTRA_DB_COMMENTS_PREFIXES[i] && ele1 != null && ele1.style.display != "none") {
              document.getElementById("key_shortcut_extra_db_image_window").style.display = "none"
              _overlay_window_open = false;
              ele1.click();
              setKeyboardShortcutBar();
              event.preventDefault();
              break;
            }
          }
        }
        else if (document.getElementById("key_shortcut_extra_db_jumpPN_window").style.display != "none") {
          for (var i = 0; i < _EXTRA_DB_COMMENTS_PREFIXES.length; ++i) {
            var ele1 = document.getElementById("span_recordviews_jump_to_child_part_" + _selected_record_view + "_" + i);
            if (event.code == "Key" + _EXTRA_DB_COMMENTS_PREFIXES[i] && ele1 != null && ele1.style.display != "none") {
              document.getElementById("key_shortcut_extra_db_jumpPN_window").style.display = "none"
              _overlay_window_open = false;
              ele1.click();
              setKeyboardShortcutBar();
              event.preventDefault();
              break;
            }
          }
        }
        else if (document.getElementById("key_shortcut_invoice_remove_window").style.display != "none") {
          for (var i = 1; i < 10; ++i) {
            var ele1 = document.getElementById("button_invoice_remove_" + (i - 1));
            if (event.code == "Digit" + i && ele1 != null && ele1.style.display != "none") {
              document.getElementById("key_shortcut_invoice_remove_window").style.display = "none"
              _overlay_window_open = false;
              ele1.click();
              setKeyboardShortcutBar();
              event.preventDefault();
              break;
            }
          }
        }
        // else if(document.getElementById("key_shortcut_search_scope_window").style.display != "none")
        // {
        //   var hide = false;
        //   switch(event.code)
        //   {
        //     case "Digit1":
        //       searchQueryScope(_SEARCHSCOPE_NEW);
        //       hide = true;
        //       break;
        //     case "Digit2":
        //       searchQueryScope(_SEARCHSCOPE_CURRENT);
        //       hide = true;
        //       break;
        //   }
        //   if(hide)
        //   {
        //     document.getElementById("key_shortcut_search_scope_window").style.display = "none";
        //     _overlay_window_open = false;
        //     event.preventDefault();
        //   }
        // }
      }
      if (!_focused)
        setKeyboardShortcutBar();
    } //End !ctrl and !shift
    else if (pressedKeys[KEY_CTRL_LEFT]) {
      if (!_overlay_window_open) {
        if (event.code == KEY_A) {
          if (!_focused && _selected_tab == TAB_RECORD_VIEWS && _recordViews.length > 0) {
            recordView_JumpToAka();
            event.preventDefault();
          }
        }
      }
      if (!_focused)
        setKeyboardShortcutBar();
    }

    if (event.code == KEY_ESCAPE) {
      pressedKeys = {};
    }
  } else { //Content div not visible
    if (!pressedKeys[KEY_CTRL_LEFT] && !pressedKeys[KEY_SHIFT_LEFT] && !pressedKeys[KEY_ALT_LEFT]
      && !pressedKeys[KEY_CTRL_RIGHT] && !pressedKeys[KEY_SHIFT_RIGHT] && !pressedKeys[KEY_ALT_RIGHT]) {
      if (event.code == KEY_ESCAPE) {
        var ele1 = document.getElementById("do_Print");
        if (ele1.style.display != "none") {
          document.getElementById("print_back_button").click();
        }
      }
    }
  }
}