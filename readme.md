Calendar Project
Uni fullstack project for an imaginary reservation software. Information Security was not prioritized, so there are lot of security flaws.

REST-api

GET api/reservation?s_date=2019-05-01&e_date=2019-05-06 
Get reservations at selected timeframe. s_date: start date. e_date: end date. Date format is YYYY-MM-DD.
Returns json string array of reservations objects. Objects contain fields KLOSTART and PVM. KLOSTART contains time of the reservation. Format: 2-digit number from 14 to 22.
PVM contains the date of the reservation. Format: YYYY-MM-DD.

POST api/reservation/
Creates a reservation to database. Request body must contain JSON object with properties name, email, f_date and time.
name: Name of the reserver. email: email of the reserver. date: date of the reservation. Format: YYYY-MM-DD.
time: time of the reservation. Format: 2-digit number from 14 to 22.

DELETE api/reservation/
Deletes a reservation. Request body must contain JSON object with properties id, email, f_date and time. id: id of the reservation. email: email of the reserver. date: date of the reservation. Format: YYYY-MM-DD. time: time of the reservation. Format: 2-digit number from 14 to 22.
