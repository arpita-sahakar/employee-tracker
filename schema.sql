DROP DATABASE IF EXISTS walmart;

CREATE DATABASE walmart;

USE walmart;

CREATE TABLE department (
  dept_id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(45) not NULL,
  PRIMARY KEY (dept_id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  role_title VARCHAR(45) not NULL,
  salary DECIMAL(10,2) not NULL,
  dept_id varchar(30) not null,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) not NULL,
  last_name VARCHAR(45) not NULL,
  role_id varchar(30) not null,
  manager_id varchar(30) not null,
  PRIMARY KEY (id)
);