const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');


const Event = sequelize.define('event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  link: { type: DataTypes.STRING, allowNull: true,defaultValue:null },
  clubId: { type: DataTypes.INTEGER, allowNull: true ,defaultValue:null},
  dateOfEvent: { type: DataTypes.STRING, allowNull: false   },
  time:{type:DataTypes.STRING,allowNull:false},
  description: { type: DataTypes.STRING, allowNull: true },
  category: { type: DataTypes.STRING, allowNull: true },
  media: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'event' });

module.exports = Event;
