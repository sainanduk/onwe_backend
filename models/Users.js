const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Users = sequelize.define('users', {
  id: { type: DataTypes.STRING, primaryKey: true },
  username: { type: DataTypes.STRING, unique: true },
  email: DataTypes.STRING,
  fullname: DataTypes.STRING,
  avatar: DataTypes.TEXT,
  bio: DataTypes.STRING,
  department: DataTypes.STRING,
  role: DataTypes.BOOLEAN,
  coverimg: DataTypes.STRING,
  password: DataTypes.STRING,
  refreshToken: DataTypes.STRING,
  clubs: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
  links: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  indexes: [
    {
      name: 'idx_id',
      fields: ['id'],
    },
    {
      name: 'idx_username',
      fields: ['username'],
    },
  ]
});

module.exports = Users;