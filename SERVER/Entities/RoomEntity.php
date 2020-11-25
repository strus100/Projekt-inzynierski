<?php
    final class RoomEntity{
        public $id;
        public $roomName;
        public $adminID;

        function __construct($id, $roomName, $adminID){
            $this->id = $id;
            $this->roomName = $roomName;
            $this->adminID = $adminID;
        }
    }
?>
