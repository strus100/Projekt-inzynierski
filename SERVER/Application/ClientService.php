<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/DatabaseService.php";
    require_once __DIR__."/../Domain/Client.php";

    class ClientService{
        private static $clients;

        public static function createClient($token){
            $clientEntity = DatabaseService::getClientByToken(htmlspecialchars($token));

            if(!empty($clientEntity)){
                //login permission name surname room
                if($clientEntity->permission == "pracownik" || $clientEntity->permission == "doktorant"){
                    $client = new Client($clientEntity->login,
                                            PERMISSION::ADMIN,
                                            $clientEntity->name,
                                            $clientEntity->surname);
                }else{
                    $client = new Client($clientEntity->login,
                                            PERMISSION::USER,
                                            $clientEntity->name,
                                            $clientEntity->surname);
                }
                self::$clients[$client->login] = $client;
            }else{
                LoggerService::warn("Cannot create new user.\tInvalid token!");
            }
        }
    }
?>