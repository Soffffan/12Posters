const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FilmSession = sequelize.define('FilmSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cinemaId: { type: DataTypes.INTEGER },
  cinemaHallId: { type: DataTypes.INTEGER },
  filmId: { type: DataTypes.INTEGER },
  time: { type: DataTypes.TIME },
  date: { type: DataTypes.DATE },
  ticketPrice: { type: DataTypes.INTEGER },
  freeSeats: { type: DataTypes.INTEGER }
}, {
  tableName: 'FilmSession',
  timestamps: false
});

module.exports = FilmSession;