<?php
    class Message{
        private $type;
        private $text;
        private $author;
        private $room;

        function __construct($type, $text, $author, $room){
            $this->type = $type;
            $this->text = $text;
            $this->author = $author;
            $this->room = $room;
        }


    }
?>
