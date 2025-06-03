class FilterBuilderInterface {
  setTitle() { throw new Error('setTitle() not implemented'); }
  setRating() { throw new Error('setRating() not implemented'); }
  setAgeRating() { throw new Error('setAgeRating() not implemented'); }
  setDuration() { throw new Error('setDuration() not implemented'); }
  setReleaseDate() { throw new Error('setReleaseDate() not implemented'); }
  setGenreFilter() { throw new Error('setGenreFilter() not implemented'); }
  setPeopleFilter() { throw new Error('setPeopleFilter() not implemented'); }
  build() { throw new Error('build() not implemented'); }
}

module.exports = FilterBuilderInterface;