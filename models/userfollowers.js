const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database'); // Adjust path as per your project structure

const UserFollowers = sequelize.define('userfollowers', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  follower: {type: DataTypes.STRING,allowNull: false,},
  following: {type: DataTypes.STRING,allowNull: false,},
}, {
  indexes: [
    {
      name: 'idx_follower',
      fields: ['follower']
    },
    {
      name: 'idx_following',
      fields: ['following']
    },
    // Optional: create a composite index if needed
    {
      name: 'idx_follower_following',
      fields: ['follower', 'following'],
      unique: true // Ensure that each follower-following pair is unique
    }
  ]
});

module.exports = UserFollowers;
