//10x8

function calendar() {
    //NEEDS TESTING
    const days = ['unused','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

    var date = new Date();
    var currentDay = date.getDay() || 7 ;
    var weekdays = document.getElementsByClassName("weekdays");
    let cells = [];
    var oldDay = currentDay;
    var newDay = currentDay;

    setup();

    document.getElementById("navi").onchange = function() {calendarNav()};

    function calendarNav() {
        //datepicker/calendar navigator
        date = document.getElementById('navi').valueAsDate;
        setup();
    }

    function setCurrentDayColor() {
        //colors current day red
        newDay = currentDay;
        //header color from bootstrap class
        weekdays[newDay - 1].classList.add("bg-danger");
        if(newDay != oldDay){
            //remove class from old date
            weekdays[oldDay - 1].classList.remove("bg-danger");
        }
        oldDay = newDay;
    }
    function setTblHeaders() {
        //generate current week number to week heading
        document.getElementById("currentWeek").innerHTML = "Week " + getWeekOfYear();
        //generate date to calendarNav ISOString timezone fix
        var isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        document.getElementById('navi').value = isoDate.toISOString().slice(0 , 10);
        //generates current week dates to table headings
        let newdate = new Date(+date);  //make a new date object so the original won't get muddled
        newdate.setDate(newdate.getDate() - currentDay + 1);
        for(var i = 0; i < 7; i++) {
            weekdays[i].innerHTML = days[newdate.getDay() || 7] + " " + (newdate.getDate()) + "." + (newdate.getMonth()+1) + "." + newdate.getFullYear();
           // weekdays[i].innerHTML = days[newdate.getDay()] + " " + newdate.toISOString().slice(0, 10);
            newdate.setDate(newdate.getDate() + 1);
        }
    }
    function initCells() {
        for(let time = 0; time < 9; time++) {
            for(let day = 0; day < 7; day++) {
                cells.push(new Cell(day, time));
            }
        }
        function Cell(day, time) {
            let newdate = new Date(+date);
            newdate.setDate((newdate.getDate() - (currentDay)) + day + 1);

            this.time = (14 + time) + ':' + '00 - ' + (15+time) + ':' + '00';
            this.index_time = time;
            //isoDate timezone fix
            var isoDate = new Date(newdate.getTime() - (newdate.getTimezoneOffset() * 60000));
            this.day = isoDate.toISOString().slice(0, 10);
            this.index_day = day;
            this.reserved = false;
        }
    }
    function setCellCallbacks() {
        //assigns callback function to each cell
        let td = document.getElementsByTagName("td");
        let form_date = document.forms[0];
        for(let c = 0; c < cells.length; c++) {
            if(cells[c].reserved === false) {
                td[c].onclick = function () {
                    form_date.elements["date"].value = cells[c].day;
                    form_date.elements["start_time"].value = cells[c].time;
                    $('#submit_form').modal('show');
                };
            } else {
                td[c].style.backgroundColor = "DarkRed";
                td[c].innerHTML = "reserved";
            }
        }
    }
    function setReservations() {
        //WIP
        //get current WEEK reservations loop??
        let dummyjson = '{"date":"5/5/2019", "time":"14"}';
        let o = JSON.parse(dummyjson);
        cells[0].reserved = true;

    }
    function getWeekOfYear() {
        var target = new Date(date.valueOf()),
            dayNumber = (date.getDay() + 6) % 7,
            firstThursday;

        target.setDate(target.getDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setMonth(0, 1);

        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }

        return Math.ceil((firstThursday - target) /  (7 * 24 * 3600 * 1000)) + 1;
    }

    //nav arrow backwards
    document.getElementById("weekArrowBack").onclick = function () {
        let dateArrow = document.getElementById('navi').valueAsDate;
        dateArrow.setDate(dateArrow.getDate() - 7);
        date = new Date(+dateArrow);
        setup();
    }

    //nav arrow forwards
    document.getElementById("weekArrowForward").onclick = function () {
        let dateArrow = document.getElementById('navi').valueAsDate;
        dateArrow.setDate(dateArrow.getDate() + 7);
        date = new Date(+dateArrow);
        setup();
    }

    function setup() {
        currentDay = date.getDay() || 7;
        cells.length = 0;
        initCells();
        setCurrentDayColor();
        setTblHeaders();
        setReservations();
        setCellCallbacks();
    }
}