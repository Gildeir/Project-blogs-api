  const { BlogSpot } = require('../models');

  const createBlogPost = async (req, res) => {
    const { title, content, categoryIds } = req.body;
    const blogPost = await BlogSpot.create({
      title,
      content,
      categoryIds,
    });
    if (title === undefined) return res.status(400).json({ message: '"title" is required' });
    if (content === undefined) return res.status(400).json({ message: '"content" is required' });
    if (categoryIds === undefined) {
  return res.status(400).json({
      message: '"categoryIds" is required',
    }); 
  }
    return res.status(201).json({ blogPost });
  };

  module.exports = {
    createBlogPost,
  };