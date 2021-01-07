<?php
    require_once __DIR__."/../Domain/Client.php";

    class ClientService{
        private static $instance;

        private $loggerService;
        private $databaseService;
        private $roomService;

        private $clients;

        function __construct($logger, $database, $client){
            self::$instance = $this;

            $this->loggerService = $logger;
            $this->databaseService = $database;
            $this->roomService = $client;
        }

        public static function getInstance(){
            return self::$instance;
        }

        public function createClient($socketID, $token){
            $clientEntity = $this->databaseService->getClientByToken(htmlspecialchars($token));

            if(!empty($clientEntity)){
                $roomID = $clientEntity->roomID;
                $room = $this->roomService->getRoomByID($roomID);

                if(empty($room)){
                    $this->loggerService->log("Creating room id: $roomID");
                    if(!$this->roomService->createRoom($roomID)){
                        return false;
                    }
                    $room = $this->roomService->getRoomByID($roomID);
                }

                if(!empty($this->clients[$socketID])){
                    $this->loggerService->warn("Client already exists!\tLogin: ".$clientEntity->login." \tSocketID: ".$socketID);
                    return false;
                }

                if(!empty($room->getClientByLogin($clientEntity->login))){
                    return false;
                }

                //login permission name surname room
                if($clientEntity->permission == "pracownik" || $clientEntity->permission == "doktorant"){
                    $client = new Client($clientEntity->login,
                                            PERMISSION::ADMIN,
                                            $clientEntity->name,
                                            $clientEntity->surname,
                                            $room,
                                            $socketID);
                }else{
                    $client = new Client($clientEntity->login,
                                            PERMISSION::USER,
                                            $clientEntity->name,
                                            $clientEntity->surname,
                                            $room,
                                            $socketID);
                }
                $this->clients[$socketID] = $client;
                $room->joinClient($client);

                unset($clientEntity);
                $this->loggerService->log("Client created | Login: ".$client->getLogin()." | Admin: ".($client->isAdmin() ? "TRUE" : "FALSE")." | SocketID: ".$socketID);
                return true;
            }else{
                $this->loggerService->warn("Cannot create new user. \tInvalid token!");
                return false;
            }
        }

        public function destroyClientBySocketID($socketID){
            $client = $this->getClientBySocketID($socketID);
            if($client != null){
                $this->loggerService->log("Destroying client: ".$client->getLogin()." \tSocket: ".$client->getSocketID());
                $this->clients[$socketID] = null;
                unset($this->clients[$socketID]);
                $client->leaveRoom();
            }else{
                $this->loggerService->error("Cannot destroy client - Client not found \tSocketID: $socketID");
            }
        }

        public function getClientBySocketID($socketID){
            if(!empty($this->clients[$socketID])){
                return $this->clients[$socketID];
            }else{
                $this->loggerService->warn("Cannot find user.\tID: $socketID");
                return null;
            }
        }
        
        public function getClientByLogin($login){
            foreach ($this->clients as $item) {
                if($item->getLogin() == $login){
                    return $item;
                }
            }
            return null;
        }

        public function getClientsRoomInfo($socketID){
            $client = $this->getClientBySocketID($socketID);
            if($client){
                return $client->getRoom()->getRoomVO();
            }else{
                return null;
            }
        }
    }
?>
