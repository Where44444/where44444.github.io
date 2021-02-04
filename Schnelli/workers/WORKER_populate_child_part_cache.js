var _content_extra = null;
var _extradb_link_index_cache = null;
var _EXTRA_DB_FIELDS = null;
var _AKA_GLOBAL = null;

onmessage = function(e) {
    var _content = e.data[0];
    _content_extra = e.data[1];
    var _EXTRA_DB = e.data[2];
    _extradb_link_index_cache = e.data[3];
    var _CONTENT_EXTRA_DB_INDEXES = e.data[4];
    _EXTRA_DB_FIELDS = e.data[5];
    _AKA_GLOBAL = e.data[6];

    for(var i = 0; i < _content.length; ++i)
    {
        if(i % 1000 == 0)
            postMessage([0, i / _content.length]);
        for(var j = 0; j < _EXTRA_DB.length; ++j)
        {
            var foo = getExtraDBLinkIndex(j, _content[i][_CONTENT_EXTRA_DB_INDEXES[j]]);
        }
    }
    var results = [1, _extradb_link_index_cache];
    postMessage(results);
    _content = null;
    _content_extra = null;
    _EXTRA_DB = null;
    _extradb_link_index_cache = null;
    _CONTENT_EXTRA_DB_INDEXES = null;
    _EXTRA_DB_FIELDS = null;
    _AKA_GLOBAL = null;
}

function getExtraDBLinkIndex(db, pn) 
{
  if (pn.length > 0) 
  {
    if(_extradb_link_index_cache[db].has(pn))
    {
      var index = _extradb_link_index_cache[db].get(pn);
      if(_content_extra[db].length > index && String(_content_extra[db][index][0].PN) == pn) //Only include exact match PN in cache to ensure it doesn't load inferior match if indexes are changed
      {
        return index;
      }
      _extradb_link_index_cache[db].delete(pn); //Cache invalid
    }
    
    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match PN
    {
      if (String(_content_extra[db][i][0].PN) == pn) 
      {
        _extradb_link_index_cache[db].set(pn, i);
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0].PN)) == pn1) //General match PN
      {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) //Exact match AKA
    {
      if (String(_content_extra[db][i][0][_EXTRA_DB_FIELDS[db][_AKA_GLOBAL]]) == pn) {
        return i;
      }
    }
    for (var i = 0; i < _content_extra[db].length; ++i) {
      var pn1 = getStandardPNString(pn);
      if (getStandardPNString(String(_content_extra[db][i][0][_EXTRA_DB_FIELDS[db][_AKA_GLOBAL]])) == pn1) //General match AKA
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
  