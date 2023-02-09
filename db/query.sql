SELECT roles.id, roles.title, departments.name as department, roles.salary
FROM roles
LEFT JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name as department, roles.salary, employees.manager_id
FROM employees
LEFT JOIN roles ON employees.title_id = roles.id
INNER JOIN departments ON roles.department_id = departments.id;

SELECT * FROM employees 
RIGHT JOIN roles ON employees.title_id = roles.id;

UPDATE roles
SET salary = 130000
WHERE title = 'Accountant';