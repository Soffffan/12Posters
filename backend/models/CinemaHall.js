const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CinemaHall = sequelize.define('CinemaHall', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cinemaId: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING },
  numberHall: { type: DataTypes.INTEGER },
  numberSeats: { type: DataTypes.INTEGER }
}, {
  tableName: 'CinemaHall',
  timestamps: false
});

module.exports = CinemaHall;