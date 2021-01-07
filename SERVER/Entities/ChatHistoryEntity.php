<?php
    final class ChatHistoryEntity{
        public $id;
        
        public $date;
        public $message;
        public $messageType;
        
        public $userID;
        public $name;
        public $surname;

        public $roomID;

        function __construct($id, $date, $message, $messageType, $userID, $name, $surname, $roomID){
            $this->id = $id;

            $this->date = $date;
            $this->message = $message;
            $this->messageType = $messageType;

            $this->userID = $userID;
            $this->name = $name;
            $this->surname = $surname;

            $this->roomID = $roomID;
        }
    }
?>