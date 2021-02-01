<?php
    require_once __DIR__."/../Domain/Message.php";

    class MessageService{
        private static $instance;

        private $loggerService;

        function __construct($logger){
            self::$instance = $this;

            $this->loggerService = $logger;
        }

        public static function getInstance(){
            return self::$instance;
        }

        public function createMessage($author, $type, $text){
            $message = new Message($type, $author, null, $text);
            return $message;
        }

        public function createTextMessage($author, $text){
            $msg = new Message(OPCODE::TEXT, $author, null, $text);
            $this->addMessageToHistory($msg);
            return $msg;
        }

        public function createCloseSignalMessage(){
            $msg = new Message(OPCODE::CLOSE, null, null, null);
            return $msg;
        }

        public function createPingSignalMessage(){
            $msg = new Message(OPCODE::PING, null, null, null);
            return $msg;
        }

        public function createPongSignalMessage(){
            $msg = new Message(OPCODE::PONG, null, null, null);
            return $msg;
        }

        public function createMessageFromIncomingData($author, $data){
            $message = new Message(null, $author, null, null);
            $message->decode($data);
            return $message;
        }

        public function createClearChatMessage(){
            $data = [
                "type" => "oldchat"
            ];
            $msg = new Message(OPCODE::TEXT, null, null, $data);
            return $msg;
        }

        private function addMessageToHistory(Message $msg){
            $client = $msg->getAuthor();
            if($client){
                $room = $client->getRoom();
                $room->addMessageToHistory($msg);
            }
        }
    }
?>
