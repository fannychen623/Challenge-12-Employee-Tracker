// define the packages needed for this application
const inquirer = require('inquirer');
const view = require('./view');
const add = require('./add');
const update = require('./update');
const remove = require('./remove');
const { Table } = require("console-table-printer");

// define the class to be exported
class Action {
  // launch application starting message
  launchAction() {
    // style message table
    const p = new Table({
      style: {
        headerTop: {
          left: "╔",
          mid: "╦",
          right: "╗",
          other: "═",
        },
        headerBottom: {
          left: "╟",
          mid: "╬",
          right: "╢",
          other: "═",
        },
        tableBottom: {
          left: "╚",
          mid: "╩",
          right: "╝",
          other: "═",
        },
        vertical: "║",
      },
      columns: [{ name: "             WELCOME TO THE EMPLOYEE TRACKER             ", alignment: "center", color: "cyan" }],
    });
    p.addRows([{ "             WELCOME TO THE EMPLOYEE TRACKER             ": "Let's Get Started!" }]);
    // print table in console
    console.log('\n');
    p.printTable();
    console.log('\n');
    // call the nextAction function to launch option menu
    this.nextAction();
  };

  // launch inquirer and determine the next profile role
  nextAction() {
    // launch prompt
    return inquirer
      .prompt([
        {
          type: 'list',
          message: 'What would you like to do?',
          name: 'action',
          choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 
          'Update Role', 'Update Employee Role', 'Update Employee Manager', 'Remove Department', 'Remove Role', 'Remove Employee', 
          'View Employees by Manager', 'View Employees by Department', 'View Total Utilized Budget by Departments', 'Quit']
        },
      ])
      // based on the response, call the respective functions
      .then((data) => {
        // define the general category based on selection
        this.category = data.action.toLowerCase().split(' ').splice(-1);
        // define more specific categories for certains selections
        // call the respective action functions
        if (data.action.includes('View')) {
          if (data.action.includes('Budget')) {
            this.category = 'budget';
          } else if (data.action.includes('by Manager')) {
            this.category = 'employee by manager';
          } else if (data.action.includes('by Department')) {
            this.category = 'employee by department';
          } else {
            this.category = data.action.toLowerCase().split(' ').splice(-1);
          };
          this.viewAction();
        };
        if (data.action.includes('Add')) {
          this.category = data.action.toLowerCase().split(' ').splice(-1) +'s';
          this.addAction();
        };
        if (data.action.includes('Update')) {
          if (data.action.includes('Manager')) {
            this.category = 'employee manager'
            this.updateAction();
          } else if (data.action.includes('Employee')) {
            this.category = 'employee role'
            this.updateAction();
          } else if (data.action.includes('Role')) {
            this.category = 'role'
            this.updateAction();
          };
        };
        if (data.action.includes('Remove')) {
          this.category = data.action.toLowerCase().split(' ').splice(-1) +'s';
          this.removeAction();
        };
        if (data.action === 'Quit') {
          this.quitAction();
        };
      });
  };

  // call the view module and callback to the nextAction function after code completion
  viewAction() {
    const viewTracker = new view();
    viewTracker.viewAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  // call the add module and callback to the nextAction function after code completion
  addAction() {
    const addToTracker = new add();
    addToTracker.addAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  // call the update module and callback to the nextAction function after code completion
  updateAction() {
    const updateTracker = new update();
    updateTracker.updateAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  // call the remove module and callback to the nextAction function after code completion
  removeAction() {
    const removeFromTracker = new remove();
    removeFromTracker.removeAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  // quit the process after logging exit message.
  quitAction() {
    console.log('\nExiting Employee Tracker...');
    process.exit(0);
  };

};

module.exports = Action;