-- Active: 1698687208544@@127.0.0.1@3306@verkkokauppa



CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer VARCHAR(255) NOT NULL
);

ALTER TABLE questions
ADD COLUMN isCorrect BOOLEAN;
