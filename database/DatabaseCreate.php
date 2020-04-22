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
			id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			login VARCHAR(30) NOT NULL,
			pass VARCHAR(30) NOT NULL,
			role VARCHAR(30),
			token VARCHAR(30)
			) ";

			if ($conn->query($sql) === TRUE) {
			echo "Table MyGuests created successfully\n";
			} else {
				echo "Error creating table: " . $conn->error;
			}
		}
		?>