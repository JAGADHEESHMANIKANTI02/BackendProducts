# JWT Authentication Testing Guide

## 📋 Quick Test Checklist

This guide walks you through testing the complete JWT authentication system on both backend and frontend.

---

## 🚀 Getting Started

### Prerequisites

- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- PostgreSQL database connected

### Start Services

**Terminal 1 - Backend:**

```bash
cd d:\BackendAssignement
npm start
# Expected output: ✓ Server running on http://localhost:8000
```

**Terminal 2 - Frontend:**

```bash
cd d:\BackendAssignement\frontend
npm start
# Expected output: React dev server opens in browser at http://localhost:3000
```

---

## 🧪 Test Scenarios

### Test 1: Frontend Login Flow ✅

#### Steps:

1. Open `http://localhost:3000` in browser
2. You should see **AdminLogin** form (username/password input)
3. Enter credentials:
   - **Username**: `admin`
   - **Password**: `admin@123`
4. Click **Login** button

#### Expected Results:

- ✅ Login button shows loading state
- ✅ Redirected to main application
- ✅ Admin profile shows in top-right: "Welcome, admin"
- ✅ Admin profile shows role badge: "👑 Super Admin"
- ✅ Token received and stored in `localStorage`

#### Verify Token Storage:

```javascript
// Open browser DevTools Console (F12)
localStorage.getItem("authToken");
// Returns: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

JSON.parse(localStorage.getItem("adminUser"));
// Returns: { admin_id: 1, username: "admin", email: "admin@example.com", role: "super_admin" }
```

---

### Test 2: Create Product (Protected Endpoint) ✅

#### Steps:

1. Login first (Test 1)
2. Click **➕ Add Product** tab
3. Fill form:
   - **Product Name**: Test Product
   - **Price**: 99.99
   - **Category**: Electronics
   - **Stock**: 50
4. Click **Create Product** button

#### Expected Results:

- ✅ Request includes `Authorization: Bearer <token>` header
- ✅ Product created successfully
- ✅ Success message displayed
- ✅ Product appears in product list

#### Verify Request:

```javascript
// DevTools > Network tab
// Click Create Product
// Look for POST request to http://localhost:8000/api/products
// Headers section should show:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Test 3: Logout ✅

#### Steps:

1. After login (Test 1)
2. Look for "Logout" button in top-right admin profile area
3. Click **Logout** button

#### Expected Results:

- ✅ localStorage cleared (token and user removed)
- ✅ Redirected to login page
- ✅ Admin profile disappears from header
- ✅ All protected features become unavailable

#### Verify:

```javascript
// DevTools Console
localStorage.getItem("authToken");
// Returns: null

localStorage.getItem("adminUser");
// Returns: null
```

---

### Test 4: Session Persistence ✅

#### Steps:

1. Login (Test 1)
2. Refresh the page (F5 or Cmd+R)
3. Observe application behavior

#### Expected Results:

- ✅ Stay logged in (no redirect to login page)
- ✅ Admin profile remains visible
- ✅ Can immediately use protected features
- ✅ Token restored from localStorage

---

### Test 5: Protected Route Without Token ✅

#### Steps:

1. Clear localStorage manually:
   ```javascript
   localStorage.clear();
   ```
2. Refresh page (F5)
3. Try to access application

#### Expected Results:

- ✅ Redirected to login page
- ✅ Cannot access any protected features
- ✅ Must login to continue

---

### Test 6: Unauthenticated Product Creation ✅

#### Steps:

1. Make sure you're logged out
2. Try to create a product via API:
   ```bash
   curl -X POST http://localhost:8000/api/products \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Unauthorized Product",
       "price": 50,
       "category": "Test",
       "stock": 10
     }'
   ```

#### Expected Results:

- ✅ Error response: "No authorization token provided"
- ✅ HTTP Status: 401 Unauthorized
- ✅ Product is NOT created

---

### Test 7: Invalid Token ✅

#### Steps:

1. Manually set invalid token:
   ```javascript
   localStorage.setItem("authToken", "invalid.token.here");
   ```
2. Refresh page
3. Try to create product or access protected feature

#### Expected Results:

- ✅ Error: "Invalid token"
- ✅ HTTP Status: 403 Forbidden
- ✅ Should be redirected to login
- ✅ localStorage cleared

---

### Test 8: Product Listing (Public Route) ✅

#### Steps:

1. Clear localStorage (logout)
2. You should still see product list without login

#### Expected Results:

- ✅ Product list loads WITHOUT authentication
- ✅ GET /api/products doesn't require token
- ✅ Can view products without login
- ✅ Cannot create/edit/delete without token

---

### Test 9: Role-Based Access Control ✅

#### Prerequisites:

- Create second admin with `admin` role (not super_admin)
- Currently only demo admin exists (super_admin)

#### Steps:

1. Register new admin (requires super_admin):
   ```bash
   curl -X POST http://localhost:8000/api/admin/register \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <super-admin-token>" \
     -d '{
       "username": "regular_admin",
       "email": "admin@test.com",
       "password": "securepass123",
       "role": "admin"
     }'
   ```

#### Expected Results:

- ✅ New admin created with "admin" role
- ✅ Cannot create/register new admins (only super_admin can)
- ✅ Can still create/edit products

---

### Test 10: Token Expiration (Optional) ⏰

#### Prerequisites:

- Modify JWT_EXPIRY in .env to very short duration for testing:
  ```
  JWT_EXPIRY=1m
  ```

#### Steps:

1. Login
2. Wait 1 minute
3. Try to create product

#### Expected Results:

- ✅ Error: "Token has expired"
- ✅ Redirected to login page
- ✅ Must login again

---

## 🔍 Backend Testing (API Testing Without Frontend)

### Test Admin Login

```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin@123"
  }'

