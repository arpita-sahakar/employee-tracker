const inquirer = require("inquirer");
const mysql = require("mysql");
const mainMenuQues = require("./questions");

// Define database connection here
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "walmart",
});

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId + "\n");
//   init();
// });

function init() {
  inquirer.prompt(mainMenuQues).then((response) => {
    console.log(response);
  });
  
}
init();

// function departments(){
//     inquirer.prompt([
//         {
//             type: "input",
//             message: "what department you would like to add? ",
//             name: "deptName",
//         }
//     ])
//     .then((response)=>{
//         console.log(response);
//         insertToDataBase(response);
//     });
// }

// function insertToDataBase(response) {
//     var query = connection.query(
//       "INSERT INTO department SET ?",
//       {
//         dept_name: response.deptName,

//       },
//       function (err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " product inserted!\n");
//         init();
//       }
//     );
//   }

//   function showDepartments(){
//     connection.query("select * from department", function (err, res) {
//         if (err) throw err;
//         console.log(res);
//     })

//   }
