var userRoutes = require('./user');
// var taskRoutes = require('./task');

module.exports = function (app) {
  userRoutes(app)
  // taskRoutes(app)
}