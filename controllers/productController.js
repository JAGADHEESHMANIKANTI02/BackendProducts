const productModel = require('../models/productModel');
const { validateProductData, validateStockData, validateProductId } = require('../utils/validators');
const { MESSAGES, HTTP_STATUS } = require('../config/constants');

/**
 * Product Controller - Handles business logic for product routes
 */

/**
 * GET /api/products - Retrieve all products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const products = await productModel.getAllProducts();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.PRODUCT_FETCHED,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products - Create a new product
 */
const createProduct = async (req, res, next) => {
  try {
    const { product_name, price, category, stock } = req.body;

    // Validate input data
    const validation = validateProductData({
      product_name,
      price,
      category,
      stock,
    });

    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: MESSAGES.INVALID_INPUT,
        details: validation.errors,
      });
    }

    // Create product in database
    const product = await productModel.createProduct({
      product_name,
      price,
      category,
      stock,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.PRODUCT_CREATED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id/stock - Update product stock
 */
const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    // Validate stock data
    const validation = validateStockData({ stock });

    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: MESSAGES.INVALID_INPUT,
        details: validation.errors,
      });
    }

    // Update product stock
    const updatedProduct = await productModel.updateProductStock(
      parseInt(id),
      parseInt(stock)
    );

    if (!updatedProduct) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.PRODUCT_UPDATED,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id - Get a single product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    const product = await productModel.getProductById(parseInt(id));

    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id - Delete a product
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!validateProductId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid product ID',
      });
    }

    const isDeleted = await productModel.deleteProduct(parseInt(id));

    if (!isDeleted) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/category/:category - Get products by category
 */
const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    if (!category || category.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Category is required',
      });
    }

    const products = await productModel.getProductsByCategory(category);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProductStock,
  getProductById,
  deleteProduct,
  getProductsByCategory,
};
