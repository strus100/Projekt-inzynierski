<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    // Command Line Interface protection
    error_reporting(E_ALL);
    if(PHP_SAPI !== 'cli') die("Run only using CLI");

    define("DEFAULT_IP", "127.0.0.1");
    define("DEFAULT_PORT", 1111);
    define("MAX_BUFFER", 1024);

    if($argc>1 && $argv[1]=="start"){
        $argumentArray = $argv;
        array_splice($argumentArray, 0, 2);
        $parameters = array();
        foreach ($argumentArray as $value) {
            $line = explode("=", $value);
            $parameters[$line[0]] = $line[1];
        }
        $server = new WebSocketServer($parameters);
    }
    else{
        die("Usage: start [,-a=<ip>] [,-p=<port>]\r\n\tDefault: ip:".DEFAULT_IP." port:".DEFAULT_PORT);
    }

    // First octet -> flags with OPCODE
    abstract class OPCODE{
        const TEXT = 129;   //1000 0001 (FIN RSV1 RSV2 RSV3 4*opcode) TEXT frame opcode-%x1
        const CLOSE = 136;  //1000 1000 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%x8
        const PING = 137;   //1000 1001 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%x9
        const PONG = 138;   //1000 1010 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%xA
    }

    class WebSocketServer{
        public $running = true;

        private $socket;
        private $clients = array();
        private $sleepCounter = 1;
        private $sleepInterval = 0.25*1000000;   //Seconds * 1.000.000 (microseconds 1/mil)
        private $pingInterval = 5;  //Seconds
        
        function __construct($args){
            $this->socket = socket_create(AF_INET, SOCK_STREAM, 0);
            socket_bind($this->socket, (isset($args['-a']) ? $args['-a'] : DEFAULT_IP), (isset($args['-p']) ? $args['-p'] : DEFAULT_PORT));
            socket_listen($this->socket);
            socket_set_nonblock($this->socket);
            socket_getsockname($this->socket, $address, $port);
            echo "Socket listening on $address:$port\r\n";
            $this->main();
        }

        function __destruct(){
            socket_close($this->socket);
            echo "Socket closed\r\n";
        }

        private function handshake($client, $message){
            $GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
            $HTTPdata = array();
            $HTTPlines = explode("\r\n", trim($message));

            foreach($HTTPlines as $key => $line){
                if($key>0){
                    $tmp = explode(": ", trim($line));
                    $HTTPdata[$tmp[0]] = $tmp[1];
                }
            }
            
            $sha = sha1($HTTPdata['Sec-WebSocket-Key'].$GUID);
            $shaArray = str_split($sha, 2);
            $hexArray = array_map('hexdec', $shaArray);
            $chrArray = array_map('chr', $hexArray);
            $token = implode($chrArray);
            $keyHash = base64_encode($token);
            $response = "HTTP/1.1 101 Switching Protocols\r\n"
                        ."Upgrade: websocket\r\n"
                        ."Connection: Upgrade\r\n"
                        ."Sec-Websocket-Accept: $keyHash\r\n\r\n";
            socket_write($client, $response, strlen($response));
        }

        private function encode($message, $opcode){
            $length = strlen($message);
            $datagramBytes = array();
            $datagramBytes[0] = $opcode;

            if($length <= 125){
                $datagramBytes[1] = $length;
            }
            else if($length >= 126 && length <= 65535){
                $datagramBytes[1] = 126;
                $datagramBytes[2] = ($length >> 8) & 255;
                $datagramBytes[3] = $length & 255;
            }
            else{
                echo "ERROR encoding message";
            }
            $parsedArray = array_map("chr", $datagramBytes);
            // print_r($datagramBytes);
            return implode($parsedArray).$message;
        }

        private function decode($message){
            $splitted = str_split($message);    //split every character
            $octets = array_map("ord", $splitted);  //octets
            // print_r($octets);

            // First octet determines type of connection
            switch ($octets[0]) {
                case OPCODE::PONG:
                    return "PONG";
                    break;
                case OPCODE::TEXT:
                    break;
                default:
                    echo "Undefined OPCODE in decode function!\r\n\r\n";
                    break;
            }

            // According to RFC 6455 section 5.2 all client->server frames are masked
            // $isMasked = boolval($octets[1] >> 7);
            $length = $octets[1] & 127;
            $index = null;

            if($length <= 125){
                // Length is within octet
                $index = 2;
            }
            else if($length == 126){
                $length = ($octets[2] << 8) | $octets[3];
                $index = 4;
            }
            else if($length == 127){
                echo("payload length=127 - To implement LATER\r\n\r\n");
                return false;
            }
            else{
                return false;
            }
            // echo "Length: $length\r\n";

            // RFC 6455 section 5.3
            // Mask length is 32-bit value (4 octets)
            $mask = array_slice($octets, $index, 4);
            $data = "";
            for($i = $index+4, $j=0; $i < count($octets); $i++, $j++){
                $data .= chr($octets[$i] ^ $mask[$j%4]);
            }
            
            return $data;
        }

        private function ping($client){
            echo "ping $client\r\n";
            $request = $this->encode("", OPCODE::PING);
            /*if(@socket_write($client, $request, strlen($request)) === false){
                return false;
            }
            else{
                return true;
            }*/
            return @socket_write($client, $request, strlen($request));
        }

        // Main Server function/loop
        private function main(){
            while($this->running==true){
                $read = array_merge([$this->socket], $this->clients);
                @socket_select($read, $write, $except, 0, 1);   //Select sockets that status has changed

                // If main server socket is in selected sockets array, then there is a new connection incoming
                if(in_array($this->socket, $read)){
                    $client = socket_accept($this->socket);
                    socket_set_nonblock($client);
                    socket_getpeername($client, $address, $port);
                    echo "New connection: $address:$port\r\n";

                    $msg = @socket_read($client, MAX_BUFFER);
                    // echo $msg;
                    $this->handshake($client, $msg);
                    $this->clients[] = $client;
                }

                // Reads incoming messages
                foreach ($read as $id => $client) {
                    if($msg = @socket_read($client, MAX_BUFFER)){
                        $decodedMSG = $this->decode($msg);
                        echo "Message from $client:\t$decodedMSG\r\n";
                    }
                }

                // Ping every x seconds and disconnect outdated sockets
                if($this->sleepCounter > $this->pingInterval/$this->sleepInterval*1000000){
                    $toDelete = array();
                    
                    foreach ($this->clients as $id => $client) {
                        if($this->ping($client) === false){
                            socket_close($client);
                            $toDelete[] = $id;
                            echo "Connection timeout: $id\r\n";
                        }
                    }

                    sort($toDelete);
                    array_reverse($toDelete);
                    for ($i=0; $i < count($toDelete); $i++) { 
                        array_splice($this->clients, $toDelete[$i], 1);
                    }

                    $this->sleepCounter = 1;
                }
                usleep($this->sleepInterval);
                $this->sleepCounter++;
            }
        }
    }
?>