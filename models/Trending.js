const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database'); // Adjust the path as necessary
const clubs =require('../models/Clubs')
const Trending = sequelize.define('trending', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slogan:{
    type: DataTypes.STRING,
    allowNull:true
  },
  coverimage:{
    type: DataTypes.TEXT,
    allowNull:true
  },
  members: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
});

module.exports = Trending;
