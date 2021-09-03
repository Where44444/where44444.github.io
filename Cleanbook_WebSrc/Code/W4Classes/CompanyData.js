class CompanyData extends Asset {
    // String name;
    // String email;
    // boolean trialPeriod;
    // long trialEnd;
    // boolean blacklisted;
    // boolean tasksEnabled;

    constructor(a, b, c, d, e, f, g) {
        if (a === undefined) {
            super(MainActivity.theCompany.getId());
            this.constructor0();
        } else {
            super(a);
            this.constructor1(a, b, c, d, e, f, g);
        }
    }

    constructor0() {
        this.name = "";
        this.email = "";
        this.trialPeriod = false;
        this.trialEnd = 0;
        this.blacklisted = false;
        this.tasksEnabled = true;
    }

    constructor1(id, name, email, trialPeriod, trialEnd, blacklisted, tasksEnabled) {
        this.name = name;
        this.email = email;
        this.trialPeriod = trialPeriod;
        this.trialEnd = trialEnd;
        this.blacklisted = blacklisted;
        this.tasksEnabled = tasksEnabled;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var name = dataSnapshot["name"];
        var email = dataSnapshot["email"];
        var trialPeriod = dataSnapshot["trialPeriod"];
        var trialEnd = dataSnapshot["trialEnd"];
        var blacklisted = dataSnapshot["blacklisted"];
        var tasksEnabled = dataSnapshot["tasksEnabled"];
        return new CompanyData(w4id, name, email, trialPeriod, trialEnd, blacklisted, tasksEnabled);
    }

    getName() {
        return this.name;
    }

    setName(name0) {
        this.name = name0;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    isTrialPeriod() {
        return this.trialPeriod;
    }

    setTrialPeriod(trialPeriod) {
        this.trialPeriod = trialPeriod;
    }

    getTrialEnd() {
        return this.trialEnd;
    }

    setTrialEnd(trialEnd) {
        this.trialEnd = trialEnd;
    }

    isBlacklisted() {
        return this.blacklisted;
    }

    setBlacklisted(blacklisted) {
        this.blacklisted = blacklisted;
    }

    isTasksEnabled() {
        return this.tasksEnabled;
    }

    setTasksEnabled(tasksEnabled) {
        this.tasksEnabled = tasksEnabled;
    }
}
