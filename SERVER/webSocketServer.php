<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    // Command Line Interface protection
    error_reporting(E_ALL);
    if(PHP_SAPI !== 'cli') die("Run only using CLI");

    require_once __DIR__."/Client.php";
    require_once __DIR__."/Room.php";

    define("DEFAULT_IP", "127.0.0.1");
    define("DEFAULT_PORT", 1111);
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
        $server = new WebSocketServer($parameters);
    }
    else{
        die("Usage: start [,-a=<ip>] [,-p=<port>]\r\n\tDefault: ip:".DEFAULT_IP." port:".DEFAULT_PORT);
    }

    // First octet -> flags with OPCODE
    abstract class OPCODE{
        const TEXT = 129;   //1000 0001 (FIN RSV1 RSV2 RSV3 4*opcode) TEXT frame opcode-%x1
        const CLOSE = 136;  //1000 1000 (FIN RSV1 RSV2 RSV3 4*opcode) CLOSE opcode-%x8
        const PING = 137;   //1000 1001 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%x9
        const PONG = 138;   //1000 1010 (FIN RSV1 RSV2 RSV3 4*opcode) PONG opcode-%xA
    }

    class WebSocketServer{
        public $running = true;

        private $socket;
        private $clients = array();
        private $rooms = array();
        private $sleepCounter = 1;
        private $sleepInterval = 0.25*1000000;   //Seconds * 1.000.000 (microseconds 1/mil)
        private $pingInterval = 5;  //Seconds
        
        function __construct($args){
            $this->socket = socket_create(AF_INET, SOCK_STREAM, 0);
            socket_bind($this->socket, (isset($args['-a']) ? $args['-a'] : DEFAULT_IP), (isset($args['-p']) ? $args['-p'] : DEFAULT_PORT));
            socket_listen($this->socket);
            socket_getsockname($this->socket, $address, $port);
            echo "Socket listening on $address:$port\r\n";
            $this->main();
        }

        function __destruct(){
            socket_close($this->socket);
            echo "Socket closed\r\n";
        }

        // WebSocket Handshake returns TOKEN
        private function handshake($socket, $message){
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
            socket_write($socket, $response, strlen($response));
            return $this->decode(socket_read($socket, MAX_BUFFER));
        }

        // Websocket frame encoding
        private function encode($message, $opcode=OPCODE::TEXT){
            $length = strlen($message);
            $datagramBytes = array();
            $datagramBytes[0] = $opcode;

            if($length <= 125){
                $datagramBytes[1] = $length;
            }
            else if($length >= 126 && $length <= 65535){
                $datagramBytes[1] = 126;
                $datagramBytes[2] = ($length >> 8) & 255;
                $datagramBytes[3] = $length & 255;
            }
            else if($length > 65535){
                $datagramBytes[1] = 127;
                $datagramBytes[2] = ($length >> 56) & 255;
                $datagramBytes[3] = ($length >> 48) & 255;
                $datagramBytes[4] = ($length >> 40) & 255;
                $datagramBytes[5] = ($length >> 32) & 255;
                $datagramBytes[6] = ($length >> 24) & 255;
                $datagramBytes[7] = ($length >> 16) & 255;
                $datagramBytes[8] = ($length >> 8) & 255;
                $datagramBytes = $length & 255;
            }
            else{
                echo "ERROR encoding message - length";
            }
            $parsedArray = array_map("chr", $datagramBytes);
            // print_r($datagramBytes);
            return implode($parsedArray).$message;
        }

        // Websocket frame decoding
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
                // $length = ($octets[2] << 8) | $octets[3];
                $index = 4;
            }
            else if($length == 127){
                $index = 10;
                // return false;
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

        private function ping_socket($socket){
            echo "ping $socket\r\n";
            $request = $this->encode("send BASS", OPCODE::PING);
            /*if(@socket_write($client, $request, strlen($request)) === false){
                return false;
            }
            else{
                return true;
            }*/
            // return @socket_write($client, $request, strlen($request));
            return $this->send_encoded($socket, $request);
        }

        // Send message to socket
        private function send($socket, $message){
            return $this->send_encoded($socket, $this->encode($message));
        }

        // Send encoded frame message to socket
        private function send_encoded($socket, $encoded_message){
            return @socket_write($socket, $encoded_message, strlen($encoded_message));
        }

        // Send message to all clients except (socket)
        private function send_to_all($message, $clientsArray, $except = false){
            $encoded_message = $this->encode($message);

            foreach ($clientsArray as $client) {
                if(!in_array($client->get_socket(), $except)){
                    $this->send_encoded($client->get_socket(), $encoded_message);
                }
            }
        }

        private function parse_message_from($client, $message){
            $clientSocket = $client->get_socket();
            $roomClients = $client->getRoom()->getClients();

            echo "$clientSocket:\t$message\r\n";
            if($message === "PONG"){
                // echo "$client:\t$message\r\n";
            }
            else{
                $decoded_JSON_array = json_decode($message, true);
                $type = $decoded_JSON_array['type'];
                
                switch ($type) {
                    case 'chat':
                        $decoded_JSON_array['name'] = $client->get_login();
                        $encoded_JSON_array = json_encode($decoded_JSON_array);
                        // echo $encoded_JSON_array."\r\n";
                        
                        $this->send_to_all($encoded_JSON_array, $roomClients, [$clientSocket]);
                        break;
                    case 'event':
                        if($client->isAdmin()){
                            $this->send_to_all($message, $roomClients, [$clientSocket]);
                        }
                        echo "$clientSocket: event: $decoded_JSON_array[$type]\r\n";
                        break;
                    default:
                        echo "Undefined JSON type received: $type\r\n";
                        break;
                }
            }
        }

        // Main Server function/loop
        private function main(){
            while($this->running==true){
                $read = array_merge([$this->socket], array_map(function($client){ return $client->get_socket(); }, $this->clients));
                @socket_select($read, $write, $except, 0, 1);   //Select sockets that status has changed

                // If main server socket is in selected sockets array, then there is a new connection incoming
                if(in_array($this->socket, $read)){
                    $clientSocket = socket_accept($this->socket);
                    // socket_set_nonblock($clientSocket);
                    socket_getpeername($clientSocket, $address, $port);
                    echo "New connection: $address:$port\r\n";

                    $msg = @socket_read($clientSocket, MAX_BUFFER);
                    $token = $this->handshake($clientSocket, $msg);
                    $client = new Client($clientSocket, $token);
                    if($client->authorize()){
                        $this->clients[] = $client;
                        $roomID = $client->getRoomID();
                        $room = $this->rooms[$roomID];
                        if( !$room ){
                            $room = new Room($roomID);
                            $this->rooms[$roomID] = $room;
                        }
                        $client->joinRoom($room);
                    }else{
                        echo "ERROR token!\r\n";
                        $this->send_encoded($clientSocket, $this->encode("CLOSE", OPCODE::CLOSE));
                    }
                }

                // Reads incoming messages
                foreach ($read as $id => $clientSocket) {
                    if($msg = @socket_read($clientSocket, MAX_BUFFER)){
                        $this->parse_message_from($this->clients[$id-1], $this->decode($msg));
                        // echo "Message from $client:\t$decodedMSG\r\n";
                    }
                }

                // Ping every x seconds and disconnect outdated sockets
                if($this->sleepCounter > $this->pingInterval/$this->sleepInterval*1000000){
                    $toDelete = array();
                    
                    foreach ($this->clients as $id => $client) {
                        if($this->ping_socket($client->get_socket()) === false){
                            $client->leaveRoom();
                            unset($client);
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