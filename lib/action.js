const inquirer = require("inquirer");
const view = require("./view");
const add = require("./add");
const update = require("./update");

class Action {
  // start creating the profiles
  launchAction() {
    // log starting message
    console.log('----------------------------------------------');
    // call the next profile function after passing the manager class
    this.nextAction();
  };

  // launch inquirer and determine the next profile role
  nextAction() {
    return inquirer
      .prompt([
        {
          type: 'list',
          message: 'What would you like to do?',
          name: 'action',
          choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Role', 'Update Employee Role', 'Update Employee Manager', 'Quit']
        },
      ])
      // based on the response, call the respective functions
      .then((data) => {
        this.category = data.action.toLowerCase().split(" ").splice(-1);
        if (data.action.includes("View")) {
          this.viewAction()
        };
        if (data.action.includes("Add")) {
          this.category = this.category +'s';
          this.addAction();
        };
        if (data.action.includes("Update")) {
          if (data.action.includes("Manager")) {
            this.category = 'employee manager'
            this.updateAction();
          } else if (data.action.includes("Employee")) {
            this.category = 'employee role'
            this.updateAction();
          } else if (data.action.includes("Role")) {
            this.category = 'role'
            this.updateAction();
          };
        };
        if (data.action === "Quit") {
          this.quitAction();
        };
      });
  };

  viewAction() {
    const viewTracker = new view();
    viewTracker.viewAction(this.category, function() {
      const action = new Action().nextAction();;
    });
  };

  addAction() {
    const addToTracker = new add();
    addToTracker.addAction(this.category, function() {
      const action = new Action().nextAction();;
    });
  };

  updateAction() {
    const updateTracker = new update();
    updateTracker.updateAction(this.category, function() {
      const action = new Action().nextAction();;
    });
  };

  quitAction() {
    console.log("\nExiting Employee Tracker...");
    process.exit(0);
  };

};

module.exports = Action;