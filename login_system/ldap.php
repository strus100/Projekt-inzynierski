<?php
    class LDAP{
        public static function login($login, $password){
            $address = "ldap://labs.wmi.amu.edu.pl";
            $root = "OU=People,DC=labs,DC=wmi,DC=amu,DC=edu,DC=pl";

            $filter = "(cn=$login)";
    
            $conn = ldap_connect($address, 636);
            if(!$conn){
                $return = [
                    "type" => "login",
                    "login" => 0,
                    "access" => "connection"
                ];
                return $return;
            }
            ldap_set_option($conn, LDAP_OPT_PROTOCOL_VERSION, 3);
    
            $bind = ldap_bind($conn, $login."@labs.wmi.amu.edu.pl", $password);
            if($bind){
                $result = ldap_search($conn, $root, $filter);
                $data = ldap_get_entries($conn, $result);
                if($data["count"] != 1){
                    $return = [
                        "type" => "login",
                        "login" => 0,
                        "access" => "count"
                    ];
                }
                switch (strtolower($data[0]["description"][0])) {
                    case 'student':
                        $return = [
                            "type" => "login",
                            "login" => 1,
                            "access" => "student",
                            "name" => $data[0]["givenname"][0],
                            "surname" => $data[0]["sn"][0],
							"email" => $data[0]["mail"][0]
                        ];
                        break;
                    case 'doktorant':
                        $return = [
                            "type" => "login",
                            "login" => 1,
                            "access" => "doktorant",
                            "name" => $data[0]["givenname"][0],
                            "surname" => $data[0]["sn"][0],
							"email" => $data[0]["mail"][0]
                        ];
                        break;
                    case 'pracownik':
                        $return = [
                            "type" => "login",
                            "login" => 1,
                            "access" => "pracownik",
                            "name" => $data[0]["givenname"][0],
                            "surname" => $data[0]["sn"][0],
							"email" => $data[0]["mail"][0]
                        ];
                        break;
                    default:
                        $return = [
                            "type" => "login",
                            "login" => 0,
                            "access" => "login"
                        ];
                        break;
                }
                
            }else{
                $return = [
                    "type" => "login",
                    "login" => 0,
                    "access" => "login"
                ];
            }
            ldap_close($conn);
            return $return;
        }
    };
?>