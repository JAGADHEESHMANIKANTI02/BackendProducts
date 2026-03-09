# JWT Authentication & Admin APIs Documentation

## 📋 Overview

This API implements JWT (JSON Web Token) authentication for admin operations. All product modifications (create, update, delete), order modifications, and admin management operations require valid JWT tokens.

## 🔑 Default Admin Credentials

**Login Credentials:**

- Username: `admin`
- Password: `admin@123`
- Role: `super_admin`

⚠️ **IMPORTANT**: Change these credentials in production!

## 🔐 Authentication Flow

```
1. Admin Login
   POST /api/admin/login
   ↓ (Returns JWT Token)
2. Store Token (localStorage/sessionStorage)
   ↓
3. Include in Requests
   Authorization: Bearer <token>
   ↓
4. Protected Resources
   GET /api/products (public)
   POST /api/products (admin only)
```

## 📡 API Endpoints

### Authentication Endpoints

#### 1. **Admin Login** (Public)

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin@123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin_id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Status Codes:**

- `200 OK` - Login successful
- `400 Bad Request` - Missing username or password
- `401 Unauthorized` - Invalid credentials

---

#### 2. **Register New Admin** (Super Admin Only)

```http
POST /api/admin/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "SecurePassword123",
  "role": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "admin_id": 2,
    "username": "newadmin",
    "email": "newadmin@example.com",
    "role": "admin"
  }
}
```

**Status Codes:**

- `201 Created` - Admin registered
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions
- `409 Conflict` - Username or email already exists

---

#### 3. **Get Admin Profile** (Authenticated)

```http
GET /api/admin/profile
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "admin_id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "is_active": true,
    "last_login": "2026-03-09T12:30:00.000Z",
    "created_at": "2026-03-09T10:00:00.000Z",
    "updated_at": "2026-03-09T12:30:00.000Z"
  }
}
```

---

#### 4. **Change Admin Password** (Authenticated)

```http
PUT /api/admin/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "admin@123",
  "newPassword": "NewSecurePassword456"
}
```

**Status Codes:**

- `200 OK` - Password changed
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Current password incorrect
- `404 Not Found` - Admin not found

---

#### 5. **List All Admins** (Super Admin Only)

```http
GET /api/admin/list?limit=10&offset=0
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Admins retrieved successfully",
  "count": 2,
  "total": 2,
  "data": [
    {
      "admin_id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "super_admin",
      "is_active": true,
      "last_login": "2026-03-09T12:30:00.000Z",
      "created_at": "2026-03-09T10:00:00.000Z",
      "updated_at": "2026-03-09T12:30:00.000Z"
    }
  ]
}
```

---

#### 6. **Update Admin Role** (Super Admin Only)

```http
PUT /api/admin/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "super_admin"
}
```

**Parameters:**

- `id` - Admin ID

**Valid Roles:**

- `admin` - Standard admin
- `super_admin` - Full administrative access

---

#### 7. **Deactivate Admin** (Super Admin Only)

```http
DELETE /api/admin/:id
Authorization: Bearer <token>
```

**Parameters:**

- `id` - Admin ID to deactivate

---

### Product API (Now Protected)

#### Create Product (Admin Only)

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_name": "Laptop",
  "price": 75000,
  "category": "Electronics",
  "stock": 10
}
```

**Status Codes:**

- `201 Created` - Product created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - No token or invalid token
- `405 Method Not Allowed` - Insufficient permissions

---

#### Update Product Stock (Admin Only)

```http
PUT /api/products/:id/stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "new_stock": 25
}
```

---

#### Delete Product (Admin Only)

```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

### Public Endpoints (No Auth Required)

#### Get All Products

```http
GET /api/products
```

#### Get Product by ID

```http
GET /api/products/:id
```

#### Get Products by Category

```http
GET /api/products?category=Electronics
```

---

## 🔒 Security Features

### Token Structure

JWT tokens contain:

