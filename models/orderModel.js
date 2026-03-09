const pool = require('../config/database');

/**
 * Order Model - Handles all database operations for orders
 */

/**
 * Create a new order with order items and reduce product stock
 * @param {Object} orderData - { customer_name, customer_email, customer_phone, delivery_address, items }
 * @param {Array} items - Array of { product_id, quantity }
 * @returns {Promise<Object>} - Created order with order_items
 */
const createOrder = async (orderData, items) => {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    const { customer_name, customer_email, customer_phone, delivery_address } = orderData;
    let totalAmount = 0;
    const orderItems = [];

    // Validate stock and calculate total for each item
    for (const item of items) {
      const { product_id, quantity } = item;

      // Get product details
      const productQuery = 'SELECT * FROM products WHERE product_id = $1';
      const productResult = await client.query(productQuery, [product_id]);

      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${product_id} not found`);
      }

      const product = productResult.rows[0];

      // Check if stock is sufficient
      if (product.stock < quantity) {
        throw new Error(
          `Insufficient stock for product ${product.product_name}. Available: ${product.stock}, Required: ${quantity}`
        );
      }

      const subtotal = parseFloat(product.price) * quantity;
      totalAmount += subtotal;

      orderItems.push({
        product_id,
        quantity,
        unit_price: product.price,
        subtotal,
      });

      // Reduce product stock
      const updateStockQuery = `
        UPDATE products
        SET stock = stock - $1, updated_at = NOW()
        WHERE product_id = $2
      `;
      await client.query(updateStockQuery, [quantity, product_id]);
    }

    // Create order
    const orderQuery = `
      INSERT INTO orders (customer_name, customer_email, customer_phone, delivery_address, total_amount, order_status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *;
    `;
    const orderValues = [customer_name, customer_email, customer_phone, delivery_address, totalAmount];
    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];

    // Insert order items
    const insertedItems = [];
    for (const item of orderItems) {
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const itemValues = [order.order_id, item.product_id, item.quantity, item.unit_price, item.subtotal];
      const itemResult = await client.query(itemQuery, itemValues);
      insertedItems.push(itemResult.rows[0]);
    }

    // Commit transaction
    await client.query('COMMIT');

    return {
      ...order,
      items: insertedItems,
    };
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    throw new Error(`Database error: ${error.message}`);
  } finally {
    client.release();
  }
};

/**
 * Get all orders with their items
 * @returns {Promise<Array>} - Array of orders with items
 */
const getAllOrders = async () => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.delivery_address,
        o.total_amount,
        o.order_status,
        o.created_at,
        o.updated_at,
        json_agg(
          json_build_object(
            'order_item_id', oi.order_item_id,
            'product_id', oi.product_id,
            'product_name', p.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      GROUP BY o.order_id
      ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get a single order by ID with its items
 * @param {number} orderId - The order ID
 * @returns {Promise<Object|null>} - Order object with items or null
 */
const getOrderById = async (orderId) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.delivery_address,
        o.total_amount,
        o.order_status,
        o.created_at,
        o.updated_at,
        json_agg(
          json_build_object(
            'order_item_id', oi.order_item_id,
            'product_id', oi.product_id,
            'product_name', p.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.order_id = $1
      GROUP BY o.order_id;
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Update order status
 * @param {number} orderId - The order ID
 * @param {string} status - New status (pending, confirmed, shipped, delivered, cancelled)
 * @returns {Promise<Object|null>} - Updated order or null if not found
 */
const updateOrderStatus = async (orderId, status) => {
  try {
    const query = `
      UPDATE orders
      SET order_status = $1, updated_at = NOW()
      WHERE order_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [status, orderId]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get orders by customer email
 * @param {string} email - Customer email
 * @returns {Promise<Array>} - Array of orders for the customer
 */
const getOrdersByCustomer = async (email) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.delivery_address,
        o.total_amount,
        o.order_status,
        o.created_at,
        o.updated_at,
        json_agg(
          json_build_object(
            'order_item_id', oi.order_item_id,
            'product_id', oi.product_id,
            'product_name', p.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.customer_email = $1
      GROUP BY o.order_id
      ORDER BY o.created_at DESC;
    `;
    const result = await pool.query(query, [email]);
    return result.rows;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByCustomer,
};
