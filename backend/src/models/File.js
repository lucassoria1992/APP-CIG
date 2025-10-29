// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    lote_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lote',
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    filepath: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['rendicion', 'deuda', 'cheques'],
        default: 'rendicion'
    },
    total_registros: {
        type: Number,
        default: 0
    },
    total_importe: {
        type: Number,
        default: 0
    },
    estado: {
        type: String,
        enum: ['generado', 'enviado', 'procesado', 'error'],
        default: 'generado'
    },
    observaciones: {
        type: String,
        default: ''
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para mejorar rendimiento de consultas
fileSchema.index({ lote_id: 1 });
fileSchema.index({ tipo: 1 });
fileSchema.index({ estado: 1 });
fileSchema.index({ created_at: -1 });

module.exports = mongoose.model('File', fileSchema);