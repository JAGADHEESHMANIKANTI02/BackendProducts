# Project File Structure Explained

This guide explains what each file and folder does in the project.

## Folder Structure

```
d:\BackendAssignement\
│
├── config/                    ← Configuration files
│   ├── database.js           - Database connection pool
│   └── constants.js          - Global constants
│
├── controllers/              ← Business logic handlers
│   └── productController.js  - Product operation logic
│
├── models/                   ← Database operations
│   └── productModel.js       - Product database queries
│
├── routes/                   ← API endpoint definitions
│   └── productRoutes.js      - Product routes
│
├── middleware/               ← Request processing
│   ├── validation.js         - Input validation
│   ├── errorHandler.js       - Error handling
│   └── requestLogger.js      - Request logging
│
├── utils/                    ← Helper functions
│   └── validators.js         - Validation utilities
│
├── server.js                 ← Main Express app (START HERE)
├── db.js                     ← OLD database file (deprecated)
├── schema.sql                ← PostgreSQL database schema
├── schema-mysql.sql          ← MySQL alternative schema
│
├── .env                      ← Database credentials (don't share)
├── .env.example              ← Example .env template
├── .gitignore                ← Git ignore rules
│
├── package.json              ← Project dependencies
│
└── Documentation files:
    ├── README.md             - Main API documentation
    ├── QUICK_START.md        - 5-minute setup guide
    ├── ARCHITECTURE.md       - Architecture overview
    ├── DATABASE_GUIDE.md     - Database configuration
    ├── API_TESTING.md        - API testing guide
    └── FILE_STRUCTURE.md     - This file
```

## File Descriptions

### Configuration Layer (`config/`)

#### `config/database.js`

```
Purpose: Database Connection
├─ Creates PostgreSQL connection pool
├─ Manages database connections
└─ Handles connection events
```

**What it does**:

- Connects to PostgreSQL server
- Creates a pool of reusable connections
- Logs connection events
- Handles connection errors

**Used by**: All model files

**Example**:

```javascript
const pool = require("./config/database");
const result = await pool.query("SELECT * FROM products");
```

---

#### `config/constants.js`

```
Purpose: Centralized Configuration
├─ HTTP status codes (200, 201, 400, 404, 500)
├─ API messages (Product created, Not found, etc.)
├─ Validation rules
└─ Database constraints
```

**What it does**:

- Stores all constant values
- Prevents "magic numbers" in code
- Makes changes easy (one place to update)

**Used by**: Controllers, middleware, validators

**Example**:

```javascript
const { HTTP_STATUS, MESSAGES } = require("./config/constants");
res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PRODUCT_CREATED });
```

---

### Models Layer (`models/`)

#### `models/productModel.js`

```
Purpose: Database Operations
├─ GET all products
├─ GET product by ID
├─ POST new product
├─ PUT update stock
├─ DELETE product
└─ GET by category
```

**What it does**:

- Executes SQL queries
- Returns database results
- Handles database errors
- NOTHING ELSE (no business logic here)

**Used by**: Controllers

**Methods**:

- `getAllProducts()` - SELECT all products
- `getProductById(id)` - SELECT by ID
- `createProduct(data)` - INSERT new
- `updateProductStock(id, stock)` - UPDATE stock
- `deleteProduct(id)` - DELETE product
- `getProductsByCategory(category)` - SELECT by category

**Example**:

```javascript
// In controller
const products = await productModel.getAllProducts();
```

---

### Controllers Layer (`controllers/`)

#### `controllers/productController.js`

```
Purpose: Business Logic & Request Handling
├─ Validate input
├─ Call model methods
├─ Process responses
└─ Handle errors
```

**What it does**:

- Receives HTTP requests
- Validates data
- Calls model methods
- Formats responses
- Delegates errors

**Used by**: Routes

**Methods** (one per endpoint):

- `getAllProducts(req, res, next)`
- `createProduct(req, res, next)`
- `updateProductStock(req, res, next)`
- `getProductById(req, res, next)`
- `deleteProduct(req, res, next)`
- `getProductsByCategory(req, res, next)`

**Typical Pattern**:

```javascript
const productController = {
  createProduct: async (req, res, next) => {
    try {
      // 1. Validate input
      const validation = validateProductData(req.body);
      if (!validation.isValid) return error_response;

      // 2. Call model
      const product = await productModel.createProduct(req.body);

      // 3. Send response
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      // 4. Delegate error
      next(error);
    }
  },
};
```

---

### Routes Layer (`routes/`)

#### `routes/productRoutes.js`

```
Purpose: API Endpoint Definitions
├─ GET /
├─ POST /
├─ GET /category/:category
├─ GET /:id
├─ PUT /:id/stock
└─ DELETE /:id
```

**What it does**:

- Maps HTTP methods to endpoints
- Links endpoints to controllers
- Applies validation middleware
- Simple and clean

**Routes**:

