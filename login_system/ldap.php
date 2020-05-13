<?php
    if(isset($_POST['JSON'])){
        $decoded_JSON_array = json_decode($_POST['JSON'], true);
        if(htmlspecialchars($decoded_JSON_array['type']) !== "login") die();
        
        $address = "ldap://labs.wmi.amu.edu.pl";
        $root = "OU=People,DC=labs,DC=wmi,DC=amu,DC=edu,DC=pl";
        $login = htmlspecialchars($decoded_JSON_array['login']);
        $password = htmlspecialchars($decoded_JSON_array['password']);
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
                    break;
                case 'doktorant':
                    echo "{\"type\": \"login\", \"login\": 1, \"access\": \"doktorant\"}";
                    break;
                case 'pracownik':
                    echo "{\"type\": \"login\", \"login\": 1, \"access\": \"pracownik\"}";
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
?>