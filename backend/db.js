const mysql = require('mysql2/promise'); // Import the mysql2 library

// สร้างการเชื่อมต่อแบบ Exportable
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'bu_hotel' 
});

async function setupDatabase() {
    try {
        const tempConnection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1.3boxbox'
        });

        await tempConnection.query('CREATE DATABASE IF NOT EXISTS bu_hotel');
        console.log('Database "bu_hotel" created or already exists');
        await tempConnection.end(); // ปิดการเชื่อมต่อชั่วคราว

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "users" created or already exists');

        await connection.query(`
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

        await connection.query(`
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
        `);
        console.log('Table "bookings" created or already exists');

        // เพิ่มข้อมูลตัวอย่างในตาราง `rooms`
        const [roomRows] = await connection.query('SELECT COUNT(*) AS count FROM rooms');
        if (roomRows[0].count === 0) {
            await connection.query(`
                INSERT IGNORE INTO rooms (name, type, price, status)
                VALUES 
                    ('Deluxe Room', 'Deluxe', 1500.00, 'available'),
                    ('Suite Room', 'Suite', 3000.00, 'available'),
                    ('Single Room', 'Single', 800.00, 'available')
            `);
            console.log('Default data inserted into "rooms" table');
        } else {
            console.log('Rooms table already has data. Skipping default data insertion.');
        }

        // เพิ่มข้อมูลตัวอย่างในตาราง `users`
        const [userRows] = await connection.query('SELECT COUNT(*) AS count FROM users');
        if (userRows[0].count === 0) {
            await connection.query(`
                INSERT IGNORE INTO users (username, email, password) 
                VALUES ('adminbuHotel1234', 'buHotel@gmail.com', 'admin1234')
            `);
            console.log('Default user inserted into "users" table');
        } else {
            console.log('Users table already has data. Skipping default user insertion.');
        }

    } catch (err) {
        console.error('Error setting up the database:', err);
    }
}

setupDatabase();

module.exports = connection;