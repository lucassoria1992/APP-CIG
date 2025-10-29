const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { logAction } = require('../middleware/audit');

// Variable para mantener el lote actual en memoria
let currentLote = null;

// Función para generar ID de lote
const generateLoteId = () => {
  const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `L${fecha}-${random}`;
};

// POST /api/lotes/new - Crear nuevo lote
router.post('/new', verifyToken, verifyRole('admin', 'operador'), async (req, res) => {
  try {
    const loteId = generateLoteId();
    
    currentLote = {
      id: loteId,
      created_by: req.user.username,
      created_at: new Date(),
      estado: 'activo'
    };

    await logAction(req.user.username, 'CREATE_LOTE', { lote_id: loteId });

    res.json({
      error: false,
      message: 'Lote creado exitosamente.',
      lote: currentLote
    });

  } catch (error) {
    console.error('Error al crear lote:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al crear lote.' 
    });
  }
});

// GET /api/lotes/active - Obtener lote activo
router.get('/active', verifyToken, async (req, res) => {
  try {
    // Si no hay lote activo, crear uno automáticamente
    if (!currentLote || currentLote.estado !== 'activo') {
      const loteId = generateLoteId();
      
      currentLote = {
        id: loteId,
        created_by: req.user.username,
        created_at: new Date(),
        estado: 'activo'
      };

      await logAction(req.user.username, 'CREATE_LOTE', { lote_id: loteId, auto: true });
    }

    res.json({
      error: false,
      lote: currentLote
    });

  } catch (error) {
    console.error('Error al obtener lote activo:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener lote activo.' 
    });
  }
});

// POST /api/lotes/close - Cerrar lote actual
router.post('/close', verifyToken, verifyRole('admin', 'operador'), async (req, res) => {
  try {
    if (!currentLote) {
      return res.status(404).json({ 
        error: true, 
        message: 'No hay lote activo.' 
      });
    }

    currentLote.estado = 'cerrado';
    currentLote.closed_at = new Date();
    currentLote.closed_by = req.user.username;

    await logAction(req.user.username, 'CLOSE_LOTE', { lote_id: currentLote.id });

    const closedLote = currentLote;
    currentLote = null;

    res.json({
      error: false,
      message: 'Lote cerrado exitosamente.',
      lote: closedLote
    });

  } catch (error) {
    console.error('Error al cerrar lote:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al cerrar lote.' 
    });
  }
});

module.exports = router;
