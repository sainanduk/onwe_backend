const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const PostLikes = sequelize.define('postLikes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.INTEGER, references: { model: 'posts', key: 'id' } },
  userId: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
});

module.exports = PostLikes;
