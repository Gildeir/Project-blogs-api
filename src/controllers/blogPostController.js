  const jwt = require('jsonwebtoken');

  const secret = process.env.JWT_PASSWORD;

 const { BlogPost, User, Category } = require('../models');

 const createPostCategory = async (postId, categoryIds) => {
  const post = await BlogPost.findByPk(postId);

 await categoryIds.forEach(async (categoryId) => {
    const categories = await Category.findByPk(categoryId);
    await post.addCategories(categories);
  });
};

 const findUserEmail = (req) => {
  const token = req.headers.authorization;
  const payload = jwt.verify(token, secret);  
  const email = payload.data.id;
   return email;
 };

 const findUserId = async (req) => {
  const email = findUserEmail(req);
  const allUsers = await User.findOne({ where: { email } });
  const userId = allUsers.dataValues.id;
  return userId;
 };

 const validateCategories = async (categoryIds, res) => {
  try {
        const categories = await Category.findAll({ where: { id: categoryIds } });
    if (categories.length !== categoryIds.length) {
      return res.status(400).json({ message: '"categoryIds" not found' }); 
}
      return true;
  } catch (error) {
    return res.status(400).json({ message: 'error' });
  }
    };

    const validatePost = (title, content, categoryIds, res) => {
      if (!title) { return res.status(400).json({ message: '"title" is required' }); }
      if (!content) return res.status(400).json({ message: '"content" is required' });
      if (!categoryIds) {
      return res.status(400).json({
          message: '"categoryIds" is required',
        }); 
      }
      return true;
    };
  
  const createBlogPost = async (req, res) => {
    const { title, content, categoryIds } = req.body; 
    // const userId = req.user;
    // console.log(userId);
    const validate = validatePost(title, content, categoryIds, res);
    const isValidCategories = await (validateCategories(categoryIds, res));
    if (isValidCategories === true);
    if (!validate) return false;
    const userId = await findUserId(req);
    const { id } = await BlogPost.create({ title, content, userId });
     await createPostCategory(id, categoryIds);
 
    return res.status(201).json({ id, title, content, userId });
  };

  const getAllBlogPost = async (req, res) => {
  try {
    const getAllUsers = await BlogPost.findAll({
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }, 
    { model: Category, as: 'categories', through: { attributes: [] } }],
  });   
    return res.status(200).json(getAllUsers);
  } catch (error) {
    res.status(400).send({ message: 'Something is wrong!!' });
  }
};

//   router.put('/:id', async (req, res) => {
//   const { name, description, price, userId } = req.body;
//   try {
//     const product = await Product.update(
//       { name, description, price, UserId: userId },
//       {
//       where: {
//         id: req.params.id,
//       },
//     },
// );

  module.exports = {
    createBlogPost,
    getAllBlogPost,
  };