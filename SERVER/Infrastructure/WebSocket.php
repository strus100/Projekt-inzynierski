<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    require_once __DIR__."/../Application/LoggerService.php";

    // First octet -> flags with OPCODE
    abstract class OPCODE{
        const TEXT = 129;   //1000 0001 (FIN RSV1 RSV2 RSV3 4*opcode) TEXT frame opcode-%x1
        const CLOSE = 136;  //1000 1000 (FIN RSV1 RSV2 RSV3 4*opcode) CLOSE opcode-%x8
        const PING = 137;   //1000 1001 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%x9
        const PONG = 138;   //1000 1010 (FIN RSV1 RSV2 RSV3 4*opcode) PONG opcode-%xA
    }

    class WebSocket{
        public $running = true;

        private $socket;
        private $clients = array();

        private $sleepCounter = 1;
        private $sleepInterval = 0.25*1000000;   //Seconds * 1.000.000 (microseconds 1/mil)
        private $pingInterval = 5;  //Seconds

        function __construct($args){
            $context = stream_context_create();
            stream_context_set_option($context, 'ssl', 'local_cert', "/etc/letsencrypt/live/s153070.projektstudencki.pl/fullchain.pem");
            stream_context_set_option($context, 'ssl', 'local_pk', "/etc/letsencrypt/live/s153070.projektstudencki.pl/privkey.pem");
            stream_context_set_option($context, 'ssl', 'allow_self_signed', false);
            stream_context_set_option($context, 'ssl', 'verify_peer', false);

            $ip = isset($args['-a']) ? $args['-a'] : DEFAULT_IP;
            $port = isset($args['-p']) ? $args['-p'] : DEFAULT_PORT;

            $this->socket = stream_socket_server("tls://$ip:$port", $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN, $context);
            if($this->socket){
                $address = stream_socket_get_name($this->socket, FALSE);
                LoggerService::log("Socket listening on $address");
                LoggerService::log("Server socket: $this->socket");
                //$this->main();
            }else{
                LoggerService::error("Socket could not be opened");
            }
        }
    }
?>