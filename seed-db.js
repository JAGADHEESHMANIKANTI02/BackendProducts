const { Pool } = require('pg');
require('dotenv').config();

/**
 * Seed sample products for testing
 */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const sampleProducts = [
  { name: 'Laptop', price: 75000, category: 'Electronics', stock: 5 },
  { name: 'Smartphone', price: 35000, category: 'Electronics', stock: 10 },
  { name: 'Tablet', price: 25000, category: 'Electronics', stock: 8 },
  { name: 'Headphones', price: 5000, category: 'Electronics', stock: 15 },
  { name: 'T-Shirt', price: 599, category: 'Clothing', stock: 20 },
  { name: 'Jeans', price: 1999, category: 'Clothing', stock: 12 },
  { name: 'Shoes', price: 3999, category: 'Clothing', stock: 8 },
  { name: 'Watch', price: 8999, category: 'Accessories', stock: 6 },
  { name: 'Backpack', price: 2499, category: 'Accessories', stock: 10 },
  { name: 'Wallet', price: 799, category: 'Accessories', stock: 25 },
];

async function seedDatabase() {
  let client;
  try {
    console.log('\n🌱 Seeding sample products...\n');

    client = await pool.connect();

    // Clear existing products
    await client.query('DELETE FROM products');
    console.log('✓ Cleared existing products');

    // Insert sample products
    for (const product of sampleProducts) {
      await client.query(
        'INSERT INTO products (product_name, price, category, stock) VALUES ($1, $2, $3, $4)',
        [product.name, product.price, product.category, product.stock]
      );
    }

    console.log(`✓ Added ${sampleProducts.length} sample products`);

    // Show products by category
    const categories = await client.query(
      'SELECT category, COUNT(*) as count FROM products GROUP BY category'
    );

    console.log('\n📊 Products by category:');
    for (const cat of categories.rows) {
      console.log(`   - ${cat.category}: ${cat.count} items`);
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n🚀 You can now test the application:\n');
    console.log('   1. Open http://localhost:3000 in your browser');
    console.log('   2. View products in the "View Products" tab');
    console.log('   3. Add new products in the "Add Product" tab');
    console.log('   4. Place orders in the "Place Order" tab\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

seedDatabase();
