const { verifyToken } = require('../utils/jwt');
const { findUserById } = require('../utils/userStore');

/**
 * Reusable JWT authentication middleware
 * Verifies token, identifies user, and attaches to req.user
 */
const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access denied. Authentication token required.',
        status: 401
      }
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'The user belonging to this token no longer exists.',
          status: 401
        }
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        message: err.name === 'TokenExpiredError'
          ? 'Token has expired. Please log in again.'
          : 'Invalid authentication token.',
        status: 401
      }
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user to req.user if a valid token is provided, otherwise continues anonymously
 */
const optionalAuth = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (err) { // eslint-disable-line no-unused-vars
    // Ignore invalid token in optional auth
  }

  next();
};

/**
 * Restrict access to administrators only
 * Must be preceded by `protect` middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access denied. Authentication required.',
        status: 401
      }
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access forbidden. Administrator privileges required.',
        status: 403
      }
    });
  }

  next();
};

module.exports = {
  protect,
  optionalAuth,
  requireAdmin
};
