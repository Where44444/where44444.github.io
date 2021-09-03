class TheCompany {
    //      String name;
    //      String id;
    //     var locationList = [];
    //     var messageList = [];
    //     var taskSheetList = [];
    //     var taskSheetInProgressList = [];
    //     var taskSheetCompletedList = [];
    //     var personList = [];
    //     var shiftList = [];
    //     var timePunchList = [];
    //     var inspectionPlanList = [];
    //     var inspectionPlansInProgressList = [];
    //     var inspectionPlansCompletedList = [];
    //     var supplyItemList = [];
    // var taskSheetTemplateList = [];
    //     var inspectionPlanTemplateList = [];
    //     var supplyItemTemplateList = [];

    constructor(a, b) {
        if (a === undefined) {
            this.constructor0();
        } else {
            this.constructor1(a, b);
        }
    }

    constructor0() {
        this.name = "";
        this.id = "";
        this.locationList = [];
        this.messageList = [];
        this.taskSheetList = [];
        this.taskSheetInProgressList = [];
        this.taskSheetCompletedList = [];
        this.personList = [];
        this.shiftList = [];
        this.timePunchList = [];
        this.inspectionPlanList = [];
        this.inspectionPlansInProgressList = [];
        this.inspectionPlansCompletedList = [];
        this.supplyItemList = [];
        this.taskSheetTemplateList = [];
        this.inspectionPlanTemplateList = [];
        this.supplyItemTemplateList = [];
    }

    constructor1(name, id) {
        this.name = name;
        this.id = id;
        this.locationList = [];
        this.messageList = [];
        this.taskSheetList = [];
        this.taskSheetInProgressList = [];
        this.taskSheetCompletedList = [];
        this.personList = [];
        this.shiftList = [];
        this.timePunchList = [];
        this.inspectionPlanList = [];
        this.inspectionPlansInProgressList = [];
        this.inspectionPlansCompletedList = [];
        this.supplyItemList = [];
        this.taskSheetTemplateList = [];
        this.inspectionPlanTemplateList = [];
        this.supplyItemTemplateList = [];
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

    getLocationList() {
        return this.locationList;
    }

    setLocationList(locationList) {
        this.locationList = locationList;
    }

    getMessageList() {
        return this.messageList;
    }

    setMessageList(messageList) {
        this.messageList = messageList;
    }

    getPersonList() {
        return this.personList;
    }

    setPersonList(personList) {
        this.personList = personList;
    }

    getShiftList() {
        return this.shiftList;
    }

    setShiftList(shiftList) {
        this.shiftList = shiftList;
    }

    getTimePunchList() {
        return this.timePunchList;
    }

    setTimePunchList(timePunchList) {
        this.timePunchList = timePunchList;
    }

    getInspectionPlanList() {
        return this.inspectionPlanList;
    }

    setInspectionPlanList(inspectionPlanList) {
        this.inspectionPlanList = inspectionPlanList;
    }

    getInspectionPlansInProgressList() {
        return this.inspectionPlansInProgressList;
    }

    setInspectionPlansInProgressList(inspectionPlansInProgressList) {
        this.inspectionPlansInProgressList = inspectionPlansInProgressList;
    }

    getInspectionPlansCompletedList() {
        return this.inspectionPlansCompletedList;
    }

    setInspectionPlansCompletedList(inspectionPlansCompletedList) {
        this.inspectionPlansCompletedList = inspectionPlansCompletedList;
    }

    getSupplyItemList() {
        return this.supplyItemList;
    }

    setSupplyItemList(supplyItemList) {
        this.supplyItemList = supplyItemList;
    }

    getTaskSheetList() {
        return this.taskSheetList;
    }

    setTaskSheetList(taskSheetList) {
        this.taskSheetList = taskSheetList;
    }

    getTaskSheetInProgressList() {
        return this.taskSheetInProgressList;
    }

    setTaskSheetInProgressList(taskSheetInProgressList) {
        this.taskSheetInProgressList = taskSheetInProgressList;
    }

    getTaskSheetCompletedList() {
        return this.taskSheetCompletedList;
    }

    setTaskSheetCompletedList(taskSheetCompletedList) {
        this.taskSheetCompletedList = taskSheetCompletedList;
    }

    getTaskSheetTemplateList() {
        return this.taskSheetTemplateList;
    }

    setTaskSheetTemplateList(taskSheetTemplateList) {
        this.taskSheetTemplateList = taskSheetTemplateList;
    }

    getInspectionPlanTemplateList() {
        return this.inspectionPlanTemplateList;
    }

    setInspectionPlanTemplateList(inspectionPlanTemplateList) {
        this.inspectionPlanTemplateList = inspectionPlanTemplateList;
    }

    getSupplyItemTemplateList() {
        return this.supplyItemTemplateList;
    }

    setSupplyItemTemplateList(supplyItemTemplateList) {
        this.supplyItemTemplateList = supplyItemTemplateList;
    }

    getTotalSuppliesRequested() {
        var total = 0;
        for (let item of W4_Funcs.getPermittedSuppliesList()) {
            total += item.getAmountRequested();
        }
        return total;
    }
}
