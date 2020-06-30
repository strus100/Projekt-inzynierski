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
			echo "Connected successfully<br>";
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
			$stmt = $this->conn->prepare("INSERT INTO `usertable` VALUES (?, ?, ?, ?, ?, NULL)");
			$stmt->bind_param('sssss', $login, $name, $surname, $role, $token);
			$stmt->execute();
		}

		function getUserByToken($token){
			return $this->getRowByToken("usertable", $token);
		}

		function getUserByLogin($login){
			$sql = "SELECT * FROM `usertable` WHERE `login`='$login'";
			$result = $this->conn->query($sql);
			return $result->fetch_assoc();
		}

		function updateUserToken($user, $token){
			$stmt = $this->conn->prepare("UPDATE `usertable` SET `token`=? WHERE `login`=?");
			$stmt->bind_param("ss", $token, $user);
			$stmt->execute();
		}

		function getRooms(){
			$sql = "SELECT * FROM `rooms` LEFT JOIN `usertable` ON `admin`=`login`";
			$result = $this->conn->query($sql);
			$rooms = array();
			while($row = $result->fetch_assoc()){
				$room = [
					"id" => $row['id'],
					"roomName" => $row['roomName'],
					"name" => $row['name'],
					"surname" => $row['surname']
				];
				$rooms[] = $room;
			}
			return $rooms;
		}
		
		
		function getRowByToken($table,$conn,$token){
						
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		function selectRoom($roomID){
			$token = htmlspecialchars($_COOKIE['token']);
			$stmt = $this->conn->prepare("UPDATE `usertable` SET `room` = ? WHERE `token`=?");
			$stmt->bind_param("ds", $roomID, $token);
			$stmt->execute();
			
			$sql = "SELECT * FROM `usertable` LEFT JOIN `rooms` ON `room`=`id` WHERE `token`='$token'";
			$result = $this->conn->query($sql);
			if($result->num_rows != 1){
				return false;
			}else{
				return true;
			}
		}
		
		function closeConnection($conn){
			$conn->close();
		}
		
		function deleteRoom($roomID){
			$stmt = $this->conn->prepare("DELETE FROM `rooms` WHERE `id`=?");
			$stmt->bind_param("d", $roomID);
			$stmt->execute();
		}

		function renameRoom($id, $name){
			$stmt = $this->conn->prepare("UPDATE `rooms` SET `roomName`=? WHERE `id`=?");
			$stmt->bind_param("sd", $name, $id);
			$stmt->execute();
		}

		function createFile($fileName, $fileLocation){
			$token = htmlspecialchars($_COOKIE['token']);
			//Uncomment if you want test this by test.html
			//$token = "token1";
			$user = $this->getUserByToken($token);
			$login = $user['login'];
			$stmt = $this->conn->prepare("INSERT INTO `files` VALUES (NULL, ?, ?, ?)");
			$stmt->bind_param("sss", $fileName, $fileLocation, $login);
			$stmt->execute();

			return $this->conn->insert_id;
		}
		
		function removeFile($fileName){
			$stmt = $this->conn->prepare("DELETE FROM `files` WHERE `name`=?");
			$stmt->bind_param("s", $fileName);
			$stmt->execute();

			return $this->conn->insert_id;
		}
		
		function getFile($fileName){
			$sql = "SELECT * FROM `files` WHERE `fileName`='$fileName'";
			$result = $this->conn->query($sql);
			
			if($result->num_rows != 1){
				return false;
			}else{
				return $result->fetch_assoc();
			}
		}
		
		function getFileByOwner(){
			$token = htmlspecialchars($_COOKIE['token']);
			//Uncomment if you want test this by test.html
			//$token = "token1";
			$user = $this->getUserByToken($token);
			$owner = $user['login'];
		
			$sql = "SELECT * FROM `files` WHERE `login`='$owner'";
			$result = $this->conn->query($sql);
			
			if($result->num_rows <= 0){
				return false;
			}else{
				return $result -> fetch_all(MYSQLI_ASSOC);
			}
		}
		
		function isOwner($fileName){
			$token = htmlspecialchars($_COOKIE['token']);
			//Uncomment if you want test this by test.html
			//$token = "token1";
			$user = $this->getUserByToken($token);
			$login = $user['login'];
			
			$sql = "SELECT login FROM `files` WHERE `name`='$fileName'";
			$result = $this->conn->query($sql);
			$result = $result->fetch_assoc();
			
			if($result['login'] == $login){
				return true;
			} else {
				return false;
			}
		}
	}
	
	
?>