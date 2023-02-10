const inquirer = require('inquirer');
const view = require('./view');
const add = require('./add');
const update = require('./update');
const { Table } = require("console-table-printer");

class Action {
  // start creating the profiles
  launchAction() {
    // log starting message
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
    console.log('\n');
    p.printTable();
    console.log('\n');
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
          choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Role', 'Update Employee Role', 'Update Employee Manager', 'View Total Utilized Budget by Departments', 'Quit']
        },
      ])
      // based on the response, call the respective functions
      .then((data) => {
        this.category = data.action.toLowerCase().split(' ').splice(-1);
        if (data.action.includes('View')) {
          if (data.action.includes('Budget')) {
            this.category = 'budget';
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
        if (data.action === 'Quit') {
          this.quitAction();
        };
      });
  };

  viewAction() {
    const viewTracker = new view();
    viewTracker.viewAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  addAction() {
    const addToTracker = new add();
    addToTracker.addAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  updateAction() {
    const updateTracker = new update();
    updateTracker.updateAction(this.category, function() {
      const action = new Action().nextAction();
    });
  };

  quitAction() {
    console.log('\nExiting Employee Tracker...');
    process.exit(0);
  };

};

module.exports = Action;