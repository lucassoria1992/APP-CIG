require('dotenv').config();
const express = require('express');
const { json, urlencoded } = express;
const { connect } = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');
const _stream = logger.stream;
const info = logger.info;
const _error = logger.error;

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('combined', { stream: _stream }));

// Conexión a MongoDB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  info('✅ Conectado a MongoDB');
  console.log('✅ Conectado a MongoDB');
})
.catch(err => {
  _error('❌ Error conectando a MongoDB:', err);
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/lotes', require('./routes/lotes'));
app.use('/api/records', require('./routes/records'));
app.use('/api/files', require('./routes/files'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/logs', require('./routes/logs'));


// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Manejo de errores
app.use((err, req, res, _next) => {
  _error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  info(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
