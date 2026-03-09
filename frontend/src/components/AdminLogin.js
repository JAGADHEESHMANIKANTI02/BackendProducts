import React, { useState } from 'react';
import { adminLogin } from '../api/adminAuth';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const response = await adminLogin(formData.username, formData.password);

      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        admin_id: response.data.admin_id,
        username: response.data.username,
        email: response.data.email,
        role: response.data.role,
      }));

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }

      // Clear form
      setFormData({ username: '', password: '' });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access admin features</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Username: <strong>admin</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Password: <strong>admin@123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
