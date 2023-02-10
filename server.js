const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'mysql',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_db database.`)
);

db.connect(function(err) {
  if (err) throw err;
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

module.exports = db;

// const { printTable, Table } = require("console-table-printer");

// db.query(`SELECT * from roles`, function (err, results) {
//   const p = new Table({
//     title: 'Roles',
//     columns: [{ name: "Title", alignment: "center" }, { name: "Salary", alignment: "center" }],
//   });
//   results.forEach(results => {
//     p.addRows([
//       {
//         Title: results.title,
//         Salary: results.salary,
//       },
//     ],{ color: "blue" });
//   });
//   console.log('\n');
//   p.printTable();
//   console.log('\n');
//   process.exit(0);
// });
// db.query(`SELECT employees.first_name, employees.last_name, managers.first_name, managers.last_name FROM Employees employees LEFT OUTER JOIN Employees managers ON employees.manager_id = managers.id`, function (err, results) {
//   console.table(results);
//   process.exit(0);
// });
// db.query(`SELECT * from employees`, function (err, results) {
//   console.table(results);
//   process.exit(0);
// });