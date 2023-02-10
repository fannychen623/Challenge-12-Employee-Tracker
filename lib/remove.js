const db = require('../server');
const inquirer = require('inquirer');

class Remove {
  removeAction(category, callback) {
    if (category === 'departments') {
      db.query(`SELECT * FROM departments`, function (err, results) {
        let departmentsList = results;
        let departmentsNameList = departmentsList.map(function (el) { return el.name; });
        return inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which department would you like to remove?',
            name: 'department',
            choices: departmentsNameList
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          db.query(`DELETE FROM departments WHERE name = '${data.department}'`, (err, results) => {
            console.log(`Removed ${data.department} from the database.`);
            callback();
          });
        });
      });
    };
    if (category === 'roles') {
      db.query(`SELECT * FROM roles`, function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        return inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which role would you like to remove?',
            name: 'role',
            choices: rolesTitleList
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          db.query(`DELETE FROM roles WHERE title = '${data.role}'`, (err, results) => {
            console.log(`Removed ${data.role} from the database.`);
            callback();
          });
        });
      });
    };
    if (category === 'employees') {
      db.query('SELECT * FROM employees', function (err, results) {
        let employeesList = results;
        let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
        return inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which employee would you like to remove?',
            name: 'employee',
            choices: employeesNameList
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          let first_name = data.employee.replace(/ .*/,'');
          let last_name = data.employee.split(' ').splice(-1);
          db.query(`DELETE FROM employees WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, results) => {
            console.log(`Removed ${data.employee} from the database.`);
            callback();
          });
        });
      });
    };
  };
};

module.exports = Remove;