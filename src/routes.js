const { getAllUsers } = require('./controllers/userController');
const { createUser } = require('./controllers/userController');
const { login } = require('./controllers/userController');
const { getUserById } = require('./controllers/userController');
const { createCategory } = require('./controllers/categoryController');
const { getAllCategories } = require('./controllers/categoryController');
const { createBlogPost } = require('./controllers/blogPostController');
const { getAllBlogPost } = require('./controllers/blogPostController');
const { getPostById } = require('./controllers/blogPostController');
const { editBlogPost } = require('./controllers/blogPostController');
const { deleteBlogPost } = require('./controllers/blogPostController');
const { validateEmail } = require('./services/userService');
const { checkPassword } = require('./services/userService');
const { checkDisplayName } = require('./services/userService');

module.exports = {
  getAllUsers,
  createUser,
  login,
  getUserById,
  createCategory,
  getAllCategories,
  createBlogPost,
  getAllBlogPost,
  getPostById,
  editBlogPost,
  deleteBlogPost,
  validateEmail,
  checkPassword,
  checkDisplayName,
};