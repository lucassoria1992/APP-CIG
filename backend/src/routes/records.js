const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const { logAction } = require('../middleware/audit');
const CheckRecord = require('../models/CheckRecord');
const Client = require('../models/Client');

// POST /api/records - Agregar cheque al lote activo
router.post('/', verifyToken, verifyRole('admin', 'operador'), async (req, res) => {
  try {
    const {
      lote_id,
      cliente,
      cuit,
      importe,
      moneda,
      fecha_vto,
      tipo_documento,
      identificacion_doc,
      banco_emisor,
      sucursal,
      numero_cheque,
      observaciones
    } = req.body;

    // Validaciones
    if (!lote_id || !cliente || !cuit || !importe || !fecha_vto || !identificacion_doc) {
      return res.status(400).json({ 
        error: true, 
        message: 'Faltan campos requeridos.' 
      });
    }

    // Crear registro de cheque
    const record = new CheckRecord({
      lote_id,
      cliente,
      cuit,
      importe: parseFloat(importe),
      moneda: moneda || '00',
      fecha_vto: new Date(fecha_vto),
      tipo_documento: tipo_documento || 'PC',
      identificacion_doc,
      banco_emisor,
      sucursal,
      numero_cheque,
      observaciones,
      created_by: req.user.username
    });

    await record.save();

    // Actualizar o crear cliente
    await Client.findOneAndUpdate(
      { cuit },
      {
        $set: {
          nombre: cliente,
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

    await logAction(req.user.username, 'ADD_RECORD', {
      lote_id,
      record_id: record._id,
      cliente,
      importe
    });

    res.status(201).json({
      error: false,
      message: 'Cheque agregado exitosamente.',
      record
    });

  } catch (error) {
    console.error('Error al agregar cheque:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al agregar cheque.',
      details: error.message
    });
  }
});

// GET /api/records/:loteId - Obtener todos los cheques de un lote
router.get('/:loteId', verifyToken, async (req, res) => {
  try {
    const { loteId } = req.params;

    const records = await CheckRecord.find({ lote_id: loteId }).sort({ created_at: 1 });

    const total = records.reduce((sum, record) => sum + record.importe, 0);

    res.json({
      error: false,
      lote_id: loteId,
      total_records: records.length,
      total_importe: total,
      records
    });

  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener registros.' 
    });
  }
});

// DELETE /api/records/:id - Eliminar un cheque
router.delete('/:id', verifyToken, verifyRole('admin', 'operador'), async (req, res) => {
  try {
    const { id } = req.params;

    const record = await CheckRecord.findById(id);

    if (!record) {
      return res.status(404).json({ 
        error: true, 
        message: 'Registro no encontrado.' 
      });
    }

    if (record.estado === 'exportado') {
      return res.status(400).json({ 
        error: true, 
        message: 'No se puede eliminar un registro ya exportado.' 
      });
    }

    await CheckRecord.findByIdAndDelete(id);

    await logAction(req.user.username, 'DELETE_RECORD', {
      record_id: id,
      lote_id: record.lote_id,
      cliente: record.cliente
    });

    res.json({
      error: false,
      message: 'Registro eliminado exitosamente.'
    });

  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al eliminar registro.' 
    });
  }
});

// PUT /api/records/:id - Editar un cheque
router.put('/:id', verifyToken, verifyRole('admin', 'operador'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const record = await CheckRecord.findById(id);

    if (!record) {
      return res.status(404).json({ 
        error: true, 
        message: 'Registro no encontrado.' 
      });
    }

    if (record.estado === 'exportado') {
      return res.status(400).json({ 
        error: true, 
        message: 'No se puede editar un registro ya exportado.' 
      });
    }

    const updatedRecord = await CheckRecord.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    await logAction(req.user.username, 'EDIT_RECORD', {
      record_id: id,
      lote_id: record.lote_id,
      changes: updateData
    });

    res.json({
      error: false,
      message: 'Registro actualizado exitosamente.',
      record: updatedRecord
    });

  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al actualizar registro.' 
    });
  }
});

module.exports = router;
