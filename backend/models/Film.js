const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Film = sequelize.define('Film', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING },
  releaseDate: { type: DataTypes.DATE },
  rating: { type: DataTypes.DOUBLE },
  ageRating: { type: DataTypes.INTEGER },
  poster: { type: DataTypes.STRING }
}, {
  tableName: 'Film',
  timestamps: false
});

module.exports = Film;