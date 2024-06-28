const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Event = sequelize.define('event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  dateOfEvent: DataTypes.DATE,
  description: DataTypes.STRING,
  category: DataTypes.STRING,
  coverImage: DataTypes.STRING, // Added coverImage field
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Event;
