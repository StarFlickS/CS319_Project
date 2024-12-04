const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Import the MySQL connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

    // Generate a JWT Token
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
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



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

