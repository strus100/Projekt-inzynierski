<?php 
	require_once __DIR__."/../../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
	// Set Upload Path
	$target_dir = './../uploaded_files/';

	
    if($_SERVER['REQUEST_METHOD'] == "POST"){
	
	$request_body = file_get_contents('php://input');
		  
	$data = json_decode($request_body, true);
		
		if(isset($data['file'])){
			$countfiles = count($data['file']);
			for($i=0;$i<$countfiles;$i++){
				$original_filename = $data['file']['name'][$key];
				$target = $target_dir . basename($original_filename);
				$tmp  = $data['fileUpload']['tmp_name'][$key];
				if(unlink($tmp, $target)){
					$dbConnection->deleteFile($original_filename, $target);
				}
			}
		}
	}


 ?>
