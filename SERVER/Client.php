<?php
    // Small client class

    require_once __DIR__."/../database/DatabaseConnection.php";

    abstract class PERMISSION{
        const USER = 1;
        const ADMIN = 2;
    }

    class Client{
        private $socket;
        private $token;
        private $permission;
        
        private $login;
        private $name;
        private $surname;
        
        private $roomID;
        private $room;

        private $muted;

        function __construct($socket, $token){
            $this->socket = $socket;
            $this->token = htmlspecialchars($token);
            $this->muted = false;
        }

        function __destruct(){
            fclose($this->socket);
        }

        // Checks if user has admin privileges and gets user infos
        public function authorize(){
            $DB = new DatabaseConnection();
            $DB->connect();
            if(($row = $DB->getUserByToken($this->token))){
                $this->login = $row['login'];
                $this->name = $row['name'];
                $this->surname = $row['surname'];

                if($row['role'] == "pracownik" || $row['role'] == "doktorant"){
                    $this->permission = PERMISSION::ADMIN;
                }else{
                    $this->permission = PERMISSION::USER;
                }

                $this->roomID = $row['room'];
                
                $DB->closeConnection();
                return true;
            }else{
                $DB->closeConnection();
                return false;
            }
        }

        public function get_login(){
            return $this->login;
        }

        public function getName(){
            return $this->name;
        }

        public function getSurname(){
            return $this->surname;
        }

        public function get_socket(){
            return $this->socket;
        }

        public function isAdmin(){
            return $this->permission == PERMISSION::ADMIN;
        }

        public function joinRoom($room){
            $this->room = $room;
            $room->join($this);
        }

        public function leaveRoom(){
            if($this->room){
                $this->room->leave($this);
                $this->room = null;
            }
        }

        public function getRoomID(){
            return $this->roomID;
        }

        public function getRoom(){
            return $this->room;
        }

        public function mute(){
            $this->muted = true;
        }

        public function unMute(){
            $this->muted = false;
        }

        public function isMuted(){
            return $this->muted;
        }
    }
?>