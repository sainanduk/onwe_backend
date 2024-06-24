const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Comments = sequelize.define('comments', {
  id: { type: DataTypes.STRING, primaryKey: true },
  postId: { type: DataTypes.STRING, references: { model: 'posts', key: 'id' } },
  userId: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  content: DataTypes.STRING,
  replies: DataTypes.ARRAY(DataTypes.STRING),
  createdAt: DataTypes.DATE,
});

module.exports = Comments;
