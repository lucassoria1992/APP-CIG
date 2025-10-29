const mongoose = require('mongoose');

const generatedFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  lote_id: {
    type: String,
    required: true,
    index: true
  },
  filepath: {
    type: String,
    required: true
  },
  total_records: {
    type: Number,
    required: true,
    min: 0
  },
  total_importe: {
    type: Number,
    required: true,
    min: 0
  },
  fecha_generacion: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true,
    index: true
  },
  observaciones: {
    type: String,
    trim: true
  },
  validado: {
    type: Boolean,
    default: true
  },
  errores: [{
    linea: Number,
    descripcion: String
  }]
});

// Índices
generatedFileSchema.index({ user: 1, fecha_generacion: -1 });
generatedFileSchema.index({ lote_id: 1 });

module.exports = mongoose.model('GeneratedFile', generatedFileSchema);
