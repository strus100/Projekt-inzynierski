<?php
    final class ClientEntity{
        public $login;
        public $permission;

        public $name;
        public $surname;
        
        public $roomID;

        function __construct($login, $permission, $name, $surname, $room){
            $this->login = $login;
            $this->permission = $permission;
            
            $this->name = $name;
            $this->surname = $surname;

            $this->roomID = $room;
        }
    }
?>