const { getAllUsers } = require('../src/controllers/userController');
const { createUser } = require('../src/controllers/userController');
const { login } = require('../src/controllers/loginController');
const { validateJWT } = require('./validateJWT')


module.exports = {
  getAllUsers,
  createUser,
  login,
  validateJWT
};