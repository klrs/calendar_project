//10x8

function init() {
    //NEEDS TESTING
    const days = ['unused','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

    var date = new Date();
    var currentDay = date.getDay() || 7 ;
    var weekdays = document.getElementsByClassName("weekdays");
    var oldDay = currentDay;
    var newDay = currentDay;

    setCurrentDayColor(currentDay);
    setCellCallbacks(date,currentDay);
    setTblHeaders(date,currentDay);

    function setCurrentDayColor(currentDay) {
        //colors current day red
        newDay = currentDay;
            //header color from bootstrap class
            weekdays[newDay - 1].classList.add("bg-danger");

        if(newDay != oldDay){
            weekdays[oldDay - 1].classList.remove("bg-danger");
        }
        oldDay = newDay;
    }

    document.getElementById("navi").onchange = function (){calendarNav()};

    function calendarNav(){
        //datepicker/calendar navigator
        let date = document.getElementById('navi').valueAsDate;
        let newCurDay = date.getDay() || 7 ;
        //new dates to headers
        setTblHeaders(date,newCurDay);
        setCurrentDayColor(newCurDay);
        //new date to CellCalls
        setCellCallbacks(date,newCurDay)
    }

    function setTblHeaders(date,currentDay) {

        var headersDate = new Date(date.getTime());
        //ISOString timezone fix
        var isoDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        //generates current week dates to table headings
        document.getElementById('navi').value = isoDate.toISOString().slice(0 , 10);
        document.getElementById("currentWeek").innerHTML = "Week " + getWeekOfYear(date);
       // alert("headertest."+ date.toLocaleString());
        headersDate.setDate(headersDate.getDate() - currentDay + 1);
        for(var i = 0; i < 7; i++) {
            weekdays[i].innerHTML = days[headersDate.getDay() || 7] + " " + (headersDate.getDate()) + "." + (headersDate.getMonth()+1) + "." + headersDate.getFullYear();
            headersDate.setDate(headersDate.getDate() + 1);
        }
    }

    function setCellCallbacks(date,currentDay) {
        //assigns callback function to each cell
        let td = document.getElementsByTagName("td");
        let form_date = document.forms[0];
        let cells = [];
        for(let time = 0; time < 9; time++) {
            for(let day = 0; day < 7; day++) {
                let c = time * 7 + day;
                cells.push(new Cell(day, time, date, currentDay ));
                td[c].onclick = function() {
                    form_date.elements["date"].value = cells[c].day;
                    form_date.elements["start_time"].value = cells[c].time;
                    $('#submit_form').modal('show')
                };
            }
        }
        function Cell(day, time, date, currentDay) {

            let cellDate= new Date(date.valueOf());
            cellDate.setDate(cellDate.getDate() - currentDay + day + 1);

            this.time = (14 + time) + ':' + '00 - ' + (15+time) + ':' + '00';
            var isoDate = new Date(cellDate.getTime() - (cellDate.getTimezoneOffset() * 60000));
            this.day = isoDate.toISOString().slice(0, 10);

        }
    }

    function getWeekOfYear(date) {
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
        var isoDate = new Date(dateArrow.getTime() - (dateArrow.getTimezoneOffset() * 60000));
        document.getElementById('navi').value = isoDate.toISOString().slice(0, 10);
        calendarNav();
    }

    //nav arrow forwards
    document.getElementById("weekArrowForward").onclick = function () {
        let dateArrow = document.getElementById('navi').valueAsDate;
        dateArrow.setDate(dateArrow.getDate() + 7);
        var isoDate = new Date(dateArrow.getTime() - (dateArrow.getTimezoneOffset() * 60000));
        document.getElementById('navi').value = isoDate.toISOString().slice(0, 10);
        calendarNav();
    }
}
