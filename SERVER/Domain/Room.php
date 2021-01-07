<?php
    require_once __DIR__."/../Application/LoggerService.php";
    require_once __DIR__."/../ValueObjects/RoomVO.php";

    class Room{
        private $roomID;
        private $title;
        private $adminID;

        private $url;
        private $scrollPositionX;
        private $scrollPositionY;

        private $admin;
        private $clients;

        private $chatHistory;
        private $urlHistory;

        function __construct($id, $title, $adminID){
            $this->roomID = $id;
            $this->title = $title;
            $this->adminID = $adminID;
            $this->clients = array();
            $this->chatHistory = array();
            $this->urlHistory = array();
            $this->url = "http://wmi.amu.edu.pl";

            $this->loadChatHistoryFromDB();
            $this->loadUrlHistoryFromDB();
        }

        public function joinClient($client){
            foreach($this->clients as $connectedClient){
                if($connectedClient->getLogin() == $client->getLogin()){
                    LoggerService::getInstance()->log("Client already connected: ".$connectedClient->getLogin());
                    //$this->leaveClient($connectedClient);
                    //$connectedClient->leave();
                    //$this->leaveClient($connectedClient);

                    ClientService::getInstance()->destroyClientBySocketID($connectedClient->getSocketID());
                    ServerService::getInstance()->destroySocketByID($connectedClient->getSocketID());
                }
            }
            $this->clients[spl_object_hash($client)] = $client;
            if($client->getLogin() == $this->adminID){
                $this->admin = $client;
            }
        }

        public function leaveClient($client){
            /*echo "\r\n\r\n";
            $backtrace = debug_backtrace(3);
            foreach ($backtrace as $item) {
                echo $item['class']."::".$item['function']."\r\n";
            }
            echo "\r\n\r\n";*/
            $this->clients[spl_object_hash($client)] = null;
            unset($this->clients[spl_object_hash($client)]);
        }

        private function loadChatHistoryFromDB(){
            $history = DatabaseService::getInstance()->getChatHistoryByRoomID($this->roomID);

            $array = array();
            for ($i=sizeof($history)-1; $i>=0; $i--) {
                $msg = [
                    "type" => "chat",
                    "chat" => $history[$i]->message,
                    "name" => $history[$i]->name." ".$history[$i]->surname."(".$history[$i]->userID.")",
                    "messagetype" => $history[$i]->messageType,
                    "date" => new DateTime($history[$i]->date)
                ];
                
                $array[] = MessageService::getInstance()->createTextMessage(null, $msg);
            }

            $this->chatHistory = $array;
        }

        private function loadUrlHistoryFromDB(){
            $history = DatabaseService::getInstance()->getUrlHistoryByUserID($this->adminID);

            $array = array();
            foreach ($history as $item) {
                $array[] = $item->url;
            }

            $this->urlHistory = $array;
        }

        // Getters
        public function getRoomID(){
            return $this->roomID;
        }

        public function getRoomName(){
            return $this->title;
        }

        public function getAdminID(){
            return $this->adminID;
        }

        public function getAdmin(){
            return $this->admin;
        }

        public function getUrl(){
            return $this->url;
        }

        public function getScrollPositionX(){
            return $this->scrollPositionX;
        }

        public function getScrollPositionY(){
            return $this->scrollPositionY;
        }

        public function getClients(){
            return $this->clients;
        }

        public function getClientByLogin($login){
            foreach ($this->clients as $value) {
                if($value->getLogin() == $login){
                    return $value;
                }
            }
            return null;
        }

        public function getRoomVO(){
            return new RoomVO($this->title, $this->url, $this->scrollPositionX, $this->scrollPositionY, $this->adminID);
        }

        // Setters
        public function setUrl(string $url){
            $this->url = $url;
        }

        public function setScrollPositionX($position){
            $this->scrollPositionX = $position;
        }

        public function setScrollPositionY($position){
            $this->scrollPositionY = $position;
        }

        public function addMessageToHistory($msg){
            $this->chatHistory[] = $msg;
        }

        public function getMessageHistory(){
            return $this->chatHistory;
        }

        public function addUrlToHistory($url){
            array_unshift($this->urlHistory, $url);
        }

        public function getUrlHistory(){
            return $this->urlHistory;
        }
    }
?>
