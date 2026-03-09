const orderModel = require('../models/orderModel');
const { validateOrderData, validateOrderItems, validateOrderStatus } = require('../utils/validators');
const { MESSAGES, HTTP_STATUS } = require('../config/constants');

/**
 * Order Controller - Handles business logic for order routes
 */

/**
 * POST /api/orders - Create a new order
 */
const createOrder = async (req, res, next) => {
  try {
    const { customer_name, customer_email, customer_phone, delivery_address, items } = req.body;

    // Validate customer details
    const validation = validateOrderData({
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
    });

    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: MESSAGES.INVALID_INPUT,
        details: validation.errors,
      });
    }

    // Validate items
    const itemsValidation = validateOrderItems(items);
    if (!itemsValidation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: MESSAGES.INVALID_INPUT,
        details: itemsValidation.errors,
      });
    }

    // Create order (with automatic stock reduction)
    const order = await orderModel.createOrder(
      {
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
      },
      items
    );

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    // Handle specific error messages (stock insufficient, product not found)
    if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error.message,
      });
    }
    next(error);
  }
};

/**
 * GET /api/orders - Retrieve all orders
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllOrders();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Orders retrieved successfully',
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id - Get a single order by ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || Number(id) <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid order ID',
      });
    }

    const order = await orderModel.getOrderById(parseInt(id));

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/orders/:id/status - Update order status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate order ID
    if (isNaN(id) || Number(id) <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid order ID',
      });
    }

    // Validate status
    const statusValidation = validateOrderStatus(status);
    if (!statusValidation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: statusValidation.error,
      });
    }

    // Update status
    const updatedOrder = await orderModel.updateOrderStatus(parseInt(id), status);

    if (!updatedOrder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/customer/:email - Get orders by customer email
 */
const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email || !email.includes('@')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Valid customer email is required',
      });
    }

    const orders = await orderModel.getOrdersByCustomer(email);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByCustomer,
};
