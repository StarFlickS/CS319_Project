const mysql = require('mysql2');

// Create a connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '090234Top',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Step 1: Create the database
  const createDBQuery = 'CREATE DATABASE IF NOT EXISTS hotel_db';
  connection.query(createDBQuery, (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "hotel_db" created or already exists');

    // Step 2: Use the database
    const useDBQuery = 'USE hotel_db';
    connection.query(useDBQuery, (err, result) => {
      if (err) {
        console.error('Error using database:', err);
        return;
      }
      console.log('Using database "hotel_db"');

      // Step 3: Create the `users` table
      const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      connection.query(createUsersTableQuery, (err, result) => {
        if (err) {
          console.error('Error creating "users" table:', err);
          return;
        }
        console.log('Table "users" created or already exists');

        // Step 4: Create the `rooms` table
        const createRoomsTableQuery = `
          CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            status ENUM('available', 'booked') DEFAULT 'available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        connection.query(createRoomsTableQuery, (err, result) => {
          if (err) {
            console.error('Error creating "rooms" table:', err);
            return;
          }
          console.log('Table "rooms" created or already exists');

          // Step 5: Insert data into the `rooms` table
          const insertRoomsQuery = `
            INSERT INTO rooms (name, type, price, status)
            VALUES 
              ('Deluxe Room', 'Deluxe', 1500.00, 'available'),
              ('Suite Room', 'Suite', 3000.00, 'available'),
              ('Single Room', 'Single', 800.00, 'available')
          `;
          connection.query(insertRoomsQuery, (err, result) => {
            if (err) {
              console.error('Error inserting data into "rooms" table:', err);
              return;
            }
            console.log('Data successfully inserted into the "rooms" table:', result);

            
          });
        });
      });
    });
  });
});

module.exports = connection;