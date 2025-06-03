const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const People = sequelize.define('People', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATE },
  birthplace: { type: DataTypes.STRING },
  photo: { type: DataTypes.STRING }
}, {
  tableName: 'People',
  timestamps: false
});

module.exports = People;