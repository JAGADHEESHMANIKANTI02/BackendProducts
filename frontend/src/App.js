import React, { useState, useEffect } from 'react';
import './App.css';
import AdminLogin from './components/AdminLogin';
import AdminProfile from './components/AdminProfile';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import PlaceOrder from './components/PlaceOrder';
import { checkHealth } from './api';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [refreshProducts, setRefreshProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedAdmin = localStorage.getItem('adminUser');

    if (storedToken && storedAdmin) {
      setAuthToken(storedToken);
      setAdminUser(JSON.parse(storedAdmin));
    }
    
    setIsLoading(false);
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      await checkHealth();
      setIsConnected(true);
      setConnectionError(null);
    } catch (err) {
      setIsConnected(false);
      setConnectionError('Cannot connect to backend server');
    }
  };

  const handleLoginSuccess = (loginData) => {
    setAuthToken(loginData.token);
    setAdminUser({
      admin_id: loginData.admin_id,
      username: loginData.username,
      email: loginData.email,
      role: loginData.role,
    });
  };

  const handleLogout = () => {
    setAuthToken(null);
    setAdminUser(null);
    setActiveTab('products');
  };

  const handleProductAdded = () => {
    setRefreshProducts((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '50px', color: '#4CAF50' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!authToken) {
    return (
      <div className="App">
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>🏬 Product & Order Management System</h1>
            <p>A simple React-based interface to manage products and orders</p>
          </div>
          <AdminProfile token={authToken} onLogout={handleLogout} />
        </div>
        <div style={{ marginTop: '15px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: isConnected ? '#4CAF50' : '#f44336',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {isConnected ? '✓ Server Connected' : '✗ Server Disconnected'}
          </span>
        </div>
      </div>

      <div className="container">
        {connectionError && !isConnected && (
          <div className="error">
            <strong>Connection Error:</strong> {connectionError}. Make sure the backend server is running on{' '}
            {process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
             View Products
          </button>
          <button
            className={`tab-button ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-product')}
          >
            ➕ Add Product
          </button>
          <button
            className={`tab-button ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
             Place Order
          </button>
        </div>

        {activeTab === 'products' && <ProductList key={refreshProducts} token={authToken} />}
        {activeTab === 'add-product' && (
          <AddProduct token={authToken} onProductAdded={handleProductAdded} />
        )}
        {activeTab === 'order' && <PlaceOrder key={refreshProducts} />}
      </div>
    </div>
  );
}

export default App;
