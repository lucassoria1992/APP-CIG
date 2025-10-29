// models/Lote.js
const mongoose = require('mongoose');

const loteSchema = new mongoose.Schema({
    numero_archivo: {
        type: Number,
        default: 1
    },
    estado: {
        type: String,
        enum: ['abierto', 'cerrado'],
        default: 'abierto'
    },
    closed_at: {
        type: Date
    },
    total_registros: {
        type: Number,
        default: 0
    },
    total_importe: {
        type: Number,
        default: 0
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

const Lote = mongoose.model('Lote', loteSchema);
module.exports = Lote;
module.exports.findById = (id) => Lote.findById(id);
module.exports.findByIdAndUpdate = (id, update) => Lote.findByIdAndUpdate(id, update);
