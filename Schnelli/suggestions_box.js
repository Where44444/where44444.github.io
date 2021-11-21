var _part_suggestions = null;

function updateSuggestionsBox() {
  let numSuggestions = 0;
  if (firebase.auth().currentUser.uid == _admin_uid) { //Populate form for approving suggestions
    if (_part_suggestions != null && objSize(_part_suggestions) > 0) {
      let tableHTML = "<h2>Pending Suggestions</h2><table id='review_suggestions_table'><tr><th>Approval</th><th>Suggestion</th></tr>";
      let tableEmpty = true;
      for (let [key, value] of Object.entries(_part_suggestions)) {
        if (value.approved == null) {
          ++numSuggestions;
          tableEmpty = false;
          tableHTML += "<tr><td><p>" + value.w4_email + "</p><button onclick='review_suggestion(true,\"" + key + "\");'>Approve</button>&nbsp;&nbsp;&nbsp;<button onclick='review_suggestion(false,\"" + key + "\");'>Reject</button></td>";
          tableHTML += "<td><p>" + value.text + "</p></td></tr>";
        }
      }
      if (tableEmpty) {
        tableHTML = "No pending suggestions recieved yet<br><br><br>";
      } else {
        tableHTML += "</table><br><br><br>";
      }

      let tableHTML2 = "<h2>Completed Suggestions</h2><table id='completed_suggestions_table'><tr><th>Approval</th><th>Suggestion</th></tr>";
      tableEmpty = true;
      for (let [key, value] of Object.entries(_part_suggestions)) {
        if (value.approved != null) {
          tableEmpty = false;
          let approvedText = "<b>Approved</b>";
          if (!value.approved)
            approvedText = "<b>Rejected</b>";
          tableHTML2 += "<tr><td><p>" + value.w4_email + "</p><p>" + approvedText + "</p></td>";
          tableHTML2 += "<td><p>" + value.text + "</p></td></tr>";
        }
      }
      if (tableEmpty) {
        tableHTML2 = "";
      } else {
        tableHTML2 += "</table><br><br><br>";
      }

      document.getElementById("part_suggestions_table").innerHTML = tableHTML + tableHTML2;
    }
    else {
      document.getElementById("part_suggestions_table").innerHTML = "No suggestions recieved yet<br><br><br>";
    }
  }
  else { //Populate form for adding suggestions
    var tableHTML = "<p>If you want to suggest adding a part to our database, add all the info you can about the part here and press \"Send Suggestion\"</p><textarea id='textarea_suggestion' style='width: 500px; height: 200px;'></textarea><br><br><button onclick='send_suggestion();'>Send Suggestion</button>";
    document.getElementById("part_suggestions_table").innerHTML = tableHTML;
  }

  var tab_text = "Suggestions Box";
  if (numSuggestions > 0)
    tab_text += "&nbsp;&nbsp;<span style='background-color: red; color: white; font-weight: bold;'>&nbsp;" + numSuggestions + "&nbsp;</span>";
  document.getElementById("TAB_suggestions").innerHTML = tab_text;
}

function review_suggestion(approved, key) {
  writeToDB("part_suggestions/" + key + "/approved", approved, function () {
    writeToDB("part_suggestions/" + key + "/w4_employeeid", _current_employee.id, function () {
      writeToChangeHistory("Review | Part Suggestion", "Part Suggestion \"" + ellipsizeText(_part_suggestions[key].text, 100) + "\" | Approved: \"" + approved + "\"");
      updateSuggestionsBox();
    }, _OVERRIDE_FIREBASE);
  }, _OVERRIDE_FIREBASE);
}

function send_suggestion() {
  var obj = new Object();
  obj.text = document.getElementById("textarea_suggestion").value;
  obj.w4_email = firebase.auth().currentUser.email;
  var ref = getNewKeyPath("part_suggestions");
  writeToDB(ref, obj, null, _OVERRIDE_FIREBASE);
  updateSuggestionsBox();
  showSnackbar("Thank you for your suggestion! It has been sent.", 5000);
}