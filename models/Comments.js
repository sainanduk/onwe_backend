const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Comments = sequelize.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: { type: DataTypes.INTEGER, references: { model: 'posts', key: 'id' } },
  userId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  content: DataTypes.STRING,
  replies: DataTypes.ARRAY(DataTypes.INTEGER),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'comments',
});

module.exports = Comments;
