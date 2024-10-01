
const rateLimit = require('express-rate-limit');



// Create a rate limit rule
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each unique key to 500 requests per windowMs
    message: 'Too many requests from this IP or user, please try again after 15 minutes.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => {
      // Use both IP and userId (from session or token) to create a unique key
      const userId = req.user ? req.user.sub : 'guest'; // Fallback to 'guest' if user is not authenticated
      return req.ip + '|' + userId; // Combine IP and userId for the key
    },
  });

module.exports = limiter;