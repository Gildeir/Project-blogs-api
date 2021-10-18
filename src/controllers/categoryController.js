const { Category } = require('../models');

const getAllCategories = async (_req, res) => {
  try {
    console.log(Category);
    const newCategory = await Category.findAll();
    return res.status(200).json(newCategory);
  } catch (error) {
    res.status(400).send({
      message: 'Something is wrong',
    });
  }
};

  const createCategory = async (req, res) => {
    try { 
      const { name } = req.body;
      if (name === undefined) return res.status(400).json({ message: '"name" is required' });
      console.log(name);
      const categories = await Category.create({ name });
      return res.status(201).json(categories);
    } catch (error) {
        return res.status(401).json({ message: 'Expired or invalid token' });
    }
};

module.exports = {
  createCategory,
  getAllCategories,
};