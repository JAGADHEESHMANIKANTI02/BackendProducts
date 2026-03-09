# Complete Setup Guide - Backend & Frontend

This guide will help you set up and run both the backend server and React frontend application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **PostgreSQL** (v10 or higher) - Download from [postgresql.org](https://www.postgresql.org)
- **Git** (optional) - For version control

You can verify installations by running:

```bash
node --version
npm --version
psql --version
```

## 🗄️ Step 1: Set Up PostgreSQL Database

### 1.1 Create Database User

Open PostgreSQL command line or pgAdmin and run:

```sql
-- Create user
CREATE USER postgres WITH PASSWORD 'root@123';

-- Grant privileges
ALTER ROLE postgres WITH CREATEDB;
ALTER ROLE postgres WITH CREATEUSER;
```

### 1.2 Create Database

```sql
CREATE DATABASE "BackendAssignement" OWNER postgres;
```

### 1.3 Load Schema

1. Open the database with user postgres:

   ```bash
   psql -U postgres -d BackendAssignement
   ```

2. Run the schema file (from within psql):

   ```sql
   \i 'path/to/schema.sql'
   ```

   Or from command line:

   ```bash
   psql -U postgres -d BackendAssignement -f schema.sql
   ```

3. Verify tables were created:
   ```sql
   \dt
   ```

You should see:

- `products` table
- `orders` table
- `order_items` table

## 🚀 Step 2: Set Up Backend Server

### 2.1 Navigate to Backend Directory

```bash
cd d:\BackendAssignement
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install:

- express (HTTP framework)
- pg (PostgreSQL driver)
- cors (Cross-Origin Resource Sharing)
- body-parser (Request parser)
- dotenv (Environment variables)

### 2.3 Configure Environment Variables

Edit `.env` file with your database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=BackendAssignement
DB_USER=postgres
DB_PASSWORD=root@123
PORT=8000
NODE_ENV=development
```

### 2.4 Test Database Connection

Run health check:

```bash
curl http://localhost:8000/health
```

After starting the server (Step 2.5), you should see:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-03-09T..."
}
```

### 2.5 Start Backend Server

```bash
npm start
```

You should see:

```
Server is running on port 8000
Database connected successfully
```

**Keep this terminal running!** Open a new terminal for the next steps.

## 💻 Step 3: Set Up React Frontend

### 3.1 Open New Terminal

Open a new terminal/PowerShell window.

### 3.2 Navigate to Frontend Directory

```bash
cd d:\BackendAssignement\frontend
```

### 3.3 Install Dependencies

```bash
npm install
```

This will install:

- react (UI library)
- react-dom (React rendering)
- axios (HTTP client)
- react-scripts (Build & dev server)

**Note**: This may take 2-5 minutes on first run.

### 3.4 Verify API Configuration

Check that `.env` file has correct API base URL:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 3.5 Start React Development Server

```bash
npm start
```

The app will:

1. Compile and bundle the code
2. Automatically open browser to `http://localhost:3000`
3. Show "Server Connected" status in green header

**Keep this terminal running!**

## ✅ Verification

You now have:

1. ✅ PostgreSQL database running with schema
2. ✅ Node.js backend server on port 8000
3. ✅ React frontend on port 3000

### Quick Test

1. **View Products**
   - Click "📦 View Products" tab
   - Should show empty or existing products
   - Header shows "✓ Server Connected"

2. **Add a Product**
   - Click "➕ Add Product" tab
   - Fill in form:
     - Name: "Test Product"
     - Price: 100
     - Category: "Test"
     - Stock: 5
   - Click "Create Product"
   - Should see success message

3. **Place an Order**
   - Click "🛒 Place Order" tab
   - Fill customer info
   - Click "+ Add Item"
   - Select the product you just created
   - Enter quantity
   - Click "Place Order"
   - Should see order confirmation

## 📁 Directory Structure

```
d:\BackendAssignement\
├── backend files (server.js, config/, models/, controllers/, etc.)
├── .env                    # Backend config
├── schema.sql              # Database schema
├── package.json            # Backend dependencies
│
└── frontend/               # React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/     # React components
    │   ├── api.js          # API client
    │   ├── App.js
    │   └── index.js
    ├── .env                # Frontend config
    └── package.json        # Frontend dependencies
```

## 🔧 Troubleshooting

### Backend Issues

**Error: Database connection failed**

- Ensure PostgreSQL is running
- Check `.env` credentials match database setup
- Verify `BackendAssignement` database exists
- Try connecting manually: `psql -U postgres -d BackendAssignement`

**Error: Port 8000 already in use**

- Kill the process: `netstat -ano | findstr :8000`
- Or change PORT in `.env` and `.env` (frontend)

**Error: Module not found**

- Run `npm install` again in backend directory
- Delete `node_modules` and `package-lock.json`, then reinstall

### Frontend Issues

**Error: Cannot find module 'react'**

- Navigate to `frontend` directory
- Run `npm install`
- Delete `node_modules` and `package-lock.json` if needed

**Error: Server Disconnected (red indicator)**

- Ensure backend server is running
- Check if `REACT_APP_API_BASE_URL` in `.env` is correct
- Check browser console (F12) for CORS errors

**Blank Page or No Content**

- Check browser console for errors (F12)
- Ensure React is loading (check network tab)
- Try `npm start` again in frontend directory

## 🚀 Running Production Build

### Backend

```bash
cd d:\BackendAssignement
NODE_ENV=production npm start
```

### Frontend

```bash
cd d:\BackendAssignement\frontend
npm run build
```

This creates optimized production files in `build/` folder.

## 🛑 Stopping Servers

**Backend Server**:

- Press `Ctrl+C` in backend terminal

**Frontend Server**:

- Press `Ctrl+C` in frontend terminal

**PostgreSQL**:

- Windows Service: Services → PostgreSQL → Stop
- Command line: `pg_ctl stop`

## 📝 Default Test Data

You can manually insert test data:

```sql
-- Insert test products
INSERT INTO products (product_name, price, category, stock) VALUES
('Laptop', 50000, 'Electronics', 5),
('Smartphone', 25000, 'Electronics', 10),
('T-Shirt', 500, 'Clothing', 20),
('Jeans', 1500, 'Clothing', 15);
```

Then refresh the frontend to see them!

## 🔗 API Documentation

Once backend is running, you can test endpoints:

```bash
# Get all products
curl http://localhost:8000/api/products

# Get health status
curl http://localhost:8000/health
```

See `docs/API_TESTING.md` and `docs/ORDERS_TESTING.md` for detailed API testing.

## 📞 Need Help?

1. Check terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 8000 are available
4. Check database is running and populated
5. Review logs in browser console (F12)

---

**Last Updated**: March 9, 2026  
**Node Version**: v14+ recommended  
**PostgreSQL Version**: v10+
