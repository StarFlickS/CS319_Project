const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Import the MySQL connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'adminbuHotel1234');
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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  try {
    const [results] = await db.query(query, [username]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (username === "adminbuHotel1234") {
      const token = jwt.sign({ id: user.id, email: user.email, role: 'admin' }, 'adminbuHotel1234', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token, role: 'admin' });
    } else {
      const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, 'buHotel1234', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token, role: 'user' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  try {
    const [result] = await db.query(query, [username, email, password]); // Promise-based query
    res.json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to get all rooms
app.get('/rooms', async (req, res) => {
  const query = 'SELECT * FROM rooms'; // SQL query

  try {
    const [results] = await db.query(query); // Promise-based query
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('An error occurred');
  }
});


app.put('/editrooms/:id', async (req, res) => {
  const { name, type, price, status } = req.body;
  const roomId = req.params.id;

  if (!name || !type || !price || !status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'UPDATE rooms SET name = ?, type = ?, price = ?, status = ? WHERE id = ?';
  const values = [name, type, price, status, roomId];

  try {
    const [results] = await db.query(query, values); // Promise-based query

    if (results.affectedRows > 0) {
      return res.json({ message: 'Room updated successfully' });
    } else {
      return res.status(404).json({ message: 'Room not found or no changes made' });
    }
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/rooms/delete/:id', async (req, res) => {
  const roomId = req.params.id;

  if (!roomId) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  const query = 'DELETE FROM rooms WHERE id = ?';

  try {
    const [result] = await db.query(query, [roomId]); // Promise-based query

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/rooms/add', (req, res) => {
  const { name, type, price, status } = req.body;

  // ตรวจสอบข้อมูลที่ได้รับ
  if (!name || !type || !price || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO rooms (name, type, price, status) VALUES (?, ?, ?, ?)';
  db.query(query, [name, type, price, status], (err, result) => {
    if (err) {
      console.error('Error inserting room:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    res.json({ message: 'Room added successfully', roomId: result.insertId });
  });
});


app.get('/user-profile', async (req, res) => {
  // Extract the token from Authorization Header
  const token = req.headers.authorization?.split(' ')[1]; 
  console.log('Authorization Header:', req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, 'buHotel1234');
    const userId = decoded.id;

    // Query the database to get user information
    const query = 'SELECT id, username, email FROM users WHERE id = ?';
    const [results] = await db.query(query, [userId]);
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(results);
      res.json(results[0]);
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

app.post('/user-update', async (req, res) => {
  const { newemail, newpassword, userId } = req.body;

  // ตรวจสอบ Token
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer [token]"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, 'buHotel1234');
    const userIdFromToken = decoded.id; // ดึง userId จาก Token

    // เช็คว่า userId ที่ส่งมาคือ userId จาก token หรือไม่
    if (userIdFromToken !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this user profile' });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newemail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // ตรวจสอบความยาวของรหัสผ่าน
    if (newpassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Update query
    const query = 'UPDATE users SET email = ?, password = ? WHERE id = ?';
    const [results] = await db.query(query, [newemail, newpassword, userId]);

    // ตรวจสอบว่ามีการอัปเดตข้อมูลหรือไม่
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    // ส่งข้อความสำเร็จกลับไป
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    // จัดการข้อผิดพลาด เช่น Token ไม่ถูกต้อง
    console.error('Error occurred:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/bookings', async (req, res) => {
  // การดำเนินการจองห้องที่นี่
  const { userId, roomId, bookingName, bookingEmail, checkIn, checkOut } = req.body;
  console.log(req.body)
  
  // ตรวจสอบข้อมูลที่ได้รับ
  if (!userId || !roomId || !bookingName || !bookingEmail || !checkIn || !checkOut) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // การบันทึกข้อมูลการจองห้อง
  const query = `INSERT INTO bookings (user_id, room_id, name, email, check_in, check_out, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`;

  try {
    const [results] = await db.query(query, [userId, roomId, bookingName, bookingEmail, checkIn, checkOut]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }
    res.status(200).json({ message: 'Room booked successfully', bookingId: results.insertId });
  } catch (error) {
    console.log(error);
  }
});

app.get('/bookings/:userId', async (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT b.id, b.name, b.email, b.check_in, b.check_out, r.name AS room_name, b.created_at
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = ?
  `;

  try {
    const [results] = await db.query(query, [userId]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }
    res.json(results);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
