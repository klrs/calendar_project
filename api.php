<?php
# URI parser helper functions
# ---------------------------
function getResource() {
    # returns numerically indexed array of URI parts
    $resource_string = $_SERVER['REQUEST_URI'];
    if (strstr($resource_string, '?')) {
        $resource_string = substr($resource_string, 0, strpos($resource_string, '?'));
    }
    $resource = array();
    $resource = explode('/', $resource_string);
    array_shift($resource);
    return $resource;
}

function getParameters() {
    # returns an associative array containing the parameters
    $resource = $_SERVER['REQUEST_URI'];
    $param_string = "";
    $param_array = array();
    if (strstr($resource, '?')) {
        # URI has parameters
        $param_string = substr($resource, strpos($resource, '?')+1);
        $parameters = explode('&', $param_string);
        foreach ($parameters as $single_parameter) {
            $param_name = substr($single_parameter, 0, strpos($single_parameter, '='));
            $param_value = substr($single_parameter, strpos($single_parameter, '=')+1);
            $param_array[$param_name] = $param_value;
        }
    }
    return $param_array;
}

function getMethod() {
    # returns a string containing the HTTP method
    $method = $_SERVER['REQUEST_METHOD'];
    return $method;
}

# Handlers
# ------------------------------

//parametreina varaajan nimi ja maili. varauspvm ja varauskloaika, sekä url varauksen poistamiseen
function reservationEmail($name, $email, $varausPvm, $varausKlo, $varausId) {
    $to = $email;
    $headers = "From: noreply@ajanaraus.kek";
    $subject = 'Kiitos ajanvarauksestanne';
    $msg =  'Hei ' . $name . "\n" . "\n" . 'Varauksenne ajalle ' . $varausPvm . ' klo ' . $varausKlo  .
        ' on tallennettu järjestelmäämme. ' . "\n" . "\n" .
        'Halutessanne voitte peruuttaa varauksenne klikkaamalla varaustanne ja syöttämällä siihen varaustunnuksenne joka on ' . $varausId . ', sekä sähköpostiosoitteenne.';

    $sent = mail($to, $subject, $msg, $headers);

    if($sent) {
        echo ' Varausvahvistus on lähetetty teille sähköpostilla.';
        return true;
    } else {
        echo 'Viestiä ei voitu lähettää';
        return false;
    }
}


//getReservations
// palauttaa null jos ei haulla ei tuloksia
// palauttaa arrayn kaikista varauksista yhdelle päivälle
// muodossa Array([0] => Array ( [KEY] => VALUE [KEY] => VALUE ....) <--- ensimmäinen varaus
//				[1] => Array ( [KEY] => VALUE [KEY] => VALUE ....) <--- toka varaus... jne.

function getReservations($startDate, $endDate){

    $db = new mysqli('localhost', 'calendaruser', 'kalenteri2019', 'CALENDAR');

    if ($db->connect_errno != 0) {
        echo $db->connect_error;
        exit;
    }

    //$query = "SELECT * FROM VARAUS WHERE PVM BETWEEN '2019-05-06' AND '2019-05-12'";
    $query = "SELECT * FROM VARAUS WHERE PVM BETWEEN '$startDate' AND '$endDate'";

    $results = $db->query($query);

    if ($results->num_rows > 0) {

        $tmp = array();
        while ($row = $results->fetch_assoc()) {
            $tmp[] = $row;
        }
        $closed = $db->close();
        if (!$closed) {
            echo 'Virhe sulkiessa yhteyttä tietokantaan';
        }
        return $tmp;
    }

    else {
        //echo 'Kysely ei tuottanut tuloksia. </br>';
        $closed = $db->close();
        if (!$closed) {
            echo 'Virhe sulkiessa yhteyttä tietokantaan';
        }
        return null;
    }

    $closed = $db->close();

    if (!$closed) {
        echo 'Virhe sulkiessa yhteyttä tietokantaan';
    }

}

//palauttaa true jos lisäys onnistuu, false jos ei
function createReservation($nimi, $email, $pvm, $klo){
    $db = new mysqli('localhost', 'calendaruser', 'kalenteri2019', 'CALENDAR');
    $success = true;
    if ($db->connect_errno != 0) {
        echo $db->connect_error;
        return false;
    }

    $query = "INSERT INTO VARAUS VALUES ('$nimi', '$email', '$pvm', '$klo', NULL)";
    $result = $db->query($query);
    if (!$result) {
        echo "Varausta lisätessä tapahtui virhe";
        $success = false;
    }
    else {
        echo "Varaus onnistuneesti lisätty! ID:llä {$db->insert_id}";
        $varausId = $db->insert_id;
        reservationEmail($nimi, $email, $pvm, $klo, $varausId);
        $success = true;
    }
    $closed = $db->close();
    if (!$closed) {
        echo 'Virhe sulkiessa yhteyttä.';
    }
    return $success;
}

 // palauttaa true jos poistaminen onnistuu, muuten false
function deleteReservation($id, $email, $pvm, $klo) {
    $db = new mysqli('localhost', 'calendaruser', 'kalenteri2019', 'CALENDAR');
    $success = true;

    if ($db->connect_errno != 0) {
        echo $db->connect_error;
        return false;
    }

    $query = "DELETE FROM VARAUS WHERE ID='$id' AND SPOSTI='$email' AND PVM='$pvm' AND KLOSTART='$klo' ";
    $result = $db->query($query);
    echo $result;
    if ($db->affected_rows > 0) {
        echo "Varaus onnistuneesti poistettu!";
        $success = true;
    }
    else {
        echo "Varausta poistettaessa tapahtui virhe";

        $success = false;
    }
    $closed = $db->close();
    if (!$closed) {
        echo 'Virhe sulkiessa yhteyttä.';
    }

    return $success;
}

# Main
# ----

$resource = getResource();
$request_method = getMethod();
$parameters = getParameters();
$body = json_decode(file_get_contents('php://input'));

# Redirect to appropriate handlers.
if ($resource[1]=="api") {
    if ($request_method=="POST" && $resource[2]=="reservation") {
        echo createReservation($body->name, $body->email, $body->f_date, $body->time);
    }
    else if ($request_method=="GET" && $resource[2]=="reservation") {
        $reservations = getReservations($parameters['s_date'], $parameters['e_date']);  //parametriksi päivä HUOM PVM FORMAATISSA YYYY-MM-DD
        if ($reservations != null) {
            echo json_encode($reservations);
        }
        else {
            echo 'no reservations found';
        }
    }
    else if ($request_method=="DELETE" && $resource[2]=="reservation") {
        //echo $body->id . $body->email . $body->f_date . $body->time;
        echo deleteReservation($body->id, $body->email, $body->f_date, $body->time);
    }
    else {
        http_response_code(405); # Method not allowed
    }
}
else {
    http_response_code(405); # Method not allowed
}
?>