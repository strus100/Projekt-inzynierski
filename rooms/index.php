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
            echo $dbConnection->renameRoom($roomID, $roomName);
        }
        elseif(isset($data['name'])){
            $roomName = htmlspecialchars($data['name']);
            echo $dbConnection->createRoom($roomName);
        }
        elseif(isset($data['roomID'])){
            $roomID = htmlspecialchars($data['roomID']);
            echo $dbConnection->selectRoom($roomID);
        }
        elseif (isset($data['deleteID'])) {
            $roomID = htmlspecialchars($data['deleteID']);
            echo $dbConnection->deleteRoom($roomID);
        }
    }
    else{
        $rooms = $dbConnection->getRooms();
        echo json_encode($rooms);
    }

    $dbConnection->closeConnection();
?>