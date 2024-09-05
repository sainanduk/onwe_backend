const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET, // Set this in your .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
});

const storeSessionData = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    req.session.token = token;
    req.session.sub = req.userid;
  }

  next();
};

module.exports = {
  sessionMiddleware,
  storeSessionData,
};