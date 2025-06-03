const { Op } = require('sequelize');

function buildSessionFilter(filters) {
  const where = {};

  if (filters.date) {
    where.date = filters.date;
  }

  if (filters.startTime) {
    where.time = filters.startTime;
  }

  if (filters.startTimeFrom && filters.startTimeTo) {
    where.time = {
      [Op.between]: [filters.startTimeFrom, filters.startTimeTo]
    };
  }

  if (filters.ticketPriceMin && filters.ticketPriceMax) {
    where.ticketPrice = {
      [Op.between]: [parseInt(filters.ticketPriceMin), parseInt(filters.ticketPriceMax)]
    };
  } else if (filters.ticketPriceMin) {
    where.ticketPrice = {
      [Op.gte]: parseInt(filters.ticketPriceMin)
    };
  } else if (filters.ticketPriceMax) {
    where.ticketPrice = {
      [Op.lte]: parseInt(filters.ticketPriceMax)
    };
  }

  return where;
}

module.exports = { buildSessionFilter };