<?php
    final class MessageVO{
        public $type;
        public $date;
        public $text;
        public $author;
        public $room;

        function __construct($type, $date, $text, $author, $room){
            $this->type = $type;
            $this->date = $date;
            $this->text = $text;
            $this->author = $author;
            $this->room = $room;
        }
    }
?>