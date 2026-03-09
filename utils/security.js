/**
 * Security Utilities - Sanitization and XSS prevention
 */

/**
 * Sanitize string input to prevent injection attacks and XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  // Trim whitespace
  let sanitized = input.trim();

  // Remove potentially dangerous characters but allow common ones
  // This doesn't remove valid email or address characters
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]+>/g, '');

  return sanitized;
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize and validate
 * @returns {string} - Sanitized email (lowercase)
 */
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') {
    return '';
  }

  // Remove spaces, convert to lowercase, trim
  const sanitized = email.trim().toLowerCase();

  // Check against email regex
  const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }

  return sanitized;
};

/**
 * Sanitize phone number
 * @param {string} phone - Phone to sanitize
 * @returns {string} - Sanitized phone
 */
const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-alphanumeric characters except +, -, (, )
  const sanitized = phone.replace(/[^0-9+\-()]/g, '').trim();

  // Ensure it has at least 7 characters
  if (sanitized.replace(/\D/g, '').length < 7) {
    throw new Error('Phone number must have at least 7 digits');
  }

  return sanitized;
};

/**
 * Sanitize numeric input
 * @param {number|string} input - Input to convert to number
 * @returns {number} - Safe number
 */
const sanitizeNumber = (input) => {
  const num = Number(input);

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number format');
  }

  return num;
};

/**
 * Sanitize and validate array of items
 * @param {any} items - Items to validate
 * @returns {Array} - Validated items array
 */
const sanitizeItemsArray = (items) => {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  if (items.length === 0) {
    throw new Error('Items array cannot be empty');
  }

  // Validate each item has required properties
  items.forEach((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Item at index ${index} must be an object`);
    }

    if (!item.hasOwnProperty('product_id') || !item.hasOwnProperty('quantity')) {
      throw new Error(`Item at index ${index} must have product_id and quantity`);
    }

    // Ensure product_id and quantity are numbers
    if (typeof item.product_id !== 'number' && !Number.isInteger(Number(item.product_id))) {
      throw new Error(`Item at index ${index}: product_id must be a number`);
    }

    if (typeof item.quantity !== 'number' && !Number.isInteger(Number(item.quantity))) {
      throw new Error(`Item at index ${index}: quantity must be an integer`);
    }
  });

  return items;
};

/**
 * Escape SQL-like characters in strings (additional layer)
 * Note: We use parameterized queries primarily, this is extra protection
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
const escapeSQLCharacters = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  // Replace single quotes with two single quotes (SQL escape)
  // This is backup protection - primary protection is parameterized queries
  return str.replace(/'/g, "''");
};

/**
 * Validate input length to prevent buffer overflow attacks
 * @param {string} input - Input to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Field name for error message
 */
const validateLength = (input, maxLength, fieldName) => {
  if (typeof input === 'string' && input.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }
};

/**
 * Sanitize query parameters
 * @param {any} param - Query parameter to sanitize
 * @returns {string} - Sanitized parameter
 */
const sanitizeQueryParam = (param) => {
  if (typeof param !== 'string') {
    return '';
  }

  // Remove special characters that could be used in injection
  return param.trim().replace(/[^a-zA-Z0-9._%-@]/g, '');
};

module.exports = {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeItemsArray,
  escapeSQLCharacters,
  validateLength,
  sanitizeQueryParam,
};
