class Exports {
    static exportHoursCount(byPerson, personID_To_dateAndHoursMap, selectedPerson, selectedLocation, startDay, endDay, activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var html1 = "";
            for (let [key, dhs] of personID_To_dateAndHoursMap) {
                var person = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), key);
                if (person != null && dhs.length > 0) {
                    html1 += "<b>------" + person.getFirst_name() + " " + person.getLast_name() + "------<b>";
                    var total = 0;
                    for (let dh1 of dhs) {
                        var location = null;
                        if (byPerson)
                            location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), dh1.locationID);
                        total += dh1.hours100;
                        html1 += "<br>" + W4_Funcs.getNumbersDayText(dh1.time, " / ", true) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + W4_Funcs.format2F(dh1.hours100 / 100);
                        if (location != null)
                            html1 += " (" + location.getName() + ")";
                    }
                    html1 += "<br>Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + W4_Funcs.format2F(total / 100) + "<br><br><br>";
                }
            }

            var subject;
            if (byPerson)
                subject = selectedPerson.getFirst_name() + " " + selectedPerson.getLast_name() + " Hours " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);
            else
                subject = selectedLocation.getName() + " Hours " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);

            W4_Funcs.startEmail(html1, subject, activity);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static exportClockSummary(byPerson, selectedPerson, selectedLocation, startDay, endDay, activity) {
        // Makes date header if:
        //  Shift occurred that day
        //      or
        //  Has time punch for shift that day

        //for loop of people
        //for loop of dates
        //{
        //get list of time punches for that day
        //get list of shift starts and ends for that day
        //if time punch exists for shift end or start, don't add shift to list
        //add all to list of exportObjects
        //sort exportObjects by time
        //add exportObjects to html0
        //}
        if (MainActivity.currentPerson.canExportReports()) {
            var personList;
            var shiftList;
            if (byPerson) {
                personList = [];
                personList.push(selectedPerson);
                shiftList = W4_Funcs.getAssignedShifts(selectedPerson.getW4id());
            } else {
                personList = W4_Funcs.getAssignedPeople(selectedLocation.getW4id());
                shiftList = W4_Funcs.getShiftsForLocation(selectedLocation.getW4id());
            }

            shiftList.sort(Shift.compareTo);
            var shiftStartDTList = [];
            var shiftEndDTList = [];
            var shiftLocationList = [];
            for (let shift of shiftList) {
                shiftStartDTList.push(new W4DateTime(shift.getStartTime()));
                shiftEndDTList.push(new W4DateTime(shift.getEndTime()));
                shiftLocationList.push(Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID()));
            }
            var html0 = "";
            for (let person of personList) {
                html0 += "<b>------" + person.getFirst_name() + " " + person.getLast_name() + "------</b><br>";
                var day = W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0);
                var end = W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0);
                var timePunch_List = W4_Funcs.getTimePunchesForPerson(person.getW4id(), day.getMillis(), W4_Funcs.getNextDay(end).getMillis(), null);
                var timePunch_DTList = [];
                for (let timePunch of timePunch_List) {
                    timePunch_DTList.push(new W4DateTime(timePunch.getTime()));
                }
                while (day.getMillis() <= end.getMillis()) {
                    var objs = [];
                    for (var i = 0; i < timePunch_List.length; ++i) {
                        var timePunch = timePunch_List[i];
                        var timePunchDT = timePunch_DTList[i];
                        if (W4_Funcs.isSameDay(timePunchDT, day)) {
                            var location = W4_Funcs.getLocationFromShiftID(timePunch.getShiftID());
                            objs.push(new ClockExportObject(null, timePunch, timePunchDT, timePunch.getClockIn(), location));
                        }
                    }
                    var shiftsForOBJS = [];
                    for (var i = 0; i < shiftList.length; ++i) {
                        var shift = shiftList[i];
                        var shiftLocation = shiftLocationList[i];
                        var shiftStartTime = shiftStartDTList[i];
                        var shiftEndTime = shiftEndDTList[i];
                        var shiftStartTimeDay = W4_Funcs.getDSTSafeDateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                        var shiftEndTimeDay = W4_Funcs.getDSTSafeDateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                        var occupyType = W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, day, false, 0);
                        var occupyTypeYesterday = W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, W4_Funcs.getPrevDay(day), false, 0);
                        var goesOvernight = shift.method_doesShiftGoOvernight();
                        var shiftEndsFirstDay = !goesOvernight && (occupyType == Shift.OCCURS_FIRST_DAY || occupyType == Shift.OCCURS_TWICE_SAME_SLOT);
                        var shiftEndsSecondDay = goesOvernight && (occupyTypeYesterday == Shift.OCCURS_FIRST_DAY || occupyType == Shift.OCCURS_TWICE_SAME_SLOT);
                        //If shift starts this day
                        if (occupyType == Shift.OCCURS_FIRST_DAY || occupyType == Shift.OCCURS_TWICE_SAME_SLOT) {
                            var timePunchFound = false;
                            for (let obj of objs) {
                                if (obj.timePunch.getClockIn() && obj.timePunch.getShiftID() == (shift.getW4id())) {
                                    timePunchFound = true;
                                    break;
                                }
                            }
                            if (!timePunchFound) {
                                shiftsForOBJS.push(new ClockExportObject(shift, null, shiftStartTimeDay, true, shiftLocation));
                            }
                        }
                        //If shift ends this day
                        if (shiftEndsFirstDay || shiftEndsSecondDay) {
                            var timePunchFound = false;
                            for (let obj of objs) {
                                if (!obj.timePunch.getClockIn() && obj.timePunch.getShiftID() == (shift.getW4id())) {
                                    timePunchFound = true;
                                    break;
                                }
                            }
                            if (!timePunchFound) {
                                shiftsForOBJS.push(new ClockExportObject(shift, null, shiftEndTimeDay, false, shiftLocation));
                            }
                        }
                    }
                    objs = objs.concat(shiftsForOBJS);
                    objs.sort(ClockExportObject.compareTo);
                    html0 += W4_Funcs.getNumbersDayText(day, " / ", false) + " " + Asset.intToDayOfWeek3Letter[day.getDayOfWeek()] + "<br>";
                    for (let obj of objs) {

                        if (obj.start) {
                            html0 += "IN:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                        } else {
                            html0 += "OUT: ";
                        }

                        if (obj.shift != null) { //No time punch found for shift start/end time
                            html0 += "<b>NONE</b>";
                        } else { //Time punch found
                            html0 += W4_Funcs.getTimeText(obj.time);
                            var shift = Asset.getAssetbyId(MainActivity.theCompany.getShiftList(), obj.timePunch.getShiftID());
                            if (shift != null) {
                                var shiftTime;
                                if (obj.start) {
                                    shiftTime = new W4DateTime(shift.getStartTime());
                                } else {
                                    shiftTime = new W4DateTime(shift.getEndTime());
                                }
                                if (W4_Funcs.isTimePunchLateClockIn(obj.timePunch) || W4_Funcs.isTimePunchLateClockOut(obj.timePunch)) {
                                    html0 += " <b>LATE</b>";
                                }
                            }
                        }

                        if (byPerson && obj.location != null) {
                            html0 += " (" + obj.location.getName() + ")";
                        }

                        html0 += "<br>";
                    }
                    day = W4_Funcs.getNextDay(day);
                    html0 += "<br>";
                } //END Day loop
                html0 += "<br>";
            } //END Person loop

            var subject;
            if (byPerson)
                subject = selectedPerson.getFirst_name() + " " + selectedPerson.getLast_name() + " Clock Summary " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);
            else
                subject = selectedLocation.getName() + " Clock Summary " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);

            W4_Funcs.startEmail(html0, subject, activity);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static exportTaskSummary(byPerson, selectedPerson, selectedLocation, startDay, endDay, activity) {
        // Makes date header if:
        //  Shift occurred that day
        //      or
        //  Has task occurrence for shift that day

        //for loop of people
        //for loop of dates
        //{
        //get list of tasks for that day
        //get list of shift starts and ends for that day
        //if task exists for shift, don't add shift to list
        //add all to list of exportObjects
        //sort exportObjects by time
        //add exportObjects to html0
        //}
        if (MainActivity.currentPerson.canExportReports()) {
            var personList;
            var shiftList;
            if (byPerson) {
                personList = [];
                personList.push(selectedPerson);
                shiftList = W4_Funcs.getAssignedShifts(selectedPerson.getW4id());
            } else {
                personList = W4_Funcs.getAssignedPeople(selectedLocation.getW4id());
                shiftList = W4_Funcs.getShiftsForLocation(selectedLocation.getW4id());
            }

            shiftList.sort(Shift.compareTo);
            var shiftStartDTList = [];
            var shiftEndDTList = [];
            var shiftLocationList = [];
            for (let shift of shiftList) {
                shiftStartDTList.push(new W4DateTime(shift.getStartTime()));
                shiftEndDTList.push(new W4DateTime(shift.getEndTime()));
                shiftLocationList.push(Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID()));
            }
            var html0 = "";
            for (let person of personList) {
                html0 += "<b>------" + person.getFirst_name() + " " + person.getLast_name() + "------</b><br>";
                var day = W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0);
                var end = W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0);
                var taskList = W4_Funcs.getTaskSheetOccurrencesForPerson(person.getW4id(), day.getMillis(), W4_Funcs.getNextDay(end).getMillis());
                var task_DTList = [];
                for (let task of taskList) {
                    task_DTList.push(new W4DateTime(task.getStartedDateTime()));
                }
                while (day.getMillis() <= end.getMillis()) {
                    var objs = [];
                    for (var i = 0; i < taskList.length; ++i) {
                        var task = taskList[i];
                        var taskDT = task_DTList[i];
                        if (W4_Funcs.isSameDay(taskDT, day)) {
                            var location = W4_Funcs.getLocationFromShiftID(task.getShiftID());
                            objs.push(new TaskExportObject(null, task, taskDT, location));
                        }
                    }
                    var shiftsForOBJS = [];
                    for (var i = 0; i < shiftList.length; ++i) {
                        var shift = shiftList[i];
                        var shiftLocation = shiftLocationList[i];
                        var shiftStartTime = shiftStartDTList[i];
                        var shiftEndTime = shiftEndDTList[i];
                        var shiftStartTimeDay = W4_Funcs.getDSTSafeDateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), shiftStartTime.getHourOfDay(), shiftStartTime.getMinuteOfHour(), 0);
                        var shiftEndTimeDay = W4_Funcs.getDSTSafeDateTime(day.getYear(), day.getMonthOfYear(), day.getDayOfMonth(), shiftEndTime.getHourOfDay(), shiftEndTime.getMinuteOfHour(), 0);
                        var occupyType = W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, day, false, 0);
                        //If shift starts this day
                        if (occupyType == Shift.OCCURS_FIRST_DAY || occupyType == Shift.OCCURS_TWICE_SAME_SLOT) {
                            var taskFound = false;
                            for (let obj of objs) {
                                if (obj.task.getShiftID() == (shift.getW4id())) {
                                    taskFound = true;
                                    break;
                                }
                            }
                            if (!taskFound) {
                                shiftsForOBJS.push(new TaskExportObject(shift, null, shiftStartTimeDay, shiftLocation));
                            }
                        }
                    }
                    objs = objs.concat(shiftsForOBJS);
                    objs.sort(TaskExportObject.compareTo);
                    html0 += W4_Funcs.getNumbersDayText(day, " / ", false) + " " + Asset.intToDayOfWeek3Letter[day.getDayOfWeek()] + "<br>";
                    for (let obj of objs) {
                        if (byPerson && obj.location != null) {
                            html0 += " (" + obj.location.getName() + ") ";
                        }
                        if (obj.shift != null) { //No task found for shift
                            html0 += "<b>NONE</b>";
                        } else { //Task found
                            html0 += W4_Funcs.getTimeText(obj.time);
                            var results = obj.task.method_getTasksCompletedOnTime();
                            var completes = results[0];
                            var goals_met = results[1];
                            html0 += " " + goals_met + " / " + completes.length + " On Time<br>";
                            for (var i = 0; i < completes.length; ++i) {
                                if (!completes[i]) {
                                    var dueTime = "";
                                    if (obj.task.getDurations().length > i) {
                                        var minutes = obj.task.getDurations()[i];
                                        dueTime = " (DUE in " + W4_Funcs.getHoursMinutesText(minutes) + ")";
                                    }
                                    var lateTime = "";
                                    if (obj.task.getTimesCompleted().length > i) {
                                        var timeTaken = obj.task.method_howLongDidTaskTake(i);
                                        lateTime = " (LATE " + W4_Funcs.getHoursMinutesText(timeTaken) + ")";
                                    }

                                    html0 += " <b>" + obj.task.getTasks()[i] + dueTime + lateTime + "</b><br>";
                                }
                            }
                        }

                        if (byPerson && obj.location != null) {
                            html0 += " (" + obj.location.getName() + ")";
                        }
                        html0 += "<br>";
                    }
                    day = W4_Funcs.getNextDay(day);
                    html0 += "<br>";
                } //END Day loop
            } //END Person loop

            var subject;
            if (byPerson)
                subject = selectedPerson.getFirst_name() + " " + selectedPerson.getLast_name() + " Task Summary " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);
            else
                subject = selectedLocation.getName() + " Task Summary " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);

            W4_Funcs.startEmail(html0, subject, activity);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static exportSupplyRequests(activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var supplyList = W4_Funcs.getPermittedSuppliesList();
            var locationID_to_Supplies = new Map();
            var locationIDs = [];
            for (let supplyItem of supplyList) {
                if (supplyItem.getAmountRequested() > 0) {
                    if (!locationID_to_Supplies.has(supplyItem.getLocationID())) {
                        locationID_to_Supplies.set(supplyItem.getLocationID(), []);
                    }
                    locationID_to_Supplies.get(supplyItem.getLocationID()).push(supplyItem);
                    if (!locationIDs.includes(supplyItem.getLocationID())) {
                        locationIDs.push(supplyItem.getLocationID());
                    }
                }
            }
            var locationList = [];
            for (let id of locationIDs) {
                var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), id);
                if (location != null)
                    locationList.push(location);
            }
            locationList.sort(Location.compareTo);
            var html0 = "";
            for (let location of locationList) {
                if (locationID_to_Supplies.has(location.getW4id())) {
                    var supplyList2 = locationID_to_Supplies.get(location.getW4id());
                    supplyList2.sort(SupplyItem.compareTo);
                    html0 += "<b>" + location.getName() + "</b><br>";
                    for (let supplyItem of supplyList2) {
                        html0 += "<b>" + supplyItem.getAmountRequested() + "</b> " + supplyItem.getName() + " (" + supplyItem.getRequester() + ")<br>";
                    }
                    html0 += "<br>";
                }
            }
            var subject = "Supply Requests";
            W4_Funcs.startEmail(html0, subject, activity);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

    static exportInspectionSummary(byPerson, selectedPerson, selectedLocation, startDay, endDay, activity) {
        if (MainActivity.currentPerson.canExportReports()) {
            var personList;
            if (byPerson) {
                personList = [];
                personList.push(selectedPerson);
            } else {
                personList = W4_Funcs.getAssignedPeople(selectedLocation.getW4id());
            }
            var html0 = "";
            for (let person of personList) {
                html0 += "<b>------" + person.getFirst_name() + " " + person.getLast_name() + "------</b><br>";
                var day = W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0);
                var end = W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0);
                var shifts;
                if (byPerson)
                    shifts = W4_Funcs.getAssignedShifts(person.getW4id());
                else
                    shifts = W4_Funcs.getShiftsForLocation(selectedLocation.getW4id());
                shifts.sort(Shift.compareTo);
                while (day.getMillis() <= end.getMillis()) {
                    var dateHeaderAdded = false;
                    for (var i = 0; i < shifts.length; ++i) {
                        var shift = shifts[i];
                        var planList = W4_Funcs.getInspectionPlanOccurrencesForShift(shift.getW4id(), day.getMillis(), W4_Funcs.getNextDay(day).getMillis());
                        planList.sort(InspectionPlanOccurence.compareTo);
                        planList.reverse();
                        if (planList.length > 0) {
                            if (!dateHeaderAdded) {
                                html0 += W4_Funcs.getNumbersDayText(day, " / ", false) + " " + Asset.intToDayOfWeek3Letter[day.getDayOfWeek()] + "<br>";
                                dateHeaderAdded = true;
                            }
                            html0 += "&nbsp;&nbsp;--" + shift.method_getFullName() + "--<br>";
                            for (let plan of planList) {
                                var inspector = Asset.getAssetbyId(MainActivity.theCompany.getPersonList(), plan.getPerson_inspector_id());
                                html0 += "&nbsp;&nbsp;Inspected " + W4_Funcs.getTimeText(new W4DateTime(plan.getDateTime()));
                                if (inspector != null)
                                    html0 += " by " + inspector.getFirst_name() + " " + inspector.getLast_name();
                                html0 += "<br>";
                                for (var i1 = 0; i1 < plan.getArea_names().length; ++i1) {
                                    if (plan.getResult()[i1] == InspectionPlan.RESULT_BELOW || plan.getResult()[i1] == InspectionPlan.RESULT_EXCEEDS)
                                        html0 += "&nbsp;&nbsp;&nbsp;&nbsp;" + plan.getArea_names()[i1] + " - <b>" + InspectionPlan.results_noemoji[plan.getResult()[i1]] + "</b><br>";
                                    else
                                        html0 += "&nbsp;&nbsp;&nbsp;&nbsp;" + plan.getArea_names()[i1] + " - " + InspectionPlan.results_noemoji[plan.getResult()[i1]] + "<br>";
                                    if (plan.getResults().length > i1) {
                                        for (var j = 0; j < plan.getResults()[i1].length; ++j) {
                                            var result = plan.getResults()[i1][j];
                                            var name = plan.getPoints()[i1][j];

                                            if (result == InspectionPlan.RESULT_BELOW || result == InspectionPlan.RESULT_EXCEEDS)
                                                html0 += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + name + " - <b>" + InspectionPlan.results_noemoji[result] + "</b><br>";
                                            else
                                                html0 += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + name + " - " + InspectionPlan.results_noemoji[result] + "<br>";
                                        }
                                    }
                                }
                                html0 += "<br>";
                            }
                        }
                    } //END Location loop
                    if (dateHeaderAdded)
                        html0 += "<br>";
                    day = W4_Funcs.getNextDay(day);
                } //END Day loop
            } //END Person loop

            var subject;
            if (byPerson)
                subject = selectedPerson.getFirst_name() + " " + selectedPerson.getLast_name() + " Inspection Summary " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);
            else
                subject = selectedLocation.getName() + " Inspection Summary " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(startDay, 0, 0, 0), "/", false) + " to " + W4_Funcs.getNumbersDayText(W4_Funcs.calendarDayToDateTime(endDay, 0, 0, 0), "/", false);

            W4_Funcs.startEmail(html0, subject, activity);
        } else {
            MainActivity.w4Toast(activity, MainActivity.noReportsPermission, Toast.LENGTH_LONG);
        }
    }

}
