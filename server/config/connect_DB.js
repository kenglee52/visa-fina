const mysql = require('mysql2');
require('dotenv').config();

// ใช้ connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0
});

// ทดสอบการเชื่อมต่อ
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
  } else {
    console.log('✅ Connected to the MySQL database.');
    connection.release();
  }
});

// Ping DB ทุก 15 นาที
setInterval(() => {
  pool.query('SELECT 1', (err) => {
    if (err) console.error('Ping error:', err.message);
  });
}, 900000);

module.exports = pool; // ✅ export pool ตรงๆ
