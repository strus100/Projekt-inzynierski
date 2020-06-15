<?php
	function createDatabase(){
			$servername = "localhost";
			$username = "root";
			$password = "";
			// Create connection
			$connOnce = new mysqli($servername, $username, $password);

			// Check connection
			if ($connOnce->connect_error) {
				die("Connection failed: " . $connOnce->connect_error);
			}
			echo "Connected successfully\n";
			
			// Create database
			$sql = "CREATE DATABASE IF NOT EXISTS bazaInz";
			if ($connOnce->query($sql) === TRUE) {
				echo "Database created successfully";
			} else {
				echo "Error creating database: " . $connOnce->error;
			}
	}
		
	function createTable($conn){
		// sql to create table
		$sql = "CREATE TABLE IF NOT EXISTS userTable (
			login VARCHAR(50) NOT NULL,
			name VARCHAR(255) NOT NULL,
			surname VARCHAR(255) NOT NULL,
			role VARCHAR(30) NOT NULL,
			token VARCHAR(255)
		) ";

		if ($conn->query($sql) === TRUE) {
			echo "Table userTable created successfully\n";
		} else {
			echo "Error creating table: " . $conn->error;
		}
	}
?>