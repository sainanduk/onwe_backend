const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const mobileVerifier = (req, res, next) => {
  console.log("mobile verfier");
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET,{ algorithms: ['RS256'] }, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.session.sub = user.id; 
    next(); 
  });
};

module.exports = mobileVerifier;
