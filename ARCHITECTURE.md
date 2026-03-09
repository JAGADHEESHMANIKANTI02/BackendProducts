# Project Architecture Documentation

This document explains the new MVC architecture of the Product REST API.

## Project Structure

```
d:\BackendAssignement\
├── config/
│   ├── database.js        # PostgreSQL connection pool
│   └── constants.js       # Global constants and configuration values
├── controllers/
│   └── productController.js   # Product business logic handlers
├── models/
│   └── productModel.js        # Database queries and data access layer
├── routes/
│   └── productRoutes.js       # API endpoint definitions
├── middleware/
│   ├── validation.js          # Request validation middleware
│   ├── errorHandler.js        # Error handling and 404 middleware
│   └── requestLogger.js       # Request logging middleware
├── utils/
│   └── validators.js          # Validation helper functions
├── server.js              # Main Express application
├── db.js                  # (OLD - Deprecated, use config/database.js)
├── schema.sql             # PostgreSQL database schema
├── schema-mysql.sql       # MySQL database schema (alternative)
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── README.md              # API documentation
├── QUICK_START.md         # Quick setup guide
├── DATABASE_GUIDE.md      # Database configuration guide
└── ARCHITECTURE.md        # This file
```

## Architecture Overview

### Layered Architecture Pattern

The application follows a **Layered Architecture** pattern:

```
┌─────────────────────────────────────────┐
│         CLIENT (HTTP Requests)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  SERVER.JS (Express App & Middleware)   │
│  - cors, bodyParser                     │
│  - requestLogger, errorHandler          │
│  - route initialization                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ ROUTES (productRoutes.js)               │
│ - Define endpoints                      │
│ - Map to controllers                    │
│ - Apply validation middleware           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ CONTROLLERS (productController.js)      │
│ - Handle business logic                 │
│ - Coordinate requests and responses     │
│ - Call model methods                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ MODELS (productModel.js)                │
│ - Database queries                      │
│ - Data access layer                     │
│ - Query execution                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│ DATABASE (config/database.js)           │
│ - Connection pool                       │
│ - PostgreSQL driver                     │
└─────────────────┬───────────────────────┘
                  │
         ┌────────▼────────┐
         │   PostgreSQL    │
         │   Database      │
         └─────────────────┘
```

## Component Details

### 1. **Config Layer** (`config/`)

#### `database.js`

- **Purpose**: Database connection management
- **Key Features**:
  - PostgreSQL connection pool
  - Event handlers for connection lifecycle
  - Error handling for connection issues
- **Usage**: Required by models to execute queries

```javascript
const pool = require("./config/database");
const result = await pool.query(sql, values);
```

#### `constants.js`

- **Purpose**: Centralized configuration constants
- **Key Features**:
  - HTTP status codes
  - API messages
  - Validation rules
  - Database constraints
- **Usage**: Import throughout the application for consistent values

```javascript
const { HTTP_STATUS, MESSAGES } = require("./config/constants");
res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PRODUCT_CREATED });
```

### 2. **Models Layer** (`models/`)

#### `productModel.js`

- **Purpose**: Data access layer - handles all database operations
- **Key Methods**:
  - `getAllProducts()` - Fetch all products
  - `getProductById(id)` - Fetch single product
  - `createProduct(data)` - Insert new product
  - `updateProductStock(id, stock)` - Update stock
  - `deleteProduct(id)` - Delete product
  - `getProductsByCategory(category)` - Filter by category
- **Key Features**:
  - Isolated database queries
  - Error handling for database operations
  - Reusable database methods
- **Best Practice**: Models should ONLY contain database operations, no business logic

```javascript
// Usage in controllers
const product = await productModel.createProduct({ ... });
```

### 3. **Controllers Layer** (`controllers/`)

#### `productController.js`

- **Purpose**: Business logic and request handling
- **Key Methods**:
  - `getAllProducts(req, res, next)` - GET /api/products
  - `createProduct(req, res, next)` - POST /api/products
  - `updateProductStock(req, res, next)` - PUT /api/products/:id/stock
  - `getProductById(req, res, next)` - GET /api/products/:id
  - `deleteProduct(req, res, next)` - DELETE /api/products/:id
  - `getProductsByCategory(req, res, next)` - GET /api/products/category/:category
- **Key Features**:
  - Validates input data
  - Coordinates between routes and models
  - Formats API responses
  - Delegates to next middleware on errors

```javascript
// Pattern used in controllers
const data = await model.fetchData();
res.status(200).json({ success: true, data });
```

### 4. **Routes Layer** (`routes/`)

#### `productRoutes.js`

- **Purpose**: Define all product API endpoints
- **Key Routes**:
  - `GET /` → getAllProducts
  - `POST /` → createProduct (with validation middleware)
  - `GET /category/:category` → getProductsByCategory
  - `GET /:id` → getProductById
  - `PUT /:id/stock` → updateProductStock (with validation middleware)
  - `DELETE /:id` → deleteProduct
- **Best Practice**: Routes should be simple mappings of HTTP methods to controller methods

```javascript
router.post("/", validateProductCreation, productController.createProduct);
```

### 5. **Middleware Layer** (`middleware/`)

#### `validation.js`

