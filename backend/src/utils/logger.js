const { createLogger, format: _format, transports: _transports } = require('winston');
const { join } = require('path');

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level: logLevel,
  format: _format.combine(
    _format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    _format.errors({ stack: true }),
    _format.splat(),
    _format.json()
  ),
  defaultMeta: { service: 'cig-backend' },
  transports: [
    new _transports.File({ 
      filename: join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new _transports.File({ 
      filename: join(__dirname, '../../logs/combined.log') 
    })
  ]
});

// En desarrollo, también mostrar en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new _transports.Console({
    format: _format.combine(
      _format.colorize(),
      _format.simple()
    )
  }));
}

// Stream para Morgan
logger.stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = logger;
