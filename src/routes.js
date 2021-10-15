const { getAllUsers } = require('./controllers/userController');
const { createUser } = require('./controllers/userController');
const { login } = require('./controllers/userController');

module.exports = {
  getAllUsers,
  createUser,
  login,
};