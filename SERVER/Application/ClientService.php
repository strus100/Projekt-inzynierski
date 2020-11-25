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
                    if(!RoomService::createRoom($roomID)){
                        return false;
                    }
                    $room = RoomService::getRoomByID($roomID);
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
                $room->joinClient($client);

                unset($clientEntity);
                LoggerService::log("Client created | Login: ".$client->getLogin()." | Admin: ".($client->isAdmin() ? "1" : "0")." | SocketID: ".$socketID);
                return true;
            }else{
                LoggerService::warn("Cannot create new user. \tInvalid token!");
                return false;
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
        
        public static function getClientsRoomInfo($socketID){
            $client = self::getClientBySocketID($socketID);
            if($client){
                return $client->getRoom()->getRoomVO();
            }else{
                return null;
            }
        }
    }
?>
