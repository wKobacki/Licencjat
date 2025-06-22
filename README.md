install dependencies:

npm install

data base to this project in MySQL:

CREATE DATABASE IF NOT EXISTS ideas_stock;
USE ideas_stock;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL,
    name VARCHAR(100),
    surname VARCHAR(100),
    branch VARCHAR(100),
    isVerified TINYINT DEFAULT 0,
    isBlocked TINYINT DEFAULT 0
);

CREATE TABLE ideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    solution TEXT,
    images TEXT,
    branch VARCHAR(100),
    author_email VARCHAR(255),
    isPublished TINYINT DEFAULT 0,
    status VARCHAR(50),
    votes INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    archived TINYINT DEFAULT 0,
    FOREIGN KEY (author_email) REFERENCES users(email)
);

CREATE TABLE problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    solution TEXT,
    images TEXT,
    branch VARCHAR(100),
    author_email VARCHAR(255),
    isPublished TINYINT DEFAULT 0,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    votes INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    archived TINYINT DEFAULT 0,
    FOREIGN KEY (author_email) REFERENCES users(email)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    item_type ENUM('idea', 'problem') NOT NULL,
    parent_id INT,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    FOREIGN KEY (author_email) REFERENCES users(email)
);

CREATE TABLE comment_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_email) REFERENCES users(email),
    UNIQUE (comment_id, user_email)
);

CREATE TABLE user_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    item_id INT NOT NULL,
    item_type ENUM('idea', 'problem') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email),
    UNIQUE (user_email, item_id, item_type)
);

CREATE TABLE reset_tokens (
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email),
    PRIMARY KEY (email)
);

CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)
);

file .env:
REACT_APP_API_URL=http://127.0.0.1:5000