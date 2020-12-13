<?php
    require_once __DIR__."/LoggerService.php";
    require_once __DIR__."/DatabaseService.php";

    require_once __DIR__."/ClientService.php";
    require_once __DIR__."/MessageService.php";
    require_once __DIR__."/RoomService.php";

    require_once __DIR__."/../Infrastructure/WebSocket.php";

    class ServerService{
        private $webSocket;
        private $loggerService;
        private $databaseService;
        private $roomService;
        private $clientService;
        private $messageService;

        function __construct($ip, $port){
            $this->loggerService = new LoggerService();
            $this->loggerService->log("Starting server...");

            $this->databaseService = new DatabaseService($this->loggerService);
            $this->roomService = new RoomService($this->loggerService, $this->databaseService, $this);
            $this->clientService = new ClientService($this->loggerService, $this->databaseService, $this->roomService, $this);
            $this->messageService = new MessageService($this->loggerService, $this);

            $this->webSocket = new WebSocket($ip, $port,
                                            $this->loggerService, $this->clientService, $this->messageService, $this->roomService);
        }
    }
?>
