const { HTTP_STATUS, MESSAGES } = require('../config/constants');

/**
 * Global error handling middleware
 * Must be the last middleware in the app
 */

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error details (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  } else {
    // Log minimal info in production
    console.error('[ERROR]', err.name, '-', err.message);
  }

  // Default error
  let statusCode = HTTP_STATUS.INTERNAL_ERROR;
  let errorMessage = MESSAGES.INTERNAL_ERROR;
  let errorName = 'InternalServerError';
  let details = null;

  // Handle custom AppError instances
  if (err.isOperational) {
    statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
    errorMessage = err.message;
    errorName = err.name;

    // Include details for validation errors
    if (err.details && Array.isArray(err.details)) {
      details = err.details;
    }

    // In development, show more info
    if (process.env.NODE_ENV === 'development' && err.originalError) {
      details = err.originalError.message;
    }
  }
  // Handle specific error types
  else if (err.message && err.message.includes('Database error')) {
    statusCode = HTTP_STATUS.INTERNAL_ERROR;
    errorMessage = 'Database operation failed';
    errorName = 'DatabaseError';

    if (process.env.NODE_ENV === 'development') {
      details = err.message;
    }
  } else if (err.message && err.message.includes('Insufficient stock')) {
    statusCode = 409; // Conflict
    errorMessage = err.message;
    errorName = 'ConflictError';
  } else if (err.message && err.message.includes('not found')) {
    statusCode = HTTP_STATUS.NOT_FOUND;
    errorMessage = err.message;
    errorName = 'NotFoundError';
  } else if (err.message && err.message.includes('Validation')) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorMessage = MESSAGES.INVALID_INPUT;
    errorName = 'ValidationError';
    details = err.message;
  } else if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    statusCode = 503;
    errorMessage = 'Database connection lost';
    errorName = 'ServiceUnavailable';
  } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    statusCode = 503;
    errorMessage = 'Database fatal error';
    errorName = 'ServiceUnavailable';
  } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_PARSER_DESTROYED') {
    statusCode = 503;
    errorMessage = 'Database connection failed';
    errorName = 'ServiceUnavailable';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }

  // Never expose sensitive error info in production
  if (process.env.NODE_ENV !== 'development' && !err.isOperational) {
    errorMessage = MESSAGES.INTERNAL_ERROR;
    details = null;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    errorName,
    ...(details && { details }),
  });
};

/**
 * 404 Not Found middleware
 * Should be placed after all other routes
 */
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: MESSAGES.ROUTE_NOT_FOUND,
    errorName: 'NotFoundError',
    path: req.originalUrl,
    method: req.method,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
