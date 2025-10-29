const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Client = require('../models/Client');

// GET /api/clients - Buscar clientes (autocompletado)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { q } = req.query;

    let clients;

    if (q) {
      // Buscar por CUIT o nombre
      const regex = new RegExp(q, 'i');
      clients = await Client.find({
        $or: [
          { cuit: regex },
          { nombre: regex },
          { razon_social: regex }
        ]
      })
      .sort({ frecuencia_uso: -1, ultimo_uso: -1 })
      .limit(10);
    } else {
      // Devolver los más usados
      clients = await Client.find({})
        .sort({ frecuencia_uso: -1, ultimo_uso: -1 })
        .limit(20);
    }

    res.json({
      error: false,
      clients
    });

  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al buscar clientes.' 
    });
  }
});

// GET /api/clients/:cuit - Obtener cliente por CUIT
router.get('/:cuit', verifyToken, async (req, res) => {
  try {
    const { cuit } = req.params;

    const client = await Client.findOne({ cuit });

    if (!client) {
      return res.status(404).json({ 
        error: true, 
        message: 'Cliente no encontrado.' 
      });
    }

    res.json({
      error: false,
      client
    });

  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener cliente.' 
    });
  }
});

// POST /api/clients - Crear o actualizar cliente
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      nombre,
      cuit,
      razon_social,
      domicilio,
      localidad,
      provincia,
      codigo_postal,
      telefono,
      email
    } = req.body;

    if (!nombre || !cuit) {
      return res.status(400).json({ 
        error: true, 
        message: 'Nombre y CUIT son requeridos.' 
      });
    }

    const client = await Client.findOneAndUpdate(
      { cuit },
      {
        $set: {
          nombre,
          razon_social,
          domicilio,
          localidad,
          provincia,
          codigo_postal,
          telefono,
          email,
          ultimo_uso: new Date()
        },
        $inc: { frecuencia_uso: 1 },
        $setOnInsert: {
          created_by: req.user.username,
          created_at: new Date()
        }
      },
      { upsert: true, new: true }
    );

    res.json({
      error: false,
      message: 'Cliente guardado exitosamente.',
      client
    });

  } catch (error) {
    console.error('Error al guardar cliente:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al guardar cliente.',
      details: error.message
    });
  }
});

module.exports = router;
