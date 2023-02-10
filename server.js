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

// db.query(`Select * from departments`, (err, results) => {
//   console.table(results);
//   process.exit(0);
// });