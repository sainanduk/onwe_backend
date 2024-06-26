const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Posts = sequelize.define('posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  authorId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  media: DataTypes.ARRAY(DataTypes.JSONB),
  category: DataTypes.STRING,
  tags: DataTypes.STRING,
  comments: DataTypes.ARRAY(DataTypes.INTEGER),
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  tableName: 'posts',
});

module.exports = Posts;
