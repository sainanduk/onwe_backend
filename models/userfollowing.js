const { DataTypes } = require('sequelize');
const {sequelize} = require('../Config/database'); // Adjust path as per your project structure

const UserFollowing = sequelize.define('userfollowing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  followingId: { type: DataTypes.STRING, allowNull: false }
});

module.exports = UserFollowing;
