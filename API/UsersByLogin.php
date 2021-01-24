<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		require_once __DIR__."/../database/DatabaseConnection.php";

        $login = $_GET["login"];
		
		//$token = $_GET["token"];
//USUN GDY WSZYSCY DODDZĄ TOKEN I ODKOMENTUJ TO Z GÓRY
		if(isset($_GET['token'])) { 
			$token = $_GET["token"];
		
		} else {
			$token = "f513297c48cbd3d7400538e747ea9c5a";
		}
// 		
		if($token == "f513297c48cbd3d7400538e747ea9c5a")
		{

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
		} else { return false; } 
} else { return false; }


?>