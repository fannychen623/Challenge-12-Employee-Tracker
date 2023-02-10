const inquirer = require('inquirer');
const db = require('../server');

class Update {
  updateAction(category, callback) {
    if (category === 'employee role') {
      db.query('SELECT * FROM roles', function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        let rolesIDList = rolesList.map(function (el) { return el.id; });
        db.query('SELECT * FROM employees', function (err, results) {
          let employeesList = results;
          let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
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
            let title_id = rolesIDList[rolesTitleList.indexOf(data.role)];
            db.query(`UPDATE employees SET title_id = ${title_id} WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, result) => {
              console.log('Updated employee\'s role');
              callback();
            });
          });
        });
      });
    };
    if (category === 'employee manager') {
      db.query('SELECT * FROM employees', function (err, results) {
        let employeesList = results;
        let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
        let employeesIDList = employeesList.map(function (el) { return el.id; });
        employeesNameList.unshift('None');
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
          if (data.manager === 'None') {
            db.query(`UPDATE employees SET manager_id = NULL WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, results) => {
              console.log('Updated employee\'s manager');
              callback();
            });
          } else {
            let manager_id = employeesIDList[employeesNameList.indexOf(data.manager)-1];
            db.query(`UPDATE employees SET manager_id = ${manager_id} WHERE first_name = ? AND last_name = ?`, [first_name, last_name], (err, results) => {
              console.log('Updated employee\'s manager');
              callback();
            });
          };
        });
      });
    };
    if (category === 'role') {
    db.query('SELECT * FROM roles', function (err, results) {
      let rolesList = results;
      let rolesTitleList = rolesList.map(function (el) { return el.title; });
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
          db.query(`UPDATE roles SET salary = ${data.salary} WHERE title = '${data.role}'`, (err, result) => {
            console.log('Updated role');
            callback();
          });
        });
      });
    };
  };
};

module.exports = Update;