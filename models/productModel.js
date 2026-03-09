const pool = require('../config/database');

/**
 * Product Model - Handles all database operations for products
 */

/**
 * Get all products from the database
 * @returns {Promise<Array>} - Array of products
 */
const getAllProducts = async () => {
  try {
    const query = 'SELECT * FROM products ORDER BY product_id DESC';
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get a single product by ID
 * @param {number} productId - The product ID
 * @returns {Promise<Object|null>} - Product object or null if not found
 */
const getProductById = async (productId) => {
  try {
    const query = 'SELECT * FROM products WHERE product_id = $1';
    const result = await pool.query(query, [productId]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Create a new product
 * @param {Object} productData - { product_name, price, category, stock }
 * @returns {Promise<Object>} - Created product object
 */
const createProduct = async (productData) => {
  const { product_name, price, category, stock } = productData;

  try {
    const query = `
      INSERT INTO products (product_name, price, category, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [product_name, price, category, stock];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Update product stock by ID
 * @param {number} productId - The product ID
 * @param {number} stock - New stock value
 * @returns {Promise<Object|null>} - Updated product object or null if not found
 */
const updateProductStock = async (productId, stock) => {
  try {
    const query = `
      UPDATE products
      SET stock = $1, updated_at = NOW()
      WHERE product_id = $2
      RETURNING *;
    `;
    const values = [stock, productId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Delete a product by ID
 * @param {number} productId - The product ID
 * @returns {Promise<Boolean>} - True if product was deleted, false if not found
 */
const deleteProduct = async (productId) => {
  try {
    const query = 'DELETE FROM products WHERE product_id = $1 RETURNING *';
    const result = await pool.query(query, [productId]);
    return result.rows.length > 0;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Promise<Array>} - Array of products in the category
 */
const getProductsByCategory = async (category) => {
  try {
    const query = 'SELECT * FROM products WHERE category = $1 ORDER BY product_id DESC';
    const result = await pool.query(query, [category]);
    return result.rows;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductStock,
  deleteProduct,
  getProductsByCategory,
};
