const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {
  validateProductCreation,
  validateStockUpdate,
} = require('../middleware/validation');
const { authenticateJWT, authorizeRole } = require('../middleware/jwtAuth');

/**
 * Product Routes
 * All routes are prefixed with /api/products
 * Admin routes (POST, PUT, DELETE) require JWT authentication
 */

/**
 * GET /api/products
 * Retrieve all products
 * Public endpoint
 */
router.get('/', productController.getAllProducts);

/**
 * POST /api/products
 * Create a new product
 * Admin only - Requires valid JWT token
 */
router.post('/', authenticateJWT, validateProductCreation, productController.createProduct);

/**
 * GET /api/products/category/:category
 * Get products by category
 * Note: This must be defined before /:id route to prevent :category being treated as :id
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', productController.getProductById);

/**
 * PUT /api/products/:id/stock
 * Update product stock
 * Admin only - Requires valid JWT token
 */
router.put('/:id/stock', authenticateJWT, validateStockUpdate, productController.updateProductStock);

/**
 * DELETE /api/products/:id
 * Delete a product
 * Admin only - Requires valid JWT token
 */
router.delete('/:id', authenticateJWT, productController.deleteProduct);

module.exports = router;
