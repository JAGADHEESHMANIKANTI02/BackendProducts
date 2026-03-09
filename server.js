const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import configuration, routes, and middleware
const { DEFAULT_PORT } = require('./config/constants');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const requestLogger = require('./middleware/requestLogger');
const { validateRequestBody, validateContentType } = require('./middleware/validation');
const { sanitizeBody, sanitizeQuery, sanitizeParams, sanitizeEmailFields, sanitizePhoneFields } = require('./middleware/sanitization');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// GLOBAL MIDDLEWARE

// Logging middleware
app.use(requestLogger);

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request validation middleware
app.use(validateRequestBody);
app.use(validateContentType);

// INPUT SANITIZATION MIDDLEWARE

/**
 * Sanitization middleware to prevent XSS, SQL injection, and other attacks
 * Applied to request body, query parameters, URL parameters, email, and phone fields
 */
app.use(sanitizeBody);
app.use(sanitizeQuery);
app.use(sanitizeParams);
app.use(sanitizeEmailFields);
app.use(sanitizePhoneFields);


// ROUTES
// ============================================

/**
 * Product API Routes
 * Base path: /api/products
 */
app.use('/api/products', productRoutes);

/**
 * Order API Routes
 * Base path: /api/orders
 */
app.use('/api/orders', orderRoutes);

/**
 * Admin API Routes
 * Base path: /api/admin
 * Handles authentication and admin management
 */
app.use('/api/admin', adminRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

/**
 * GET /health
 * Simple health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ERROR HANDLING MIDDLEWARE

// 404 Not Found handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last middleware)
app.use(errorHandler);

// START SERVER

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
  console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;
