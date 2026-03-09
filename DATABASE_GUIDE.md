# Database Configuration Guide

This guide explains how to use either PostgreSQL or MySQL with this API.

## Current Setup: PostgreSQL

The project is currently configured for **PostgreSQL**. All files are ready to use:

- `db.js` - PostgreSQL connection pool
- `schema.sql` - PostgreSQL schema
- `.env` - Example configuration

## Switching to MySQL

If you prefer to use MySQL instead of PostgreSQL, follow these steps:

### 1. Install MySQL driver instead of PostgreSQL

```bash
npm uninstall pg
npm install mysql2
```

### 2. Replace db.js content

Replace the contents of `db.js` with this MySQL version:

```javascript
const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✓ Connected to MySQL database");

module.exports = pool;
```

### 3. Update server.js for MySQL

Change the query methods in `server.js` from:

```javascript
const result = await pool.query(query);
```

To:

```javascript
const [result] = await pool.query(query, values);
```

### 4. Update .env for MySQL

```
DB_USER=root
DB_HOST=localhost
DB_DATABASE=product_db
DB_PASSWORD=your_mysql_password
DB_PORT=3306
PORT=3000
```

### 5. Create MySQL database and schema

```bash
mysql -u root -p < schema-mysql.sql
```

Or manually:

```sql
CREATE DATABASE product_db;
USE product_db;
-- Copy contents of schema-mysql.sql
```

## Key Differences Between PostgreSQL and MySQL

| Feature                | PostgreSQL            | MySQL                       |
| ---------------------- | --------------------- | --------------------------- |
| Default Port           | 5432                  | 3306                        |
| Driver Package         | `pg`                  | `mysql2`                    |
| SERIAL Type            | SERIAL                | AUTO_INCREMENT              |
| Updated Timestamp      | Manual trigger needed | ON UPDATE CURRENT_TIMESTAMP |
| Query Parameterization | $1, $2, etc.          | ?, ?, etc.                  |
| Boolean Type           | BOOLEAN               | TINYINT(1)                  |
| UUID Support           | Built-in              | Extension needed            |

## Query Syntax Differences

### PostgreSQL (Current)

```javascript
const result = await pool.query("INSERT INTO products VALUES ($1, $2, $3)", [
  name,
  price,
  stock,
]);
const product = result.rows[0];
```

### MySQL (Alternative)

```javascript
const [rows] = await pool.query("INSERT INTO products VALUES (?, ?, ?)", [
  name,
  price,
  stock,
]);
const product = rows[0];
```

## Testing Both Databases

You can keep both database configurations and easily switch by:

1. Creating `db-postgresql.js` and `db-mysql.js`
2. Setting `DB_TYPE=postgresql` or `DB_TYPE=mysql` in `.env`
3. Using conditional require logic in `server.js`

Example:

```javascript
const dbType = process.env.DB_TYPE || "postgresql";
const pool = require(`./db-${dbType}.js`);
```

## Recommendation

- **PostgreSQL**: Better for production, more features, better performance
- **MySQL**: More widely hosted, simpler setup

For this project, **PostgreSQL is recommended** as it's already configured and tested.
