//Each activity html is loaded from string in .js files, 
//added as a new activity_div_x in activity_divs div, hides all divs and only shows top most one whenever activity is pushed or popped


// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in. Has saved login info
//     // loadContentDiv();
//     _LOGGED_IN = true;
//   }
//   else {
//     // document.getElementById("login_div").style.display = "block";
//   }
// });

// var _LOGGED_IN = false;
// function log_out(){
//   firebase.auth().signOut().then(function() {

//     clearData();
//     _LOGGED_IN = false;

//   }).catch(function(error) {
//     window.alert(errorMessage);
//   });
// }

// function log_in() {
//   document.getElementById("login_div").style.display = "none";

//   var MainActivity.persistenceVar;
//   if(document.getElementById("remember_input").checked)
//     MainActivity.persistenceVar = firebase.auth.Auth.Persistence.LOCAL;
//   else
//     MainActivity.persistenceVar = firebase.auth.Auth.Persistence.NONE;

//     firebase.auth().setPersistence(MainActivity.persistenceVar).then(function() {
//         return firebase.auth().signInWithEmailAndPassword(document.getElementById("email_input").getText(), document.getElementById("password_input").getText()).then(function() {
//           loadContentDiv();
//           _LOGGED_IN = true;
//           setKeyboardShortcutBar();
//           }).catch(function(error) {
//           // Handle Errors here.
//           var errorCode = error.code;
//           var errorMessage = error.message;
//           console.log("login error " + errorMessage);
//           window.alert(errorMessage);
//           // ...
//           document.getElementById("login_div").style.display = "block";
//         });
//       }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log("persistence error " + errorMessage);
//         window.alert(errorMessage);
//   });
// }

