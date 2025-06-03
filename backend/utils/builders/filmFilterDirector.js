class FilmFilterDirector {
  constructor(builder) {
    this.builder = builder;
  }

  construct(filters) {
    return this.builder
      .setTitle(filters.title)
      .setRating(filters.ratingMin, filters.ratingMax)
      .setAgeRating(filters.ageRating)
      .setDuration(filters.durationMin, filters.durationMax)
      .setReleaseDate(filters.releaseDateFrom, filters.releaseDateTo)
      .setGenreFilter(filters.genreId, filters.genreTitle)
      .setPeopleFilter(filters.peopleId, filters.peopleName, filters.peopleSurname)
      .build();
  }
}

module.exports = FilmFilterDirector;