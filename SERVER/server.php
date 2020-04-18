<?php
    // require_once __DIR__."/webSocket.php";
    #written according to RFC 6455
    #https://tools.ietf.org/html/rfc6455
    #error_reporting(~E_NOTICE);
    error_reporting(E_ALL);
    set_time_limit(0);
    ob_implicit_flush();

    #$webS = new WebSocket(6969);
    #$var = 1;

    abstract class SERVER_SOCKET_TYPE{
        const SOCKET = 0;
        const WEBSOCKET = 1;
    }

    class Server{
        private $sock;
        
        function __construct($address = "127.0.0.1", $port, $type){
            switch ($type) {
                case SERVER_SOCKET_TYPE::SOCKET:
                    break;
                case SERVER_SOCKET_TYPE::WEBSOCKET:
                    $this->sock = new WebSocket($address, $port);
                    break;
                default:
                    die("ERROR: Wrong socket type");
                    break;
            }
            $socket = socket_create(AF_INET, SOCK_STREAM, 0);
            socket_bind($socket,'127.0.0.1',6969);
            socket_listen($socket, 10);
        }
    }

    while(true){
        if ($var >= 5) {
            print "\r\n";
            unset($webS);
            break;
        }
        print $var;
        $var++;
        sleep(1);
    }

    function handshake($sock, $msg){
        $GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

        print($msg);
        $HTTPdata = array();
        $HTTPlines = explode("\r\n", trim($msg));

        foreach ($HTTPlines as $key => $line) {
            if($key>0){
                $tmp = explode(": ", trim($line));
                $HTTPdata[$tmp[0]] = $tmp[1];
            }
        }
        print_r($HTTPdata);

        $concatenation = $HTTPdata['Sec-WebSocket-Key'].$GUID;
        // $concatenation = "dGhlIHNhbXBsZSBub25jZQ==".$GUID;
        $sha = sha1($concatenation);
        $hex = str_split($sha, 2);
        
        $rawToken = "";
        for ($i = 0; $i < 20; $i++) {
            $rawToken .= chr(hexdec(substr($sha,$i*2, 2)));
        }

        $magicKeyHash = base64_encode($rawToken);
        $magic_text = "HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\nSec-WebSocket-Protocol: chat";
        $response = "HTTP/1.1 101 Switching Protocols\r\n"
                    ."Upgrade: websocket\r\n"
                    ."Connection: Upgrade\r\n"
                    ."Sec-WebSocket-Accept: $magicKeyHash\r\n";
                    //."Sec-WebSocket-Protocol: chat\r\n";
        $response = "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: $magicKeyHash\r\n\r\n";
        socket_write($sock, $response, strlen($response));
        print "Sending:\r\n$response";
    }

    
    $clients = array();

    /*$socket = socket_create_listen(6969) or die("ERROR");
    while(true){
        if($client = socket_accept($socket)){
            socket_getpeername($client, $address, $port);
            echo "New connection: $address:$port\n";
            
            $msg = socket_read($client, 1024);
            if(strpos($msg, "\r\n\r\n") == false){
                continue;
            }

            handshake($client, $msg);
            $clients[] = $client;
        }

        foreach ($clients as $key => $value) {
            $msg = null;
            if($msg = socket_read($value,  1024)){
                echo "$key: $msg\n";
            }
        }
    }*/

    /*$socket = socket_create(AF_INET, SOCK_STREAM, 0);
    socket_bind($socket,'127.0.0.1',6969);
    socket_listen($socket, 10);
    socket_set_nonblock($socket);

    $clients = array();
    $read = array();
    
    while(true)
    {
        $read = array();
        $read[0] = $socket;

        $read = array_merge([$socket], $clients);
        #print_r($read);

        socket_select($read, $write, $except, null);

        #if there is new connection
        if(in_array($socket, $read)){
            $newSock = socket_accept($socket);
            socket_set_nonblock($newSock);
            $clients[] = $newSock;
            socket_getpeername($clients[count($clients)-1], $address, $port);
            echo "New connection from: $address:$port\n";
        }
    }*/

    /*$uri = "tcp://127.0.0.1:6969";
    $flags = STREAM_SERVER_BIND | STREAM_SERVER_LISTEN;
    $serverSocket = @stream_socket_server($uri, $errno, $errstr, $flags);
    socket_set_nonblock($serverSocket);
    if(!$serverSocket || $errno){
        die("ERROR...");
    }

    while(true){
        while($client = stream_socket_accept($serverSocket, -1)){
            socket_set_nonblock($client);
            print("MAMY TO!");
        }
    }*/
    
?>