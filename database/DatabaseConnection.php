<?php
	require_once("DatabaseCreate.php");
	require_once __DIR__."/../Config.php";

	
	class DatabaseConnection {
		public $conn = null;
		
		function connect(){
			// Create connection
			$this->conn = new mysqli( 
			Config::DB_SERVER_NAME,
			Config::DB_USERNAME,
			Config::DB_PASSWORD,
			Config::DB_NAME
			);
			$this->conn->set_charset("UTF8");
			$this->conn->query("SET NAMES UTF8");

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

		function insertUser($login, $name, $surname, $role, $token=NULL, $email){
	//		$stmt = $this->conn->prepare("INSERT INTO `usertable` VALUES (?, ?, ?, ?, NULL, ?, ?)");
	//		$roomId = 0;
	//		$stmt->bind_param('sssssis', $login, $name, $surname, $role, $token, $roomId ,$email);
			
	//		$stmt->execute();
		
			$sql  = "INSERT INTO `usertable` (`login`, `name`, `surname`, `role`, `token`, `room`, `email`) VALUES ('".$login."', '".$name."', '".$surname."', '".$role."', '".$token."', 0, '".$email."')";
			$this->conn->query($sql);
			
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
					"surname" => $row['surname'],
					"login" => $row['admin']
				];
				$rooms[] = $room;
			}
			return $rooms;
		}

		function createRoom($roomName){
			$token = htmlspecialchars($_COOKIE['token']);
			$user = $this->getUserByToken($token);
			$login = $user['login'];

			$stmt = $this->conn->prepare("INSERT INTO `rooms` VALUES (NULL, ?, ?)");
			$stmt->bind_param("ss", $roomName, $login);
			$stmt->execute();

			return $this->conn->insert_id;
		}

		function createRoomTest( $roomName, $login ){
            $stmt = $this->conn->prepare("INSERT INTO `rooms` VALUES (NULL, ?, ?)");
            $stmt->bind_param("ss", $roomName, $login);
            $stmt->execute();

            return $this->conn->insert_id;
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

		function getRoom($roomID){
			$sql = "SELECT * FROM `rooms` WHERE `id`=$roomID";
			$result = $this->conn->query($sql);
			if($result->num_rows != 1){
				return false;
			}else{
				return $result->fetch_assoc();
			}
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
				return [];
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
		
		function createAttendance( $roomID, $list ){
			$date = new DateTime("NOW");
			$date = $date->format("Y-m-d H:i:s");
			
			$room = $this->getRoom($roomID);
			$roomName = $room['roomName'];
			$rand = substr(md5(rand().microtime().rand()), 0, 3);
			$attendanceListName = $roomName."_".$date."_".$rand;
            
			$sql = "INSERT INTO `timesheet` VALUES (NULL, '$date', '$attendanceListName', '$roomID')";
			$result = $this->conn->query($sql);
			
			$last_id = $this->conn->insert_id;

			foreach ($list as $key => $value) {
				$name = $value['name'];
				$subStart = strpos($name, "(")+1;
				$size = strlen($name)-1 - $subStart;
				$login = substr($name, $subStart, $size);
				$sql = "INSERT INTO `timesheetuser` VALUES (NULL, '$last_id', '$login')";
				$result = $this->conn->query($sql);

				/*if($result == false){
					echo $this->conn->error."\r\n";
				}*/
			}
		}
		
		function getAttendance( $roomID, $name ){
			$sql = "SELECT * FROM `timesheetuser` JOIN `timesheet` ON `timesheet`.`id`=`timesheetuser`.`timesheet` JOIN `usertable` ON `usertable`.`login`=`timesheetuser`.`user` WHERE `timesheet`.`name`='$name' AND `timesheet`.`room`='$roomID' ORDER BY `usertable`.`surname` ASC, `usertable`.`name` ASC, `usertable`.`login` ASC";
			$result = $this->conn->query($sql);
			// if($result == false){
			// 	echo $this->conn->error."\r\n";
			// }

            $resultSet = array();
            while ($cRecord = $result->fetch_assoc() ) {
				$tmp = [
					"name" => $cRecord['name'],
					"surname" => $cRecord['surname'],
					"login" => $cRecord['login']
				];
                $resultSet[] = $tmp;
            }
            return $resultSet;
			}

		function getAllAttendanceListsByRoom( $roomID ){
			$sql = "SELECT * FROM `timesheet` WHERE `room` = '$roomID';";
			$result = $this->conn->query($sql);
			
			// if($result == false){
			// 	echo "[]";
			// 	echo $this->conn->error."\r\n";
			// }

			$array = array();
			
			while($row = $result->fetch_assoc()){
				$item = [
					"id" => $row['id'],
					"date" => $row['date'],
					"name" => $row['name']
				];
				$array[] = $item;
			}

			return $array;
		}
	}
		
?>