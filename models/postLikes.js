const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const PostLikes = sequelize.define('postLikes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER
});

module.exports = PostLikes;
