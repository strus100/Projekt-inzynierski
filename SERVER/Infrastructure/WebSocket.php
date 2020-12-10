<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    require_once __DIR__."/../Application/LoggerService.php";
    require_once __DIR__."/../Application/ClientService.php";
    require_once __DIR__."/../Application/MessageService.php";
    require_once __DIR__."/../Config.php";

    // First octet -> flags with OPCODE
    // abstract class OPCODE{
    //     const TEXT = 129;   //1000 0001 (FIN RSV1 RSV2 RSV3 4*opcode) TEXT frame opcode-%x1
    //     const CLOSE = 136;  //1000 1000 (FIN RSV1 RSV2 RSV3 4*opcode) CLOSE opcode-%x8
    //     const PING = 137;   //1000 1001 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%x9
    //     const PONG = 138;   //1000 1010 (FIN RSV1 RSV2 RSV3 4*opcode) PONG opcode-%xA
    // }

    class WebSocket{
        public $running = true;

        private $masterSocket;
        private $clientSockets = array();

        private $sleepCounter = 1;
        private $sleepInterval = 0.25*1000000;   //Seconds * 1.000.000 (microseconds 1/mil)
        private $pingInterval = 5;  //Seconds

        private $loggerService;
        private $clientService;
        private $messageService;
        private $roomService;

        function __construct($ip, $port, $logger, $client, $message, $room){
            $this->loggerService = $logger;
            $this->clientService = $client;
            $this->messageService = $message;
            $this->roomService = $room;

            $context = stream_context_create();
            // stream_context_set_option($context, 'ssl', 'local_cert', "/etc/letsencrypt/live/s153070.projektstudencki.pl/fullchain.pem");
            // stream_context_set_option($context, 'ssl', 'local_pk', "/etc/letsencrypt/live/s153070.projektstudencki.pl/privkey.pem");
            // stream_context_set_option($context, 'ssl', 'allow_self_signed', false);
            // stream_context_set_option($context, 'ssl', 'verify_peer', false);

            //$this->masterSocket = stream_socket_server("tls://$ip:$port", $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN, $context);
            $this->masterSocket = stream_socket_server("tcp://$ip:$port", $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN, $context);
            if($this->masterSocket){
                $address = stream_socket_get_name($this->masterSocket, FALSE);
                $this->loggerService->log("Server socket: $this->masterSocket");
                $this->loggerService->log("Socket listening on $address");
                $this->main();
            }else{
                $this->loggerService->error("Socket could not be opened");
            }
        }

        function __destruct(){
            if($this->masterSocket){
                fclose($this->masterSocket);
            }
            $this->loggerService->log("Socket closed");
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
            $this->sendMessageToSocket($socket, $response);
            
            $cookies = $this->getCookies($HTTPdata['Cookie']);
            return $cookies['token'];
        }

        private function sendMessageToSocket($socket, $msg){
            return fwrite($socket, $msg);
        }

        private function sendStartInfoToSocket($socket){
            $roomVO = $this->clientService->getClientsRoomInfo((string)$socket);
            $auth = [
                "type" => "auth",
                "auth" => "true"
            ];
            $url = [
                "type" => "event",
                "event" => "redirection",
                "url" => $roomVO->url
            ];
            $scroll = [
                "type" => "event",
                "event" => "scroll",
                "x" => $roomVO->scrollX,
                "y" => $roomVO->scrollY
            ];
            $info = [
                "type" => "info",
                "info" => "room",
                "name" => $roomVO->roomName,
                "admin" => $roomVO->adminID
            ];
            $authMSG = $this->messageService->createMessage(null, OPCODE::TEXT, json_encode($auth));
            $urlMSG = $this->messageService->createMessage(null, OPCODE::TEXT, json_encode($url));
            $scrollMSG = $this->messageService->createMessage(null, OPCODE::TEXT, json_encode($scroll));
            $infoMSG = $this->messageService->createMessage(null, OPCODE::TEXT, json_encode($info));
            $this->sendMessageToSocket($socket, $authMSG->encode());
            $this->sendMessageToSocket($socket, $urlMSG->encode());
            $this->sendMessageToSocket($socket, $scrollMSG->encode());
            $this->sendMessageToSocket($socket, $infoMSG->encode());
        }

        private function handleNewClient($clientSocket){
            $address = stream_socket_get_name($clientSocket, TRUE);
            $this->loggerService->log("New connection from: $address");

            $msg = fread($clientSocket, Config::MAX_BUFFER);
            $token = $this->handshake($clientSocket, $msg);
            
            if($this->clientService->createClient((string)$clientSocket, $token)){
                $this->clientSockets[(string)$clientSocket] = $clientSocket;
                $this->sendStartInfoToSocket($clientSocket);
            }else{
                $msg = $this->messageService->createCloseSignalMessage();
                $this->sendMessageToSocket($clientSocket, $msg->encode());
            }
        }

        private function parseMessageFrom($client, $msg){
            $text = $msg->getType();

            switch ($text) {
                case OPCODE::TEXT:
                    $this->loggerService->log($msg->getText());
                    break;
                
                default:
                    # code...
                    break;
            }
        }

        private function main(){
            while($this->running == true){
                $read = array_merge([$this->masterSocket], $this->clientSockets);
                stream_select($read, $write, $except, 0, 1);

                // If master server socket is in selected sockets array, then there is a new connection incoming
                if(in_array($this->masterSocket, $read)){
                    $clientSocket = stream_socket_accept($this->masterSocket);
                    $this->handleNewClient($clientSocket);
                    array_splice($read, 0, 1);
                }

                // Reads incoming messages
                foreach ($read as $id => $clientSocket) {
                    if($data = fread($clientSocket, Config::MAX_BUFFER)){
                        $messageAuthor = $this->clientService->getClientBySocketID((string)$clientSocket);
                        if(!empty($messageAuthor)){
                            $message = $this->messageService->createMessageFromIncomingData($messageAuthor, $data);
                            $this->loggerService->log("New message from: ".$messageAuthor->getLogin()." | Message: ".$message->getText());

                            $this->parseMessageFrom($messageAuthor, $message);
                        }
                    }
                }
                usleep($this->sleepInterval);
                $this->sleepCounter++;
            }


        }
    }
?>
