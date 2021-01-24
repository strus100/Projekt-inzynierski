<?php
    // Written according to RFC 6455
    // https://tools.ietf.org/html/rfc6455
    // php.ini uncomment:   extension=sockets
    // probably later uncomment:    extension=openssl

    require_once __DIR__."/../Application/LoggerService.php";
    require_once __DIR__."/../Application/ClientService.php";
    require_once __DIR__."/../Application/MessageService.php";
    require_once __DIR__."/../../Config.php";

    require_once __DIR__."/../ValueObjects/MessageVO.php";

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

        function __construct($ip, $port, LoggerService $logger, ClientService $client, MessageService $message, RoomService $room){
            $this->loggerService = $logger;
            $this->clientService = $client;
            $this->messageService = $message;
            $this->roomService = $room;

            $context = stream_context_create();
            // stream_context_set_option($context, 'ssl', 'local_cert', "/etc/letsencrypt/live/s153070.projektstudencki.pl/fullchain.pem");
            // stream_context_set_option($context, 'ssl', 'local_pk', "/etc/letsencrypt/live/s153070.projektstudencki.pl/privkey.pem");

            // stream_context_set_option($context, 'ssl', 'local_cert', CONFIG::CERT_FULL_CHAIN_PATH);
            // stream_context_set_option($context, 'ssl', 'local_pk', CONFIG::CERT_PRIVATE_KEY_PATH);
            // stream_context_set_option($context, 'ssl', 'allow_self_signed', false);
            // stream_context_set_option($context, 'ssl', 'verify_peer', false);

            //$this->masterSocket = stream_socket_server("tls://$ip:$port", $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN, $context);
            $this->masterSocket = stream_socket_server("tcp://$ip:$port", $errno, $errstr, STREAM_SERVER_BIND|STREAM_SERVER_LISTEN, $context);
            if($this->masterSocket){
                $address = stream_socket_get_name($this->masterSocket, FALSE);
                $this->loggerService->log("Server socket: $this->masterSocket");
                $this->loggerService->log("Socket listening on $address");
                //$this->main();
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

        public function destroySocketByID($socketID){
            //print_r($this->clientSockets);
            $this->clientSockets[(string)$socketID] = null;
            unset($this->clientSockets[(string)$socketID]);
            //print_r($this->clientSockets);
        }

        private function sendMessageToSocket($socket, $msg){
            return fwrite($socket, $msg);
        }

        private function pingSocket($socket){
            //$this->loggerService->log("Ping: $socket");
            $this->loggerService->logToConsole("Ping: $socket");
            $msg = $this->messageService->createPingSignalMessage();
            return $this->sendMessageToSocket($socket, $msg->encode());
        }

        private function sendMessageToClients(array $client, $msg, $except = null){
            $back = $this->clientSockets;
            $back[$except] = null;
            unset($back[$except]);
            foreach ($client as $value) {
                $socketID = $value->getSocketID();
                if(isset($back[$socketID])){
                    $socket = $back[$socketID];
                    $this->sendMessageToSocket($socket, $msg);
                }else{
                    $this->loggerService->warn("Socket not found when sending message");
                }
            }
        }

        private function parseMessageFrom(Client $client, Message $msg){
            if(!isset($client) || !$client->getRoom()){
                $this->loggerService->warn("Client not defined");
                return;
            }

            $room = $client->getRoom();
            $roomClients = $room->getClients();
            $text = $msg->getType();

            switch ($text) {
                case OPCODE::TEXT:
                    $decodedJSON = $msg->getText();
                    $type = $decodedJSON['type'];

                    switch($type){
                        case 'chat':
                            if(!$client->isMuted()){
                                $decodedJSON['name'] = $client->getName()." ".$client->getSurname()." (".$client->getLogin().")";
                                $encodedJSON = $decodedJSON;
                                $msg = $this->messageService->createTextMessage($client, $encodedJSON);

                                $msgVO = new MessageVO($decodedJSON['messagetype'], $msg->getTime(), $msg->getText()['chat'], $client->getLogin(), $room->getRoomID());
                                DatabaseService::getInstance()->addMessageToChatHistory($msgVO);

                                $this->sendMessageToClients($roomClients, $msg->encode());
                            }else{
                                $muted = [
                                    "type" => "chat",
                                    "chat" => "Zostałeś zablokowany!",
                                    "name" => "SERVER"
                                ];
                                $msg = $this->messageService->createTextMessage($client, $muted);
                                //$this->sendMessageToSocket(null, $msg->encode());
                                $this->sendMessageToClients([$client], $msg->encode());
                            }
                            break;
                        
                        case 'event':
                            if($client->isAdmin()){
                                if($decodedJSON['event']=="redirection"){
                                    $urlde = urldecode($decodedJSON['url']);
                                    if($urlde != "" && $urlde != "http://" && $urlde != "https://"){
                                        $this->sendMessageToClients($roomClients, $msg->encode(), $client->getSocketID());
                                        $room->addUrlToHistory($decodedJSON['url']);
                                        DatabaseService::getInstance()->addUrlToHistory($decodedJSON['url'], $client->getLogin());
                                        $room->setUrl($decodedJSON['url']);
                                        $this->sendUrlHistoryToSocket($this->clientSockets[$client->getSocketID()], $room);
                                        $this->loggerService->log("Room: ".$room->getRoomName()." \tURL changed: ".$room->getUrl());
                                    }
                                }
                                if($decodedJSON['event']=="scroll"){
                                    $this->sendMessageToClients($roomClients, $msg->encode(), $client->getSocketID());
                                    $room->setScrollPositionX($decodedJSON['x']);
                                    $room->setScrollPositionY($decodedJSON['y']);
                                    $this->loggerService->log("Room: ".$room->getRoomName()." \tScroll changed: ".$room->getScrollPositionX()." | ".$room->getScrollPositionY());
                                }
                            }
                            $this->loggerService->log("Room: ".$room->getRoomName()." event: ".$decodedJSON[$type]);
                            break;
                        case 'mute':
                            if($client->isAdmin()){
                                $clientToMute = $room->getClientByLogin($decodedJSON['login']);
                                if($clientToMute != null && $room->getAdminID() != $clientToMute->getLogin()){
                                    $clientToMute->mute();
                                    $this->sendClientsToAllInRoom($room);
                                }
                            }
                            break;

                        case 'hand':
                            $clientToHand = $client;
                            if($clientToHand != null){
                                $clientToHand->hand();
                                $this->sendClientsToAllInRoom($room);

                                if($clientToHand->hasHand()){
                                    $msg = $this->messageService->createHandRaiseMessage(true);
                                    $this->sendMessageToClients([$clientToHand], $msg->encode());
                                }else{
                                    $msg = $this->messageService->createHandRaiseMessage(false);
                                    $this->sendMessageToClients([$clientToHand], $msg->encode());
                                }
                            }else{
                                $msg = $this->messageService->createHandRaiseMessage(false);
                                $this->sendMessageToClients([$clientToHand], $msg->encode());
                            }
                            break;

                        default:
                            $this->loggerService->warn("Undefined JSON type received: $type");
                            break;
                    }
                    break;
                
                case OPCODE::CLOSE:
                    $this->destroySocketByID($client->getSocketID());
                    $this->loggerService->log("Client: ".$client->getLogin()." left room: ".$room->getRoomName()." (".$room->getRoomID().")");
                    $this->clientService->destroyClientBySocketID($client->getSocketID());
                    $this->sendClientsToAllInRoom($room);
                    break;

                case OPCODE::PING:
                    break;
                
                case OPCODE::PONG:
                    $this->loggerService->logToConsole("Pong from: ".$client->getSocketID());
                    break;

                default:
                    $this->loggerService->warn("Undefined message type received");
                    break;
            }
        }

        private function sendClientsToAllInRoom(Room $room){
            if(!isset($room)){
                $this->loggerService->warn("Undefined variable \$room");
                return;
            }

            $list = array();
            $roomClients = $room->getClients();

            foreach($roomClients as $item){
                $list[] = [
                    "login" => $item->getLogin(),
                    "name" => $item->getName()." ".$item->getSurname()." (".$item->getLogin().")",
                    "permission" => ($item->isMuted()) ? false : true,
                    "hand" => ($item->hasHand()) ? true : false
                ];
            }

            $clientsList = [
                "type" => "updatelist",
                "clients" => $list
            ];
            //createMessage($author, $type, $text){
            $msg = $this->messageService->createMessage(null, OPCODE::TEXT, $clientsList);

            $this->sendMessageToClients($roomClients, $msg->encode());
        }

        private function sendChatHistoryToSocket($socket, $hist){
            $clearMSG = $this->messageService->createClearChatMessage();
            $this->sendMessageToSocket($socket, $clearMSG->encode());

            foreach ($hist as $value) {
                $this->sendMessageToSocket($socket, $value->encode());
            }
        }

        private function sendUrlHistoryToSocket($socket, $room){
            $hist = $this->roomService->getUrlHistoryAsArray($room->getRoomID());
            $list = array();
            foreach ($hist as $value) {
                //print_r(parse_url(urldecode($value)));
                $list[] = [
                    "title" => parse_url(urldecode($value))['host'],
                    //"title" => $value,
                    "link" => urldecode($value),
                    "date" => "placeholder"
                ];
            }
            $historyList = [
                "type" => "updatehistory",
                "history" => $list
            ];

            $msg = $this->messageService->createMessage(null, OPCODE::TEXT, $historyList);
            $this->sendMessageToSocket($socket, $msg->encode());
        }

        private function sendStartInfoToSocket($socket){
            $client = $this->clientService->getClientBySocketID((string)$socket);
            $room = $client->getRoom();
            $roomVO = $room->getRoomVO();
            
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
            $authMSG = $this->messageService->createMessage(null, OPCODE::TEXT, $auth);
            $urlMSG = $this->messageService->createMessage(null, OPCODE::TEXT, $url);
            $scrollMSG = $this->messageService->createMessage(null, OPCODE::TEXT, $scroll);
            $infoMSG = $this->messageService->createMessage(null, OPCODE::TEXT, $info);
            $this->sendMessageToSocket($socket, $authMSG->encode());
            $this->sendMessageToSocket($socket, $urlMSG->encode());
            $this->sendMessageToSocket($socket, $scrollMSG->encode());
            $this->sendMessageToSocket($socket, $infoMSG->encode());
            $this->sendClientsToAllInRoom($room);
            //$this->sendMessageToSocket($socket, $this->roomService->getMessageHistoryAsTextArray());
            $msgHistArray = $this->roomService->getMessageHistoryAsArray($room->getRoomID());
            $this->sendChatHistoryToSocket($socket, $msgHistArray);

            if($client->isAdmin()){
                $this->sendUrlHistoryToSocket($socket, $room);
            }
            
            //$msgHist = $this->messageService->createMessage(null, OPCODE::TEXT, $msgHistArray);
            //$this->sendMessageToSocket($socket, $msgHist->encode());
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

        public function main(){
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
                            if($message->getType() != OPCODE::PING && $message->getType() != OPCODE::PONG){
                                $this->loggerService->log("New message from: ".$messageAuthor->getLogin()."(".$messageAuthor->getSocketID().") | Message: ".json_encode($message->getText()));
                            }                            

                            $this->parseMessageFrom($messageAuthor, $message);
                        }
                    }
                }

                if($this->sleepCounter > $this->pingInterval/$this->sleepInterval*1000000){
                    foreach ($this->clientSockets as $socket) {
                        $client = $this->clientService->getClientBySocketID((string)$socket);
                        $room = $client->getRoom();
                        if(!$room){
                            $msg = $this->messageService->createCloseSignalMessage();
                            $this->sendMessageToSocket($socket, $msg->encode());
                        }
                        if(!$this->pingSocket($socket) || !$room){
                            $this->destroySocketByID($client->getSocketID());
                            $this->loggerService->log("Connection timeout: \tClient: ".$client->getLogin());
                            $this->clientService->destroyClientBySocketID($client->getSocketID());
                        }
                    }
                    foreach ($this->roomService->getAllRooms() as $room) {
                        $this->sendClientsToAllInRoom($room);
                    }
                    $this->sleepCounter = 1;
                }
                usleep($this->sleepInterval);
                $this->sleepCounter++;
            }
        }
    }
?>