- `admin_id` - Unique admin identifier
- `username` - Admin username
- `email` - Admin email
- `role` - Admin role (admin/super_admin)
- `iat` - Token issued at timestamp
- `exp` - Token expiration timestamp

### Token Expiry

- Default expiry: 24 hours
- Configurable via `JWT_EXPIRY` in .env
- Supported formats: `10h`, `24h`, `7d`, `365d`

### Security Best Practices

1. **Store tokens securely** - Use httpOnly cookies or secure storage
2. **HTTPS in production** - Always use HTTPS for token transmission
3. **Token rotation** - Implement refresh token mechanism
4. **Secret key** - Change `JWT_SECRET` in production
5. **No sensitive data** - Don't include passwords or sensitive info in tokens

---

## 🛠️ Implementation Examples

### JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch("http://localhost:8000/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "admin@123" }),
});

const { data } = await loginResponse.json();
const token = data.token;

// Store token
localStorage.setItem("authToken", token);

// Use token in requests
const createProduct = await fetch("http://localhost:8000/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    product_name: "Laptop",
    price: 75000,
    category: "Electronics",
    stock: 10,
  }),
});
```

### cURL

```bash
# Login
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin@123"}'

# Use token to create product
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "product_name":"Laptop",
    "price":75000,
    "category":"Electronics",
    "stock":10
  }'
```

### Axios (JavaScript)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Login
const { data } = await api.post("/api/admin/login", {
  username: "admin",
  password: "admin@123",
});

// Store token
const token = data.data.token;
localStorage.setItem("authToken", token);

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Now use api normally
await api.post("/api/products", {
  product_name: "Laptop",
  price: 75000,
  category: "Electronics",
  stock: 10,
});
```

---

## 📊 Role-Based Access Control (RBAC)

### Admin Role

- Create products
- Update product stock
- Delete products
- Place orders
- Change own password
- View own profile

### Super Admin Role

- All Admin permissions
- Register new admins
- Deactivate admins
- Change admin roles
- List all admins
- Manage all admins

---

## ⚠️ Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": "No authorization token provided",
  "errorName": "UnauthorizedError"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "This action requires super_admin role",
  "errorName": "UnauthorizedError"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "error": "Username and password are required",
  "errorName": "ValidationError",
  "details": ["Username is required", "Password is required"]
}
```

### 409 Conflict

```json
{
  "success": false,
  "error": "Username already exists",
  "errorName": "ConflictError"
}
```

---

## 🔄 Token Refresh Flow

To implement token refresh:

1. Save `lastTokenTime` when getting new token
2. Check if token will expire in next hour
3. If expiring soon, re-login to get new token
4. Or store refresh token (requires refresh token implementation)

```javascript
const isTokenExpiringSoon = () => {
  const lastTokenTime = localStorage.getItem("lastTokenTime");
  const currentTime = Date.now();
  const oneHour = 60 * 60 * 1000;

  return currentTime - lastTokenTime > 23 * oneHour;
};

if (isTokenExpiringSoon()) {
  // Re-login to get new token
}
```

---

## 🚀 Deployment Checklist

- [ ] Change `JWT_SECRET` in production .env
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS
- [ ] Implement CORS properly
- [ ] Add rate limiting for login endpoint
- [ ] Set strong passwords for all admins
- [ ] Use secure .env file handling
- [ ] Implement token refresh mechanism
- [ ] Add audit logging for admin actions
- [ ] Monitor suspicious login attempts

---

## 🐛 Troubleshooting

### "Invalid token" error

- Check if Bearer prefix is included
- Verify token hasn't expired
- Ensure token is not modified

### "No authorization token provided"

- Add Authorization header
- Format: `Authorization: Bearer <token>`

### "insufficient permissions"

- Check admin role
- Only super_admin can: register, delete, change roles

### Token not working after restart

- Tokens are stateless - should still work
- Check if JWT_SECRET matches in .env

---

**Documentation Last Updated**: March 9, 2026  
**JWT Version**: 9.0.2  
**bcrypt Version**: 2.4.3
