const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'james',
    password: 'PASSWORD',
    database: 'EmployeeTracker_db'
});



module.exports = db