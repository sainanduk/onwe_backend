const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Users = sequelize.define('users', {
  id: { type: DataTypes.STRING, primaryKey: true },
  username: DataTypes.STRING, unique: true,
  email: DataTypes.STRING,
  fullname: DataTypes.STRING,
  avatar: DataTypes.STRING,
  bio: DataTypes.STRING,
  department: DataTypes.STRING,
  role: DataTypes.BOOLEAN,
  coverimg: DataTypes.STRING,
  password: DataTypes.STRING,
  refreshToken: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Users;
