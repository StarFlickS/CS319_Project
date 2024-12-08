const mysql = require('mysql2');

// สร้างการเชื่อมต่อกับ MySQL
const connection = mysql.createConnection({
  host: 'localhost',      // MySQL host (ค่าเริ่มต้น: localhost)
  user: 'root',           // MySQL username
  password: 'Ni0931154707', // MySQL password
});

// เชื่อมต่อกับ MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Step 1: สร้างฐานข้อมูล hotel_db
  const createDBQuery = 'CREATE DATABASE IF NOT EXISTS hotel_db';
  connection.query(createDBQuery, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "hotel_db" created or already exists');

    // Step 2: ใช้ฐานข้อมูล hotel_db
    const useDBQuery = 'USE hotel_db';
    connection.query(useDBQuery, (err) => {
      if (err) {
        console.error('Error using database:', err);
        return;
      }
      console.log('Using database "hotel_db"');

      // Step 3: สร้างตาราง users
      const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      connection.query(createUsersTableQuery, (err) => {
        if (err) {
          console.error('Error creating "users" table:', err);
          return;
        }
        console.log('Table "users" created or already exists');

        // Step 4: สร้างตาราง rooms
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
        connection.query(createRoomsTableQuery, (err) => {
          if (err) {
            console.error('Error creating "rooms" table:', err);
            return;
          }
          console.log('Table "rooms" created or already exists');

          // Step 5: ตรวจสอบและเพิ่มข้อมูลในตาราง rooms หากไม่มีข้อมูล
          const checkRoomsQuery = 'SELECT COUNT(*) AS count FROM rooms';
          connection.query(checkRoomsQuery, (err, result) => {
            if (err) {
              console.error('Error checking rooms table:', err);
              return;
            }
            const count = result[0].count;
            if (count === 0) {
              const insertRoomsQuery = `
                INSERT INTO rooms (name, type, price, status)
                VALUES 
                  ('Deluxe Room', 'Deluxe', 1500.00, 'available'),
                  ('Suite Room', 'Suite', 3000.00, 'available'),
                  ('Single Room', 'Single', 800.00, 'available')
              `;
              connection.query(insertRoomsQuery, (err) => {
                if (err) {
                  console.error('Error inserting data into rooms:', err);
                  return;
                }
                console.log('Data successfully inserted into the "rooms" table');
              });
            } else {
              console.log('Rooms table already has data. Skipping insertion.');
            }
          });

          // Step 6: สร้างตาราง bookings
          const createBookingsTableQuery = `
            CREATE TABLE IF NOT EXISTS bookings (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL,
              check_in DATE NOT NULL,
              check_out DATE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
          `;
          connection.query(createBookingsTableQuery, (err) => {
            if (err) {
              console.error('Error creating "bookings" table:', err);
              return;
            }
            console.log('Table "bookings" created or already exists');

            
          });
        });
      });
    });
  });
});

module.exports = connection;
