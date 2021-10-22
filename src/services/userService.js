require('dotenv').config();

const jwt = require('jsonwebtoken');
const { User } = require('../models');

const secret = 'super-senha';

const jwtConfiguration = {
  expiresIn: '60m',
  algorithm: 'HS256',
};

const jwtTokenFunc = (id, email) => {
  const payload = { id, email };
  return jwt.sign({ data: payload }, secret, jwtConfiguration);
};

  const findAll = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });
 
  return users;
};

const login = ({ email, password }, res) => {
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

module.exports = {
  jwtTokenFunc,
  login,
  findAll,
};