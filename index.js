//========import dependencies=========//

const mysql = require('mysql2');
const inquirer = require("inquirer");
const { start } = require('repl');
require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'james',
    password: 'PASSWORD',
    database: 'EmployeeTracker_db'
});

//======== Connection ID =========//

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    // programName();
    startPrompt()
});

//========== initial view on console =============//

// programName = () => {
//     console.log("***********************************")
//     console.log("*                                 *")
//     console.log("*        EMPLOYEE MANAGER         *")
//     console.log("*                                 *")
//     console.log("***********************************")
//     startPrompt()
// };

// =============== user prompt =====================//
// user prompt to show the inquirer choices in list form
function startPrompt() {
    inquirer.prompt([
        
        {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            "View department",
            "View roles",
            "View employees",
            "Add department",
            "Add Role",
            "Add employee",
            "Update employee role",
            "Quit"
        ]
        // promise return answer and then switch the action
        // to what ever the answer was and then run the function below
        }]).then(function (answer) {
        // console.log("You entered: " + answer);
    
        switch(answer.choice) {
            case "View department":
                viewDepartment();
                break;
            case "View roles":
                viewRole();
                break;
            case "View employees":
                viewEmployee();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add Role":
                AddRoles();
                break;
            case "Add employee":
                addEmployee();
                break;
            case "Update employee role":
                updateEmployee();
                break;
            case "Quit":
                connection.end();
                break;
        }
        
    })
}

// first function for viewing the departments in the database.

//=================VIEW QUERIES TO FIRST 3 CHOICES===================//

viewDepartment = () => {
    connection.query('SELECT * FROM department', (err, answer) => {
        if(err) throw err,
        console.table(answer)
        startPrompt()
    })
}

viewRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if(err) throw err,
        console.table(res)
        startPrompt()
    })
}

viewEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if(err) throw err,
        console.table(res)
        startPrompt()
    })
}

//=================LOOP HELPERS FOR THE OPTIONS===================//

//empty array for results
let roleArr = [];
selectRole = () => {
    connection.query('SELECT * FROM role',  (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title)
        }
    })
    return roleArr;
}

let managerArr = [];
selectManager = () => {
    connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name)
        }
    })
    return managerArr;
}

//================================================================//

//=================ADD EMPLOYEE USING HELPERS=====================//

addEmployee = () => {
    inquirer.prompt([
        {
            name:'firstName',
            type:'input',
            message:'what is the employees first name? '
        },
        {
            name:'lastName',
            type:'input',
            message:'what is the employees last name? ' 
        },
        {
            name:'role',
            type:'list',
            message:'What is their role? ',
            choices: selectRole()
        },
        {
            name:'manager',
            type:'rawlist',
            message:'what is the managers name?',
            choices: selectManager()
        }
    ]).then(function(answer) {
        let roleId = selectRole().indexOf(answer.role) + 1
        let managerId = selectManager().indexOf(answer.manager) + 1
        connection.query('INSERT INTO employee SET ?',
        {
            first_name: answer.firstName,
            last_name: answer.lastName,
            manager_id: managerId,
            role_id: roleId
        
        }, function(err){
            if (err) throw err
            console.table(answer)
            startPrompt()
            console.log('A new employee has been added to the database!')
        })
    })
}

//================================================================//















//=========ADD A NEW DEPARTMENT NAME===========//

addDepartment = () => {
    inquirer.prompt([
        {
            name:'name',
            type:'input',
            message: 'What Department would you like to add?'
        }
    ]).then(function(res) {
        connection.query("INSERT INTO department SET ?",
        {
            name: res.name
        },
        function(err) {
            if (err) throw err
            console.table(res);
            startPrompt();
        })
    })
}