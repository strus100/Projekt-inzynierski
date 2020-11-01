<?php
    class FileLogger{
        private static $PATH = __DIR__."/../Logs/";

        private static function dir(){
            if(!is_dir(self::$PATH)){
                mkdir(self::$PATH);
            }
        }

        static function log($msg){
            self::dir();
            file_put_contents(self::$PATH . date('Y-m-d').".log", $msg."\r\n", FILE_APPEND | LOCK_EX);
        }

        static function warn($msg){
            self::dir();
            file_put_contents(self::$PATH . date('Y-m-d').".log", $msg."\r\n", FILE_APPEND | LOCK_EX);
        }

        static function error($msg){
            self::dir();
            file_put_contents(self::$PATH . date('Y-m-d').".log", $msg."\r\n", FILE_APPEND | LOCK_EX);
        }
    }
?>