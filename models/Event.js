const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Event = sequelize.define('event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: true },
  dateOfEvent: { type: DataTypes.STRING, allowNull: false },
  time:{type:DataTypes.STRING,allowNull:false},
  description: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: true },
  media: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'event' });

module.exports = Event;
