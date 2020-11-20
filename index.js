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
  init();
});

function init() {
  //ask the main menu questions to user.
  //for each answer type create functions
  inquirer.prompt(mainMenuQues).then((res) => {
    // console.log(res);
    if (res.userRes === "View All Employees") {
      viewAllEmployees();
    } else if (res.userRes === "View All Employees By Department") {
      viewAllEmpByDept();
    } else if (res.userRes === "View All Employees By Manager") {
      viewAllEmpByManager();
    } else if (res.userRes === "Add Employee") {
      addEmployee();
    } else if (res.userRes === "Remove Employee") {
      removeEmployee();
    } else if (res.userRes === "Update Employee Role") {
      updateEmpRole();
    } else if (res.userRes === "Update Employee Manager") {
      updateEmployeeManager();
    } else if (res.userRes === "View All Roles") {
      viewAllRoles();
    } else {
      connection.end();
    }
  });
}
init();

function viewAllEmployees() {
  // call database to get the values
  var queryString =
    "select employee.id,employee.first_name, employee.last_name, role.role_title, department.dept_name, role.salary, MgrDetails.first_name manager_name from employee inner join role on employee.role_id = role.id join department on department.dept_id = role.dept_id left join employee MgrDetails on employee.manager_id = MgrDetails.id";
  connection.query(queryString, function (err, res) {
    if (err) throw err;
    console.table(res);
    init();
  });

  // display the result in table format
  // go back to main menu
}

function viewAllEmpByDept() {
  // call database to get the values
  // display the result in table format
  // go back to main menu
}

function viewAllEmpByManager() {
  // call database to get the values
  // display the result in table format
  // go back to main menu
}

function addEmployee() {
  // with inquirer take employee name
  // which dept to added and what role
  // insert into database
}

function removeEmployee() {
  // call database to get the values of he current list of employees
  // remove from database
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
