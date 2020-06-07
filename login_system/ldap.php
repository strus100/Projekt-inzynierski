<?php
    require_once __DIR__."/../database/DatabaseConnection.php";

    if( isset($_POST['login']) && isset($_POST['password']) ){
        $address = "ldap://labs.wmi.amu.edu.pl";
        $root = "OU=People,DC=labs,DC=wmi,DC=amu,DC=edu,DC=pl";
        $login = htmlspecialchars($_POST['login']);
        $password = htmlspecialchars($_POST['password']);
        $filter = "(cn=$login)";

        $conn = ldap_connect($address, 636) or die("{\"type\": \"login\", \"login\": 0, \"access\": \"connection\"}");
        ldap_set_option($conn, LDAP_OPT_PROTOCOL_VERSION, 3);

        $bind = ldap_bind($conn, $login."@labs.wmi.amu.edu.pl", $password);
        if($bind){
            $result = ldap_search($conn, $root, $filter);
            $data = ldap_get_entries($conn, $result);
            if($data["count"] != 1) die("{\"type\": \"login\", \"login\": 0, \"access\": \"count\"}");
            switch (strtolower($data[0]["description"][0])) {
                case 'student':
                    echo "{\"type\": \"login\", \"login\": 1, \"access\": \"student\"}";
                    fillDatabase($login, "student");
                    break;
                case 'doktorant':
                    echo "{\"type\": \"login\", \"login\": 1, \"access\": \"doktorant\"}";
                    fillDatabase($login, "doktorant");
                    break;
                case 'pracownik':
                    echo "{\"type\": \"login\", \"login\": 1, \"access\": \"pracownik\"}";
                    fillDatabase($login, "pracownik");
                    break;
                default:
                    echo "{\"type\": \"login\", \"login\": 0, \"access\": \"login\"}";
                    break;
            }
            
        }else{
            echo "{\"type\": \"login\", \"login\": 0, \"access\": \"login\"}";
        }
        ldap_close($conn);
    }

    function fillDatabase($login, $role){
        $random = rand().microtime().rand();
        $token = md5($random);
        
        $db = new DatabaseConnection();
        $conn = $db->connect();
        $stmt = $conn->prepare("SELECT * FROM userTable WHERE login = ?");
        $stmt->bind_param('s', $login);
        $stmt->execute();
        $stmt->store_result();

        if($stmt->num_rows == 1){
            $stmt->close();
            $stmt = $conn->prepare("UPDATE userTable SET `login`=?, `role`=?, `token`=?");
            $stmt->bind_param('sss', $login, $role, $token);
            $stmt->execute();
        }
        else{
            $stmt->close();
            $stmt = $conn->prepare("INSERT INTO userTable VALUES (?, ?, ?)");
            $stmt->bind_param('sss', $login, $role, $token);
            $stmt->execute();
        }

        $conn->close();
    }
?>