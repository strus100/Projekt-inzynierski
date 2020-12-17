<?php

require_once __DIR__."/../database/DatabaseConnection.php";

use PHPUnit\Framework\TestCase;

class DatabaseConnectionTest extends TestCase
{
    public function testGetUserByToken()
    {
        $dbConnection = new DatabaseConnection();
        $dbConnection->connect();
        $user = $dbConnection->getUserByToken("");

        \PHPUnit\Framework\assertEquals("Andrzej", $user["name"] );
        \PHPUnit\Framework\assertEquals("Polak", $user["surname"] );
        \PHPUnit\Framework\assertEquals("0", $user["room"] );
        \PHPUnit\Framework\assertEquals("student", $user["role"] );
        \PHPUnit\Framework\assertEquals("test1@test.pl", $user["email"] );
    }

    public function testRenameRoom()
    {
        $dbConnection = new DatabaseConnection();
        $dbConnection->connect();

        $dbConnection->renameRoom( 28, "TEST_2" );
        $roomFromDB = $dbConnection->getRoom( 28 );
        \PHPUnit\Framework\assertEquals("TEST_2", $roomFromDB["roomName"]);

        $dbConnection->renameRoom( 28, "TEST" );
        $roomFromDB = $dbConnection->getRoom( 28 );
        \PHPUnit\Framework\assertEquals("TEST", $roomFromDB["roomName"]);

    }

    public function testGetUserByLogin()
    {
        $dbConnection = new DatabaseConnection();
        $dbConnection->connect();
        $user = $dbConnection->getUserByLogin( "student" );

        \PHPUnit\Framework\assertEquals("Andrzej", $user["name"] );
        \PHPUnit\Framework\assertEquals("Polak", $user["surname"] );
        \PHPUnit\Framework\assertEquals("0", $user["room"] );
        \PHPUnit\Framework\assertEquals("student", $user["role"] );
        \PHPUnit\Framework\assertEquals("test1@test.pl", $user["email"] );
    }

    public function testGetLastId()
    {
        $dbConnection = new DatabaseConnection();
        $dbConnection->connect();
        $id = $dbConnection->getLastId();
        \PHPUnit\Framework\assertEquals( 0, $id["last_insert_id()"] );
    }
}
