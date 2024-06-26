const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Clubs = sequelize.define('clubs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  admin: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  members: DataTypes.ARRAY(DataTypes.INTEGER),
  posts: DataTypes.ARRAY(DataTypes.INTEGER),
  createdAt: DataTypes.DATE,
});

module.exports = Clubs;
