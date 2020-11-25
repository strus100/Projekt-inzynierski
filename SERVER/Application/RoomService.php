<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/../Domain/Room.php";

    class RoomService{
        private static $rooms=[];

        public static function createRoom($roomID){
            $roomEntity = DatabaseService::getRoomByID($roomID);

            if(!empty($roomEntity)){
                if(!empty(self::$rooms[$roomID])){
                    LoggerService::warn("Room already exists!\tID: $roomID");
                    return null;
                }

                $room = new Room($roomID, $roomEntity->roomName, $roomEntity->adminID);
                self::$rooms[$roomID] = $room;

                unset($roomEntity);
                LoggerService::log("Room created.\tID: $roomID");
                return true;
            }else{
                LoggerService::error("Cannot create new room id: $roomID");
                return false;
            }
        }

        public static function getRoomByID($roomID){
            if(!empty(self::$rooms[$roomID])){
                return self::$rooms[$roomID];
            }else{
                LoggerService::warn("Room not found: $roomID");
                return null;
            }
        }

        public static function isRoomCreated($roomID){
            return !empty(self::$rooms[$roomID]);
        }

        public static function deleteRoom($roomID){
            if(!empty(self::$rooms[$roomID])){
                //room delete
            }else{
                LoggerService::warn("Room not found: $roomID");
            }
        }
    }
?>
