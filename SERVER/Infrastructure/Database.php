<?php
    require_once __DIR__."/../Config.php";
    require_once __DIR__."/../Application/LoggerService.php";

    class Database{
        private $connection;

        function __construct(){
            $this->connection = new mysqli(Config::DB_SERVER_NAME, Config::DB_USERNAME, Config::DB_PASSWORD, Config::DB_NAME);

            if($this->connection->connect_error){
                LoggerService::error("Could not connect to Database: ".$this->connection->connect_error);
                die();
            }

			$this->connection->set_charset(Config::DB_CHARSET);
			$this->connection->query("SET NAMES ".Config::DB_CHARSET);
        }

        function __destruct(){
        }

        public function close(){
            $this->connection->close();
        }

        public function query($query){
            return $this->connection->query($query);
        }
    }
?>
