<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/../Domain/Room.php";

    class RoomService{
        private static $rooms=[];

        public static function createRoom(){
            $rooms[] = new Room();
        }

        public static function getRoomByID($roomID){
            if(self::$rooms[$roomID]){
                return self::$rooms[$roomID];
            }else{
                LoggerService::warn("Room not found: $roomID");
                return null;
            }
        }

        public static function deleteRoom($roomID){
            if(self::$rooms[$roomID]){
                //room delete
            }else{
                LoggerService::warn("Room not found: $roomID");
            }
        }
    }
?>