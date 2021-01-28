<?php
    require_once __DIR__."/../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();
    $token = htmlspecialchars($_COOKIE['token']);

    if($_SERVER['REQUEST_METHOD'] == "POST"){
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);

        if(isset($data['roomID']) && isset($data['name'])){
            $roomID = htmlspecialchars($data['roomID']);
            $roomName = htmlspecialchars($data['name']);

            if(canManipulate($dbConnection, $roomID)){
                echo $dbConnection->renameRoom($roomID, $roomName);
            }
        }
        elseif(isset($data['name'])){
            if(canManipulate($dbConnection)){
                $roomName = htmlspecialchars($data['name']);

                echo $dbConnection->createRoom($roomName);
            }
        }
        elseif(isset($data['roomID'])){
            $roomID = htmlspecialchars($data['roomID']);
            if($dbConnection->selectRoom($roomID)){
                $room = $dbConnection->getRoom($roomID);
                if($room){
                    $roomName = $room['roomName'];
                    $json = [
                        "name" => $roomName,
                        "admin" => canManipulate($dbConnection, $roomID)
                    ];
                    echo json_encode($json);
                    /*if(canManipulate($dbConnection, $roomID)){
                        echo "{name: $roomName, admin: true}";
                    }else{
                        echo "{name: $roomName, admin: false}";
                    }*/
                }
            }
        }
        elseif (isset($data['deleteID'])) {
            $roomID = htmlspecialchars($data['deleteID']);

            if(canManipulate($dbConnection, $roomID)){
                echo $dbConnection->deleteRoom($roomID);
            }
        }
    }
    else{
        $rooms = $dbConnection->getRooms();
        echo json_encode($rooms);
    }

    $dbConnection->closeConnection();


    

    function canManipulate($db, $roomID=false){
        $token = htmlspecialchars($_COOKIE['token']);

        if(!($user = $db->getUserByToken($token))){
            return false;
        }

        if($user['role'] != "pracownik" && $user['role'] != "doktorant"){
            return false;
        }

        $login = $user['login'];
        $currentRoom = $user['room'];

        if($roomID){
            if(!($room = $db->getRoom($roomID))){
                return false;
            }
            if($room['id'] != $currentRoom || $room['admin'] != $login){
                return false;
            }
        }

        return true;
    }
?>