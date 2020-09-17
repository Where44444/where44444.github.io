var _content = null;
var _content_extra = null;

onmessage = function(e) {
    _content = e.data[0];
    _content_extra = e.data[1];
    var _CONTENT_EXTRA_DB_INDEXES = e.data[2];
    var _GET = e.data[3];
    var _KEEP = e.data[4];
    var _REORD_QTY = e.data[5];

    var content_rownums_changed = [];
    for(var i = 0; i < _content.length; ++i)
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
            _content[i][_REORD_QTY] = String(bulk);
            contentChanged = true;
        }
        else
        {
            _content[i][_REORD_QTY] = "0";
            contentChanged = true;
        }
      }
      else
      {
        if(qty < keep)
        {
            _content[i][_REORD_QTY] = String(keep - qty);
            contentChanged = true;
        }
        else
        {
            _content[i][_REORD_QTY] = "0";
            contentChanged = true;
        }
      }
      if(contentChanged)
        content_rownums_changed.push(i);
      
      if(_content.length > 0)
      {
        var status = [0, i / _content.length];
        postMessage(status);
      }
    }

    var results = [1, _content, content_rownums_changed];
    postMessage(results);
}

function getExtraDBLinkIndex(_content_extra_db_index, pn) {
    if (pn.length > 0) {
      for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) //Exact match PN
      {
        if (String(_content_extra[_content_extra_db_index][i][0].PN) == pn) {
          return i;
        }
      }
      for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) {
        var pn1 = getStandardPNString(pn);
        if (getStandardPNString(String(_content_extra[_content_extra_db_index][i][0].PN)) == pn1) //General match PN
        {
          return i;
        }
      }
      for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) //Exact match AKA
      {
        if (String(_content_extra[_content_extra_db_index][i][0].AKA) == pn) {
          return i;
        }
      }
      for (var i = 0; i < _content_extra[_content_extra_db_index].length; ++i) {
        var pn1 = getStandardPNString(pn);
        if (getStandardPNString(String(_content_extra[_content_extra_db_index][i][0].AKA)) == pn1) //General match AKA
        {
          return i;
        }
      }
    }
    return null;
  }

  function getStandardPNString(str1) {
    var str = String(str1);
    var modified = true;
    while (modified) {
      var orig_length = str.length;
      // str = removeStartingZeroes(str);
      str = removeEndTilde(str);
      str = removeEndArrow(str);
      str = removeEndExclaim(str);
      str = removeEndSemicolon(str);
      modified = (orig_length != str.length);
    }
    return str.toLowerCase();
  }

  function removeEndTilde(str1) {
    var str = String(str1);
    if (str.length > 0 && str[str.length - 1] == "~")
      str = str.substring(0, str.length - 1);
    return str;
  }
  
  function removeEndArrow(str1) {
    var str = String(str1);
    if (str.length > 1 && str[str.length - 2] == "-" && str[str.length - 1] == ">")
      str = str.substring(0, str.length - 2);
    return str;
  }
  
  function removeEndExclaim(str1) {
    var str = String(str1);
    if (str.length > 0 && str[str.length - 1] == "!")
      str = str.substring(0, str.length - 1);
    return str;
  }
  
  function removeEndSemicolon(str1) {
    var str = String(str1);
    if (str.length > 0 && str[str.length - 1] == ";")
      str = str.substring(0, str.length - 1);
    return str;
  }