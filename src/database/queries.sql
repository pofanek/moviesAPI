USE baza;
--------------
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL,
    imagePath VARCHAR(20) NOT NULL
);
DROP TABLE movies;
--------------
INSERT INTO movies (name, description, imagePath)
VALUES ('test', 'test2', 'test3');
--------------
DELETE FROM movies;
--------------
ALTER TABLE movies
MODIFY COLUMN imagePath VARCHAR(255);