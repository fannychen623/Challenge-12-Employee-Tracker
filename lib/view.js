// define the packages needed for this application
const db = require('../server');
const inquirer = require('inquirer');
const { printTable, Table } = require('console-table-printer');

// define the class to be exported
class View {
  // view items from database
  viewAction(category, callback) {
    // if action was 'View All Departments'
    if (category == 'departments') {
      // get all data from departments table
      db.query(`SELECT * from departments`, function (err, results) {
        // create new table
        const p = new Table({
          columns: [{ name: 'ID', alignment: 'center' }, { name: 'Department', alignment: 'center' }],
        });
        // add rows from results
        results.forEach(results => {
          p.addRows([
            {
              ID: results.id,
              Department: results.name,
            },
          ],{ color: 'blue' });
        });
        // log the table
        console.log('\n');
        p.printTable();
        console.log('\n');
        // launch the option menu
        callback();
      });
    };
    // if action was 'View All Roles'
    if (category == 'roles') {
      // get all data from roles table and join department name
      db.query(`SELECT roles.id, roles.title, departments.name, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`, function (err, results) {
        const p = new Table({
          title: 'Roles',
          columns: [{ name: 'ID', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Department', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
        });
        // add rows from results
        results.forEach(results => {
          p.addRows([
            {
              ID: results.id,
              Title: results.title,
              Department: results.name,
              Salary: '$ ' + results.salary,
            },
          ],{ color: 'blue' });
        });
        // log the table
        console.log('\n');
        p.printTable();
        console.log('\n');
        // launch the option menu
        callback();
      });
    };
    // if action was 'View All Employees'
    if (category == 'employees') {
      // get all data from employees table and join role title, role salary, department name, and manager name
      db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, employees.manager_id FROM employees LEFT JOIN roles ON employees.title_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`, function (err, results) {
        // create new table
        const p = new Table({
          title: 'Employees',
          columns: [{ name: 'ID', alignment: 'center' }, { name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Department', alignment: 'center' }, { name: 'Salary', alignment: 'center' }, { name: 'Manager', alignment: 'center' }],
        });
        // get employee and manager name data from employees table
        db.query(`SELECT employees.first_name, employees.last_name, managers.first_name, managers.last_name FROM Employees employees LEFT OUTER JOIN Employees managers ON employees.manager_id = managers.id`, function (err, data) {
          // get array of managers for all employees
          // set array value to none if manager is null
          data.forEach((data, i) => {
            if (data.first_name === null && data.last_name === null) {
              results[i].manager_id = 'none';
            } else {
              results[i].manager_id = data.first_name + ' ' + data.last_name;
            };
          });
          // add rows from results
          results.forEach(results => {
            p.addRows([
              {
                ID: results.id,
                Name: results.first_name + ' ' + results.last_name,
                Title: results.title,
                Department: results.name,
                Salary: '$ ' + results.salary,
                Manager: results.manager_id,
              },
            ],{ color: 'blue' });
          });
          // log the table
          console.log('\n');
          p.printTable();
          console.log('\n');
          // launch the option menu
          callback();
        });
      });
    };
    // if action was 'View Employees by Manager'
    if (category === 'employee by manager') {
      // get array of employees that are manager
      db.query(`SELECT employees.first_name, employees.last_name, managers.first_name, managers.last_name FROM Employees employees LEFT OUTER JOIN Employees managers ON employees.manager_id = managers.id WHERE employees.manager_id IS NOT NULL`, function (err, results) {
        let managersList = results
        let managersNameList = managersList.map(function (el) { return el.first_name + ' ' + el.last_name; });
        // remove duplicates to create a unique array of managers
        let uniqManagersNameList = [...new Set(managersNameList)];
        // get all employee data to determine manager id
        db.query('SELECT * FROM employees', function (err, results) {
          let employeesList = results;
          let employeesNameList = employeesList.map(function (el) { return el.first_name + ' ' + el.last_name; });
          let employeesIDList = employeesList.map(function (el) { return el.id; });
          return inquirer
          .prompt([
            {
              type: 'list',
              message: 'View employees from which manager?',
              name: 'manager',
              choices: uniqManagersNameList
            },
          ])
          // based on the response, call the respective functions
          .then((data) => {
            // determine manager id based on selection and index in id array
            let manager_id = employeesIDList[employeesNameList.indexOf(data.manager)];
            // get data of employees and join role title and salary 
            db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary FROM employees LEFT JOIN roles ON employees.title_id = roles.id WHERE manager_id = ?`, [manager_id], (err, results) => {
              // create new table
              const p = new Table({
                title: 'Employees managed by ' + data.manager,
                columns: [{ name: 'ID', alignment: 'center' }, { name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
              });
              // add rows from results
              results.forEach(results => {
                p.addRows([
                  {
                    ID: results.id,
                    Name: results.first_name + ' ' + results.last_name,
                    Title: results.title,
                    Salary: '$ ' + results.salary,
                  },
                ],{ color: 'blue' });
              });
              // log the table
              console.log('\n');
              p.printTable();
              console.log('\n');
              // launch the option menu
              callback();
            });
          });
        });
      });
    };
    // if action was 'View Employees by Department'
    if (category === 'employee by department') {
      // get all data from departments table
      db.query(`SELECT * from departments`, function (err, results) {
        let departmentsList = results
        let departmentsNameList = departmentsList.map(function (el) { return el.name; });
        // determine which department employees to view
        return inquirer
        .prompt([
          {
            type: 'list',
            message: 'View employees from which department?',
            name: 'department',
            choices: departmentsNameList
          },
        ])
        // based on the response, call the respective functions
        .then((data) => {
          // get employee data based on department id and join role title and role salary
          db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, department_id, departments.name FROM employees LEFT JOIN roles ON employees.title_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE name = ?`, [data.department], (err, results) => {
            // create new table
            const p = new Table({
              title: data.department + ' Department',
              columns: [{ name: 'ID', alignment: 'center' }, { name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
            });
            // add rows from results
            results.forEach(results => {
              p.addRows([
                {
                  ID: results.id,
                  Name: results.first_name + ' ' + results.last_name,
                  Title: results.title,
                  Salary: '$ ' + results.salary,
                },
              ],{ color: 'blue' });
            });
            // log the table
            console.log('\n');
            p.printTable();
            console.log('\n');
            // launch the option menu
            callback();
          });
        });
      });
    };
    // if action was 'View Total Utilized Budget by Departments'
    if (category == 'budget') {
      // get sum of salary based on department from the employees list
      // join employees, role, and department table
      db.query(`SELECT SUM(roles.salary) AS budget, departments.name FROM employees LEFT JOIN roles ON employees.title_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id GROUP BY department_id`, function (err, results) {
        // create new table
        const p = new Table({
          columns: [{ name: 'Department', alignment: 'right' }, { name: 'Total Utilized Budget', alignment: 'left' }],
        });
        // add rows from results
        results.forEach(results => {
          p.addRows([
            {
              Department: results.name,
              'Total Utilized Budget': '$ ' + results.budget,
            },
          ],{ color: 'blue' });
        });
        // log the table
        console.log('\n');
        p.printTable();
        console.log('\n');
        // launch the option menu
        callback();
      });
    };
  };
};

module.exports = View;