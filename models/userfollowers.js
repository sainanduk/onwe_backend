const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database'); // Adjust path as per your project structure

const UserFollowers = sequelize.define('userfollowers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: {type: DataTypes.STRING,allowNull: false,},
  followername: {type: DataTypes.STRING,allowNull: false,},
});

module.exports = UserFollowers;
