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

        function __construct($id, $title, $adminID){
            $this->roomID = $id;
            $this->title = $title;
            $this->adminID = $adminID;
            $this->clients = array();
        }

        public function joinClient($client){
            foreach($this->clients as $connectedClient){
                if($connectedClient->getLogin() == $client->getLogin()){
                    
                }
            }
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

        public function getRoomVO(){
            return new RoomVO($this->title, $this->url, $this->scrollPositionX, $this->scrollPositionY, $this->adminID);
        }
    }
?>
