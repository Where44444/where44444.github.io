class InspectionPlan extends Asset {
    // private String name = "";
    // private String locationID = "";
    // private String shiftID = "";
    // private String locationSavedName = "";
    // protected long dateTime = 0; //Only used by InspectionPlanOccurence!
    // private ArrayList<String> area_names = new ArrayList<>();
    // private ArrayList<ArrayList<String>> points = new ArrayList<>();
    // private boolean template = false;

    constructor(a, b, c, d, e, f, g, h) {
        if (a === undefined) {
            super("");
            this.constructor0();
        }
        else if (b === undefined) {
            super(a.w4id);
            this.constructor1(a);
        } else {
            super(a);
            this.constructor2(a, b, c, d, e, f, g, h);
        }
    }

    constructor0() {
        this.name = "";
        this.locationID = "";
        this.shiftID = "";
        this.locationSavedName = "";
        this.dateTime = 0;
        this.area_names = [];
        this.points = [];
        this.template = false;
    }

    constructor1(plan) {
        this.constructor2(plan.getW4id(), plan.getName(), plan.getLocationID(), plan.getShiftID(), plan.getLocationSavedName(), Array.from(plan.getArea_names()), W4_Funcs.clone2DArray(plan.getPoints()), plan.isTemplate());
    }

    constructor2(id, name0, locationID, shiftID, locationSavedName, area_names, points, template) {
        this.name = name0;
        this.locationID = locationID;
        this.shiftID = shiftID;
        this.locationSavedName = locationSavedName;
        this.area_names = area_names;
        this.points = points;
        this.template = template;
    }

    static fromDS(dataSnapshot) {
        var w4id = dataSnapshot["w4id"];
        var name = dataSnapshot["name"];
        var locationID = dataSnapshot["locationID"];
        var shiftID = dataSnapshot["shiftID"];
        var locationSavedName = dataSnapshot["locationSavedName"];
        var area_names = dataSnapshot["area_names"];
        var points = dataSnapshot["points"];
        var template = dataSnapshot["template"];

        if (area_names == null)
            area_names = [];
        if (points == null)
            points = [];
        return new InspectionPlan(w4id, name, locationID, shiftID, locationSavedName, area_names, points, template);
    }

    getName() {
        return this.name;
    }

    setName(name0) {
        this.name = name0;
    }

    getLocationID() {
        return this.locationID;
    }

    setLocationID(locationID) {
        this.locationID = locationID;
    }

    getShiftID() {
        return this.shiftID;
    }

    setShiftID(shiftID) {
        this.shiftID = shiftID;
    }

    getLocationSavedName() {
        return this.locationSavedName;
    }

    setLocationSavedName(locationSavedName) {
        this.locationSavedName = locationSavedName;
    }

    getDateTime() {
        return this.dateTime;
    }

    setDateTime(dateTime) {
        this.dateTime = dateTime;
    }

    getArea_names() {
        return this.area_names;
    }

    setArea_names(area_names) {
        this.area_names = area_names;
    }

    getPoints() {
        return this.points;
    }

    setPoints(points) {
        this.points = points;
    }

    isTemplate() {
        return this.template;
    }

    setTemplate(template) {
        this.template = template;
    }


    static compareTo(a, o) {
        if (a.getLocationSavedName() < o.getLocationSavedName()) {
            return -1;
        }
        if (a.getLocationSavedName() > o.getLocationSavedName()) {
            return 1;
        }
        return 0;
    }


    method_searchString() {
        return this.name + " " + locationSavedName;
    }


    method_getTemplateName() {
        return this.name;
    }
}
