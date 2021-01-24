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
            return $this->connection->query($query);
        }
    }
?>
