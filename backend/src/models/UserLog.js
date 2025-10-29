const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'CREATE_LOTE',
      'ADD_RECORD',
      'EDIT_RECORD',
      'DELETE_RECORD',
      'GENERATE_FILE',
      'DOWNLOAD_FILE',
      'CREATE_CLIENT',
      'EDIT_CLIENT',
      'DELETE_CLIENT',
      'CREATE_USER',
      'EDIT_USER',
      'DELETE_USER'
    ]
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'error', 'warning'],
    default: 'success'
  },
  error_message: {
    type: String
  }
});

// Índices para consultas rápidas
userLogSchema.index({ user: 1, timestamp: -1 });
userLogSchema.index({ action: 1, timestamp: -1 });
userLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('UserLog', userLogSchema);
