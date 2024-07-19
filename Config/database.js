const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
// Initialize Sequelize instance with database connection details
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.LOCAL_DB_PORT || 5432,
  dialect: 'postgres',
  // logging: false, // Disable logging if you don't want to see SQL logs
});


// Function to test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Test the database connection immediately
testConnection();

// Export the Sequelize instance and the test connection function
module.exports = {
  sequelize,
  testConnection,
};
