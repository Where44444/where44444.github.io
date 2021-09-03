class TimeUnitType {

    constructor(toMillis, toMinutes, toHours, toDays) {
        this.to_Millis = toMillis;
        this.to_Minutes = toMinutes;
        this.to_Hours = toHours;
        this.to_Days = toDays;
    }

    toMillis(unit) {
        return unit * this.to_Millis;
    }

    toMinutes(unit) {
        return unit * this.to_Minutes;
    }

    toHours(unit) {
        return unit * this.to_Hours;
    }

    toDays(unit) {
        return unit * this.to_Days;
    }
}