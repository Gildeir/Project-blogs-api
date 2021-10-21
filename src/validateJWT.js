require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_PASSWORD;

const validateJWT = async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) return res.status(401).json({ message: 'Token not found' });

  next();

  try {
    const payload = jwt.verify(token, secret);
    const { id } = payload.data;  
    // console.log(payload);
    req.user = id;
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

module.exports = validateJWT;