  const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'super-senha';

 const { BlogPost, User, Category } = require('../models');
 
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

  const createPostCategory = async (postId, categoryIds) => {
  const post = await BlogPost.findByPk(postId);

 await categoryIds.forEach(async (categoryId) => {
    const categories = await Category.findByPk(categoryId);
    await post.addCategories(categories);
  });
};

 const findUserEmail = (req, _res) => {
  const token = req.headers.authorization;
  const payload = jwt.verify(token, secret);  
  const email = payload.data.id;
   return email;
 };

 const findUserId = async (req, _res) => {
  const email = findUserEmail(req);
  const allUsers = await User.findOne({ where: { email } });
  const userId = allUsers.dataValues.id;
  return userId;
 };

   const createBlogPost = async (req, res) => {
    try {
      const { title, content, categoryIds } = req.body;
      const validate = validatePost(title, content, categoryIds, res);
      const isValidCategories = await (validateCategories(categoryIds, res));
        if (isValidCategories === true);
        if (!validate) return false;
      const userId = await findUserId(req);      
      const { id } = await BlogPost.create({ title, content, userId });
     await createPostCategory(id, categoryIds);      
      return res.status(201).json({ id, title, content, userId });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };

  const editBlogPostFunction = async ({ id }, { title, content, categoryIds }, res) => {
  if (!title) { return res.status(400).json({ message: '"title" is required' }); }
  if (!content) return res.status(400).json({ message: '"content" is required' });
  if (categoryIds) return res.status(400).json({ message: 'Categories cannot be edited' });
  
  await BlogPost.update({ ...BlogPost, title, content }, { where: { id } });
  const updatedPost = await BlogPost.findByPk(id, 
  { 
    include: { model: Category, as: 'categories', through: { attributes: [] } },
  });
  return updatedPost;
};

  const getAllBlogPost = async (_req, res) => {
  try {
    const getAllUsers = await BlogPost.findAll({
    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }, 
    { model: Category, as: 'categories', through: { attributes: [] } }],
  });   
    return res.status(200).json(getAllUsers);
  } catch (error) {
   return res.status(400).json({ message: error.message });
  }
};

  const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await BlogPost.findByPk(id, { include: [ 
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });

  if (blogPost === null) {
    return res.status(404).json({ message: 'Post does not exist' });
  }
    return res.status(200).json(blogPost);
    } catch (error) { return res.status(404).json({ message: 'Post does not exist' }); }
  };

const editBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryIds } = req.body;
    const userId = await findUserId(req);
    const postId = await BlogPost.findByPk(id);

   const blogPost = await editBlogPostFunction({ id }, { title, content, categoryIds }, res);

  if (postId.id !== userId) {
        return res.status(401).json({ message: 'Unauthorized user' });
     }

    return res.status(200).json(blogPost);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// const deleteBlogPost = async (req, res) => {
//   const { id } = req.params; 
//   const postId = await BlogPost.findByPk(id);
//   const userId = await findUserId(req);
//   console.log('id', id);
//   console.log('postId', postId.id);
//   if (postId.id === null || id === null) {
//     return res.status(404).json({
//       message: 'Post does not exist',
//     });
//   }
//   console.log('userId', userId);
//  if (postId.id !== userId) {
//      return res.status(401).json({ message: 'Unauthorized user' }); 
//  }

//   const deletedPost = await BlogPost.destroy({ where: { id } });
//   return res.status(204).json({ deletedPost });
// };

module.exports = {
    validatePost,
    validateCategories,
    createPostCategory,
    createBlogPost,
    getAllBlogPost,
    getPostById,
    editBlogPost,
    // deleteBlogPost,
  };