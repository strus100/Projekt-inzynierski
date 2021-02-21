<?php
    require_once __DIR__."/../../Config.php";

    class Database{
        private $connection;
        private $logger;

        function __construct($logger){
            $this->logger = $logger;
            $this->connection = new mysqli(Config::DB_SERVER_NAME, Config::DB_USERNAME, Config::DB_PASSWORD, Config::DB_NAME);

            if($this->connection->connect_error){
                $this->logger->error("Could not connect to Database: ".$this->connection->connect_error);
                die();
            }

			$this->connection->set_charset(Config::DB_CHARSET);
			$this->connection->query("SET NAMES ".Config::DB_CHARSET);
        }

        function __destruct(){
            $this->connection->close();
        }

        public function query($query){
            $result = $this->connection->query($query);

            if(!$result){
                $this->logger->error("Could not execute SQL query: ".$this->connection->error);
                $res = $this->connection->connect(Config::DB_SERVER_NAME, Config::DB_USERNAME, Config::DB_PASSWORD, Config::DB_NAME);
                return $this->connection->query($query);
            }else{
                return $result;
            }
        }
    }
?>
