<?php
    require_once __DIR__."/../database/DatabaseConnection.php";

    class Room{
        private $url;
        private $scrollX;
        private $scrollY;

        private $roomID;
        private $roomName;
        private $adminID;

        private $admin;
        private $clients;

        function __construct($roomID){
            $db = new DatabaseConnection();
            $db->connect();
            if(($room = $db->getRoom($roomID))){
                $this->roomID = $roomID;
                $this->adminID = $room['admin'];
                $this->roomName = $room['roomName'];
            }
            $db->closeConnection();
        }

        function __destruct(){

        }

        public function join($client){
            if(!in_array($client, $this->clients)){
                $this->clients[] = $client;

                if($client->get_login() == $this->adminID){
                    $this->admin = $client;
                }
            }
        }

        public function leave($client){
            if(($key = array_search($client, $this->$clients, TRUE))){
                array_splice($this->clients, $key, 1);
            }
        }

        //Getters
        public function getRoomID(){
            return $this->roomID;
        }

        public function getRoomName(){
            return $this->roomName;
        }

        public function getAdminID(){
            return $this->adminID;
        }
        
        public function getAdmin(){
            return $this->admin;
        }

        public function getClients(){
            return $this->clients;
        }

        public function getUrl(){
            return $this->url;
        }

        public function getScrollX(){
            return $this->scrollX;
        }

        public function getScrollY(){
            return $this->scrollY;
        }

        //Setters
        public function setUrl($url){
            $this->url = $url;
        }

        public function setScrollX($scrollX){
            $this->scrollX = $scrollX;
        }

        public function setScrollY($scrollY){
            $this->scrollY = $scrollY;
        }
    }
?>