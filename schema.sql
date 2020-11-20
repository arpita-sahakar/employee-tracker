DROP DATABASE IF EXISTS organization_db;
CREATE DATABASE organization_db;
USE organization_db;
CREATE TABLE department (
  dept_id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(45) not NULL,
  PRIMARY KEY (dept_id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  role_title VARCHAR(45) not NULL,
  salary DECIMAL(10, 2) not NULL,
  dept_id varchar(30) not null,
  PRIMARY KEY (id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) not NULL,
  last_name VARCHAR(45) not NULL,
  role_id varchar(30) not null,
  manager_id varchar(30),
  PRIMARY KEY (id)
);
insert into department(dept_name) value ("marketing");
insert into department(dept_name) value ("HR");
insert into department(dept_name) value ("accounts");
insert into department(dept_name) value ("IT");
insert into department(dept_name) value ("maintenance");
select *
from department;
insert into role(role_title, salary, dept_id)
values("associate", 30000, 1);
insert into role(role_title, salary, dept_id)
values("executive", 50000, 1);
insert into role(role_title, salary, dept_id)
values("manager", 90000, 1);
insert into role(role_title, salary, dept_id)
values("associate", 30000, 2);
insert into role(role_title, salary, dept_id)
values("executive", 50000, 2);
insert into role(role_title, salary, dept_id)
values("manager", 90000, 2);
insert into role(role_title, salary, dept_id)
values("associate", 20000, 3);
insert into role(role_title, salary, dept_id)
values("executive", 40000, 3);
insert into role(role_title, salary, dept_id)
values("manager", 60000, 3);
insert into role(role_title, salary, dept_id)
values("associate", 30000, 4);
insert into role(role_title, salary, dept_id)
values("executive", 50000, 4);
insert into role(role_title, salary, dept_id)
values("manager", 90000, 4);
insert into role(role_title, salary, dept_id)
values("associate", 20000, 5);
insert into role(role_title, salary, dept_id)
values("executive", 40000, 5);
insert into role(role_title, salary, dept_id)
values("manager", 50000, 5);

-- select employee.id, employee.first_name,employee.last_name, role_title, dept_name, salary, emp2.first_name as manager_name from employee 
-- join role on employee.role_id = role.id 
-- join department on role.dept_id = department.dept_id
-- left outer join employee emp2 on employee.manager_id = emp2.id;