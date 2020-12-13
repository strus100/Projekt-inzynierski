<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		require_once __DIR__."/../database/DatabaseConnection.php";

        $roomId = $_POST["roomId"];
		$DB = new DatabaseConnection();
        $DB->connect();
            if( $row = $DB->getRoom( htmlspecialchars($roomId) ) ){
				$login = $row['login'];
				
				if( $row2 = $DB->getUserByLogin( htmlspecialchars($login) ) ){
					 if (!isset($user)) { 
					$user = new stdClass();
				}
				
                $user->login = $row2['login'];
                $user->name = $row2['name'];
                $user->surname = $row2['surname'];		
				$user->email = $row2['email'];
				$user->token = $row2['token'];
				$DB->closeConnection();
				
				echo json_encode($user);
            }else{
               $DB->closeConnection();
                return false;
            }
				
				
            }else{
               $DB->closeConnection();
                return false;
            }
} else { return false; }

?>