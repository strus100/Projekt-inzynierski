<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/../Domain/Message.php";

    class MessageService{
        static function createMessage($author, $type, $text){
            $message = new Message($type, $author, null, $text);
            return $message;
        }

        static function createCloseSignalMessage(){
            $msg = new Message(OPCODE::CLOSE, null, null, null);
            return $msg;
        }

        static function createMessageFromIncomingData($author, $data){
            $message = new Message(null, $author, null, null);
            $message->decode($data);
            return $message;
        }
    }
?>
