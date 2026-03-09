# Frontend JWT Authentication Implementation

## 📱 Overview

The React frontend now includes full JWT authentication support. Users must log in as an admin to access protected features like creating, editing, and deleting products.

## 🔐 Authentication Flow

### 1. Login Screen

- User enters username and password
- Request sent to `/api/admin/login`
- Server returns JWT token and admin details
- Token stored in localStorage
- User redirected to main app

### 2. Token Storage

- **Token**: `localStorage.authToken`
- **User Info**: `localStorage.adminUser` (JSON string with admin_id, username, email, role)
- Persists across browser sessions

### 3. Protected Requests

- All admin operations include token in Authorization header
- Format: `Authorization: Bearer <token>`
- Invalid/expired tokens trigger re-authentication

### 4. Logout

- Token removed from localStorage
- User redirected to login page
- Session cleared

## 📂 Frontend Structure

### New Files Added

```
frontend/src/
├── api/
│   └── adminAuth.js          # Admin authentication API calls
├── components/
│   ├── AdminLogin.js         # Login form component
│   └── AdminProfile.js       # Profile display + logout
├── App.js                     # Updated with auth state
└── index.css                  # Styles for login/profile
```

### Key Components

#### **AdminLogin.js**

- Username/password form
- Password visibility toggle
- Demo credentials display
- Error handling
- Shows loading state during login

#### **AdminProfile.js**

- Displays current admin info
- Shows role (Admin/Super Admin)
- Logout button
- Profile avatar

#### **App.js**

- Auth state management
- Token restoration from localStorage
- Conditional rendering (login vs. main app)
- Token passing to child components

## 🔑 API Endpoints (Frontend)

### Admin Authentication

#### Login

```javascript
const response = await adminLogin(username, password);
// Returns: { token, admin_id, username, email, role }
```

#### Get Profile

```javascript
const response = await getAdminProfile(token);
// Returns: Full admin profile with metadata
```

#### Register New Admin (Super Admin Only)

```javascript
const response = await registerAdmin(token, {
  username,
  email,
  password,
  role,
});
```

#### Change Password

```javascript
const response = await changeAdminPassword(token, {
  currentPassword,
  newPassword,
});
```

#### List All Admins (Super Admin Only)

```javascript
const response = await listAdmins(token, limit, offset);
// Returns: { admins, total, count }
```

## 🛠️ Usage Examples

### Example 1: Login

```javascript
import { adminLogin } from "./api/adminAuth";

// In component
const handleLogin = async (username, password) => {
  try {
    const response = await adminLogin(username, password);
    localStorage.setItem("authToken", response.data.token);
    // Redirect to main app
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### Example 2: Create Product with Auth

```javascript
import axios from "axios";

