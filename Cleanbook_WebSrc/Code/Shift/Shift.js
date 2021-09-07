class Shift extends Asset {

    //  String name;
    // var startTime = 0;
    // var endTime = 0;
    //  int repeatAmount;
    //  int repeatUnit;
    //  int endUnit;
    //  int repeatEndOccurences;
    //  long repeatEndDate;
    //  ArrayList<Boolean> weeklyRepeatDays;
    //  int monthlyRepeatType;
    //  ArrayList<String> personIDList;
    //  String locationID;
    //  int color;

    constructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
        if (a === undefined) {
            super("");
            this.constructor0();
        } else {
            super(a);
            this.constructor1(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
        }
    }

    constructor0() {
        this.name = "";
        this.startTime = 0;
        this.endTime = 0;
        this.repeatAmount = 0;
        this.repeatUnit = 0;
        this.endUnit = 0;
        this.repeatEndOccurences = 1;
        this.repeatEndDate = 0;
        this.weeklyRepeatDays = [false, false, false, false, false, false, false];
        this.monthlyRepeatType = 0;
        this.personIDList = [];
        this.locationID = "";
        this.color = 0;
    }

    constructor1(id, name0, startTime, endTime, repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType, personIDList, locationID, color) {
        this.name = name0;
        this.startTime = startTime;
        this.endTime = endTime;
        this.repeatAmount = repeatAmount;
        this.repeatUnit = repeatUnit;
        this.endUnit = endUnit;
        this.repeatEndOccurences = repeatEndOccurences;
        this.repeatEndDate = repeatEndDate;
        this.weeklyRepeatDays = weeklyRepeatDays;
        this.monthlyRepeatType = monthlyRepeatType;
        this.personIDList = personIDList;
        this.locationID = locationID;
        this.color = color;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var name = dataSnapshot["name"];
        var startTime = dataSnapshot["startTime"];
        var endTime = dataSnapshot["endTime"];
        var repeatAmount = dataSnapshot["repeatAmount"];
        var repeatUnit = dataSnapshot["repeatUnit"];
        var endUnit = dataSnapshot["endUnit"];
        var repeatEndOccurences = dataSnapshot["repeatEndOccurences"];
        var repeatEndDate = dataSnapshot["repeatEndDate"];
        var weeklyRepeatDays = dataSnapshot["weeklyRepeatDays"];
        var monthlyRepeatType = dataSnapshot["monthlyRepeatType"];
        var personIDList = dataSnapshot["personIDList"];
        var locationID = dataSnapshot["locationID"];
        var color = dataSnapshot["color"];

        if (weeklyRepeatDays == null)
            weeklyRepeatDays = [false, false, false, false, false, false, false];
        if (personIDList == null)
            personIDList = [];

        return new Shift(w4id, name, startTime, endTime, repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType, personIDList, locationID, color);
    }

    getName() {
        return this.name;
    }

    setName(name0) {
        this.name = name0;
    }

    getStartTime() {
        return this.startTime;
    }

    setStartTime(startTime) {
        this.startTime = startTime;
    }

    getEndTime() {
        return this.endTime;
    }

    setEndTime(endTime) {
        this.endTime = endTime;
    }

    getRepeatUnit() {
        return this.repeatUnit;
    }

    setRepeatUnit(repeatUnit) {
        this.repeatUnit = repeatUnit;
    }

    getRepeatAmount() {
        return this.repeatAmount;
    }

    setRepeatAmount(repeatAmount) {
        this.repeatAmount = repeatAmount;
    }

    getEndUnit() {
        return this.endUnit;
    }

    setEndUnit(endUnit) {
        this.endUnit = endUnit;
    }

    getRepeatEndOccurences() {
        return this.repeatEndOccurences;
    }

    setRepeatEndOccurences(repeatEndOccurences) {
        this.repeatEndOccurences = repeatEndOccurences;
    }

    getRepeatEndDate() {
        return this.repeatEndDate;
    }

    setRepeatEndDate(repeatEndDate) {
        this.repeatEndDate = repeatEndDate;
    }

    getWeeklyRepeatDays() {
        return this.weeklyRepeatDays;
    }

    setWeeklyRepeatDays(weeklyRepeatDays) {
        this.weeklyRepeatDays = weeklyRepeatDays;
    }

    getMonthlyRepeatType() {
        return this.monthlyRepeatType;
    }

    setMonthlyRepeatType(monthlyRepeatType) {
        this.monthlyRepeatType = monthlyRepeatType;
    }

    getPersonIDList() {
        return this.personIDList;
    }

    setPersonIDList(personIDList) {
        this.personIDList = personIDList;
    }

    getLocationID() {
        return this.locationID;
    }

    setLocationID(locationID) {
        this.locationID = locationID;
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
    }

    static compareTo(a, o) {
        if (a.getStartTime() < o.getStartTime()) {
            return 1;
        }
        if (a.getStartTime() > o.getStartTime()) {
            return -1;
        }
        return 0;
    }

    method_getFullName() {
        var name = W4_Funcs.getTimeText(new W4DateTime(this.getStartTime())) + " to " + W4_Funcs.getTimeText(new W4DateTime(this.getEndTime()));
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), this.getLocationID());
        if (location != null)
            name = location.getName() + " " + name;
        return name;
    }

    method_doesShiftGoOvernight() {
        return !W4_Funcs.isSameDay(new W4DateTime(this.startTime), new W4DateTime(this.endTime));
    }

    method_getEndTimeOfOccurence(startTime) {
        var endTime0 = new W4DateTime(this.endTime);
        if (this.method_doesShiftGoOvernight()) {
            return W4_Funcs.getDSTSafeDateTime(W4_Funcs.getNextDay(startTime), endTime0.getHourOfDay(), endTime0.getMinuteOfHour(), endTime0.getSecondOfMinute());
        } else {
            return W4_Funcs.getDSTSafeDateTime(startTime, endTime0.getHourOfDay(), endTime0.getMinuteOfHour(), endTime0.getSecondOfMinute());
        }
    }


    method_searchString() {
        var locationName = "";
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), this.locationID);
        if (location != null) {
            locationName = location.getName();
        }
        var startTimeDT = new W4DateTime(this.startTime);
        var endTimeDT = new W4DateTime(this.endTime);
        var startTimeText = W4_Funcs.getTimeText(startTimeDT);
        var endTimeText = W4_Funcs.getTimeText(endTimeDT);
        return this.name + " " + locationName + " " + startTimeText + " " + endTimeText;
    }
}
