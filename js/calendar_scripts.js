//10x8

function init() {
    //NEEDS TESTING
    const days = ['unused','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

    let date = new Date();
    var currentDay = date.getDay() || 7 ;
    var weekdays = document.getElementsByClassName("weekdays");
    var oldDay = currentDay;
    var newDay = currentDay;

    setCurrentDayColor(currentDay);
    setCellCallbacks();
    setTblHeaders(date,currentDay);

    function setCurrentDayColor(currentDay) {
        //colors current day red
        newDay = currentDay;
        weekdays[newDay - 1].style.backgroundColor = "red";

        if(newDay != oldDay){
            weekdays[oldDay - 1].style.backgroundColor = "#31353a";
        }
        oldDay = newDay;
    }

    document.getElementById("navi").onchange = function() {
        //datepicker/calendar navigator
        let date = document.getElementById('navi').valueAsDate;
        let newCurDay = date.getDay() || 7 ;
        //new dates to headers
        setTblHeaders(date,newCurDay);
        setCurrentDayColor(newCurDay);
    }

    function setTblHeaders(date,currentDay) {
        //generates current week dates to table headings
        document.getElementById('navi').value = date.toISOString().slice(0, 10);
       // alert("headertest."+ date); test alert

        date.setDate(date.getDate() - currentDay + 1);

        for(var i = 0; i < 7; i++) {
            weekdays[i].innerHTML = days[date.getDay() || 7] + " " + (date.getDate()) + "." + (date.getMonth()+1) + "." + date.getFullYear();
            //weekdays[i].innerHTML = days[date.getDay() || 7] + " " + date.toISOString().slice(0, 10);
            date.setDate(date.getDate() + 1);
        }
    }

    function setCellCallbacks() {
        //assigns callback function to each cell
        let td = document.getElementsByTagName("td");
        let form_date = document.forms[0];
        let cells = [];
        for(let time = 0; time < 9; time++) {
            for(let day = 0; day < 7; day++) {
                let c = time * 7 + day;
                cells.push(new Cell(day + 1, time));
                td[c].onclick = function() {
                    form_date.elements["date"].value = cells[c].day;
                    form_date.elements["start_time"].value = cells[c].time;
                    $('#submit_form').modal('show')
                };
            }
        }
        function Cell(day, time) {
            let date = new Date();
            date.setDate((date.getDate() - (currentDay)) + day);
            this.time = (14 + time) + ':' + '00';
            this.day = date.toISOString().slice(0, 10);
        }
    }
}