class Deletions {

    static deletePersonFromShifts(personID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getShiftList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        for (let asset of list) {
            var shift = asset;
            if (shift.getPersonIDList() != null && shift.getPersonIDList().includes(personID)) {
                var index = shift.getPersonIDList().indexOf(personID);
                shift.getPersonIDList().splice(index, 1);
                var reffShift = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SHIFTS).child(shift.getW4id());
                W4_Funcs.writeToDB(reffShift, shift, "Person removed from shift |Person:" + W4_DBLog.getPersonStringForLog(personID) + "|Shift:" + shift.getName() + "|Location" + W4_DBLog.getLocationStringForLog(shift.getLocationID()) + "|");
            }
        }
    }

    static deleteTimePunches_withPerson(personID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getTimePunchList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        var deletedIDs = [];
        for (let asset of list) {
            var timePunch = asset;
            if (timePunch.getPersonID() == (personID)) {
                if (!deletedIDs.includes(timePunch.getW4id()))
                    deletedIDs.push(timePunch.getW4id());
                var reffTimePunch = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).child(timePunch.getW4id());
                W4_Funcs.deleteFromDB(reffTimePunch, "Deleted time punch from deleting person |Person:" + W4_DBLog.getPersonStringForLog(timePunch.getPersonID()) + "|Location:" + W4_DBLog.getLocationStringForLog(timePunch.getLocationID()) + "|");
            }
        }
        W4_Funcs.setPersonClockInStatusFromTimePunches(personID, null, deletedIDs);
    }

    static deleteTimePunches_withLocation(locationID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getTimePunchList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        var personIDs = [];
        var deletedIDs = [];
        for (let asset of list) {
            var timePunch = asset;
            if (timePunch.getLocationID() == (locationID)) {
                if (!personIDs.includes(timePunch.getPersonID()))
                    personIDs.push(timePunch.getPersonID());
                if (!deletedIDs.includes(timePunch.getW4id()))
                    deletedIDs.push(timePunch.getW4id());
                var reffTimePunch = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).child(timePunch.getW4id());
                W4_Funcs.deleteFromDB(reffTimePunch, "Deleted time punch from deleting location |Person:" + W4_DBLog.getPersonStringForLog(timePunch.getPersonID()) + "|Location:" + W4_DBLog.getLocationStringForLog(timePunch.getLocationID()) + "|");
            }
        }
        for (let id of personIDs) {
            W4_Funcs.setPersonClockInStatusFromTimePunches(id, null, deletedIDs);
        }
    }

    static deleteTimePunches_withShift(shiftID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getTimePunchList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        var personIDs = [];
        var deletedIDs = [];
        for (let asset of list) {
            var timePunch = asset;
            if (timePunch.getShiftID() == (shiftID)) {
                if (!personIDs.includes(timePunch.getPersonID()))
                    personIDs.push(timePunch.getPersonID());
                if (!deletedIDs.includes(timePunch.getW4id()))
                    deletedIDs.push(timePunch.getW4id());
                var reffTimePunch = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TIME_PUNCHES).child(timePunch.getW4id());
                W4_Funcs.deleteFromDB(reffTimePunch, "Deleted time punch from deleting shift |Person:" + W4_DBLog.getPersonStringForLog(timePunch.getPersonID()) + "|Location:" + W4_DBLog.getLocationStringForLog(timePunch.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(timePunch.getShiftID()) + "|");
            }
        }
        for (let id of personIDs) {
            W4_Funcs.setPersonClockInStatusFromTimePunches(id, null, deletedIDs);
        }
    }

    static deleteShifts_withLocation(locationID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getShiftList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        for (let asset of list) {
            var shift = asset;
            if (shift.getLocationID() == (locationID)) {
                var reffShift = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SHIFTS).child(shift.getW4id());
                W4_Funcs.deleteFromDB(reffShift, "Deleted shift from deleting location " + shift.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(shift.getLocationID()) + "|");
            }
        }
    }

    static deleteSupplies_withLocation(locationID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getSupplyItemList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        for (let asset of list) {
            var supplyItem = asset;
            if (supplyItem.getLocationID() == (locationID)) {
                Deletions.deleteSupplyItem(supplyItem);
            }
        }
    }

    static deleteInspectionPlans_withLocation(locationID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getInspectionPlanList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        for (let asset of list) {
            var inspectionPlan = asset;
            if (inspectionPlan.getLocationID() == (locationID)) {
                var reffInspectionPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS).child(inspectionPlan.getW4id());
                W4_Funcs.deleteFromDB(reffInspectionPlan, "Deleted inspection plan from location " + inspectionPlan.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(inspectionPlan.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(inspectionPlan.getShiftID()) + "|");
            }
        }
    }

    static deleteInspectionPlans_withShift(shiftID) {
        var list = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getInspectionPlanList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        for (let asset of list) {
            var inspectionPlan = asset;
            if (inspectionPlan.getShiftID() == (shiftID)) {
                var reffInspectionPlan = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_INSPECTION_PLANS).child(inspectionPlan.getW4id());
                W4_Funcs.deleteFromDB(reffInspectionPlan, "Deleted inspection plan from shift " + inspectionPlan.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(inspectionPlan.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(inspectionPlan.getShiftID()) + "|");
            }
        }
    }

    static deleteTaskSheets_withShifts(shiftIDs) {
        var tasks = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getTaskSheetList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        for (let asset of tasks) {
            var taskSheet = asset;
            if (shiftIDs.includes(taskSheet.getShiftID())) {
                var reffTask = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS).child(taskSheet.getW4id());
                W4_Funcs.deleteFromDB(reffTask, "Deleted task sheet from shifts " + taskSheet.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(taskSheet.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(taskSheet.getShiftID()) + "|");
            }
        }
    }

    static deleteTaskSheetOccurences(shiftIDs, personID) {
        var tasks1 = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getTaskSheetInProgressList()); //Ensures that list we're deleting from isn't modified as firebase deletes references
        var tasks2 = W4_Funcs.copyAssetReferences(MainActivity.theCompany.getTaskSheetCompletedList());
        tasks1 = tasks1.concat(tasks2);

        for (let asset of tasks1) {
            var taskSheetOccurence = asset;
            if (shiftIDs != null) {
                if (shiftIDs.includes(taskSheetOccurence.getShiftID())) {
                    var reffTaskOccurence = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE).child(taskSheetOccurence.getW4id());
                    W4_Funcs.deleteFromDB(reffTaskOccurence, "Deleted task sheet occurence from shift " + taskSheetOccurence.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(taskSheetOccurence.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(taskSheetOccurence.getShiftID()) + "|Person:" + W4_DBLog.getPersonStringForLog(taskSheetOccurence.getPersonID()) + "|");
                }
            } else if (personID != null) {
                if (taskSheetOccurence.getPersonID() == (personID)) {
                    var reffTaskOccurence = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_TASKS_OCCURENCE).child(taskSheetOccurence.getW4id());
                    W4_Funcs.deleteFromDB(reffTaskOccurence, "Deleted task sheet occurence from person " + taskSheetOccurence.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(taskSheetOccurence.getLocationID()) + "|Shift:" + W4_DBLog.getShiftStringForLog(taskSheetOccurence.getShiftID()) + "|Person:" + W4_DBLog.getPersonStringForLog(taskSheetOccurence.getPersonID()) + "|");
                }
            }
        }
    }


    //Individuals
    static deleteSupplyItem(supplyItem) {
        if (supplyItem.isTemplate()) {
            for (let supplyItem1 of MainActivity.theCompany.getSupplyItemList()) {
                if (supplyItem1.getTemplateID() == (supplyItem.getW4id())) {
                    supplyItem1.setTemplateID("");
                    var reff = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).child(supplyItem1.getW4id());
                    W4_Funcs.writeToDB(reff, supplyItem1, "Deleted supply item template ID " + supplyItem1.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(supplyItem1.getLocationID()) + "|");
                }
            }
        }
        var reffSupplyItem = firebase.database().ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SUPPLY_ITEMS).child(supplyItem.getW4id());
        W4_Funcs.deleteFromDB(reffSupplyItem, "Deleted supply item " + supplyItem.getName() + "|Location:" + W4_DBLog.getLocationStringForLog(supplyItem.getLocationID()) + "|");
        var listRef = MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SDS).child(supplyItem.getW4id());
        console.log(supplyItem.getW4id());
        listRef.listAll()
            .then((res) => {
                res.items.forEach((itemRef) => {
                    MainActivity.firebaseStorage.ref().child(MainActivity.DB_PATH_COMPANIES).child(MainActivity.theCompany.getId()).child(MainActivity.DB_PATH_ASSET_SDS).child(supplyItem.getW4id()).child(itemRef.name).delete();
                })
            });
    }
}
