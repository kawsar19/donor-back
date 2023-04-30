const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email is already taken
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already taken' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Failed to register user', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

module.exports = router;
