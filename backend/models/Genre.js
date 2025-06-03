const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Genre = sequelize.define('Genre', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING }
}, {
  tableName: 'Genre',
  timestamps: false
});

module.exports = Genre;