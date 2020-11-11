<?php
    final class RoomEntity{
        public $id;
        public $roomName;
        public $admin;

        function __construct($id, $roomName, $admin){
            $this->id = $id;
            $this->roomName = $roomName;
            $this->admin = $admin;
        }
    }
?>
