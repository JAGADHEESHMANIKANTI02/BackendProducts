import React, { useState, useEffect } from 'react';
import { createOrder, getProducts } from '../api';

const PlaceOrder = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [customerData, setCustomerData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.data || []);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addOrderItem = () => {
    setOrderItems((prev) => [
      ...prev,
      { product_id: '', quantity: 1 },
    ]);
  };

  const removeOrderItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index, field, value) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!customerData.customer_name.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!customerData.customer_email.trim()) {
      setError('Customer email is required');
      return;
    }
    if (!customerData.customer_phone.trim()) {
      setError('Customer phone is required');
      return;
    }
    if (!customerData.delivery_address.trim()) {
      setError('Delivery address is required');
      return;
    }
    if (orderItems.length === 0) {
      setError('Please add at least one product to your order');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.customer_email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone
    if (!/^\d{10,}$/.test(customerData.customer_phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    // Validate all order items
    for (let item of orderItems) {
      if (!item.product_id) {
        setError('Please select a product for all items');
        return;
      }
      if (item.quantity < 1) {
        setError('Quantity must be at least 1');
        return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        customer_name: customerData.customer_name.trim(),
        customer_email: customerData.customer_email.trim(),
        customer_phone: customerData.customer_phone.trim(),
        delivery_address: customerData.delivery_address.trim(),
        ordered_products: orderItems.map((item) => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
        })),
      };

      const response = await createOrder(orderData);
      setSuccess(
        `Order #${response.data.order_id} placed successfully! Total: ₹${parseFloat(response.data.total_amount).toFixed(2)}`
      );

      // Reset form
      setCustomerData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        delivery_address: '',
      });
      setOrderItems([]);

      // Refresh products to update stock
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.product_id === parseInt(item.product_id));
      if (product) {
        return total + parseFloat(product.price) * parseInt(item.quantity || 0);
      }
      return total;
    }, 0);
  };

  const getProductPrice = (productId) => {
    const product = products.find((p) => p.product_id === parseInt(productId));
    return product ? parseFloat(product.price).toFixed(2) : '0.00';
  };

  const getProductStock = (productId) => {
    const product = products.find((p) => p.product_id === parseInt(productId));
    return product ? product.stock : 0;
  };

  return (
    <div className="form-section">
      <h2>🛒 Place an Order</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
            Customer Information
          </h3>

          <div className="form-group">
            <label htmlFor="customer_name">Full Name *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={customerData.customer_name}
              onChange={handleCustomerChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer_email">Email *</label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={customerData.customer_email}
              onChange={handleCustomerChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer_phone">Phone Number *</label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={customerData.customer_phone}
              onChange={handleCustomerChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="delivery_address">Delivery Address *</label>
            <textarea
              id="delivery_address"
              name="delivery_address"
              value={customerData.delivery_address}
              onChange={handleCustomerChange}
              placeholder="Enter your delivery address"
              required
            ></textarea>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#2c3e50', margin: 0 }}>Order Items</h3>
            <button
              type="button"
              className="btn-secondary btn-small"
              onClick={addOrderItem}
            >
              + Add Item
            </button>
          </div>

          {orderItems.length === 0 ? (
            <div className="no-data">No items added yet. Click "Add Item" to get started.</div>
          ) : (
            <div className="order-items">
              {orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-details">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateOrderItem(index, 'product_id', e.target.value)}
                      style={{ width: '100%', marginBottom: '8px' }}
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.product_id} value={product.product_id}>
                          {product.product_name} - ₹{parseFloat(product.price).toFixed(2)} (Stock: {product.stock})
                        </option>
                      ))}
                    </select>
                    <small>
                      {item.product_id && (
                        <>
                          Price: ₹{getProductPrice(item.product_id)} | Available: {getProductStock(item.product_id)}
                        </>
                      )}
                    </small>
                  </div>
                  <div className="order-item-qty">
                    <input
                      type="number"
                      min="1"
                      max={item.product_id ? getProductStock(item.product_id) : 999}
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                      style={{ width: '50px', textAlign: 'center' }}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => removeOrderItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {orderItems.length > 0 && (
                <div
                  style={{
                    paddingTop: '15px',
                    borderTop: '2px solid #4CAF50',
                    marginTop: '15px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' }}>
                    Order Total: <span style={{ color: '#4CAF50' }}>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
