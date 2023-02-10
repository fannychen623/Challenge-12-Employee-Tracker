SELECT roles.id, roles.title, departments.name, roles.salary 
FROM roles 
LEFT JOIN departments ON roles.department_id = departments.id;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, employees.manager_id 
FROM employees 
LEFT JOIN roles ON employees.title_id = roles.id 
LEFT JOIN departments ON roles.department_id = departments.id;

SELECT employees.first_name, employees.last_name, managers.first_name, managers.last_name 
FROM Employees employees 
LEFT OUTER JOIN Employees managers ON employees.manager_id = managers.id;