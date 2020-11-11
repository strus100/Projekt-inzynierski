<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    require_once __DIR__."/../Application/LoggerService.php";
    require_once __DIR__."/../Config.php";

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
        private $clientSockets = array();

        private $sleepCounter = 1;
        private $sleepInterval = 0.25*1000000;   //Seconds * 1.000.000 (microseconds 1/mil)
        private $pingInterval = 5;  //Seconds

        function __construct($args){
            $context = stream_context_create();
            stream_context_set_option($context, 'ssl', 'local_cert', "/etc/letsencrypt/live/s153070.projektstudencki.pl/fullchain.pem");
            stream_context_set_option($context, 'ssl', 'local_pk', "/etc/letsencrypt/live/s153070.projektstudencki.pl/privkey.pem");
            stream_context_set_option($context, 'ssl', 'allow_self_signed', false);
            stream_context_set_option($context, 'ssl', 'verify_peer', false);

            $ip = isset($args['-a']) ? $args['-a'] : Config::DEFAULT_IP;
            $port = isset($args['-p']) ? $args['-p'] : Config::DEFAULT_PORT;

            $this->socket = stream_socket_server("tls://$ip:$port", $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN, $context);
            if($this->socket){
                $address = stream_socket_get_name($this->socket, FALSE);
                LoggerService::log("Server socket: $this->socket");
                LoggerService::log("Socket listening on $address");
                $this->main();
            }else{
                LoggerService::error("Socket could not be opened");
            }
        }

        function __destruct(){
            if($this->socket){
                fclose($this->socket);
            }
            LoggerService::log("Socket closed");
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

            //Send handshake response to client
            fwrite($socket, $response);
            
            $cookies = $this->getCookies($HTTPdata['Cookie']);
            return $cookies['token'];;
        }

        private function handleNewClient($clientSocket){
            $address = stream_socket_get_name($clientSocket, TRUE);
            LoggerService::log("New connection from: $address");

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

        private function main(){
            while($this->running == true){
                $read = array_merge([$this->socket], $this->clientSockets);
                stream_select($read, $write, $except, 0, 1);

                if(in_array($this->socket, $read)){
                    $clientSocket = stream_socket_accept($this->socket);
                    $this->handleNewClient($clientSocket);
                    array_splice($read, 0, 1);
                }

                foreach ($read as $id => $clientSocket) {
                    if($msg = fread($clientSocket, MAX_BUFFER)){
                        $this->parse_message_from($this->clients[(string)$clientSocket], $this->decode($msg));
                    }
                }
            }
        }
    }
?>
