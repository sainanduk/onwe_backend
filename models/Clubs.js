const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Clubs = sequelize.define('clubs', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  admin: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  members: DataTypes.ARRAY(DataTypes.STRING),
  coverimage:{type:DataTypes.BLOB('long'), allowNull: false},
  createdAt: DataTypes.DATE,
});

module.exports = Clubs;
