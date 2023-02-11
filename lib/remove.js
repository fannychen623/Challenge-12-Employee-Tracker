// define the packages needed for this application
const db = require('../server');
const inquirer = require('inquirer');

// define the class to be exported
class Remove {
  // delete items from the database
  removeAction(category, callback) {
    // if action was 'Remove Department'
    if (category === 'departments') {
      // get department data
      db.query(`SELECT * FROM departments`, function (err, results) {
        let departmentsList = results;
        let departmentsNameList = departmentsList.map(function (el) { return el.name; });
        // determine department to remove
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
          // remove department from the database
          db.query(`DELETE FROM departments WHERE name = '${data.department}'`, (err, results) => {
            console.log(`Removed ${data.department} from the database.`);
            // launch the option menu
            callback();
          });
        });
      });
    };
    // if action was 'Remove Role'
    if (category === 'roles') {
      // get role data
      db.query(`SELECT * FROM roles`, function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        // determine role to remove
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
          // remove role from the database
          db.query(`DELETE FROM roles WHERE title = '${data.role}'`, (err, results) => {
            console.log(`Removed ${data.role} from the database.`);
            // launch the option menu
            callback();
          });
        });
      });
    };
    // if action was 'Remove Employee'
    if (category === 'employees') {
      // get employee data
      db.query('SELECT * FROM employees', function (err, results) {
        let employeesList = results;
        let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
        // determine employee to remove
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
          // remove employee from the database
          db.query(`DELETE FROM employees WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, results) => {
            console.log(`Removed ${data.employee} from the database.`);
            // launch the option menu
            callback();
          });
        });
      });
    };
  };
};

module.exports = Remove;