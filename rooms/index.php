<?php
    require_once __DIR__."/../database/DatabaseConnection.php";

    $dbConnection = new DatabaseConnection();
    $dbConnection->connect();

    if($_SERVER['REQUEST_METHOD'] == "POST"){
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);

        if(isset($data['name'])){
            $roomName = htmlspecialchars($data['name']);
            echo $dbConnection->createRoom($roomName);
        }
        elseif(isset($data['roomID'])){
            $roomID = htmlspecialchars($data['roomID']);
            $dbConnection->selectRoom($roomID);
        }
    }
    else{
        $rooms = $dbConnection->getRooms();
        echo json_encode($rooms);
    }

    $dbConnection->closeConnection();
?>