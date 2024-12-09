const mysql = require('mysql2/promise');

// Create a pool connection to MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1.3boxbox',
  database: 'bu_hotel', 
});

module.exports = connection;