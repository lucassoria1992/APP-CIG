const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { logAction } = require('../middleware/audit');

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.'
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: true, 
        message: 'Usuario y contraseña son requeridos.' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ username, activo: true });
    
    if (!user) {
      await logAction(username, 'LOGIN', { success: false }, 'error', 'Usuario no encontrado');
      return res.status(401).json({ 
        error: true, 
        message: 'Credenciales inválidas.' 
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      await logAction(username, 'LOGIN', { success: false }, 'error', 'Contraseña incorrecta');
      return res.status(401).json({ 
        error: true, 
        message: 'Credenciales inválidas.' 
      });
    }

    // Actualizar último login
    user.last_login = new Date();
    await user.save();

    // Generar token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES || '1h' }
    );

    await logAction(username, 'LOGIN', { success: true, role: user.role }, 'success');

    res.json({
      error: false,
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
        apellido: user.apellido
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error en el servidor.' 
    });
  }
});

// POST /api/auth/register (solo admin puede crear usuarios)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, nombre, apellido } = req.body;

    // Validaciones básicas
    if (!username || !email || !password || !nombre || !apellido) {
      return res.status(400).json({ 
        error: true, 
        message: 'Todos los campos son requeridos.' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: true, 
        message: 'El usuario o email ya existe.' 
      });
    }

    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password,
      role: role || 'operador',
      nombre,
      apellido
    });

    await user.save();

    res.status(201).json({
      error: false,
      message: 'Usuario creado exitosamente.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
        apellido: user.apellido
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al crear usuario.' 
    });
  }
});

module.exports = router;
