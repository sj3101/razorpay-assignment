const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
