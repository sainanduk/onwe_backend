const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Magazines = sequelize.define('magazines', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  media: DataTypes.ARRAY(DataTypes.TEXT),
  owner: { type: DataTypes.INTEGER, references: { model: 'admins', key: 'id' } },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  isPublished: DataTypes.BOOLEAN,
  createdAt: DataTypes.DATE,
});

module.exports = Magazines;
