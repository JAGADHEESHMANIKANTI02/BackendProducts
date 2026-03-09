import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(selectedCategory);
      setProducts(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  const getStockClass = (stock) => {
    if (stock === 0) return 'stock low';
    if (stock < 5) return 'stock low';
    return 'stock high';
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="form-section">
      <h2> Products</h2>

      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-filter" style={{ marginRight: '10px' }}>
          Filter by Category:
        </label>
        <select
          id="category-filter"
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          style={{ minWidth: '200px' }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading products...</div>}

      {!loading && products.length === 0 && (
        <div className="no-data">No products available</div>
      )}

      {!loading && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.product_id} className="product-card">
              <h3>{product.product_name}</h3>
              <div className="price">₹{parseFloat(product.price).toFixed(2)}</div>
              <span className="category">{product.category}</span>
              <div className={getStockClass(product.stock)}>
                {getStockStatus(product.stock)}
              </div>
              <small>ID: {product.product_id}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
