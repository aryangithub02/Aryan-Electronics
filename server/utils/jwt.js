const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  return process.env.JWT_SECRET || 'aryan_electronics_default_jwt_secret_phase2_fallback';
};

const getJwtExpiresIn = () => {
  return process.env.JWT_EXPIRES_IN || '30d';
};

/**
 * Generate a signed JWT token for a given user ID
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn()
  });
};

/**
 * Verify a given JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = {
  generateToken,
  verifyToken
};
