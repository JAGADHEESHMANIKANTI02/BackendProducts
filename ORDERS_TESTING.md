# Orders API Testing Guide

Complete testing examples for the Order Management API endpoints.

## Base URL

```
http://localhost:3000
```

## Order Endpoints

| Method | Endpoint                    | Purpose                |
| ------ | --------------------------- | ---------------------- |
| POST   | /api/orders                 | Create a new order     |
| GET    | /api/orders                 | Retrieve all orders    |
| GET    | /api/orders/:id             | Get single order by ID |
| PUT    | /api/orders/:id/status      | Update order status    |
| GET    | /api/orders/customer/:email | Get orders by customer |

---

## 1. POST /api/orders - Create Order

### Request

```http
POST /api/orders HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1-234-567-8900",
  "delivery_address": "123 Main St, Springfield, IL 62701",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 5
    }
  ]
}
```

### Key Features

- ✓ Validates customer details
- ✓ Checks product existence
- ✓ Verifies stock availability
- ✓ Reduces stock automatically
- ✓ Calculates total amount
- ✓ Creates order with items
- ✓ Atomic transaction (all or nothing)

### cURL

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1-234-567-8900",
    "delivery_address": "123 Main St, Springfield, IL 62701",
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 5}
    ]
  }'
```

### PowerShell

```powershell
$body = @{
    customer_name = "John Doe"
    customer_email = "john@example.com"
    customer_phone = "+1-234-567-8900"
    delivery_address = "123 Main St, Springfield, IL 62701"
    items = @(
        @{ product_id = 1; quantity = 2 },
        @{ product_id = 2; quantity = 5 }
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/orders" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1-234-567-8900",
    "delivery_address": "123 Main St, Springfield, IL 62701",
    "total_amount": "13999.95",
    "order_status": "pending",
    "created_at": "2024-03-09T10:30:00.000Z",
    "updated_at": "2024-03-09T10:30:00.000Z",
    "items": [
      {
        "order_item_id": 1,
        "product_id": 1,
        "product_name": "Laptop",
        "quantity": 2,
        "unit_price": "999.99",
        "subtotal": "1999.98"
      },
      {
        "order_item_id": 2,
        "product_id": 2,
        "product_name": "Mouse",
        "quantity": 5,
        "unit_price": "29.99",
        "subtotal": "149.95"
      }
    ]
  }
}
```

### Error Response - Insufficient Stock (400 Bad Request)

```json
{
  "success": false,
  "error": "Insufficient stock for product Laptop. Available: 3, Required: 5"
}
```

### Error Response - Missing Fields (400 Bad Request)

```json
{
  "success": false,
  "error": "Missing required fields",
  "details": ["customer_name is required", "delivery_address is required"]
}
```

### Error Response - Product Not Found (400 Bad Request)

```json
{
  "success": false,
  "error": "Product with ID 999 not found"
}
```

---

## 2. GET /api/orders - Get All Orders

### Request

```http
GET /api/orders HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/api/orders
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "count": 2,
  "data": [
    {
      "order_id": 2,
      "customer_name": "Jane Smith",
      "customer_email": "jane@example.com",
      "customer_phone": "+1-956-234-5678",
      "delivery_address": "456 Oak Ave, Boston, MA 02101",
      "total_amount": "379.95",
      "order_status": "pending",
      "created_at": "2024-03-09T10:35:00.000Z",
      "updated_at": "2024-03-09T10:35:00.000Z",
      "items": [
        {
          "order_item_id": 3,
          "product_id": 3,
          "product_name": "Monitor",
          "quantity": 1,
          "unit_price": "299.99",
          "subtotal": "299.99"
        }
      ]
    },
    {
      "order_id": 1,
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "+1-234-567-8900",
      "delivery_address": "123 Main St, Springfield, IL 62701",
      "total_amount": "1999.98",
      "order_status": "pending",
      "created_at": "2024-03-09T10:30:00.000Z",
      "updated_at": "2024-03-09T10:30:00.000Z",
      "items": [...]
    }
  ]
}
```

---

## 3. GET /api/orders/:id - Get Single Order

### Request

```http
GET /api/orders/1 HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/api/orders/1
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1-234-567-8900",
    "delivery_address": "123 Main St, Springfield, IL 62701",
    "total_amount": "1999.98",
    "order_status": "pending",
    "created_at": "2024-03-09T10:30:00.000Z",
    "updated_at": "2024-03-09T10:30:00.000Z",
    "items": [
      {
        "order_item_id": 1,
        "product_id": 1,
        "product_name": "Laptop",
        "quantity": 2,
        "unit_price": "999.99",
        "subtotal": "1999.98"
      }
    ]
  }
}
```

### Error Response (404 Not Found)

```json
{
  "success": false,
  "error": "Order not found"
}
```

---

## 4. PUT /api/orders/:id/status - Update Order Status

### Request

```http
PUT /api/orders/1/status HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "status": "shipped"
}
```

### Valid Status Values

- `pending` - Order received, awaiting confirmation
- `confirmed` - Order confirmed, preparing to ship
- `shipped` - Order dispatched
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

### cURL

```bash
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'
```

### PowerShell

```powershell
$body = @{ status = "shipped" } | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/orders/1/status" `
  -Method Put `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1-234-567-8900",
    "delivery_address": "123 Main St, Springfield, IL 62701",
    "total_amount": "1999.98",
    "order_status": "shipped",
    "created_at": "2024-03-09T10:30:00.000Z",
    "updated_at": "2024-03-09T10:40:00.000Z"
  }
}
```

