class SpinnerSortItem {
    // String name;
    // String id;
    // Shift shift;

    constructor(name, id, shift) {
        this.name = name;
        this.id = id;
        this.shift = shift;
    }

    getName() {
        return this.name;
    }

    setName(name0) {
        this.name = name0;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getShift() {
        return this.shift;
    }

    setShift(shift) {
        this.shift = shift;
    }

    static compareTo(a, o) {
        if (a.getName() < o.getName()) {
            return -1;
        }
        if (a.getName() > o.getName()) {
            return 1;
        }
        return 0;
    }
}
