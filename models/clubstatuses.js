const { DataTypes } = require('sequelize');
const { sequelize } = require('../Config/database');

const ClubStatus = sequelize.define('clubStatus', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clubId: { type: DataTypes.INTEGER, references: { model: 'clubs', key: 'clubId' } },
  userId: { type: DataTypes.UUID, references: { model: 'users', key: 'id' } },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  joinedAt: { type: DataTypes.DATE, allowNull: false },
  leftAt: { type: DataTypes.DATE, allowNull: true },
});

module.exports = ClubStatus;
