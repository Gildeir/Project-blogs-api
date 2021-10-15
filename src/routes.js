const { getAllUsers } = require('./controllers/userController');
const { createUser } = require('./controllers/userController');
const { login } = require('./controllers/userController');
const { getUserById } = require('./controllers/userController');

module.exports = {
  getAllUsers,
  createUser,
  login,
  getUserById,
};