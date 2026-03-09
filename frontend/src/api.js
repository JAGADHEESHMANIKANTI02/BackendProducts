import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product APIs
export const getProducts = async (category = null) => {
  try {
    const url = category ? `/api/products?category=${category}` : '/api/products';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/api/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProductStock = async (productId, newStock) => {
  try {
    const response = await api.put(`/api/products/${productId}/stock`, {
      new_stock: newStock,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Order APIs
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/api/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/api/orders/${orderId}/status`, {
      order_status: status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrdersByCustomer = async (email) => {
  try {
    const response = await api.get(`/api/orders/customer/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
