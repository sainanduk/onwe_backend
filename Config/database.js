const {Sequelize}  = require('sequelize');

const sequelize = new Sequelize('postgresql://onwe_owner:TUaD57zRdqYF@ep-small-rain-a1s4uufq-pooler.ap-southeast-1.aws.neon.tech/onwe', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection()

// Export the Sequelize instance and any other functions if needed
module.exports = {
  sequelize,
  testConnection
};
