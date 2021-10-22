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
const { validateEmail } = require('./controllers/userController');
const { checkPassword } = require('./controllers/userController');
const { checkDisplayName } = require('./controllers/userController');
const { checkNameValidation } = require('./controllers/categoryController');
// const { deleteBlogPost } = require('./controllers/blogPostController');

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
  validateEmail,
  checkPassword,
  checkDisplayName,
  checkNameValidation,
  // deleteBlogPost,
};