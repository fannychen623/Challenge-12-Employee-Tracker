const db = require("../server");

class View {
  viewAction(category, callback) {
    db.query(`SELECT * FROM ${category}`, (err, results) => {
      console.log('\n');
      console.table(results);
      console.log('\n');
      callback();
    });
  };
};

module.exports = View;