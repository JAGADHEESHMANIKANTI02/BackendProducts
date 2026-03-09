# API Testing Guide

This document provides examples and instructions for testing all API endpoints.

## Tools Required

- **cURL** (Command line) - included with most systems
- **Postman** (GUI) - download from https://www.postman.com
- **VS Code REST Client** - Extension for VS Code

## Base URL

```
http://localhost:3000
```

## 1. Health Check Endpoint

### Request

```http
GET /health HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/health
```

### Response

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-09T10:00:00.000Z"
}
```

---

## 2. GET /api/products - Retrieve All Products

### Request

```http
GET /api/products HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/api/products
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "count": 2,
  "data": [
    {
      "product_id": 1,
      "product_name": "Laptop",
      "price": "999.99",
      "category": "Electronics",
      "stock": 5,
      "created_at": "2024-03-09T10:00:00.000Z",
      "updated_at": "2024-03-09T10:00:00.000Z"
    },
    {
      "product_id": 2,
      "product_name": "Mouse",
      "price": "29.99",
      "category": "Electronics",
      "stock": 50,
      "created_at": "2024-03-09T10:01:00.000Z",
      "updated_at": "2024-03-09T10:01:00.000Z"
    }
  ]
}
```

---

## 3. POST /api/products - Create New Product

### Request

```http
POST /api/products HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 75

{
  "product_name": "Monitor",
  "price": 299.99,
  "category": "Electronics",
  "stock": 8
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Monitor",
    "price": 299.99,
    "category": "Electronics",
    "stock": 8
  }'
```

### PowerShell

```powershell
$body = @{
    product_name = "Monitor"
    price = 299.99
    category = "Electronics"
    stock = 8
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/products" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product_id": 3,
    "product_name": "Monitor",
    "price": "299.99",
    "category": "Electronics",
    "stock": 8,
    "created_at": "2024-03-09T10:02:00.000Z",
    "updated_at": "2024-03-09T10:02:00.000Z"
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid input",
  "details": ["product_name is required", "price must be a number"]
}
```

---

## 4. GET /api/products/:id - Get Single Product

### Request

```http
GET /api/products/1 HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/api/products/1
```

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Laptop",
    "price": "999.99",
    "category": "Electronics",
    "stock": 5,
    "created_at": "2024-03-09T10:00:00.000Z",
    "updated_at": "2024-03-09T10:00:00.000Z"
  }
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## 5. PUT /api/products/:id/stock - Update Product Stock

### Request

```http
PUT /api/products/1/stock HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 14

{
  "stock": 15
}
```

### cURL

```bash
curl -X PUT http://localhost:3000/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"stock": 15}'
```

### PowerShell

```powershell
$body = @{ stock = 15 } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/products/1/stock" `
  -Method Put `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Product stock updated successfully",
  "data": {
    "product_id": 1,
    "product_name": "Laptop",
    "price": "999.99",
    "category": "Electronics",
    "stock": 15,
    "created_at": "2024-03-09T10:00:00.000Z",
    "updated_at": "2024-03-09T10:05:00.000Z"
  }
}
```

---

## 6. GET /api/products/category/:category - Products by Category

### Request

```http
GET /api/products/category/Electronics HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/api/products/category/Electronics
```

### Response (200 OK)

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "product_id": 3,
      "product_name": "Monitor",
      "price": "299.99",
      "category": "Electronics",
      "stock": 8,
      "created_at": "2024-03-09T10:02:00.000Z",
      "updated_at": "2024-03-09T10:02:00.000Z"
    },
    {
      "product_id": 2,
      "product_name": "Mouse",
      "price": "29.99",
      "category": "Electronics",
      "stock": 50,
      "created_at": "2024-03-09T10:01:00.000Z",
      "updated_at": "2024-03-09T10:01:00.000Z"
    },
    {
      "product_id": 1,
      "product_name": "Laptop",
      "price": "999.99",
      "category": "Electronics",
      "stock": 15,
      "created_at": "2024-03-09T10:00:00.000Z",
      "updated_at": "2024-03-09T10:05:00.000Z"
    }
  ]
}
```

---

## 7. DELETE /api/products/:id - Delete Product

### Request

```http
DELETE /api/products/1 HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl -X DELETE http://localhost:3000/api/products/1
```

### PowerShell

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/products/1" `
  -Method Delete
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Testing with Postman

### Import Collection Steps:

1. Create new collection named "Product API"
2. Create requests for each endpoint:

| Method | URL                                          | Name              |
| ------ | -------------------------------------------- | ----------------- |
| GET    | {{base_url}}/health                          | Health Check      |
| GET    | {{base_url}}/api/products                    | Get All Products  |
| POST   | {{base_url}}/api/products                    | Create Product    |
| GET    | {{base_url}}/api/products/:id                | Get Product by ID |
| GET    | {{base_url}}/api/products/category/:category | Get by Category   |
| PUT    | {{base_url}}/api/products/:id/stock          | Update Stock      |
| DELETE | {{base_url}}/api/products/:id                | Delete Product    |

3. Set Environment Variable:
   - Variable: `base_url`
   - Value: `http://localhost:3000`

### Sample Test Sequence:

```
1. Create Product A
2. Create Product B
3. Get All Products
4. Get Product by ID (from step 1)
5. Get by Category
6. Update Stock
7. Delete Product A
8. Get All Products (verify deletion)
```

---

## Testing with VS Code REST Client

Create `test.http` file:

```http
### Variables
@baseUrl = http://localhost:3000

### Health Check
GET {{baseUrl}}/health

### Get All Products
GET {{baseUrl}}/api/products

### Create Product
POST {{baseUrl}}/api/products
Content-Type: application/json

{
  "product_name": "Keyboard",
  "price": 79.99,
  "category": "Electronics",
  "stock": 25
}

### Get Single Product
GET {{baseUrl}}/api/products/1

### Get by Category
GET {{baseUrl}}/api/products/category/Electronics

### Update Stock
PUT {{baseUrl}}/api/products/1/stock
Content-Type: application/json

{
  "stock": 20
}

### Delete Product
DELETE {{baseUrl}}/api/products/1
```

---

## Common Errors and Solutions

### 400 Bad Request

**Cause**: Missing or invalid required fields
**Solution**: Verify all required fields are present and have correct types

### 404 Not Found

**Cause**: Product ID doesn't exist or route not found
**Solution**: Verify the product ID exists in database

### 500 Internal Server Error

**Cause**: Database connection issue or query error
**Solution**:

- Check database is running
- Verify .env configuration
- Check server logs

### Connection Refused

**Cause**: Server is not running
**Solution**: Run `npm start` in terminal

---

## Load Testing Example

Using Apache Bench (ab):

```bash
# Get 1000 requests
ab -n 1000 -c 10 http://localhost:3000/api/products

# POST requests for load testing
ab -n 100 -c 5 -p product.json -T application/json http://localhost:3000/api/products
```

---

## Sample Data for Testing

```json
[
  {
    "product_name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 5
  },
  {
    "product_name": "Mouse",
    "price": 29.99,
    "category": "Electronics",
    "stock": 50
  },
  {
    "product_name": "Desk Chair",
    "price": 199.99,
    "category": "Furniture",
    "stock": 12
  },
  {
    "product_name": "Monitor",
    "price": 299.99,
    "category": "Electronics",
    "stock": 8
  },
  {
    "product_name": "Keyboard",
    "price": 79.99,
    "category": "Electronics",
    "stock": 25
  }
]
```
