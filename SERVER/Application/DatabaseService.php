<?php
    require_once __DIR__."/../Infrastructure/Database.php";
    require_once __DIR__."/../Entities/RoomEntity.php";
    require_once __DIR__."/../Entities/ClientEntity.php";
    require_once __DIR__."/../Entities/ChatHistoryEntity.php";
    require_once __DIR__."/../Entities/UrlHistoryEntity.php";
    require_once __DIR__."/../../Config.php";

    class DatabaseService{
        private static $instance;

        private $logger;
        private $database;

        function __construct($logger){
            self::$instance = $this;

            $this->logger = $logger;
            $this->logger->log("Connecting to database...");
            $this->database = new Database($logger);
        }

        function __destruct(){

        }

        public static function getInstance(){
            return self::$instance;
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
            $sql = "SELECT * FROM `chathistory` LEFT JOIN `usertable` ON `usertable`.`login` = `chathistory`.`user` WHERE `chathistory`.`room`=$roomID ORDER BY `date` DESC LIMIT $offset, ".Config::SELECT_LIMIT;
            $result = $this->database->query($sql);

            $array = array();
            while($row = $result->fetch_assoc()){
                $chatHistory = new ChatHistoryEntity($row['id'], $row['date'], $row['message'], $row['messagetype'], $row['user'], $row['name'], $row['surname'], $row['room']);
                $array[] = $chatHistory;
            }

            return $array;
        }

        public function getUrlHistoryByUserID($userID, $offset=0){
            $sql = "SELECT * FROM `urlhistory` WHERE `user`='$userID' ORDER BY `date` DESC LIMIT $offset, ".Config::SELECT_LIMIT;
            $result = $this->database->query($sql);

            $array = array();
            while($row = $result->fetch_assoc()){
                $urlHistory = new UrlHistoryEntity($row['id'], $row['date'], $row['url'], $row['user']);
                $array[] = $urlHistory;
            }

            return $array;
        }

        public function addMessageToChatHistory(MessageVO $messageVO){
            $date = $messageVO->date->format("Y-m-d H:i:s");
            $sql = "INSERT INTO `chathistory` VALUES (NULL, '$date', '$messageVO->text', '$messageVO->type', '$messageVO->author', '$messageVO->room')";
            $result = $this->database->query($sql);

            if(!$result){
                $this->logger->warn("Cannot add message to Database");
            }
        }

        public function addUrlToHistory(string $url, $login){
            $url = urldecode($url);
            $date = new DateTime("NOW");
            $date = $date->format("Y-m-d H:i:s");
            $sql = "INSERT INTO `urlhistory` VALUES (NULL, '$date', '$url', '$login')";
            $result = $this->database->query($sql);

            if(!$result){
                $this->logger->warn("Cannot add url to Database");
            }
        }
    }
?>
