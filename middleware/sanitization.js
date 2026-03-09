/**
 * Input Sanitization Middleware
 * Sanitizes all request inputs to prevent injection attacks
 */

const {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  validateLength,
} = require('../utils/security');
const { ValidationError } = require('../utils/errors');

/**
 * Sanitize request body data
 * Cleans potentially dangerous strings and normalizes inputs
 */
const sanitizeBody = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      const sanitizedBody = {};

      // Sanitize each property
      for (const [key, value] of Object.entries(req.body)) {
        if (typeof value === 'string') {
          // Sanitize string values
          sanitizedBody[key] = sanitizeString(value);
        } else if (Array.isArray(value)) {
          // Keep arrays as-is (will be validated separately)
          sanitizedBody[key] = value;
        } else if (typeof value === 'number') {
          // Validate numbers are finite
          if (!isFinite(value)) {
            throw new ValidationError(`Invalid number for field: ${key}`);
          }
          sanitizedBody[key] = value;
        } else {
          sanitizedBody[key] = value;
        }
      }

      req.body = sanitizedBody;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Sanitize query parameters
 */
const sanitizeQuery = (req, res, next) => {
  try {
    if (req.query && typeof req.query === 'object') {
      const sanitizedQuery = {};

      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          sanitizedQuery[key] = sanitizeString(value);
        } else {
          sanitizedQuery[key] = value;
        }
      }

      req.query = sanitizedQuery;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Sanitize route parameters
 */
const sanitizeParams = (req, res, next) => {
  try {
    if (req.params && typeof req.params === 'object') {
      const sanitizedParams = {};

      for (const [key, value] of Object.entries(req.params)) {
        if (typeof value === 'string') {
          sanitizedParams[key] = sanitizeString(value);
        } else {
          sanitizedParams[key] = value;
        }
      }

      req.params = sanitizedParams;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Sanitize email fields in request body
 */
const sanitizeEmailFields = (req, res, next) => {
  try {
    if (req.body) {
      // Sanitize customer_email if present
      if (req.body.customer_email) {
        req.body.customer_email = sanitizeEmail(req.body.customer_email);
      }

      // Sanitize email query param if present
      if (req.params && req.params.email) {
        req.params.email = sanitizeEmail(req.params.email);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Sanitize phone numbers in request body
 */
const sanitizePhoneFields = (req, res, next) => {
  try {
    if (req.body && req.body.customer_phone) {
      req.body.customer_phone = sanitizePhone(req.body.customer_phone);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validate request size to prevent DoS attacks
 * @param {number} maxSize - Maximum size in bytes (default 10KB)
 */
const validateRequestSize = (maxSize = 10240) => {
  return (req, res, next) => {
    let size = 0;

    req.on('data', (chunk) => {
      size += chunk.length;

      if (size > maxSize) {
        req.connection.destroy();
        return res.status(413).json({
          success: false,
          error: 'Payload too large',
        });
      }
    });

    next();
  };
};

module.exports = {
  sanitizeBody,
  sanitizeQuery,
  sanitizeParams,
  sanitizeEmailFields,
  sanitizePhoneFields,
  validateRequestSize,
};
