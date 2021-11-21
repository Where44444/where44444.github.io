var _socket = null;
var _socket_from_sync = false;

function openLocalServerScreen() {
    _LOCAL_SERVER_MODE = true;
    document.getElementById("server_select_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("local_server_connect_div").style.display = "block";
    var ip = localStorage.getItem("local_server_ip");
    if (ip != null) {
        document.getElementById("input_local_server_ip").value = ip;
    }
    document.getElementById("input_local_server_ip").focus();
    document.getElementById("input_local_server_ip").select();
}

function exitLocalServerScreen() {
    document.getElementById("server_select_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("local_server_connect_div").style.display = "none";
}

function connectToLocalServer(fromSync) {
    closeWebSocket();
    if (fromSync == null) {
        fromSync = false;
    }
    _socket_from_sync = fromSync;

    var ip;
    if (_socket_from_sync) {
        ip = document.getElementById("input_local_server_ip_sync").value;
        localStorage.setItem("local_server_ip", ip); //Cookies cannot be stored for local files
    }
    else {
        ip = document.getElementById("input_local_server_ip").value;
        localStorage.setItem("local_server_ip", ip); //Cookies cannot be stored for local files
        // localStorage.clear();
    }

    _socket = new WebSocket('ws://' + ip + ':5444'); //192.168.1.227
    _socket.addEventListener('open', socketOpened);
    _socket.addEventListener('message', socketRecievedMessage);
    _socket.addEventListener('close', socketClosed);

    if (_socket_from_sync) {
        document.getElementById("local_server_connect_div_loading_sync").style.display = "block";
        document.getElementById("local_server_connect_div_non_loading_sync").style.display = "none";
    }
    else {
        document.getElementById("local_server_connect_div_loading").style.display = "block";
        document.getElementById("local_server_connect_div_non_loading").style.display = "none";
    }
}

function cancelConnectToLocalServer() {
    closeWebSocket();
    document.getElementById("local_server_connect_div_loading").style.display = "none";
    document.getElementById("local_server_connect_div_non_loading").style.display = "block";
}

function closeWebSocket() {
    if (_socket != null) {
        _socket.removeEventListener('open', socketOpened);
        _socket.removeEventListener('message', socketRecievedMessage);
        _socket.close();
    }
    _socket = null;
    _socket_from_sync = false;
    // _LOCAL_SERVER_MODE = false;
}

function socketOpened(event) {
    // console.log("Socket connected");
    // console.log(event);
    if (_socket_from_sync) {
        sync_button();
    } else {
        // _LOCAL_SERVER_MODE = true;
        document.getElementById("server_select_div").style.display = "none";
        document.getElementById("login_div").style.display = "none";
        document.getElementById("local_server_connect_div").style.display = "none";
        document.getElementById("local_server_connect_div_loading").style.display = "none";
        document.getElementById("local_server_connect_div_non_loading").style.display = "block";
        loadContentDiv1();
        setKeyboardShortcutBar();
        // deleteFromDB("change_history");
    }
}

function socketClosed(event) {
    // console.log("Socket closed");
    // console.log(event);
    showSnackbar("Lost connection to local server!", 20000);
}