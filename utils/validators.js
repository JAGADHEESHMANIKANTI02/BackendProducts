const { VALIDATION } = require('../config/constants');

/**
 * Validation utility functions for product data
 */

/**
 * Validate product creation/update data
 * @param {Object} data - Product data to validate
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
const validateProductData = (data) => {
  const errors = [];

  // Validate product_name
  if (VALIDATION.PRODUCT_NAME_REQUIRED) {
    if (!data.product_name) {
      errors.push('product_name is required');
    } else if (typeof data.product_name !== 'string') {
      errors.push('product_name must be a string');
    } else if (data.product_name.trim().length === 0) {
      errors.push('product_name cannot be empty');
    } else if (data.product_name.length > 255) {
      errors.push('product_name cannot exceed 255 characters');
    }
  }

  // Validate price
  if (VALIDATION.PRICE_REQUIRED) {
    if (data.price === undefined || data.price === null) {
      errors.push('price is required');
    } else if (isNaN(data.price)) {
      errors.push('price must be a number');
    } else if (VALIDATION.PRICE_POSITIVE && Number(data.price) <= 0) {
      errors.push('price must be greater than 0');
    }
  }

  // Validate category
  if (VALIDATION.CATEGORY_REQUIRED) {
    if (!data.category) {
      errors.push('category is required');
    } else if (typeof data.category !== 'string') {
      errors.push('category must be a string');
    } else if (data.category.trim().length === 0) {
      errors.push('category cannot be empty');
    } else if (data.category.length > 100) {
      errors.push('category cannot exceed 100 characters');
    }
  }

  // Validate stock
  if (VALIDATION.STOCK_REQUIRED) {
    if (data.stock === undefined || data.stock === null) {
      errors.push('stock is required');
    } else if (isNaN(data.stock)) {
      errors.push('stock must be a number');
    } else if (VALIDATION.STOCK_NON_NEGATIVE && Number(data.stock) < 0) {
      errors.push('stock cannot be negative');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validate stock update data
 * @param {Object} data - Stock data to validate
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
const validateStockData = (data) => {
  const errors = [];

  if (data.stock === undefined || data.stock === null) {
    errors.push('stock is required');
  } else if (isNaN(data.stock)) {
    errors.push('stock must be a number');
  } else if (Number(data.stock) < 0) {
    errors.push('stock cannot be negative');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validate product ID
 * @param {string|number} id - Product ID to validate
 * @returns {boolean} - True if valid
 */
const validateProductId = (id) => {
  return !isNaN(id) && Number(id) > 0;
};

/**
 * Validate order data
 * @param {Object} data - Order data to validate
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
const validateOrderData = (data) => {
  const errors = [];

  // Validate customer_name
  if (!data.customer_name) {
    errors.push('customer_name is required');
  } else if (typeof data.customer_name !== 'string') {
    errors.push('customer_name must be a string');
  } else if (data.customer_name.trim().length === 0) {
    errors.push('customer_name cannot be empty');
  } else if (data.customer_name.length > 255) {
    errors.push('customer_name cannot exceed 255 characters');
  }

  // Validate customer_email
  if (!data.customer_email) {
    errors.push('customer_email is required');
  } else if (!isValidEmail(data.customer_email)) {
    errors.push('customer_email must be a valid email address');
  }

  // Validate customer_phone (optional but if provided, must be valid)
  if (data.customer_phone && !isValidPhone(data.customer_phone)) {
    errors.push('customer_phone must be a valid phone number');
  }

  // Validate delivery_address
  if (!data.delivery_address) {
    errors.push('delivery_address is required');
  } else if (typeof data.delivery_address !== 'string') {
    errors.push('delivery_address must be a string');
  } else if (data.delivery_address.trim().length === 0) {
    errors.push('delivery_address cannot be empty');
  } else if (data.delivery_address.length > 500) {
    errors.push('delivery_address cannot exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validate order items
 * @param {Array} items - Array of order items to validate
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
const validateOrderItems = (items) => {
  const errors = [];

  // Check if items array exists and is not empty
  if (!items || !Array.isArray(items)) {
    errors.push('items must be an array');
    return { isValid: false, errors };
  }

  if (items.length === 0) {
    errors.push('at least one item is required');
    return { isValid: false, errors };
  }

  // Validate each item
  items.forEach((item, index) => {
    // Validate product_id
    if (!item.product_id && item.product_id !== 0) {
      errors.push(`items[${index}].product_id is required`);
    } else if (isNaN(item.product_id) || Number(item.product_id) <= 0) {
      errors.push(`items[${index}].product_id must be a positive number`);
    }

    // Validate quantity
    if (!item.quantity && item.quantity !== 0) {
      errors.push(`items[${index}].quantity is required`);
    } else if (isNaN(item.quantity)) {
      errors.push(`items[${index}].quantity must be a number`);
    } else if (Number(item.quantity) <= 0) {
      errors.push(`items[${index}].quantity must be greater than 0`);
    } else if (!Number.isInteger(Number(item.quantity))) {
      errors.push(`items[${index}].quantity must be an integer`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Validate order status
 * @param {string} status - Order status to validate
 * @returns {Object} - { isValid: boolean, error?: string }
 */
const validateOrderStatus = (status) => {
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!status) {
    return {
      isValid: false,
      error: 'status is required',
    };
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    return {
      isValid: false,
      error: `status must be one of: ${validStatuses.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Helper: Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Helper: Validate phone format (simple validation)
 * @param {string} phone - Phone to validate
 * @returns {boolean} - True if valid phone
 */
const isValidPhone = (phone) => {
  // Simple validation: at least 7 digits
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

module.exports = {
  validateProductData,
  validateStockData,
  validateProductId,
  validateOrderData,
  validateOrderItems,
  validateOrderStatus,
};
