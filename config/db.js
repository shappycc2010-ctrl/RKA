// Load environment variables from .env file
require('dotenv').config();

const mysql = require('mysql');

// Create database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // e.g., rka-db-12345.mysql.database.render.com
  user: process.env.DB_USER,      // your MySQL username
  password: process.env.DB_PASS,  // your MySQL password
  database: process.env.DB_NAME,  // your database name, e.g., rka_portal
  port: process.env.DB_PORT || 3306 // default MySQL port
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.message);
    process.exit(1); // Exit app if connection fails
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
