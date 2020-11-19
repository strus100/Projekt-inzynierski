<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/../Infrastructure/Database.php";
    require_once __DIR__."/../Entities/RoomEntity.php";
    require_once __DIR__."/../Entities/ClientEntity.php";

    class DatabaseService{
        public static function getRoomByID($roomID){
            $roomID = htmlspecialchars($roomID);

            $db = new Database();
            $result = $db->query("SELECT * FROM `rooms` WHERE `id` = '$roomID';");
            $db->close();

            $array = null;
            if($result->num_rows == 1){
                while($row = $result->fetch_assoc()){
                    $room = new RoomEntity($row['id'], $row['roomName'], $row['admin']);
                    $array = $room;
                }
            }else{
                LoggerService::warn("Room not found\tid: $roomID");
            }
            
            return $array;
        }

        public static function getClientByToken($token){
            $token = htmlspecialchars($token);

            $db = new Database();
            $result = $db->query("SELECT * FROM `usertable` WHERE `token` = '$token';");
            $db->close();

            $array = null;
            if($result->num_rows == 1){
                while($row = $result->fetch_assoc()){
                    $client = new ClientEntity($row['login'], $row['role'], $row['name'], $row['surname'], $row['room']);
                    $array = $client;
                }
            }else{
                LoggerService::warn("Client not found\ttoken: $token");
            }

            return $array;
        }
    }
?>
