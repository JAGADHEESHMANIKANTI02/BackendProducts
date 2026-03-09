const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const {
  validateOrderCreation,
  validateOrderStatusUpdate,
} = require('../middleware/validation');

/**
 * Order Routes
 * All routes are prefixed with /api/orders
 */

/**
 * POST /api/orders
 * Create a new order with customer details and products
 * Body: {
 *   customer_name: string,
 *   customer_email: string,
 *   customer_phone: string (optional),
 *   delivery_address: string,
 *   items: [{ product_id: number, quantity: number }]
 * }
 */
router.post('/', validateOrderCreation, orderController.createOrder);

/**
 * GET /api/orders
 * Retrieve all orders with their items
 */
router.get('/', orderController.getAllOrders);

/**
 * GET /api/orders/customer/:email
 * Get orders by customer email
 * Note: This must be defined before /:id to prevent :email being treated as :id
 */
router.get('/customer/:email', orderController.getOrdersByCustomer);

/**
 * GET /api/orders/:id
 * Get a single order by ID with its items
 */
router.get('/:id', orderController.getOrderById);

/**
 * PUT /api/orders/:id/status
 * Update order status
 * Body: { status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' }
 */
router.put('/:id/status', validateOrderStatusUpdate, orderController.updateOrderStatus);

module.exports = router;
