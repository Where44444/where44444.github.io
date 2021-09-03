class RepeatingDateStruct {
    // var startTime = 0;
    // var endTime = 0;
    //  int repeatAmount;
    //  int repeatUnit;
    //  int endUnit;
    //  int repeatEndOccurences;
    //  long repeatEndDate;
    //  ArrayList<Boolean> weeklyRepeatDays;
    //  int monthlyRepeatType;

    constructor(startTime, endTime, repeatAmount, repeatUnit, endUnit, repeatEndOccurences, repeatEndDate, weeklyRepeatDays, monthlyRepeatType) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.repeatAmount = repeatAmount;
        this.repeatUnit = repeatUnit;
        this.endUnit = endUnit;
        this.repeatEndOccurences = repeatEndOccurences;
        this.repeatEndDate = repeatEndDate;
        this.weeklyRepeatDays = weeklyRepeatDays;
        this.monthlyRepeatType = monthlyRepeatType;
    }

    getStartTime(i) {
        return this.startTime;
    }

    setStartTime(startTime) {
        this.startTime = startTime;
    }

    getEndTime(i) {
        return this.endTime;
    }

    setEndTime(endTime) {
        this.endTime = endTime;
    }

    getRepeatAmount(i) {
        return this.repeatAmount;
    }

    setRepeatAmount(repeatAmount) {
        this.repeatAmount = repeatAmount;
    }

    getRepeatUnit(i) {
        return this.repeatUnit;
    }

    setRepeatUnit(repeatUnit) {
        this.repeatUnit = repeatUnit;
    }

    getEndUnit(i) {
        return this.endUnit;
    }

    setEndUnit(endUnit) {
        this.endUnit = endUnit;
    }

    getRepeatEndOccurences(i) {
        return this.repeatEndOccurences;
    }

    setRepeatEndOccurences(repeatEndOccurences) {
        this.repeatEndOccurences = repeatEndOccurences;
    }

    getRepeatEndDate(i) {
        return this.repeatEndDate;
    }

    setRepeatEndDate(repeatEndDate) {
        this.repeatEndDate = repeatEndDate;
    }

    getWeeklyRepeatDays(i) {
        return this.weeklyRepeatDays;
    }

    setWeeklyRepeatDays(weeklyRepeatDays) {
        this.weeklyRepeatDays = weeklyRepeatDays;
    }

    getMonthlyRepeatType(i) {
        return this.monthlyRepeatType;
    }

    setMonthlyRepeatType(monthlyRepeatType) {
        this.monthlyRepeatType = monthlyRepeatType;
    }
}
