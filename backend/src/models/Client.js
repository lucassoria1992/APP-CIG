const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  cuit: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: 'El CUIT debe tener 11 dígitos'
    }
  },
  razon_social: {
    type: String,
    trim: true
  },
  domicilio: {
    type: String,
    trim: true
  },
  localidad: {
    type: String,
    trim: true
  },
  provincia: {
    type: String,
    trim: true
  },
  codigo_postal: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  frecuencia_uso: {
    type: Number,
    default: 1
  },
  ultimo_uso: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    required: true
  }
});

// Índices para búsqueda rápida
clientSchema.index({ cuit: 1 });
clientSchema.index({ nombre: 'text', razon_social: 'text' });

module.exports = mongoose.model('Client', clientSchema);
