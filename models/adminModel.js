const pool = require('../config/database');
const { MESSAGES } = require('../config/constants');

/**
 * Admin Model
 * Database operations for admin authentication and management
 */

/**
 * Get admin by username
 * @param {string} username - Admin username
 * @returns {Object} Admin record
 */
const getAdminByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1 AND is_active = true',
      [username]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get admin by email
 * @param {string} email - Admin email
 * @returns {Object} Admin record
 */
const getAdminByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get admin by ID
 * @param {number} adminId - Admin ID
 * @returns {Object} Admin record
 */
const getAdminById = async (adminId) => {
  try {
    const result = await pool.query(
      'SELECT admin_id, username, email, role, is_active, last_login, created_at, updated_at FROM admins WHERE admin_id = $1',
      [adminId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Update admin last login timestamp
 * @param {number} adminId - Admin ID
 * @returns {Object} Updated admin record
 */
const updateLastLogin = async (adminId) => {
  try {
    const result = await pool.query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE admin_id = $1 RETURNING *',
      [adminId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Create new admin
 * @param {Object} adminData - Admin information
 * @returns {Object} Created admin record
 */
const createAdmin = async (adminData) => {
  const { username, email, passwordHash, role } = adminData;
  try {
    const result = await pool.query(
      `INSERT INTO admins (username, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING admin_id, username, email, role, is_active, created_at`,
      [username, email, passwordHash, role || 'admin']
    );
    return result.rows[0];
  } catch (error) {
    if (error.message.includes('duplicate key value violates unique constraint')) {
      if (error.message.includes('username')) {
        throw new Error('Username already exists');
      }
      if (error.message.includes('email')) {
        throw new Error('Email already exists');
      }
    }
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Get all admins (paginated)
 * @param {number} limit - Number of records
 * @param {number} offset - Number to skip
 * @returns {Object} Admins and total count
 */
const getAllAdmins = async (limit = 10, offset = 0) => {
  try {
    const result = await pool.query(
      `SELECT admin_id, username, email, role, is_active, last_login, created_at, updated_at 
       FROM admins 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM admins');

    return {
      admins: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Update admin role
 * @param {number} adminId - Admin ID
 * @param {string} role - New role
 * @returns {Object} Updated admin
 */
const updateAdminRole = async (adminId, role) => {
  try {
    const result = await pool.query(
      'UPDATE admins SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE admin_id = $2 RETURNING *',
      [role, adminId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Deactivate admin
 * @param {number} adminId - Admin ID
 * @returns {Object} Updated admin
 */
const deactivateAdmin = async (adminId) => {
  try {
    const result = await pool.query(
      'UPDATE admins SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE admin_id = $1 RETURNING *',
      [adminId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

/**
 * Change admin password
 * @param {number} adminId - Admin ID
 * @param {string} newPasswordHash - New password hash
 * @returns {Object} Updated admin
 */
const changePassword = async (adminId, newPasswordHash) => {
  try {
    const result = await pool.query(
      'UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE admin_id = $2 RETURNING admin_id, username, email, role',
      [newPasswordHash, adminId]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

module.exports = {
  getAdminByUsername,
  getAdminByEmail,
  getAdminById,
  updateLastLogin,
  createAdmin,
  getAllAdmins,
  updateAdminRole,
  deactivateAdmin,
  changePassword,
};
