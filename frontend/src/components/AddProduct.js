import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const AddProduct = ({ token, onProductAdded }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    category: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.product_name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Stock must be a non-negative number');
      return;
    }

    setLoading(true);
    try {
      // Create authenticated request
      const response = await axios.post(
        `${API_BASE_URL}/api/products`,
        {
          product_name: formData.product_name.trim(),
          price: parseFloat(formData.price),
          category: formData.category.trim(),
          stock: parseInt(formData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(`Product "${formData.product_name}" created successfully!`);
      setFormData({
        product_name: '',
        price: '',
        category: '',
        stock: '',
      });

      // Refresh products list
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create product';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2> Add New Product</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product_name">Product Name *</label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Electronics, Clothing"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock Quantity *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            min="0"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
