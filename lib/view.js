const db = require('../server');
const inquirer = require('inquirer');
const { printTable, Table } = require('console-table-printer');

class View {
  viewAction(category, callback) {
    if (category == 'departments') {
      db.query(`SELECT * from departments`, function (err, results) {
        const p = new Table({
          columns: [{ name: 'ID', alignment: 'center' }, { name: 'Department', alignment: 'center' }],
        });
        results.forEach(results => {
          p.addRows([
            {
              ID: results.id,
              Department: results.name,
            },
          ],{ color: 'blue' });
        });
        console.log('\n');
        p.printTable();
        console.log('\n');
        callback();
      });
    };
    if (category == 'roles') {
      db.query(`SELECT roles.id, roles.title, departments.name, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`, function (err, results) {
        const p = new Table({
          title: 'Roles',
          columns: [{ name: 'ID', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Department', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
        });
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
        console.log('\n');
        p.printTable();
        console.log('\n');
        callback();
      });
    };
    if (category == 'employees') {
      db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, employees.manager_id FROM employees LEFT JOIN roles ON employees.title_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id`, function (err, results) {
        const p = new Table({
          title: 'Employees',
          columns: [{ name: 'ID', alignment: 'center' }, { name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Department', alignment: 'center' }, { name: 'Salary', alignment: 'center' }, { name: 'Manager', alignment: 'center' }],
        });
        db.query(`SELECT employees.first_name, employees.last_name, managers.first_name, managers.last_name FROM Employees employees LEFT OUTER JOIN Employees managers ON employees.manager_id = managers.id`, function (err, data) {
          data.forEach((data, i) => {
            if (data.first_name === null && data.last_name === null) {
              results[i].manager_id = 'none';
            } else {
              results[i].manager_id = data.first_name + ' ' + data.last_name;
            };
          });
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
          console.log('\n');
          p.printTable();
          console.log('\n');
          callback();
        });
      });
    };
    if (category === 'employee by manager') {
      db.query(`SELECT employees.first_name, employees.last_name, managers.first_name, managers.last_name FROM Employees employees LEFT OUTER JOIN Employees managers ON employees.manager_id = managers.id WHERE employees.manager_id IS NOT NULL`, function (err, results) {
        let managersList = results
        let managersNameList = managersList.map(function (el) { return el.first_name + ' ' + el.last_name; });
        let uniqManagersNameList = [...new Set(managersNameList)];
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
            let manager_id = employeesIDList[employeesNameList.indexOf(data.manager)];
            db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary FROM employees LEFT JOIN roles ON employees.title_id = roles.id WHERE manager_id = ?`, [manager_id], (err, results) => {
              const p = new Table({
                title: 'Employees managed by ' + data.manager,
                columns: [{ name: 'ID', alignment: 'center' }, { name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
              });
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
              console.log('\n');
              p.printTable();
              console.log('\n');
              callback();
            });
          });
        });
      });
    };
    if (category === 'employee by department') {
      db.query(`SELECT * from departments`, function (err, results) {
        let departmentsList = results
        let departmentsNameList = departmentsList.map(function (el) { return el.name; });
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
          db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, department_id, departments.name FROM employees LEFT JOIN roles ON employees.title_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE name = ?`, [data.department], (err, results) => {
            const p = new Table({
              title: data.department + ' Department',
              columns: [{ name: 'ID', alignment: 'center' }, { name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
            });
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
            console.log('\n');
            p.printTable();
            console.log('\n');
            callback();
          });
        });
      });
    };
    if (category == 'budget') {
      db.query(`SELECT SUM(roles.salary) AS budget, departments.name FROM employees LEFT JOIN roles ON employees.title_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id GROUP BY department_id`, function (err, results) {
        const p = new Table({
          columns: [{ name: 'Department', alignment: 'right' }, { name: 'Total Utilized Budget', alignment: 'left' }],
        });
        results.forEach(results => {
          p.addRows([
            {
              Department: results.name,
              'Total Utilized Budget': '$ ' + results.budget,
            },
          ],{ color: 'blue' });
        });
        console.log('\n');
        p.printTable();
        console.log('\n');
        callback();
      });
    };
  };
};

module.exports = View;