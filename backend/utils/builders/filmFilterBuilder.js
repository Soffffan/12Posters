const { Op } = require('sequelize');
const FilterBuilderInterface = require('../filterInterface');

class FilmFilterBuilder extends FilterBuilderInterface {
  constructor() {
    super();
    this.filmWhere = {};
    this.genreWhere = null;
    this.peopleWhere = null;
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
    } else {
      this.peopleWhere = {};
      if (name) this.peopleWhere.name = { [Op.like]: `%${name}%` };
      if (surname) this.peopleWhere.surname = { [Op.like]: `%${surname}%` };
      if (Object.keys(this.peopleWhere).length === 0) {
        this.peopleWhere = null;
      }
    }
    return this;
  }

  build() {
    return {
      filmWhere: this.filmWhere,
      genreWhere: this.genreWhere,
      peopleWhere: this.peopleWhere
    };
  }
}

module.exports = FilmFilterBuilder;