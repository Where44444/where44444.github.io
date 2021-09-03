class TaskSheet extends Asset {
    // var name = "";
    // var locationID = "";
    // var shiftID = "";
    // var tasks = [];
    // var subTasks = [];
    // var durations = []; //Time in minutes alloted to complete each task

    // //Uncommon tasks
    // var repeatAmount = [];
    // var repeatUnit = [];
    // var endUnit = [];
    // var repeatEndOccurences = [];
    // var repeatEndDate = [];
    // var weeklyRepeatDays = [];
    // var monthlyRepeatType = [];
    // var template = false;

    constructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        if (a === undefined) {
            super("");
            this.constructor0();
        }
        else if (b === undefined) {
            super(a.w4id);
            this.constructor1(a);
        } else {
            super(a);
            this.constructor2(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
        }
    }

    constructor0() {
        this.name = "";
        this.locationID = "";
        this.shiftID = "";
        this.tasks = [];
        this.subTasks = [];
        this.durations = [];
        this.repeatAmount = [];
        this.repeatUnit = [];
        this.endUnit = [];
        this.repeatEndOccurences = [];
        this.repeatEndDate = [];
        this.weeklyRepeatDays = [];
        this.monthlyRepeatType = [];
        this.template = false;
    }

    constructor1(taskSheet) {
        this.constructor2(taskSheet.w4id, taskSheet.name, taskSheet.locationID, taskSheet.shiftID, taskSheet.tasks, taskSheet.subTasks, taskSheet.durations, taskSheet.repeatAmount, taskSheet.repeatUnit, taskSheet.endUnit, taskSheet.repeatEndOccurences, taskSheet.repeatEndDate, taskSheet.weeklyRepeatDays, taskSheet.monthlyRepeatType, taskSheet.template);
    }

    constructor2(id, name0, locationID, shiftID, tasks, subTasks, durations, repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType, template) {
        this.name = name0;
        this.locationID = locationID;
        this.shiftID = shiftID;
        this.tasks = tasks;
        this.subTasks = subTasks;
        this.durations = durations;
        this.repeatAmount = repeatAmount;
        this.repeatUnit = repeatUnit;
        this.endUnit = endUnit;
        this.repeatEndOccurences = repeatEndOccurences;
        this.repeatEndDate = repeatEndDate;
        this.weeklyRepeatDays = weeklyRepeatDays;
        this.monthlyRepeatType = monthlyRepeatType;
        this.template = template;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var name = dataSnapshot["name"];
        var locationID = dataSnapshot["locationID"];
        var shiftID = dataSnapshot["shiftID"];
        var tasks = dataSnapshot["tasks"];
        var subTasks = dataSnapshot["subTasks"];
        var durations = dataSnapshot["durations"];
        var repeatAmount = dataSnapshot["repeatAmount"];
        var repeatUnit = dataSnapshot["repeatUnit"];
        var endUnit = dataSnapshot["endUnit"];
        var repeatEndOccurences = dataSnapshot["repeatEndOccurences"];
        var repeatEndDate = dataSnapshot["repeatEndDate"];
        var weeklyRepeatDays = dataSnapshot["weeklyRepeatDays"];
        var monthlyRepeatType = dataSnapshot["monthlyRepeatType"];
        var template = dataSnapshot["template"];

        if (tasks == null)
            tasks = [];
        if (subTasks == null)
            subTasks = [];
        if (durations == null)
            durations = [];
        if (repeatAmount == null)
            repeatAmount = [];
        if (repeatUnit == null)
            repeatUnit = [];
        if (endUnit == null)
            endUnit = [];
        if (repeatEndOccurences == null)
            repeatEndOccurences = [];
        if (repeatEndDate == null)
            repeatEndDate = [];
        if (weeklyRepeatDays == null)
            weeklyRepeatDays = [];
        if (monthlyRepeatType == null)
            monthlyRepeatType = [];

        return new TaskSheet(w4id, name, locationID, shiftID, tasks, subTasks, durations, repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType, template);
    }

    getName() {
        return this.name;
    }

    setName(name0) {
        this.name = name0;
    }

    getLocationID() {
        return this.locationID;
    }

    setLocationID(locationID) {
        this.locationID = locationID;
    }

    getShiftID() {
        return this.shiftID;
    }

    setShiftID(shiftID) {
        this.shiftID = shiftID;
    }

    getTasks() {
        return this.tasks;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    getSubTasks() {
        return this.subTasks;
    }

    setSubTasks(subTasks) {
        this.subTasks = subTasks;
    }

    getDurations() {
        return this.durations;
    }

    setDurations(durations) {
        this.durations = durations;
    }

    getRepeatAmount(i) {
        if (i === undefined)
            return this.repeatAmount;
        else
            return this.getRepeatAmount_i(i);
    }

    setRepeatAmount(repeatAmount) {
        this.repeatAmount = repeatAmount;
    }

    getRepeatUnit(i) {
        if (i === undefined)
            return this.repeatUnit;
        else
            return this.getRepeatUnit_i(i);
    }

    setRepeatUnit(repeatUnit) {
        this.repeatUnit = repeatUnit;
    }

    getEndUnit(i) {
        if (i === undefined)
            return this.endUnit;
        else
            return this.getEndUnit_i(i);
    }

    setEndUnit(endUnit) {
        this.endUnit = endUnit;
    }

    getRepeatEndOccurences(i) {
        if (i === undefined)
            return this.repeatEndOccurences;
        else
            return this.getRepeatEndOccurences_i(i);
    }

    setRepeatEndOccurences(repeatEndOccurences) {
        this.repeatEndOccurences = repeatEndOccurences;
    }

    getRepeatEndDate(i) {
        if (i === undefined)
            return this.repeatEndDate;
        else
            return this.getRepeatEndDate_i(i);
    }

    setRepeatEndDate(repeatEndDate) {
        this.repeatEndDate = repeatEndDate;
    }

    getWeeklyRepeatDays(i) {
        if (i === undefined)
            return this.weeklyRepeatDays;
        else
            return this.getWeeklyRepeatDays_i(i);
    }

    setWeeklyRepeatDays(weeklyRepeatDays) {
        this.weeklyRepeatDays = weeklyRepeatDays;
    }

    getMonthlyRepeatType(i) {
        if (i === undefined)
            return this.monthlyRepeatType;
        else
            return getMonthlyRepeatType_i(i);
    }

    setMonthlyRepeatType(monthlyRepeatType) {
        this.monthlyRepeatType = monthlyRepeatType;
    }

    getStartTime(i) {
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), this.shiftID);
        if (shift != null)
            return shift.getStartTime();
        return 0;
    }

    getEndTime(i) {
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), this.shiftID);
        if (shift != null)
            return shift.getEndTime();
        return 0;
    }

    getRepeatUnit_i(i) {
        return this.repeatUnit[i];
    }

    getRepeatAmount_i(i) {
        return this.repeatAmount[i];
    }

    getEndUnit_i(i) {
        return this.endUnit[i];
    }

    getRepeatEndOccurences_i(i) {
        return this.repeatEndOccurences[i];
    }

    getRepeatEndDate_i(i) {
        return this.repeatEndDate[i];
    }

    getWeeklyRepeatDays_i(i) {
        return this.weeklyRepeatDays[i];
    }

    getMonthlyRepeatType_i(i) {
        return this.monthlyRepeatType[i];
    }

    isTemplate() {
        return this.template;
    }

    setTemplate(template) {
        this.template = template;
    }


    method_searchString() {
        var locationName = "";
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), this.locationID);
        if (location != null) {
            locationName = location.getName();
        }
        return this.name + " " + locationName;
    }


    method_getTemplateName() {
        return this.name;
    }
}
