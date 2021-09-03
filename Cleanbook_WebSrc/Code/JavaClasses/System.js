class System {
    static exit(exitcode) {
        HomeActivity.logOut();
        var intent = new Intent(AppCompatActivity.getApplicationContext(), null);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        MainActivity.mainActivity.startActivity(intent);

        document.getElementById("bars_div").style.display = "none";
        document.getElementById("activities").innerHTML = "<p>An error has occured<br>Code " + exitcode + "<br>Please refresh the website</p>";

        setTimeout(function () {
            document.getElementById("bars_div").style.display = "none";
            document.getElementById("activities").innerHTML = "<p>An error has occured<br>Code " + exitcode + "<br>Please refresh the website</p>";
        }, 1000);
    }
}