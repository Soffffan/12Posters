const { Op } = require('sequelize');

function buildCinemaFilter(filters) {
  const where = {};

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.metro) {
    where.metro = { [Op.like]: `%${filters.metro}%` };
  }

  if (filters.cinemaTitle) {
    where.title = { [Op.like]: `%${filters.cinemaTitle}%` };
  }

  if (filters.address) {
    where.address = { [Op.like]: `%${filters.address}%` };
  }

  return where;
}

module.exports = { buildCinemaFilter };