<?php
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    // Command Line Interface protection
    error_reporting(E_ALL);
    if(PHP_SAPI !== 'cli') die("Run only using CLI");

    //timezone
    date_default_timezone_set("Europe/Warsaw");

    require_once __DIR__."/Infrastructure/WebSocket.php";

    define("DEFAULT_IP", "0.0.0.0");
    define("DEFAULT_PORT", 3000);
    define("MAX_BUFFER", 10000000);

    // Arguments parsing
    if($argc>1 && $argv[1]=="start"){
        $argumentArray = $argv;
        array_splice($argumentArray, 0, 2);
        $parameters = array();
        foreach ($argumentArray as $value) {
            $line = explode("=", $value);
            $parameters[$line[0]] = $line[1];
        }
        $server = new WebSocket($parameters);
    }
    else{
        die("Usage: start [,-a=<ip>] [,-p=<port>]\r\n\tDefault: ip:".DEFAULT_IP." port:".DEFAULT_PORT);
    }
?>