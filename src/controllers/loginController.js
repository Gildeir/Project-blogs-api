const express = require('express');
const { User } = require('../models');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secret = 'super-senha'

const jwtConfiguration = {
  expireIn: '60m',
  algorithm: 'HS256'
}

const login = async(req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) return res.status(400).send({message: 'email é requirito'})
    if (!password) return res.status(400).send({message: 'password é requirito'});

    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password)
    return res.status(404).json({ message: 'Usuário não existe ou senha incorreta' });
    
    const userWithoutPassword = {
      id: user.id,
      userEmail: user.email
    }
    
    const token = jwt.sign({ data: userWithoutPassword }, secret )
    return res.status(200).json( token );
    
  } catch (error) {
    res.status(400).send({message:  'algo no login deu errado'})
  }

}; 
module.exports = {
  login,
}