const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database'); // Adjust path as per your project structure

const UserFollowers = sequelize.define('userfollowers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {type: DataTypes.STRING,allowNull: false,},
  followerId: {type: DataTypes.STRING,allowNull: false,},
});

module.exports = UserFollowers;
