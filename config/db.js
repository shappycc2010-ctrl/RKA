const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'your-db-host.mysql.render.com',
  user: 'your_username',
  password: 'your_password',
  database: 'rka_portal',
  port: 3306
});

db.connect(err => {
  if(err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;
