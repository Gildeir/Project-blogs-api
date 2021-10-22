 const { BlogPost, Category } = require('../models');

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

module.exports = {
  validatePost,
  validateCategories,
  createPostCategory,
};