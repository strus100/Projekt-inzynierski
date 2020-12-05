<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		require_once __DIR__."/../database/DatabaseConnection.php";

        $userLogin = $_GET["login"];
		$DB = new DatabaseConnection();
        $DB->connect();
            if( $row = $DB->getUserByLogin( htmlspecialchars($userLogin) ) ){
				if (!isset($user)) { 
					$user = new stdClass();
				}
				
                $user->login = $row['login'];
                $user->name = $row['name'];
                $user->surname = $row['surname'];		
				$user->email = $row['email'];
				$user->token = $row['token'];
				$DB->closeConnection();
				
				echo json_encode($user);
            }else{
               $DB->closeConnection();
                return false;
            }
} else { return false; }

?>