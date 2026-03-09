# 🚀 Quick Start - Frontend Setup

Get the React frontend running in **3 minutes**!

## ⚡ Prerequisites

- Backend server running on `http://localhost:8000` ✓
- Node.js installed (v14+)

## 🎯 Steps

### 1️⃣ Open Terminal in Frontend Directory

```bash
cd d:\BackendAssignement\frontend
```

### 2️⃣ Install Dependencies (first time only)

```bash
npm install
```

⏱️ **Takes 2-5 minutes on first run**

### 3️⃣ Start Development Server

```bash
npm start
```

✅ Browser opens automatically at `http://localhost:3000`

## 🎉 Done!

You should now see:

```
┌─────────────────────────────────────────┐
│  Product & Order Management System     │
│  A simple React-based interface        │
│                                        │
│  ✓ Server Connected  (green indicator) │
└─────────────────────────────────────────┘

[📦 View Products] [➕ Add Product] [🛒 Place Order]
```

## 🧪 Quick Test

1. Click **"📦 View Products"** → Should show products from database
2. Click **"➕ Add Product"** → Add a test product
3. Click **"🛒 Place Order"** → Place an order with customer details

## ⚠️ Issues?

### 🔴 "Server Disconnected" in header

- Ensure backend is running: `npm start` in backend folder
- Check `.env` has: `REACT_APP_API_BASE_URL=http://localhost:8000`

### 🔴 Blank page

- Press `Ctrl+Shift+I` to open DevTools
- Check Console tab for errors
- Try `Ctrl+Shift+R` to hard refresh

### 🔴 Cannot find module

- Delete `node_modules` folder
- Run `npm install` again

## 📂 File Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── ProductList.js
│   │   ├── AddProduct.js
│   │   └── PlaceOrder.js
│   ├── api.js             # API calls
│   ├── App.js             # Main component
│   └── index.js
├── public/
│   └── index.html
├── .env                   # Configuration
└── package.json
```

## 🔄 Next Commands

- **Stop server**: Press `Ctrl+C` in terminal
- **Restart**: Run `npm start` again
- **Build for production**: `npm run build`

## 💡 Pro Tips

- Keep backend terminal open in background
- Use browser DevTools (F12) to debug
- Check browser Console tab for API errors
- Products must be in database to show/order

---

**Ready to go!** Check `README.md` for detailed documentation.
