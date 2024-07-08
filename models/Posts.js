const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Posts = sequelize.define('posts', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: {type :DataTypes.STRING,allowNull:true},
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  userid: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  media: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: true },
  category: {type:DataTypes.STRING, defaultValue:null},
  tags: {type:DataTypes.STRING,allowNull:true},
  clubid: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = Posts;
