CREATE DATABASE jwt_app_db CHARACTER SET utf8 COLLATE utf8_general_ci;

USE jwt_app_db;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
