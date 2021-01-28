<?php
    // Command Line Interface protection
    error_reporting(E_ALL);
    if(PHP_SAPI !== 'cli') die("Run only using CLI");

    require_once __DIR__."/Config.php";

    class Installation{
        private $DBconnection;

        function __construct(){
            $this->connectToDB();
            echo "Dropping Database ".Config::DB_NAME."\r\n";
            $this->dropDB();
            echo "Creating Database ".Config::DB_NAME."\r\n";
            $this->createDB();
            echo "Creating table usertable\r\n";
            $this->createUserTable();
            echo "Creating table rooms\r\n";
            $this->createRoomsTable();
            echo "Creating table files\r\n";
            $this->createFilesTable();
            echo "Creating table chathistory\r\n";
            $this->createChatHistoryTable();
            echo "Creating table urlhistory\r\n";
            $this->createUrlHistoryTable();
            echo "Creating table timesheet\r\n";
            $this->createTimesheetTable();
            echo "Creating table timesheetuser\r\n";
            $this->createTimesheetuserTable();
			
            $this->DBconnection->close();
        }

        private function connectToDB(){
            $this->DBconnection = new mysqli(Config::DB_SERVER_NAME, Config::DB_USERNAME, Config::DB_PASSWORD);
            if($this->DBconnection->connect_error){
                die("ERROR Cannot connect to database. Please check Config.php");
            }
        }

        private function dropDB(){
            $result = $this->DBconnection->query("DROP DATABASE IF EXISTS ".Config::DB_NAME);
            if($result == false){
                die("ERROR cannot drop database. Do you have sufficient permissions?");
            }
        }

        private function createDB(){
            $result = $this->DBconnection->query("CREATE DATABASE IF NOT EXISTS ".Config::DB_NAME." DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci");
            if($result == false){
                die("ERROR cannot create database. Do you have sufficient permissions?");
            }
            $this->DBconnection->query("USE ".Config::DB_NAME);
        }

        private function createUserTable(){
            $result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `usertable` (
                    `login` VARCHAR(255) NOT NULL,
                    `name` VARCHAR(255) NOT NULL,
                    `surname` VARCHAR(255) NOT NULL,
                    `role` VARCHAR(255) NOT NULL,
                    `token` VARCHAR(255) NOT NULL,
                    `room` INT NOT NULL,
                    `email` VARCHAR(255) NOT NULL,
                    PRIMARY KEY (`login`)
                ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");
            
            if($result == false){
                echo "ERROR cannot create usertable table\r\n";
                die($this->DBconnection->error);
            }
        }

        private function createRoomsTable(){
            $result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `rooms` (
                    `id` INT NOT NULL AUTO_INCREMENT,
                    `roomName` VARCHAR(255) NOT NULL,
                    `admin` VARCHAR(255) NOT NULL,
                    PRIMARY KEY (`id`),
                    FOREIGN KEY (`admin`) REFERENCES `usertable`(`login`) ON DELETE CASCADE
                ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");
            
            if($result == false){
                echo "ERROR cannot create rooms table\r\n";
                die($this->DBconnection->error);
            }
        }

        private function createFilesTable(){
            $result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `files` (
                    `id` INT NOT NULL AUTO_INCREMENT,
                    `name` VARCHAR(255) NOT NULL,
                    `location` VARCHAR(255) NOT NULL,
                    `login` VARCHAR(255) NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`login`) REFERENCES `usertable`(`login`) ON DELETE CASCADE
                ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");
            
            if($result == false){
                echo "ERROR cannot create files table\r\n";
                die($this->DBconnection->error);
            }
        }

        private function createChatHistoryTable(){
            $result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `chathistory` (
                    `id` INT NOT NULL AUTO_INCREMENT,
                    `date` DATETIME NOT NULL,
                    `message` TEXT NOT NULL,
                    `messagetype` TEXT NOT NULL,
                    `user` VARCHAR(255) NOT NULL,
                    `room` INT NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`user`) REFERENCES `usertable`(`login`) ON DELETE CASCADE,
                    FOREIGN KEY(`room`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
                ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");

            if($result == false){
                echo "ERROR cannot create chat history table\r\n";
                die($this->DBconnection->error);
            }
        }

        private function createUrlHistoryTable(){
			$result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `urlhistory` (
                    `id` INT NOT NULL AUTO_INCREMENT,
                    `date` DATETIME NOT NULL,
                    `url` TEXT NOT NULL,
                    `user` VARCHAR(255) NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`user`) REFERENCES `usertable`(`login`) ON DELETE CASCADE
                ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");

            if($result == false){
                echo "ERROR cannot create url history table\r\n";
                die($this->DBconnection->error);
            }
        }
		
		private function createTimesheetTable(){
		  $result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `timesheet` (
                    `id` INT NOT NULL AUTO_INCREMENT,
					`date` DATETIME NOT NULL,
                    `name` VARCHAR(255) NOT NULL,
                    `room` INT NOT NULL,
                    PRIMARY KEY(`id`),
                    FOREIGN KEY(`room`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
                ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");


            if($result == false){
                echo "ERROR cannot create timesheet table\r\n";
                die($this->DBconnection->error);
            }
        }
        
        private function createTimesheetuserTable(){
            $result = $this->DBconnection->query("CREATE TABLE IF NOT EXISTS `timesheetuser` (
                `id` INT NOT NULL AUTO_INCREMENT,
                `timesheet` INT NOT NULL,
                `user` VARCHAR(255) NOT NULL,
                PRIMARY KEY(`id`),
                FOREIGN KEY(`timesheet`) REFERENCES `timesheet`(`id`) ON DELETE CASCADE,
                FOREIGN KEY(`user`) REFERENCES `usertable`(`login`) ON DELETE CASCADE
            ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;");

            if($result == false){
                echo "ERROR cannot create timesheetuser table\r\n";
                die($this->DBconnection->error);
            }
        }
    }
    /*ID(FK auto_incr), message, autor(FK), pokój (FK) messagetype ??*/
    $consent = readline("WARNING! This procedure will DELETE ALL DATA from your database. Are you sure? ([Y]es | [N]o): ");
    
    if(strtolower($consent) == "y" || strtolower($consent) == "yes"){
        new Installation();
        echo "Installation complete";
    }else{
        echo "Exiting installation";
    }
?>
