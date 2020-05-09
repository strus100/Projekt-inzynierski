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
				$colNamesS = join(', ', $colNames);
				
				for($i = 0; $i < 2 ; $i++){
				
				$dataS = join('"," ', $data[$i]);
				$sql = "INSERT INTO $table ($colNamesS) VALUES (\"$dataS\")";
				
				if ($conn->query($sql) === TRUE) {
					echo "Row $i added to $table successfully!<br>";
				} else {
					echo "Error inserting data: " . $conn->error ."<br>";
				}
				}
				
		}
		
		function getRow($table,$conn){
			
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$sql = "SELECT * FROM $table";
		$result = $conn->query($sql);
		
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
	}
	
//$db = new DatabaseConnection();
//createDatabase();
//$conn = $db->connect();
//createTable($conn);
//$colNames = ["id", "login", "pass","role","token" ];
//$data = [[1,"Daniel","test","Admin","token"],[2,"Wojtek", "test","User","token"]];
//$db->insertData($conn,"userTable",$data,$colNames);
//echo $db->getRow("userTable",$conn);
//echo $db->getRowByToken("userTable",$conn,"token");
//$db->closeConnection($conn);

?>