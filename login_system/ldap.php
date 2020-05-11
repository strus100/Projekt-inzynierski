<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LDAP test</title>
    </head>
    <body>
        <?php
            if(isset($_POST['login']) && isset($_POST['password'])){
                $address = "ldap://labs.wmi.amu.edu.pl";
                $root = "DC=labs,DC=wmi,DC=amu,DC=edu,DC=pl";
                $login = htmlspecialchars($_POST['login']);
                $password = htmlspecialchars($_POST['password']);
                $filter = "(cn=$login)";

                $conn = ldap_connect($address, 636) or die("Error connecting");
                ldap_set_option($conn, LDAP_OPT_PROTOCOL_VERSION, 3);

                $bind = ldap_bind($conn, $login."@labs.wmi.amu.edu.pl", $password);
                if($bind){
                    echo "<br>Logged in!<br><br>";
                    $result = ldap_search($conn, $root, $filter);
                    echo ldap_error($conn)."<br><br>";
                    $data = ldap_get_entries($conn, $result);
                    echo "<pre>";
                    print_r($data);
                    echo "</pre>";

                }else{
                    echo "<br>ERROR<br><br>";
                }

                ldap_close($conn);
            }
        ?>
        <form action="#" method="POST">
            <input type="text" name="login" id="login" placeholder="LOGIN">
            <input type="password" name="password" id="password" placeholder="PASSWORD">
            <input type="submit" value="zaloguj">
        </form>
    </body>
</html>