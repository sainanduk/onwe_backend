const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Event = sequelize.define('event', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  dateOfEvent: DataTypes.DATE,
  description: DataTypes.STRING,
  user_remind: DataTypes.ARRAY(DataTypes.STRING),
  category: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Event;
