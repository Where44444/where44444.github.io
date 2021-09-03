class CalendarActivity extends W4Activity {

    onCreate() {
        var a = this;
        super.onCreate();
        if (!MainActivity.loggedIn)
            return;
        a.getSupportActionBar().hide(); //Hide bar at top with App Name on it
        a.setContentView(R.layout.activity_calendar);

        var events = [];
        var settings = {}; //Disable highlighting today
        var calendar = a.findViewById('Calendar');
        caleandar(calendar.ele, events, settings);

        var dYear = a.getIntent().getIntExtra("dYear", 2000);
        var dMonth = a.getIntent().getIntExtra("dMonth", 1);
        var dDay = a.getIntent().getIntExtra("dDay", 1);
        var calendarDay = new W4DateTime(dYear, dMonth, dDay, 0, 0, 0);

        var decorateCalendar = function () {
            var dayList = calendar.ele.children[0].children[2];
            var title = calendar.ele.children[0].children[0].children[1].innerHTML;
            var dt = W4_Funcs.getDateTimeFromCalendarTitle(title);
            var firstDayOfWeek = dt.getDayOfWeek();
            for (var i = 0; i < firstDayOfWeek; ++i) {
                dt = W4_Funcs.getPrevDay(dt);
            }

            for (var i = 0; i < dayList.children.length; ++i) {
                var node = dayList.children[i];
                var nodeP = node.children[0];
                if (!W4_Funcs.doesClassListInclude(nodeP.classList, "clickable")) {
                    nodeP.classList.add("clickable");
                    nodeP.classList.add("calendarDayHover");
                    nodeP.dt = dt.getMillis();
                    nodeP.addEventListener("click", function (event) {
                        var dt = new W4DateTime(event.target.dt);
                        a.getIntent().putExtra("dYear", dt.getYear());
                        a.getIntent().putExtra("dMonth", dt.getMonthOfYear());
                        a.getIntent().putExtra("dDay", dt.getDayOfMonth());
                        a.setResult(AppCompatActivity.RESULT_OK, a.getIntent());
                        a.finish();
                    });
                    if (W4_Funcs.isSameDay(calendarDay, dt)) {
                        node.style.backgroundColor = "#FF006E";
                        node.style.color = "white";
                    }
                    else {
                        node.style.backgroundColor = "";
                        node.style.color = "";
                    }
                }
                dt = W4_Funcs.getNextDay(dt);
            }
        };

        calendar.addEventListener("click", function () {
            decorateCalendar();
        });
        decorateCalendar();

        W4_Funcs.w4SetMaterialCalendarDate(calendar, calendarDay);


        //     calendar.addDecorator(new DayViewDecorator() {

        //         boolean shouldDecorate(CalendarDay day) {
        //             var cal2 = Calendar.getInstance();
        //             return (W4_Funcs.isSameDay(day, cal2));
        //         }


        //         void decorate(DayViewFacade view) {
        //         view.setBackgroundDrawable(ContextCompat.getDrawable(this, "../res/selector).png");
        //     }
        //     });

        // calendar.setOnDateChangedListener(new OnDateSelectedListener() {

        //     onDateSelected(widget, date, selected) {
        //         var dateTimeSelected = W4_Funcs.calendarDayToDateTime(calendar.getSelectedDate(), 0, 0, 0);
        //         a.getIntent().putExtra("dYear", calendar.getSelectedDate().getYear());
        //         a.getIntent().putExtra("dMonth", calendar.getSelectedDate().getMonthOfYear());
        //         a.getIntent().putExtra("dDay", calendar.getSelectedDate().getDayOfMonth());
        //         a.setResult(AppCompatActivity.RESULT_OK, a.getIntent());
        //         a.finish();
        //     }
        // });
    }
}
