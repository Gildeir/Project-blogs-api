 const { BlogPost, Category } = require('../models');
 // const getPostById = require('../controllers/blogPostController');

const editBlogPost = async ({ id }, { title, content, categoryIds }, res) => {
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

module.exports = {
  editBlogPost,
  };