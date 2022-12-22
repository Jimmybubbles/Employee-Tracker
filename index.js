// import dependencies
const mysql = require('mysql2');
const inquirer = require("inquirer");
require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'james',
    password: 'PASSWORD',
    database: 'EmployeeTracker_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    programName();
});

programName = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    menu();
};

menu = () => {
    inquirer.prompt([
        {

        name: "option",
        type: "list",
        message: "What would you like to do?",
        
        choices: [
            "Add Department",
            "Add role",
            "Add employee",
            "View department",
            "View roles",
            "View employees",
            "Update employee role",
            "Quit"]
        }
    ])
    .then = (result) => {
        console.log("You entered: " + result.option);
    
        switch(result.option) {
            case "Add department":
                addDepartment();
                break;
            case "Add role":
                addRole();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "View departments":
                viewDepartment();
                break;
            case "View roles":
                viewRoles();
                break;
            case "View employees":
                viewEmployees();
                break;
            case "Update employee role":
                updateEmployees();
                break;
            default:
                quit();
        }

    }
}

addDepartment =  () => {

    inquirer.prompt({
        type: "input",
        name: "deptName",
        message: "What is the name of the department?",
    })
    .then((answer) => {
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName], (err, res)=> {
            if(err) throw err;
            console.table(res)
            
        })
        menu()
    })
    
}