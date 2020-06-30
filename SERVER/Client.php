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
        private $nick;

        private $muted;

        function __construct($socket, $token){
            $this->socket = $socket;
            $this->token = htmlspecialchars($token);
            $this->muted = false;
        }

        function __destruct(){
            $this->leaveRoom();
            fclose($this->socket);
        }

        // Checks if user has admin privileges and gets user infos
        public function authorize(){
            $DB = new DatabaseConnection();
            $conn = $DB->connect();
            if(($row = $DB->getRowByToken('usertable', $conn, $this->token))){
                $this->nick = $row['login'];
                if($row['role'] == "Admin"){
                    $this->permission = PERMISSION::ADMIN;
                }else{
                    $this->permission = PERMISSION::USER;
                }
                $DB->closeConnection($conn);
                return true;
            }else{
                $DB->closeConnection($conn);
                return false;
            }
        }

        public function get_nick(){
            return $this->nick;
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