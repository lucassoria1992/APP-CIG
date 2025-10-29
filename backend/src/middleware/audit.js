const UserLog = require('../models/UserLog');
const logger = require('../utils/logger').default;

const logAction = async (user, action, details = {}, status = 'success', errorMessage = null) => {
  try {
    const log = new UserLog({
      user,
      action,
      details,
      status,
      error_message: errorMessage
    });
    
    await log.save();
    logger.info(`[AUDIT] ${user} - ${action}`, details);
  } catch (error) {
    logger.error('Error al guardar log de auditoría:', error);
  }
};

const auditMiddleware = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      res.send = originalSend;
      
      const username = req.user?.username || 'anonymous';
      const statusCode = res.statusCode;
      const status = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
      
      const details = {
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        params: req.params,
        query: req.query,
        statusCode
      };
      
      logAction(username, action, details, status).catch(err => {
        logger.error('Error en auditMiddleware:', err);
      });
      
      return res.send(data);
    };
    
    next();
  };
};

module.exports = { logAction, auditMiddleware };
