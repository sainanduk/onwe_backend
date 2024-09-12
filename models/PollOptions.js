const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');
const Polls = require('./Polls');

const PollOptions = sequelize.define('poll_options', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pollId: {
    type: DataTypes.INTEGER,
    references: {
      model: Polls,
      key: 'id',
    },
    allowNull: false,
  },
  optionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'poll_options',
  timestamps: false,
});

// Define associations


module.exports = PollOptions;
