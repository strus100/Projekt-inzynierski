<?php
    // require_once __DIR__."/../Application/LoggerService.php";
    require_once __DIR__."/../ValueObjects/MessageVO.php";

    // First octet -> flags with OPCODE
    // RFC 6455 section 5.2 and 11.8
    abstract class OPCODE{
        const TEXT = 129;   //1000 0001 (FIN RSV1 RSV2 RSV3 4*opcode) TEXT frame opcode-%x1
        const CLOSE = 136;  //1000 1000 (FIN RSV1 RSV2 RSV3 4*opcode) CLOSE opcode-%x8
        const PING = 137;   //1000 1001 (FIN RSV1 RSV2 RSV3 4*opcode) PING opcode-%x9
        const PONG = 138;   //1000 1010 (FIN RSV1 RSV2 RSV3 4*opcode) PONG opcode-%xA
    }

    class Message{
        private $type;
        private $dateTime;
        private $text;
        private $author;
        private $room;

        function __construct($type, $author, $room, $text){
            if(!empty($type) &&
               $type != OPCODE::TEXT &&
               $type != OPCODE::CLOSE &&
               $type != OPCODE::PING &&
               $type != OPCODE::PONG){
                // LoggerService::error("Wrong message type: ".$type);
                return false;
            }

            $this->type = $type;
            $this->author = $author;
            $this->room = $room;
            $this->text = $text;

            $this->dateTime = new DateTime("NOW");
            $this->text["date"] = $this->dateTime->format('Y-m-d H:i');
            
            return true;
        }

        // RFC 6455 section 5.2
        public function encode(){
            $text = json_encode($this->text);
            
            $length = strlen($text);
            $datagramBytes[0] = $this->type;

            if($length <= 125){
                $datagramBytes[1] = $length;
            }
            elseif($length >= 126 && $length <= 65535){
                $datagramBytes[1] = 126;
                $datagramBytes[2] = ($length >> 8) & 255;
                $datagramBytes[3] = $length & 255;
            }
            elseif($length > 65535){
                $datagramBytes[1] = 127;
                $datagramBytes[2] = ($length >> 56) & 255;
                $datagramBytes[3] = ($length >> 48) & 255;
                $datagramBytes[4] = ($length >> 40) & 255;
                $datagramBytes[5] = ($length >> 32) & 255;
                $datagramBytes[6] = ($length >> 24) & 255;
                $datagramBytes[7] = ($length >> 16) & 255;
                $datagramBytes[8] = ($length >> 8) & 255;
                $datagramBytes[9] = $length & 255;
            }
            else{
                // LoggerService::error("Cannot encode message - wrong length");
            }
            $parsedDatagramBytes = array_map("chr", $datagramBytes);
            return implode($parsedDatagramBytes).$text;
        }

        // RFC 6455 section 5.2
        public function decode($message){
            $splitted = str_split($message);
            $octets = array_map("ord", $splitted);

            $this->type = $octets[0];
            
            $length = $octets[1] & 127;
            $index = null;

            if($length <= 125){
                $index = 2;
            }
            elseif($length == 126){
                $index = 4;
            }
            elseif($length == 127){
                $index = 10;
            }
            else{
                // LoggerService::error("Wrong message length");
                return null;
            }

            // RFC 6455 section 5.3
            // Mask length is 32-bit value (4 octets)
            $mask = array_slice($octets, $index, 4);
            $message = "";
            for($i = $index+4, $j=0; $i < count($octets); $i++. $j++){
                $message .= chr($octets[$i] ^ $mask[$j%4]);
            }

            $this->text = json_decode($message, true);
            return $this->getText();
        }

        public function send(){
            $msg = $this->encode();
        }

        // Getters
        public function getAuthor(){
            return $this->author;
        }

        public function getRoom(){
            return $this->room;
        }

        public function getTime(){
            return $this->dateTime;
        }

        public function getText(){
            if($this->type == OPCODE::PING){
                return "PING";
            }
            elseif($this->type == OPCODE::PONG){
                return "PONG";
            }
            elseif($this->type == OPCODE::CLOSE){
                return "CLOSE";
            }
            elseif($this->type == OPCODE::TEXT){
                return $this->text;
            }
            else{
                return $this->type;
            }
        }

        public function getType(){
            return $this->type;
        }

        public function getVO(){
            return new MessageVO($this->type, $this->dateTime, $this->text, $this->author, $this->room);
        }
    }
?>
