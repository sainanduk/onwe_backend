const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const Artical = sequelize.define('Artical', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  media: DataTypes.ARRAY(DataTypes.TEXT),
  owner: { type: DataTypes.STRING, references: { model: 'users', key: 'id' } },
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  createdAt: DataTypes.DATE,
});

module.exports = Artical;
