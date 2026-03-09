const { HTTP_STATUS, MESSAGES } = require('../config/constants');

/**
 * Validation middleware for request validation
 */

/**
 * Validate JSON body is not empty
 */
const validateRequestBody = (req, res, next) => {
  if (
    !req.body ||
    (typeof req.body === 'object' && Object.keys(req.body).length === 0)
  ) {
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Request body cannot be empty',
      });
    }
  }
  next();
};

/**
 * Validate Content-Type is application/json for POST/PUT requests
 */
const validateContentType = (req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Content-Type must be application/json',
      });
    }
  }
  next();
};

/**
 * Validate product data for creation
 */
const validateProductCreation = (req, res, next) => {
  const { product_name, price, category, stock } = req.body;
  const errors = [];

  if (!product_name) errors.push('product_name is required');
  if (!price && price !== 0) errors.push('price is required');
  if (!category) errors.push('category is required');
  if (stock === undefined && stock !== 0) errors.push('stock is required');

  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: MESSAGES.MISSING_REQUIRED_FIELDS,
      details: errors,
    });
  }

  next();
};

/**
 * Validate product stock update
 */
const validateStockUpdate = (req, res, next) => {
  const { stock } = req.body;

  if (stock === undefined || stock === null) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: MESSAGES.MISSING_REQUIRED_FIELDS,
      details: ['stock is required'],
    });
  }

  next();
};

/**
 * Validate order creation
 */
const validateOrderCreation = (req, res, next) => {
  const { customer_name, customer_email, customer_phone, delivery_address, items } = req.body;
  const errors = [];

  if (!customer_name) errors.push('customer_name is required');
  if (!customer_email) errors.push('customer_email is required');
  if (!delivery_address) errors.push('delivery_address is required');
  if (!items || !Array.isArray(items) || items.length === 0) errors.push('at least one item is required');

  if (errors.length > 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: MESSAGES.MISSING_REQUIRED_FIELDS,
      details: errors,
    });
  }

  next();
};

/**
 * Validate order status update
 */
const validateOrderStatusUpdate = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: MESSAGES.MISSING_REQUIRED_FIELDS,
      details: ['status is required'],
    });
  }

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Invalid status',
      details: [`status must be one of: ${validStatuses.join(', ')}`],
    });
  }

  next();
};

module.exports = {
  validateRequestBody,
  validateContentType,
  validateProductCreation,
  validateStockUpdate,
  validateOrderCreation,
  validateOrderStatusUpdate,
};
