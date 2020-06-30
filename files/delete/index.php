<?php
require_once __DIR__."/../../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	if($dbConnection->isOwner($_POST["fileName"])){
		if(unlink("../uploads/".$_POST["fileName"])){
			$databasePath = "/files/uploads/".$_POST["fileName"];
			$dbConnection->removeFile($_POST["fileName"], $databasePath);
			echo $_POST["fileName"]. " deleted";
		} else {
			echo "Zła nazwa pliku, upewnij się, że podałeś rozszerzenie pliku";
		}
	} else {
		echo "Nie jesteś właścicielem tego pliku";
	}
?>

