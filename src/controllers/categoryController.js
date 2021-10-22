const { Category } = require('../models');

const checkNameValidation = (req, res, next) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json(
      { message: '"name" is required' },
      );
    }    
    next();
  };

const getAllCategories = async (_req, res) => {
  try {
    const newCategory = await Category.findAll();
    return res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  const createCategory = async (req, res) => {
    try { 
      const { name } = req.body;
      const categories = await Category.create({ name });
      return res.status(201).json(categories);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
  createCategory,
  checkNameValidation,
  getAllCategories,
};