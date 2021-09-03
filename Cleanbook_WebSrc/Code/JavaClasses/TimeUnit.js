class TimeUnit {
    static daysToMillis = 24 * 60 * 60 * 1000;
    static daysToMinutes = 24 * 60;
    static daysToHours = 24;

    static hoursToMillis = 60 * 60 * 1000;
    static hoursToMinutes = 60;
    static hoursToDays = 1 / 24;

    static minutesToMillis = 60 * 1000;
    static minutesToHours = 1 / 60;
    static minutesToDays = 1 / (24 * 60);

    static millisToMinutes = 1 / (60 * 1000);
    static millisToHours = 1 / (60 * 60 * 1000);
    static millisToDays = 1 / (24 * 60 * 60 * 1000);

    static DAYS = new TimeUnitType(TimeUnit.daysToMillis, TimeUnit.daysToMinutes, TimeUnit.daysTohours, 1);
    static HOURS = new TimeUnitType(TimeUnit.hoursToMillis, TimeUnit.hoursToMinutes, 1, TimeUnit.hoursToDays);
    static MINUTES = new TimeUnitType(TimeUnit.minutesToMillis, 1, TimeUnit.minutesToHours, TimeUnit.minutesToDays);
    static MILLISECONDS = new TimeUnitType(1, TimeUnit.millisToMinutes, TimeUnit.millisToHours, TimeUnit.millisToDays);
}