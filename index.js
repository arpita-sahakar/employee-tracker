const inquirer = require("inquirer");
const mysql = require("mysql");
const mainMenuQues = require("./questions");

// Define database connection here
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "organization_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

async function init() {
  const res = await inquirer.prompt(mainMenuQues);

  if (res.userRes === "View All Employees") {
    await viewAllEmployees();
    await init();
  } else if (res.userRes === "View All Employees By Department") {
    await viewAllEmpByDept();
    await init();
  } else if (res.userRes === "Add Employee") {
    await addEmployee();
    await init();
  } else if (res.userRes === "Remove Employee") {
    await removeEmployee();
    await init();
  } else if (res.userRes === "Update Employee Role") {
    await updateEmpRole();
    await init();
  } else if (res.userRes === "View All Roles") {
    await viewAllRoles();
    await init();
  } else {
    connection.end();
  }
}

init();

async function executeQuery(queryString) {
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (err, res) {
      if (err) throw err;
      resolve(res);
    });
  });
}

async function viewAllEmployees() {
  // call database to get the values
  let queryString = `select employee.id,employee.first_name, 
      employee.last_name, role.role_title, department.dept_name, 
     role.salary, MgrDetails.first_name manager_name 
     from employee inner join role on employee.role_id = role.id 
     join department on department.dept_id = role.dept_id 
     left join employee MgrDetails on employee.manager_id = MgrDetails.id`;
  let allEmployeesDetails = await executeQuery(queryString);
  console.table(allEmployeesDetails);
}

async function viewAllEmpByDept() {
  // get list of all departments and show choices to user using inquirer
  let queryStr = "select dept_name from department";
  let res = await executeQuery(queryStr);
  // convert object array into array of strings
  const deptArray = [];
  for (i = 0; i < res.length; i++) {
    deptArray.push(res[i].dept_name);
  }
  //once user selects a dept, query the database and find all employees in that dept
  const response = await inquirer.prompt({
    type: "list",
    message: "choose department",
    choices: deptArray,
    name: "deptName",
  });

  let queryString = `select employee.first_name, employee.last_name,
    role.role_title,role.salary from employee 
    join role on employee.role_id = role.id 
    join department on department.dept_id = role.dept_id 
    where department.dept_name = '${response.deptName}'`;

  let employeeDetailsByDept = await executeQuery(queryString);
  console.table(employeeDetailsByDept);
}

async function addEmployee() {
  //get all department names
  let querySt = "select department.dept_name from department";
  let res = await executeQuery(querySt);
  // console.log(res);
  //convert array of object to array of strings
  const deptArray = [];
  for (i = 0; i < res.length; i++) {
    deptArray.push(res[i].dept_name);
  }
  //use inquirer to ask in which dept user would like to add employee
  let deptResponse = await inquirer.prompt({
    type: "list",
    message: "choose department",
    choices: deptArray,
    name: "deptName",
  });

  // show all the roles that are available in the department that user has selected
  // fetch all roles from database

  let queryStr = `select role.role_title, role.id from role 
    join department on department.dept_id = role.dept_id 
    where dept_name = '${deptResponse.deptName}' `;

  let availableRoles = await executeQuery(queryStr);
  //  console.log(availableRoles);
  //convert object array in string array
  const roleArray = [];
  for (i = 0; i < availableRoles.length; i++) {
    roleArray.push(availableRoles[i].role_title + "-" + availableRoles[i].id);
  }

  // get user response for which role user wants to add and name of the person to be added
  let roleNameResponse = await inquirer.prompt([
    {
      type: "list",
      message: "choose role",
      choices: roleArray,
      name: "roleName",
    },
    {
      type: "input",
      message: "insert first name",
      name: "firstName",
    },
    {
      type: "input",
      message: "insert last name",
      name: "lastName",
    },
  ]);
  // console.log(roleNameResponse);
  let roleId = roleNameResponse.roleName.split("-")[1];

  let query = `insert into employee(first_name, last_name, role_id) 
    values('${roleNameResponse.firstName}','${roleNameResponse.lastName}','${roleId}')`;

  await executeQuery(query);
}

async function removeEmployee() {
  // get the list of all employees from database
  let query = `select concat(id, '-', first_name,' ',last_name) employee_name from employee`;
  let result = await executeQuery(query);
  // console.log(result);

  // convert object array into array of strings
  const employeeArray = [];
  for (i = 0; i < result.length; i++) {
    employeeArray.push(result[i].employee_name);
  }
  //user selects the employee to be removed
  const response = await inquirer.prompt([
    {
      type: "list",
      choices: employeeArray,
      message: "which employee you would like to remove?",
      name: "empToBeRemoved",
    },
  ]);
  // console.log(response);
  // let employeeId = response.empToBeRemoved.split("-")[0];

  let deleteQuery = `delete from employee where id = ${
    response.empToBeRemoved.split("-")[0]
  }`;
  // execute query to delete the selected query
  await executeQuery(deleteQuery);
}

async function updateEmpRole() {
  //display the employee list and ask which employee role you want to change
  let query = `select concat(id, '-', first_name,' ',last_name) employee_name from employee`;
  let result = await executeQuery(query);

  // convert object array into array of strings
  const employeeArray = [];
  for (i = 0; i < result.length; i++) {
    employeeArray.push(result[i].employee_name);
  }

  //user selects the employee to be updated
  const response = await inquirer.prompt([
    {
      type: "list",
      choices: employeeArray,
      message: "which employee role you would like to update?",
      name: "updateEmpRole",
    },
  ]);
  // since id is unique so store the id for future use
  let employeeId = response.updateEmpRole.split("-")[0];

  // show the list of roles and which role you want to change

  // call database to get the values
  let roleQuery = `select role_title, role.id from role `;

  //execute the query
  let roleResult = await executeQuery(roleQuery);
  // console.log(roleResult);
  // convert object array into array of strings
  const roleArray = [];
  for (i = 0; i < roleResult.length; i++) {
    roleArray.push(roleResult[i].role_title + "-" + roleResult[i].id);
  }

  // ask user which new role to be assigned to the selected employee.
  const roleResponse = await inquirer.prompt([
    {
      type: "list",
      choices: roleArray,
      message: "select new role?",
      name: "newRole",
    },
  ]);
  console.log(roleResponse);

  let roleId = roleResponse.newRole.split("-")[1];

  // update the database
  let updateQuery = `update employee set role_id = ${roleId} where id = ${employeeId}`;
  await executeQuery(updateQuery);
}

async function viewAllRoles() {
  // call database to get the values
  let query = `select role_title, salary, dept_name from role 
  join department on role.dept_id = department.dept_id`;
  let result = await executeQuery(query);
  // display the result in table format
  console.table(result);
}
