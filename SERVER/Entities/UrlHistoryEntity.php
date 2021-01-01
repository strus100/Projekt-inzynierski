<?php
    final class UrlHistoryEntity{
        public $id;

        public $date;
        public $url;

        public $userID;

        function __construct($id, $date, $url, $userID){
            $this->id = $id;
            
            $this->date = $date;
            $this->url = $url;

            $this->userID = $userID;
        }
    }
?>