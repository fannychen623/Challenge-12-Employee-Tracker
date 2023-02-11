// define the packages needed for this application
const db = require('../server');
const inquirer = require('inquirer');

// define the class to be exported
class Add {
  // add items to database
  addAction(category, callback) {
    // if action was 'Add Department'
    if (category === 'departments') {
      // collect the name of the department to add
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
        // add department to the database
        db.query(`INSERT INTO departments (name) VALUES ('${data.department}')`, (err, results) => {
          console.log(`Added ${data.department} to the database.`);
          // launch the option menu
          callback();
        });
      });
    };
    // if action was 'Add Role'
    if (category === 'roles') {
      // get an array of the department name to be used in the prompt
      db.query(`SELECT * FROM departments`, function (err, results) {
        let departmentsList = results
        let departmentsNameList = departmentsList.map(function (el) { return el.name; });
        // define id to determine refernce value to add
        let departmentsIDList = departmentsList.map(function (el) { return el.id; });
        // collect the name, salary, and department, of the role to add
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
          // determine department id based on selection and index in id array
          let department_id = departmentsIDList[departmentsNameList.indexOf(data.department)];
          // add role to the database
          db.query(`INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)`, [data.role, department_id, data.salary], (err, results) => {
            console.log(`Added ${data.role} to the database.`);
            // launch the option menu
            callback();
          });
        });
      });
    };
    // if action was 'Add Employee'
    if (category === 'employees') {
      // get an array of the role titles and id
      db.query('SELECT * FROM roles', function (err, results) {
        let rolesList = results;
        let rolesTitleList = rolesList.map(function (el) { return el.title; });
        let rolesIDList = rolesList.map(function (el) { return el.id; });
        // get an array of the employee names and id for the managers list
        db.query('SELECT * FROM employees', function (err, results) {
          let employeesList = results;
          let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
          let employeesIDList = employeesList.map(function (el) { return el.id; });
          // add 'None' as an option to the array
          employeesNameList.unshift('None');
          // collect th name, role, and manager of the employee to add
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
            // determine the title id based on selection and index in id array
            let title_id = rolesIDList[rolesTitleList.indexOf(data.role)];
            // if no manager was selected add employee and respective information to the database
            if (data.manager === 'None') {
              db.query(`INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, NULL)`, [data.firstName, data.lastName, title_id], (err, results) => {
                console.log(`Added ${data.firstName} ${data.lastName} to the database.`);
                // launch the option menu
                callback();
              });
            } else {
              // determine the manager id based on selection and index in id array
              let manager_id = employeesIDList[employeesNameList.indexOf(data.manager)-1];
              // add employee to the database
              db.query(`INSERT INTO employees (first_name, last_name, title_id, manager_id) VALUES (?, ?, ?, ?)`, [data.firstName, data.lastName, title_id, manager_id], (err, results) => {
                console.log(`Added ${data.firstName} ${data.lastName} to the database.`);
                // launch the option menu
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