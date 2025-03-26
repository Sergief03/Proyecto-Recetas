const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Registro de usuario:', { username, email });

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('Error: El usuario ya existe');
      return res.status(400).json({ message: 'El usuario ya existe. Por favor, elija otro email.' });
    }

    // Hashing the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario con password hasheada
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    console.log('Usuario creado exitosamente:', { username, email });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Por favor, verifique los datos ingresados.' });
    }
  } catch (error) {
    console.error('Error del servidor:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      console.log('Error: Email o contraseña incorrectos');
      res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error del servidor:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

module.exports = router;
