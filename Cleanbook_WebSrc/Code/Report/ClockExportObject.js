class ClockExportObject {
    // var shift = null;
    // var timePunch = null;
    // var time = null;
    // var start = false;
    // var location = null;

    constructor(shift, timePunch, time, start, location) {
        this.shift = shift;
        this.timePunch = timePunch;
        this.time = time;
        this.start = start;
        this.location = location;
    }

    
    static compareTo(a, o) {
        if(a.time.getMillis() < o.time.getMillis()){
            return -1;
        }
        if(a.time.getMillis() > o.time.getMillis()){
            return 1;
        }
        return 0;
    }
}
