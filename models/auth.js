const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const auth = sequelize.define('auth', {
  id: {
    type: DataTypes.UUID,  // Changed to UUID for unique identifiers
    defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
    primaryKey: true,
  },
  email: {type:DataTypes.STRING,allowNull:false},
  password: {type:DataTypes.STRING,allowNull:false},
  name: {type:DataTypes.STRING,allowNull:false},
  lastlogin:{type: DataTypes.DATE,defaultValue:Date.now()},
  isVerified: {type:DataTypes.BOOLEAN, defaultValue:false},
  resetPasswordToken:DataTypes.STRING,
  resetPasswordExpires:DataTypes.DATE,
  verificationToken:{ type:DataTypes.STRING},
  verificationTokenExpires: DataTypes.DATE
});

module.exports = auth;
