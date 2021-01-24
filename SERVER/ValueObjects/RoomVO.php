<?php
    final class RoomVO{
        public $roomName;
        public $url;
        public $scrollX;
        public $scrollY;
        public $adminID;

        function __construct($roomName, $url, $scrollX, $scrollY, $adminID){
            $this->roomName = $roomName;
            $this->url = $url;
            $this->scrollX = $scrollX;
            $this->scrollY = $scrollY;
            $this->adminID = $adminID;
        }
    }
?>