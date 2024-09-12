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
  // You can add more fields if necessary, such as rankings or scores
}, {
  tableName: 'trending', // Optional: specify the table name if it's not pluralized
  timestamps: true, // Includes createdAt and updatedAt fields
  updatedAt: 'updatedAt', // Customize timestamp field names if necessary
});

module.exports = Trending;
