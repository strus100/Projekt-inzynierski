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

        function __construct($login, $permission, $name, $surname, $room){
            $this->login = $login;
            $this->permission = $permission;

            $this->name = $name;
            $this->surname = $surname;

            $this->room = $room;
        }

        public function authorize(){

            return false;
        }

        public function mute(){

        }

        public function unMute(){

        }

        public function sendMessage(){
            
        }

        public function isAdmin(){
            return $this->permission == PERMISSION::ADMIN;
        }

        public function getLogin(){
            return $this->login;
        }
    }
?>
