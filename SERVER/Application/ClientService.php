<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/DatabaseService.php";
    require_once __DIR__."/RoomService.php";
    require_once __DIR__."/../Domain/Client.php";

    class ClientService{
        private static $clients;

        public static function createClient($socketID, $token){
            $clientEntity = DatabaseService::getClientByToken(htmlspecialchars($token));

            if(!empty($clientEntity)){
                $roomID = $clientEntity->roomID;
                $room = RoomService::getRoomByID($roomID);

                if(empty($room)){
                    LoggerService::log("Creating room id: $roomID");
                    RoomService::createRoom($roomID);
                    RoomService::getRoomByID($roomID);
                }

                if(!empty(self::$clients[$socketID])){
                    LoggerService::warn("Client already exists!\tLogin: ".$clientEntity->login." \tSocketID: ".$socketID);
                    return null;
                }

                //login permission name surname room
                if($clientEntity->permission == "pracownik" || $clientEntity->permission == "doktorant"){
                    $client = new Client($clientEntity->login,
                                            PERMISSION::ADMIN,
                                            $clientEntity->name,
                                            $clientEntity->surname,
                                            $room);
                }else{
                    $client = new Client($clientEntity->login,
                                            PERMISSION::USER,
                                            $clientEntity->name,
                                            $clientEntity->surname,
                                            $room);
                }
                self::$clients[$socketID] = $client;

                unset($clientEntity);
                LoggerService::log("Client created.\tLogin: ".$client->getLogin()." \tSocketID: ".$socketID);
            }else{
                LoggerService::warn("Cannot create new user.\tInvalid token!");
            }
        }

        public static function getClientBySocketID($socketID){
            if(!empty(self::$clients[$socketID])){
                return self::$clients[$socketID];
            }else{
                LoggerService::warn("Cannot find user.\tID: $socketID");
                return null;
            }
        }
    }
?>
