const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const { MESSAGES } = require('../config/constants');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and extracts admin information
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

/**
 * Verify JWT token and attach admin info to request
 */
const authenticateJWT = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(new UnauthorizedError('No authorization token provided'));
    }

    // Token format: Bearer <token>
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7)
      : authHeader;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach admin info to request
    req.admin = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token has expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(new UnauthorizedError('Authentication failed'));
  }
};

/**
 * Check if admin has specific role
 * @param {string} requiredRole - Role to check (admin, super_admin)
 */
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new UnauthorizedError('Admin information not found'));
    }

    if (req.admin.role !== requiredRole && req.admin.role !== 'super_admin') {
      return next(new UnauthorizedError(
        `This action requires ${requiredRole} role`
      ));
    }

    next();
  };
};

/**
 * Generate JWT token for admin
 * @param {Object} adminData - Admin information
 * @returns {string} JWT token
 */
const generateToken = (adminData) => {
  return jwt.sign(
    {
      admin_id: adminData.admin_id,
      username: adminData.username,
      email: adminData.email,
      role: adminData.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify only (without error handling for custom logic)
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateJWT,
  authorizeRole,
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRY,
};
