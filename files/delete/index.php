<?php
require_once __DIR__."/../../database/DatabaseConnection.php";
require_once __DIR__."/../uploads/PdfToHtml.php";

	$dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	$json = file_get_contents('php://input');
	$data = json_decode($json);
	
	$fileName = $data->name;
			
	$nameArray = explode( ".", $fileName );

	$translator = new PdfToHtml( $fileName );
		

	if( $translator->remove() ) {
		$dbConnection->removeFile( $fileName );
		echo $fileName. " deleted (converted)";
	} else {
			
	if(unlink("../uploads/".$fileName)){
		$dbConnection->removeFile( $fileName );
		echo $fileName. " deleted";
	} else {
		echo "Zła nazwa pliku, upewnij się, że podałeś rozszerzenie pliku";
	}
	}
		
	?>

