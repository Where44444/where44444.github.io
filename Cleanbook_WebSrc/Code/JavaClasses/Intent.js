class Intent {
    static FLAG_ACTIVITY_CLEAR_TOP = 1;
    static FLAG_ACTIVITY_NEW_TASK = 2;
    static FLAG_ACTIVITY_CLEAR_HOME = 3;

    constructor(activity1, activity2) {
        this.activity1 = activity1;
        this.activity2 = activity2;
        this.map = new Map();
        this.isMain = false;
    }

    putExtra(key, value) {
        this.map.set(key, value);
    }

    getStringExtra(key) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return null;
    }

    getIntExtra(key, default0) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return default0;
    }

    getBooleanExtra(key, default0) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return default0;
    }

    addFlags(flags) {
        this.flags = flags;
    }

    setFlags(flags) {
        this.flags = flags;
    }

    getLongExtra(key, default0) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        return default0;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }
}