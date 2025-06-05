const { Op } = require('sequelize');
const FilterBuilderInterface = require('../filterInterface');

class FilmFilterBuilder extends FilterBuilderInterface {
  constructor() {
    super();
    this.filmWhere = {};
    this.genreWhere = null;
    this.peopleWhere = null;
    this.cinemaWhere = null;
    this.sessionWhere = null;
  }

  setTitle(title) {
    if (title) this.filmWhere.title = { [Op.like]: `%${title}%` };
    return this;
  }

  setRating(min, max) {
    if (min || max) {
      this.filmWhere.rating = {};
      if (min) this.filmWhere.rating[Op.gte] = parseFloat(min);
      if (max) this.filmWhere.rating[Op.lte] = parseFloat(max);
    }
    return this;
  }

  setAgeRating(age) {
    if (age) this.filmWhere.ageRating = parseInt(age);
    return this;
  }

  setDuration(min, max) {
    if (min || max) {
      this.filmWhere.duration = {}; 
      if (min) this.filmWhere.duration[Op.gte] = parseInt(min);
      if (max) this.filmWhere.duration[Op.lte] = parseInt(max);
    }
    return this;
  }

  setReleaseDate(from, to) {
    if (from || to) {
      this.filmWhere.releaseDate = {};
      if (from) this.filmWhere.releaseDate[Op.gte] = new Date(from);
      if (to) this.filmWhere.releaseDate[Op.lte] = new Date(to);
    }
    return this;
  }

  setGenreFilter(genreId, genreTitle) {
    if (genreId) {
      this.genreWhere = { id: parseInt(genreId) };
    } else if (genreTitle) {
      this.genreWhere = { title: { [Op.like]: `%${genreTitle}%` } };
    }
    return this;
  }

  setPeopleFilter(peopleId, name, surname) {
    if (peopleId) {
      this.peopleWhere = { id: parseInt(peopleId) };
    } else if (name || surname) {
      this.peopleWhere = {};
      if (name) this.peopleWhere.name = { [Op.like]: `%${name}%` };
      if (surname) this.peopleWhere.surname = { [Op.like]: `%${surname}%` };
    }
    return this;
  }

  // Новые методы для фильтрации по кинотеатрам
  setCinemaFilter(city, metro, cinemaTitle, address) {
    if (city || metro || cinemaTitle || address) {
      this.cinemaWhere = {};
      if (city) this.cinemaWhere.city = city;
      if (metro) this.cinemaWhere.metro = { [Op.like]: `%${metro}%` };
      if (cinemaTitle) this.cinemaWhere.title = { [Op.like]: `%${cinemaTitle}%` };
      if (address) this.cinemaWhere.address = { [Op.like]: `%${address}%` };
    }
    return this;
  }

  // Метод для фильтрации по сеансам (если нужно на главной)
  setSessionFilter(date, startTime, startTimeFrom, startTimeTo, ticketPriceMin, ticketPriceMax) {
    if (date || startTime || startTimeFrom || startTimeTo || ticketPriceMin || ticketPriceMax) {
      this.sessionWhere = {};
      
      if (date) this.sessionWhere.date = date;
      if (startTime) this.sessionWhere.time = startTime;
      
      if (startTimeFrom && startTimeTo) {
        this.sessionWhere.time = {
          [Op.between]: [startTimeFrom, startTimeTo]
        };
      }

      if (ticketPriceMin && ticketPriceMax) {
        this.sessionWhere.ticketPrice = {
          [Op.between]: [parseInt(ticketPriceMin), parseInt(ticketPriceMax)]
        };
      } else if (ticketPriceMin) {
        this.sessionWhere.ticketPrice = { [Op.gte]: parseInt(ticketPriceMin) };
      } else if (ticketPriceMax) {
        this.sessionWhere.ticketPrice = { [Op.lte]: parseInt(ticketPriceMax) };
      }
    }
    return this;
  }

  build() {
    return {
      filmWhere: this.filmWhere,
      genreWhere: this.genreWhere,
      peopleWhere: this.peopleWhere,
      cinemaWhere: this.cinemaWhere,
      sessionWhere: this.sessionWhere
    };
  }
}

module.exports = FilmFilterBuilder;