<?php
    abstract class Config{
        //WebSocket Server
        const DEFAULT_IP = "0.0.0.0";
        const DEFAULT_PORT = 3000;
        const MAX_BUFFER = 10000000;

        //Database
        const DB_SERVER_NAME = "localhost";
        const DB_USERNAME = "root";
        const DB_PASSWORD = "";
        const DB_NAME = "bazaInz";
        const DB_CHARSET = "UTF8"; //better don't change that
    }
?>
