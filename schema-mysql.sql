-- MySQL Schema Alternative
-- Use this instead of schema.sql if you prefer MySQL over PostgreSQL

-- Create database (run this separately)
-- CREATE DATABASE BackendAssignement;

-- Drop table if it exists (for fresh setup)
-- DROP TABLE IF EXISTS products;

-- Create products table for MySQL
CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on category for faster queries
CREATE INDEX idx_products_category ON products(category);

-- Insert sample data (optional)
-- INSERT INTO products (product_name, price, category, stock) VALUES
-- ('Laptop', 999.99, 'Electronics', 5),
-- ('Mouse', 29.99, 'Electronics', 50),
-- ('Desk Chair', 199.99, 'Furniture', 12),
-- ('Monitor', 299.99, 'Electronics', 8),
-- ('Keyboard', 79.99, 'Electronics', 25);
