const db = require('./config/database');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║           ADMIN LOGIN DETAILS                                  ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

db.query('SELECT admin_id, username, email, role, is_active FROM admins ORDER BY admin_id', (err, result) => {
  if (err) {
    console.log('❌ Error:', err.message);
    db.end();
    return;
  }
  
  if (result.rows.length === 0) {
    console.log('⚠️  No admin users found in database!\n');
    db.end();
    return;
  }
  
  console.log('📋 ADMIN USERS:\n');
  
  result.rows.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.username.toUpperCase()}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Status: ${admin.is_active ? '✓ Active' : '✗ Inactive'}`);
    console.log();
  });
  
  const defaultAdmin = result.rows.find(a => a.username === 'admin');
  
  if (defaultAdmin) {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           🔐 LOGIN CREDENTIALS                                  ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log('║                                                                ║');
    console.log(`║  Username: admin                                               ║`);
    console.log(`║  Password: admin@123                                            ║`);
    console.log('║                                                                ║');
    console.log('║  ⚠️  IMPORTANT SECURITY NOTES:                                  ║');
    console.log('║                                                                ║');
    console.log('║  1. Change default password in production                       ║');
    console.log('║  2. Use HTTPS to protect credentials in transit                 ║');
    console.log('║  3. Do not expose credentials in logs or comments               ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
  }
  
  console.log('🌐 API ENDPOINTS:\n');
  console.log('  POST   /api/admin/login           - Login with username/password');
  console.log('  GET    /api/admin/profile         - Get logged-in admin profile');
  console.log('  POST   /api/admin/register        - Register new admin (super_admin only)');
  console.log('  PUT    /api/admin/change-password - Change admin password');
  console.log('  GET    /api/admin/list            - List all admins (super_admin only)');
  console.log('  PUT    /api/admin/:id/role        - Update admin role (super_admin only)');
  console.log('  DELETE /api/admin/:id             - Remove admin (super_admin only)\n');
  
  console.log('🖥️  APPLICATION URLS:\n');
  console.log('  Backend:  http://localhost:8000');
  console.log('  Frontend: http://localhost:3000\n');
  
  console.log('📚 EXAMPLE LOGIN REQUEST:\n');
  console.log('  curl -X POST http://localhost:8000/api/admin/login \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"username":"admin","password":"admin@123"}\'\n');
  
  db.end();
});
