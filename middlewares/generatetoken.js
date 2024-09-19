const jwt = require('jsonwebtoken');
require('dotenv').config();

const GenerateToken = (user) => {
  try {
    const token = jwt.sign({ id: user.id, username: user.username,createdAt:user.createdAt }, process.env.JWT_SECRET, {expiresIn:'24h'});
    return token
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}
module.exports = GenerateToken;