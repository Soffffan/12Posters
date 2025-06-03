const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cinema = sequelize.define('Cinema', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  numberSeats: { type: DataTypes.INTEGER },
  numberHalls: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  metro: { type: DataTypes.STRING }
}, {
  tableName: 'Cinema',
  timestamps: false
});

module.exports = Cinema;