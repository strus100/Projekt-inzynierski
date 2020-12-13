<?php
    abstract class PERMISSION{
        const USER = 1;
        const ADMIN = 2;
    }

    class Client{
        private $login;
        private $permission;

        private $name;
        private $surname;

        private $room;
        private $socketID;

        private $isMuted;

        function __construct($login, $permission, $name, $surname, $room, $socketID){
            $this->login = $login;
            $this->permission = $permission;

            $this->name = $name;
            $this->surname = $surname;

            $this->room = $room;
            $this->socketID = $socketID;

            $this->isMuted = false;
        }

        function __destruct(){
            $this->leaveRoom();
        }

        public function authorize(){
            echo "DONT USE THIS FUNCTION!!! (Client.php->authorize())";
            return false;
        }

        public function mute(){
            $this->isMuted = true;
        }

        public function unMute(){
            $this->isMuted = false;
        }

        public function leaveRoom(){
            if($this->room){
                $this->room->leaveClient($this);
                $this->room = null;
            }
        }

        public function sendMessage(){
            
        }

        public function isAdmin() : bool{
            return $this->permission == PERMISSION::ADMIN;
        }

        public function isMuted() : bool{
            return $this->isMuted;
        }

        // Getters
        public function getLogin() : string{
            return $this->login;
        }

        public function getName() : string{
            return $this->name;
        }

        public function getSurname() : string{
            return $this->surname;
        }

        public function getRoom() : Room{
            return $this->room;
        }

        public function getSocketID(){
            return $this->socketID;
        }
    }
?>
