//10x8

function calendar() {
    //NEEDS TESTING
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let date = new Date();
    var currentDay = date.getDay();
    var weekdays = document.getElementsByClassName("weekdays");
    let cells = []; //cells will get initialized in setCellCallbacks()

    setup();

    document.getElementById("navisubm").onclick = function() {
        //datepicker/calendar navigator
        date = document.getElementById('navi').valueAsDate;
        setup();

        //new dates to headers
        //setTblHeaders(date,newCurDay);
        //setCurrentDayColor(newCurDay);
    };

    function setCurrentDayColor() {
        //colors current day red
        for(let i = 0; i < weekdays.length; i++) {
            if(currentDay === i) {
                weekdays[i].style.backgroundColor = "red";
            }
            else {
                weekdays[i].style.backgroundColor = "transparent";
            }
        }
    }
    function setTblHeaders() {
        //generates current week dates to table headings
        let newdate = new Date(+date);  //make a new date object so the original won't get muddled

        newdate.setDate(newdate.getDate() - currentDay);
        for(var i = 0; i < 7; i++) {
            //weekdays[i].innerHTML = days[date.getDay()] + " " + (date.getDate()+1) + "." + (date.getMonth()+1) + "." + date.getFullYear();
            weekdays[i].innerHTML = days[newdate.getDay()] + " " + newdate.toISOString().slice(0, 10);
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
            newdate.setDate((newdate.getDate() - (currentDay)) + day);

            this.time = (14 + time) + ':' + '00';
            this.index_time = time;
            this.day = newdate.toISOString().slice(0, 10);
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
    function setup() {
        currentDay = date.getDay();
        cells.length = 0;
        initCells();
        setCurrentDayColor();
        setTblHeaders();
        setReservations();
        setCellCallbacks();
    }
}