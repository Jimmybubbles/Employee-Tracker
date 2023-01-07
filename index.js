//========import dependencies=========//

const mysql = require('mysql2');
const inquirer = require("inquirer");
const { start } = require('repl');
const { connect } = require('http2');
const { Db } = require('mongodb');
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
    programName()
});

//========== initial view on console =============//

programName = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    startPrompt()
};

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

            switch (answer.choice) {
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
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Update employee role":
                    updateEmployeeRole();
                    break;
                case "remove Employee":
                    removeEmployee();
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
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

viewRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

viewEmployee = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
}

//=================LOOP HELPERS FOR THE OPTIONS===================//

//empty array for results
let roleArr = [];
selectRole = () => {
    connection.query('SELECT * FROM role', (err, res) => {
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
            name: 'firstName',
            type: 'input',
            message: 'what is the employees first name? '
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'what is the employees last name? '
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is their role? ',
            choices: selectRole()
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: 'what is the managers name?',
            choices: selectManager()
        }
    ]).then(function (answer) {
        let roleId = selectRole().indexOf(answer.role) + 1
        let managerId = selectManager().indexOf(answer.manager) + 1
        connection.query('INSERT INTO employee SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.log('New employee added to the database! \n')
                console.table(answer)
                startPrompt()

            })
    })
}

//=========================ADD A ROLE TO THE DATABASE=============================//

addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'what is the name of the new role?',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'what is the salary of this role?',
        },

    ]).then(function (res) {
        connection.query('INSERT INTO role SET ?',
            {
                title: res.title.trim(),
                salary: res.salary,


            },
            function (err) {
                if (err) throw err
                console.table(res)
                startPrompt()
            })
    })
}


//=========================UPDATE EMPLOYEE \=============================//
// array to catch the looped values

updateEmployeeRole = () => {

    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) console.log(err);
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        })

        connection.query(`SELECT * FROM role`, (err, roles) => {
            if (err) console.log(err);
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectEmployee',
                    message: 'Select Employee to update...',
                    choices: employees,
                },
                {
                    type: 'list',
                    name: 'selectNewRole',
                    message: 'Select new employee role...',
                    choices: roles,
                }
            ])
                .then((data) => {
                    connection.query('UPDATE employee SET ? WHERE ?',
                        [
                            {
                                role_id: data.selectNewRole,
                            },
                            {
                                id: data.SelectEmployee,
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                        }

                    );
                    console.log('Employee role updated');
                    startPrompt()
            })
        })
    })
}

//=========ADD A NEW DEPARTMENT NAME===========//

addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What Department would you like to add?'
        }
    ]).then(function (res) {
        connection.query("INSERT INTO department SET ?",
            {
                name: res.name
                //work out how to return the incremented ID
            },
            function (err) {
                if (err) throw err
                console.log('New Department added to the db \n')
                startPrompt();
            })
    })
}

