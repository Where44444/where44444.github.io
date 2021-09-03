class InspectionPlanOccurence extends InspectionPlan {

    // private boolean completed;
    // private String person_inspector_id;
    // private ArrayList<Integer> result = new ArrayList<>();
    // private ArrayList<ArrayList<Integer>> results = new ArrayList<>();

    constructor(inspectionPlan, date, completed, person_inspector_id, result, results) {
        super(inspectionPlan.getW4id(), inspectionPlan.getName(), inspectionPlan.getLocationID(), inspectionPlan.getShiftID(), inspectionPlan.getLocationSavedName(), Array.from(inspectionPlan.getArea_names()), W4_Funcs.clone2DArray(inspectionPlan.getPoints()), inspectionPlan.isTemplate());
        this.dateTime = date;
        this.completed = completed;
        this.person_inspector_id = person_inspector_id;
        this.result = result;
        this.results = results;
    }

    static fromDS(dataSnapshot) {
        var inspectionPlan = InspectionPlan.fromDS(dataSnapshot);
        var dateTime = dataSnapshot["dateTime"];
        var completed = dataSnapshot["completed"];
        var person_inspector_id = dataSnapshot["person_inspector_id"];
        var result = dataSnapshot["result"];
        var results = dataSnapshot["results"];

        if (result == null)
            result = [];
        if (results == null)
            results = [];
        return new InspectionPlanOccurence(inspectionPlan, dateTime, completed, person_inspector_id, result, results);
    }

    isCompleted() {
        return this.completed;
    }

    setCompleted(completed) {
        this.completed = completed;
    }

    getPerson_inspector_id() {
        return this.person_inspector_id;
    }

    setPerson_inspector_id(person_inspector_id) {
        this.person_inspector_id = person_inspector_id;
    }

    getResult() {
        return this.result;
    }

    setResult(result) {
        this.result = result;
    }

    getResults() {
        return this.results;
    }

    setResults(results) {
        this.results = results;
    }

    static compareTo(a, o) {
        if (a.getDateTime() < o.getDateTime()) {
            return -1;
        }
        if (a.getDateTime() > o.getDateTime()) {
            return 1;
        }
        return 0;
    }
}
