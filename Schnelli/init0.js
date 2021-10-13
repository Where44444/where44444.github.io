// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
// import { readFromDB } from "./database_funcs.js";

const queryString = window.location.search;
// ?product=shirt&color=blue&newuser&size=m
const urlParams = new URLSearchParams(queryString);
const clientq = urlParams.get('client');

var firebaseConfig = {
  apiKey: "AIzaSyBiHDF9LJepi4QyOhHeayZT_etKN5AjlGs",
  authDomain: "appliance-parts-f45cd.firebaseapp.com",
  databaseURL: "https://appliance-parts-f45cd.firebaseio.com",
  projectId: "appliance-parts-f45cd",
  storageBucket: "appliance-parts-f45cd.appspot.com",
  messagingSenderId: "671454569102",
  appId: "1:671454569102:web:479b1d3a11bedf601c1fdf"
};
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
firebase.auth().onAuthStateChanged(function (user) {
  if (clientq != null) {
    document.getElementById("button_server_select_firebase").click();
  }
  if (user) {
    // User is signed in. Has saved login info
    console.log("DETECTED AUTH STATE CHANGE|LOGGED IN");
    _FIREBASE_LOGGED_IN = true;
    // var partRef = firebase.database().ref(_DATABASE_PREFIX);
    // partRef.remove();

    // var ref = firebase.database().ref("");
    // ref.set("");

    readFromDB('open_data/admin_uid', function (val0, key0) {
      _admin_uid = val0;
      if (_FIREBASE_LOGGED_IN) { //Can get triggered from logging into new account being made 
        if (firebase.auth().currentUser.uid == _admin_uid) {
          readFromDB('admin_data', function (val0, key0) {
            _admin_email = val0.email;
            _admin_password = val0.password;
            setDataRef();
            updateClientsTable();
          }, _OVERRIDE_FIREBASE);
        }

        setSuggestionsRef();
        updateSuggestionsBox();
      }
    }, _OVERRIDE_FIREBASE);
  }
  else {
    console.log("DETECTED AUTH STATE CHANGE|LOGGED OUT");
    _FIREBASE_LOGGED_IN = false;
  }
});