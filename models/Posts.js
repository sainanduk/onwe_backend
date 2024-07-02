const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Posts = sequelize.define('posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  userid: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  media: { type: DataTypes.ARRAY(DataTypes.BLOB('long')), allowNull: true },
  category: DataTypes.STRING,
  tags: DataTypes.STRING,
  clubid: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Posts;
