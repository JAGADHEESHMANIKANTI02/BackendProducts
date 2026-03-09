const bcrypt = require('bcryptjs');
const {
  getAdminByUsername,
  getAdminByEmail,
  getAdminById,
  updateLastLogin,
  createAdmin,
  getAllAdmins,
  updateAdminRole,
  deactivateAdmin,
  changePassword,
} = require('../models/adminModel');
const { generateToken } = require('../middleware/jwtAuth');
const { ValidationError, UnauthorizedError, NotFoundError, ConflictError } = require('../utils/errors');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');

/**
 * Admin Controller
 * Handles admin authentication and management
 */

/**
 * Admin Login
 * POST /api/admin/login
 * Body: { username, password }
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      throw new ValidationError('Username and password are required');
    }

    // Find admin by username
    const admin = await getAdminByUsername(username);
    if (!admin) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Update last login
    await updateLastLogin(admin.admin_id);

    // Generate JWT token
    const token = generateToken(admin);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register New Admin (Super Admin Only)
 * POST /api/admin/register
 * Headers: Authorization: Bearer <token>
 * Body: { username, email, password, role }
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      throw new ValidationError('Username, email, and password are required');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // Check if username already exists
    const existingUsername = await getAdminByUsername(username);
    if (existingUsername) {
      throw new ConflictError('Username already exists');
    }

    // Check if email already exists
    const existingEmail = await getAdminByEmail(email);
    if (existingEmail) {
      throw new ConflictError('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = await createAdmin({
      username,
      email,
      passwordHash,
      role: role || 'admin',
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin_id: newAdmin.admin_id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Admin Profile
 * GET /api/admin/profile
 * Headers: Authorization: Bearer <token>
 */
const getProfile = async (req, res, next) => {
  try {
    const adminId = req.admin.admin_id;

    const admin = await getAdminById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Admin Password
 * PUT /api/admin/change-password
 * Headers: Authorization: Bearer <token>
 * Body: { currentPassword, newPassword }
 */
const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.admin_id;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current and new password are required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('New password must be at least 6 characters');
    }

    if (currentPassword === newPassword) {
      throw new ValidationError('New password must be different from current password');
    }

    // Get admin
    const admin = await getAdminById(adminId);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Verify current password
    const adminFull = await getAdminByUsername(admin.username);
    const isPasswordValid = await bcrypt.compare(currentPassword, adminFull.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    const updated = await changePassword(adminId, newPasswordHash);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        admin_id: updated.admin_id,
        username: updated.username,
        email: updated.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Admins (Super Admin Only)
 * GET /api/admin/list
 * Headers: Authorization: Bearer <token>
 */
const listAdmins = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await getAllAdmins(limit, offset);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Admins retrieved successfully',
      count: result.admins.length,
      total: result.total,
      data: result.admins,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Admin Role (Super Admin Only)
 * PUT /api/admin/:id/role
 * Headers: Authorization: Bearer <token>
 * Body: { role }
 */
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate input
    if (!role || !['admin', 'super_admin'].includes(role)) {
      throw new ValidationError('Valid role required: admin or super_admin');
    }

    // Check if admin exists
    const admin = await getAdminById(id);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Prevent changing own role
    if (parseInt(id) === req.admin.admin_id) {
      throw new ValidationError('Cannot change your own role');
    }

    // Update role
    const updated = await updateAdminRole(id, role);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Admin role updated successfully',
      data: {
        admin_id: updated.admin_id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate Admin (Super Admin Only)
 * DELETE /api/admin/:id
 * Headers: Authorization: Bearer <token>
 */
const removeAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const admin = await getAdminById(id);
    if (!admin) {
      throw new NotFoundError('Admin not found');
    }

    // Prevent deactivating self
    if (parseInt(id) === req.admin.admin_id) {
      throw new ValidationError('Cannot deactivate your own account');
    }

    // Deactivate admin
    await deactivateAdmin(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Admin deactivated successfully',
      data: {
        admin_id: id,
        message: 'Admin account has been deactivated',
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getProfile,
  changeAdminPassword,
  listAdmins,
  updateRole,
  removeAdmin,
};
