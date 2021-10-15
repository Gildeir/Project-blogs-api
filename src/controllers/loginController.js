// const jwt = require('jsonwebtoken');
// const { User } = require('../models');

// const secret = 'super-senha';

// const jwtConfiguration = {
//   expireIn: '60m',
//   algorithm: 'HS256',
// };

// const login = async (req, res) => {
//   const { email } = req.body;
//   const { password } = req.body;
//   if (!email) return res.status(400).json({ message: '"email" is required' });
//   if (!password) return res.status(400).send({ message: '"email" is required' });
//   const user = await User.findOne({ where: { email } });
//   if (!user || user.password !== password) {
//  return res.status(404).json(
//     { message: 'Usuário não existe ou senha incorreta' },
// ); 
//   }    
//   const userWithoutPassword = { id: user.id, userEmail: user.email };
//   const token = jwt.sign({ data: userWithoutPassword }, secret, jwtConfiguration);
//   return res.status(200).json(token);
// }; 
// module.exports = {
//   login,
// };