const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Posts = sequelize.define('posts', {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  authorId: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  media: DataTypes.ARRAY(DataTypes.JSONB),
  category: DataTypes.STRING,
  tags: DataTypes.STRING,
  comments: DataTypes.ARRAY(DataTypes.STRING),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Posts;
