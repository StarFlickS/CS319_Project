const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1.3boxbox', 
  database: 'bu_hotel',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

module.exports = connection;