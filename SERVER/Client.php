<?php
    // Small client class

    require_once __DIR__."/../database/DatabaseConnection.php";

    abstract class PERMISSION{
        const USER = 1;
        const ADMIN = 2;
    }

    class Client{
        private $socket;
        private $token;
        private $permission;
        private $nick;

        function __construct($socket, $token){
            $this->socket = $socket;
            $this->token = htmlspecialchars($token);
        }

        function __destruct(){
            socket_close($this->socket);
        }

        // Checks if user has admin privileges and gets user infos
        public function authorize(){
            $DB = new DatabaseConnection();
            $DB->connect();
            if(($row = $DB->getUserByToken($this->token))){
                $this->nick = $row['login'];
                if($row['role'] == "pracownik" || $row['role'] == "doktorant"){
                    $this->permission = PERMISSION::ADMIN;
                }else{
                    $this->permission = PERMISSION::USER;
                }
                $DB->closeConnection();
                return true;
            }else{
                $DB->closeConnection();
                return false;
            }
        }

        public function get_nick(){
            return $this->nick;
        }

        public function get_socket(){
            return $this->socket;
        }

        public function isAdmin(){
            return $this->permission == PERMISSION::ADMIN;
        }
    }
?>