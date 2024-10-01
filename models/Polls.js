const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');
const PollOptions = require('./PollOptions');

const Polls = sequelize.define('polls', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define associations


module.exports = Polls;
