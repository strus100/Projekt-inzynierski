<?php
	require_once("DatabaseCreate.php");
	
	class DatabaseConnection {
		public $conn = null;
		
		function connect(){
			$servername = "localhost";
			$username = "root";
			$password = "";
			$dbname = "bazaInz";
			// Create connection
			$conn = new mysqli($servername, $username, $password, $dbname);

			// Check connection
			if ($conn->connect_error) {
				die("Connection failed: " . $conn->connect_error);
			}
		//	echo "Connected successfully<br>";
			return $conn;
		}
		
		 function get_name() {
			return $this->name;
		}
	
		function insertData($conn,$table,$data,$colNames){
				
			$colNamesS = implode(', ', $colNames);
			
			$dataS = implode(', ', $data);
			$dataS = str_replace(",","\",\"",$dataS);
			$dataS =  str_replace(" ","",$dataS);
			
			$sql = "INSERT INTO $table ($colNamesS) VALUES (\"$dataS\")";
			
			if ($conn->query($sql) === TRUE) {
				echo "Row added to $table successfully!<br>";
			} else {
				echo "Error inserting data: " . $conn->error ."<br>";
			}	
		}
		
		function getRow($table,$conn,$id){
			
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$sql = "SELECT * FROM $table WHERE id = '$id'";
		$result = $conn->query($sql);
		print_r( $result);
		
		$row = $result -> fetch_assoc();
		
		return $row;
		}
		
		
		function getRowByToken($table,$conn,$token){
						
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$sql = "SELECT * FROM $table WHERE token = '$token'";
		$result = $conn->query($sql);
		
		$row = $result -> fetch_assoc();
		
		return $row;
		}
		
		function closeConnection($conn){
			$conn->close();
		}
	
	
		function getLastId($conn){
			
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$sql = 'select last_insert_id();';
		$result = $conn->query($sql);
		
		$row = $result -> fetch_assoc();
		
		return $row;
		
		}
		
	
	}
	
	
	
//$db = new DatabaseConnection();
//createDatabase();
//$conn = $db->connect();
//createTable($conn);
//$colNames = ["id", "login", "pass","role","token" ];
//$data = [1,"Daniel","test","Admin","token1"];
//$db->insertData($conn,"userTable",$data,$colNames);
//$data = [2,"Wojtek", "test","User","token2"];
//$db->insertData($conn,"userTable",$data,$colNames);
//print_r( $db->getRow("userTable",$conn,1));
//print_r( $db->getRowByToken("userTable",$conn,"token2"));
//$db->closeConnection($conn);

?>