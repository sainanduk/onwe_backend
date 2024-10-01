const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');
const PollOptions = require('./PollOptions');
const Users = require('./Users');

const Votes = sequelize.define('votes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pollOptionId: {
    type: DataTypes.INTEGER,
    references: {
      model: PollOptions,
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
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

// Define associations


module.exports = Votes;
