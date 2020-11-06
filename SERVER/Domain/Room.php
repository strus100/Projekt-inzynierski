<?php
    class Room{
        private $roomID;
        private $title;
        private $admin;

        private $url;
        private $scrollPositionX;
        private $scrollPositionY;
        private $users;

        function __construct($id, $title, $admin){
            $this->roomID = $id;
            $this->title = $title;
            $this->admin = $admin;
        }
    }
?>