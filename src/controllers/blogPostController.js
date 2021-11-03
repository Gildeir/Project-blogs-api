  // const jwt = require('jsonwebtoken');

// const secret = process.env.JWT_SECRET || 'super-senha';

 const { BlogPost, User, Category } = require('../models');
 
 const validatePost = (title, content, categoryIds, res) => {
  if (!title) { return res.status(400).json({ message: '"title" is required' }); }
  if (!content) return res.status(400).json({ message: '"content" is required' });
  if (!categoryIds || categoryIds.length === 0) {
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

//  const findUserIdFromToken = (req, _res) => {
//   const token = req.headers.authorization;
//   const payload = jwt.verify(token, secret);
//   console.log('pay', payload.data);
//   const { id } = payload.data;
//   console.log('email: ', id);
//    return id;
//  };

//  const findUserId = async (req, _res) => {
//   const id = findUserIdFromToken(req);
//   const oneUser = await User.findOne({ where: { id } });
//   console.log('All: ', oneUser);

//   const userId = oneUser.dataValues.id;
//   console.log('userIdCreate: ', userId);
//   return userId;
//  };

   const createBlogPost = async (req, res) => {
    try {
      const { title, content, categoryIds } = req.body;
      const email = req.user;
      const { id: userId } = await User.findOne({ where: { email } });      
      const validate = validatePost(title, content, categoryIds, res);
      if (!validate) return false;
      const isValidCategories = await (validateCategories(categoryIds, res));
        if (isValidCategories === true);
      console.log('userIdCreate: ', userId);   
      const { id } = await BlogPost.create({ userId, title, content });
     await createPostCategory(id, categoryIds);      
      return res.status(201).json({ id, userId, title, content });
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
    const email = req.user;
    const { id: userId } = await User.findOne({ where: { email } }); 
    console.log('userId: ', userId);
    const { title, content, categoryIds } = req.body;
    const postId = await BlogPost.findByPk(id);
    console.log('postId:', postId);
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

const deleteBlogPost = async (req, res) => {
  try {
  const { id } = req.params; 
  const postId = await BlogPost.findByPk(id);
  if (postId.id === null || id === null) {
    return res.status(404).json({ message: 'Post does not exist' });
  }
  const email = req.user;
  const userId = await User.findOne({ where: { email } });
 if (postId.id !== userId.id) {
 return res.status(401).json({ message: 'Unauthorized user' }); 
}
  const deletedPost = await BlogPost.destroy({ where: { id } });
  return res.status(204).json({ deletedPost });
  } catch (error) {
    return res.status(404).json({ message: 'Post does not exist' });
  }
};

module.exports = {
    validatePost,
    validateCategories,
    createPostCategory,
    createBlogPost,
    getAllBlogPost,
    getPostById,
    editBlogPost,
    deleteBlogPost,
  };