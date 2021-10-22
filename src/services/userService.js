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
const DISPLAYNAME_REQUIRED = (res) => res.status(400).send({ 
  message: '"displayName" is required' }); 

const PASSWORD_ERROR = (res) => res.status(400).send({
    message: '"password" length must be 6 characters long',
  });
const PASSWORD_REQUIRED = (res) => res.status(400).send({
   message: '"password" is required' });

const PASSWORD_EMPTY = (res) => res.status(400).send({
   message: '"password" is not allowed to be empty',
   });

const VALIDATE_EMAIL_ERROR = (res) => res.status(400).send({
    message: '"email" must be a valid email',
  });

const VALIDATE_EMAIL_REQUIRED = (res) => res.status(400).send({
    message: '"email" is required',
  });
const VALIDATE_EMAIL_EMPTY = (res) => res.status(400).send({
    message: '"email" is not allowed to be empty',
  });

const emailAlreadyExists = (res) => res.status(409).send({
    message: 'User already registered',
  });

const emailExists = async (email, res) => {
 try {
    const checkedEmail = await User.findOne({ where: { email } });
    if (checkedEmail === null) return true;
    return false;
 } catch (error) {
   res.status(400).send({ message: 'Algo com email deu errado!' });
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

  const findAll = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });
 
  return users;
};

const login = ({ email, password }, res) => {
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
  emailAlreadyExists,
  login,
  findAll,
};