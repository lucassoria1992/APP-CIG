const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/me - Obtener datos del usuario actual
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        error: true, 
        message: 'Usuario no encontrado.' 
      });
    }

    res.json({
      error: false,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
        apellido: user.apellido,
        activo: user.activo,
        created_at: user.created_at,
        last_login: user.last_login
      }
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener usuario.' 
    });
  }
});

// GET /api/users - Listar todos los usuarios (solo admin)
router.get('/', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const users = await User.find({});
    
    res.json({
      error: false,
      users
    });

  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al listar usuarios.' 
    });
  }
});

// PUT /api/users/:id - Actualizar usuario (solo admin)
router.put('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, role, activo } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { nombre, apellido, email, role, activo },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        error: true, 
        message: 'Usuario no encontrado.' 
      });
    }

    res.json({
      error: false,
      message: 'Usuario actualizado exitosamente.',
      user
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al actualizar usuario.' 
    });
  }
});

module.exports = router;
