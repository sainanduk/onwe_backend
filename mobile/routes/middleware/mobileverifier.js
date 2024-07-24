const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const mobileVerifier = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer token

  if (token == null) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.session.sub = user.id; // Store only user ID in req.session.sub
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = mobileVerifier;
