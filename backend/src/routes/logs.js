const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const UserLog = require('../models/UserLog');

// GET /api/logs - Obtener logs de auditoría
router.get('/', verifyToken, verifyRole('admin', 'auditor'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      user, 
      action, 
      startDate, 
      endDate,
      status 
    } = req.query;

    const query = {};
    
    if (user) query.user = user;
    if (action) query.action = action;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await UserLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await UserLog.countDocuments(query);

    res.json({
      error: false,
      logs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener logs.' 
    });
  }
});

// GET /api/logs/stats - Obtener estadísticas de logs
router.get('/stats', verifyToken, verifyRole('admin', 'auditor'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    const stats = await UserLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            action: '$action',
            user: '$user'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.action',
          total: { $sum: '$count' },
          users: {
            $push: {
              user: '$_id.user',
              count: '$count'
            }
          }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      error: false,
      stats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener estadísticas.' 
    });
  }
});

// GET /api/logs/actions - Listar tipos de acciones disponibles
router.get('/actions', verifyToken, verifyRole('admin', 'auditor'), async (req, res) => {
  try {
    const actions = await UserLog.distinct('action');

    res.json({
      error: false,
      actions
    });

  } catch (error) {
    console.error('Error al obtener acciones:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Error al obtener acciones.' 
    });
  }
});

module.exports = router;
