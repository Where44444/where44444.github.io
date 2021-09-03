class Message extends Asset {
    //  String w4text;
    //  long time;
    //  String personID;
    //  String locationID;

    constructor(w4id, w4text, time, personID, locationID) {
        super(w4id);
        this.w4text = w4text;
        this.time = time;
        this.personID = personID;
        this.locationID = locationID;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var w4text = dataSnapshot["w4text"];
        var time = dataSnapshot["time"];
        var personID = dataSnapshot["personID"];
        var locationID = dataSnapshot["locationID"];
        return new Message(w4id, w4text, time, personID, locationID);
    }

    getW4text() {
        return this.w4text;
    }

    setW4text(w4text) {
        this.w4text = w4text;
    }

    getTime() {
        return this.time;
    }

    setTime(time) {
        this.time = time;
    }

    getPersonID() {
        return this.personID;
    }

    setPersonID(personID) {
        this.personID = personID;
    }

    getLocationID() {
        return this.locationID;
    }

    setLocationID(locationID) {
        this.locationID = locationID;
    }

    isMessageInList(list) {
        for (let message of list) {
            if (message.getW4id() == (this.w4id))
                return true;
        }
        return false;
    }

    static compareTo(a, o) {
        if (a.getTime() < o.getTime()) {
            return -1;
        }
        if (a.getTime() > o.getTime()) {
            return 1;
        }
        return 0;
    }
}
