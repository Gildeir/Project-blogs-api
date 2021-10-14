const { User } = require('../models');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const secret = process.env.JWT_PASSWORD;

const jwtConfiguration = {
  expiresIn: '15m',
  algorithm: 'HS256',
};

const jwtTokenFunc = (id, email) => {
  const payload = { id, email  };
  return jwt.sign({ data: payload  }, secret, jwtConfiguration);
};


const DISPLAYNAME_ERROR = (res) => {
  return res.status(400).send({
    message: "\"displayName\" length must be at least 8 characters long"
  })
}
const PASSWORD_ERROR = (res) => {
  return res.status(400).send({
    message: "\"password\" length must be 6 characters long"
  })
}

const VALIDATE_EMAIL_ERROR = (res) => {
  return res.status(400).send({
    message: "\"email\" must be a valid email"
  })
}
const EMAILALREADYEXISTS = (res) => {
  return res.status(409).send({
    message: "User already registered"
  })
}

const emailExists = async (email) => {
 try {
   
    const checkedEmail = await User.findOne({ where: { email }})
    if (checkedEmail === null) return "false"
    return "true";
   
 } catch (error) {
   res.status(400).send({message:"Algo com email deu errado!"})
 }
}

const validateEmail = (email) => {
  if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(email)) return true;
  return false;
};

const checkPassword = (password) => {
  if (password.length !== 6) return false;
  return true;
}
const checkDisplayName = (displayName) => {
  if (displayName.length < 8) return false;
  return true;
}

module.exports = {
  validateEmail,
  checkPassword,
  checkDisplayName,
  emailExists,
  jwtTokenFunc,
  DISPLAYNAME_ERROR,
  PASSWORD_ERROR,
  VALIDATE_EMAIL_ERROR,
  EMAILALREADYEXISTS
}