const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FilmGenre = sequelize.define('FilmGenre', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  filmId: { type: DataTypes.INTEGER },
  genreId: { type: DataTypes.INTEGER }
}, {
  tableName: 'FilmGenre',
  timestamps: false
});

module.exports = FilmGenre;