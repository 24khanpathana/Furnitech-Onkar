const User = require('../models/user.model');
const { verifyToken } = require('../utils/auth');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required.' });
    }

    const token = header.slice(7);
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token user.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have access to this resource.' });
  }

  next();
};

module.exports = {
  authMiddleware,
  requireRole,
};
