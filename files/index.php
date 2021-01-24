<?php
	require_once __DIR__."/../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	echo json_encode($dbConnection->getFileByOwner());
	
?>
