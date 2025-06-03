const sequelize = require('../config/database');
const Film = require('./Film');
const Cinema = require('./Cinema');
const FilmSession = require('./FilmSession');
const CinemaHall = require('./CinemaHall');
const People = require('./People');
const Role = require('./Role');
const RoleInCinema = require('./RoleInCinema');
const Genre = require('./Genre');
const FilmGenre = require('./FilmGenre');
const HallSeat = require('./HallSeat');
const ComfortLevel = require('./ComfortLevel');

// ===== СВЯЗИ ФИЛЬМОВ И КИНОТЕАТРОВ ЧЕРЕЗ СЕАНСЫ =====
Film.belongsToMany(Cinema, {
  through: FilmSession,
  foreignKey: 'filmId',
  onDelete: 'CASCADE'
});
Cinema.belongsToMany(Film, {
  through: FilmSession,
  foreignKey: 'cinemaId',
  onDelete: 'CASCADE'
});

// ===== СВЯЗИ ФИЛЬМОВ И ЖАНРОВ =====
Film.belongsToMany(Genre, {
  through: FilmGenre,
  foreignKey: 'filmId',
  onDelete: 'CASCADE'
});
Genre.belongsToMany(Film, {
  through: FilmGenre,
  foreignKey: 'genreId',
  onDelete: 'CASCADE'
});

// ===== СВЯЗИ КИНОТЕАТРОВ И ЗАЛОВ =====
Cinema.hasMany(CinemaHall, {
  foreignKey: 'cinemaId',
  onDelete: 'CASCADE'
});
CinemaHall.belongsTo(Cinema, {
  foreignKey: 'cinemaId'
});

// ===== СВЯЗИ ЗАЛОВ И МЕСТ =====
CinemaHall.hasMany(HallSeat, {
  foreignKey: 'cinemaHallId',
  onDelete: 'CASCADE'
});
HallSeat.belongsTo(CinemaHall, {
  foreignKey: 'cinemaHallId'
});

// ===== СВЯЗИ УРОВНЯ КОМФОРТА И МЕСТ =====
ComfortLevel.hasMany(HallSeat, {
  foreignKey: 'comfortLevelId',
  onDelete: 'CASCADE'
});
HallSeat.belongsTo(ComfortLevel, {
  foreignKey: 'comfortLevelId'
});

// ===== СВЯЗИ РОЛЕЙ В КИНЕМАТОГРАФЕ =====
Film.hasMany(RoleInCinema, {
  foreignKey: 'filmId',
  onDelete: 'CASCADE'
});
RoleInCinema.belongsTo(Film, {
  foreignKey: 'filmId'
});

People.hasMany(RoleInCinema, {
  foreignKey: 'peopleId',
  onDelete: 'CASCADE'
});
RoleInCinema.belongsTo(People, {
  foreignKey: 'peopleId'
});

Role.hasMany(RoleInCinema, {
  foreignKey: 'roleId',
  onDelete: 'CASCADE'
});
RoleInCinema.belongsTo(Role, {
  foreignKey: 'roleId'
});

// ===== НЕДОСТАЮЩИЕ СВЯЗИ ДЛЯ СЕАНСОВ =====
// Связь FilmSession -> Film
FilmSession.belongsTo(Film, {
  foreignKey: 'filmId'
});
Film.hasMany(FilmSession, {
  foreignKey: 'filmId'
});

// Связь FilmSession -> Cinema
FilmSession.belongsTo(Cinema, {
  foreignKey: 'cinemaId'
});
Cinema.hasMany(FilmSession, {
  foreignKey: 'cinemaId'
});

// Связь FilmSession -> CinemaHall
FilmSession.belongsTo(CinemaHall, {
  foreignKey: 'cinemaHallId'
});
CinemaHall.hasMany(FilmSession, {
  foreignKey: 'cinemaHallId'
});

// ===== ПРЯМЫЕ СВЯЗИ ДЛЯ ЖАНРОВ И РОЛЕЙ =====
Film.hasMany(FilmGenre, {
  foreignKey: 'filmId',
  onDelete: 'CASCADE'
});
FilmGenre.belongsTo(Film, {
  foreignKey: 'filmId'
});

Genre.hasMany(FilmGenre, {
  foreignKey: 'genreId',
  onDelete: 'CASCADE'
});
FilmGenre.belongsTo(Genre, {
  foreignKey: 'genreId'
});

module.exports = {
  sequelize,
  Film,
  Cinema,
  FilmSession,
  CinemaHall,
  People,
  Role,
  RoleInCinema,
  Genre,
  FilmGenre,
  HallSeat,
  ComfortLevel
};