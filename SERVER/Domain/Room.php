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

        private $messageHistory;
        private $urlHistory;

        function __construct($id, $title, $adminID){
            $this->roomID = $id;
            $this->title = $title;
            $this->adminID = $adminID;
            $this->clients = array();
            $this->url = "https://google.com";
        }

        public function joinClient($client){
            foreach($this->clients as $connectedClient){
                if($connectedClient->getLogin() == $client->getLogin()){
                    //$this->leaveClient($connectedClient);
                }
            }
            $this->clients[spl_object_hash($client)] = $client;
            if($client->getLogin() == $this->adminID){
                $this->admin = $client;
            }
        }

        public function leaveClient($client){
            $this->clients[spl_object_hash($client)] = null;
            unset($this->clients[spl_object_hash($client)]);
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
            $this->messageHistory[] = $msg;
        }
    }
?>
