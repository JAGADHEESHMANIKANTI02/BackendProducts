# Product & Order Management System - Frontend

A React-based user interface for managing products and orders. This frontend application interacts with the Backend Assignment Node.js API.

## 📋 Features

- **View Products**: Browse all available products with filters by category
- **Add Products**: Create new products with details like name, price, category, and stock
- **Place Orders**: Create orders with multiple products and automatic stock reduction validation
- **Real-time Stock Updates**: View available stock and receive warnings for low stock items
- **Payment Calculation**: Automatic total calculation for orders
- **Server Health Check**: Monitor backend server connection status

## 🛠️ Technology Stack

- **React** 18.2.0 - UI Framework
- **Axios** 1.6.0 - HTTP Client
- **CSS3** - Styling with responsive design

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

### Steps to Run

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure API Base URL (optional):**

   Edit `.env` file to change the API base URL:

   ```
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

   The application will automatically open in your browser at `http://localhost:3000`

## 🎯 Usage Guide

### 1. **View Products Tab** 📦

- Displays all available products in a card grid
- Filter products by category using the dropdown
- Shows product details:
  - Product name
  - Price in ₹ (Rupees)
  - Category badge
  - Stock status (In Stock/Low Stock/Out of Stock)
  - Product ID

### 2. **Add Product Tab** ➕

- Form to create new products
- Required fields:
  - **Product Name**: Name of the product
  - **Price**: Price in rupees (must be > 0)
  - **Category**: Product category (e.g., Electronics, Clothing)
  - **Stock**: Initial quantity (must be ≥ 0)
- Validates all inputs before submission
- Shows success/error messages
- Product list automatically refreshes after successful creation

### 3. **Place Order Tab** 🛒

- Create orders with customer information and multiple products
- Customer Information Section:
  - Full Name
  - Email Address
  - Phone Number (validation: at least 10 digits)
  - Delivery Address
- Order Items Section:
  - Add multiple products to order
  - Specify quantity for each product
  - Real-time price display
  - Stock availability check
  - Remove items individually
- Automatic Order Total Calculation
- Prevents ordering more items than available stock
- Shows order confirmation with Order ID and total amount

## 📂 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── ProductList.js       # Display products with filters
│   │   ├── AddProduct.js        # Form to add new products
│   │   └── PlaceOrder.js        # Order creation with customer details
│   ├── api.js                   # Axios API client & service calls
│   ├── App.js                   # Main app component with tabs
│   ├── App.css                  # App-specific styles
│   ├── index.js                 # React DOM render
│   └── index.css                # Global styles
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

## 🔌 API Integration

The frontend integrates with the backend API with the following endpoints:

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products?category=X` - Filter products by category
- `POST /api/products` - Create new product
- `PUT /api/products/:id/stock` - Update product stock
- `DELETE /api/products/:id` - Delete product

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/customer/:email` - Get customer's orders

### Health Check

- `GET /health` - Server health check

## ⚙️ Available Scripts

### `npm start`

Runs the app in development mode.

- Open [http://localhost:3000](http://localhost:3000) to view in browser
- Page reloads when you make changes
- Build errors appear in console

### `npm build`

Builds the app for production to the `build` folder.

- Correctly bundles React in production mode
- Optimizes the build for best performance

### `npm test`

Launches the test runner in interactive watch mode.

## 🎨 Styling Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color Scheme**:
  - Primary Green (#4CAF50) for actions
  - Dark Blue-Gray (#2c3e50) for headers
  - Neutral Gray for backgrounds
- **Alert Messages**:
  - Green alerts for success
  - Red alerts for errors
  - Yellow alerts for warnings
  - Blue alerts for info
- **Interactive Elements**: Hover effects and transitions for better UX

## 🔒 Security & Validation

- **Email Validation**: Checks for valid email format
- **Phone Validation**: Validates minimum 10 digits
- **Stock Validation**: Prevents ordering more items than available
- **Input Sanitization**: All inputs are processed by backend sanitization middleware
- **Error Handling**: Comprehensive error messages for user guidance

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

**Note**: Environment variables in React must start with `REACT_APP_`

## 🐛 Troubleshooting

### Backend Server Not Connecting

- Ensure backend server is running on the configured port (default: 8000)
- Check CORS is enabled on the backend
- Verify `REACT_APP_API_BASE_URL` in `.env` matches your backend URL
- Look for connection error message in the header

### Products Not Loading

- Check browser console for API errors
- Ensure backend database is running and populated with products
- Verify backend `/api/products` endpoint is working

### Order Failing to Place

- Ensure customer email is valid
- Check phone number has at least 10 digits
- Verify products have sufficient stock
- Check server logs for detailed error messages

## 📝 Example Workflows

### Adding a Product

1. Click "Add Product" tab
2. Fill in product details:
   - Name: "Laptop"
   - Price: 50000
   - Category: "Electronics"
   - Stock: 10
3. Click "Create Product"
4. Success message confirms creation
5. Product appears in "View Products" tab

### Placing an Order

1. Click "Place Order" tab
2. Enter customer information
3. Click "+ Add Item" to add products
4. Select product and quantity in dropdown
5. Add multiple products as needed
6. Review order total
7. Click "Place Order"
8. Confirmation shows order ID and amount

## 🔄 Version History

- **v1.0.0** - Initial release with product viewing, addition, and order placement

## 📞 Support

For issues or questions about the frontend:

1. Check the backend logs
2. Verify API endpoints are accessible
3. Review browser console for error messages
4. Ensure all required fields are filled correctly

---

**Created on**: March 9, 2026  
**Last Updated**: March 9, 2026
