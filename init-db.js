const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Database initialization script
 * Reads schema.sql and executes it to create tables
 */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initializeDatabase() {
  let client;
  try {
    console.log('\n📦 Initializing database...\n');

    // Read schema file
    const schemaPath = './schema.sql';
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Get client from pool
    client = await pool.connect();
    console.log('✓ Connected to PostgreSQL database');

    // Execute schema
    await client.query(schemaSQL);
    console.log('✓ Schema executed successfully');

    // Verify tables were created
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    const tables = tableCheck.rows.map(row => row.table_name);
    console.log('\n✓ Available tables:', tables.join(', '));

    // Count records
    const productsCount = await client.query('SELECT COUNT(*) FROM products');
    const ordersCount = await client.query('SELECT COUNT(*) FROM orders');
    const orderItemsCount = await client.query('SELECT COUNT(*) FROM order_items');

    console.log('\n📊 Records:');
    console.log(`   - Products: ${productsCount.rows[0].count}`);
    console.log(`   - Orders: ${ordersCount.rows[0].count}`);
    console.log(`   - Order Items: ${orderItemsCount.rows[0].count}`);

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nYou can now use the API:\n');
    console.log('   Backend: http://localhost:8000');
    console.log('   Frontend: http://localhost:3000\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(error.message);
    console.error('\nMake sure:');
    console.error('  1. PostgreSQL is running');
    console.error('  2. Database "BackendAssignement" exists');
    console.error('  3. .env file has correct credentials');
    console.error('\nDebug info:');
    console.error('  DB_HOST:', process.env.DB_HOST);
    console.error('  DB_PORT:', process.env.DB_PORT);
    console.error('  DB_NAME:', process.env.DB_DATABASE);
    console.error('  DB_USER:', process.env.DB_USER);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
