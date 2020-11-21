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

  } else if (res.userRes === "View All Employees By Manager") {
    await viewAllEmpByManager();
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

  } else if (res.userRes === "Update Employee Manager") {
    await updateEmployeeManager();
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

function viewAllEmpByManager() {
  // call database to get the values
  // display the result in table format
  // go back to main menu
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

function removeEmployee() {
  // get the list of all employees from database
  //user selects the employee to be removed
  // execute query to delete the selected query
}

function updateEmpRole() {
  //display the employee list and ask which employee role you want to change
  // show the list of roles and which role you want to change
  // update the database
}

function updateEmployeeManager() {
  //ask which employee's manager you want to changes
  // display list of manager available
  // update the change to database
}

function viewAllRoles() {
  // call database to get the values
  // display the result in table format
  // go back to main menu
}

// function init() {
//   //ask the main menu questions to user.
//   //for each answer type create functions
//   inquirer.prompt(mainMenuQues).then((res) => {
//     // console.log(res);
//     if (res.userRes === "View All Employees") {
//       viewAllEmployees();
//     } else if (res.userRes === "View All Employees By Department") {
//       viewAllEmpByDept();
//     } else if (res.userRes === "View All Employees By Manager") {
//       viewAllEmpByManager();
//     } else if (res.userRes === "Add Employee") {
//       addEmployee();
//     } else if (res.userRes === "Remove Employee") {
//       removeEmployee();
//     } else if (res.userRes === "Update Employee Role") {
//       updateEmpRole();
//     } else if (res.userRes === "Update Employee Manager") {
//       updateEmployeeManager();
//     } else if (res.userRes === "View All Roles") {
//       viewAllRoles();
//     } else {
//       connection.end();
//     }
//   });
// }
// init();
