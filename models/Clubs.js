const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Clubs = sequelize.define('clubs', {
  clubId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clubName: DataTypes.STRING,
  members: DataTypes.INTEGER,
  coverImage: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false },
  slogan: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Clubs;
