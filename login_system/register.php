<?php
require_once __DIR__."/../database/DatabaseConnection.php";

session_start();

$db = new DatabaseConnection();
$conn = $db->connect();

// Now we check if the data from the login form was submitted, isset() will check if the data exists.
if ( !isset($_POST['username'], $_POST['password'],$_POST['passwordTwo']) ) {
	// Could not get the data that should have been sent.
	exit('Please fill both the username and password fields!');
}

// Check if password are the same value
if ($_POST['password'] == $_POST['passwordTwo']) {

$colNames = ["id", "login", "pass","role","token" ];
$data = ["",$_POST['username'],password_hash($_POST['password']),"User",""];
$db->insertData($conn,"userTable",$data,$colNames);
}else{
	echo 'passwords do not match';
}

?>
