<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment: ;extension=sockets
    // probably later uncomment ;extension=openssl

    class WebSocketServer{
        private $socket;
        public $running = true;

        function __construct($address = "127.0.0.1", $port){
            $this->socket = 
            $this->socket = socket_create_listen($port);
            socket_getsockname($this->socket, $address, $port);
            echo "Socket listening on $address:$port\r\n";
            
        }

        function __destruct(){
            socket_close($this->socket);
            echo "Socket closed\r\n";
        }

        private function handshake($message){
            $GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

            $HTTPdata = array();
            $HTTPlines = explode("\r\n", trim($message));

            foreach($HTTPlines as $key => $line){
                if($key>0){
                    $tmp = explode(": ", trim($line));
                    $HTTPdata[$tmp[0]] = $tmp[1];
                }
            }
            print_r($HTTPdata);
            
        }
    }
?>