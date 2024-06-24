const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Magazines = sequelize.define('magazines', {
  id: { type: DataTypes.STRING, primaryKey: true },
  imageFile: DataTypes.STRING,
  owner: { type: DataTypes.STRING, references: { model: 'admins', key: 'id' } },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  isPublished: DataTypes.BOOLEAN,
  createdAt: DataTypes.DATE,
});

module.exports = Magazines;
