class TimePunch extends Asset {

    //  long time;
    //  boolean clockIn;
    //  String locationID;
    //  String personID;
    //  String shiftID;

    constructor(a, b, c, d, e, f) {
        if (a === undefined) {
            super("");
            this.constructor0();
        } else {
            super(a);
            this.constructor1(a, b, c, d, e, f);
        }
    }

    constructor0() {
        this.time = 0;
        this.clockIn = false;
        this.locationID = "";
        this.personID = "";
        this.shiftID = "";
    }

    constructor1(id, time, clockIn, locationID, personID, shiftID) {
        this.time = time;
        this.clockIn = clockIn;
        this.locationID = locationID;
        this.personID = personID;
        this.shiftID = shiftID;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var time = dataSnapshot["time"];
        var clockIn = dataSnapshot["clockIn"];
        var locationID = dataSnapshot["locationID"];
        var personID = dataSnapshot["personID"];
        var shiftID = dataSnapshot["shiftID"];
        return new TimePunch(w4id, time, clockIn, locationID, personID, shiftID);
    }

    getTime() {
        return this.time;
    }

    setTime(time) {
        this.time = time;
    }

    getClockIn() {
        return this.clockIn;
    }

    setClockIn(clockIn) {
        this.clockIn = clockIn;
    }

    getLocationID() {
        return this.locationID;
    }

    setLocationID(locationID) {
        this.locationID = locationID;
    }

    getPersonID() {
        return this.personID;
    }

    setPersonID(personID) {
        this.personID = personID;
    }

    getShiftID() {
        return this.shiftID;
    }

    setShiftID(shiftID) {
        this.shiftID = shiftID;
    }

    static compareTo(a, o) {
        if (o.getTime() > a.getTime())
            return 1;
        else if (a.getTime() > o.getTime())
            return -1;
        else if (!o.getClockIn())
            return 1;
        else
            return -1;
    }

    method_searchString() {
        var locationName = "";
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), this.locationID);
        if (location != null) {
            locationName = location.getName() + " ";
        }
        var personName = "";
        var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), this.personID);
        if (person != null) {
            personName = person.getFirst_name() + " " + person.getLast_name() + " ";
        }
        var timeDT = new W4DateTime(this.time);
        var dateText = W4_Funcs.getFriendlyDateText(timeDT);
        var timeText = W4_Funcs.getTimeText(timeDT);
        return personName + locationName + dateText + " " + timeText;
    }
}
