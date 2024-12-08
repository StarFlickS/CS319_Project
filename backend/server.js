const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Import the MySQL connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Middleware to check for admin role
function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received:', req.body);
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const role = user.role
    
    // Generate a JWT Token
    const token = jwt.sign({ id: user.id ,role:role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token , role});
  });
});

// Register Route
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [username, email, password], (err) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json({ message: 'User registered successfully' });
  });
});

// Rooms Route
app.get('/rooms', (req, res) => {
  const query = 'SELECT * FROM rooms';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('An error occurred');
    } else {
      res.json(results);
    }
  });
}); 

app.put('/editrooms/:id', (req, res) => {
  const { name, type, price, status } = req.body;
  const roomId = req.params.id;  // รับ roomId จาก URL parameter

  // ตรวจสอบข้อมูลที่รับเข้ามา
  if (!name || !type || !price || !status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // เขียน SQL สำหรับอัปเดตข้อมูลห้องตาม roomId
  const query = 'UPDATE rooms SET name = ?, type = ?, price = ?, status = ? WHERE id = ?';
  const values = [name, type, price, status, roomId];  // เพิ่ม roomId ใน values เพื่อใช้ในการอัปเดต

  // เรียกใช้ MySQL query 
  console.log(req.body)
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.affectedRows > 0) {
      return res.json({ message: 'Room updated successfully' });
    } else {
      return res.status(404).json({ message: 'Room not found or no changes made' });
    }
  });
});

app.post('/rooms/add', (req, res) => {
  const { name, type, price, status } = req.body;

  // ตรวจสอบข้อมูลที่ได้รับ
  if (!name || !type || !price || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO rooms (name, type, price, status, created_at) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [name, type, price, status], (err, result) => {
    if (err) {
      console.error('Error inserting room:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    res.json({ message: 'Room added successfully', roomId: result.insertId });
  });
});

// Route สำหรับลบห้อง  
app.delete('/rooms/delete/:id', (req, res) => {
  const roomId = req.params.id; 
  //console.log('Deleting room with ID:', roomId); 

  // ตรวจสอบว่ามีการส่ง roomId มาหรือไม่
  if (!roomId) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  const query = 'DELETE FROM rooms WHERE id = ?';

  db.query(query, [roomId], (err, result) => {
    if (err) {
      console.error('Error deleting room:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ message: 'Room deleted successfully' });
  });
});

// User Profile Route
app.get('/user-profile', (req, res) => {
  // Extract the token from Authorization Header
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer [token]"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.id;

    // Query the database to get user information
    const query = 'SELECT id, username, email FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(results[0]); // Send user data back
    });
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}); 

app.get('/user-edit', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.id;

    // Query the database to get user information
    const query = 'SELECT * FROM users WHERE id = ?;';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(results[0]); // Send user data back
    });
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/user-update', (req, res) => {
  const { newemail, newpassword, userId } = req.body;

  // ตรวจสอบ Token
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer [token]"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userIdFromToken = decoded.id; // ดึง userId จาก Token

    // เช็คว่า userId ที่ส่งมาคือ userId จาก token หรือไม่
    if (userIdFromToken !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this user profile' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newemail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (newpassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Update query
    const query = 'UPDATE users SET email = ?, password = ? WHERE id = ?';
    db.query(query, [newemail, newpassword, userId], (err, result) => { 
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found or no changes made' });
      }

      res.json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Route สำหรับดึงข้อมูลห้องตามประเภท
app.get('/rooms/type/:type', (req, res) => {
  const roomType = req.params.type;

  const query = 'SELECT * FROM rooms WHERE type = ?';
  db.query(query, [roomType], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No rooms found for this type' });
    }

    res.json(results);
  });
});

app.post('/bookings', (req, res) => {
  // การดำเนินการจองห้องที่นี่
  const { userId, roomId, bookingName, bookingEmail, checkIn, checkOut } = req.body;
  
  // ตรวจสอบข้อมูลที่ได้รับ
  if (!userId || !roomId || !bookingName || !bookingEmail || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // การบันทึกข้อมูลการจองห้อง
  const query = `INSERT INTO bookings (user_id, room_id, booking_name, booking_email, check_in, check_out, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`;

  db.query(query, [userId, roomId, bookingName, bookingEmail, checkIn, checkOut], (err, result) => {
    if (err) {
      console.error('Error inserting booking:', err);
      return res.status(500).json({ error: 'Failed to book room' });
    }
    res.status(201).json({ message: 'Room booked successfully', bookingId: result.insertId });
  });
});


const PORT = 3000;
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
   

});