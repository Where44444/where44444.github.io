class W4DateTime {
    // var date: Date?= Date()

    constructor(a, b, c, d, e, f) {
        if (a === undefined) {
            this.constructor0();
        }
        else if (b === undefined) {
            this.constructor1(a);
        }
        else if (e === undefined) {
            this.constructor2(a, b, c, d);
        }
        else {
            this.constructor3(a, b, c, d, e, f);
        }
    }

    constructor0() {
        this.date = new Date();
    }

    constructor1(millis) {
        if (millis < 0) {
            millis = 0;
        }
        this.date = new Date(millis);
    }

    constructor2(datetime, hourOfDay, minuteOfHour, secondOfMinute) {
        this.constructor3(datetime.getYear(), datetime.getMonthOfYear(), datetime.getDayOfMonth(), hourOfDay, minuteOfHour, secondOfMinute)
    }

    //Automatically moves time forward an hour if DST says it doesn't exist
    constructor3(year, monthOfYear, dayOfMonth, hourOfDay, minuteOfHour, secondOfMinute) {
        this.date = new Date(year, monthOfYear - 1, dayOfMonth, hourOfDay, minuteOfHour, secondOfMinute);
    }

    getMillis() {
        return this.date.getTime();
    }

    getYear() {
        return this.date.getFullYear();
    }

    getMonthOfYear() {
        return this.date.getMonth() + 1;
    }

    getDayOfMonth() {
        return this.date.getDate();
    }

    getDayOfWeek() {
        return this.date.getDay();
    }

    getHourOfDay() {
        return this.date.getHours();
    }

    getMinuteOfDay() {
        return this.date.getMinutes() + this.date.getHours() * 60;
    }

    getMinuteOfHour() {
        return this.date.getMinutes();
    }

    getSecondOfMinute() {
        return this.date.getSeconds();
    }

    getMillisOfDay() {
        return TimeUnit.MINUTES.toMillis(this.getMinuteOfDay());
    }

    static treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    daysBetween(time2) {
        return Math.abs(W4DateTime.treatAsUTC(this.date) - W4DateTime.treatAsUTC(time2.date)) / TimeUnit.DAYS.toMillis(1);
    }

    plusDays(days) {
        var date = new Date(this.date.getTime());
        date.setDate(date.getDate() + days);
        return this;
    }

    plusMonths(months) {
        var date = new Date(this.date.getTime());
        date.setMonth(date.getMonth() + months);
        return this;
    }

    plusYears(years) {
        var date = new Date(this.date.getTime());
        date.setFullYear(date.getFullYear() + years);
        return this;
    }

    getDaysInMonth() {
        return new Date(this.getYear(), this.getMonthOfYear(), 0).getDate();
    }

}