# Response:
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin_id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin"
  }
}
```

### Test Get Admin Profile (Authorized)

```bash
curl -X GET http://localhost:8000/api/admin/profile \
  -H "Authorization: Bearer <token-from-login>"

# Response:
{
  "status": "success",
  "data": {
    "admin_id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin",
    "is_active": true,
    "created_at": "2026-03-09T10:00:00.000Z",
    "last_login": "2026-03-09T12:30:45.123Z"
  }
}
```

### Test Product Creation (Protected)

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-from-login>" \
  -d '{
    "name": "API Test Product",
    "price": 199.99,
    "category": "Test",
    "stock": 25
  }'

# Response:
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "product_id": 15,
    "name": "API Test Product",
    "price": 199.99,
    "category": "Test",
    "stock": 25
  }
}
```

### Test Protected Endpoint Without Token

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "price": 50,
    "category": "Test",
    "stock": 10
  }'

# Response (Error):
{
  "status": "error",
  "message": "No authorization token provided",
  "code": "UNAUTHORIZED"
}
```

---

## 📊 Test Results Summary

Create a checklist as you complete tests:

```
Authentication System Test Results
====================================
Date: March 9, 2026
Tester:

✅ Test 1: Frontend Login Flow
  ✅ Login form displays
  ✅ Credentials accepted
  ✅ Token stored in localStorage
  ✅ Admin profile shows in header

✅ Test 2: Create Product (Protected)
  ✅ Requires authentication
  ✅ Bearer token sent in header
  ✅ Product created successfully

✅ Test 3: Logout
  ✅ localStorage cleared
  ✅ Redirected to login
  ✅ Protected features unavailable

✅ Test 4: Session Persistence
  ✅ Token restored on page refresh
  ✅ Stay logged in

✅ Test 5: Protected Route Without Token
  ✅ Cannot access protected features
  ✅ Redirected to login

✅ Test 6: Unauthenticated Creation
  ✅ 401 Unauthorized error
  ✅ Product not created

✅ Test 7: Invalid Token
  ✅ 403 Forbidden error
  ✅ Redirected to login

✅ Test 8: Public Product List
  ✅ Loads without authentication

✅ Test 9: RBAC
  ✅ Super admin restrictions work

⏰ Test 10: Token Expiration (Optional)
  ⏰ Skipped / Completed

Overall Status: ✅ PASSED
```

---

## 🐛 Common Issues & Solutions

### Issue: "No authorization token provided"

**When**: Trying to create/edit/delete product
**Cause**: User not logged in or token not sent
**Solution**:

1. Login first
2. Check localStorage has token
3. Verify Authorization header is set

### Issue: "Invalid token"

**When**: After login, protected requests fail
**Cause**: Token corrupted or malformed
**Solution**:

```javascript
localStorage.clear();
// Login again
```

### Issue: Login page shows even after login

**When**: Page refresh shows login again
**Cause**: Token not being restored from localStorage
**Solution**:

1. Check App.js has localStorage check in useEffect
2. Verify token is actually stored: `localStorage.getItem('authToken')`
3. Check browser DevTools > Application > Storage > localStorage

### Issue: "Login successful" but no redirect

**When**: Login form submits but no action
**Cause**: onLoginSuccess callback not working
**Solution**:

1. Check AdminLogin component gets onLoginSuccess prop
2. Verify App.js has handleLoginSuccess method
3. Check for JavaScript errors in DevTools Console

### Issue: CORS errors

**When**: API requests fail
**Cause**: Frontend and backend not configured for CORS
**Solution**:

```javascript
// Backend server.js should have:
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

### Issue: Token not sent in requests

**When**: Authorization header missing from XHR requests
**Cause**: AddProduct not passing token
**Solution**:

```javascript
// AddProduct.js should have:
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📈 Performance Testing

### Load Testing (Optional)

```bash
# Test concurrent login attempts
ab -n 100 -c 10 -p credentials.json \
  -T application/json \
  http://localhost:8000/api/admin/login
```

### Response Time Measurement

- Login endpoint: Should be < 100ms
- Product creation: Should be < 50ms
- Profile fetch: Should be < 30ms

---

## ✅ Final Verification

After all tests pass, verify:

- [x] Landing shows login form when logged out
- [x] Can login with admin/admin@123
- [x] Can create products when logged in
- [x] Cannot create products when logged out
- [x] Logout clears session
- [x] Token persists on page refresh
- [x] Token sent in Authorization header
- [x] Invalid token shows error
- [x] Public product list works without auth
- [x] Role-based features restricted appropriately

**Status**: ✅ **READY FOR PRODUCTION** (with security enhancements)

---

## 🔒 Pre-Production Checklist

Before deploying to production:

- [ ] Change demo credentials (admin/admin@123)
- [ ] Set JWT_SECRET to strong random value
- [ ] Enable HTTPS
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Implement token refresh mechanism
- [ ] Add rate limiting to login endpoint
- [ ] Enable CSRF protection
- [ ] Add audit logging for auth events
- [ ] Test with real-world load
- [ ] Set up monitoring/alerting

---

**Documentation Version**: 1.0  
**Last Updated**: March 9, 2026  
**Status**: ✅ Complete
