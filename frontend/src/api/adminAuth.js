import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * Admin Authentication API calls
 */

/**
 * Admin Login
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Object} Login response with token
 */
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get current admin profile
 * @param {string} token - JWT token
 * @returns {Object} Admin profile
 */
export const getAdminProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Register new admin (Super Admin only)
 * @param {string} token - JWT token
 * @param {Object} adminData - Admin details
 * @returns {Object} Created admin
 */
export const registerAdmin = async (token, adminData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/admin/register`, adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Change admin password
 * @param {string} token - JWT token
 * @param {Object} passwordData - Current and new password
 * @returns {Object} Response
 */
export const changeAdminPassword = async (token, passwordData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/admin/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * List all admins (Super Admin only)
 * @param {string} token - JWT token
 * @param {number} limit - Number of records
 * @param {number} offset - Offset
 * @returns {Object} Admins list
 */
export const listAdmins = async (token, limit = 10, offset = 0) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/admin/list?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create authenticated API instance
 * @param {string} token - JWT token
 * @returns {Object} Axios instance with authorization header
 */
export const createAuthenticatedApi = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  adminLogin,
  getAdminProfile,
  registerAdmin,
  changeAdminPassword,
  listAdmins,
  createAuthenticatedApi,
};
