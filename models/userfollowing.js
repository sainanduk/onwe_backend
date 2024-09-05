const { DataTypes } = require('sequelize');
const {sequelize} = require('../Config/database'); // Adjust path as per your project structure

const UserFollowing = sequelize.define('userfollowing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  followingname: { type: DataTypes.STRING, allowNull: false }
});

module.exports = UserFollowing;
