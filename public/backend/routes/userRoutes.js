const express = require('express');
const path = require('path'); // Importing path module
const router = express.Router();
const session = require('express-session');
const User = require('../models/User');
const usercontroller = require('../controllers/usercontroller'); // Ensure this matches your export in usercontroller.js
const { authenticateToken } = require('../middleware/authMiddleware');
// GET route to serve the registration form
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));});

// POST route to handle registration form submission
router.post('/register', usercontroller.register);

// GET route to serve the login form
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// POST route to handle login form submission
router.post('/login', usercontroller.login);

router.post('/logout', authenticateToken, (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid'); // clear the session cookie
      res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.post('/validateToken', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
});
module.exports = router;
