CREATE TABLE `usertable` (
 `login` varchar(255) NOT NULL,
 `name` varchar(255) NOT NULL,
 `surname` varchar(255) NOT NULL,
 `role` varchar(255) NOT NULL,
 `token` varchar(255) NOT NULL,
 `room` int(11) NOT NULL,
 `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4

CREATE TABLE files (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255),
location VARCHAR(255),
login VARCHAR(30) NOT NULL,
);

