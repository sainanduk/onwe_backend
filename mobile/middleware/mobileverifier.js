const jwt = require('jsonwebtoken');
require('dotenv').config();
const { storeSessionData } = require('./session');

const JWT_SECRET = process.env.JWT_SECRET;

const mobileVerifier = (req, res, next) => {
  console.log("mobile verifier");
  const token = req.headers['authorization']?.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.userid = user.id; 
    next(); 
  });
};

module.exports = [mobileVerifier, storeSessionData];