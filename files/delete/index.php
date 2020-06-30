<?php
require_once __DIR__."/../../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	$json = file_get_contents('php://input');
	$data = json_decode($json);
	
	$fileName = $data->fileName;
	$token = $data->token;
	//$token = htmlspecialchars($_COOKIE['token']);
			
	if($dbConnection->isOwner($fileName, $token)){
		if(unlink("../uploads/".$fileName)){
			$databasePath = "/files/uploads/".$fileName;
			$dbConnection->removeFile($fileName, $databasePath);
			echo $fileName. " deleted";
		} else {
			echo "Zła nazwa pliku, upewnij się, że podałeś rozszerzenie pliku";
		}
	} else {
		echo "Nie jesteś właścicielem tego pliku";
	}
?>

