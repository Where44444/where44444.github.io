class W4_Funcs {

    static isAssetReadOnly(ALL) {
        return (!MainActivity.currentPerson.getWritePermissions()[ALL] && !MainActivity.currentPerson.getWritePermissions()[ALL + 1]);
    }

    static isAssetReadable(ALL) {
        return (MainActivity.currentPerson.getReadPermissions()[ALL] || MainActivity.currentPerson.getReadPermissions()[ALL + 1]);
    }

    static isAssetWriteable(ALL) {
        return (MainActivity.currentPerson.getWritePermissions()[ALL] || MainActivity.currentPerson.getWritePermissions()[ALL + 1]);
    }

    static isSameDay(a, b) {
        if (typeof (a) == 'number') {
            return W4_Funcs.isSameDay0(a, b);
        } else {
            return W4_Funcs.isSameDay1(a, b);
        }
    }

    static isSameDay0(millis1, millis2) {
        var dateTime1 = new W4DateTime(millis1);
        var dateTime2 = new W4DateTime(millis2);
        return (dateTime1.getYear() == dateTime2.getYear()
            && dateTime1.getMonthOfYear() == dateTime2.getMonthOfYear()
            && dateTime1.getDayOfMonth() == dateTime2.getDayOfMonth());
    }

    static isSameDay1(dateTime1, dateTime2) {
        return (dateTime1.getYear() == dateTime2.getYear()
            && dateTime1.getMonthOfYear() == dateTime2.getMonthOfYear()
            && dateTime1.getDayOfMonth() == dateTime2.getDayOfMonth());
    }

    static dateTimeToCalendarDay(dateTime) {
        return dateTime;
    }

    static calendarDayToDateTime(day, hour, minute, second) {
        return W4_Funcs.getDSTSafeDateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), hour, minute, second);
    }

    static getIntFromEditText(editText, defaultInt) {
        var string = editText.getText();
        if (string.length > 0) {
            var int1 = Number(string);
            return int1;
        }
        return defaultInt;
    }

    static getSelectedDateFromCalendar(materialCalendarView) {
        if (materialCalendarView == null || materialCalendarView.getSelectedDate() == null)
            return dateTimeToCalendarDay(new W4DateTime());
        else
            return materialCalendarView.getSelectedDate();
    }

    static useBlackText(backgroundColor) {
        var hexStr = W4_Funcs.decimalToHex(backgroundColor);
        var R = parseInt("0x" + hexStr.substring(0, 2)) / 255;
        var G = parseInt("0x" + hexStr.substring(2, 4)) / 255;
        var B = parseInt("0x" + hexStr.substring(4, 6)) / 255;
        var gamma = 2.2;
        var L = 0.2126 * Math.pow(R, gamma)
            + 0.7152 * Math.pow(G, gamma)
            + 0.0722 * Math.pow(B, gamma);
        return (L > 0.5);
    }

    static getDaysDiff(dateTime1, dateTime2) {
        return dateTime1.daysBetween(dateTime2);
    }

    /**
     * @param dateTime
     * @return First sunday before given date at 12:00am
     */
    static getStartOfWeek(dateTime) {
        dateTime = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        dateTime = new W4DateTime(dateTime.getMillis() - TimeUnit.DAYS.toMillis(dateTime.getDayOfWeek() % 7));
        var hours = dateTime.getHourOfDay();
        if (hours / 24 > 0.5)
            dateTime = new W4DateTime(dateTime.getMillis() + TimeUnit.HOURS.toMillis(24 - hours));
        else
            dateTime = new W4DateTime(dateTime.getMillis() - TimeUnit.HOURS.toMillis(hours));
        return dateTime;
    }

    /*
     * @param dateTime
     * @return Thursday of week of given date at 12:00pm
     */
    static getMiddleOfWeek(dateTime) {
        var dayOfWeek = dateTime.getDayOfWeek() % 7;
        var daysDiff = 3 - dayOfWeek;
        var finalDt = W4_Funcs.getAdjustedDaySameTime(dateTime, daysDiff);
        return W4_Funcs.getDSTSafeDateTime(finalDt.getYear(), finalDt.getMonthOfYear(), finalDt.getDayOfMonth(), 12, 0, 0);
    }

    static getDSTSafeDateTime(a, b, c, d, e, f) {
        if (e === undefined) {
            return W4_Funcs.getDSTSafeDateTime0(a, b, c, d);
        } else {
            return W4_Funcs.getDSTSafeDateTime1(a, b, c, d, e, f);
        }
    }

    static getDSTSafeDateTime0(dt, hourOfDay, minuteOfHour, secondOfMinute) {
        var dateTime = new W4DateTime(dt.getYear(), dt.getMonthOfYear(), dt.getDayOfMonth(), hourOfDay, minuteOfHour, secondOfMinute);
        if (isNaN(dateTime.date.getTime())) {
            console.log("New DateTime caused exception!");
            return new W4DateTime(dt.getYear(), dt.getMonthOfYear(), dt.getDayOfMonth(), hourOfDay + 1, minuteOfHour, secondOfMinute);
        }
        return dateTime;
    }

    static getDSTSafeDateTime1(year, monthOfYear, dayOfMonth, hourOfDay, minuteOfHour, secondOfMinute) {
        var dateTime = new W4DateTime(year, monthOfYear, dayOfMonth, hourOfDay, minuteOfHour, secondOfMinute);
        if (isNaN(dateTime.date.getTime())) { //Probably a missing time slot caused by daylight savings time
            console.log("New DateTime caused exception! ");
            return new W4DateTime(year, monthOfYear, dayOfMonth, hourOfDay + 1, minuteOfHour, secondOfMinute);
        }
        return dateTime;
    }

    static getAdjustedDaySameTime(dateTime, dayDiff) {
        var dateTimeDay = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 12, 0, 0);
        dateTimeDay = dateTimeDay.plusDays(dayDiff);
        return W4_Funcs.getDSTSafeDateTime(dateTimeDay.getYear(), dateTimeDay.getMonthOfYear(), dateTimeDay.getDayOfMonth(), dateTime.getHourOfDay(), dateTime.getMinuteOfHour(), dateTime.getSecondOfMinute());
    }

    static addDays(dateTime, days) {
        dateTime = dateTime.plusDays(days);
        return dateTime;
    }

    static addMonths(dateTime, months) {
        dateTime = dateTime.plusMonths(months);
        return dateTime;
    }

    static addYears(dateTime, years) {
        dateTime = dateTime.plusYears(years);
        return dateTime;
    }

    static doesTimeExist(day, hour, minute, second) {
        var dateTime = new W4DateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), hour, minute, second);
        if (isNaN(dateTime.date.getTime())) { //Probably a missing time slot caused by daylight savings time
            console.log("New DateTime caused exception! ");
            return false;
        }
        return true;
    }

    static millisToWeeks(millis) {
        var weeks = Math.abs(millis) / TimeUnit.DAYS.toMillis(7);
        if (weeks % 1 > 0.5)
            weeks = Math.ceil(weeks);
        else
            weeks = Math.floor(weeks);
        return weeks;
    }

    static shiftShouldBeMovedForwardOneHour(shiftStartTime, dayAndHour) {
        var shiftTimeExists = W4_Funcs.doesTimeExist(W4_Funcs.dateTimeToCalendarDay(dayAndHour), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
        return !shiftTimeExists && (shiftStartTime.getHourOfDay() + 1) % 24 == (dayAndHour.getHourOfDay());
    }

    static isLastDayOfMonth(dateTime) {
        return dateTime.getDayOfMonth() == W4_Funcs.getNumDaysInMonth(dateTime);
    }

    static getNumDaysInMonth(dateTime) {
        return dateTime.getDaysInMonth(); //1 - 31
    }

    static isDiffMoreThan24Hours(startTime, endTime) {
        if (W4_Funcs.isSameDay(startTime, endTime))
            return false;
        else {
            var day1 = W4_Funcs.getDSTSafeDateTime(startTime.getYear(), startTime.getMonthOfYear(), startTime.getDayOfMonth(), 0, 0, 0);
            var day2 = W4_Funcs.getDSTSafeDateTime(endTime.getYear(), endTime.getMonthOfYear(), endTime.getDayOfMonth(), 0, 0, 0);
            if (Math.abs(day1.getMillis() - day2.getMillis()) > TimeUnit.HOURS.toMillis(36)) {
                return true;
            } else { //Time difference of 1 day
                if (startTime.getMinuteOfDay() >= endTime.getMinuteOfDay())
                    return false;
                else
                    return true;
            }
        }
    }

    static minutesOfDayToString(minutes) {
        var minutes1 = minutes % 60;
        var hours1 = Math.floor((minutes - minutes1) / 60) % 12;
        if (hours1 == 0)
            hours1 = 12;
        var AM_PM = "AM";
        if (minutes >= 720)
            AM_PM = "PM";
        return hours1 + ":" + Asset.MINUTES1[minutes1] + " " + AM_PM;
    }

    static w4SetMaterialCalendarDate(view, day) {
        var title = view.ele.children[0].children[0].children[1].innerHTML;
        var dt = W4_Funcs.getDateTimeFromCalendarTitle(title);

        var monthsDiff = (day.getMonthOfYear() + day.getYear() * 12) - (dt.getMonthOfYear() + dt.getYear() * 12);
        if (monthsDiff > 0) {
            for (var i = 0; i < monthsDiff; ++i) {
                var rightArrow = view.ele.children[0].children[0].children[2];
                rightArrow.click();
            }
        }
        else {
            monthsDiff *= -1;
            for (var i = 0; i < monthsDiff; ++i) {
                var leftArrow = view.ele.children[0].children[0].children[0];
                leftArrow.click();
            }
        }
    }

    static isColorAlreadyInUse(shiftList, color) {
        for (let shift of shiftList) {
            if (shift.getColor() == color)
                return true;
        }
        return false;
    }

    static doTwoPeopleHaveLocationsInCommon(person1ID, person2ID) {
        var person1Locations = W4_Funcs.getAssignedLocationsIDs(person1ID);
        var person2Locations = W4_Funcs.getAssignedLocationsIDs(person2ID);
        for (let id of person1Locations) {
            if (person2Locations.includes(id))
                return true;
        }
        return false;
    }

    static getAssignedLocationsIDs(personID) {
        var assignedLocations = [];
        for (let shift of W4_Funcs.getAssignedShifts(personID)) {
            if (!assignedLocations.includes(shift.getLocationID()))
                assignedLocations.push(shift.getLocationID());
        }
        return assignedLocations;
    }

    static getAssignedLocations(personID) {
        var assignedLocations = W4_Funcs.getAssignedLocationsIDs(personID);
        var assignedLocationsObjects = [];
        for (let id of assignedLocations) {
            var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), id);
            if (location != null)
                assignedLocationsObjects.push(location);
        }
        return assignedLocationsObjects;
    }

    static getAssignedPeopleIDs(locationID) {
        var assignedPeopleIDs = [];
        for (let shift of MainActivity.theCompany.getShiftList()) {
            if (shift.getLocationID() == (locationID)) {
                for (let personID of shift.getPersonIDList()) {
                    if (!assignedPeopleIDs.includes(personID))
                        assignedPeopleIDs.push(personID);
                }
            }
        }
        return assignedPeopleIDs;
    }

    static getAssignedPeople(locationID) {
        var assignedPeopleIDs = [];
        var assignedPeople = [];
        for (let shift of MainActivity.theCompany.getShiftList()) {
            if (shift.getLocationID() == (locationID)) {
                for (let personID of shift.getPersonIDList()) {
                    if (!assignedPeopleIDs.includes(personID))
                        assignedPeopleIDs.push(personID);
                }
            }
        }
        for (let personID of assignedPeopleIDs) {
            var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), personID);
            if (person != null)
                assignedPeople.push(person);
        }
        return assignedPeople;
    }

    static getAssignedShiftsIDs(personID) {
        var shiftList = MainActivity.theCompany.getShiftList();
        var assignedShifts = [];
        for (let shift of shiftList) {
            if (shift.getPersonIDList().includes(personID))
                assignedShifts.push(shift.getW4id());
        }
        return assignedShifts;
    }

    static getAssignedShifts(personID) {
        var shiftList = MainActivity.theCompany.getShiftList();
        var assignedShifts = [];
        for (let shift of shiftList) {
            if (shift.getPersonIDList().includes(personID))
                assignedShifts.push(shift);
        }
        return assignedShifts;
    }

    static isTimeTomorrow(dateTime) {
        var dateTimeNow = new W4DateTime();
        var dateTimeDay = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        var dateTimeNowDay = W4_Funcs.getDSTSafeDateTime(dateTimeNow.getYear(), dateTimeNow.getMonthOfYear(), dateTimeNow.getDayOfMonth(), 0, 0, 0);
        var diff = dateTimeDay.getMillis() - dateTimeNowDay.getMillis();
        var diffHours = TimeUnit.MILLISECONDS.toHours(diff);
        return (dateTimeDay.getMillis() != dateTimeNowDay.getMillis() && diff > 0 && diffHours < 32);
    }

    static isTimeYesterday(dateTime) {
        var dateTimeNow = new W4DateTime();
        var dateTimeDay = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        var dateTimeNowDay = W4_Funcs.getDSTSafeDateTime(dateTimeNow.getYear(), dateTimeNow.getMonthOfYear(), dateTimeNow.getDayOfMonth(), 0, 0, 0);
        var diff = dateTimeNowDay.getMillis() - dateTimeDay.getMillis();
        var diffHours = TimeUnit.MILLISECONDS.toHours(diff);
        return (dateTimeDay.getMillis() != dateTimeNowDay.getMillis() && diff > 0 && diffHours < 32);
    }

    static getFriendlyDateText(dateTime) {
        if (W4_Funcs.isSameDay(dateTime, new W4DateTime()))
            return "Today";
        else if (W4_Funcs.isTimeTomorrow(dateTime))
            return "Tomorrow";
        else if (W4_Funcs.isTimeYesterday(dateTime))
            return "Yesterday";
        else {
            var suffix = "th";
            var day = dateTime.getDayOfMonth();
            if (day % 10 == 1 && (day - (day % 10)) != 10)
                suffix = "st";
            else if (day % 10 == 2 && (day - (day % 10)) != 10)
                suffix = "nd";
            else if (day % 10 == 3 && (day - (day % 10)) != 10)
                suffix = "rd";
            return Asset.intToMonth[dateTime.getMonthOfYear()] + " " + dateTime.getDayOfMonth() + suffix + " " + dateTime.getYear();
        }
    }

    static getFriendlyDayText(dateTime) {
        if (W4_Funcs.isSameDay(dateTime, new W4DateTime()))
            return "Today";
        else if (W4_Funcs.isTimeTomorrow(dateTime))
            return "Tomorrow";
        else if (W4_Funcs.isTimeYesterday(dateTime))
            return "Yesterday";
        else {
            var suffix = "th";
            var day = dateTime.getDayOfMonth();
            if (day % 10 == 1 && (day - (day % 10)) != 10)
                suffix = "st";
            else if (day % 10 == 2 && (day - (day % 10)) != 10)
                suffix = "nd";
            else if (day % 10 == 3 && (day - (day % 10)) != 10)
                suffix = "rd";
            return Asset.intToDayOfWeek3Letter[dateTime.getDayOfWeek()] + " " + Asset.intToMonth[dateTime.getMonthOfYear()] + " " + dateTime.getDayOfMonth() + suffix + " " + dateTime.getYear();
        }
    }

    static getNumbersDayText(dateTime, separator, align) {
        var month = dateTime.getMonthOfYear();
        var monthString = "";
        if (month < 10 && align)
            monthString = " " + month;
        else
            monthString = "" + month;
        var day = dateTime.getDayOfMonth();
        var dayString = "";
        if (day < 10 && align)
            dayString = " " + day;
        else
            dayString = "" + day;

        return monthString + separator + dayString + separator + dateTime.getYear();
    }

    static getFriendlyNumbersDayText(dateTime, separator, align) {
        if (W4_Funcs.isSameDay(dateTime, new W4DateTime()))
            return "Today";
        else if (W4_Funcs.isTimeTomorrow(dateTime))
            return "Tomorrow";
        else if (W4_Funcs.isTimeYesterday(dateTime))
            return "Yesterday";
        else {
            var month = dateTime.getMonthOfYear();
            var monthString = "";
            if (month < 10 && align)
                monthString = " " + month;
            else
                monthString = "" + month;
            var day = dateTime.getDayOfMonth();
            var dayString = "";
            if (day < 10 && align)
                dayString = " " + day;
            else
                dayString = "" + day;

            return monthString + separator + dayString + separator + dateTime.getYear();
        }
    }

    static getTimeText(dateTime) {
        var am_pm = "am";
        var hour = dateTime.getHourOfDay();
        if (hour > 11)
            am_pm = "pm";
        if (hour > 12)
            hour -= 12;
        var extra_minute0 = "";
        if (dateTime.getMinuteOfHour() < 10) {
            extra_minute0 = "0";
        }
        if (hour == 0)
            hour = 12;
        return hour + ":" + extra_minute0 + dateTime.getMinuteOfHour() + " " + am_pm;
    }

    static isTimeWithinDateRange(startDay, endDay, time) {
        var timeDay = W4_Funcs.getDSTSafeDateTime(time.getYear(), time.getMonthOfYear(), time.getDayOfMonth(), 0, 0, 0);
        var startTimeDay = W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0);
        var endTimeDay = W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0);
        return (timeDay.getMillis() >= startTimeDay.getMillis() && timeDay.getMillis() <= endTimeDay.getMillis());
    }

    static isTimeAfterDate(day, time) {
        var timeDay = W4_Funcs.getDSTSafeDateTime(time.getYear(), time.getMonthOfYear(), time.getDayOfMonth(), 0, 0, 0);
        var startTimeDay = W4_Funcs.calendarDayToDateTime(day, 0, 0, 0);
        return (timeDay.getMillis() > startTimeDay.getMillis());
    }

    static getAllFalsePermissions() {
        var permissions = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ];
        return permissions;
    }

    static isValidEmail(target) {
        let match;
        var regexp = new RegExp(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/, "");
        if ((match = regexp.exec(target)) !== null) {
            return true;
        }
        return false;
    }

    //NO SDS LIST TO RETURN
    static getPermittedAssetTemplateList(assetType) {
        switch (assetType) {
            case Asset.PERMISSION_ALL_INSPECTIONS:
                return W4_Funcs.getPermittedInspectionPlanTemplateList();
            case Asset.PERMISSION_ALL_SUPPLIES:
                return W4_Funcs.getPermittedSuppliesTemplateList();
            default:
                return W4_Funcs.getPermittedTaskTemplateList();
        }
    }

    static getPermittedPersonList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_PEOPLE])
            return MainActivity.theCompany.getPersonList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_PEOPLE]) {
            var list = [];
            for (let person of MainActivity.theCompany.getPersonList()) {
                if (W4_Funcs.doTwoPeopleHaveLocationsInCommon(MainActivity.currentPerson.getW4id(), person.getW4id()))
                    list.push(person);
            }
            return list;
        } else {
            var list = [MainActivity.currentPerson];
            return list;
        }
    }

    static getPermittedPersonList_ForX(ALL) {
        if (MainActivity.currentPerson.getReadPermissions()[ALL])
            return MainActivity.theCompany.getPersonList();
        else if (MainActivity.currentPerson.getReadPermissions()[ALL + 1]) {
            var list = [MainActivity.currentPerson];
            return list;
        } else {
            return [];
        }
    }

    static getPermittedTimePunchList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_TIMEPUNCHES])
            return MainActivity.theCompany.getTimePunchList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_TIMEPUNCHES]) {
            var list = [];
            for (let timePunch of MainActivity.theCompany.getTimePunchList()) {
                if (timePunch.getPersonID() == (MainActivity.currentPerson.getW4id()))
                    list.push(timePunch);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedLocationList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_LOCATIONS])
            return MainActivity.theCompany.getLocationList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_LOCATIONS]) {
            return W4_Funcs.getAssignedLocations(MainActivity.currentPerson.getW4id());
        } else {
            return [];
        }
    }

    static getPermittedLocationList_ForX(ALL) {
        if (MainActivity.currentPerson.getReadPermissions()[ALL])
            return MainActivity.theCompany.getLocationList();
        else if (MainActivity.currentPerson.getReadPermissions()[ALL + 1]) {
            return W4_Funcs.getAssignedLocations(MainActivity.currentPerson.getW4id());
        } else {
            return [];
        }
    }

    static getPermittedShiftList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_SHIFTS])
            return MainActivity.theCompany.getShiftList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
            return W4_Funcs.getAssignedShifts(MainActivity.currentPerson.getW4id());
        } else {
            return [];
        }
    }

    static getPermittedShiftList_ForX(ALL) {
        if (MainActivity.currentPerson.getReadPermissions()[ALL])
            return MainActivity.theCompany.getShiftList();
        else if (MainActivity.currentPerson.getReadPermissions()[ALL + 1]) {
            return W4_Funcs.getAssignedShifts(MainActivity.currentPerson.getW4id());
        } else {
            return [];
        }
    }

    static getPermittedSuppliesList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_SUPPLIES])
            return MainActivity.theCompany.getSupplyItemList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_SUPPLIES]) {
            var supplieslist = MainActivity.theCompany.getSupplyItemList();
            var assignedLocations = W4_Funcs.getAssignedLocationsIDs(MainActivity.currentPerson.getW4id());
            var list = [];
            for (let supplyItem of supplieslist) {
                if (assignedLocations.includes(supplyItem.getLocationID()))
                    list.push(supplyItem);
            }
            return list;
        } else {
            return [];
        }
    }


    static getPermittedSuppliesTemplateList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_SUPPLIES]) {
            return MainActivity.theCompany.getSupplyItemTemplateList();
        } else {
            return [];
        }
    }

    static getPermittedSuppliesList_ForX(ALL) {
        if (MainActivity.currentPerson.getReadPermissions()[ALL])
            return MainActivity.theCompany.getSupplyItemList();
        else if (MainActivity.currentPerson.getReadPermissions()[ALL + 1]) {
            var supplieslist = MainActivity.theCompany.getSupplyItemList();
            var assignedLocations = W4_Funcs.getAssignedLocationsIDs(MainActivity.currentPerson.getW4id());
            var list = [];
            for (let supplyItem of supplieslist) {
                if (assignedLocations.includes(supplyItem.getLocationID()))
                    list.push(supplyItem);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedInspectionPlanList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_INSPECTIONS])
            return MainActivity.theCompany.getInspectionPlanList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS]) {
            var inspectionPlanList = MainActivity.theCompany.getInspectionPlanList();
            var assignedLocations = W4_Funcs.getAssignedLocationsIDs(MainActivity.currentPerson.getW4id());
            var list = [];
            for (let plan of inspectionPlanList) {
                if (assignedLocations.includes(plan.getLocationID()))
                    list.push(plan);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedInspectionPlanTemplateList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_INSPECTIONS]) {
            return MainActivity.theCompany.getInspectionPlanTemplateList();
        }
        else {
            return [];
        }
    }

    static getPermittedInspectionPlanCompletedList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_INSPECTIONS])
            return MainActivity.theCompany.getInspectionPlansCompletedList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS]) {
            var inspectionPlanList = MainActivity.theCompany.getInspectionPlansCompletedList();
            var assignedLocations = W4_Funcs.getAssignedLocationsIDs(MainActivity.currentPerson.getW4id());
            var list = [];
            for (let plan of inspectionPlanList) {
                if (assignedLocations.includes(plan.getLocationID()))
                    list.push(plan);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedInspectionPlanInProgressList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_INSPECTIONS])
            return MainActivity.theCompany.getInspectionPlansInProgressList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_INSPECTIONS]) {
            var inspectionPlanList = MainActivity.theCompany.getInspectionPlansInProgressList();
            var assignedLocations = W4_Funcs.getAssignedLocationsIDs(MainActivity.currentPerson.getW4id());
            var list = [];
            for (let plan of inspectionPlanList) {
                if (assignedLocations.includes(plan.getLocationID()))
                    list.push(plan);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedTaskList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_TASKS])
            return MainActivity.theCompany.getTaskSheetList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_TASKS]) {
            var taskList = MainActivity.theCompany.getTaskSheetList();
            var assignedShifts = W4_Funcs.getAssignedShiftsIDs(MainActivity.currentPerson.getW4id());
            var list = [];
            for (let task of taskList) {
                if (assignedShifts.includes(task.getShiftID()))
                    list.push(task);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedTaskTemplateList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_TASKS]) {
            return MainActivity.theCompany.getTaskSheetTemplateList();
        }
        else {
            return [];
        }
    }

    static getPermittedTaskInProgressList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_TASKS])
            return MainActivity.theCompany.getTaskSheetInProgressList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_TASKS]) {
            var taskList = MainActivity.theCompany.getTaskSheetInProgressList();
            var list = [];
            for (let task of taskList) {
                if (task.getPersonID() == (MainActivity.currentPerson.getW4id()))
                    list.push(task);
            }
            return list;
        } else {
            return [];
        }
    }

    static getPermittedTaskCompletedList() {
        if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ALL_TASKS])
            return MainActivity.theCompany.getTaskSheetCompletedList();
        else if (MainActivity.currentPerson.getReadPermissions()[Asset.PERMISSION_ASSIGNED_TASKS]) {
            var taskList = MainActivity.theCompany.getTaskSheetCompletedList();
            var list = [];
            for (let task of taskList) {
                if (task.getPersonID() == (MainActivity.currentPerson.getW4id()))
                    list.push(task);
            }
            return list;
        } else {
            return [];
        }
    }

    static getLocationNames(locationlist) {
        var locationNames = [];
        for (let location of locationlist)
            locationNames.push(location.getName());
        return locationNames;
    }

    static getShiftSpinnerItems(shiftlist) {
        var shiftItemsList = [];
        var locationList = MainActivity.theCompany.getLocationList();
        for (let shift of shiftlist) {
            var name = W4_Funcs.getTimeText(new W4DateTime(shift.getStartTime())) + " to " + W4_Funcs.getTimeText(new W4DateTime(shift.getEndTime()));
            var location = Asset.getAssetbyId(locationList, shift.getLocationID());
            if (location != null)
                name = location.getName() + " " + name;
            shiftItemsList.push(new SpinnerSortItem(name, shift.getW4id(), shift));
        }
        shiftItemsList.sort(SpinnerSortItem.compareTo);
        var results = [];
        results.push(W4_Funcs.getNamesFromSpinnerSortItemArray(shiftItemsList));
        results.push(W4_Funcs.getIDsFromSpinnerSortItemArray(shiftItemsList));
        results.push(W4_Funcs.getShiftsFromSpinnerSortItemArray(shiftItemsList));
        return results;
    }

    static getNamesFromSpinnerSortItemArray(array) {
        var names = [];
        for (let item of array) {
            names.push(item.getName());
        }
        return names;
    }

    static getIDsFromSpinnerSortItemArray(array) {
        var IDs = [];
        for (let item of array) {
            IDs.push(item.getId());
        }
        return IDs;
    }

    static getShiftsFromSpinnerSortItemArray(array) {
        var shifts = [];
        for (let item of array) {
            shifts.push(item.getShift());
        }
        return shifts;
    }

    static getPersonNames(personlist) {
        var personNames = [];
        for (let person of personlist)
            personNames.push(person.getFirst_name() + " " + person.getLast_name());
        return personNames;
    }

    static getLocationFromShiftID(shiftID) {
        var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shiftID);
        if (shift == null)
            return null;
        var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
        return location;
    }

    static getPositionOfStringInArray(array, string) {
        for (var i = 0; i < array.length; ++i) {
            if (array[i] == (string))
                return i;
        }
        return -1;
    }

    static getAveragesOfIntArray(arrays) {
        var averages = [];
        for (let list of arrays) {
            var total = 0;
            for (let num of list) {
                total += num;
            }
            if (list.length != 0)
                total = Math.floor(total / list.length);
            averages.push(total);
        }
        return averages;
    }

    static minutesToHoursAndMinutes(minutes) {
        minutes = Math.floor(minutes);
        var minutes1 = minutes % 60;
        var minutes2 = Math.abs(minutes1);
        var hours1 = Math.floor((minutes - minutes1) / 60);
        var results = [hours1, minutes2];
        return results;
    }

    static getHoursMinutesText(minutes1) {
        minutes1 = Math.floor(minutes1);
        var results = W4_Funcs.minutesToHoursAndMinutes(minutes1);
        var hours = results[0];
        var minutes = results[1];
        var text = "";
        if (hours > 0) {
            if (hours == 1) {
                text += hours + " hour ";
            } else {
                text += hours + " hours ";
            }
        }
        if (minutes != 0 || hours == 0) {
            if (minutes == 1) {
                text += minutes + " min";
            } else {
                text += minutes + " mins";
            }
        }
        return text;
    }

    static getTaskSheetsForShift(shiftID) {
        var taskSheets = [];
        for (let taskSheet of MainActivity.theCompany.getTaskSheetList()) {
            if (taskSheet.getShiftID() == (shiftID))
                taskSheets.push(taskSheet);
        }
        return taskSheets;
    }

    //Checks if there's already a task in progress for this task sheet
    static attemptNewDoTaskActivity(taskTemplateID, context) {
        var millisToday = (new W4DateTime()).getMillis();
        var taskInProgressTodayFound = false;
        for (let taskSheetOccurence of MainActivity.theCompany.getTaskSheetInProgressList()) {
            if (taskSheetOccurence.getTaskTemplateID() == (taskTemplateID) && taskSheetOccurence.getPersonID() == (MainActivity.currentPerson.getW4id()) && W4_Funcs.isSameDay(millisToday, taskSheetOccurence.getUpdatedDateTime())) {
                taskInProgressTodayFound = true;
                var intent = new Intent(context, new DoTaskInProgressActivity());
                intent.putExtra("id", taskSheetOccurence.getW4id());
                intent.putExtra("new", false);
                context.startActivity(intent);
                break;
            }
        }
        if (!taskInProgressTodayFound) {
            var intent = new Intent(context, new DoTaskInProgressActivity());
            intent.putExtra("id", taskTemplateID);
            intent.putExtra("new", true);
            context.startActivity(intent);
        }
    }

    static getShiftsForLocation(locationID) {
        var shiftList = [];
        for (let shift of MainActivity.theCompany.getShiftList()) {
            if (shift.getLocationID() == (locationID))
                shiftList.push(shift);
        }
        return shiftList;
    }

    static getShiftIDsForLocation(locationID) {
        var shiftList = W4_Funcs.getShiftsForLocation(locationID);
        var shiftIDs = [];
        for (let shift of shiftList)
            shiftIDs.push(shift.getW4id());

        return shiftIDs;
    }

    static startTaskFromShift(context, shiftID) {
        var taskSheets = W4_Funcs.getTaskSheetsForShift(shiftID);
        if (taskSheets.length == 0) {
            var locationText = "";
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shiftID);
            if (shift != null) {
                var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                if (location != null) {
                    locationText += " at " + location.getName();
                }
                var startTime = new W4DateTime(shift.getStartTime());
                locationText += " starting at " + W4_Funcs.getTimeText(startTime);
            }
            MainActivity.dialogBox(context, "Task Sheet Not Found", "No Task Sheet found for your shift" + locationText);
            return false;
        } else {
            W4_Funcs.attemptNewDoTaskActivity(taskSheets[0].getW4id(), context);
            return true;
        }
    }

    static showNotification(context, intID, key, title, text, intent, showOnSystem, showOnApp, save) {
        // if (showOnSystem) {
        //     var builder = new NotificationCompat.Builder(MainActivity.mainActivity, MainActivity.NOTIFICATION_CHANNEL_ID)
        //         .setSmallIcon("../res/logo_cut_square.png")
        //         .setContentTitle(title)
        //         .setContentText(text)
        //         .setStyle(new NotificationCompat.BigTextStyle()
        //             .bigText(text))
        //         .setPriority(NotificationCompat.PRIORITY_HIGH)
        //         .setAutoCancel(true); //Auto removes notification when tapped
        //     if (intID == -1 && MainActivity.w4SaveState.getSystemNotificationIDsMap().has(key)) {
        //         intID = MainActivity.w4SaveState.getSystemNotificationIDsMap().get(key);
        //         MainActivity.w4SaveState.getSystemNotificationIDsMap().set(key, intID + 1); //State will be saved from calling function
        //     } else {
        //         intID = 0;
        //     }
        //     if (intent != null) {
        //         var pendingIntent = PendingIntent.getActivity(HomeActivity.homeActivity, intID, intent, 0);
        //         builder.setContentIntent(pendingIntent);
        //     }
        //     //Do platform specific notification code
        //     var MainActivity.notificationManager = NotificationManagerCompat.from(context);
        //     // notificationId is a unique int for each notification that you must define
        //     MainActivity.notificationManager.notify(intID, builder.build());
        // }
        if (showOnApp) {
            if (save != null) {
                if (intID == -1 && MainActivity.w4SaveState.getAppNotificationIDsMap().has(key)) {
                    intID = MainActivity.w4SaveState.getAppNotificationIDsMap().get(key);
                    MainActivity.w4SaveState.getAppNotificationIDsMap().set(key, intID + 1); //State will be saved from calling function
                } else {
                    intID = 0;
                }
                var w4Notification = new W4Notification(save, title, text, intent, key);
                if (!w4Notification.isContainedIn(MainActivity.w4Notifications)) {
                    MainActivity.w4Notifications.push(w4Notification);
                    if (HomeActivity.homeActivity != null) {
                        HomeActivity.homeActivity.populateNotificationsList();
                    }
                    if (ViewNotificationsListActivity.viewNotificationsListActivity != null) {
                        ViewNotificationsListActivity.viewNotificationsListActivity.updateList();
                    }
                }
            }
        }
    }

    static getClosestShiftToTime(shifts, time) {
        if (shifts.length == 0)
            return null;
        else if (shifts.length == 1)
            return shifts[0];
        else {
            var closestDiff = Number.MAX_SAFE_INTEGER;
            var closestShift = null;
            var dtTime = new W4DateTime(time);
            var timeMinutes = dtTime.getHourOfDay() * 60 + dtTime.getMinuteOfHour();
            for (let shift of shifts) {
                if (W4_Funcs.doesRepeatingDateOccurOnDay(shift, new W4DateTime(time), 0)) {
                    var shiftStartTime = new W4DateTime(shift.getStartTime());
                    var shiftEndTime = new W4DateTime(shift.getEndTime());
                    var startMinutes = shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour();
                    var endMinutes = shiftEndTime.getHourOfDay() * 60 + shiftEndTime.getMinuteOfHour();
                    var startDiff = Math.abs(timeMinutes - startMinutes);
                    var endDiff = Math.abs(timeMinutes - endMinutes);
                    if (startDiff < closestDiff) {
                        closestDiff = startDiff;
                        closestShift = shift;
                    }
                    if (endDiff < closestDiff) {
                        closestDiff = endDiff;
                        closestShift = shift;
                    }
                }
            }
            return closestShift;
        }
    }

    static isTimePunchLateClockIn(timePunch) {
        if (timePunch.getClockIn()) {
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), timePunch.getShiftID());
            if (shift != null) {
                var timePunchDT = new W4DateTime(timePunch.getTime());
                var shiftStartTime = new W4DateTime(shift.getStartTime());
                var shiftEndTime = new W4DateTime(shift.getEndTime());

                var startTimeThatDay;
                if (!shift.method_doesShiftGoOvernight()) {
                    startTimeThatDay = W4_Funcs.getDSTSafeDateTime(timePunchDT.getYear(), timePunchDT.getMonthOfYear(), timePunchDT.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                } else { //Relies on Shifts lasting a maximum of 24 hours!
                    var startMinutes = shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour();
                    var endMinutes = shiftEndTime.getHourOfDay() * 60 + shiftEndTime.getMinuteOfHour();
                    var timePunchMinutes = timePunchDT.getHourOfDay() * 60 + timePunchDT.getMinuteOfHour();
                    var startDiff = Math.abs(startMinutes - timePunchMinutes);
                    var endDiff = Math.abs(endMinutes - timePunchMinutes);
                    if (startDiff < endDiff) //Time punch is on start day
                    {
                        startTimeThatDay = W4_Funcs.getDSTSafeDateTime(timePunchDT.getYear(), timePunchDT.getMonthOfYear(), timePunchDT.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                    } else //Time punch is on end day
                    {
                        var prevDay = W4_Funcs.getPrevDay(timePunchDT);
                        startTimeThatDay = W4_Funcs.getDSTSafeDateTime(prevDay.getYear(), prevDay.getMonthOfYear(), prevDay.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                    }
                }
                var closestDiff = Number.MAX_SAFE_INTEGER;
                var closestTimePunch = timePunch;
                for (let timePunch1 of MainActivity.theCompany.getTimePunchList())
                    if (timePunch1.getShiftID() == (timePunch.getShiftID()) && timePunch1.getPersonID() == (timePunch.getPersonID()) && timePunch1.getClockIn()) {
                        var diff = Math.abs(timePunch1.getTime() - startTimeThatDay.getMillis());
                        if (diff < closestDiff) {
                            closestDiff = diff;
                            closestTimePunch = timePunch1;
                        }
                    }
                return (timePunch.getTime() > startTimeThatDay.getMillis() && closestTimePunch.getW4id() == (timePunch.getW4id()));
            }
        }
        return false;
    }

    static isTimePunchLateClockOut(timePunch) {
        if (!timePunch.getClockIn()) {
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), timePunch.getShiftID());
            if (shift != null) {
                var timePunchDT = new W4DateTime(timePunch.getTime());
                var shiftStartTime = new W4DateTime(shift.getStartTime());
                var shiftEndTime = new W4DateTime(shift.getEndTime());

                var endTimeThatDay;
                var startMinutes = shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour();
                var endMinutes = shiftEndTime.getHourOfDay() * 60 + shiftEndTime.getMinuteOfHour();
                var timePunchMinutes = timePunchDT.getHourOfDay() * 60 + timePunchDT.getMinuteOfHour();
                if (!shift.method_doesShiftGoOvernight()) {
                    endTimeThatDay = W4_Funcs.getDSTSafeDateTime(timePunchDT.getYear(), timePunchDT.getMonthOfYear(), timePunchDT.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                } else { //Relies on Shifts lasting a maximum of 24 hours!
                    var startDiff = Math.abs(startMinutes - timePunchMinutes);
                    var endDiff = Math.abs(endMinutes - timePunchMinutes);
                    if (startDiff < endDiff) //Time punch is on start day
                    {
                        return false;
                    } else //Time punch is on end day
                    {
                        endTimeThatDay = W4_Funcs.getDSTSafeDateTime(timePunchDT.getYear(), timePunchDT.getMonthOfYear(), timePunchDT.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                    }
                }
                var closestDiff = Number.MAX_SAFE_INTEGER;
                var closestTimePunch = timePunch;
                for (let timePunch1 of MainActivity.theCompany.getTimePunchList()) {
                    if (timePunch1.getShiftID() == (timePunch.getShiftID()) && timePunch1.getPersonID() == (timePunch.getPersonID()) && !timePunch1.getClockIn()) {
                        var diff = Math.abs(timePunch1.getTime() - endTimeThatDay.getMillis());
                        if (diff < closestDiff) {
                            closestDiff = diff;
                            closestTimePunch = timePunch1;
                        }
                    }
                }
                return (timePunch.getTime() > endTimeThatDay.getMillis() && closestTimePunch.getW4id() == (timePunch.getW4id()));
            }
        }
        return false;
    }

    static getNextDay(dateTime) {
        dateTime = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        dateTime = new W4DateTime(dateTime.getMillis() + (1.5 * TimeUnit.DAYS.toMillis(1)));
        dateTime = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        return dateTime;
    }

    static getPrevDay(dateTime) {
        dateTime = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        dateTime = new W4DateTime(dateTime.getMillis() - (0.5 * TimeUnit.DAYS.toMillis(1)));
        dateTime = W4_Funcs.getDSTSafeDateTime(dateTime.getYear(), dateTime.getMonthOfYear(), dateTime.getDayOfMonth(), 0, 0, 0);
        return dateTime;
    }

    static getShiftSpinnerIndexAtLocation(shiftIDs, locationID) {
        for (var i = 0; i < shiftIDs.length; ++i) {
            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), shiftIDs[i]);
            if (shift != null && shift.getLocationID() == (locationID)) {
                return i;
            }
        }
        return 0;
    }

    // static getLLFromLocation(context, location) {
    //     var geocoder = new Geocoder(context, Locale.getDefault());
    //     var textLocation = location.getAddress1() + " " + location.getAddress2() + " " + location.getCity() + " " + location.getState() + " " + location.getZip() + " " + Asset.countries_array[location.getCountry()];
    //     try {
    //         var addresses = geocoder.getFromLocationName(textLocation, 1);
    //         var address = addresses[0];
    //         return new Double[]{ address.getLatitude(), address.getLongitude() };

    //     } catch (IOException ex) {
    //         console.log(ex.getMessage());
    //         MainActivity.w4Toast(context, "Couldn't find GPS coordinates for " + location.getName() + "!", Toast.LENGTH_LONG);
    //     }
    //     return [0, 0];

    // <script type="text/javascript" src="http://maps.google.com/maps/api/js?key=AIzaSyDV15iT69Q9reBl_swVRSPl-OUjQkPJWvY"></script>
    // <script type="text/javascript">

    //     var geocoder = new google.maps.Geocoder();
    //     var address = "new york";

    //     geocoder.geocode({ 'address': address }, function (results, status) {

    //         if (status == google.maps.GeocoderStatus.OK) {
    //             var latitude = results[0].geometry.location.lat();
    //             var longitude = results[0].geometry.location.lng();
    //             console.log("|" + latitude + "|" + longitude + "|");
    //         }
    //     });
    // </script>
    // }

    static isShiftActiveAtTime(shift, dt) {
        var occursType = W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, dt, false, 0);
        if (occursType != Shift.OCCURS_NONE) {
            var shiftStart = new W4DateTime(shift.getStartTime());
            var shiftEnd = new W4DateTime(shift.getEndTime());
            if (shift.method_doesShiftGoOvernight()) {
                switch (occursType) {
                    case Shift.OCCURS_FIRST_DAY:
                        if (dt.getMillisOfDay() >= shiftStart.getMillisOfDay()) {
                            return true;
                        }
                        break;
                    case Shift.OCCURS_SECOND_DAY:
                        if (dt.getMillisOfDay() <= shiftEnd.getMillisOfDay()) {
                            return true;
                        }
                        break;
                    case Shift.OCCURS_TWICE_SAME_SLOT:
                        if (dt.getMillisOfDay() >= shiftStart.getMillisOfDay() ||
                            dt.getMillisOfDay() <= shiftEnd.getMillisOfDay()) {
                            return true;
                        }
                        break;
                }
            } else {
                if (dt.getMillisOfDay() >= shiftStart.getMillisOfDay() &&
                    dt.getMillisOfDay() <= shiftEnd.getMillisOfDay()) {
                    return true;
                }
            }
        }
        return false;
    }

    static doesRepeatingDateOccurOnDay(rd, dayAndHour, i1) {
        return W4_Funcs.doesRepeatingDateOccupyTimeSlot(rd, dayAndHour, false, i1) != Shift.OCCURS_NONE;
    }

    static doesRepeatingDateOccupyTimeSlot(rd, dayAndHour, specificTime, i1) {
        //Find if shift occurs same day and set checkingShift to original
        //Check if shift overlaps with time slot and return if it does
        //Find if shift is repeated and set checkingShift to new one
        //If specific time is on, check if checkingShift intersects the time slot
        var rdStartTime = new W4DateTime(rd.getStartTime(i1));
        var rdEndTime = new W4DateTime(rd.getEndTime(i1));
        var checkingRDStart = null;
        var checkingRDEnd = null;
        var occursType = Shift.OCCURS_NONE;
        if (W4_Funcs.isSameDay(rd.getStartTime(i1), dayAndHour.getMillis())) {
            checkingRDStart = rdStartTime;
            checkingRDEnd = rdEndTime;
            occursType = Shift.OCCURS_FIRST_DAY;
        } else if (W4_Funcs.isSameDay(rd.getEndTime(i1), dayAndHour.getMillis())) {
            checkingRDStart = rdStartTime;
            checkingRDEnd = rdEndTime;
            if (rd.getRepeatAmount(i1) > 0 && dayAndHour.getMillis() >= rd.getStartTime(i1) && !W4_Funcs.isSameDay(rd.getStartTime(i1), rd.getEndTime(i1)) &&
                rdEndTime.getMinuteOfHour() != 0 && rdStartTime.getHourOfDay() == rdEndTime.getHourOfDay() &&
                rdStartTime.getHourOfDay() == dayAndHour.getHourOfDay() &&
                W4_Funcs.doesRepeatingDateStartTimeOccurOnDay(rd, dayAndHour, i1))
                occursType = Shift.OCCURS_TWICE_SAME_SLOT;
            else
                occursType = Shift.OCCURS_SECOND_DAY;
        }

        if (checkingRDStart != null) {
            if (!specificTime || (checkingRDStart.getMillis() < dayAndHour.getMillis() + TimeUnit.HOURS.toMillis(1) && checkingRDEnd.getMillis() > dayAndHour.getMillis())) {
                return occursType;
            }
        }
        var checkingRDStart = null;
        checkingRDEnd = null;
        occursType = Shift.OCCURS_NONE;
        if (rd.getRepeatAmount(i1) > 0 && dayAndHour.getMillis() >= rd.getStartTime(i1)) {
            if ((!specificTime || rdStartTime.getMinuteOfDay() < dayAndHour.getMinuteOfDay() + 60) && W4_Funcs.doesRepeatingDateStartTimeOccurOnDay(rd, dayAndHour, i1)) { //Repetition day and first day of shift
                checkingRDStart = W4_Funcs.getDSTSafeDateTime(dayAndHour.getYear(), dayAndHour.getMonthOfYear(), dayAndHour.getDayOfMonth(), rdStartTime.getHourOfDay(), rdStartTime.getMinuteOfHour(), 0);
                if (!W4_Funcs.isSameDay(rd.getStartTime(i1), rd.getEndTime(i1))) {
                    var dayAndHourNext = W4_Funcs.getAdjustedDaySameTime(dayAndHour, 1);
                    checkingRDEnd = W4_Funcs.getDSTSafeDateTime(dayAndHourNext.getYear(), dayAndHourNext.getMonthOfYear(), dayAndHourNext.getDayOfMonth(), rdEndTime.getHourOfDay(), rdEndTime.getMinuteOfHour(), 0);
                } else
                    checkingRDEnd = W4_Funcs.getDSTSafeDateTime(dayAndHour.getYear(), dayAndHour.getMonthOfYear(), dayAndHour.getDayOfMonth(), rdEndTime.getHourOfDay(), rdEndTime.getMinuteOfHour(), 0);
                if (!W4_Funcs.isSameDay(rd.getStartTime(i1), rd.getEndTime(i1)) && rdEndTime.getMinuteOfHour() != 0 && rdStartTime.getHourOfDay() == rdEndTime.getHourOfDay() && rdStartTime.getHourOfDay() == dayAndHour.getHourOfDay() && W4_Funcs.doesRepeatingDateStartTimeOccurOnDay(rd, W4_Funcs.getAdjustedDaySameTime(dayAndHour, -1), i1))
                    occursType = Shift.OCCURS_TWICE_SAME_SLOT;
                else
                    occursType = Shift.OCCURS_FIRST_DAY;
            } else if ((!specificTime || rdEndTime.getMinuteOfDay() > dayAndHour.getMinuteOfDay()) && !W4_Funcs.isSameDay(rd.getStartTime(i1), rd.getEndTime(i1)) && W4_Funcs.doesRepeatingDateStartTimeOccurOnDay(rd, W4_Funcs.getAdjustedDaySameTime(dayAndHour, -1), i1)) { //Repetition day and second day of shift
                var dayAndHourPrev = W4_Funcs.getAdjustedDaySameTime(dayAndHour, -1);
                checkingRDStart = W4_Funcs.getDSTSafeDateTime(dayAndHourPrev.getYear(), dayAndHourPrev.getMonthOfYear(), dayAndHourPrev.getDayOfMonth(), rdStartTime.getHourOfDay(), rdStartTime.getMinuteOfHour(), 0);
                checkingRDEnd = W4_Funcs.getDSTSafeDateTime(dayAndHour.getYear(), dayAndHour.getMonthOfYear(), dayAndHour.getDayOfMonth(), rdEndTime.getHourOfDay(), rdEndTime.getMinuteOfHour(), 0);
                occursType = Shift.OCCURS_SECOND_DAY;
            }
        }

        if (checkingRDStart != null) {
            if (!specificTime || (checkingRDStart.getMillis() < dayAndHour.getMillis() + TimeUnit.HOURS.toMillis(1) && checkingRDEnd.getMillis() > dayAndHour.getMillis())) {
                return occursType;
            }
        }
        return Shift.OCCURS_NONE;
    }

    static doesRepeatingDateStartTimeOccurOnDay(rd, dayAndHour, i1) {
        if (rd.getRepeatAmount(i1) > 0 && dayAndHour.getMillis() >= rd.getStartTime(i1)) { //Repetition day and occurs later than start date
            var shiftStartTime = new W4DateTime(rd.getStartTime(i1));
            var shiftStartDay = W4_Funcs.getDSTSafeDateTime(shiftStartTime.getYear(), shiftStartTime.getMonthOfYear(), shiftStartTime.getDayOfMonth(), 0, 0, 0);
            var timeSlotStartDay = W4_Funcs.getDSTSafeDateTime(dayAndHour.getYear(), dayAndHour.getMonthOfYear(), dayAndHour.getDayOfMonth(), 0, 0, 0);
            if (rd.getRepeatUnit(i1) == Shift.REPEATUNIT_DAILY) {
                var daysDiff = Math.abs(W4_Funcs.getDaysDiff(timeSlotStartDay, shiftStartDay));
                if (daysDiff % rd.getRepeatAmount(i1) == 0) {
                    if (rd.getEndUnit(i1) == Shift.ENDUNIT_NEVER) {
                        return true;
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_OCCURENCES) {
                        if (Math.floor(daysDiff / rd.getRepeatAmount(i1)) < rd.getRepeatEndOccurences(i1)) {
                            return true;
                        }
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_ONDATE) {
                        if (timeSlotStartDay.getMillis() <= rd.getRepeatEndDate(i1)) {
                            return true;
                        }
                    }
                }
            } else if (rd.getRepeatUnit(i1) == Shift.REPEATUNIT_WEEKLY) {
                var shiftStartWeek = W4_Funcs.getStartOfWeek(shiftStartDay);
                var timeSlotStartWeek = W4_Funcs.getStartOfWeek(timeSlotStartDay);
                var weeksDiff = W4_Funcs.millisToWeeks(shiftStartWeek.getMillis() - timeSlotStartWeek.getMillis());
                if (weeksDiff % rd.getRepeatAmount(i1) == 0 && rd.getWeeklyRepeatDays(i1)[dayAndHour.getDayOfWeek() % 7]) {
                    if (rd.getEndUnit(i1) == Shift.ENDUNIT_NEVER) {
                        return true;
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_OCCURENCES) {
                        //Get number of full weeks in between the shift start week and the slot week
                        //Get number of days that have occured in first week and last week and add together
                        var numWholeWeeks = weeksDiff - 1;
                        var numOccurences = 0; //Includes start day
                        if (!rd.getWeeklyRepeatDays(i1)[shiftStartDay.getDayOfWeek() % 7])
                            ++numOccurences;
                        var numWeeklyRepeatDays = 0;
                        for (let bool of rd.getWeeklyRepeatDays(i1))
                            if (bool)
                                ++numWeeklyRepeatDays;
                        if (weeksDiff == 0) { //Only checking one week
                            for (var i = shiftStartDay.getDayOfWeek() % 7; i <= timeSlotStartDay.getDayOfWeek() % 7; ++i) {
                                if (rd.getWeeklyRepeatDays(i1)[i]) {
                                    ++numOccurences;
                                }
                            }
                        } else {
                            for (var i = shiftStartDay.getDayOfWeek() % 7; i < 7; ++i) { //First week
                                if (rd.getWeeklyRepeatDays(i1)[i]) {
                                    ++numOccurences;
                                }
                            }
                            if (numWholeWeeks > 0 && numWholeWeeks >= rd.getRepeatAmount(i1)) { //Weeks in between
                                var remainderWeeks = numWholeWeeks % rd.getRepeatAmount(i1);
                                numOccurences += Math.floor((numWholeWeeks - remainderWeeks) / rd.getRepeatAmount(i1)) * numWeeklyRepeatDays;
                            }
                            if (weeksDiff > 0) { //Last Week
                                for (var i = timeSlotStartDay.getDayOfWeek() % 7; i >= 0; --i) {
                                    if (rd.getWeeklyRepeatDays(i1)[i])
                                        ++numOccurences;
                                }
                            }
                        }
                        if (numOccurences <= rd.getRepeatEndOccurences(i1))
                            return true;
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_ONDATE) {
                        if (timeSlotStartDay.getMillis() <= rd.getRepeatEndDate(i1)) {
                            return true;
                        }
                    }
                }
            } else if (rd.getRepeatUnit(i1) == Shift.REPEATUNIT_MONTHLY) {
                var monthsDiff = (timeSlotStartDay.getMonthOfYear() + timeSlotStartDay.getYear() * 12) - (shiftStartDay.getMonthOfYear() + shiftStartDay.getYear() * 12);
                if (monthsDiff % rd.getRepeatAmount(i1) == 0) {
                    var correctDay = false;
                    if (rd.getMonthlyRepeatType(i1) == Shift.MONTHLYREPEATTYPE_DAYOFMONTH) {
                        if (dayAndHour.getDayOfMonth() == shiftStartDay.getDayOfMonth() || (W4_Funcs.isLastDayOfMonth(dayAndHour) && shiftStartDay.getDayOfMonth() > dayAndHour.getDayOfMonth()))
                            correctDay = true;
                    } else { //Shift.MONTHLYREPEATTYPE_DAYOFWEEK
                        var shiftDayOfMonth = shiftStartDay.getDayOfMonth() - 1; // 1 - 31
                        var shiftXthDayOfMonth = Math.floor((shiftDayOfMonth - (shiftDayOfMonth % 7)) / 7) + 1;
                        var slotDayOfMonth = dayAndHour.getDayOfMonth() - 1; // 1 - 31
                        var slotXthDayOfMonth = Math.floor((slotDayOfMonth - (slotDayOfMonth % 7)) / 7) + 1;

                        if ((shiftXthDayOfMonth == slotXthDayOfMonth && shiftStartDay.getDayOfWeek() == dayAndHour.getDayOfWeek()))
                            correctDay = true;
                        else if (W4_Funcs.isLastDayOfMonth(dayAndHour)) {
                            var slotFirstDayOfMonth = W4_Funcs.getDSTSafeDateTime(dayAndHour.getYear(), dayAndHour.getMonthOfYear(), 1, 0, 0, 0);
                            var dayDiff = 0;
                            if (slotFirstDayOfMonth.getDayOfWeek() > shiftStartDay.getDayOfWeek())
                                dayDiff = (shiftStartDay.getDayOfWeek() + 8) - slotFirstDayOfMonth.getDayOfWeek();
                            else
                                dayDiff = (shiftStartDay.getDayOfWeek() + 1) - slotFirstDayOfMonth.getDayOfWeek();
                            var slotDayToMatchShiftDay = (shiftXthDayOfMonth - 1) * 7 + dayDiff;
                            if (dayAndHour.getDayOfMonth() < slotDayToMatchShiftDay)
                                correctDay = true;
                        }

                    }
                    if (rd.getEndUnit(i1) == Shift.ENDUNIT_NEVER && correctDay) {
                        return true;
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_OCCURENCES) {
                        if (Math.floor(monthsDiff / rd.getRepeatAmount(i1)) < rd.getRepeatEndOccurences(i1) && correctDay) {
                            return true;
                        }
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_ONDATE) {
                        if (timeSlotStartDay.getMillis() <= rd.getRepeatEndDate(i1) && correctDay) {
                            return true;
                        }
                    }
                }
            } else if (rd.getRepeatUnit(i1) == Shift.REPEATUNIT_YEARLY) {
                var yearsDiff = timeSlotStartDay.getYear() - shiftStartDay.getYear();
                if (yearsDiff % rd.getRepeatAmount(i1) == 0) {
                    var correctDay = false;
                    if (dayAndHour.getMonthOfYear() == shiftStartDay.getMonthOfYear())
                        if (dayAndHour.getDayOfMonth() == shiftStartDay.getDayOfMonth() || (W4_Funcs.isLastDayOfMonth(dayAndHour) && shiftStartDay.getDayOfMonth() > dayAndHour.getDayOfMonth()))
                            correctDay = true;
                    if (rd.getEndUnit(i1) == Shift.ENDUNIT_NEVER && correctDay) {
                        return true;
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_OCCURENCES && correctDay) {
                        if (Math.floor(yearsDiff / rd.getRepeatAmount(i1)) < rd.getRepeatEndOccurences(i1)) {
                            return true;
                        }
                    } else if (rd.getEndUnit(i1) == Shift.ENDUNIT_ONDATE && correctDay) {
                        if (timeSlotStartDay.getMillis() <= rd.getRepeatEndDate(i1)) {
                            return true;
                        }
                    }
                }
            }

        }
        return false;
    }

    static getExtension(name) {
        return name.split(".").pop();
    }

    // static Matrix getImageViewMatrixFitToCenter(ImageView image) {
    //     var imageWidth = image.getDrawable().getIntrinsicWidth();
    //     var imageHeight = image.getDrawable().getIntrinsicHeight();
    //     var drawableRect = new RectF(0, 0, imageWidth, imageHeight);
    //     var viewRect = new RectF(0, 0, image.getWidth(),
    //         image.getHeight());
    //     var matrix = new Matrix();
    //     matrix.setRectToRect(drawableRect, viewRect, Matrix.ScaleToFit.CENTER);
    //     return matrix;
    // }

    // static matrixMultiply(matrix1, matrix2) {
    //     var tr = [ 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //     var mat1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //     var mat2 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0];
    //     matrix1.vals(mat1);
    //     matrix2.vals(mat2);
    //     for(var c = 0; c < 3; c++) {
    //         for(var r = 0; r < 3; r++) {
    //             for(var i = 0; i < 3; i++) {
    //                 tr[r + c * 3] += mat1[r + i * 3] * mat2[i + c * 3];
    //             }
    //         }
    //     }
    //     var matrix = new Matrix();
    //     matrix.setValues(tr);
    //     return matrix;
    // }

    static doNotificationsIncludeTimePunchID(saves, id) {
        for (let save of saves) {
            if (save.timepunch_id == (id))
                return true;
        }
        return false;
    }

    static doNotificationsIncludeTaskID(saves, id) {
        for (let save of saves) {
            if (save.task_id == (id))
                return true;
        }
        return false;
    }

    static doNotificationsIncludeAnyID(saves, id) {
        for (let save of saves) {
            if (save.any_id == (id))
                return true;
        }
        return false;
    }

    static doNotificationsIncludeShiftPersonDay(saves, shiftID, personID, day) {
        for (let save of saves) {
            if (save.time == day && save.shift_id == (shiftID) && save.person_id == (personID))
                return true;
        }
        return false;
    }

    static getShiftStartTimeOnDay(shiftStartTime, day) {
        var shiftStartTime2 = new W4DateTime(shiftStartTime);
        var day2 = W4_Funcs.getDSTSafeDateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), shiftStartTime2.getHourOfDay(), shiftStartTime2.getMinuteOfHour(), 0);
        return day2;
    }

    static getTodaysIncompleteTaskSheets(personID) {
        var results = [];
        var now = new W4DateTime();
        for (let taskSheetOccurence of MainActivity.theCompany.getTaskSheetInProgressList()) {
            if (taskSheetOccurence.getPersonID() == (personID)) {
                var taskTime = new W4DateTime(taskSheetOccurence.getStartedDateTime());
                var numTasksCompleted = 0;
                var completes = taskSheetOccurence.getTimesCompleted();
                for (var i = 0; i < completes.length; ++i)
                    if (completes[i] != -1)
                        ++numTasksCompleted;
                if (numTasksCompleted < taskSheetOccurence.getDurations().length && (W4_Funcs.isSameDay(now, taskTime) || W4_Funcs.isTimeYesterday(taskTime)))
                    results.push(taskSheetOccurence);
            }
        }
        return results;
    }

    static getTimePunchesForPerson(personID, startMillis, endMillis, clockIn) {
        var timePunchList = [];
        for (let timePunch of MainActivity.theCompany.getTimePunchList()) {
            if (timePunch.getPersonID() == (personID) && timePunch.getTime() >= startMillis && timePunch.getTime() < endMillis && (clockIn == null || timePunch.getClockIn() == clockIn))
                timePunchList.push(timePunch);
        }
        return timePunchList;
    }

    static getPersonLatestTimePunch(personID, shiftID) {
        for (let timePunch of MainActivity.theCompany.getTimePunchList()) {
            if (timePunch.getPersonID() == (personID) && (shiftID == ("") || timePunch.getShiftID() == (shiftID))) {
                return timePunch;
            }
        }
        return null;
    }

    static getTaskSheetOccurrencesForPerson(personID, startMillis, endMillis) {
        var taskList = [];
        for (let task of MainActivity.theCompany.getTaskSheetCompletedList()) {
            if (task.getPersonID() == (personID) && task.getStartedDateTime() >= startMillis && task.getStartedDateTime() < endMillis)
                taskList.push(task);
        }
        return taskList;
    }

    static getInspectionPlanOccurrencesForShift(shiftID, startMillis, endMillis) {
        var inspectionList = [];
        for (let plan of MainActivity.theCompany.getInspectionPlansCompletedList()) {
            if (plan.getShiftID() == (shiftID) && plan.getDateTime() >= startMillis && plan.getDateTime() < endMillis)
                inspectionList.push(plan);
        }
        return inspectionList;
    }

    static printTextClipboardText = "";
    static startEmail(message, subject, context, receiver) {
        document.getElementById("dont_Print").style.display = "none";
        document.getElementById("do_Print").style.display = "";
        W4_Funcs.printTextClipboardText = "<br><div style='font-size: 22px; width: 100%;'>" + subject + "</div><br><br>" + message;
        document.getElementById("print_div").innerHTML = W4_Funcs.printTextClipboardText;

    }

    static printBackArrowPressed() {
        document.getElementById("dont_Print").style.display = "";
        document.getElementById("do_Print").style.display = "none";
    }

    static printCopyPressed() {
        // navigator.clipboard.writeText(W4_Funcs.printTextClipboardText);

        var element = document.getElementById("print_div");
        window.getSelection().removeAllRanges();
        let range = document.createRange();
        range.selectNode(typeof element === 'string' ? document.getElementById(element) : element);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();

        MainActivity.w4Toast(MainActivity.mainActivity, "Report copied to clipboard", Toast.LENGTH_LONG);
    }

    static printPrintButtonPressed() {
        window.print();
    }

    static calculateHours(byPerson, startDay, endDay, selectedPerson, selectedLocation, activity) {
        var personID_To_dateAndHoursMap = new Map();
        if (byPerson) {
            var objects = W4_Funcs.getPersonHoursAndStillClockedIn(selectedPerson, byPerson, startDay, endDay, selectedLocation);
            var hours = objects[0];
            var stillClockedIn = objects[1];
            var firstPunchIsClockIn = objects[2];
            personID_To_dateAndHoursMap.set(selectedPerson.getW4id(), objects[3]);
            var extraText = "";
            if (stillClockedIn)
                extraText += "<br>⚠ " + selectedPerson.getFirst_name() + " " + selectedPerson.getLast_name() + " is still clocked in at the end of this date range, expand the date range or wait for them to clock back in to get an accurate hour count.";
            if (!firstPunchIsClockIn)
                extraText += "<br>⚠ " + selectedPerson.getFirst_name() + " " + selectedPerson.getLast_name() + " is still clocked in at the beginning of this date range, expand the date range to get an accurate hour count.";
            var textView = activity.findViewById("TotalHours_TotalText");
            if (textView != null) {
                textView.setText(W4_Funcs.format2F(hours / 100) + " Hours" + extraText);
            }
        } else {
            var numPeopleStillClockedIn = 0;
            var numPeopleClockedInAtStart = 0;
            var hoursTotal = 0;
            for (let person of W4_Funcs.getPermittedPersonList_ForX(Asset.PERMISSION_ALL_TIMEPUNCHES)) {
                var objects = W4_Funcs.getPersonHoursAndStillClockedIn(person, byPerson, startDay, endDay, selectedLocation);
                var hours = objects[0];
                var stillClockedIn = objects[1];
                var firstPunchIsClockIn = objects[2];
                personID_To_dateAndHoursMap.set(person.getW4id(), objects[3]);
                hoursTotal += hours;
                if (stillClockedIn)
                    ++numPeopleStillClockedIn;
                if (!firstPunchIsClockIn)
                    ++numPeopleClockedInAtStart;
            }
            var extraText = "";
            if (numPeopleStillClockedIn > 0) {
                if (numPeopleStillClockedIn == 1)
                    extraText += "<br>⚠ " + numPeopleStillClockedIn + " person is still clocked in at the end of this date range, expand the date range or wait for them to clock back in to get an accurate hour count.";
                else
                    extraText += "<br>⚠ " + numPeopleStillClockedIn + " people are still clocked in at the end of this date range, expand the date range or wait for them to clock back in to get an accurate hour count.";
            }
            if (numPeopleClockedInAtStart > 0) {
                if (numPeopleClockedInAtStart == 1)
                    extraText += "<br>⚠ " + numPeopleClockedInAtStart + " person is still clocked in at the beginning of this date range, expand the date range to get an accurate hour count.";
                else
                    extraText += "<br>⚠ " + numPeopleClockedInAtStart + " people are still clocked in at the beginning of this date range, expand the date range to get an accurate hour count.";
            }
            var textView = activity.findViewById("TotalHours_TotalText");
            if (textView != null) {
                textView.setText(W4_Funcs.format2F(hoursTotal / 100) + " Hours" + extraText);
            }
        }
        return personID_To_dateAndHoursMap;
    }

    static getPersonHoursAndStillClockedIn(person, byPerson, startDay, endDay, selectedLocation) {
        var firstPunch = null;
        var lastInPunch = null;
        var minutes = 0;
        var timePunchList = W4_Funcs.getPermittedTimePunchList();
        var dateAndHours = [];
        for (var i = timePunchList.length - 1; i >= 0; --i) {
            var timePunch = timePunchList[i];
            var punchDateTime = new W4DateTime(timePunch.getTime());
            if (timePunch.getPersonID() == (person.getW4id()) && (byPerson || timePunch.getLocationID() == (selectedLocation.getW4id()))) {
                if (W4_Funcs.isTimeWithinDateRange(startDay, endDay, punchDateTime)) {
                    if (firstPunch == null)
                        firstPunch = timePunch;
                    if (timePunch.getClockIn() && lastInPunch == null) {
                        lastInPunch = timePunch;
                    } else if (!timePunch.getClockIn() && lastInPunch != null) {
                        var minutes1 = TimeUnit.MILLISECONDS.toMinutes(timePunch.getTime() - lastInPunch.getTime());
                        var timePunchDT = new W4DateTime(lastInPunch.getTime());
                        var hours1 = Math.floor((minutes1 / 60) * 100);
                        if (dateAndHours.length > 0) {
                            var lastDH = dateAndHours[dateAndHours.length - 1];
                            if (W4_Funcs.isSameDay(lastDH.time, timePunchDT) && lastDH.locationID == (lastInPunch.getLocationID())) {
                                lastDH.hours100 += hours1;
                                dateAndHours[dateAndHours.length - 1] = lastDH;
                            } else
                                dateAndHours.push(new TimePunchDateAndHours(timePunchDT, hours1, lastInPunch.getLocationID()));
                        } else
                            dateAndHours.push(new TimePunchDateAndHours(timePunchDT, hours1, lastInPunch.getLocationID()));
                        minutes += minutes1;
                        lastInPunch = null;
                    }
                } else if (W4_Funcs.isTimeAfterDate(endDay, punchDateTime))
                    break;
            }
        }
        var objects = [Math.floor((minutes / 60) * 100), lastInPunch != null, firstPunch == null || firstPunch.getClockIn(), dateAndHours];
        return objects;
    }

    static copyAssetReferences(list) {
        var results = [];
        for (let asset of list) {
            results.push(asset);
        }
        return results;
    }

    static setPersonClockInStatusFromTimePunches(personID, newPunch, deletedPunchIDs) {
        var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), personID);
        if (person != null) {
            var list = W4_Funcs.getTimePunchesForPerson(personID, 0, Number.MAX_SAFE_INTEGER, null);
            if (newPunch != null)
                list.push(newPunch);
            var latest = null;
            for (let timePunch of list) {
                if (deletedPunchIDs == null || !deletedPunchIDs.includes(timePunch.getW4id())) {
                    if (latest == null || timePunch.getTime() > latest.getTime())
                        latest = timePunch;
                }
            }
            if (latest != null) {
                var now = new W4DateTime();
                if (latest.getTime() > now.getMillis()) {
                    var punchTime = new W4DateTime(latest.getTime());
                    MainActivity.w4Toast(HomeActivity.homeActivity, "You have a future time punch affecting your clocked in status: " + W4_Funcs.getFriendlyDateText(punchTime) + " " + W4_Funcs.getTimeText(punchTime), Toast.LENGTH_LONG);
                }

                person.setClockedIn(latest.getClockIn());
                var reff = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_PEOPLE).child(person.getW4id());
                W4_Funcs.writeToDB(reff, person, "");
            }
        }
    }

    static setTimePunchInFireBase(reff0, timePunch, personID, checkForLastClockInFix) {
        var punchTime = new W4DateTime(timePunch.getTime());
        var result = { };
        if (checkForLastClockInFix && !timePunch.getClockIn()) {
            var lastTimePunch = W4_Funcs.getPersonLatestTimePunch(personID, "");
            if (lastTimePunch != null && lastTimePunch.getClockIn()) {
                var lastPunchTime = new W4DateTime(lastTimePunch.getTime());
                var lastShift = null;
                var lastShiftOccurence = null;
                var fixRequired = false;
                if (lastTimePunch.getShiftID() != (timePunch.getShiftID())) {
                    lastShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), lastTimePunch.getShiftID());
                    if (lastShift != null) {
                        lastShiftOccurence = W4_Funcs.getClosestShiftOccurenceToTime(lastShift, lastPunchTime);
                        fixRequired = true;
                    }
                }
                else {
                    lastShift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), lastTimePunch.getShiftID());
                    if (lastShift != null) {
                        this.hiftOccurence = W4_Funcs.getClosestShiftOccurenceToTime(lastShift, punchTime);
                        lastShiftOccurence = W4_Funcs.getClosestShiftOccurenceToTime(lastShift, lastPunchTime);
                        if (lastShiftOccurence.getMillis() != thisShiftOccurence.getMillis()) {
                            fixRequired = true;
                        }
                    }
                }
                if (fixRequired && lastShift != null && lastShiftOccurence != null) {
                    var shiftEnd = lastShift.method_getEndTimeOfOccurence(lastShiftOccurence);
                    if (lastTimePunch.getTime() >= shiftEnd.getMillis()) { //If last time punch for clocking into last shift was later than shift end time
                        lastTimePunch.setTime(shiftEnd.getMillis() - 1);
                        var reff1 = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).child(lastTimePunch.getW4id());
                        W4_Funcs.writeToDB(reff1, lastTimePunch, "Edited Clock In Time Punch that occured later than shift end for |Location:" + W4_DBLog.getLocationStringForLog(lastTimePunch.getLocationID()) + "|Person:" + W4_DBLog.getPersonStringForLog(lastTimePunch.getPersonID()) + "|" + lastPunchTime.getMonthOfYear() + "/" + lastPunchTime.getDayOfMonth() + "/" + lastPunchTime.getYear() + " " + W4_Funcs.getTimeText(lastPunchTime));
                    }
                    var reff2 = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).push();
                    var newTimePunch = new TimePunch(reff2.key, shiftEnd.getMillis(), false, lastTimePunch.getLocationID(), lastTimePunch.getPersonID(), lastTimePunch.getShiftID());
                    W4_Funcs.writeToDB(reff2, newTimePunch, "Set new Clock Out Time Punch for missed clock out on last shift for |Location:" + W4_DBLog.getLocationStringForLog(newTimePunch.getLocationID()) + "|Person:" + W4_DBLog.getPersonStringForLog(newTimePunch.getPersonID()) + "|" + shiftEnd.getMonthOfYear() + "/" + shiftEnd.getDayOfMonth() + "/" + shiftEnd.getYear() + " " + W4_Funcs.getTimeText(shiftEnd));
                    timePunch.setClockIn(true);
                    result = ["Added Missing Time Punch", "Clean Assistant detected you were missing a clock out time punch for your last shift at " + W4_DBLog.getLocationStringForLog(lastTimePunch.getLocationID()) + " " + Asset.intToDayOfWeek3Letter[lastShiftOccurence.getDayOfWeek()] + " " + W4_Funcs.getNumbersDayText(lastShiftOccurence, "/", false) + " " + W4_Funcs.getTimeText(lastShiftOccurence) + " and automatically added a clock out time punch at the end of that shift. You are now clocked in at your current shift."];
                }
            }
        }
        var clockInOut = "Clock In";
        if (!timePunch.getClockIn()) {
            clockInOut = "Clock Out";
        }
        W4_Funcs.writeToDB(reff0, timePunch, "New " + clockInOut + " Time Punch for |Location:" + W4_DBLog.getLocationStringForLog(timePunch.getLocationID()) + "|Person:" + W4_DBLog.getPersonStringForLog(timePunch.getPersonID()) + "|" + punchTime.getMonthOfYear() + "/" + punchTime.getDayOfMonth() + "/" + punchTime.getYear() + " " + W4_Funcs.getTimeText(punchTime));
        W4_Funcs.setPersonClockInStatusFromTimePunches(personID, timePunch, null);
        return result;

    }

    static getEmployeeStatuses() {
        var list = [];
        var now = new W4DateTime();
        for (let person of W4_Funcs.getPermittedPersonList()) {
            var shifts = W4_Funcs.getAssignedShifts(person.getW4id());
            for (let shift of shifts) {
                var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                if (location != null) {
                    if (W4_Funcs.isShiftActiveAtTime(shift, now)) {
                        list.push(new EmployeeStatusStruct(person, shift, location));
                        break;
                    }
                }
            }
        }
        list.sort(EmployeeStatusStruct.compareTo);
        return list;
    }

    static getIDsFromAssetArray(list) {
        var results = [];
        for (let asset of list) {
            results.push(asset.getW4id());
        }
        return results;
    }

    static standardizeString(str) {
        var str2 = String(str).toLowerCase();

        //Remove non numbers and letters and spaces
        str2 = str2.replace(/[^0-9a-z ]/g, "");

        //Remove multiple spaces
        str2 = str2.replace(/ {2,}/g, " ");

        //Remove spaces at beginning of string
        if (str2.charAt(0) == " ")
            str2 = str2.substring(1, str2.length);

        //Remove spaces at end of string
        if (str2.charAt(str2.length - 1) == " ")
            str2 = str2.substring(0, str2.length - 1);

        return str2;
    }

    static getSuppliesForLocations(supplyList) {
        var map = new Map();
        for (let supplyItem of supplyList) {
            if (!map.has(supplyItem.getLocationID())) {
                map.set(supplyItem.getLocationID(), []);
            }
            map.get(supplyItem.getLocationID()).push(supplyItem);
        }
        return map;
    }

    static writeToDB(reff, object, log) {
        reff.set(object);
        if (log != ("")) {
            W4_DBLog.writeTo_DB_Log(log, reff.toString());
        }
    }

    static deleteFromDB(reff, log) {
        reff.remove();
        if (log != ("")) {
            W4_DBLog.writeTo_DB_Log(log, reff.toString());
        }
    }

    static clone2DArray(list1) {
        var arrayList = [];
        for (let obj1 of list1) {
            var list2 = [];
            for (let obj of obj1) {
                list2.push(obj);
            }
            arrayList.push(list2);
        }
        return arrayList;
    }

    static getClosestShiftOccurenceToTime(shift, dt) {
        var startTime = new W4DateTime(shift.getStartTime());
        var dtMinutes = dt.getHourOfDay() * 60 + dt.getMinuteOfHour();
        var startMinutes = startTime.getHourOfDay() * 60 + startTime.getMinuteOfHour();
        if (W4_Funcs.isShiftActiveAtTime(shift, dt)) {
            if (shift.method_doesShiftGoOvernight()) {
                if (dtMinutes >= startMinutes) { //If dt is after start time, has to be on first day
                    return W4_Funcs.getDSTSafeDateTime(dt, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
                else { //DT is before start time, is on 2nd day and need to return first day (prev day)
                    return W4_Funcs.getDSTSafeDateTime(W4_Funcs.getPrevDay(dt), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
            }
            else {
                return W4_Funcs.getDSTSafeDateTime(dt, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
            }
        }
        var lastShiftDay = W4_Funcs.getLastDayOfShift(shift, null);
        if (lastShiftDay != null) {
            if (dt.getMillis() >= lastShiftDay.getMillis()) {
                return lastShiftDay;
            }
        }
        var shift1Start = W4_Funcs.getLastDayOfShift(shift, dt);
        if (shift1Start != null) {
            var shift2Start = new W4DateTime(shift1Start.getMillis());
            if (W4_Funcs.isSameDay(shift1Start, dt)) {
                if (startMinutes > dtMinutes) { //No >= because that would mean the shift is active at that dt, which it isn't due to previous check
                    shift1Start = W4_Funcs.getPrevOccurenceOfShift(shift2Start, shift);
                }
                else { //Dt Occurs after this occurence, so find the next occurence
                    shift2Start = W4_Funcs.getNextOccurenceOfShift(shift1Start, shift);
                }
            }
            else { //Not the same day, and W4_Funcs.getLastDayOfShift finds the occurence preceding the given DT, so find the next occurence
                shift2Start = W4_Funcs.getNextOccurenceOfShift(shift1Start, shift);
            }
            var shift1End = shift.method_getEndTimeOfOccurence(shift1Start);
            var millisDiff1 = Math.abs(shift1End.getMillis() - dt.getMillis());
            var millisDiff2 = Math.abs(shift2Start.getMillis() - dt.getMillis());

            if (millisDiff1 < millisDiff2) {
                return shift1Start;
            }
            else {
                return shift2Start;
            }
        }

        return startTime;
    }

    static getLastDayOfShift(shift, overrideEndDate) {
        var startTime = new W4DateTime(shift.getStartTime());
        var repeatEndTime = new W4DateTime(shift.getRepeatEndDate());
        if (overrideEndDate != null) {
            repeatEndTime = overrideEndDate;
        }
        if (shift.getRepeatAmount() == 0) {
            return startTime;
        }
        if (shift.getEndUnit() == Asset.ENDUNIT_OCCURENCES && shift.getRepeatEndOccurences() == 1) {
            return startTime;
        }
        if (shift.getEndUnit() == Asset.ENDUNIT_OCCURENCES && shift.getRepeatEndOccurences() == 0) {
            return startTime;
        }
        if (shift.getEndUnit() == Asset.ENDUNIT_NEVER && overrideEndDate == null) {
            return null;
        }
        if (shift.getEndUnit() == Asset.ENDUNIT_ONDATE && repeatEndTime.getMillis() <= startTime.getMillis()) {
            return startTime;
        }
        if (shift.getRepeatUnit() == Asset.REPEATUNIT_WEEKLY) {
            var hasRepeatDay = false;
            for (var i = 0; i < 7; ++i) {
                if (shift.getWeeklyRepeatDays()[i]) {
                    hasRepeatDay = true;
                    break;
                }
            }
            if (!hasRepeatDay) {
                return startTime;
            }
        }

        switch (shift.getRepeatUnit()) {
            case Asset.REPEATUNIT_DAILY:
                if (shift.getEndUnit() == Asset.ENDUNIT_OCCURENCES && overrideEndDate == null) {
                    return W4_Funcs.getAdjustedDaySameTime(startTime, (shift.getRepeatEndOccurences() - 1) * shift.getRepeatAmount());
                }
                else { //Asset.ENDUNIT_ONDATE:
                    var daysDiff = Math.abs(W4_Funcs.getDaysDiff(startTime, repeatEndTime));
                    var occurencesToDt = Math.floor(daysDiff / shift.getRepeatAmount());
                    var lastDay = W4_Funcs.getAdjustedDaySameTime(startTime, occurencesToDt * shift.getRepeatAmount());
                    return lastDay;
                }
            case Asset.REPEATUNIT_WEEKLY:
                if (shift.getEndUnit() == Asset.ENDUNIT_OCCURENCES && overrideEndDate == null) {
                    var numWeeklyRepeatDays = 0;
                    for (let bool of shift.getWeeklyRepeatDays()) {
                        if (bool) {
                            numWeeklyRepeatDays += 1;
                        }
                    }
                    if (numWeeklyRepeatDays == 0) {
                        return startTime;
                    }
                    var numOccurences = 0; //Includes start day
                    if (!shift.getWeeklyRepeatDays()[startTime.getDayOfWeek() % 7]) {
                        numOccurences += 1;
                    }
                    for (var i = startTime.getDayOfWeek() % 7; i < 7; ++i) { //First week
                        if (shift.getWeeklyRepeatDays()[i]) {
                            numOccurences += 1;
                        }
                    }
                    var numOccurencesInFirstWeek = numOccurences;
                    if (shift.getRepeatEndOccurences() <= numOccurencesInFirstWeek) { //Last day is in first week
                        var _ = W4_Funcs.getDSTSafeDateTime(startTime.getYear(), startTime.getMonthOfYear(), startTime.getDayOfMonth(), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute())
                        var numOccurencesThatWeekFound = 0;
                        var daysDiff = 0;
                        for (var i = startTime.getDayOfWeek() % 7; i < shift.getRepeatEndOccurences(); ++i) { //First week
                            if (startTime.getDayOfWeek() % 7 == i || shift.getWeeklyRepeatDays()[i]) {
                                numOccurencesThatWeekFound += 1;
                                if (numOccurencesThatWeekFound == shift.getRepeatEndOccurences()) {
                                    return W4_Funcs.getAdjustedDaySameTime(startTime, daysDiff);
                                }
                            }
                            daysDiff += 1;
                        }
                    }
                    var numOccurencesAfterFirstWeek = shift.getRepeatEndOccurences() - numOccurencesInFirstWeek;
                    var numWholeWeeks = Math.floor(numOccurencesAfterFirstWeek / numWeeklyRepeatDays);
                    var numOccurencesInLastWeek = numOccurencesAfterFirstWeek % numWeeklyRepeatDays;
                    var midWeek = W4_Funcs.getMiddleOfWeek(startTime);
                    var pre_lastWeek = W4_Funcs.getAdjustedDaySameTime(midWeek, numWholeWeeks * shift.getRepeatAmount() * 7);
                    if (numOccurencesInLastWeek == 0) {
                        var lastDayInt = 0;
                        for (var i = 0; i < 7; ++i) {
                            if (shift.getWeeklyRepeatDays()[i]) {
                                lastDayInt = i;
                            }
                        }
                        var daysDiff = lastDayInt - 3; //Thursday of last week (from W4_Funcs.getMiddleOfWeek)
                        var lastDay = W4_Funcs.getAdjustedDaySameTime(pre_lastWeek, daysDiff);
                        return W4_Funcs.getDSTSafeDateTime(lastDay, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    }
                    else {
                        var lastWeek = W4_Funcs.getAdjustedDaySameTime(pre_lastWeek, 7 * shift.getRepeatAmount());
                        var lastDayInt = 0;
                        var lastOccurences = 0;
                        for (var i = 0; i < 7; ++i) {
                            if (shift.getWeeklyRepeatDays()[i]) {
                                lastOccurences += 1;
                                lastDayInt = i;
                                if (lastOccurences == numOccurencesInLastWeek) {
                                    break;
                                }
                            }
                        }
                        var daysDiff = lastDayInt - 3; //Thursday of last week (from W4_Funcs.getMiddleOfWeek)
                        var lastDay = W4_Funcs.getAdjustedDaySameTime(lastWeek, daysDiff);
                        return W4_Funcs.getDSTSafeDateTime(lastDay, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    }
                } else {//Asset.ENDUNIT_ONDATE:
                    var startWeek = W4_Funcs.getMiddleOfWeek(startTime);
                    var endWeek = W4_Funcs.getMiddleOfWeek(repeatEndTime);
                    var repeatEndTime0 = W4_Funcs.getDSTSafeDateTime(repeatEndTime, 0, 0, 0);
                    if (W4_Funcs.isSameDay(startWeek, endWeek)) { //End date is in same week
                        var lastDay = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                        var lastDayPrev = W4_Funcs.getDSTSafeDateTime(lastDay, 0, 0, 0);
                        for (var i = lastDay.getDayOfWeek() % 7; i < 7; ++i) {
                            lastDay = W4_Funcs.getDSTSafeDateTime(W4_Funcs.getNextDay(lastDay), 0, 0, 0);
                            if (lastDay.getMillis() > repeatEndTime0.getMillis()) {
                                return W4_Funcs.getDSTSafeDateTime(lastDayPrev, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                            }
                            if (i < 6 && shift.getWeeklyRepeatDays()[i + 1]) {
                                lastDayPrev = W4_Funcs.getDSTSafeDateTime(lastDay, 0, 0, 0);
                            }
                        }
                        return W4_Funcs.getDSTSafeDateTime(lastDayPrev, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    }
                    else {
                        var firstDay = 0;
                        for (var i = 0; i < 7; ++i) {
                            if (shift.getWeeklyRepeatDays()[i]) {
                                firstDay = i;
                                break;
                            }
                        }

                        var weeksBetween = Math.floor(W4_Funcs.getDaysDiff(startWeek, endWeek) / 7);
                        var latestWeeks = Math.floor(weeksBetween / shift.getRepeatAmount());
                        var lastDayDT = W4_Funcs.getAdjustedDaySameTime(startWeek, ((latestWeeks * 7 * shift.getRepeatAmount()) - 3) + firstDay);

                        if (repeatEndTime.getDayOfWeek() % 7 < firstDay) { //If last day occurs on week before end time week
                            var lastDay = 0;
                            for (var i = 6; i >= 0; --i) {
                                if (shift.getWeeklyRepeatDays()[i]) {
                                    lastDay = i;
                                    break;
                                }
                            }
                            lastDayDT = W4_Funcs.getAdjustedDaySameTime(lastDayDT, -7 * shift.getRepeatAmount() + (lastDay - (lastDayDT.getDayOfWeek() % 7)));
                            return W4_Funcs.getDSTSafeDateTime(lastDayDT, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                        }

                        if (W4_Funcs.isSameDay(W4_Funcs.getMiddleOfWeek(startTime), W4_Funcs.getMiddleOfWeek(lastDayDT))) { //Is still the same week
                            lastDayDT = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                        }
                        var lastDayPrev = W4_Funcs.getDSTSafeDateTime(lastDayDT, 0, 0, 0);
                        for (var i = lastDayDT.getDayOfWeek() % 7; i < 7; ++i) {
                            lastDayDT = W4_Funcs.getDSTSafeDateTime(W4_Funcs.getNextDay(lastDayDT), 0, 0, 0);
                            if (lastDayDT.getMillis() > repeatEndTime0.getMillis()) {
                                return W4_Funcs.getDSTSafeDateTime(lastDayPrev, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                            }
                            if (i < 6 && shift.getWeeklyRepeatDays()[i + 1]) {
                                lastDayPrev = W4_Funcs.getDSTSafeDateTime(lastDayDT, 0, 0, 0);
                            }
                        }
                        return W4_Funcs.getDSTSafeDateTime(lastDayPrev, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    }
                }
            case Asset.REPEATUNIT_MONTHLY:
                if (shift.getEndUnit() == Asset.ENDUNIT_OCCURENCES && overrideEndDate == null) {
                    switch (shift.getMonthlyRepeatType()) {
                        case Asset.MONTHLYREPEATTYPE_DAYOFMONTH:
                            var monthsDiff0 = (shift.getRepeatEndOccurences() - 1) * shift.getRepeatAmount();
                            var lastMonth0 = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                            lastMonth0 = W4_Funcs.addMonths(lastMonth0, monthsDiff0);
                            return W4_Funcs.getDSTSafeDateTime(lastMonth0, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                        default: //Asset.MONTHLYREPEATTYPE_DAYOFWEEK:
                            var monthsDiff1 = (shift.getRepeatEndOccurences() - 1) * shift.getRepeatAmount();
                            var lastMonth1 = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                            lastMonth1 = W4_Funcs.addMonths(lastMonth1, monthsDiff1);
                            var shiftDayOfMonth = startTime.getDayOfMonth() - 1; // 1 - 31
                            var shiftXthWeek = Math.floor((shiftDayOfMonth - (shiftDayOfMonth % 7)) / 7); //0 - 3 or 4
                            var shiftDayOfWeek = startTime.getDayOfWeek() % 7;
                            var finalMonthStartDay = W4_Funcs.getDSTSafeDateTime(lastMonth1.getYear(), lastMonth1.getMonthOfYear(), 1, 0, 0, 0);
                            var startDayDiff = shiftDayOfWeek - finalMonthStartDay.getDayOfWeek() % 7;
                            if (startDayDiff < 0) {
                                startDayDiff += 7;
                            }
                            var lastDay = W4_Funcs.getAdjustedDaySameTime(finalMonthStartDay, startDayDiff + (shiftXthWeek * 7));
                            if (lastDay.getMonthOfYear() != lastMonth1.getMonthOfYear() || lastDay.getYear() != lastMonth1.getYear()) {
                                return W4_Funcs.getDSTSafeDateTime(lastMonth1.getYear(), lastMonth1.getMonthOfYear(), W4_Funcs.getNumDaysInMonth(lastMonth1), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                            }
                            return W4_Funcs.getDSTSafeDateTime(lastDay, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    }
                } else { //Asset.ENDUNIT_ONDATE:
                    switch (shift.getMonthlyRepeatType()) {
                        case Asset.MONTHLYREPEATTYPE_DAYOFMONTH:
                            var monthsDiff = (repeatEndTime.getMonthOfYear() + (repeatEndTime.getYear() * 12)) - (startTime.getMonthOfYear() + (startTime.getYear() * 12));
                            var latestMonth = monthsDiff / shift.getRepeatAmount();
                            var lastMonth = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                            lastMonth = W4_Funcs.addMonths(lastMonth, latestMonth * shift.getRepeatAmount());

                            if (monthsDiff % shift.getRepeatAmount() == 0 && repeatEndTime.getDayOfMonth() < lastMonth.getDayOfMonth()) { //If latest month is same month as end date
                                latestMonth -= 1;
                                lastMonth = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                                lastMonth = W4_Funcs.addMonths(lastMonth, latestMonth * shift.getRepeatAmount());
                            }
                            return W4_Funcs.getDSTSafeDateTime(lastMonth, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                        default: //Asset.MONTHLYREPEATTYPE_DAYOFWEEK:
                            var monthsDiff2 = (repeatEndTime.getMonthOfYear() + (repeatEndTime.getYear() * 12)) - (startTime.getMonthOfYear() + (startTime.getYear() * 12));
                            var latestMonth2 = monthsDiff2 / shift.getRepeatAmount();
                            var lastMonth2 = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                            lastMonth = W4_Funcs.addMonths(lastMonth2, latestMonth2 * shift.getRepeatAmount());
                            var shiftDayOfMonth = startTime.getDayOfMonth() - 1; // 1 - 31
                            var shiftXthWeek = Math.floor((shiftDayOfMonth - (shiftDayOfMonth % 7)) / 7); //0 - 3 or 4
                            var shiftDayOfWeek = startTime.getDayOfWeek() % 7;
                            var finalMonthStartDay = W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), 1, 0, 0, 0);
                            var startDayDiff = shiftDayOfWeek - finalMonthStartDay.getDayOfWeek() % 7;
                            if (startDayDiff < 0) {
                                startDayDiff += 7;
                            }
                            var lastDay = W4_Funcs.getAdjustedDaySameTime(finalMonthStartDay, startDayDiff + (shiftXthWeek * 7));
                            if (lastDay.getMonthOfYear() != lastMonth.getMonthOfYear() || lastDay.getYear() != lastMonth.getYear()) {
                                lastDay = W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), W4_Funcs.getNumDaysInMonth(lastMonth), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                            }

                            if (monthsDiff2 % shift.getRepeatAmount() == 0 && repeatEndTime.getDayOfMonth() < lastDay.getDayOfMonth()) { //If latest month is same month as end date
                                latestMonth2 -= 1;
                                lastMonth = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                                lastMonth = W4_Funcs.addMonths(lastMonth, latestMonth2 * shift.getRepeatAmount());
                                shiftDayOfMonth = startTime.getDayOfMonth() - 1; // 1 - 31
                                shiftXthWeek = Math.floor((shiftDayOfMonth - (shiftDayOfMonth % 7)) / 7); //0 - 3 or 4
                                shiftDayOfWeek = startTime.getDayOfWeek() % 7;
                                finalMonthStartDay = W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), 1, 0, 0, 0);
                                startDayDiff = shiftDayOfWeek - finalMonthStartDay.getDayOfWeek() % 7;
                                if (startDayDiff < 0) {
                                    startDayDiff += 7;
                                }
                                lastDay = W4_Funcs.getAdjustedDaySameTime(finalMonthStartDay, startDayDiff + (shiftXthWeek * 7));
                                if (lastDay.getMonthOfYear() != lastMonth.getMonthOfYear() || lastDay.getYear() != lastMonth.getYear()) {
                                    return W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), W4_Funcs.getNumDaysInMonth(lastMonth), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                                }
                            }
                            return W4_Funcs.getDSTSafeDateTime(lastDay, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    }
                }
            default: //Asset.REPEATUNIT_YEARLY
                if (shift.getEndUnit() == Asset.ENDUNIT_OCCURENCES && overrideEndDate == null) {
                    var yearsDiff = (shift.getRepeatEndOccurences() - 1) * shift.getRepeatAmount();
                    var lastYear = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                    lastYear = W4_Funcs.addYears(lastYear, yearsDiff);
                    return W4_Funcs.getDSTSafeDateTime(lastYear, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                } else { //Asset.ENDUNIT_ONDATE:
                    var yearsDiff = repeatEndTime.getYear() - startTime.getYear();
                    var latestYear = Math.floor(yearsDiff / shift.getRepeatAmount());
                    var lastYear = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                    lastYear = W4_Funcs.addYears(lastYear, latestYear * shift.getRepeatAmount());
                    if (yearsDiff % shift.getRepeatAmount() == 0) {
                        if (repeatEndTime.getMonthOfYear() == lastYear.getMonthOfYear() && repeatEndTime.getDayOfMonth() < lastYear.getDayOfMonth()) {
                            latestYear -= 1;
                        }
                        else if (repeatEndTime.getMonthOfYear() < lastYear.getMonthOfYear()) {
                            latestYear -= 1;
                        }
                    }
                    lastYear = W4_Funcs.getDSTSafeDateTime(startTime, 0, 0, 0);
                    lastYear = W4_Funcs.addYears(lastYear, latestYear * shift.getRepeatAmount());
                    return W4_Funcs.getDSTSafeDateTime(lastYear, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
        }
    }

    //Ignores ending conditions (number of occurences/on a date)
    //Must input valid current occurence of shift
    static getNextOccurenceOfShift(occurence, shift) {
        var startTime = new W4DateTime(shift.getStartTime());

        if (shift.getRepeatUnit() == Asset.REPEATUNIT_WEEKLY) {
            var hasRepeatDay = false;
            for (var i = 0; i < 7; ++i) {
                if (shift.getWeeklyRepeatDays()[i]) {
                    hasRepeatDay = true;
                    break;
                }
            }
            if (!hasRepeatDay) {
                return startTime;
            }
        }

        switch (shift.getRepeatUnit()) {
            case Asset.REPEATUNIT_DAILY:
                return W4_Funcs.getAdjustedDaySameTime(occurence, shift.getRepeatAmount());
            case Asset.REPEATUNIT_WEEKLY:
                var nextDayOfWeek = -1;
                var occurenceDayOfWeek = occurence.getDayOfWeek() % 7;
                for (var i = occurenceDayOfWeek + 1; i < 7; ++i) {
                    if (shift.getWeeklyRepeatDays()[i]) {
                        nextDayOfWeek = i;
                        break;
                    }
                }
                if (nextDayOfWeek == -1) { //Day occurs in the next week
                    for (var i = 0; i < 7; ++i) {
                        if (shift.getWeeklyRepeatDays()[i]) {
                            nextDayOfWeek = i;
                            break;
                        }
                    }
                    var lastDay0 = W4_Funcs.getAdjustedDaySameTime(occurence, 7 * shift.getRepeatAmount() + (nextDayOfWeek - occurenceDayOfWeek));
                    return W4_Funcs.getDSTSafeDateTime(lastDay0, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
                else {
                    var lastDay0 = W4_Funcs.getAdjustedDaySameTime(occurence, nextDayOfWeek - occurenceDayOfWeek);
                    return W4_Funcs.getDSTSafeDateTime(lastDay0, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
            case Asset.REPEATUNIT_MONTHLY:
                switch (shift.getMonthlyRepeatType()) {
                    case Asset.MONTHLYREPEATTYPE_DAYOFMONTH:
                        var day = new W4DateTime(occurence.getMillis());
                        var monthsDiff = (day.getMonthOfYear() + day.getYear() * 12) - (startTime.getMonthOfYear() + startTime.getYear() * 12);
                        var lastDay1 = new W4DateTime(startTime.getMillis());
                        lastDay1 = W4_Funcs.addMonths(lastDay1, monthsDiff + shift.getRepeatAmount());
                        return W4_Funcs.getDSTSafeDateTime(lastDay1, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    default: //Asset.MONTHLYREPEATTYPE_DAYOFWEEK:
                        var lastMonth = new W4DateTime(occurence.getMillis());
                        lastMonth = W4_Funcs.addMonths(lastMonth, shift.getRepeatAmount());
                        var shiftDayOfMonth = startTime.getDayOfMonth() - 1; // 1 - 31
                        var shiftXthWeek = Math.floor((shiftDayOfMonth - (shiftDayOfMonth % 7)) / 7); //0 - 3 or 4
                        var shiftDayOfWeek = startTime.getDayOfWeek() % 7;
                        var finalMonthStartDay = W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), 1, 0, 0, 0);
                        var startDayDiff = shiftDayOfWeek - finalMonthStartDay.getDayOfWeek() % 7;
                        if (startDayDiff < 0) {
                            startDayDiff += 7;
                        }
                        var lastDay2 = W4_Funcs.getAdjustedDaySameTime(finalMonthStartDay, startDayDiff + (shiftXthWeek * 7));
                        if (lastDay2.getMonthOfYear() != lastMonth.getMonthOfYear() || lastDay2.getYear() != lastMonth.getYear()) {
                            return W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), W4_Funcs.getNumDaysInMonth(lastMonth), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                        }
                        return W4_Funcs.getDSTSafeDateTime(lastDay2, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
            default: //Asset.REPEATUNIT_YEARLY:
                var day = new W4DateTime(occurence.getMillis());
                var yearsDiff = day.getYear() - startTime.getYear();
                var lastDay3 = new W4DateTime(startTime.getMillis());
                lastDay3 = W4_Funcs.addYears(lastDay3, yearsDiff + shift.getRepeatAmount());
                return W4_Funcs.getDSTSafeDateTime(lastDay3, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
        }
    }

    //Ignores shift start date
    //Must input valid current occurence of shift
    static getPrevOccurenceOfShift(occurence, shift) {
        var startTime = new W4DateTime(shift.getStartTime());

        if (shift.getRepeatUnit() == Asset.REPEATUNIT_WEEKLY) {
            var hasRepeatDay = false;
            for (var i = 0; i < 7; ++i) {
                if (shift.getWeeklyRepeatDays()[i]) {
                    hasRepeatDay = true;
                    break;
                }
            }
            if (!hasRepeatDay) {
                return startTime;
            }
        }

        switch (shift.getRepeatUnit()) {
            case Asset.REPEATUNIT_DAILY:
                return W4_Funcs.getAdjustedDaySameTime(occurence, -shift.getRepeatAmount());
            case Asset.REPEATUNIT_WEEKLY:
                var nextDayOfWeek = -1;
                var occurenceDayOfWeek = occurence.getDayOfWeek() % 7;
                for (var i = occurenceDayOfWeek - 1; i >= 0; --i) {
                    if (shift.getWeeklyRepeatDays()[i]) {
                        nextDayOfWeek = i;
                        break;
                    }
                }
                if (nextDayOfWeek == -1) { //Day occurs in the next week
                    for (var i = 6; i >= 0; --i) {
                        if (shift.getWeeklyRepeatDays()[i]) {
                            nextDayOfWeek = i;
                            break;
                        }
                    }
                    var lastDay0 = W4_Funcs.getAdjustedDaySameTime(occurence, -7 * shift.getRepeatAmount() + (nextDayOfWeek - occurenceDayOfWeek));
                    return W4_Funcs.getDSTSafeDateTime(lastDay0, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
                else {
                    var lastDay1 = W4_Funcs.getAdjustedDaySameTime(occurence, nextDayOfWeek - occurenceDayOfWeek);
                    return W4_Funcs.getDSTSafeDateTime(lastDay1, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
            case Asset.REPEATUNIT_MONTHLY:
                switch (shift.getMonthlyRepeatType()) {
                    case Asset.MONTHLYREPEATTYPE_DAYOFMONTH:
                        var day = new W4DateTime(occurence.getMillis());
                        var monthsDiff = (day.getMonthOfYear() + day.getYear() * 12) - (startTime.getMonthOfYear() + startTime.getYear() * 12);
                        var lastDay2 = new W4DateTime(startTime.getMillis());
                        lastDay2 = W4_Funcs.addMonths(lastDay2, monthsDiff - shift.getRepeatAmount());
                        return W4_Funcs.getDSTSafeDateTime(lastDay2, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                    default: //Asset.MONTHLYREPEATTYPE_DAYOFWEEK:
                        var lastMonth = new W4DateTime(occurence.getMillis());
                        lastMonth = W4_Funcs.addMonths(lastMonth, -shift.getRepeatAmount());
                        var shiftDayOfMonth = startTime.getDayOfMonth() - 1; // 1 - 31
                        var shiftXthWeek = Math.floor((shiftDayOfMonth - (shiftDayOfMonth % 7)) / 7); //0 - 3 or 4
                        var shiftDayOfWeek = startTime.getDayOfWeek() % 7;
                        var finalMonthStartDay = W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), 1, 0, 0, 0);
                        var startDayDiff = shiftDayOfWeek - finalMonthStartDay.getDayOfWeek() % 7;
                        if (startDayDiff < 0) {
                            startDayDiff += 7;
                        }
                        var lastDay3 = W4_Funcs.getAdjustedDaySameTime(finalMonthStartDay, startDayDiff + (shiftXthWeek * 7));
                        if (lastDay3.getMonthOfYear() != lastMonth.getMonthOfYear() || lastDay3.getYear() != lastMonth.getYear()) {
                            return W4_Funcs.getDSTSafeDateTime(lastMonth.getYear(), lastMonth.getMonthOfYear(), W4_Funcs.getNumDaysInMonth(lastMonth), startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                        }
                        return W4_Funcs.getDSTSafeDateTime(lastDay3, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
                }
            default: //Asset.REPEATUNIT_YEARLY:
                var day = new W4DateTime(occurence.getMillis());
                var yearsDiff = day.getYear() - startTime.getYear();
                var lastDay = new W4DateTime(startTime.getMillis());
                lastDay = W4_Funcs.addYears(lastDay, yearsDiff - shift.getRepeatAmount());
                return W4_Funcs.getDSTSafeDateTime(lastDay, startTime.getHourOfDay(), startTime.getMinuteOfHour(), startTime.getSecondOfMinute());
        }
    }

    static getPersonPasswordFromEmail(email0, function0) {
        var reffEmails = firebase.database().ref().child(MainActivity.DB_PATH_EMAILS);
        reffEmails.get().then((dataSnapshot) => {
            var idFound = false;
            var ds_val = dataSnapshot.val();
            for (const ds_key in ds_val) {
                let ds1 = ds_val[ds_key];
                var company = ds_key;
                if (!idFound) {
                    var ds_val1 = ds1;
                    for (const ds_key1 in ds_val1) {
                        let ds2 = ds_val1[ds_key1];
                        // for (let ds2 of ds1.getChildren()) {
                        var id = ds_key1;
                        var email = ds2;
                        if (email == email0) {
                            var reffPassword = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(company).child(MainActivity.DB_PATH_ASSET_PEOPLE).child(id).child(MainActivity.DB_PATH_PASSWORD);
                            reffPassword.get().then((dataSnapshot) => {
                                function0(dataSnapshot.val());
                            }).catch((error) => {
                                console.log("Failed to load person");
                                console.error(error);
                            });
                            idFound = true;
                            break;
                        }
                    }
                }
            }
        }).catch((error) => {
            console.log("Failed to load emails");
            console.error(error);
        });
    }

    static mapFromObject(obj) {
        if (obj == null)
            return null;
        var map = new Map();
        for (const [key, value] of Object.entries(obj)) {
            map.set(key, value);
        }
        return map;
    }

    static objFromMap(map) {
        if (map == null)
            return null;
        var obj = new Object();
        for (let [key, value] of map) {
            obj[key] = value;
        }
        return obj;
    }

    static createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.children to support multiple top-level nodes
        return div.firstChild;
    }

    static getElementInsideContainer(containerID, childID) {
        var elms = document.getElementById(containerID).getElementsByTagName("*");
        for (var i = 0; i < elms.length; ++i) {
            if (elms[i].id === childID) {
                return elms[i];
            }
        }
        return null;
    }

    static getElementInsideElement(ele, childID) {
        var elms = ele.getElementsByTagName("*");
        for (var i = 0; i < elms.length; ++i) {
            if (elms[i].id === childID) {
                return elms[i];
            }
        }
        return null;
    }

    static getDateTimeFromCalendarTitle(title) {
        var std = this.standardizeString(title);
        var spaceIndex = 0;
        for (var i = 0; i < std.length; ++i) {
            if (std.charAt(i) == ' ') {
                spaceIndex = i;
                var monthString = std.substring(0, i);
                var monthNum = Asset.intToMonth_lower.indexOf(monthString);
            }
        }
        var year = Number(std.substring(spaceIndex + 1, std.length));
        return new W4DateTime(year, monthNum, 1, 0, 0, 0);
    }

    static doesClassListInclude(classList, item) {
        for (var i = 0; i < classList.length; ++i) {
            if (classList[i] == item)
                return true;
        }
        return false;
    }

    static format2F(num) {
        return (Math.round(num * 100) / 100).toFixed(2);
    }

    // static getLatestMessageTimeForLocation(locationID) {
    //     var latestTime = 0;
    //     for (let message of MainActivity.theCompany.getMessageList()) {
    //         if (message.getLocationID() == locationID && message.getTime() > latestTime) {
    //             latestTime = message.getTime();
    //         }
    //     }
    //     return latestTime;
    // }

    static getNumMessageNotifications() {
        var numMessages = 0;
        for (let w4Notification of MainActivity.w4Notifications) {
            if (w4Notification.key == NotificationsManager.key_Message) {
                var message = Asset.getAssetbyId(MainActivity.theCompany.getMessageList(), w4Notification.any_id);
                if (message != null) {
                    ++numMessages;
                }
            }
        }
        return numMessages;
    }

    static removeNotification(i1) {
        var w4Notification = MainActivity.w4Notifications[i1];
        if (MainActivity.w4Notifications.length > i1 && w4Notification.key >= 0) {
            MainActivity.w4SaveState.getAppNotificationsMap().get(w4Notification.key).push(w4Notification.toObj());
            MainActivity.saveState(2);
            MainActivity.w4Notifications.splice(i1, 1);
            if (HomeActivity.homeActivity != null) {
                HomeActivity.homeActivity.populateNotificationsList();
            }
            if (ViewNotificationsListActivity.viewNotificationsListActivity != null)
                ViewNotificationsListActivity.viewNotificationsListActivity.updateList();
        }
    }

    static getHTMLSafeText(str) {
        var str2 = String(str).replace(/&/g, "&amp;");
        str2 = str2.replace(/</g, "&lt;");
        str2 = str2.replace(/>/g, "&gt;");
        str2 = str2.replace(/"/g, "&quot;");
        str2 = str2.replace(/'/g, "&apos;");
        return str2;
    }

    static decimalToColorHex(dec) {
        var str = dec.toString(16);
        if (str.length > 6) {
            str = str.substring(str.length - 6, str.length);
        } else if (str.length < 6) {
            var zeroesNeeded = 6 - str.length;
            for (var i = 0; i < zeroesNeeded; ++i)
                str = "0" + str;
        }
        return "#" + str;
    }

    static decimalToHex(dec) {
        var str = dec.toString(16);
        if (str.length > 6) {
            str = str.substring(str.length - 6, str.length);
        } else if (str.length < 6) {
            var zeroesNeeded = 6 - str.length;
            for (var i = 0; i < zeroesNeeded; ++i)
                str = "0" + str;
        }
        return str;
    }
}
