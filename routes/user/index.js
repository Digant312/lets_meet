const { getUsers, addUser, getMyDetails, logout, login } = require('./user');
const auth = require('@middlewares/auth');

module.exports = function (app) {
  //Users Routes
  app.get('/users', getUsers),
  app.post('/user', addUser),
  app.get('/user/me', auth, getMyDetails),
  app.post('/user/logout', auth, logout),
  app.post('/user/login', login)
};