const express = require('express');
const bodyParser = require('body-parser');

const route = express.Router();
route.use(bodyParser.json());
const { User } = require('../models');
const userService = require('../services/userService');
const { validateJWT } = require('../validateJWT');

const getAllUsers = async (req, res) => {
  try {
    User.findAll().then(dados => {
        res.status(201).json(dados)
      })
  } catch (error) {
    res.status(400).send({message: "Something is wrong"})
  }
}

// Este endpoint usa o método findByPk do Sequelize para buscar um usuário pelo id.
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id);

//     if (!user) return res.status(404).json({
//       message: 'Usuário não encontrado'
//     });

//     return res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ message: 'Algo deu errado' });
//   }
// });

// Este endpoint usa o método findOne do Sequelize para buscar um usuário pelo id e email.
// URL a ser utilizada para o exemplo http://localhost:3000/user/search/1?email=aqui-o-email
// router.get('/search/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email } = req.query;
//     const user = await User.findOne({ where: { id, email }
//     });

//     if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

//     return res.status(201).json(user);
//   } catch (error) {
//       res.status(400).json({ message: 'Algo deu errado' });
//   }
// });

// Este endpoint usa o método create do Sequelize para salvar um usuário no banco.
   const createUser = async (req, res) => {
    try {
          const { displayName, email, password, image } = req.body;
          if (!displayName) return res.status(400).send({
            message: "\"displayName\" is required"
          })
          if (!password) return res.status(400).send({
            message: "\"password\" is required"
          })
          if (!email) return res.status(400).send({
            message: "\"email\" is required"
          })
          const isValidPassword = (userService.checkPassword(password))
          const isvalidDisplayName = (userService.checkDisplayName(displayName))
          const isValidateEmail = (userService.validateEmail(email))
          const doesEmailExist = await (userService.emailExists(email))
          if (!isvalidDisplayName) return userService.DISPLAYNAME_ERROR(res);
          if (!isValidPassword) return userService.PASSWORD_ERROR(res);
          if (!isValidateEmail) return userService.VALIDATE_EMAIL_ERROR(res);
          if (doesEmailExist === "true") return userService.EMAILALREADYEXISTS(res);
          const { id } = await User.create({ displayName, email, password, image });
          const token = (userService.jwtTokenFunc(id, email))
          return res.status(201).json(token);
    } catch (error) { res.status(400).send({ message: 'Algo deu errado!!'});
  }
};



// Este endpoint usa o método update do Sequelize para alterar um usuário no banco.
// router.put('/:id', async (req, res) => {
//   try {
//     const { fullName, email } = req.body;
//     const { id } = req.params;

//     const [updateUser] = await User.update({ fullName, email }, { where: { id }  });
//     console.log(updateUser); // confira o que é retornado quando o user com o id é ou não encontrado;

//     if (!updateUser) return res.status(404).json({
//       message: 'Usuário não encontrado'
//     });

//     return res.status(201).json({
//       message: 'Usuário atualizado com sucesso!'
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: 'Algo deu errado'
//     });
//   }
// });

// Este endpoint usa o método destroy do Sequelize para remover um usuário no banco.
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteUser = await User.destroy({
//       where: { id }
//     }, );

//     console.log(deleteUser) // confira o que é retornado quando o user com o id é ou não encontrado;

//     return res.status(201).json({
//       message: 'Usuário excluído com sucesso!'
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: 'Algo deu errado'
//     });
//   }
// });

module.exports = {
  getAllUsers,
  createUser,
};