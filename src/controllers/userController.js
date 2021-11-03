require('dotenv').config();

const jwt = require('jsonwebtoken');

const { User } = require('../models');

const DISPLAYNAME_ERROR = (res) => res.status(400).json({
    message: '"displayName" length must be at least 8 characters long',
  });
const DISPLAYNAME_REQUIRED = (res) => res.status(400).json({
  message: '"displayName" is required',
});

const PASSWORD_ERROR = (res) => res.status(400).json({
  message: '"password" length must be 6 characters long',
});
const PASSWORD_REQUIRED = (res) => res.status(400).json({
  message: '"password" is required',
});

const PASSWORD_EMPTY = (res) => res.status(400).json({
  message: '"password" is not allowed to be empty',
});

const VALIDATE_EMAIL_ERROR = (res) => res.status(400).json({
  message: '"email" must be a valid email',
});

const VALIDATE_EMAIL_REQUIRED = (res) => res.status(400).json({
  message: '"email" is required',
});
const VALIDATE_EMAIL_EMPTY = (res) => res.status(400).json({
  message: '"email" is not allowed to be empty',
});

const emailAlreadyExists = (res) => res.status(409).json({
  message: 'User already registered',
});

const secret = process.env.JWT_SECRET || 'super-senha';

const jwtConfiguration = {
  expiresIn: '60h',
  algorithm: 'HS256',
};

const jwtTokenFunc = (id, email) => {
  const payload = { id, email };
  return jwt.sign({ data: payload }, secret, jwtConfiguration);
};

const loginFunction = ({ email, password }, res) => {
  if (password === undefined) return res.status(400).json({ message: '"password" is required' });
  if (email.length === 0) {
    return res.status(400).json({
      message: '"email" is not allowed to be empty',
    }); 
}

  if (password.length === 0) {
    return res.status(400).json(
      { message: '"password" is not allowed to be empty' },
); 
}

return true;
};

const emailExists = async (email, res) => {
  try {
    const checkedEmail = await User.findOne({ where: { email } });
    if (checkedEmail === null) return true;
    return false;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const regex = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
  
  if (email === '') return VALIDATE_EMAIL_EMPTY(res);
  
  if (!email) return VALIDATE_EMAIL_REQUIRED(res);
  
  if (!regex.test(email)) return VALIDATE_EMAIL_ERROR(res);
  
  next();
};

const checkPassword = (req, res, next) => {
  const { password } = req.body;
  if (password === '') return PASSWORD_EMPTY(res);
  if (!password) return PASSWORD_REQUIRED(res);
  if (password.length !== 6) return PASSWORD_ERROR(res);
  next();
};

const checkDisplayName = (req, res, next) => {
  const { displayName } = req.body;
  
  if (!displayName) return DISPLAYNAME_REQUIRED(res);
  if (displayName.length < 8) return DISPLAYNAME_ERROR(res);
  next();
};

const createUser = async (req, res) => {
  try {
    const { displayName, email, password, image } = req.body;

    const checkUserExists = await emailExists(email);

    if (!checkUserExists) return emailAlreadyExists(res);
    
     const { id } = await User.create({ displayName, email, password, image });
     
     const token = jwtTokenFunc(id, email);
     
     return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (_req, res) => {
  try {
 const newUsers = await User.findAll({ attributes: { exclude: ['password'] } });

    return res.status(200).json(newUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Este endpoint usa o método findByPk do Sequelize para buscar um usuário pelo id.
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
    return res.status(404).json({ message: 'User does not exist' }); 
}

return res.status(200).json(user);
} catch (error) {
  return res.status(400).json({ message: error.message });
}
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {  
      return res.status(400).json({ message: 'Invalid fields' }); 
    }
    const token = jwtTokenFunc(email);
    return res.status(200).json({ token });
} catch (error) {
  return res.status(500).json({ message: error.message });
}
};

module.exports = {
  validateEmail,
  checkPassword,
  checkDisplayName,
  emailExists,
  DISPLAYNAME_ERROR,
  PASSWORD_ERROR,
  VALIDATE_EMAIL_ERROR,
  emailAlreadyExists,
  getAllUsers,
  createUser,
  login,
  getUserById,
  jwtTokenFunc,
  loginFunction,
};