class TaskExportObject {
    // var shift = null;
    // var task = null;
    // var time = null;
    // var location = null;

    constructor(shift, task, time, location) {
        this.shift = shift;
        this.task = task;
        this.time = time;
        this.location = location;
    }

    
    compareTo(a, o) {
        if(a.time.getMillis() < o.time.getMillis()){
            return -1;
        }
        if(a.time.getMillis() > o.time.getMillis()){
            return 1;
        }
        return 0;
    }
}
