const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComfortLevel = sequelize.define('ComfortLevel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING }
}, {
  tableName: 'ComfortLevel',
  timestamps: false
});

module.exports = ComfortLevel;