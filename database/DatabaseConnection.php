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
			$this->conn = new mysqli($servername, $username, $password, $dbname);

			// Check connection
			if ($this->conn->connect_error) {
				die("Connection failed: " . $this->conn->connect_error);
			}
		}
		
		function get_name() {
			return $this->name;
		}
	
		function insertData($table,$data,$colNames){
			$colNamesS = implode(', ', $colNames);
			
			$dataS = implode(', ', $data);
			$dataS = str_replace(",","\",\"",$dataS);
			$dataS =  str_replace(" ","",$dataS);
			
			$sql = "INSERT INTO $table ($colNamesS) VALUES (\"$dataS\")";
			
			if ($this->conn->query($sql) === TRUE) {
				echo "Row added to $table successfully!<br>";
			} else {
				echo "Error inserting data: " . $this->conn->error ."<br>";
			}	
		}
		
		function getRow($table,$id){
			if ($this->conn->connect_error) {
				die("Connection failed: " . $this->conn->connect_error);
			}

			$sql = "SELECT * FROM $table WHERE id = '$id'";
			$result = $this->conn->query($sql);
			print_r($result);
			
			$row = $result -> fetch_assoc();
			
			return $row;
		}
		
		function getRowByToken($table,$token){
			if ($this->conn->connect_error) {
				die("Connection failed: " . $this->conn->connect_error);
			}

			$sql = "SELECT * FROM $table WHERE `token` = '$token'";
			$result = $this->conn->query($sql);
			if($result->num_rows != 1){
				echo "Error num rows: ".$result->num_rows."\r\n";
				echo $token;
				return false;
			}
			
			$row = $result->fetch_assoc();
			
			return $row;
		}
		
		function closeConnection(){
			$this->conn->close();
		}
	
		function getLastId(){		
			if ($this->conn->connect_error) {
				die("Connection failed: " . $this->conn->connect_error);
			}

			$sql = 'select last_insert_id();';
			$result = $this->conn->query($sql);
			
			$row = $result -> fetch_assoc();
			
			return $row;
		}

		function insertUser($login, $name, $surname, $role, $token=NULL){
			$stmt = $this->conn->prepare("INSERT INTO `userTable` VALUES (?, ?, ?, ?, ?)");
			$stmt->bind_param('sssss', $login, $name, $surname, $role, $token);
			$stmt->execute();
		}

		function getUserByToken($token){
			return $this->getRowByToken("userTable", $token);
		}

		function getUserByLogin($login){
			$sql = "SELECT * FROM `userTable` WHERE `login`='$login'";
			$result = $this->conn->query($sql);
			return $result->fetch_assoc();
		}

		function updateUserToken($user, $token){
			$stmt = $this->conn->prepare("UPDATE `userTable` SET `token`=? WHERE `login`=?");
			$stmt->bind_param("ss", $token, $user);
			$stmt->execute();
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