### Error Response - Invalid Status (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid status",
  "details": [
    "status must be one of: pending, confirmed, shipped, delivered, cancelled"
  ]
}
```

---

## 5. GET /api/orders/customer/:email - Get Orders by Customer

### Request

```http
GET /api/orders/customer/john@example.com HTTP/1.1
Host: localhost:3000
```

### cURL

```bash
curl http://localhost:3000/api/orders/customer/john@example.com
```

### Response (200 OK)

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "order_id": 2,
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "+1-234-567-8900",
      "delivery_address": "789 Elm Street, Springfield, IL 62701",
      "total_amount": "599.95",
      "order_status": "delivered",
      "created_at": "2024-03-08T14:20:00.000Z",
      "updated_at": "2024-03-08T18:00:00.000Z",
      "items": [...]
    },
    {
      "order_id": 1,
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "+1-234-567-8900",
      "delivery_address": "123 Main St, Springfield, IL 62701",
      "total_amount": "1999.98",
      "order_status": "shipped",
      "created_at": "2024-03-09T10:30:00.000Z",
      "updated_at": "2024-03-09T10:40:00.000Z",
      "items": [...]
    }
  ]
}
```

---

## Test Sequence

### Step 1: Create Sample Products

```bash
# Create Laptop
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Laptop","price":999.99,"category":"Electronics","stock":10}'

# Create Mouse
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Mouse","price":29.99,"category":"Electronics","stock":50}'

# Create Monitor
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Monitor","price":299.99,"category":"Electronics","stock":8}'
```

### Step 2: Create Orders

```bash
# Order 1 (should succeed)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1-234-567-8900",
    "delivery_address": "123 Main St, Springfield, IL",
    "items": [{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 3}]
  }'

# Order 2 (should succeed if stock available)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Jane Smith",
    "customer_email": "jane@example.com",
    "customer_phone": "+1-956-234-5678",
    "delivery_address": "456 Oak Ave, Boston, MA",
    "items": [{"product_id": 3, "quantity": 1}]
  }'
```

### Step 3: Verify Stock Reduction

```bash
# Check product 1 stock (should be reduced)
curl http://localhost:3000/api/products/1

# Check product 2 stock (should be reduced)
curl http://localhost:3000/api/products/2
```

### Step 4: Get Orders

```bash
# Get all orders
curl http://localhost:3000/api/orders

# Get specific order
curl http://localhost:3000/api/orders/1

# Get customer orders
curl http://localhost:3000/api/orders/customer/john@example.com
```

### Step 5: Update Order Status

```bash
# Change status to confirmed
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'

# Change status to shipped
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'

# Change status to delivered
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

---

## Error Handling Examples

### Insufficient Stock

```bash
# Try to order 100 units of a product with only 10 in stock
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "delivery_address": "Test Address",
    "items": [{"product_id": 1, "quantity": 100}]
  }'

# Response:
# {
#   "success": false,
#   "error": "Insufficient stock for product Laptop. Available: 8, Required: 100"
# }
```

### Invalid Email

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "invalid-email",
    "delivery_address": "Test Address",
    "items": [{"product_id": 1, "quantity": 1}]
  }'

# Response:
# {
#   "success": false,
#   "error": "Invalid input",
#   "details": ["customer_email must be a valid email address"]
# }
```

### Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User"
  }'

# Response:
# {
#   "success": false,
#   "error": "Missing required fields",
#   "details": [
#     "customer_email is required",
#     "delivery_address is required",
#     "at least one item is required"
#   ]
# }
```

---

## Database Impact

### When an order is created:

1. ✓ Validates all customer information
2. ✓ Checks each product exists
3. ✓ Verifies sufficient stock for each item
4. ✓ Creates an order record
5. ✓ Creates order_items records
6. ✓ **Reduces product stock automatically**
7. ✓ Calculates total amount
8. ✓ All in a single atomic transaction

### If any step fails:

- ❌ Entire order is rolled back
- ❌ No stock is reduced
- ❌ Order is not created
- ❌ Error message explains the problem

---

## Performance Notes

- ✓ Uses database transactions for data consistency
- ✓ Indexes on order IDs and customer emails
- ✓ Efficient JSON aggregation for order items
- ✓ Stock reduction is immediate
- ✓ Prevents double-booking with ACID properties

---

## Sample Test Data

```json
[
  {
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1-234-567-8900",
    "delivery_address": "123 Main St, Springfield, IL 62701",
    "items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 2, "quantity": 5 }
    ]
  },
  {
    "customer_name": "Jane Smith",
    "customer_email": "jane@example.com",
    "customer_phone": "+1-956-234-5678",
    "delivery_address": "456 Oak Ave, Boston, MA 02101",
    "items": [{ "product_id": 3, "quantity": 1 }]
  },
  {
    "customer_name": "Bob Johnson",
    "customer_email": "bob@example.com",
    "customer_phone": "+1-505-456-7890",
    "delivery_address": "789 Pine Rd, Denver, CO 80202",
    "items": [{ "product_id": 2, "quantity": 10 }]
  }
]
```
