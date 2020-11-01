<?php
    require_once __DIR__."/../Infrastructure/ConsoleLogger.php";
    require_once __DIR__."/../Infrastructure/FileLogger.php";

    class LoggerService{
        private static function getCurrentDateTime(){
            $datetime = new DateTime('NOW');
            return $datetime->format('d.m.Y H:i:s.v');
        }
        
        private static function getCallerFunction(){
            $backtrace = debug_backtrace(3);
            $class = isset($backtrace[3]['class']) ? $backtrace[3]['class'] : "_";
            $function = isset($backtrace[3]['function']) ? $backtrace[3]['function'] : "_";
            $line = $backtrace[2]['line'];

            return $class."::".$function.".".$line;
        }

        private static function createMSG(){
            $datetime = "[".self::getCurrentDateTime()."]";
            $caller = "[".self::getCallerFunction()."]";

            return $datetime." ".$caller;
        }

        static function log($msg){
            $msgToDisplay = self::createMSG()." [LOG]:\t".$msg;
            ConsoleLogger::log($msgToDisplay);
            FileLogger::log($msgToDisplay);
        }

        static function warn($msg){
            $msgToDisplay = self::createMSG()." [WARN]:\t".$msg;
            ConsoleLogger::warn($msgToDisplay);
        }

        static function error($msg){
            $msgToDisplay = self::createMSG()." [ERROR]:\t".$msg;
            ConsoleLogger::error($msgToDisplay);
        }
    }
?>