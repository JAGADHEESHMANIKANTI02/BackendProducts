import React, { useState, useEffect } from 'react';
import { getAdminProfile } from '../api/adminAuth';

const AdminProfile = ({ token, onLogout }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getAdminProfile(token);
      setAdmin(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    if (onLogout) {
      onLogout();
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="error" style={{ margin: '10px 0' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="admin-profile">
      <div className="profile-info">
        <div className="profile-avatar">👤</div>
        <div className="profile-details">
          <div className="profile-name">{admin?.username}</div>
          <div className="profile-role">
            {admin?.role === 'super_admin' ? ' Super Admin' : ' Admin'}
          </div>
        </div>
      </div>
      <button className="btn-danger btn-small" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminProfile;
