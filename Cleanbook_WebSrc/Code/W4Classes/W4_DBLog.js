class W4_DBLog {
    // var string = "";
    // var dateTimeString = "";
    // var dateTime = 0;
    // var person = "";
    // var db_path = "";

    constructor(a, b, c, d, e) {
        if (a === undefined) {
            this.constructor0();
        } else {
            this.constructor1(a, b, c, d, e);
        }
    }

    constructor0() {
        this.string = "";
        this.dateTimeString = "";
        this.dateTime = 0;
        this.person = "";
        this.db_path = "";
    }

    constructor1(string, dateTimeString, dateTime, person, db_path) {
        this.string = string;
        this.dateTimeString = dateTimeString;
        this.dateTime = dateTime;
        this.person = person;
        this.db_path = db_path;
    }

    static writeTo_DB_Log(log, db_path) {
        if (MainActivity.currentPerson != null) {
            var reffLog = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_LOG).push();
            var now = new W4DateTime();
            var dtString = now.getMonthOfYear() + "/" + now.getDayOfMonth() + "/" + now.getYear() + " " + W4_Funcs.getTimeText(now);
            reffLog.set(new W4_DBLog("(W) " + log, dtString, now.getMillis(), MainActivity.currentPerson.getFirst_name() + " " + MainActivity.currentPerson.getLast_name(), db_path));
        }
    }

    static getPersonStringForLog(personID) {
        var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), personID);
        if (person != null) {
            return person.getFirst_name() + " " + person.getLast_name();
        }
        return personID;
    }

    static getLocationStringForLog(locationID) {
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), locationID);
        if (location != null) {
            return location.getName();
        }
        return locationID;
    }

    static getShiftStringForLog(shiftID) {
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shiftID);
        if (shift != null) {
            return shift.getName();
        }
        return shiftID;
    }
}
