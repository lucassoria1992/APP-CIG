// const express = require('express');
// const router = express.Router();
// const { verifyToken, verifyRole } = require('../middleware/auth');
// const { logAction } = require('../middleware/audit');
// const CheckRecord = require('../models/CheckRecord');
// const GeneratedFile = require('../models/GeneratedFile');
// const { generateCIGFile, validateCIGFile } = require('../utils/cigGenerator');

// // POST /api/files/generate - Generar archivo TXT
// router.post('/generate', verifyToken, verifyRole('admin', 'operador'), async (req, res) => {
//   try {
//     const { lote_id, observaciones } = req.body;

//     if (!lote_id) {
//       return res.status(400).json({ 
//         error: true, 
//         message: 'El ID del lote es requerido.' 
//       });
//     }

//     // Obtener registros del lote que no hayan sido exportados
//     const records = await CheckRecord.find({ 
//       lote_id, 
//       estado: 'pendiente' 
//     }).sort({ created_at: 1 });

//     if (records.length === 0) {
//       return res.status(400).json({ 
//         error: true, 
//         message: 'No hay registros pendientes para exportar en este lote.' 
//       });
//     }

//     // Generar nombre de archivo
//     const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
//     const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '');
//     const filename = `CIG_${lote_id}_${fecha}_${hora}.txt`;

//     // Generar archivo
//     const result = await generateCIGFile(lote_id, records, filename);

//     // Validar archivo generado
//     const validation = await validateCIGFile(result.filepath);

//     // Guardar metadata en base de datos
//     const generatedFile = new GeneratedFile({
//       filename: result.filename,
//       lote_id,
//       filepath: result.filepath,
//       total_records: result.totalRecords,
//       total_importe: result.totalImporte,
//       user: req.user.username,
//       observaciones,
//       validado: validation.validado,
//       errores: validation.errores
//     });

//     await generatedFile.save();

//     // Marcar registros como exportados
//     await CheckRecord.updateMany(
//       { lote_id, estado: 'pendiente' },
//       { 
//         $set: { 
//           estado: 'exportado',
//           exported_at: new Date(),
//           exported_by: req.user.username
//         } 
//       }
//     );

//     await logAction(req.user.username, 'GENERATE_FILE', {
//       lote_id,
//       filename: result.filename,
//       total_records: result.totalRecords,
//       total_importe: result.totalImporte
//     });

//     res.json({
//       error: false,
//       message: 'Archivo generado exitosamente.',
//       file: {
//         id: generatedFile._id,
//         filename: result.filename,
//         lote_id,
//         total_records: result.totalRecords,
//         total_importe: result.totalImporte,
//         validado: validation.validado,
//         errores: validation.errores
//       }
//     });

//   } catch (error) {
//     console.error('Error al generar archivo:', error);
    
//     await logAction(
//       req.user.username, 
//       'GENERATE_FILE', 
//       { lote_id: req.body.lote_id, error: error.message },
//       'error',
//       error.message
//     );

//     res.status(500).json({ 
//       error: true, 
//       message: 'Error al generar archivo.',
//       details: error.message
//     });
//   }
// });

// // GET /api/files - Listar archivos generados
// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const { page = 1, limit = 20, user, lote_id } = req.query;

//     const query = {};
    
//     if (user) query.user = user;
//     if (lote_id) query.lote_id = lote_id;

//     const files = await GeneratedFile.find(query)
//       .sort({ fecha_generacion: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await GeneratedFile.countDocuments(query);

//     res.json({
//       error: false,
//       files,
//       total,
//       page: parseInt(page),
//       totalPages: Math.ceil(total / limit)
//     });

//   } catch (error) {
//     console.error('Error al listar archivos:', error);
//     res.status(500).json({ 
//       error: true, 
//       message: 'Error al listar archivos.' 
//     });
//   }
// });

// // GET /api/files/download/:id - Descargar archivo
// router.get('/download/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const file = await GeneratedFile.findById(id);

//     if (!file) {
//       return res.status(404).json({ 
//         error: true, 
//         message: 'Archivo no encontrado.' 
//       });
//     }

//     await logAction(req.user.username, 'DOWNLOAD_FILE', {
//       file_id: id,
//       filename: file.filename,
//       lote_id: file.lote_id
//     });

//     res.download(file.filepath, file.filename, (err) => {
//       if (err) {
//         console.error('Error al descargar archivo:', err);
//         res.status(500).json({ 
//           error: true, 
//           message: 'Error al descargar archivo.' 
//         });
//       }
//     });

//   } catch (error) {
//     console.error('Error al descargar archivo:', error);
//     res.status(500).json({ 
//       error: true, 
//       message: 'Error al descargar archivo.' 
//     });
//   }
// });

// // DELETE /api/files/:id - Eliminar archivo (solo admin)
// router.delete('/:id', verifyToken, verifyRole('admin'), async (req, res) => {
//   try {
//     const { id } = req.params;

//     const file = await GeneratedFile.findById(id);

//     if (!file) {
//       return res.status(404).json({ 
//         error: true, 
//         message: 'Archivo no encontrado.' 
//       });
//     }

//     // Eliminar archivo físico
//     const fs = require('fs').promises;
//     try {
//       await fs.unlink(file.filepath);
//     } catch (err) {
//       console.error('Error al eliminar archivo físico:', err);
//     }

//     // Eliminar registro de la base de datos
//     await GeneratedFile.findByIdAndDelete(id);

//     await logAction(req.user.username, 'DELETE_FILE', {
//       file_id: id,
//       filename: file.filename,
//       lote_id: file.lote_id
//     });

//     res.json({
//       error: false,
//       message: 'Archivo eliminado exitosamente.'
//     });

//   } catch (error) {
//     console.error('Error al eliminar archivo:', error);
//     res.status(500).json({ 
//       error: true, 
//       message: 'Error al eliminar archivo.' 
//     });
//   }
// });

// module.exports = router;


// routes/files.js
const express = require('express');
const router = express.Router();
const { generateRendicionCIG, downloadFile, listFiles } = require('../controllers/filesController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(verifyToken);

/**
 * POST /api/files/generate-rendicion
 * Generar archivo de Rendición de Pagos CIG
 */
router.post('/generate-rendicion', generateRendicionCIG);

/**
 * GET /api/files
 * Listar archivos generados
 */
router.get('/', listFiles);

/**
 * GET /api/files/download/:filename
 * Descargar archivo específico
 */
router.get('/download/:filename', downloadFile);

module.exports = router;