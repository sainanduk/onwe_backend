const { DataTypes } = require('sequelize');
const {sequelize} = require('../Config/database'); // adjust the path as necessary

const Comments = sequelize.define('comments', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.INTEGER, references: { model: 'posts', key: 'id' } },
  userId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  content: { type: DataTypes.TEXT, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  reportCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  reportedBy: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] }
});

module.exports = Comments;
