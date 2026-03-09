# Product REST API

A REST API built with Node.js, Express, and PostgreSQL for managing product inventory.

## Project Structure

```
.
├── server.js        # Main Express server with API endpoints
├── db.js           # PostgreSQL connection pool
├── schema.sql      # Database schema
├── package.json    # Project dependencies
├── .env            # Environment variables
└── README.md       # This file
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

**Option A: Using psql command line**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE product_db;

# Connect to the new database
\c product_db

# Run the schema file
\i schema.sql
```

**Option B: Using pgAdmin or another GUI tool**

1. Create a new database named `product_db`
2. Run the SQL code from `schema.sql` in the query editor

### 3. Configure Environment Variables

Edit the `.env` file with your PostgreSQL credentials:

```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=product_db
DB_PASSWORD=your_actual_password
DB_PORT=5432
PORT=3000
NODE_ENV=development
```

Replace `your_actual_password` with your PostgreSQL password.

## Running the API

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. GET /api/products

Retrieve all products from the database.

**Request:**

```
GET http://localhost:3000/api/products
```

**Response (200 OK):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "product_id": 1,
      "product_name": "Laptop",
      "price": "999.99",
      "category": "Electronics",
      "stock": 5,
      "created_at": "2024-03-09T10:30:00.000Z",
      "updated_at": "2024-03-09T10:30:00.000Z"
    },
    {
      "product_id": 2,
      "product_name": "Mouse",
      "price": "29.99",
      "category": "Electronics",
      "stock": 50,
      "created_at": "2024-03-09T10:31:00.000Z",
      "updated_at": "2024-03-09T10:31:00.000Z"
    }
  ]
}
```

### 2. POST /api/products

Add a new product to the database.

**Request:**

```
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "product_name": "Monitor",
  "price": 299.99,
  "category": "Electronics",
  "stock": 8
}
```

**Response (201 Created):**

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
    "created_at": "2024-03-09T10:32:00.000Z",
    "updated_at": "2024-03-09T10:32:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Missing required fields",
  "required": ["product_name", "price", "category", "stock"]
}
```

### 3. PUT /api/products/:id/stock

Update the stock quantity of a specific product.

**Request:**

```
PUT http://localhost:3000/api/products/1/stock
Content-Type: application/json

{
  "stock": 10
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Product stock updated successfully",
  "data": {
    "product_id": 1,
    "product_name": "Laptop",
    "price": "999.99",
    "category": "Electronics",
    "stock": 10,
    "created_at": "2024-03-09T10:30:00.000Z",
    "updated_at": "2024-03-09T10:35:00.000Z"
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Product not found"
}
```

## Testing with cURL or Postman

### Using cURL

**Get all products:**

```bash
curl http://localhost:3000/api/products
```

**Add a new product:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Keyboard","price":79.99,"category":"Electronics","stock":25}'
```

**Update product stock:**

```bash
curl -X PUT http://localhost:3000/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"stock":15}'
```

### Using Postman

1. Import the endpoints into Postman
2. Create a new request for each endpoint
3. Set the method (GET, POST, PUT)
4. Set the URL (http://localhost:3000/api/products)
5. For POST and PUT, set the body to raw JSON

## Database Schema

The `products` table includes:

| Column       | Type          | Constraints                             |
| ------------ | ------------- | --------------------------------------- |
| product_id   | SERIAL        | PRIMARY KEY, AUTO_INCREMENT             |
| product_name | VARCHAR(255)  | NOT NULL                                |
| price        | DECIMAL(10,2) | NOT NULL, CHECK (price > 0)             |
| category     | VARCHAR(100)  | NOT NULL                                |
| stock        | INTEGER       | NOT NULL, DEFAULT 0, CHECK (stock >= 0) |
| created_at   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP               |
| updated_at   | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP               |

## Features Implemented

✓ GET /api/products - Retrieve all products  
✓ POST /api/products - Add a new product  
✓ PUT /api/products/:id/stock - Update product stock  
✓ Input validation and error handling  
✓ CORS support  
✓ JSON responses  
✓ PostgreSQL integration  
✓ Connection pooling  
✓ Indexed database queries

## Error Handling

The API returns appropriate HTTP status codes:

- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request
- **400 Bad Request** - Missing or invalid fields
- **404 Not Found** - Product not found
- **500 Internal Server Error** - Database or server error

## Future Enhancements

- Add authentication/authorization (JWT)
- Add pagination for product list
- Add search/filter functionality
- Add request logging middleware
- Add API documentation with Swagger
- Add unit and integration tests
- Add update product details endpoint
- Add delete product endpoint
- Add product-specific GET endpoint (by ID)

## License

ISC
