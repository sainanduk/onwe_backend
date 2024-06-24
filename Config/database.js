const { Sequelize } = require('sequelize');

// Initialize Sequelize instance with database connection details
const sequelize = new Sequelize('postgresql://onwe_owner:TUaD57zRdqYF@ep-small-rain-a1s4uufq-pooler.ap-southeast-1.aws.neon.tech/onwe', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
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
