class TaskSheetOccurence extends TaskSheet {
    //  ArrayList<Long> timesCompleted; //Day and time that task was completed
    //  Long startedDateTime;
    //  Long updatedDateTime;
    //  boolean completed;
    //  String personID;
    //  String taskTemplateID;

    constructor(taskSheet, timesCompleted, startedDateTime, updatedDateTime, completed, personID) {
        super(taskSheet);
        this.timesCompleted = timesCompleted;
        this.startedDateTime = startedDateTime;
        this.updatedDateTime = updatedDateTime;
        this.completed = completed;
        this.personID = personID;
        this.taskTemplateID = taskSheet.getW4id();
    }


    static fromDS(dataSnapshot) {
        var taskSheet = TaskSheet.fromDS(dataSnapshot);
        var timesCompleted = dataSnapshot["timesCompleted"];
        var startedDateTime = dataSnapshot["startedDateTime"];
        var updatedDateTime = dataSnapshot["updatedDateTime"];
        var completed = dataSnapshot["completed"];
        var personID = dataSnapshot["personID"];

        if (timesCompleted == null)
            timesCompleted = [];

        return new TaskSheetOccurence(taskSheet, timesCompleted, startedDateTime, updatedDateTime, completed, personID);
    }

    getTimesCompleted() {
        return this.timesCompleted;
    }

    setTimesCompleted(timesCompleted) {
        this.timesCompleted = timesCompleted;
    }

    getStartedDateTime() {
        return this.startedDateTime;
    }

    setStartedDateTime(startedDateTime) {
        this.startedDateTime = startedDateTime;
    }

    getUpdatedDateTime() {
        return this.updatedDateTime;
    }

    setUpdatedDateTime(updatedDateTime) {
        this.updatedDateTime = updatedDateTime;
    }

    isCompleted() {
        return this.completed;
    }

    setCompleted(completed) {
        this.completed = completed;
    }

    getPersonID() {
        return this.personID;
    }

    setPersonID(personID) {
        this.personID = personID;
    }

    getTaskTemplateID() {
        return this.taskTemplateID;
    }

    setTaskTemplateID(taskTemplateID) {
        this.taskTemplateID = taskTemplateID;
    }


    compareTo(a, o) {
        if (a.getUpdatedDateTime() < o.getUpdatedDateTime()) {
            return -1;
        }
        if (a.getUpdatedDateTime() > o.getUpdatedDateTime()) {
            return 1;
        }
        return 0;
    }

    trimUncommonTasks(timeStarted) {
        for (var i = this.getRepeatAmount().length - 1; i >= 0; --i) {
            if (this.getRepeatAmount()[i] > 0 && !W4_Funcs.doesRepeatingDateStartTimeOccurOnDay(this, timeStarted, i)) {
                this.getTasks().splice(i, 1);
                this.getSubTasks().splice(i, 1);
                this.getDurations().splice(i, 1);
                this.getTimesCompleted().splice(i, 1);
            }
        }
    }

    clearRepetitionInfo() {
        this.setRepeatAmount(null);
        this.setRepeatUnit(null);
        this.setEndUnit(null);
        this.setRepeatEndOccurences(null);
        this.setRepeatEndDate(null);
        this.setWeeklyRepeatDays(null);
        this.setMonthlyRepeatType(null);
    }

    method_findMainTaskTimes() {
        var dt_times = [];
        for (let duration of this.getDurations()) {
            if (dt_times.length == 0) {
                dt_times.push(this.getStartedDateTime() + TimeUnit.MINUTES.toMillis(duration));
            }
            else {
                dt_times.push(dt_times[dt_times.length - 1] + TimeUnit.MINUTES.toMillis(duration));
            }
        }
        return dt_times;
    }

    method_howLongDidTaskTake(i) {
        if (i < this.timesCompleted.length) {
            var prevTime = null;
            if (i == 0) {
                prevTime = new W4DateTime(this.getStartedDateTime());
            } else {
                if (this.timesCompleted.length > i - 1 && this.timesCompleted[i - 1] != -1) {
                    prevTime = new W4DateTime(this.timesCompleted[i - 1]);
                } else {
                    prevTime = new W4DateTime(this.getStartedDateTime());
                }
            }
            var currentTime = new W4DateTime(this.timesCompleted[i]);
            var minutesDiff = TimeUnit.MILLISECONDS.toMinutes(currentTime.getMillis() - prevTime.getMillis());
            return Math.round(minutesDiff);
        }
        return -1;
    }

    method_wasTaskCompletedOnTime(i) {
        var durations = this.getDurations();
        if (i < durations.length && i < this.timesCompleted.length) {
            var minutesDiff = this.method_howLongDidTaskTake(i);
            return minutesDiff <= durations[i];
        } else
            return false;
    }

    method_getTasksCompletedOnTime() {
        var results = [];
        var goals_met = 0;
        for (var m = 0; m < this.timesCompleted.length; ++m) {
            var onTime = this.method_wasTaskCompletedOnTime(m);
            if (onTime)
                ++goals_met;
            results.push(onTime);
        }
        return [results, goals_met];
    }

    method_getNumTasksCompletedOnTime() {
        var results = this.method_getTasksCompletedOnTime();
        return results[1];
    }
}
