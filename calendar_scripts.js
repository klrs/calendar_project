//10x8

function initCalHeadings() {
    //generates current week dates to table headings
    //NEEDS TESTING
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

    var date = new Date();
    var currentDay = date.getDay();
    var weekdays = document.getElementsByClassName("weekdays");

    switch (currentDay) {

        case 0:
            weekdays[6].style.backgroundColor = "red";
            currentDay = 7;
            break;
        case 1:
            weekdays[0].style.backgroundColor = "red";
            currentDay = 1;
            break;
        case 2:
            weekdays[1].style.backgroundColor = "red";
            currentDay = 2;
            break;
        case 3:
            weekdays[2].style.backgroundColor = "red";
            currentDay = 3;
            break;
        case 4:
            weekdays[3].style.backgroundColor = "red";
            currentDay = 4;
            break;
        case 5:
            weekdays[4].style.backgroundColor = "red";
            currentDay = 5;
            break;
        case 6:
            weekdays[5].style.backgroundColor = "red";
            currentDay = 6;
            break;
    }

    date.setDate(date.getDate() - currentDay);
    for(var i = 0; i < 7; i++) {
        weekdays[i].innerHTML =
            days[date.getDay()] + " " + (date.getDate()+1) + "." + (date.getMonth()+1) + "." + date.getFullYear();
        date.setDate(date.getDate() + 1);
    }

}