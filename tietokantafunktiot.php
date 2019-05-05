<?php

//$con = mysqli_connect('localhost', 'calendaruser', 'varauspassu' ,'VARAUS');

//hakee kaikki varaukset yhdelle päivämäärälle. 
//Palauttaa arrayn. Jos varauksia ei löydy palauttaa null
function haeVaraukset($varausPVM){
	
	$db = new mysqli('localhost', 'calendaruser', 'varauspassu123', 'VARAUS');

	if ($db->connect_errno != 0) {
		echo $db->connect_error;
		exit;
	}

	$query = "SELECT * FROM VARAUS WHERE PVM=$varausPVM";

	$results = $db->query($query);

	if ($results->num_rows > 0) {
		
		$tmp = array();
		while ($row = $results->fetch_assoc()) {
			
			$tmp[] = $row;
		}
		return $tmp;
	}

	else {
		echo 'Kysely ei tuottanut tuloksia. </br>';
		return null;
	}

	$closed = $db->close();

	if (!$closed) {
		echo 'Virhe sulkiessa yhteyttä tietokantaan';
	}

}

function luoVaraus($nimi, $sposti, $puh, $pvm, $kloStart, $kloEnd){
	$success = false;
	$db = new mysqli('localhost', 'calendaruser', 'varauspassu', 'CALENDAR');

	if ($db->connect_errno != 0) {
		echo $db->connect_error;
		exit;
	}

	$query = "INSERT INTO varaus VALUES(NULL, '$kloEnd', '$kloStart', '$nimi', '$puh', '$pvm', '$sposti')";
	$results = $db->query($query);
	if ($results->num_rows > 0) {
		$success = true;
		
	}
	else {
		echo 'Varauksen luonti tietokantaan epäonnistui. </br>';
	}

	$closed = $db->close();
	if (!$closed) {
		echo 'Virhe sulkiessa yhteyttä tietokantaan';
	}

	return $success;
}

function poistaVaraus($varausID) {

	$success = false;

	$db = new mysqli('localhost', 'calendaruser', 'varauspassu', 'CALENDAR');

	if ($db->connect_errno != 0) {
		echo $db->connect_error;
		exit;
	}

	$query = "DELETE FROM varaus WHERE varausID=$varausID";

	$result = $db->query($query);

	if (!$result) {
		echo "Varausta poistettaessa tapahtui virhe";
		exit;
	}
	else {
		echo "Varaus onnistuneesti poistettu!";
		$success = true;
	}

	$closed = $db->close();

	if (!$closed) {
		echo 'Virhe sulkiessa yhteyttä.';
	}

	return $success;

}




?>