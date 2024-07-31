const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

// Environment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
router.post('/mobile_signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await Users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
    );
    // Respond with token
    res.status(200).json({ token: token });

  } catch (error) {
    console.error('Error during signin:', error.message || error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message || error });
  }
});

module.exports = router;
