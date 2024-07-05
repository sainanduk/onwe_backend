const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Clubs = sequelize.define('clubs', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  admins: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
  members: DataTypes.INTEGER,
  coverimage: { type: DataTypes.BLOB('long'), allowNull: false },
  createdAt: DataTypes.DATE,
});

module.exports = Clubs;
