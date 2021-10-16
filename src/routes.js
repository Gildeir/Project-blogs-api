const { getAllUsers } = require('./controllers/userController');
const { createUser } = require('./controllers/userController');
const { login } = require('./controllers/userController');
const { getUserById } = require('./controllers/userController');
const { createCategory } = require('./controllers/categoryController');
const { getAllCategories } = require('./controllers/categoryController');

module.exports = {
  getAllUsers,
  createUser,
  login,
  getUserById,
  createCategory,
  getAllCategories,
};