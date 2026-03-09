/**
 * Custom Error Classes for better error handling
 */

/**
 * Application Error - Base error class
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error - 400 Bad Request
 */
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error - 404
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error - 409 (e.g., duplicate entry, stock insufficient)
 */
class ConflictError extends AppError {
  constructor(message = 'Conflict with existing data') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Unauthorized Error - 401
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error - 403
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Database Error - 500
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

/**
 * Business Logic Error - 422 Unprocessable Entity
 */
class BusinessLogicError extends AppError {
  constructor(message = 'Business logic error', details = []) {
    super(message, 422);
    this.details = details;
    this.name = 'BusinessLogicError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  DatabaseError,
  BusinessLogicError,
};
