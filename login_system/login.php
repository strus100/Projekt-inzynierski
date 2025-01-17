<?php

use JetBrains\PhpStorm\Pure;

require_once __DIR__."/../database/DatabaseConnection.php";
    require_once __DIR__."/ldap.php";

    $TEST = TRUE;


function isStudent( $login )
{
    return strpos( strtolower( $login ), 'student' );
}

function isAdmin( $login )
{
    return strpos( strtolower( $login ), 'pracownik' );
}

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
    $refreshToken = md5(rand().microtime().rand());
    $accessToken = md5(rand().microtime().rand());
    $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;

    // If token is present check if exists in DB and refresh token
    if(isset($_COOKIE['token'])){
        $user = $dbConnection->getUserByToken(htmlspecialchars($_COOKIE['token']));
        if($user){
			if(isset($_GET['logout'])){
				$dbConnection->updateUserToken($user['login'], "");
				setcookie("token", "", time()-3600, "/", $domain, false, true);
				$dbConnection->closeConnection();
				die("1");
			}
            $dbConnection->updateUserToken($user['login'], $refreshToken);
            setcookie("token", $refreshToken, time()+3600, "/", $domain, false, true);
			$return = [
				"type" => "login",
				"login" => $user['login'],
				"access" => $user['role'],
				"name" => $user['name'],
				"surname" => $user['surname'],
                'userToken' => $dbConnection->getLoginAuthToken($user['login'])    
			];
            $dbConnection->closeConnection();
            die(json_encode($return));
        }else{
            $dbConnection->closeConnection();
            setcookie("token", "", time()-3600, "/", $domain, false, true);
            header("X-PHP-Response-Code: 401", true, 401);
            die("{\"type\": \"login\", \"login\": 0, \"access\": \"token\"}");
        }
    }
    // react and axios input parsing
    //LDAP login
    else{
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        if(isset($data['login']) && isset($data['pwd'])){
            $login = htmlspecialchars($data['login']);
            $password = htmlspecialchars($data['pwd']);
            
			$result = null;
            
			
                if( !(isStudent( $login ) === false) )
                {
					$dbConnection->setLoginAuthToken( $login );

					$result = [
                        "type" => "login",
                        "login" => $login,
                        "access" => "student",
                        "name" => "Student",
                        "surname" => "Student",
						"email" => $login."@test.pl"
                    ];
					
                }
                elseif( !(isAdmin( $login ) === false) )
                {
						$dbConnection->setLoginAuthToken( $login  );

						$result = [
                        "type" => "login",
                        "login" => $login,
                        "access" => "pracownik",
                        "name" => "Pracownik",
                        "surname" => "Admin",
						"email" => $login."@test.pl"
                    ];
                }else{
					echo "ldapTEST";
					$dbConnection->setLoginAuthToken( $login  );

					$result = LDAP::login($login, $password);
                }

            if($result['login'] != '0'){
                $user = $dbConnection->getUserByLogin($login);
                // If user exists in DB update token | if not -> insert user
                if($user){
                    $dbConnection->updateUserToken($user['login'], $refreshToken);
					$dbConnection->setLoginAuthToken( $login  );
				}else{
                    $dbConnection->insertUser($login, $result['name'], $result['surname'], $result['access'], $refreshToken, $result['email'] );
					$dbConnection->setLoginAuthToken( $login  );
                }
                setcookie("token", $refreshToken, time()+3600, "/", $domain, false, true);
                $result['token'] = $refreshToken;
                $result['login'] = $login;
            }
            $result['userToken'] = $dbConnection->getLoginAuthToken($login);
            $dbConnection->closeConnection();
            echo json_encode($result);
        }
        else{
            $result = [
                "type" => "login",
                "login" => 0,
                "access" => "login"
            ];
            $dbConnection->closeConnection();
            echo json_encode($result);
        }
    }
?>