<?php
    require_once __DIR__."/../Domain/Room.php";

    class RoomService{
        private $logger;
        private $database;

        private $rooms=[];

        function __construct($logger, $database){
            $this->logger = $logger;
            $this->database = $database;
        }

        public function createRoom($roomID){
            $roomEntity = $this->database->getRoomByID($roomID);

            if(!empty($roomEntity)){
                if(!empty($this->rooms[$roomID])){
                    $this->logger->warn("Room already exists!\tID: $roomID");
                    return null;
                }

                $room = new Room($roomID, $roomEntity->roomName, $roomEntity->adminID);
                $this->rooms[$roomID] = $room;

                unset($roomEntity);
                $this->logger->log("Room created.\tID: $roomID");
                return true;
            }else{
                $this->logger->error("Cannot create new room id: $roomID");
                return false;
            }
        }

        public function getRoomByID($roomID){
            if(!empty($this->rooms[$roomID])){
                return $this->rooms[$roomID];
            }else{
                $this->logger->warn("Room not found: $roomID");
                return null;
            }
        }

        public function isRoomCreated($roomID){
            return !empty($this->rooms[$roomID]);
        }

        public function deleteRoom($roomID){
            if(!empty($this->rooms[$roomID])){
                //room delete
            }else{
                $this->logger->warn("Room not found: $roomID");
            }
        }

        public function getAllRooms(){
            return $this->rooms;
        }
    }
?>
