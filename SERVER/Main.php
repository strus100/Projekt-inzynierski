<?php
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    // Command Line Interface protection
    error_reporting(E_ALL);
    if(PHP_SAPI !== 'cli') die("Run only using CLI");

    //timezone
    date_default_timezone_set("Europe/Warsaw");

    //require_once __DIR__."/Infrastructure/WebSocket.php";
    require_once __DIR__."/Config.php";
    require_once __DIR__."/Application/ServerService.php";

    // Arguments parsing
    if($argc>1 && $argv[1]=="start"){
        $argumentArray = $argv;
        array_splice($argumentArray, 0, 2);
        $args = array();
        foreach ($argumentArray as $value) {
            $line = explode("=", $value);
            $args[$line[0]] = $line[1];
        }
        //$server = new WebSocket($parameters);
        $ip = isset($args['-a']) ? $args['-a'] : Config::DEFAULT_IP;
        $port = isset($args['-p']) ? $args['-p'] : Config::DEFAULT_PORT;

        $server = new ServerService($ip, $port);
    }
    else{
        die("Usage: start [,-a=<ip>] [,-p=<port>]\r\n\tDefault: ip:".Config::DEFAULT_IP." port:".Config::DEFAULT_PORT);
    }
?>
