const { User } = require('../models');
const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.findAll();    
    return res.status(200).json(users);
  } catch (error) {
    res.status(400).send({ message: 'Something is wrong' });
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
 return res.status(404).json({
      message: 'User does not exist',
    }); 
}

    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Algo deu errado' });
  }
};

//   const createUser = async (req, res) => {
//   const { displayName, email, password, image } = req.body;
//   const validateUser = userService.createUser({ displayName, email, password }, res);
//   const isValidPassword = (userService.checkPassword(password));
//   if (!validateUser) return false; 
//   const isvalidDisplayName = (userService.checkDisplayName(displayName));
//   const isValidateEmail = (userService.validateEmail(email));
//   if (!isvalidDisplayName) return userService.DISPLAYNAME_ERROR(res);
//   if (!isValidPassword) return userService.PASSWORD_ERROR(res);
//   if (!isValidateEmail) return userService.VALIDATE_EMAIL_ERROR(res);
//   const { id } = await User.create({ displayName, email, password, image });
//   const token = (userService.jwtTokenFunc(id, email));
//   return res.status(201).json({ token });
// };

const createUser = async (req, res) => {
  try {
     const { displayName, email, password, image } = req.body;
     const checkUserExists = await userService.emailExists(email);
    if (!checkUserExists) return userService.emailAlreadyExists(res);
     const { id } = await User.create({ displayName, email, password, image });
     const token = (userService.jwtTokenFunc(id, email));
     return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (email === undefined) return res.status(400).json({ message: '"email" is required' });
  const validateLogin = userService.login({ email, password }, res);
  if (!validateLogin) return false;
  const user = await User.findOne({ where: { email } });
  if (!user || user.password !== password) {  
  return res.status(400).json({ message: 'Invalid fields' }); 
}
  const token = (userService.jwtTokenFunc(email));
  return res.status(200).json({ token });
};

module.exports = {
  getAllUsers,
  createUser,
  login,
  getUserById,
};