-- Create the database
CREATE DATABASE study_cafe_finder;

-- Use the database
USE study_cafe_finder;

-- Create the cafes table
CREATE TABLE cafes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  wifi BOOLEAN NOT NULL,
  power BOOLEAN NOT NULL,
  food BOOLEAN NOT NULL,
  image VARCHAR(255) NOT NULL
);

-- Create the users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

-- Create the favorites table
CREATE TABLE favorites (
  user_id INT NOT NULL,
  cafe_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (cafe_id) REFERENCES cafes(id),
  PRIMARY KEY (user_id, cafe_id)
);

-- Insert some sample data into the cafes table
INSERT INTO cafes (name, address, city, rating, wifi, power, food, image) VALUES
('Café Retro', 'Knabrostræde 26, 1210 København', 'Copenhagen', 4.5, TRUE, TRUE, TRUE, 'cafe_retro.jpg'),
('Paludan Bogcafé', 'Fiolstræde 10, 1171 København', 'Copenhagen', 4.3, TRUE, TRUE, TRUE, 'paludan_bogcafe.jpg'),
('The Living Room', 'Larsbjørnsstræde 17, 1454 København', 'Copenhagen', 4.2, TRUE, TRUE, TRUE, 'the_living_room.jpg'),
('Riccos Kaffebar', 'Sluseholmen 28, 2450 København', 'Copenhagen', 4.1, TRUE, TRUE, FALSE, 'riccos_kaffebar.jpg'),
('Democratic Coffee Bar', 'Krystalgade 15, 1172 København', 'Copenhagen', 4.0, TRUE, FALSE, FALSE, 'democratic_coffee_bar.jpg');

-- Insert some sample data into the users table
INSERT INTO users (username, password, email) VALUES
('alice', 'password123', 'alice@example.com'),
('bob', 'password456', 'bob@example.com'),
('charlie', 'password789', 'charlie@example.com');

-- Insert some sample data into the favorites table
INSERT INTO favorites (user_id, cafe_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5);