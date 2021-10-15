// const jwt = require('jsonwebtoken');

// require('dotenv').config();

// const secret = process.env.JWT_SECRET;

// const validateJWT = async (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) return res.status(401).json({ message: 'missing auth token' }); 

//   try {
//     const payload = jwt.verify(token, secret);
//     const reqUser = req.user;
//     reqUser = payload.data;
    
//     next();
//   } catch (error) { 
//       return res.status(401).json({ message: 'jwt malformed' });
//   }
// };
// module.exports = {
//   validateJWT,
// };