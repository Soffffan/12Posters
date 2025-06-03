const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoleInCinema = sequelize.define('RoleInCinema', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filmId: { type: DataTypes.INTEGER },
  peopleId: { type: DataTypes.INTEGER },
  filmName: { type: DataTypes.STRING },
  roleId: { type: DataTypes.INTEGER }
}, {
  tableName: 'RoleInCinema',
  timestamps: false
});

module.exports = RoleInCinema;