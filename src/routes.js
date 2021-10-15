const { getAllUsers } = require('./controllers/userController');
const { createUser } = require('./controllers/userController');
const { login } = require('./controllers/userController');
const { validateJWT } = require('./validateJWT');

module.exports = {
  getAllUsers,
  createUser,
  login,
  validateJWT,
};