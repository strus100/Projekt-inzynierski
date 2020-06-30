<?php
	require_once __DIR__."/../../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
	
$total = count($_FILES['files']['name']);
for( $i=0 ; $i < $total ; $i++ ) {
  $tmpFilePath = $_FILES['files']['tmp_name'][$i];

  if ($tmpFilePath != ""){
    $name = $_FILES['files']['name'][$i];
	$newFilePath = "../uploads/" . $_FILES['files']['name'][$i];
	$databasePath = "/files/uploads/".$_FILES['files']['name'][$i];
	if(!file_exists($newFilePath)){
		if(move_uploaded_file($tmpFilePath, $newFilePath)) {
			$dbConnection->createFile($_FILES['files']['name'][$i], $databasePath);
			echo "Plik $name został przesłany na serwer<br>";
		}
  } else {
	
	echo "Plik o nazwie $name istnieje na serwerze<br>";
  }
  }
}
?>
