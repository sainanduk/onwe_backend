const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../Config/database');
const { v4: uuidv4 } = require('uuid');

function uuidToInteger(uuid) {
  // Convert the UUID to a numeric representation
  // Example: Convert the first 8 characters of UUID to a 32-bit integer
  return parseInt(uuid.split('-')[0], 16);
}

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    defaultValue:()=> uuidToInteger(uuidv4()),
  },
  username: {
    type: DataTypes.STRING,
    unique: true, // Correct usage of unique constraint
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fullname: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  coverimg: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
});

module.exports = Users;