- **Purpose**: Input validation middleware
- **Functions**:
  - `validateRequestBody()` - Ensures request body exists
  - `validateContentType()` - Validates JSON content type
  - `validateProductCreation()` - Validates product data
  - `validateStockUpdate()` - Validates stock data
- **Placement**: Applied at route level before controller execution

#### `errorHandler.js`

- **Purpose**: Centralized error handling
- **Functions**:
  - `errorHandler()` - Global error handler (last middleware)
  - `notFoundHandler()` - 404 Not Found handler
- **Features**:
  - Catches all errors from controllers
  - Formats error responses consistently
  - Provides detailed errors in development mode
- **Placement**: Must be the last middleware in app

#### `requestLogger.js`

- **Purpose**: Request logging and monitoring
- **Features**:
  - Logs incoming requests
  - Tracks response time
  - Color-coded HTTP status codes
- **Placement**: Applied globally to all requests

### 6. **Utils Layer** (`utils/`)

#### `validators.js`

- **Purpose**: Reusable validation functions
- **Functions**:
  - `validateProductData()` - Validate full product object
  - `validateStockData()` - Validate stock field
  - `validateProductId()` - Validate product ID
- **Key Features**:
  - Returns validation status and error messages
  - Centralized validation logic
  - Reusable across multiple controllers

### 7. **Server Entry Point** (`server.js`)

- **Purpose**: Express application setup and initialization
- **Key Responsibilities**:
  - Initialize Express app
  - Apply global middleware
  - Mount routes
  - Set up error handling
  - Start server
- **Key Features**:
  - Clean and simple
  - All complexity delegated to other modules
  - Health check endpoint (`/health`)

## Data Flow Example

Here's how a POST request flows through the system:

```
1. HTTP Request arrives at /api/products
   │
2. Middleware: cors, bodyParser, requestLogger
   │
3. Route: productRoutes.js receives request
   │
4. Route Validation: validateProductCreation middleware
   │
5. Controller: productController.createProduct()
   ├─ Extracts req.body
   ├─ Validates using utils/validators.js
   │
6. Model: productModel.createProduct()
   ├─ Executes INSERT query
   ├─ Returns created product
   │
7. Controller: Formats response
   │
8. Response sent back to client
   │
9. errorHandler catches any errors
```

## Request-Response Lifecycle

### Successful Request

```
Request → Router → Validation Middleware → Controller → Model → Database
                                                          ↓
Response ← Controller ← Model Response ← Database
```

### Error Handling

```
Request → Router → Validation Middleware → Controller → Model
                         ↓ (Error)                       ↓ (Error)
         errorHandler catches error
                         ↓
         Formats error response
                         ↓
                      Response
```

## Advantages of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Maintainability**: Easy to locate and modify code
3. **Testability**: Each component can be tested independently
4. **Scalability**: Easy to add new features without affecting existing code
5. **Reusability**: Models and validators can be reused across controllers
6. **Error Handling**: Centralized error handling in one place
7. **Code Organization**: Logical file structure makes navigation easier
8. **Database Abstraction**: Database operations isolated in models

## Adding New Features

### Example: Add a new "Update Product Details" endpoint

1. **Create Route** (productRoutes.js):

```javascript
router.put("/:id", validateProductUpdate, productController.updateProduct);
```

2. **Create Validator** (middleware/validation.js):

```javascript
const validateProductUpdate = (req, res, next) => { ... };
```

3. **Create Model Method** (models/productModel.js):

```javascript
const updateProduct = async (id, data) => { ... };
```

4. **Create Controller Method** (controllers/productController.js):

```javascript
const updateProduct = async (req, res, next) => { ... };
```

5. **Update Constants** (config/constants.js):

```javascript
PRODUCT_UPDATED: "Product updated successfully";
```

## Middleware Execution Order

```javascript
1. requestLogger          // Logs all requests
2. cors                   // Handle CORS
3. bodyParser.json()      // Parse JSON
4. bodyParser.urlencoded  // Parse form data
5. validateRequestBody    // Validate request body exists
6. validateContentType    // Validate content type
7. Route Handler          // Find matching route
8. Route Validation       // Apply route-specific validation
9. Controller             // Execute business logic
10. errorHandler          // Catch any errors
11. notFoundHandler       // Handle 404s (if no route matches)
```

## Migration from Old Structure

The old `server.js` had all logic in one file. The new structure:

- ✓ Separates concerns into different layers
- ✓ Makes code more maintainable
- ✓ Allows easier testing
- ✓ Follows industry best practices
- ✓ Scales better as project grows

## Best Practices Implemented

1. **Async/Await**: All database operations use async/await
2. **Error Handling**: Errors propagate to error handler middleware
3. **Validation**: Input validated before database operations
4. **Constants**: No magic strings or numbers
5. **Comments**: Clear documentation of functions
6. **DRY**: Reusable validators and helper functions
7. **Single Responsibility**: Each function has one purpose
8. **Database Pooling**: Connection efficiency with pooling

## Environment Configuration

The app respects `.env` file for configuration:

- `DB_USER`, `DB_HOST`, `DB_DATABASE`, `DB_PASSWORD`, `DB_PORT`
- `PORT`, `NODE_ENV`

See `.env.example` for all available options.
