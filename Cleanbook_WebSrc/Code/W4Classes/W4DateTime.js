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
        return Math.ceil(Math.abs(W4DateTime.treatAsUTC(this.date) - W4DateTime.treatAsUTC(time2.date)) / TimeUnit.DAYS.toMillis(1));
    }

    plusDays(days) {
        this.date = new Date(this.date.getTime());
        this.date.setDate(this.date.getDate() + days);
        return this;
    }

    plusMonths(months) {
        var origDate = new W4DateTime(this.getMillis());
        this.date = new Date(this.date.getTime());
        this.date.setMonth(this.date.getMonth() + months);
        if (months >= 0) {
            var dt2 = this;
            var dt1 = origDate;
            if ((dt2.getMonthOfYear() + dt2.getYear() * 12) - (dt1.getMonthOfYear() + dt1.getYear() * 12) != months) {
                var prevMonth = this.getMonthOfYear() - 1;
                var year = this.getYear();
                if (prevMonth == 0) {
                    year -= 1;
                    prevMonth = 12;
                }
                var dt0 = new W4DateTime(year, prevMonth, 1, 0, 0, 0);
                this.constructor3(year, prevMonth, dt0.getDaysInMonth(), this.getHourOfDay(), this.getMinuteOfHour(), this.getSecondOfMinute());
            }
        }
        return this;
    }

    plusYears(years) {
        var origDate = new W4DateTime(this.getMillis());
        this.date = new Date(this.date.getTime());
        this.date.setFullYear(this.date.getFullYear() + years);
        if (years >= 0) {
            var dt2 = this;
            var dt1 = origDate;
            if (Math.abs((dt2.getMonthOfYear() + dt2.getYear() * 12) - (dt1.getMonthOfYear() + dt1.getYear() * 12)) % 12 != 0) {
                var prevMonth = this.getMonthOfYear() - 1;
                var year = this.getYear();
                if (prevMonth == 0) {
                    year -= 1;
                    prevMonth = 12;
                }
                var dt0 = new W4DateTime(year, prevMonth, 1, 0, 0, 0);
                this.constructor3(year, prevMonth, dt0.getDaysInMonth(), this.getHourOfDay(), this.getMinuteOfHour(), this.getSecondOfMinute());
            }
        }
        return this;
    }

    getDaysInMonth() {
        return new Date(this.getYear(), this.getMonthOfYear(), 0).getDate();
    }

}