const createProduct = async (productData, token) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/products",
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Creation failed:", error);
  }
};
```

### Example 3: Auto-reconnect with Stored Token

```javascript
useEffect(() => {
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) {
    setAuthToken(storedToken);
    // Validate token exists
    // User stays logged in
  }
}, []);
```

## 💾 localStorage Structure

```javascript
// Token
localStorage.getItem('authToken')
// Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// User Info
JSON.parse(localStorage.getItem('adminUser'))
// Returns:
{
  admin_id: 1,
  username: "admin",
  email: "admin@example.com",
  role: "super_admin"
}
```

## 🔄 Token Management

### Check if User is Logged In

```javascript
const token = localStorage.getItem("authToken");
const isLoggedIn = !!token;
```

### Get Current User Info

```javascript
const user = JSON.parse(localStorage.getItem("adminUser"));
console.log(user.role); // "super_admin" or "admin"
```

### Clear Session (Logout)

```javascript
localStorage.removeItem("authToken");
localStorage.removeItem("adminUser");
// Redirect to login
```

## 🔐 Security Features

### Client-Side

- ✅ Token stored in localStorage (accessible only within same domain)
- ✅ Authorization header sent with authenticated requests
- ✅ Tokens expire after 24 hours (configurable on backend)
- ✅ Expired tokens trigger re-login
- ✅ No sensitive data stored in token

### Server-Side

- ✅ JWT signature verification
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ SQL parameterized queries
- ✅ Input sanitization

## ⚠️ Important Notes

### Demo Credentials

```
Username: admin
Password: admin@123
```

⚠️ **Change these in production!**

### Token Validity

- Tokens expire after 24 hours
- After expiration, user must login again
- No automatic token refresh (add if needed)

### HTTPS in Production

- Always use HTTPS to prevent token interception
- Never send tokens over HTTP

### localStorage Security

- Vulnerable to XSS attacks
- For maximum security, use httpOnly cookies (requires backend changes)
- In production, implement:
  - CSRF protection
  - Secure cookie flags
  - Refresh token mechanism

## 🐛 Troubleshooting

### "No authorization token provided"

**Cause**: Token not in localStorage or not sent in header
**Solution**:

- Check if `localStorage.getItem('authToken')` returns value
- Verify Authorization header format: `Bearer <token>`

### "Invalid token"

**Cause**: Token expired or corrupted
**Solution**: Clear localStorage and log in again

```javascript
localStorage.clear();
// Redirect to login
```

### "403 Forbidden"

**Cause**: User doesn't have required role
**Solution**: Check user role and ensure super_admin access for registration

### Cannot create product

**Cause**: Not authenticated
**Solution**: Must login first as an admin

## 🔄 Integration Checklist

- ✅ Login component displays
- ✅ Token stored after successful login
- ✅ Admin profile shown in header
- ✅ Token passed to product creation
- ✅ Logout clears localStorage
- ✅ Login persists after page refresh
- ✅ Expired token prompts re-login
- ✅ Unauthorized access shows error

## 📊 Component Props

### App.js

```javascript
// State
authToken; // JWT token string
adminUser; // { admin_id, username, email, role }
activeTab; // Current tab: 'products', 'add-product', 'order'
isConnected; // Server connection status

// Methods
handleLoginSuccess(loginData); // Called after successful login
handleLogout(); // Called on logout
```

### AddProduct.js

```javascript
// Props
token; // JWT token for authenticated request
onProductAdded; // Callback after product creation
```

### AdminLogin.js

```javascript
// Props
onLoginSuccess(loginData); // Called with login response data
```

### AdminProfile.js

```javascript
// Props
token; // JWT token (for fetching profile)
onLogout(); // Callback for logout
```

## 🚀 Future Enhancements

1. **Refresh Token Mechanism**
   - Automatic token refresh before expiry
   - Refresh endpoint: `POST /api/admin/refresh-token`

2. **Secure Cookie Storage**
   - httpOnly cookies instead of localStorage
   - CSRF token protection

3. **Audit Logging**
   - Track admin actions (create, update, delete)
   - Login/logout history

4. **Two-Factor Authentication (2FA)**
   - OTP verification
   - Email confirmation

5. **Role-Based UI**
   - Different UI based on admin role
   - Hide/show features by permission

6. **Session Management**
   - Active sessions display
   - Logout from all devices
   - Session timeout

## 📝 Testing the Authentication

### Step 1: Login

```bash
# Go to http://localhost:3000
# Enter username: admin
# Enter password: admin@123
# Click Login
```

### Step 2: Verify Token

```javascript
// Open browser console (F12)
localStorage.getItem("authToken"); // Should return token
```

### Step 3: Create Product

```bash
# Click "➕ Add Product" tab
# Fill product details
# Click "Create Product"
```

### Step 4: Logout

```bash
# Click "Logout" button in top-right
# Redirected to login page
```

## 🔐 Best Practices

1. **Always validate on backend**
   - Frontend validation is for UX only
   - Backend must re-validate all requests

2. **Use HTTPS**
   - Prevents token interception
   - Required for production

3. **Implement token expiry**
   - Protects against compromised tokens
   - 24-hour default is reasonable

4. **Never expose sensitive data**
   - Don't log tokens in console
   - Don't send in URLs
   - Use Authorization headers

5. **Regular security updates**
   - Update dependencies regularly
   - Check for vulnerabilities: `npm audit`

---

**Last Updated**: March 9, 2026  
**Frontend Framework**: React 18.2.0  
**Authentication**: JWT (jsonwebtoken)  
**Storage**: localStorage
