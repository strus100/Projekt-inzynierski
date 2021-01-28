<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		require_once __DIR__."/../database/DatabaseConnection.php";

        $roomId = $_GET["roomId"];
		
		$authToken = $_GET["token"];
		
		$DB = new DatabaseConnection();
        $DB->connect();
		
		$databaseToken = $DB->getRoomAuthToken( $roomId );
		if($authToken == $databaseToken ){
		
		
            if( $row = $DB->getRoom( htmlspecialchars($roomId) ) ){
				$login = $row['admin'];
				
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
}else { 
//TODO NAME I SURNAME
return false; }
} else { return false; }

?>