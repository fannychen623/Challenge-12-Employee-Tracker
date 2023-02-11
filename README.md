# Module 12 Challenge - Employee Tracker

>**Application Video:** [Employee Tracker](https://drive.google.com/file/d/1Jm_Htt42nQezbXmHlohiU36oCqxlxcAD/view)
>
>**View:** [Description](#description) / [Application Details](#application-details) / [Application Sample Functions](#application-sample-functions)
>
>**Application Preview:**
>
>![Employee Tracker](/assets/Employee%20Tracker.gif "Employee Tracker")
> 
>**Terminal Output Preview:**
>
>![Terminal Output](/assets/initialize.png "Terminal Output")
> 
## **DESCRIPTION**
> Topic Assessed: **SQL** - **Node.js, MYSQL2, db.query, schema, seeds, mysql, console-table, etc.**
### **My Task**
*Employee Tracker* is a content management systems (CMS) that allows a user track and modify the employees of a company.
> Create the application from scratch.
> 
> Create package.json file detailing required dependencies to run the application.
> 
> Create index.js file to launch application file.
>
> Create server.js file that holds the sql database and server information/module.
>
> Organize directories in accordance with standard format (root, lib, db, assets).
>
> Create class called action that utilizes sub modules/classes.
>
> Create individual class for each action view, add, update, and remove.
>
> Create schema.sql, seeds.sql, and query.sql files in db to assist in the development process.
>
> Use external packages such as mysql2, express, inquirer, and console-table-printer.
> 
> **Note**: Used [console-table-printer](https://www.npmjs.com/package/console-table-printer) instead of [console.table](https://www.npmjs.com/package/console.table)
>
> Completed all **Bonuses** for the application: `Update employee managers`, `View employees by manager`, `View employees by department`, `Delete departments, roles, and employees`, and `View the total utilized budget of a department`.
>
## User Story
```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```
## Acceptance Criteria
```
GIVEN a command-line application that accepts user input
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## **APPLICATION DETAILS**

### index.js Information
* **require**: Define packages needed for the application.
* **action**: Call the module and function to initialize the application.

### server.js Information
* **require**: Define packages needed for the application.
  * `express` and `mysql2`.
* **PORT**: Define the local server port to be 3001.
* **db**: Define and lauch connection to the sql database.
  * Includes database information (host, user, password, database).
* **module.exports**: Export the server to be used by other modules.

### action.js Information
* **require**: Define packages needed for the application.
  * `inquirer` and `console-table-printer`.
  * all action modules: `view`, `add`, `update`, and `remove`
* **launchAction()**: Initial launch to the application with starting message.
  * Uses the `console-table-printer` to generate a nice formated table with the welcome message.
  * Console log the table message and launch the function `nextAction()`.
* **nextAction()**: Main function, used to loop through the options menu.
  * Uses `inquirer` to prompt menu in the command line.
  * Option menu list items: 
    > View
    * `View All Departments`
    * `View All Roles`
    * `View All Employees`
    > Add
    * `Add Department`
    * `Add Role`
    * `Add Employee`
    > Update
    * `Update Role`
    * `Update Employee Role`
    * `Update Employee Manager`
    > Remove
    * `Remove Department`
    * `Remove Role`
    * `Remove Employee`
    > Special Views
    * `View Employees by Manager`
    * `View Employees by Department`
    * `View Total Utilized Budget by Departments`
    > Exit
    * `Quit`
  * There are 5 groups of action types and each type has it's own sub function under the class: `viewAction()`, `addAction()`, `updateAction()`, `removeAction()`, and `quitAction()`.
    * The `view` category has a sub category of spcial views thati is part of the same module.
  * Based on the action that is selected, the `category` item will be defined and the respective action function is called.
* **viewAction(), addAction(), updateAction(), removeAction()**: Creates new object and calls the respective module with a callback function that will call the nextAction() function upon completion.
* **quitAction()**: Console log the exit message and exit the process/application.
* **module.exports**: Export the Action class.

### view.js Information
* **require**: Define packages needed for the application.
  * `db` from the `server.js` module.
  * `inquirer` and `console-table-printer`.
* **viewAction()**: Based on the category, prompt a series of questions add the input data to the database.
  > departments
  * Use db.query retrieve the departments table from the database.
  * Define a new table and add the columns `ID` and `Department`.
  * Use the forEach function to loop through all the data in the ouput table and add rows to the table.
  * Console log the table and initial the callback() function to launch the option menu.
  > roles
  * Use db.query retrieve the roles table from the database.
    * Use db.query to JOIN the departments table to the role table to add a column of department names to the results.
  * Define a new table, titled 'Roles', and add the columns `ID`, `Title`, `Department`, and `Salary`.
  * Use the forEach function to loop through all the data in the ouput table and add rows to the table.
  * Console log the table and initial the callback() function to launch the option menu.
  > employees
  * Use db.query retrieve the employees table from the database.
    * Use db.query to JOIN the roles and department table to the employees table to add a column of role titles, salary, and department names to the results.
  * Define a new table, titled 'Employees', and add the columns `ID`, `Name`, `Title`, `Department`, `Salary`, and `Manager`.
  * Use db.query JOIN the employees table with itself to add a column of manager names to the results.
  * Use the forEach function to loop through all the data in the ouput tables and add rows to the table.
  * Console log the table and initial the callback() function to launch the option menu.
  > employee by manager
  * Use db.query retrieve the employees table from the database.
    * Use db.query JOIN the employees table with itself to add a column of manager names to the results.
    * Use db.query WHERE to output only results where the manager_id is not NULL.
    * Combine the first and last names from the results and define as array.
    * Define a new unique array of manager names to remove duplicate names to be used as lists for the prompt.
  * Use db.query to collect a list of employees to be used as lists for the prompt.
    * Combine the first and last names from the results and define as array.
    * Define array of the employee id to determine the reference value of the manager to be selected for view.
  * Use db.query retrieve the employees table from the database.
    * Use db.query to JOIN the roles table to the employees table to add a column of role titles and salary to the results
    * Use db.query WHERE to output only results where the manager_id is the selected value from the prompt.
  * Define a new table, titled 'Employees managed by 'manager name'', and add the columns `ID`, `Name`, `Title`, and `Salary`.
  * Use the forEach function to loop through all the data in the ouput table and add rows to the table.
  * Console log the table and initial the callback() function to launch the option menu.
  > employee by department
  * Use db.query retrieve the departments table from the database.
  * Collect the department to view employees of.
  * Use db.query retrieve the employees table from the database.
    * Use db.query to JOIN the roles and department table to the employees table to add a column of role titles, salary, and department names to the results.
    * Use db.query WHERE to output only results where the department_id is the selected value from the prompt.
  * Define a new table, titled ''department name' Department', and add the columns `ID`, `Name`, `Title`, and `Salary`.
  * Use the forEach function to loop through all the data in the ouput table and add rows to the table.
  * Console log the table and initial the callback() function to launch the option menu.
  > budget
  * Use db.query retrieve the departments table from the database.
    * Use db.query SUM and JOIN to sum the role salaries from the employees table and join it with the roles and department table.
  * Define a new table and add the columns `Department` and `Total Utilized Budget`.
  * Use the forEach function to loop through all the data in the ouput table and add rows to the table.
  * Console log the table and initial the callback() function to launch the option menu.
* **module.exports**: Export the class.

### add.js Information
* **require**: Define packages needed for the application.
  * `db` from the `server.js` module.
  * `inquirer`.
* **addAction()**: Based on the category, prompt a series of questions add the input data to the database.
  > departments
  * Collect the name of the department.
  * Use db.query to add the department to the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
  > roles
  * Use db.query to collect a list of department names to be used as lists for the prompt.
    * Define array of the department id to determine the reference value to assign to the role.
  * Collect the name, salary, and department for the role.
  * Use db.query to add the role to the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
  > employees
  * Use db.query to collect a list of role titles to be used as lists for the prompt.
    * Define array of the role id to determine the reference value of the role to assign to the employee.
  * Use db.query to collect a list of employees to be used as lists for the prompt.
    * Combine the first and last names from the results and define as array.
    * Define array of the employee id to determine the reference value of the manager to assign to the employee.
  * Collect the first and last name, role, and assigned manager of the employee.
  * Based on whether the employee has a manager, use db.query to add the employee to the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
* **module.exports**: Export the class.

### update.js Information
* **require**: Define packages needed for the application.
  * `db` from the `server.js` module.
  * `inquirer`.
* **updatection()**: Based on the category, prompt a series of questions add the input data to the database.
  > employee role
  * Use db.query to collect a list of role titles to be used as lists for the prompt.
    * Define array of the role id to determine the reference value of the role to assign to the employee.
  * Use db.query to collect a list of employees to be used as lists for the prompt.
    * Combine the first and last names from the results and define as array.
  * Prompt which employee to update and the new assigned role.
  * Split up the first and last name of the selected employee to be used in the query.
  * Use db.query to add the role to the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
  > employee manager
  * Use db.query to collect a list of employee names to be used as lists for the prompt.
    * Combine the first and last names from the results and define as array.
    * Define array of the employee id to determine the reference value of the manager to assign to the employee.
    * Add 'None' as an option to the array list.
  * Prompt which employee to update and the new assigned manager or 'None'.
  * Split up the first and last name of the selected employee to be used in the query.
  * Based on whether the employee has a manager, use db.query to update the employee's manager id in the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
  > role
  * Use db.query to collect a list of role titles to be used as lists for the prompt.
  * Collect the role title and new salary.
  * Use db.query to update the salary of the role in the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
* **module.exports**: Export the class.

### remove.js Information
* **require**: Define packages needed for the application.
  * `db` from the `server.js` module.
  * `inquirer`.
* **removeAction()**: Based on the category, prompt a series of questions add the input data to the database.
  > departments
  * Use db.query to collect a list of department names to be used as lists for the prompt.
  * Collect the name of the department to be deleted.
  * Use db.query to delete the department from the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
  > roles
  * Use db.query to collect a list of role titles to be used as lists for the prompt.
  * Collect the title of the role to be deleted.
  * Use db.query to delete the role from the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
  > employees
  * Use db.query to collect a list of employees names to be used as lists for the prompt.
    * Combine the first and last names from the results and define as array.
  * Collect the name of the employee to be deleted.
  * Split up the first and last name of the selected employee to be used in the query.
  * Use db.query to delete the employee from the database.
  * Console log the completion message and initial the callback() function to launch the option menu.
* **module.exports**: Export the class.

### db Information
* **schema.sql**: Resets the database.
  * Removes existing database and creates new `employeeTracker_db`.
  * Sets as active database.
  * Creates tables `departments`, `roles`, and `employees`.
  * Define each table schema based on required fields.
  * Links foreign key and references respective tables.
  * Each table has an auto incremented `id` that is defined as the `PRIMARY KEY`.
* **seeds.sql**: Used to pre-populate the database with values to assist with the development process.
* **query.sql**: Sample db queries to run for testing.
  * `SELECT`, `FROM`, `LEFT JOIN`, `OUTER JOIN`, `SUM`, `GROUP BY`, etc.

### package.json Information
* **package**: Define the dependencies/packages used in the application.
  * Dependencies: `console-table-printer`, version ^2.11.1
  * Dependencies: `express`, version ^4.17.1
  * Dependencies: `inquirer`, version 8.2.4
  * Dependencies: `mysql2`, version ^2.2.5

## **APPLICATION SAMPLE FUNCTIONS**
### Sample Functions
>![Sample Function](./assets/sample1.png "Sample Function")
>![Sample Function](./assets/sample2.png "Sample Function")
>![Sample Function](./assets/sample3.png "Sample Function")
>![Sample Function](./assets/sample4.png "Sample Function")