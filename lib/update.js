// define the packages needed for this application
const inquirer = require('inquirer');
const db = require('../server');

// define the class to be exported
class Update {
  // update items in the database
  updateAction(category, callback) {
    // if action was 'Update Employee Role'
    if (category === 'employee role') {
      // get an array of the roles to be used in the prompt
      db.query('SELECT * FROM roles', function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        let rolesIDList = rolesList.map(function (el) { return el.id; });
        // get an array of the employees to be used in the prompt
        db.query('SELECT * FROM employees', function (err, results) {
          let employeesList = results;
          let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
          // determine which employee to update to which role
          return inquirer
          .prompt([
            {
              type: 'list',
              message: 'Which employee\'s role do you want to update?',
              name: 'employee',
              choices: employeesNameList
            },
            {
              type: 'list',
              message: 'Which role do you want to assign to the selected employee?',
              name: 'role',
              choices: rolesTitleList
            },
          ])
          // based on the response, call the respective functions
          .then((data) => {
            let first_name = data.employee.replace(/ .*/,'');
            let last_name = data.employee.split(' ').splice(-1);
            // determine reference title id based on selection and index in id array
            let title_id = rolesIDList[rolesTitleList.indexOf(data.role)];
            // update the employee's role in the database
            db.query(`UPDATE employees SET title_id = ${title_id} WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, result) => {
              console.log('Updated employee\'s role');
              // launch the option menu
              callback();
            });
          });
        });
      });
    };
    // if action was 'Update Employee Manager'
    if (category === 'employee manager') {
      // get an array of the employees to be used in the prompt
      db.query('SELECT * FROM employees', function (err, results) {
        let employeesList = results;
        let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
        let employeesIDList = employeesList.map(function (el) { return el.id; });
        // add 'None' as an option to the array
        employeesNameList.unshift('None');
        // determine which employee to update to which manager
        return inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which employee\'s manager do you want to update?',
            name: 'employee',
            choices: employeesNameList
          },
          {
            type: 'list',
            message: 'Which manager do you want to assign to the selected employee?',
            name: 'manager',
            choices: employeesNameList
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          let first_name = data.employee.replace(/ .*/,'');
          let last_name = data.employee.split(' ').splice(-1);
          // based on whether manager is selected or not, update data
          if (data.manager === 'None') {
            // update the employee's manager in the database
            db.query(`UPDATE employees SET manager_id = NULL WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, results) => {
              console.log('Updated employee\'s manager');
              callback();
            });
          } else {
            // determine reference manager id based on selection and index in id array
            let manager_id = employeesIDList[employeesNameList.indexOf(data.manager)-1];
            // update the employee's manager in the database
            db.query(`UPDATE employees SET manager_id = ${manager_id} WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, results) => {
              console.log('Updated employee\'s manager');
              // launch the option menu
              callback();
            });
          };
        });
      });
    };
    // if action was 'Role'
    if (category === 'role') {
      // get an array of the role titles to be used in the prompt
      db.query('SELECT * FROM roles', function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        // determine which role to update salary
        return inquirer
        .prompt([
          {
            type: 'list',
            message: 'Which role do you want to update?',
            name: 'role',
            choices: rolesTitleList
          },
          {
            type: 'number',
            message: 'What is the new salary of the role?',
            name: 'salary',
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          // update the roles's salary in the database
          db.query(`UPDATE roles SET salary = ${data.salary} WHERE title = '${data.role}'`, (err, result) => {
            console.log('Updated role');
            // launch the option menu
            callback();
          });
        });
      });
    };
  };
};

module.exports = Update;