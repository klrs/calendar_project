function calendar() {
    const days = ['unused','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

    var date = new Date();
    var currentDay = date.getDay() || 7 ;
    var weekdays = document.getElementsByClassName("weekdays");
    let cells = [];
    let td = document.getElementsByTagName("td");

    var oldDay = currentDay;
    var newDay = currentDay;

    setup();

    document.getElementById("navi").onchange = function() {
        date = document.getElementById('navi').valueAsDate;
        setup();
    };
    document.getElementById("submit").onclick = function() {
        let form = document.forms[0];   //PRONE TO ERROR

        //data
        let name = form.elements["name"].value;
        let email = form.elements["email"].value;
        let f_date = form.elements["date"].value;
        let time = form.elements["start_time"].value.split(":")[0];

        //ajax
        let uri = 'api/reservation?name=' + name + '&email=' + email + '&date=' + f_date + '&time=' + time;
        let httpRequest = createRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    alert(httpRequest.responseText);
                    setup();
                } else {
                    alert('There was a problem with the request.');
                }
            }
        };

        sendRequest(uri, "POST", httpRequest);
        $('#submit_form').modal('hide');
    };
    document.getElementById("deleteSubmit").onclick = function() {
        let form = document.forms[1];   //PRONE TO ERROR
        let id = form.elements["id"];
        let email = form.elements["email"];
        let f_date = form.elements["date"].value;
        let time = form.elements["start_time"].value.split(":")[0];

        let uri = 'api/reservation?id=' + id + "&email=" + email + "&date=" + f_date + "&time=" + time;
        let httpRequest = createRequest();

        //ADD FUNCTIONALITY ??
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    alert(httpRequest.responseText);
                    setup();
                } else {
                    alert('There was a problem with the request.');
                }
            }
        };
        sendRequest(uri, "DELETE", httpRequest);
        $('#delete_form').modal('hide');
    };

    function createRequest() {
        let httpRequest;
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {}
            }
        }
        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        return httpRequest;
    }
    function sendRequest(uri, method, httpRequest) {
        httpRequest.open(method, uri);
        httpRequest.send();
    }

    function setCurrentDayColor() {
        //colors current day red
        newDay = currentDay;
        //header color from bootstrap class
        weekdays[newDay - 1].classList.add("bg-danger");
        if(newDay !== oldDay){
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

        for(let c = 0; c < cells.length; c++) {
            checkCell(c);
        }
    }
    function checkCell(index) {
        //PRONE TO ERRORS!
        let form_date = document.forms[0];
        let delform_date = document.forms[1];

        if(cells[index].reserved === false) {
            td[index].onclick = function () {
                form_date.elements["date"].value = cells[index].day;
                form_date.elements["start_time"].value = cells[index].time;
                $('#submit_form').modal('show');
            };
        } else {
            td[index].style.backgroundColor = "DarkRed";
            td[index].innerHTML = "reserved";
            td[index].onclick = function() {
                delform_date.elements["date"].value = cells[index].day;
                delform_date.elements["start_time"].value = cells[index].time;
                $('#delete_form').modal('show');
            }
        }
    }
    function setReservations() {
        //WIP
        //get current WEEK reservations loop??
        let newdate = new Date(+date);
        let uri = "";
        newdate.setDate(newdate.getDate() - currentDay + 1);
        let httpRequests = [];
        for(let i = 0; i < 7; i++) {
            let r_date = newdate.toISOString().split("T")[0];
            uri = 'api/reservation/' + r_date;

            httpRequests[i] = createRequest();
            httpRequests[i].onreadystatechange = function(){
                if (httpRequests[i].readyState === 4) {
                    if (httpRequests[i].status === 200) {
                        let reservJSON = httpRequests[i].responseText;
                        let res = JSON.parse(reservJSON);
                        alert(res.length);
                        for(let y = 0; y < res.length; y++) {
                            //SAHNFLKJAHSFKJHASFJKLHFSAKJHAFSKJH IT*S FUCKED BIG TIME
                            let cell_index = Math.abs(14 - res[y].KLOSTART);
                            cells[(cell_index*7) + i].reserved = true;
                            checkCell((cell_index*8) + i);
                        }
                    } else {
                        alert('There was a problem with the request.');
                    }
                }
            };
            sendRequest(uri, "GET", httpRequests[i]);
            newdate.setDate(newdate.getDate()+1);
        }
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
    };

    //nav arrow forwards
    document.getElementById("weekArrowForward").onclick = function () {
        let dateArrow = document.getElementById('navi').valueAsDate;
        dateArrow.setDate(dateArrow.getDate() + 7);
        date = new Date(+dateArrow);
        setup();
    };

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