const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HallSeat = sequelize.define('HallSeat', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cinemaHallId: { type: DataTypes.INTEGER },
  rowNumber: { type: DataTypes.INTEGER },
  seatNumber: { type: DataTypes.INTEGER },
  comfortLevelId: { type: DataTypes.INTEGER },
  free: { type: DataTypes.BOOLEAN }
}, {
  tableName: 'HallSeat',
  timestamps: false
});

module.exports = HallSeat;