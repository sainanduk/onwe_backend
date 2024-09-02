// // Import Sequelize and DataTypes
// const { DataTypes } = require('sequelize');
// const sequelize = require('../Config/database'); // Adjust the path to your Sequelize instance

// // Define the Votes model
// const Votes = sequelize.define('Votes', {
//   // Primary key for the Votes table
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   // Foreign key reference to the PollOptions table
//   pollOptionId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'PollOptions', // The name of the PollOptions table
//       key: 'id',
//     },
//     allowNull: false,
//   },
//   // Foreign key reference to the Users table
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'Users', // The name of the Users table
//       key: 'id',
//     },
//     allowNull: false,
//   },
//   // Additional fields can be added if necessary
// }, {
//   tableName: 'votes', // The name of the table in the database
//   timestamps: false, // Set to true if you want timestamps
// });

// // Export the Votes model
// module.exports = Votes;
