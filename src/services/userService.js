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

const DISPLAYNAME_ERROR = (res) => res.status(400).send({
    message: '"displayName" length must be at least 8 characters long',
  });
const PASSWORD_ERROR = (res) => res.status(400).send({
    message: '"password" length must be 6 characters long',
  });

const VALIDATE_EMAIL_ERROR = (res) => res.status(400).send({
    message: '"email" must be a valid email',
  });
const EMAILALREADYEXISTS = (res) => res.status(409).send({
    message: 'User already registered',
  });

const emailExists = async (email, res) => {
 try {
    const checkedEmail = await User.findOne({ where: { email } });
    if (checkedEmail === null) return 'false';
    return 'true';
 } catch (error) {
   res.status(400).send({ message: 'Algo com email deu errado!' });
 }
};

const validateEmail = (email) => {
  if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
  return false;
};

const checkPassword = (password) => {
  if (password.length !== 6) return false;
  return true;
};
const checkDisplayName = (displayName) => {
  if (displayName.length < 8) return false;
  return true;
};

  const createUser = async ({ displayName, password, email }, res) => {
    if (!displayName) { return res.status(400).send({ message: '"displayName" is required' }); }
    if (!password) { return res.status(400).send({ message: '"password" is required' }); }
    if (!email) { return res.status(400).send({ message: '"email" is required' }); }
    const doesEmailExist = await (emailExists(email));
    if (doesEmailExist === 'true') return EMAILALREADYEXISTS(res);
    return true;
};

  const findAll = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });
 
  return users;
};

const login = async ({ email, password }, res) => {
  if (password === undefined) return res.status(400).send({ message: '"password" is required' });
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
  validateEmail,
  checkPassword,
  checkDisplayName,
  emailExists,
  jwtTokenFunc,
  DISPLAYNAME_ERROR,
  PASSWORD_ERROR,
  VALIDATE_EMAIL_ERROR,
  EMAILALREADYEXISTS,
  createUser,
  login,
  findAll,
};