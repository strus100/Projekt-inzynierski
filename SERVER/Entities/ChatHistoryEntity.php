<?php
    final class ChatHistoryEntity{
        public $id;
        
        public $date;
        public $message;
        public $messageType;
        
        public $userID;
        public $roomID;

        function __construct($id, $date, $message, $messageType, $userID, $roomID){
            $this->id = $id;

            $this->date = $date;
            $this->message = $message;
            $this->messageType = $messageType;

            $this->userID = $userID;
            $this->roomID = $roomID;
        }
    }
?>