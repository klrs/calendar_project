//10x8

function init() {
    //NEEDS TESTING
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let date = new Date();
    var currentDay = date.getDay();
    var weekdays = document.getElementsByClassName("weekdays");

    setCurrentDayColor();
    setCellCallbacks();
    setTblHeaders();

    function setCurrentDayColor() {
        //colors current day red
        weekdays[currentDay].style.backgroundColor = "red";
    }

    function setTblHeaders() {
        //generates current week dates to table headings
        let date = new Date();
        date.setDate(date.getDate() - currentDay);
        for(var i = 0; i < 7; i++) {
            //weekdays[i].innerHTML = days[date.getDay()] + " " + (date.getDate()+1) + "." + (date.getMonth()+1) + "." + date.getFullYear();
            weekdays[i].innerHTML = days[date.getDay()] + " " + date.toISOString().slice(0, 10);
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
                cells.push(new Cell(day, time));
                td[c].onclick = function() {
                    form_date.elements["date"].value = cells[c].day;
                    form_date.elements["start_time"].value = cells[c].time;
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