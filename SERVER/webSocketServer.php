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
                echo "Socket listening on $address\r\n";
                echo "Server socket: $this->socket\r\n";
                $this->main();
            }
        }

        function __destruct(){
            if($this->socket){
                fclose($this->socket);
            }
            echo "Socket closed\r\n";
        }

        private function getCookies($httpCookie){
            $cookies = array();
            $cookiesTMP = explode("; ", $httpCookie);
            foreach ($cookiesTMP as $key => $value) {
                $tmp = explode("=", trim($value));
                $cookies[$tmp[0]] = $tmp[1];
            }
            return $cookies;
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
            $key = implode($chrArray);
            $keyHash = base64_encode($key);
            $response = "HTTP/1.1 101 Switching Protocols\r\n"
                        ."Upgrade: websocket\r\n"
                        ."Connection: Upgrade\r\n"
                        ."Sec-Websocket-Accept: $keyHash\r\n\r\n";
            fwrite($socket, $response);
            
            $cookies = $this->getCookies($HTTPdata['Cookie']);
            return $cookies['token'];;
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
                case OPCODE::CLOSE:
                    return OPCODE::CLOSE;
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
            $request = $this->encode("", OPCODE::PING);
            return $this->send_encoded($socket, $request);
        }

        // Send message to socket
        private function send($socket, $message){
            //echo $message."\r\n";
            return $this->send_encoded($socket, $this->encode($message));
        }

        // Send encoded frame message to socket
        private function send_encoded($socket, $encoded_message){
            return fwrite($socket, $encoded_message);
        }

        // Send message to all clients except (socket)
        private function send_to_all($message, $clientsArray, $except = [false]){
            $encoded_message = $this->encode($message);

            foreach ($clientsArray as $client) {
                if(!in_array($client->get_socket(), $except)){
                    $this->send_encoded($client->get_socket(), $encoded_message);
                }
            }
        }

        private function parse_message_from($client, $message){
            if(!isset($client) || !$client->getRoom()){
                return;
            }
            $clientSocket = $client->get_socket();
            $clientRoom = $client->getRoom();
            $roomClients = $client->getRoom()->getClients();

            if($message == OPCODE::CLOSE){
                $this->clients[(string)$clientSocket] = null;
                unset($this->clients[(string)$clientSocket]);
                $client->leaveRoom();
                echo "$clientSocket:\tDisconnected\r\n";
                $this->sendClientsListToAllInRoom($clientRoom);
                return;
            }

            echo "$clientSocket:\t$message\r\n";
            if($message === "PONG"){
                // echo "$client:\t$message\r\n";
            }
            else{
                $decoded_JSON_array = json_decode($message, true);
                $type = $decoded_JSON_array['type'];
                
                switch ($type) {
                    case 'chat':
                        if(!$client->isMuted()){
                            $decoded_JSON_array['name'] = $client->getName()." ".$client->getSurname()." (".$client->get_login().")";
                            $encoded_JSON_array = json_encode($decoded_JSON_array);
                            // echo $encoded_JSON_array."\r\n";
                            $this->send_to_all($encoded_JSON_array, $roomClients);
                        }else{
                            $muted = [
                                "type" => "chat",
                                "chat" => "Zostałeś zablokowany",
                                "name" => "SERVER"
                            ];
                            $this->send($clientSocket, json_encode($muted));
                        }
                        break;
                    case 'event':
                        if($client->isAdmin()){
                            $this->send_to_all($message, $roomClients, [$clientSocket]);
                            if($decoded_JSON_array['event']=="redirection"){
                                $clientRoom->setUrl($decoded_JSON_array['url']);
                                echo "URL changed: ".$clientRoom->getUrl()."\r\n";
                            }
                            if($decoded_JSON_array['event']=="scroll"){
                                $clientRoom->setScrollX($decoded_JSON_array['x']);
                                $clientRoom->setScrollY($decoded_JSON_array['y']);
                                echo "Scroll changed: ".$clientRoom->getScrollX()." | ".$clientRoom->getScrollY()."\r\n";
                            }
                        }
                        echo "$clientSocket: event: ".$decoded_JSON_array[$type]."\r\n";
                        break;
                    case 'mute':
                        if($client->isAdmin()){
                            if(($clientToMute = $clientRoom->getClientByLogin($decoded_JSON_array['login']))){
                                if($clientToMute->isMuted()){
                                    $clientToMute->unMute();
                                }else{
                                    $clientToMute->mute();
                                }
                                $this->sendClientsListToAllInRoom($clientRoom);
                            }
                        }
                    default:
                        echo "Undefined JSON type received: $type\r\n";
                        break;
                }
            }
        }

        private function sendClientsListToAllInRoom($room){
            if(!isset($room)){
                return;
            }
            $list = array();
            $roomClients = $room->getClients();
            foreach($roomClients as $item){
                $list[] = [
                    "login" => $item->get_login(),
                    "name" => $item->getName()." ".$item->getSurname()." (".$item->get_login().")",
                    "permission" => ($item->isMuted()) ? false : true
                ];
            }

            $clientsList = [
                "type" => "updatelist",
                "clients" => $list
            ];
            //echo json_encode($clientsList);
            // print_r($clientsList);
            $this->send_to_all(json_encode($clientsList), $roomClients);
        }

        //Sends initial info about room/clients/iframe
        private function sendStartInfo($client){
            $clientSocket = $client->get_socket();
            $room = $client->getRoom();
            $url = [
                "type" => "event",
                "event" => "redirection",
                "url" => $room->getUrl()
            ];
            $scroll = [
                "type" => "event",
                "event" => "scroll",
                "x" => $room->getScrollX(),
                "y" => $room->getScrollY()
            ];
            $info = [
                "type" => "info",
                "info" => "room",
                "name" => $room->getRoomName(),
                "admin" => $room->getAdminID()
            ];
            $this->sendClientsListToAllInRoom($room);
            $this->send($clientSocket, json_encode($info));
            $this->send($clientSocket, json_encode($url));
            $this->send($clientSocket, json_encode($scroll));
        }

        //Handles new connection (client)
        private function handleNewClient($clientSocket){
            $address = stream_socket_get_name($clientSocket, TRUE);
            echo "New connection: $address\r\n";

            $msg = fread($clientSocket, MAX_BUFFER);
            $token = $this->handshake($clientSocket, $msg);
            $client = new Client($clientSocket, $token);
            if($client->authorize()){
                $this->clients[(string)$clientSocket] = $client;
                $roomID = $client->getRoomID();
                $room = $this->rooms[$roomID];
                if( !$room ){
                    $room = new Room($roomID);
                    $this->rooms[$roomID] = $room;
                }
                $client->joinRoom($room);

                $auth = [
                    "type" => "auth",
                    "auth" => "true"
                ];
                $this->send($clientSocket, json_encode($auth));
                $this->sendStartInfo($client);
            }else{
                echo "ERROR token!\r\n";
                $this->send_encoded($clientSocket, $this->encode("CLOSE", OPCODE::CLOSE));
            }
        }

        // Main Server function/loop
        private function main(){
            while($this->running==true){
                $read = array_merge([$this->socket], array_map(function($client){ return $client->get_socket(); }, $this->clients));
                stream_select($read, $write, $except, 0, 1);

                // If main server socket is in selected sockets array, then there is a new connection incoming
                if(in_array($this->socket, $read)){
                    $clientSocket = stream_socket_accept($this->socket);
                    $this->handleNewClient($clientSocket);
                    array_splice($read, 0, 1);
                }

                // Reads incoming messages
                foreach ($read as $id => $clientSocket) {
                    if($msg = fread($clientSocket, MAX_BUFFER)){
                        $this->parse_message_from($this->clients[(string)$clientSocket], $this->decode($msg));
                    }
                }

                // Ping every x seconds and disconnect outdated sockets
                if($this->sleepCounter > $this->pingInterval/$this->sleepInterval*1000000){
                    foreach ($this->clients as $id => $client) {
                        $clientSocket = $client->get_socket();
                        $clientRoom = $client->getRoom();
                        if(!$clientRoom){
                            $this->send_encoded($clientSocket, $this->encode("CLOSE", OPCODE::CLOSE));
                        }
                        if(!$this->ping_socket($clientSocket) || !$clientRoom){
                            $this->clients[(string)$clientSocket] = null;
                            unset($this->clients[(string)$clientSocket]);
                            $client->leaveRoom();
                            echo "Connection timeout:\t$clientSocket\r\n";
                        }
                    }
                    foreach ($this->rooms as $room) {
                        $this->sendClientsListToAllInRoom($room);
                    }

                    $this->sleepCounter = 1;
                }
                usleep($this->sleepInterval);
                $this->sleepCounter++;
            }
        }
    }
?>