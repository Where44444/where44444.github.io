        // console.log(JSON.stringify(myobj));
        var indexes = ["RECORD_NUMBER","DESCRIP1","DESCRIP2","COMMENTS","EQUIP_TYPE","EQUIP_DSGN","APPL_BRAND","APPL_MFR","PART_TYPE","B_PN",   "CHLX_PN","F_PN",   "GEM_PN", "RS_PN",  "MM_PN",  "JS_PN",  "K_PN",   "L_PN",   "M_PN",   "N_PN",   "OEM_PN", "PART_NUMBR", "Q_PN",   "SOURCE", "UNIT",   "KEEP",   "REORD_QTY","GET",    "PICKED", "TAG",    "FROM",   "CGS",    "DATE",   "FRT_IN", "QUESTIONS","MODIFIED","NEW",    "NEWER",  "LOCATION","SPECMETHOD","SPEC01NAME","SPEC01HINT","SPEC01DATA","SPEC02NAME","SPEC02HINT","SPEC02DATA","SPEC03NAME","SPEC03HINT","SPEC03DATA","SPEC04NAME","SPEC04HINT","SPEC04DATA","SPEC05NAME","SPEC05HINT","SPEC05DATA","SPEC06NAME","SPEC06HINT","SPEC06DATA","SPEC07NAME","SPEC07HINT","SPEC07DATA","SPEC08NAME","SPEC08HINT","SPEC08DATA","SPEC09NAME","SPEC09HINT","SPEC09DATA","SPEC10NAME","SPEC10HINT","SPEC10DATA","SPEC11NAME","SPEC11HINT","SPEC11DATA","SPEC12NAME","SPEC12HINT","SPEC12DATA"];

        function readSingleFile_PA_PRI(evt) {
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function(e) { 
                    var contents = e.target.result;
                    _content_PA_PRI = processCSVData(contents);
                    console.log("ascii " + _content_PA_PRI.length);
                }
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        }

        function readSingleFile_look_up_pn(evt) {
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function(e) { 
                    var contents = e.target.result;
                    _content_look_up_pn = processLSTData(contents);
                    console.log("look_up_pn " + _content_look_up_pn.length);
                    console.log(_content_look_up_pn[0]);
                    console.log(_content_look_up_pn[1]);
                }
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        }

        function readSingleFile_advice(evt) {
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function(e) { 
                    var contents = e.target.result;
                    _content_advice = processLSTData(contents);
                    console.log("advice " + _content_advice.length);
                }
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        }
        
        function readSingleFile_attn(evt) {
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function(e) { 
                    var contents = e.target.result;
                    _content_attn = processLSTData(contents);
                    console.log("attn " + _content_attn.length);
                }
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        }

        function readSingleFile_model(evt) {
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function(e) { 
                    var contents = e.target.result;
                    _content_model = processLSTData(contents);
                    console.log("model " + _content_model.length);
                }
                r.readAsText(f);
            } else {
                alert("Failed to load file");
            }
        }

        var _content_PA_PRI;
        var _content_look_up_pn;
        var _content_advice;
        var _content_attn;
        var _content_model;

        document.getElementById('fileinput_ascii').addEventListener('change', readSingleFile_PA_PRI, false);
        document.getElementById('fileinput_look_up_pn').addEventListener('change', readSingleFile_look_up_pn, false);
        document.getElementById('fileinput_advice').addEventListener('change', readSingleFile_advice, false);
        document.getElementById('fileinput_attn').addEventListener('change', readSingleFile_attn, false);
        document.getElementById('fileinput_model').addEventListener('change', readSingleFile_model, false);

        function generateJSON(){
            var objs = [];
            for(var i = 0; i < _content_PA_PRI.length; ++i){
                var myObj = new Object();
                for(var j = 0; j < indexes.length; ++j)
                    myObj[indexes[j]] = _content_PA_PRI[i][j];
                myObj.LOOK_UP_PN = _content_look_up_pn[i];
                myObj.ADVICE = _content_advice[i];
                myObj.ATTN = _content_attn[i];
                myObj.MODEL = _content_model[i];
                objs.push(myObj);
            }
            console.log(objs[0]);
            document.getElementById("inputs_div").style.display = "none";
            var blob = new Blob([JSON.stringify(objs)], {
              "type": "application/json"
            });
            var a = document.createElement("a");
            a.download = name;
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        function processLSTData(allText){
            var contents = allText.split("\n\*");
            var finalContent = [];
            for(var i = 0; i < contents.length; ++i){
                var contentlines = contents[i].split("\n");
                for(var j = 0; j < contentlines.length; ++j){
                    if(contentlines[j].length > 0 && contentlines[j][0] == "*"){
                        contentlines[j] = contentlines[j].substring(1, contentlines[j].length);
                    }
                    while(contentlines[j].length > 0 && contentlines[j][0] == " "){
                        contentlines[j] = contentlines[j].substring(1, contentlines[j].length);
                    }
                }
                finalContent.push(contentlines);
            }
            return finalContent;
        }

        function processCSVData(allText) {
            var quotes = false;
            var row = 0;
            var column = 0;
            var start = 0;
            var end = 0;
            var _content = new Array(25862);
            // _indexToContentID = new Array(25862);
            for (var i = 0; i < _content.length; ++i) { 
                _content[i] = new Array(indexes.length);
                // _indexToContentID[i] = _content[i][0];
                for(var j = 0; j < indexes.length + 1; ++j){
                _content[i][j] = "";
                }
            } 
            for(var i = 0; i < allText.length; ++i)
            {
                var n = allText.charAt(i);
                if(n == '\"'){
                    quotes = !quotes;
                }
                else if(n == ',' && !quotes){
                    end = i;
                    _content[row][column] = stripQuotations(allText.substring(start, end));
                    ++column;
                    start = i + 1;
                }
                else if(n == '\n'){
                    end = i;
                    _content[row][column] = stripQuotations(allText.substring(start, end));
                    column = 0;
                    ++row;
                    start = i + 1;
                }
            }
            return _content;
        }

        function stripQuotations(str1)
        {
            var str = String(str1);
            if(str.length >= 2 && str[0] == "\"" && str[str.length - 1] == "\"")
            {
                return str.substring(1, str.length - 1);
            }
            if(str.length >= 3 && str[0] == "\"" && str[str.length - 2] == "\"" && str[str.length - 1] == "\r")
            {
                return str.substring(1, str.length - 2);
            }
            return str;
        }