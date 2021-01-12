<?php
require_once __DIR__."/../../database/DatabaseConnection.php";
require_once __DIR__."/../uploads/PdfToHtml.php";

	$dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	$json = file_get_contents('php://input');
	$data = json_decode($json);
	
	$fileName = $data->fileName;
	//$token = $data->token;
	$token = htmlspecialchars($_COOKIE['token']);
			
	if($dbConnection->isOwner($fileName, $token)){
	
		$nameArray = explode( ".", $fileName );
		if( $nameArray[1] == "pdf" ){
			$dbConnection->removeFile($fileName, $databasePath);
				
			$translator = new PdfToHtml( $fileName );
			$translator->remove();
		} else {
	
			if(unlink("../uploads/".$fileName)){
				$databasePath = "/files/uploads/".$fileName;
				$dbConnection->removeFile($fileName, $databasePath);
				echo $fileName. " deleted";
			} else {
				echo "Zła nazwa pliku, upewnij się, że podałeś rozszerzenie pliku";
			}
		}
	} else {
		echo "Nie jesteś właścicielem tego pliku";
	}
?>

