const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Admins = sequelize.define('admins', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  fullname: DataTypes.STRING,
  avatar: DataTypes.STRING,
  coverimg: DataTypes.STRING,
  password: DataTypes.STRING,
  refreshToken: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Admins;
