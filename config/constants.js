/**
 * Global constants used across the application
 */

module.exports = {
  // Server Configuration
  DEFAULT_PORT: 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // API Response Messages
  MESSAGES: {
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product stock updated successfully',
    PRODUCT_FETCHED: 'Products retrieved successfully',
    PRODUCT_NOT_FOUND: 'Product not found',
    ORDER_CREATED: 'Order created successfully',
    ORDER_UPDATED: 'Order status updated successfully',
    ORDER_FETCHED: 'Orders retrieved successfully',
    ORDER_NOT_FOUND: 'Order not found',
    INSUFFICIENT_STOCK: 'Insufficient stock for one or more products',
    MISSING_REQUIRED_FIELDS: 'Missing required fields',
    INVALID_INPUT: 'Invalid input',
    INTERNAL_ERROR: 'Internal server error',
    ROUTE_NOT_FOUND: 'Route not found',
  },

  // Database Constraints
  DB_CONSTRAINTS: {
    PRODUCT_NAME_MAX_LENGTH: 255,
    CATEGORY_MAX_LENGTH: 100,
    PRICE_MIN: 0,
    STOCK_MIN: 0,
  },

  // API Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  },

  // Validation Rules
  VALIDATION: {
    PRODUCT_NAME_REQUIRED: true,
    PRICE_REQUIRED: true,
    PRICE_POSITIVE: true,
    CATEGORY_REQUIRED: true,
    STOCK_REQUIRED: true,
    STOCK_NON_NEGATIVE: true,
  },
};
