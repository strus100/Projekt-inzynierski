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
	
$total = count($_FILES['files']['name']);
for( $i=0 ; $i < $total ; $i++ ) {
  $tmpFilePath = $_FILES['files']['tmp_name'][$i];

  if ($tmpFilePath != ""){
    $name = $_FILES['files']['name'][$i];

	$newFilePath = "../uploads/" . $_FILES['files']['name'][$i];
	
	$nameArray = explode( ".", $name );
	
	if( $nameArray[1] == "pdf" ){
		$nameToSave = $nameArray[0].".html";
	} else {
		$nameToSave = $name;
	}
	
	$databasePath = "/files/uploads/".$nameToSave;
		if(move_uploaded_file($tmpFilePath, $newFilePath)) {
			$dbConnection->createFile($_FILES['files']['name'][$i], $databasePath);
			echo "Plik $name został przesłany na serwer<br>";
		}  
  }
}
?>
