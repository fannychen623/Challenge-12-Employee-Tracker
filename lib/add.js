const db = require("../server");
const inquirer = require("inquirer");

class Add {
  addAction(category, callback) {
    if (category === "departments") {
      return inquirer
      .prompt([
        {
          type: 'input',
          message: 'What is the name of the department?',
          name: 'department'
        },
      ])
      // based on the response, call the respective functions
      .then((data) => {
        db.query(`INSERT INTO departments (name) VALUES ("${data.department}")`, (err, results) => {
          console.log(`Added ${data.department} to the database.`);
          callback();
        });
      });
    };
    if (category === "roles") {
      db.query(`SELECT * FROM departments`, function (err, results) {
        let departmentsList = results
        let departmentsNameList = departmentsList.map(function (el) { return el.name; });
        let departmentsIDList = departmentsList.map(function (el) { return el.id; });
        return inquirer
        .prompt([
          {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'role'
          },
          {
            type: 'number',
            message: 'What is the salary of the role?',
            name: 'salary'
          },
          {
            type: 'list',
            message: 'What department does the role belong to?',
            name: 'department',
            choices: departmentsNameList
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          let department_id = departmentsIDList[departmentsNameList.indexOf(data.department)];
          db.query(`INSERT INTO roles (title, department_id, salary) VALUES ("?", ?, ?)`, [data.role, department_id, data.salary], (err, results) => {
            console.log(`Added ${data.role} to the database.`);
            callback();
          });
        });
      });
    };
    if (category === "employees") {
      db.query('SELECT * FROM roles', function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        let rolesIDList = rolesList.map(function (el) { return el.id; });
        db.query('SELECT * FROM employees', function (err, results) {
          let employeesList = results;
          let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
          let employeesIDList = employeesList.map(function (el) { return el.id; });
          employeesNameList.unshift('None');
          return inquirer
          .prompt([
            {
              type: 'input',
              message: 'What is the employee\'s first name?',
              name: 'firstName'
            },
            {
              type: 'input',
              message: 'What is the employee\'s last name?',
              name: 'lastName'
            },
            {
              type: 'list',
              message: 'What is the employee\'s role?',
              name: 'role',
              choices: rolesTitleList
            },
            {
              type: 'list',
              message: 'Who is the employee\'s manager?',
              name: 'manager',
              choices: employeesNameList
            },
          ])
          // based on the response, call the respective functions
          .then((data) => {
            let title_id = rolesIDList[rolesTitleList.indexOf(data.role)];
            if (data.manager === 'None') {
              db.query(`INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, NULL)`, [data.firstName, data.lastName, title_id], (err, results) => {
                console.log(`Added ${data.firstName} ${data.lastName} to the database.`);
                callback();
              });
            } else {
              let manager_id = employeesIDList[employeesNameList.indexOf(data.manager)];
              db.query(`INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, ?)`, [data.firstName, data.lastName, title_id, manager_id], (err, results) => {
                console.log(`Added ${data.firstName} ${data.lastName} to the database.`);
                callback();
              });
            };
          });
        });
      });
    };
  };
};

module.exports = Add;