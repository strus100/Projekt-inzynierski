<?php
    require_once __DIR__."/../database/DatabaseConnection.php";

    $db = new DatabaseConnection();
    $db->connect();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $roomID = htmlspecialchars($_GET['roomID']);

        if(canManipulate($db, $roomID)){
            if(isset($_GET['listName'])){
                $listName = htmlspecialchars($_GET['listName']);
                echo json_encode(["list" => $db->getAttendance($roomID, $listName)]);
            }else{
                echo json_encode(["list" => $db->getAllAttendanceListsByRoom($roomID)]);
            }
        }else{
            echo json_encode(["list" => []]);
        }

    }elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $request_body = file_get_contents("php://input");
        $data = json_decode($request_body, true);
        
        $roomID = htmlspecialchars($data['roomID']);
        $userList = $data['list'];

        $db->createAttendance($roomID, $userList);
        echo json_encode(["list" => $db->getAllAttendanceListsByRoom($roomID)]);
    }

    $db->closeConnection();

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