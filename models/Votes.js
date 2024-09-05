const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database'); // Adjust the path to your Sequelize instance
const PollOptions = require('./PollOptions');
const Users =require('./Users')
const Votes = sequelize.define('votes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pollOptionId: {
    type: DataTypes.INTEGER,
    references: {
      model: PollOptions, // Reference the PollOptions model
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: Users, 
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'votes',
  timestamps: false,
});


module.exports = Votes;
