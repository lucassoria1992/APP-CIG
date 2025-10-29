const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: true, 
      message: 'Acceso denegado. No se proporcionó token.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (_error) {
    return res.status(401).json({ 
      error: true, 
      message: 'Token inválido o expirado.' 
    });
  }
};

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: true, 
        message: 'Usuario no autenticado.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: true, 
        message: 'No tienes permisos para realizar esta acción.' 
      });
    }

    next();
  };
};

module.exports = { verifyToken, verifyRole };
