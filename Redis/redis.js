// redisClient.js
const redis = require('redis');

// Create a Redis client
const redisclient = redis.createClient({
  host: 'localhost', // Your Redis host
  port: 6379,        // Your Redis port
});

// Handle Redis errors
redisclient.on('error', (err) => {
  console.error('Redis error: ', err);
});

redisclient.connect();

module.exports = redisclient;
