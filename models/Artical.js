const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Artical = sequelize.define('Artical', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  media: DataTypes.TEXT,
  coverphoto:DataTypes.TEXT,
  owner: DataTypes.STRING,
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  category:DataTypes.STRING,
  likes: DataTypes.INTEGER, 
  createdAt: DataTypes.DATE,
});

module.exports = Artical;
