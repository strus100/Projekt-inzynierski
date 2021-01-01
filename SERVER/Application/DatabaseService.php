<?php
    require_once __DIR__."/../Infrastructure/Database.php";
    require_once __DIR__."/../Entities/RoomEntity.php";
    require_once __DIR__."/../Entities/ClientEntity.php";
    require_once __DIR__."/../Entities/ChatHistoryEntity.php";
    require_once __DIR__."/../Entities/UrlHistoryEntity.php";
    require_once __DIR__."/../../Config.php";

    class DatabaseService{
        private $logger;
        private $database;

        function __construct($logger){
            $this->logger = $logger;
            $this->logger->log("Connecting to database...");
            $this->database = new Database($logger);
        }

        function __destruct(){

        }

        public function getRoomByID($roomID){
            $roomID = htmlspecialchars($roomID);

            $result = $this->database->query("SELECT * FROM `rooms` WHERE `id` = '$roomID';");

            $array = null;
            if($result->num_rows == 1){
                while($row = $result->fetch_assoc()){
                    $room = new RoomEntity($row['id'], $row['roomName'], $row['admin']);
                    $array = $room;
                }
            }else{
                $this->logger->warn("Room not found\tid: $roomID");
            }
            
            return $array;
        }

        public function getClientByToken($token){
            $token = htmlspecialchars($token);

            $result = $this->database->query("SELECT * FROM `usertable` WHERE `token` = '$token';");

            $array = null;
            if($result->num_rows == 1){
                while($row = $result->fetch_assoc()){
                    $client = new ClientEntity($row['login'], $row['role'], $row['name'], $row['surname'], $row['room']);
                    $array = $client;
                }
            }else{
                $this->logger->warn("Client not found\ttoken: $token");
            }

            return $array;
        }

        public function getChatHistoryByRoomID($roomID, $offset=0){
            $sql = "SELECT * FROM `chathistory` WHERE `room`==$roomID ORDER BY `date` DESC LIMIT $offset, ".Config::SELECT_LIMIT;
            $result = $this->database->query($sql);

            $array = array();
            while($row = $result->fetch_assoc()){
                $chatHistory = new ChatHistoryEntity($row['id'], $row['date'], $row['message'], $row['messageType'], $row['user'], $row['room']);
                $array[] = $chatHistory;
            }

            return $array;
        }

        public function getUrlHistoryByUserID($userID, $offset=0){
            $sql = "SELECT * FROM `urlhistory` WHERE `user`==$userID ORDER BY `date` DESC LIMIT $offset, ".Config::SELECT_LIMIT;
            $result = $this->database->query($sql);

            $array = array();
            while($row = $result->fetch_assoc()){
                $urlHistory = new UrlHistoryEntity($row['id'], $row['date'], $row['url'], $row['user']);
                $array[] = $urlHistory;
            }

            return $array;
        }

        public function addMessageToChatHistory($message, $userID, $roomID){
            //$stringDate = $message['date']
            //$sql = "INSERT INTO `chathistory` VALUES (NULL, )"
        }
    }
?>