| Method | Path                | Handler               | Middleware              |
| ------ | ------------------- | --------------------- | ----------------------- |
| GET    | /                   | getAllProducts        | -                       |
| POST   | /                   | createProduct         | validateProductCreation |
| GET    | /category/:category | getProductsByCategory | -                       |
| GET    | /:id                | getProductById        | -                       |
| PUT    | /:id/stock          | updateProductStock    | validateStockUpdate     |
| DELETE | /:id                | deleteProduct         | -                       |

**Example**:

```javascript
// Simple route definition
router.post(
  "/", // Path
  validateProductCreation, // Middleware
  productController.createProduct, // Handler
);
```

---

### Middleware Layer (`middleware/`)

#### `middleware/validation.js`

```
Purpose: Input Validation
├─ validateRequestBody()
├─ validateContentType()
├─ validateProductCreation()
└─ validateStockUpdate()
```

**What it does**:

- Validates request body
- Checks Content-Type header
- Validates product data
- Validates stock data
- Rejects invalid requests early

**Usage**: Applied to routes that need validation

**Example**:

```javascript
app.post("/api/products", validateProductCreation, handler);
```

---

#### `middleware/errorHandler.js`

```
Purpose: Error Handling & 404
├─ errorHandler() - Catches all errors
└─ notFoundHandler() - Handles 404s
```

**What it does**:

- Catches errors from controllers
- Formats error responses
- Handles 404 Not Found
- Returns appropriate status codes

**Must be**: Last middleware in app

**Example Error Response**:

```json
{
  "success": false,
  "error": "Product not found"
}
```

---

#### `middleware/requestLogger.js`

```
Purpose: Request Logging
├─ Logs all incoming requests
├─ Tracks response time
└─ Color-codes by status
```

**What it does**:

- Records HTTP method
- Records URL path
- Tracks request duration
- Shows response status
- Helps with debugging

**Console Output Example**:

```
[2024-03-09T10:00:00.000Z] POST /api/products - Status: 201 (45ms) - IP: ::1
```

---

### Utils Layer (`utils/`)

#### `utils/validators.js`

```
Purpose: Validation Helper Functions
├─ validateProductData()
├─ validateStockData()
└─ validateProductId()
```

**What it does**:

- Validates product form data
- Validates stock updates
- Validates product IDs
- Returns validation errors

**Used by**: Controllers and middleware

**Example**:

```javascript
const validation = validateProductData(data);
if (!validation.isValid) {
  console.log(validation.errors); // Show error details
}
```

---

### Main Application (`server.js`)

```
Purpose: Express Application Setup
├─ Initialize Express
├─ Set up middleware
├─ Define routes
├─ Handle errors
└─ Start server
```

**What it does**:

1. Imports all modules
2. Creates Express app
3. Sets up global middleware
4. Mounts routes
5. Handles 404s and errors
6. Starts server on PORT

**Middleware Order**:

1. requestLogger (log all requests)
2. cors (Handle CORS)
3. bodyParser (Parse JSON)
4. validateRequestBody (Check body exists)
5. validateContentType (Check JSON)
6. Routes
7. errorHandler (Catch errors)
8. notFoundHandler (Handle 404s)

**Important**: Each middleware can call `next()` to pass to next middleware

---

## Data Flow Diagram

```
Client Request
     ↓
server.js (middleware stack)
     ↓
cors, bodyParser, validator
     ↓
productRoutes.js (find matching route)
     ↓
validation middleware (if specified)
     ↓
productController.js (business logic)
     ↓
productModel.js (database query)
     ↓
config/database.js (connection)
     ↓
PostgreSQL Database
```

## How to Add a New Endpoint

Example: Add GET /api/products/search?name=laptop

### Step 1: Create Model Method

```javascript
// models/productModel.js
const searchProducts = async (searchTerm) => {
  const query = "SELECT * FROM products WHERE product_name ILIKE $1";
  const result = await pool.query(query, [`%${searchTerm}%`]);
  return result.rows;
};
```

### Step 2: Create Controller Method

```javascript
// controllers/productController.js
const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "query required" });
    const products = await productModel.searchProducts(query);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
```

### Step 3: Add Route

```javascript
// routes/productRoutes.js
router.get("/search", productController.searchProducts);
```

### Step 4: Update Constants (if needed)

```javascript
// config/constants.js
MESSAGES: {
  SEARCH_COMPLETED: "Search completed";
}
```

---

## File Reading Order

If you're new to the project, read files in this order:

1. **README.md** - Understand what the API does
2. **QUICK_START.md** - Get it running
3. **server.js** - See the entry point
4. **routes/productRoutes.js** - See the endpoints
5. **controllers/productController.js** - See business logic
6. **models/productModel.js** - See database queries
7. **middleware/** - See request processing
8. **config/** - See configuration
9. **ARCHITECTURE.md** - Deep dive into design

---

## Key Concepts

### Separation of Concerns

Each file has ONE job:

- Models → Database
- Controllers → Logic
- Routes → Endpoints
- Middleware → Processing

### Error Handling

Errors flow up to `errorHandler` middleware

### Validation

Input is validated early before database ops

### Constants

No "magic strings" - all in `config/constants.js`

### Reusability

Validators and models can be used by multiple controllers
