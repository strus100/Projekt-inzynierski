<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		require_once __DIR__."/../database/DatabaseConnection.php";

        $login = $_GET["login"];
		
		$authToken = $_GET["token"];
		
 	
		$DB = new DatabaseConnection();
        $DB->connect();
		
		$databaseToken = $DB->getLoginAuthToken( $login );
		if($authToken == $databaseToken ){
		
		$DB = new DatabaseConnection();
        $DB->connect();
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
		} else { 
		//TODO NAME I SURNAME
		return false; } 
} else { return false; }


?>