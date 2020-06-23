<?php 
	require_once __DIR__."/../../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	
    if($_SERVER['REQUEST_METHOD'] == "POST"){
		$request_body = file_get_contents('php://input');
		  
  $data = json_decode($request_body, true);
		
	print_r ( $data);
		if(isset($data['file'])){
			$countfiles = count($data['file']);
			for($i=0;$i<$countfiles;$i++){
			$fileName = htmlspecialchars($data['file'][$i]['name']);
			$fileLocation = htmlspecialchars($data['file'][$i]['location']);
			$dbConnection->deleteFile($fileName);
 			$dbConnection->createFile($fileName,$fileLocation);
			}

	}
}
 ?>
