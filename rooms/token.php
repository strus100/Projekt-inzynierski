<?php
	
    require_once __DIR__."/../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();

	$roomId = $_GET["id"];
	
	echo $dbConnection->getRoomAuthToken( $roomId );
?>