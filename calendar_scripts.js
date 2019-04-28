//10x8

function initCalHeadings() {
    //generates current week dates to table headings
    //NEEDS TESTING
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var date = new Date();
    var currentDay = date.getDay();
    var weekdays = document.getElementById("weekdays").getElementsByTagName("th");

    date.setDate(date.getDate() - currentDay);
    for(var i = 0; i < 7; i++) {
        weekdays[date.getDay()+1].innerHTML =
            days[date.getDay()] + " " + date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
        date.setDate(date.getDate() + 1);
    }
}