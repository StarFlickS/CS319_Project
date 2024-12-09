const db = require('./db'); // Import the pool

async function setupDatabase() {
  try {
    await db.query('CREATE DATABASE IF NOT EXISTS bu_hotel');
    console.log('Database "bu_hotel" created or already exists');

    await db.query('USE bu_hotel');

    // Create the `users` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "users" created or already exists');

    // Create the `rooms` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        status ENUM('available', 'booked') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "rooms" created or already exists');


    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              room_id INT NOT NULL,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL,
              check_in DATE NOT NULL,
              check_out DATE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (room_id) REFERENCES rooms(id)
            )
      `)

      
    // Insert default data into `rooms` table
    await db.query(`
      INSERT IGNORE INTO rooms (name, type, price, status)
      VALUES 
        ('Deluxe Room', 'Deluxe', 1500.00, 'available'),
        ('Suite Room', 'Suite', 3000.00, 'available'),
        ('Single Room', 'Single', 800.00, 'available')
    `);
    console.log('Default data inserted into "rooms" table');
  } catch (err) {
    console.error('Error setting up the database:', err);
  } finally {
    process.exit(); // Exit after setup
  }
}

setupDatabase();
