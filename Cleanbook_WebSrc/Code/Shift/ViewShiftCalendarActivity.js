class ViewShiftCalendarActivity extends W4Activity {

    static selectedCalendarDay;
    static calendarSlotHeightDP = 50;
    static noShiftWritePermissions = "You don't have permission to create new Shifts";

    onDestroy() {
        super.onDestroy();
        FireBaseListeners.viewShiftCalendarActivity = null;
    }


    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().setTitle("Shift Calendar");
        a.setContentView(R.layout.activity_view_shift_calendar);
        FireBaseListeners.viewShiftCalendarActivity = this;
        ViewShiftCalendarActivity.selectedCalendarDay = W4_Funcs.dateTimeToCalendarDay(new W4DateTime());

        a.updateCalendarScheduleView();
        var iButton = a.findViewById("New_Shift_Today_Button");
        iButton.addEventListener("click", function () {
            var dateTime = new W4DateTime();
            a.setStartDateButton(dateTime);
            ViewShiftCalendarActivity.selectedCalendarDay = W4_Funcs.dateTimeToCalendarDay(dateTime);
            a.updateCalendarScheduleView();

        });
        var button = a.findViewById("New_Shift_Start_Date_Button");
        a.setStartDateButton(new W4DateTime());
        button.addEventListener("click", function () {
            var intent = new Intent(this, new CalendarActivity());
            intent.putExtra("dYear", ViewShiftCalendarActivity.selectedCalendarDay.getYear());
            intent.putExtra("dMonth", ViewShiftCalendarActivity.selectedCalendarDay.getMonthOfYear());
            intent.putExtra("dDay", ViewShiftCalendarActivity.selectedCalendarDay.getDayOfMonth());
            a.startActivityForResult(intent, MainActivity.requestCodeNewShiftCalendar);

        });
        var iButton = a.findViewById("New_Shift_Left");
        iButton.addEventListener("click", function () {
            var dateTime = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, 0, 0, 0);
            dateTime = new W4DateTime(dateTime.getMillis() - (0.5 * TimeUnit.DAYS.toMillis(1)));
            a.setStartDateButton(dateTime);
            ViewShiftCalendarActivity.selectedCalendarDay = W4_Funcs.dateTimeToCalendarDay(dateTime);
            a.updateCalendarScheduleView();

        });
        var iButton = a.findViewById("New_Shift_Right");
        iButton.addEventListener("click", function () {
            var dateTime = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, 0, 0, 0);
            dateTime = new W4DateTime(dateTime.getMillis() + (1.5 * TimeUnit.DAYS.toMillis(1)));
            a.setStartDateButton(dateTime);
            ViewShiftCalendarActivity.selectedCalendarDay = W4_Funcs.dateTimeToCalendarDay(dateTime);
            a.updateCalendarScheduleView();
        });

    }

    setStartDateButton(dateTime) {
        var button = this.findViewById("New_Shift_Start_Date_Button");
        var dateTimeNow = new W4DateTime();
        var text = W4_Funcs.getFriendlyDayText(dateTime);
        button.setText(text);
    }

    /**
     * @param context
     * @param activity
     * @return
     */
    static textViewColor = "black";
    static buttonColor = "#38F094";
    static getCalendarSlotView(context, activity, dayAndHour, shifts, shiftOccurTypes) {
        var hour = dayAndHour.getHourOfDay();
        var timeText = "";
        if (hour == 0)
            timeText = "12 AM";
        else if (hour == 12)
            timeText = "12 PM";
        else if (hour < 12)
            timeText = hour + " AM";
        else
            timeText = (hour - 12) + " PM";
        var linearLayoutH = new View(W4_Funcs.createElementFromHTML("<div id='a' style='display: flex; flex-direction: row; height: " + (ViewShiftCalendarActivity.calendarSlotHeightDP + 1) + "px;'></div>"), activity);
        var linearLayoutV = new View(W4_Funcs.createElementFromHTML("<div id='b' style='flex-grow: 1; flex-basis: 0;'></div>"), activity);
        var textView = new View(W4_Funcs.createElementFromHTML("<div id='c' style='height: " + (ViewShiftCalendarActivity.calendarSlotHeightDP + 1) + "px;'></div>"), activity);
        textView.setText(timeText);
        textView.setTextColor(ViewShiftCalendarActivity.textViewColor);
        var space = new View(W4_Funcs.createElementFromHTML("<div id='d' style='height: 1px;'></div>"), activity);
        var button = new View(W4_Funcs.createElementFromHTML("<button id='e' class='calendarButton' style='width: 100%; padding: 0px; height: " + ViewShiftCalendarActivity.calendarSlotHeightDP + "px;'></button>"), activity);
        button.setBackgroundColor(ViewShiftCalendarActivity.buttonColor);
        if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS])
            button.setText("+&nbsp;&nbsp;");
        button.setTextSize(30);
        button.ele.style.textAlign = "right";
        button.addEventListener("click", function () {
            var dateTimeSelectedStart = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, hour, 0, 0);
            if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
                var intent = new Intent(activity, new NewEditShiftActivity());
                intent.putExtra("startTime", dateTimeSelectedStart.getMillis());
                activity.startActivity(intent);
            }
            else
                MainActivity.w4Toast(activity, ViewShiftCalendarActivity.noShiftWritePermissions, Toast.LENGTH_LONG);
        });
        var shiftAdded = false;
        var linearLayoutHShifts = new View(W4_Funcs.createElementFromHTML("<div id='f' style='display: flex; flex-direction: row; flex-grow: 3; flex-basis: 0;'></div>"), activity);
        for (var i = 0; i < shifts.length; ++i) {
            var shift = shifts[i];
            var shiftOccurType = shiftOccurTypes.get(shift.getW4id());
            var id = shift.getW4id();
            if (shiftOccurType != Shift.OCCURS_NONE) {
                shiftAdded = true;
                var button1Weight = 60; //Weight = 60 - minutes taken in space
                var button2Weight = 0;
                var button3Weight = 60;
                var shiftStartTime = new W4DateTime(shift.getStartTime());
                var shiftEndTime = new W4DateTime(shift.getEndTime());

                if (W4_Funcs.shiftShouldBeMovedForwardOneHour(shiftStartTime, dayAndHour)) {
                    shiftStartTime = new W4DateTime(shift.getStartTime() + TimeUnit.HOURS.toMillis(1));
                    shiftEndTime = new W4DateTime(shift.getEndTime() + TimeUnit.HOURS.toMillis(1));
                }
                var minutesStartToStartDiff = 0;
                var minutesEndToEndDiff = 0;
                if (!W4_Funcs.isSameDay(shiftStartTime, shiftEndTime)) { //Shift extends across 2 days
                    if (shiftOccurType == Shift.OCCURS_FIRST_DAY) {
                        minutesStartToStartDiff = (shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour()) - dayAndHour.getHourOfDay() * 60;
                        minutesEndToEndDiff = (24 * 60) - (dayAndHour.getHourOfDay() + 1) * 60;
                    }
                    else { //Second day
                        minutesStartToStartDiff = (0) - dayAndHour.getHourOfDay() * 60;
                        minutesEndToEndDiff = (shiftEndTime.getHourOfDay() * 60 + shiftEndTime.getMinuteOfHour()) - (dayAndHour.getHourOfDay() + 1) * 60;
                    }
                } else {
                    minutesStartToStartDiff = (shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour()) - dayAndHour.getHourOfDay() * 60;
                    minutesEndToEndDiff = (shiftEndTime.getHourOfDay() * 60 + shiftEndTime.getMinuteOfHour()) - (dayAndHour.getHourOfDay() + 1) * 60;
                }

                if (minutesStartToStartDiff > 0) {
                    button1Weight = 60 - minutesStartToStartDiff;
                }
                if (minutesEndToEndDiff < 0) {
                    button3Weight = 60 + minutesEndToEndDiff;
                }
                button2Weight = (60 - button1Weight) + (60 - button3Weight);
                var linearLayoutButton = new View(W4_Funcs.createElementFromHTML("<div id='g' style='flex-grow: 1; flex-basis: 0;'></div>"), activity);
                if (shiftOccurType == Shift.OCCURS_TWICE_SAME_SLOT) {
                    button1Weight = 60 - shiftEndTime.getMinuteOfHour(); //15 mins = 45
                    button3Weight = shiftStartTime.getMinuteOfHour(); //5 mins = 55
                    button2Weight = 120 - (button1Weight + button3Weight); //120 - 45 + 55 = 20 (40 mins)
                    var button1 = new View(W4_Funcs.createElementFromHTML("<button id='h' class='calendarButton' style='width: 100%; padding: 0px; height: " + ViewShiftCalendarActivity.weightToHeight(button1Weight) + "px;'></button>"), activity);
                    button1.setBackgroundColor(W4_Funcs.decimalToColorHex(shift.getColor()));
                    var text = "";
                    var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                    if (hour == 0) {
                        if (shift.getPersonIDList().includes(MainActivity.currentPerson.getW4id()))
                            text += MainActivity.BLUE_CIRCLE + " "; //Blue circle
                        text += shift.getName();
                        if (location != null) {
                            text += " at " + location.getName();
                        }
                        if (shift.getPersonIDList() != null) {
                            if (shift.getPersonIDList().length == 1)
                                text += " (1 Person)";
                            else
                                text += " (" + shift.getPersonIDList().length + " People)";
                        } else
                            text += " (0 People)";
                    }
                    button1.setText(text);
                    if (W4_Funcs.useBlackText(shift.getColor()))
                        button1.setTextColor("black");
                    else
                        button1.setTextColor("white");
                    button1.setTextSize(12);
                    button1.ele.w4id = id;
                    button1.addEventListener("click", function (event) {
                        var intent;
                        if ((MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) && location != null)
                            intent = new Intent(context, new NewEditShiftActivity());
                        else {
                            intent = new Intent(context, new ViewShiftActivity());
                            if (location == null)
                                MainActivity.w4Toast(context, MainActivity.noLocationsPermissionText, Toast.LENGTH_LONG);
                        }
                        intent.putExtra("id", event.target.w4id);
                        context.startActivity(intent);
                    });

                    linearLayoutButton.addView(button1);

                    if (button2Weight != 60) {
                        var button2 = new View(W4_Funcs.createElementFromHTML("<button id='i' class='calendarButton' style='width: 100%; height: " + ViewShiftCalendarActivity.weightToHeight(button2Weight) + "px;'></button>"), activity);
                        button2.setBackgroundColor(ViewShiftCalendarActivity.buttonColor);
                        button2.addEventListener("click", function () {
                            var dateTimeSelectedStart = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, hour, 0, 0);
                            if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
                                var intent = new Intent(activity, new NewEditShiftActivity());
                                intent.putExtra("startTime", dateTimeSelectedStart.getMillis());
                                activity.startActivity(intent);
                            }
                            else
                                MainActivity.w4Toast(activity, ViewShiftCalendarActivity.noShiftWritePermissions, Toast.LENGTH_LONG);

                        });
                        linearLayoutButton.addView(button2);
                    }
                    var button3 = new View(W4_Funcs.createElementFromHTML("<button id='j' class='calendarButton' style='width: 100%; padding: 0px; height: " + ViewShiftCalendarActivity.weightToHeight(button3Weight) + "px;'></button>"), activity);
                    button3.setBackgroundColor(W4_Funcs.decimalToColorHex(shift.getColor()));
                    text = "";
                    if (shiftStartTime.getMinuteOfHour() < 15) {
                        if (shift.getPersonIDList().includes(MainActivity.currentPerson.getW4id()))
                            text += MainActivity.BLUE_CIRCLE + " "; //Blue circle
                        text += shift.getName();
                        if (location != null) {
                            text += " at " + location.getName();
                        }
                        if (shift.getPersonIDList() != null) {
                            if (shift.getPersonIDList().length == 1)
                                text += " (1 Person)";
                            else
                                text += " (" + shift.getPersonIDList().length + " People)";
                        } else
                            text += " (0 People)";
                    }
                    button3.setText(text);
                    if (W4_Funcs.useBlackText(shift.getColor()))
                        button3.setTextColor("black");
                    else
                        button3.setTextColor("white");
                    button3.setTextSize(12);
                    button3.ele.w4id = id;
                    button3.addEventListener("click", function (event) {
                        var intent;
                        if ((MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) && location != null)
                            intent = new Intent(context, new NewEditShiftActivity());
                        else {
                            intent = new Intent(context, new ViewShiftActivity());
                            if (location == null)
                                MainActivity.w4Toast(context, MainActivity.noLocationsPermissionText, Toast.LENGTH_LONG);
                        }
                        intent.putExtra("id", event.target.w4id);
                        context.startActivity(intent);
                    });

                    linearLayoutButton.addView(button3);
                }
                else { //Occurs first day/second day
                    if (button1Weight != 60) {
                        var space0 = new View(W4_Funcs.createElementFromHTML("<div id='k' style='height: 1px;'></div>"), activity);
                        var button1 = new View(W4_Funcs.createElementFromHTML("<button id='l' class='calendarButton' style='width: 100%; height: " + ViewShiftCalendarActivity.weightToHeight(button1Weight) + "px;'></button>"), activity);
                        button1.setBackgroundColor(ViewShiftCalendarActivity.buttonColor);
                        button1.addEventListener("click", function () {
                            var dateTimeSelectedStart = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, hour, 0, 0);
                            if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
                                var intent = new Intent(activity, new NewEditShiftActivity());
                                intent.putExtra("startTime", dateTimeSelectedStart.getMillis());
                                activity.startActivity(intent);
                            }
                            else
                                MainActivity.w4Toast(activity, ViewShiftCalendarActivity.noShiftWritePermissions, Toast.LENGTH_LONG);
                        });
                        linearLayoutButton.addView(space0);
                        linearLayoutButton.addView(button1);
                    }
                    var button2 = new View(W4_Funcs.createElementFromHTML("<button id='m' class='calendarButton' style='width: 100%; padding: 0px; height: " + ViewShiftCalendarActivity.weightToHeight(button2Weight) + "px;'></button>"), activity);
                    button2.setBackgroundColor(W4_Funcs.decimalToColorHex(shift.getColor()));
                    var text = "";
                    var minutesStarttoEndDiff = (shiftStartTime.getHourOfDay() * 60 + shiftStartTime.getMinuteOfHour()) - (dayAndHour.getHourOfDay() + 1) * 60;
                    var location = Asset.getAssetbyId(MainActivity.theCompany.getLocationList(), shift.getLocationID());
                    if ((hour == 0 && shiftStartTime.getMinuteOfHour() < 15)
                        || (hour == 0 && shiftOccurType == Shift.OCCURS_SECOND_DAY)
                        || (minutesStartToStartDiff >= 0 && minutesStarttoEndDiff < 0 && shiftStartTime.getMinuteOfHour() < 15)
                        || (shiftStartTime.getHourOfDay() + 1 == hour && shiftStartTime.getMinuteOfHour() >= 15)) {
                        if (shift.getPersonIDList().includes(MainActivity.currentPerson.getW4id()))
                            text += MainActivity.BLUE_CIRCLE + " "; //Blue circle
                        text += shift.getName();
                        if (location != null) {
                            text += " at " + location.getName();
                        }
                        if (shift.getPersonIDList() != null) {
                            if (shift.getPersonIDList().length == 1)
                                text += " (1 Person)";
                            else
                                text += " (" + shift.getPersonIDList().length + " People)";
                        } else
                            text += " (0 People)";
                    }
                    button2.setText(text);
                    if (W4_Funcs.useBlackText(shift.getColor()))
                        button2.setTextColor("black");
                    else
                        button2.setTextColor("white");
                    button2.setTextSize(12);
                    button2.ele.w4id = id;
                    button2.addEventListener("click", function (event) {
                        var intent;
                        if ((MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) && location != null)
                            intent = new Intent(context, new NewEditShiftActivity());
                        else {
                            intent = new Intent(context, new ViewShiftActivity());
                            if (location == null)
                                MainActivity.w4Toast(context, MainActivity.noLocationsPermissionText, Toast.LENGTH_LONG);
                        }
                        intent.putExtra("id", event.target.w4id);
                        context.startActivity(intent);
                    });


                    linearLayoutButton.addView(button2);

                    if (button3Weight != 60) {
                        var button3 = new View(W4_Funcs.createElementFromHTML("<button id='n' class='calendarButton' style='width: 100%; height: " + ViewShiftCalendarActivity.weightToHeight(button3Weight) + "px;'></button>"), activity);
                        button3.setBackgroundColor(ViewShiftCalendarActivity.buttonColor);
                        button3.addEventListener("click", function () {
                            var dateTimeSelectedStart = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, hour, 0, 0);
                            if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
                                var intent = new Intent(activity, new NewEditShiftActivity());
                                intent.putExtra("startTime", dateTimeSelectedStart.getMillis());
                                activity.startActivity(intent);
                            }
                            else
                                MainActivity.w4Toast(activity, ViewShiftCalendarActivity.noShiftWritePermissions, Toast.LENGTH_LONG);
                        });
                        linearLayoutButton.addView(button3);
                    }
                }
                linearLayoutHShifts.addView(linearLayoutButton);
            }
        }
        if (shiftAdded)
            linearLayoutH.addView(linearLayoutHShifts);

        linearLayoutV.addView(space);
        linearLayoutV.addView(button);
        linearLayoutH.addView(linearLayoutV);
        var views = [textView, linearLayoutH, linearLayoutHShifts];

        return views;
    }

    updateCalendarScheduleView() {
        var shiftsSlotsOccupiedMap = new Map(); //What slots on the calendar each shift occupies, 0 - 23 boolean array
        var origShiftsMatrix = [];
        var posMatrix = [];
        var shiftOccurTypesListMap = [];
        var slotsExist = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        for (var i = 0; i < 24; ++i) {
            var shiftsRow = [];
            origShiftsMatrix.push(shiftsRow);
            var shiftOccurTypes = new Map();
            shiftOccurTypesListMap.push(shiftOccurTypes);
            posMatrix.push([]);

            if (W4_Funcs.doesTimeExist(ViewShiftCalendarActivity.selectedCalendarDay, i, 0, 0)) {
                slotsExist[i] = true;
                var dayAndHour = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, i, 0, 0);
                for (let shift of W4_Funcs.getPermittedShiftList()) {
                    var shiftOccurType = W4_Funcs.doesRepeatingDateOccupyTimeSlot(shift, dayAndHour, true, 0);
                    if (shiftOccurType != Shift.OCCURS_NONE) {
                        shiftsRow.push(shift);
                        shiftOccurTypes.set(shift.getW4id(), shiftOccurType);
                        if (!shiftsSlotsOccupiedMap.has(shift.getW4id())) {
                            var slotsOccupied = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
                            slotsOccupied[i] = true;
                            shiftsSlotsOccupiedMap.set(shift.getW4id(), slotsOccupied);
                        } else
                            shiftsSlotsOccupiedMap.get(shift.getW4id())[i] = true;
                    }
                }
            }
            else {
                MainActivity.w4Toast(this, "Daylight Savings Time removed the time slot at " + Asset.intToTimeAndAMPM[i] + "!", Toast.LENGTH_LONG);
            }
        }
        var largestDaySize = 0;
        var shiftClaimedPosMap = new Map(); //What position on the calendar each shift has claimed
        for (let [selectedShiftID, value0] of shiftsSlotsOccupiedMap) { //Checking each shift that occurs that day, maps to the time slots it occupies
            // var selectedShiftID = selectedShiftSlotsOccupied.key;
            var currentPosChecking = 0;
            var conflictFound = true;
            while (conflictFound) {
                var conflictFound = false;
                for (let [otherShiftID, value1] of shiftClaimedPosMap) { //For all other shifts that have already claimed a spot on the calendar
                    // var otherShiftID = otherShiftPos.key;
                    if (conflictFound)
                        break;
                    if (value1 == currentPosChecking) {
                        for (var i = 0; i < 24; ++i) { //Check if that shift occupies the same slot on the calendar we're checking
                            if (slotsExist[i] &&
                                shiftsSlotsOccupiedMap.get(selectedShiftID)[i] &&
                                shiftsSlotsOccupiedMap.get(otherShiftID)[i]) {
                                conflictFound = true;
                                break;
                            }
                        }
                    }
                }
                if (!conflictFound) {
                    shiftClaimedPosMap.set(selectedShiftID, currentPosChecking);
                    if (currentPosChecking + 1 > largestDaySize)
                        largestDaySize = currentPosChecking + 1;
                    var slots = shiftsSlotsOccupiedMap.get(selectedShiftID);
                    for (var i = 0; i < 24; ++i)
                        if (slots[i])
                            posMatrix[i].push(currentPosChecking);
                }
                ++currentPosChecking;
            }
        }
        var labels = this.findViewById("New_Shift_Calendar_Labels");
        var buttons = this.findViewById("New_Shift_Calendar_Buttons");
        labels.setText("");
        buttons.setText("");
        var linearLayoutHShiftsList = [];
        var sortedShiftsMatrix = [];
        for (var i = 0; i < 24; ++i) {
            linearLayoutHShiftsList.push(null);
            var shiftsOrig = origShiftsMatrix[i];
            var shiftsPosSorted = posMatrix[i];
            var sortedShifts = [];
            sortedShiftsMatrix.push(sortedShifts);
            if (slotsExist[i]) {
                shiftsPosSorted.sort();
                for (let pos of shiftsPosSorted) {
                    for (let shift of shiftsOrig) {
                        if (pos == shiftClaimedPosMap.get(shift.getW4id())) {
                            sortedShifts.push(shift);
                            break;
                        }
                    }
                }
                var shiftOccurTypes = shiftOccurTypesListMap[i];
                var dayAndHour = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, i, 0, 0);
                var views = ViewShiftCalendarActivity.getCalendarSlotView(this, this, dayAndHour, sortedShifts, shiftOccurTypes);
                labels.addView(views[0]);
                buttons.addView(views[1]);
                linearLayoutHShiftsList[i] = views[2];
            }
            else {
                MainActivity.w4Toast(this, "Daylight Savings Time removed the time slot at " + Asset.intToTimeAndAMPM[i] + "!", Toast.LENGTH_LONG);
            }
        }
        for (var i = 0; i < 24; ++i) {
            if (slotsExist[i]) {
                var linearLayout = linearLayoutHShiftsList[i];
                var spacesAdded = 0;
                var dayAndHour = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, i, 0, 0);
                var numShifts = 0;
                var shiftsSorted = sortedShiftsMatrix[i];
                for (let shift of shiftsSorted) { //Checking each shift that occurs that day
                    if (shiftsSlotsOccupiedMap.get(shift.getW4id())[i]) { //If shift occurs in this time slot
                        var pos = shiftClaimedPosMap.get(shift.getW4id());
                        if (numShifts + spacesAdded < pos) {
                            var emptySlotsNeeded = pos - (numShifts + spacesAdded);
                            for (var k = 0; k < emptySlotsNeeded; ++k) {
                                linearLayout.addView(ViewShiftCalendarActivity.getEmptyCalendarSpace(this, this, dayAndHour), numShifts + spacesAdded);
                                ++spacesAdded;
                            }
                        }
                        ++numShifts;
                    }
                }
                if (numShifts != 0 && numShifts + spacesAdded < largestDaySize) {
                    var emptySlotsNeeded = largestDaySize - (numShifts + spacesAdded);
                    for (var k = 0; k < emptySlotsNeeded; ++k) {
                        linearLayout.addView(ViewShiftCalendarActivity.getEmptyCalendarSpace(this, this, dayAndHour), numShifts + spacesAdded);
                    }
                }
            }
        }
        //For each time slot
        //  For each shift in the time slot
        //    Check from left to right on calendar that all spots that the shift occupies are empty or that the arraylist doesnt go that far
        //    if yes, set those spots to full and shift pos = x pos on calendar
        //    else, move to next pos
    }

    static getEmptyCalendarSpace(context, activity, dayAndHour) {
        var hour = dayAndHour.getHourOfDay();
        var space = new View(W4_Funcs.createElementFromHTML("<div id='o' style='height: 1px;'></div>"), activity);
        var button = new View(W4_Funcs.createElementFromHTML("<button id='p' class='calendarButton' style='width: 100%; height: " + ViewShiftCalendarActivity.calendarSlotHeightDP + "px;'></button>"), activity);
        button.setBackgroundColor(ViewShiftCalendarActivity.buttonColor);
        button.addEventListener("click", function () {
            var dateTimeSelectedStart = W4_Funcs.calendarDayToDateTime(ViewShiftCalendarActivity.selectedCalendarDay, hour, 0, 0);
            if (MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ALL_SHIFTS] || MainActivity.currentPerson.getWritePermissions()[Asset.PERMISSION_ASSIGNED_SHIFTS]) {
                var intent = new Intent(activity, new NewEditShiftActivity());
                intent.putExtra("startTime", dateTimeSelectedStart.getMillis());
                activity.startActivity(intent);
            }
            else
                MainActivity.w4Toast(activity, ViewShiftCalendarActivity.noShiftWritePermissions, Toast.LENGTH_LONG);
        });
        var linearLayoutV = new View(W4_Funcs.createElementFromHTML("<div id='q' style='flex-grow: 1; flex-basis: 0;'></div>"), activity);
        linearLayoutV.addView(space);
        linearLayoutV.addView(button);
        return linearLayoutV;
    }


    onActivityResult(requestCode, resultCode, data) {
        var a = this;
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == MainActivity.requestCodeNewShiftCalendar) {
            if (resultCode == AppCompatActivity.RESULT_OK) {
                var calendarDay = new W4DateTime(data.getIntExtra("dYear", 2000), data.getIntExtra("dMonth", 1), data.getIntExtra("dDay", 1), 0, 0, 0);
                ViewShiftCalendarActivity.selectedCalendarDay = calendarDay;
                this.setStartDateButton(W4_Funcs.calendarDayToDateTime(calendarDay, 0, 0, 0));
                a.updateCalendarScheduleView();
            }
        }
    }

    static calendarSlotHeightDP_Coefficient = (ViewShiftCalendarActivity.calendarSlotHeightDP + 1) / 60;
    static weightToHeight(weight) {
        return (60 - weight) * ViewShiftCalendarActivity.calendarSlotHeightDP_Coefficient;
    }
}
