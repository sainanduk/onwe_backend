const { DataTypes } = require('sequelize');
const {sequelize} = require('../Config/database'); // adjust the path as necessary

const Comments = sequelize.define('comments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.INTEGER, references: { model: 'posts', key: 'id' } },
  userId: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  content: { type: DataTypes.STRING, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, references: { model: 'comments', key: 'id' } },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Comments;
