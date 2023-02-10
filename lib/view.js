const db = require('../server');
const { printTable, Table } = require('console-table-printer');

class View {
  viewAction(category, callback) {
    if (category == 'departments') {
      db.query(`SELECT * from departments`, function (err, results) {
        const p = new Table({
          columns: [{ name: 'Department', alignment: 'center' }],
        });
        results.forEach(results => {
          p.addRows([
            {
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
          columns: [{ name: 'Title', alignment: 'center' }, { name: 'Department', alignment: 'center' }, { name: 'Salary', alignment: 'center' }],
        });
        results.forEach(results => {
          p.addRows([
            {
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
          columns: [{ name: 'Name', alignment: 'center' }, { name: 'Title', alignment: 'center' }, { name: 'Department', alignment: 'center' }, { name: 'Salary', alignment: 'center' }, { name: 'Manager', alignment: 'center' }],
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