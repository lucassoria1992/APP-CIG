// filesController.js - Controlador para generar archivos CIG
const fs = require('fs').promises;
const { resolve, join } = require('path');
const { generateRendicionFile } = require('../utils/cigGenerator');
const { find, updateMany } = require('../models/CheckRecord');
const Lote = require('../models/Lote');
const { findById, findByIdAndUpdate } = require('../models/Lote');
const File = require('../models/File');
const { findOne, find: _find } = require('../models/File');

/**
 * Generar archivo de Rendición de Pagos CIG
 * POST /api/files/generate-rendicion
 */
const generateRendicionCIG = async (req, res) => {
    try {
        const { lote_id, numeroConvenio, observaciones } = req.body;

        if (!lote_id) {
            return res.status(400).json({
                error: true,
                message: 'El ID del lote es requerido'
            });
        }

        // Obtener lote
        const lote = await findById(lote_id);
        if (!lote) {
            return res.status(404).json({
                error: true,
                message: 'Lote no encontrado'
            });
        }

        // Obtener registros del lote
        const records = await find({
            lote_id: lote_id,
            estado: { $ne: 'eliminado' }
        }).sort({ created_at: 1 });

        if (!records || records.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'No hay registros en el lote para generar el archivo'
            });
        }

        // Preparar datos para el generador CIG
        const cigRecords = records.map(record => ({
            // Identificación del cliente
            tipoIdentificacion: record.tipoIdentificacion || 'CUIT',
            identificacionCliente: record.identificacionCliente || record.cuit || '',
            cuit: record.cuit || '',

            // Documento
            tipoDocumento: record.tipoDocumento || 'PC',
            idDocumento: record.idDocumento || '',
            idInterna: record.idInterna || '',
            division: record.division || '',

            // Moneda y fecha
            codMoneda: record.codMoneda || '00',
            fechaPago: record.fechaPago || record.fecha_vto || new Date(),

            // Sucursal y forma de pago
            sucursalPago: record.sucursalPago || '101',
            formaPago: record.formaPago || '2',
            idPago: record.idPago || '',
            pagoParcial: record.pagoParcial || 'N',

            // Importes
            importePago: record.importePago || record.importe || 0,
            importeCheque: record.importeCheque || record.importe || 0,

            // Datos del cheque (si aplica)
            nroCheque: record.nroCheque || '',
            fechaAcred: record.fechaAcred || record.fechaPago || record.fecha_vto || new Date(),
            codBanco: record.codBanco || '000',

            // Marcas
            marcaInformado: record.marcaInformado || 'N',
            marcaAnulado: record.marcaAnulado || 'N',

            // Otros datos
            docPago: record.docPago || '',
            tipoCanal: record.tipoCanal || '07',
            descCanal: record.descCanal || 'T.AUTOSERV.C/R',
            boletaCash: record.boletaCash || '000000000',

            // Cliente (para referencia)
            cliente: record.cliente || ''
        }));

        // Generar archivo CIG
        const options = {
            numeroConvenio: numeroConvenio || '0000002489',
            numeroArchivo: lote.numero_archivo || 1
        };

        const result = generateRendicionFile(cigRecords, options);

        // Crear nombre de archivo
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `RENDICION_${dateStr}_${lote.id}.txt`;

        // Guardar archivo en el sistema
        const filesPath = resolve(process.env.FILES_PATH || './data/exports/cig/');
        await fs.mkdir(filesPath, { recursive: true });

        const filepath = join(filesPath, filename);
        await fs.writeFile(filepath, result.content, 'utf8');

        // Guardar registro del archivo en BD
        const fileRecord = new File({
            lote_id: lote_id,
            filename: filename,
            filepath: filepath,
            tipo: 'rendicion',
            total_registros: result.totalRecords,
            total_importe: result.totalCobrado,
            estado: 'generado',
            observaciones: observaciones || '',
            created_by: req.user?.id || null
        });

        await fileRecord.save();

        // Marcar registros como exportados
        await updateMany(
            { lote_id: lote_id, estado: { $ne: 'eliminado' } },
            { $set: { estado: 'exportado', exported_at: new Date() } }
        );

        // Cerrar lote actual
        await findByIdAndUpdate(lote_id, {
            estado: 'cerrado',
            closed_at: new Date(),
            total_registros: records.length,
            total_importe: result.totalCobrado
        });

        // Crear nuevo lote
        const newLote = new Lote({
            numero_archivo: (lote.numero_archivo || 1) + 1,
            estado: 'abierto',
            created_by: req.user?.id || null
        });

        await newLote.save();

        return res.status(200).json({
            error: false,
            message: 'Archivo de rendición generado exitosamente',
            file: {
                filename: filename,
                filepath: filepath,
                totalRecords: result.totalRecords,
                totalCobrado: result.totalCobrado,
                totalLines: result.totalLines
            },
            lote: {
                cerrado: lote_id,
                nuevo: newLote._id
            }
        });

    } catch (error) {
        console.error('Error al generar archivo de rendición CIG:', error);
        return res.status(500).json({
            error: true,
            message: error.message || 'Error al generar archivo de rendición',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Descargar archivo generado
 * GET /api/files/download/:filename
 */
const downloadFile = async (req, res) => {
    try {
        const { filename } = req.params;

        // Buscar archivo en BD
        const fileRecord = await findOne({ filename: filename });

        if (!fileRecord) {
            return res.status(404).json({
                error: true,
                message: 'Archivo no encontrado'
            });
        }

        // Verificar que el archivo existe en disco
        const exists = await fs.access(fileRecord.filepath)
            .then(() => true)
            .catch(() => false);

        if (!exists) {
            return res.status(404).json({
                error: true,
                message: 'Archivo no encontrado en el servidor'
            });
        }

        // Enviar archivo
        res.download(fileRecord.filepath, filename, (err) => {
            if (err) {
                console.error('Error al descargar archivo:', err);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: true,
                        message: 'Error al descargar archivo'
                    });
                }
            }
        });

    } catch (error) {
        console.error('Error en descarga de archivo:', error);
        return res.status(500).json({
            error: true,
            message: 'Error al descargar archivo'
        });
    }
};

/**
 * Listar archivos generados
 * GET /api/files
 */
const listFiles = async (req, res) => {
    try {
        const { lote_id, tipo, limit = 50 } = req.query;

        const query = {};
        if (lote_id) query.lote_id = lote_id;
        if (tipo) query.tipo = tipo;

        const files = await _find(query)
            .sort({ created_at: -1 })
            .limit(parseInt(limit))
            .populate('lote_id', 'numero_archivo estado');

        return res.status(200).json({
            error: false,
            files: files
        });

    } catch (error) {
        console.error('Error al listar archivos:', error);
        return res.status(500).json({
            error: true,
            message: 'Error al listar archivos'
        });
    }
};

module.exports = {
    generateRendicionCIG,
    downloadFile,
    listFiles
};