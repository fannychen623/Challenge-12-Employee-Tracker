// define the packages needed for this application
const inquirer = require("inquirer");

// define the class to be exported
class Action {
  // define the constructor function for the class
  constructor() {
    this.category = '';
    this.action = ' ';
  };

  // start creating the profiles
  launchTasks() {
    // log starting message
    console.log('----------------------------------------------');
    // call the next profile function after passing the manager class
    this.nextAction;
  };

  // launch inquirer and determine the next profile role
  nextAction() {
    return inquirer
      .prompt([
        {
          type: 'list',
          message: 'What would you like to do?',
          name: 'action',
          choices: ['View All Departments', 'View All Role', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
        },
      ])
      // based on the response, call the respective functions
      .then((data) => {
        if (data.action === "View All Departments") {
          
        };
        if (data.action === "View All Role") {
          
        };
        if (data.action === "View All Employees") {
          
        };
      });
  };

  // call the engineer class from the module
  departmentActions() {
    if (this.action = 'view') {

    }
    const engineerProfile = new engineer();
    // call the next profile function after passing the engineer class
    engineerProfile.createProfile().then(() => {
      this.nextProfile();
    });
  };

  // call the engineer class from the module
  addIntern() {
    // set the role to 'Intern'
    this.role = 'Intern';
    const internProfile = new intern();
    // call the next profile function after passing the inter class
    internProfile.createProfile().then(() => {
      this.nextProfile();
    });
  };

  // call the generate class from the module
  generateTeamProfile() {
    // set the role to 'None'
    this.role = 'None';
    const teamProfile = new generate();
    // call function to generate the team profile page
    teamProfile.createPage();
  };
};

// export the class
module.exports = Action;