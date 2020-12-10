<?php
    class FileLogger{
        private static $PATH = __DIR__."/../Logs/";

        function __construct(){
            if(!is_dir(self::$PATH)){
                mkdir(self::$PATH);
            }
            file_put_contents(self::$PATH . date('Y-m-d').".log", "--------------------------------------------------".date('Y-m-d_H:i:s')."--------------------------------------------------\r\n", FILE_APPEND | LOCK_EX);
        }

        //file_put_contents to change
        function log($msg){
            file_put_contents(self::$PATH . date('Y-m-d').".log", $msg."\r\n", FILE_APPEND | LOCK_EX);
        }

        function warn($msg){
            file_put_contents(self::$PATH . date('Y-m-d').".log", $msg."\r\n", FILE_APPEND | LOCK_EX);
        }

        function error($msg){
            file_put_contents(self::$PATH . date('Y-m-d').".log", $msg."\r\n", FILE_APPEND | LOCK_EX);
        }
    }
?>
