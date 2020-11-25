<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		require_once __DIR__."/../database/DatabaseConnection.php";

        $userToken = $_GET["token"];
		$DB = new DatabaseConnection();
        $DB->connect();
            if( $row = $DB->getUserByToken( htmlspecialchars($userToken) ) ){
				if (!isset($user)) { 
					$user = new stdClass();
				}
				
                $user->login = $row['login'];
                $user->name = $row['name'];
                $user->surname = $row['surname'];		
				$user->email = $row['email'];
				$DB->closeConnection();
				
				echo json_encode($user);
            }else{
               $DB->closeConnection();
                return false;
            }
} else { return false; }

?>