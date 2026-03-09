# Quick Start Guide

Get the Product REST API up and running in 5 minutes!

## Step 1: Install Node Dependencies

```bash
npm install
```

This installs all required packages: Express, PostgreSQL driver, and utilities.

## Step 2: Set Up PostgreSQL Database

### Windows Users:

1. **Download and install PostgreSQL** from: https://www.postgresql.org/download/windows/
2. **During installation**, remember your superuser (postgres) password
3. **Open PostgreSQL command line** (psql) or pgAdmin

### Create Database and Schema:

```sql
-- Open psql and run:
CREATE DATABASE product_db;

-- Connect to the database
\c product_db

-- Copy and paste the contents of schema.sql file
-- Or run: \i path/to/schema.sql
```

**Or use pgAdmin GUI:**

1. Right-click "Databases" → Create → Database
2. Name it `product_db`
3. Open the query editor and paste the SQL from `schema.sql`

## Step 3: Configure Database Connection

Edit `.env` file:

```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=product_db
DB_PASSWORD=<your_postgres_password>
DB_PORT=5432
PORT=3000
```

Replace `<your_postgres_password>` with the password you set during PostgreSQL installation.

## Step 4: Start the Server

```bash
npm start
```

You should see:

```
==================================================
✓ Server running on http://localhost:3000
✓ Environment: development
==================================================
```

## Step 5: Test the API

Open a new terminal and test the endpoints:

### Get all products (should be empty initially):

```bash
curl http://localhost:3000/api/products
```

### Add a product:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Laptop","price":999.99,"category":"Electronics","stock":5}'
```

### Update product stock (replace 1 with actual product ID):

```bash
curl -X PUT http://localhost:3000/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"stock":10}'
```

## That's It! 🎉

Your API is now running. Use Postman or any HTTP client to test the endpoints.

## Troubleshooting

**Error: connect ECONNREFUSED 127.0.0.1:5432**

- PostgreSQL is not running
- Solution: Start PostgreSQL service

**Error: database "product_db" does not exist**

- Database wasn't created
- Solution: Create it using the SQL commands above

**Error: password authentication failed**

- Wrong database password in .env
- Solution: Check your PostgreSQL password and update .env

**Port 3000 already in use**

- Another application is using port 3000
- Solution: Change PORT in .env or kill the process using port 3000

## Next Steps

- Review the full [README.md](./README.md) for detailed API documentation
- Explore the code in [server.js](./server.js)
- Check the database schema in [schema.sql](./schema.sql)
