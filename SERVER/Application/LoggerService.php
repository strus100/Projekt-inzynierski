<?php
    require_once __DIR__."/../Infrastructure/ConsoleLogger.php";
    require_once __DIR__."/../Infrastructure/FileLogger.php";

    class LoggerService{
        private static $instance;

        private $fileLogger;

        function __construct(){
            self::$instance = $this;

            $this->fileLogger = new FileLogger();
        }
        
        public static function getInstance(){
            return self::$instance;
        }

        private function getCurrentDateTime(){
            $datetime = new DateTime('NOW');
            return $datetime->format('d.m.Y H:i:s.v');
        }

        private function getCallerFunction(){
            $backtrace = debug_backtrace(3);
            $class = isset($backtrace[3]['class']) ? $backtrace[3]['class'] : "_";
            $function = isset($backtrace[3]['function']) ? $backtrace[3]['function'] : "_";
            $line = $backtrace[2]['line'];

            return $class."::".$function.".".$line;
        }

        private function createMSG(){
            $datetime = "[".$this->getCurrentDateTime()."]";
            $caller = "[".$this->getCallerFunction()."]";

            return $datetime." ".$caller;
        }

        function log($msg){
            $msgToDisplay = $this->createMSG()." [LOG]:\t".$msg;
            ConsoleLogger::log($msgToDisplay);
            $this->fileLogger->log($msgToDisplay);
        }

        function warn($msg){
            $msgToDisplay = $this->createMSG()." [WARN]:\t".$msg;
            ConsoleLogger::warn($msgToDisplay);
            $this->fileLogger->warn($msgToDisplay);
        }

        function error($msg){
            $msgToDisplay = $this->createMSG()." [ERROR]:\t".$msg;
            ConsoleLogger::error($msgToDisplay);
            $this->fileLogger->error($msgToDisplay);
        }

        function logToConsole($msg){
            $msgToDisplay = $this->createMSG()." [LOG]:\t".$msg;
            ConsoleLogger::log($msgToDisplay);
        }
    }
?>
