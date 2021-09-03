class Person extends Asset {

    //  String first_name;
    //  String last_name;
    //  String phone;
    //  String email;
    //  String password;
    //  int type;

    // var readPermissions = {
    //     {
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //     }
    // };
    // var writePermissions = {
    //     {
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //         add(false);
    //     }
    // };

    //  boolean requiringGPSClockIn;
    // var clockedIn = false;

    constructor(w4id, first_name, last_name, phone, email, password, type, readPermissions, writePermissions, requiringGPSClockIn, clockedIn) {
        super(w4id);
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.type = type;
        this.readPermissions = readPermissions;
        this.writePermissions = writePermissions;
        this.requiringGPSClockIn = requiringGPSClockIn;
        this.clockedIn = clockedIn;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var first_name = dataSnapshot["first_name"];
        var last_name = dataSnapshot["last_name"];
        var phone = dataSnapshot["phone"];
        var email = dataSnapshot["email"];
        var password = dataSnapshot["password"];
        var type = dataSnapshot["type"];
        var readPermissions = dataSnapshot["readPermissions"];
        var writePermissions = dataSnapshot["writePermissions"];
        var requiringGPSClockIn = dataSnapshot["requiringGPSClockIn"];
        var clockedIn = dataSnapshot["clockedIn"];

        if (readPermissions == null) {
            readPermissions = W4_Funcs.getAllFalsePermissions();
            MainActivity.w4Toast(null, first_name + " " + last_name + "'s profile is missing information about their read permissions. All their permissions have been revoked.", Toast.LENGTH_LONG);
        }
        if (writePermissions == null) {
            writePermissions = W4_Funcs.getAllFalsePermissions();
            MainActivity.w4Toast(null, first_name + " " + last_name + "'s profile is missing information about their write permissions. All their permissions have been revoked.", Toast.LENGTH_LONG);
        }

        return new Person(w4id, first_name, last_name, phone, email, password, type, readPermissions, writePermissions, requiringGPSClockIn, clockedIn);
    }

    getFirst_name() {
        return this.first_name;
    }

    setFirst_name(first_name) {
        this.first_name = first_name;
    }

    getLast_name() {
        return this.last_name;
    }

    setLast_name(last_name) {
        this.last_name = last_name;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getReadPermissions() {
        return this.readPermissions;
    }

    setReadPermissions(readPermissions) {
        this.readPermissions = readPermissions;
    }

    getWritePermissions() {
        return this.writePermissions;
    }

    setWritePermissions(writePermissions) {
        this.writePermissions = writePermissions;
    }

    isRequiringGPSClockIn() {
        return this.requiringGPSClockIn;
    }

    setRequiringGPSClockIn(requiringGPSClockIn) {
        this.requiringGPSClockIn = requiringGPSClockIn;
    }

    isClockedIn() {
        return this.clockedIn;
    }

    setClockedIn(clockedIn) {
        this.clockedIn = clockedIn;
    }


    static compareTo(a, o) {
        if (a.getLast_name() < o.getLast_name()) {
            return -1;
        }
        if (a.getLast_name() > o.getLast_name()) {
            return 1;
        }
        return 0;
    }

    canSeeNotifications() {
        return this.type == Asset.OWNER || this.type == Asset.MANAGER || this.type == Asset.SUPERVISOR;
    }

    canSeeEmployeeStatuses() {
        return this.type == Asset.OWNER || this.type == Asset.MANAGER || this.type == Asset.SUPERVISOR;
    }

    canExportReports() {
        return this.type == Asset.OWNER || this.type == Asset.MANAGER;
    }


    method_searchString() {
        return this.last_name + " " + this.first_name;
    }

    method_getInitials() {
        var first = "";
        var last = "";
        if (this.first_name != null && this.first_name.length > 0)
            first = this.first_name[0];
        if (this.last_name != null && this.last_name.length > 0)
            last = this.last_name[0];
        return (first + last).toUpperCase();
    }
}
