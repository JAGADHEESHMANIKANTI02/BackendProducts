const express = require('express');
const {
  login,
  register,
  getProfile,
  changeAdminPassword,
  listAdmins,
  updateRole,
  removeAdmin,
} = require('../controllers/adminController');
const { authenticateJWT, authorizeRole } = require('../middleware/jwtAuth');

/**
 * Admin Authentication Routes
 * Base path: /api/admin
 */

const router = express.Router();

/**
 * POST /api/admin/login
 * Public endpoint - Admin login
 * Returns JWT token
 */
router.post('/login', login);

/**
 * POST /api/admin/register
 * Protected endpoint - Register new admin (Super Admin only)
 * Requires valid JWT token with super_admin role
 */
router.post('/register', authenticateJWT, authorizeRole('super_admin'), register);

/**
 * GET /api/admin/profile
 * Protected endpoint - Get current admin profile
 * Requires valid JWT token
 */
router.get('/profile', authenticateJWT, getProfile);

/**
 * PUT /api/admin/change-password
 * Protected endpoint - Change admin password
 * Requires valid JWT token and current password verification
 */
router.put('/change-password', authenticateJWT, changeAdminPassword);

/**
 * GET /api/admin/list
 * Protected endpoint - List all admins (Super Admin only)
 * Requires valid JWT token with super_admin role
 */
router.get('/list', authenticateJWT, authorizeRole('super_admin'), listAdmins);

/**
 * PUT /api/admin/:id/role
 * Protected endpoint - Update admin role (Super Admin only)
 * Requires valid JWT token with super_admin role
 */
router.put('/:id/role', authenticateJWT, authorizeRole('super_admin'), updateRole);

/**
 * DELETE /api/admin/:id
 * Protected endpoint - Deactivate admin (Super Admin only)
 * Requires valid JWT token with super_admin role
 */
router.delete('/:id', authenticateJWT, authorizeRole('super_admin'), removeAdmin);

module.exports = router;
