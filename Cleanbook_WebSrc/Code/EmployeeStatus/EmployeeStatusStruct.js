class EmployeeStatusStruct extends Asset {

    constructor(person, shift, location) {
        super();
        this.person = person;
        this.shift = shift;
        this.location = location;
    }


    static compareTo(a, o) {
        if (a.person.getLast_name() < o.person.getLast_name()) {
            return -1;
        }
        if (a.person.getLast_name() > o.person.getLast_name()) {
            return 1;
        }
        return 0;
    }

    method_searchString() {
        return this.person.getLast_name() + " " + this.person.getFirst_name();
    }
}
