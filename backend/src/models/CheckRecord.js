const mongoose = require('mongoose');


const checkRecordSchema = new mongoose.Schema({
  lote_id: { type: String, required: true, index: true },
  cliente: { type: String, required: true, trim: true },
  // CIG: tipoIdentificacion (CUIT, DNI, etc)
  tipoIdentificacion: { type: String, default: 'CUIT', trim: true },
  // CIG: identificacionCliente (15)
  identificacionCliente: { type: String, required: true, trim: true },
  // CIG: cuit (18)
  cuit: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) { return /^\d{11,18}$/.test(v); },
      message: 'El CUIT debe tener entre 11 y 18 dígitos'
    }
  },
  // CIG: tipoDocumento (2)
  tipoDocumento: { type: String, default: 'PC', trim: true },
  // CIG: idDocumento (25)
  idDocumento: { type: String, trim: true },
  // CIG: idInterna (30)
  idInterna: { type: String, trim: true },
  // CIG: division (6)
  division: { type: String, trim: true },
  // CIG: codMoneda (2)
  codMoneda: { type: String, default: '00', trim: true },
  // CIG: fechaPago (8)
  fechaPago: { type: Date, required: true },
  // CIG: sucursalPago (3)
  sucursalPago: { type: String, default: '101', trim: true },
  // CIG: formaPago (1)
  formaPago: { type: String, default: '2', trim: true },
  // CIG: idPago (9)
  idPago: { type: String, trim: true },
  // CIG: pagoParcial (1)
  pagoParcial: { type: String, default: 'N', trim: true },
  // CIG: importePago (15)
  importePago: { type: Number, required: true, min: 0 },
  // CIG: nroCheque (9)
  nroCheque: { type: String, trim: true },
  // CIG: fechaAcred (8)
  fechaAcred: { type: Date },
  // CIG: importeCheque (15)
  importeCheque: { type: Number, min: 0 },
  // CIG: codBanco (3)
  codBanco: { type: String, default: '007', trim: true },
  // CIG: marcaInformado (1)
  marcaInformado: { type: String, default: 'N', trim: true },
  // CIG: marcaAnulado (1)
  marcaAnulado: { type: String, default: 'N', trim: true },
  // CIG: docPago (25)
  docPago: { type: String, trim: true },
  // CIG: tipoCanal (2)
  tipoCanal: { type: String, default: '07', trim: true },
  // CIG: descCanal (14)
  descCanal: { type: String, default: 'T.AUTOSERV.C/R', trim: true },
  // CIG: boletaCash (9)
  boletaCash: { type: String, default: '000000000', trim: true },
  // Estado y metadatos
  estado: { type: String, enum: ['pendiente', 'exportado', 'anulado'], default: 'pendiente', index: true },
  observaciones: { type: String, trim: true },
  created_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  exported_at: { type: Date },
  exported_by: { type: String }
});

// Índices
checkRecordSchema.index({ lote_id: 1, estado: 1 });
checkRecordSchema.index({ created_by: 1, created_at: -1 });

module.exports = mongoose.model('CheckRecord', checkRecordSchema);
