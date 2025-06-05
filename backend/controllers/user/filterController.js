const { Film, Genre, People, RoleInCinema, Cinema, FilmSession } = require('../../models');
const FilmFilterBuilder = require('../../utils/builders/filmFilterBuilder');
const FilmFilterDirector = require('../../utils/builders/filmFilterDirector');

// Получение опций для фильтров (жанры, города, метро)
const getFilterOptions = async (req, res) => {
  try {
    // Получаем все жанры
    const genres = await Genre.findAll({
      attributes: ['id', 'title'],
      order: [['title', 'ASC']]
    });

    // Получаем все уникальные города
    const cities = await Cinema.findAll({
      attributes: ['city'],
      group: ['city'],
      order: [['city', 'ASC']]
    });

    // Получаем все уникальные станции метро
    const metros = await Cinema.findAll({
      attributes: ['metro'],
      where: {
        metro: {
          [require('sequelize').Op.not]: null
        }
      },
      group: ['metro'],
      order: [['metro', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        genres: genres,
        cities: cities.map(c => c.city),
        metros: metros.map(m => m.metro)
      }
    });
  } catch (error) {
    console.error('Ошибка при получении опций фильтров:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении опций фильтров',
      error: error.message
    });
  }
};

// Фильтрация фильмов для главной страницы
const getFilteredFilms = async (req, res) => {
  try {
    const builder = new FilmFilterBuilder();
    const director = new FilmFilterDirector(builder);
    
    // Строим фильтры из query параметров
    const filters = director.construct(req.query);
    
    // Базовый запрос
    const queryOptions = {
      attributes: ['id', 'title', 'poster', 'rating', 'ageRating', 'duration', 'releaseDate'],
      where: filters.filmWhere,
      include: [],
      distinct: true
    };

    if (filters.genreWhere) {
      queryOptions.include.push({
        model: Genre,
        through: { attributes: [] },
        where: filters.genreWhere,
        required: true
      });
    }

    if (filters.peopleWhere) {
      queryOptions.include.push({
        model: RoleInCinema, // Сначала RoleInCinema
        required: true,       // Это нужно, чтобы гарантировать, что фильм имеет связанного человека
        include: [{
          model: People,     // Затем добавляем People
          where: filters.peopleWhere,
          required: true     // Убедитесь, что только фильмы с указанными людьми будут включены
        }]
      });
    }


    if (filters.cinemaWhere || filters.sessionWhere) {
      const sessionInclude = {
        model: FilmSession,
        required: true,
        include: []
      };

      if (filters.sessionWhere) {
        sessionInclude.where = filters.sessionWhere;
      }

      if (filters.cinemaWhere) {
        sessionInclude.include.push({
          model: Cinema,
          where: filters.cinemaWhere,
          required: true
        });
      }

      queryOptions.include.push(sessionInclude);
    }

    const films = await Film.findAll(queryOptions);


    res.json({
      success: true,
      data: films,
      count: films.length
    });
  } catch (error) {
    console.error('Ошибка при фильтрации фильмов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при фильтрации фильмов',
      error: error.message
    });
  }
};

// Фильтрация сеансов для страницы фильма
const getFilteredSessionsForFilm = async (req, res) => {
  try {
    const { filmId } = req.params;
    const builder = new FilmFilterBuilder();
    const director = new FilmFilterDirector(builder);
    
    // Строим фильтры из query параметров
    const filters = director.construct(req.query);
    
    const queryOptions = {
      where: {
        filmId: filmId,
        ...(filters.sessionWhere || {})
      },
      include: [
        {
          model: Cinema,
          where: filters.cinemaWhere || {},
          required: filters.cinemaWhere ? true : false
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    };

    const sessions = await FilmSession.findAll(queryOptions);

    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Ошибка при фильтрации сеансов для фильма:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при фильтрации сеансов для фильма',
      error: error.message
    });
  }
};

// Фильтрация сеансов для страницы кинотеатра
const getFilteredSessionsForCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const builder = new FilmFilterBuilder();
    const director = new FilmFilterDirector(builder);
    
    // Строим фильтры из query параметров
    const filters = director.construct(req.query);
    
    const queryOptions = {
      where: {
        cinemaId: cinemaId,
        ...(filters.sessionWhere || {})
      },
      include: [
        {
          model: Film,
          where: filters.filmWhere || {},
          required: filters.filmWhere ? true : false,
          include: []
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    };

    // Если есть фильтры по жанрам или людям, добавляем их к фильму
    if (filters.genreWhere) {
      queryOptions.include[0].include.push({
        model: Genre,
        through: { attributes: [] },
        where: filters.genreWhere,
        required: true
      });
    }

    if (filters.peopleWhere) {
      queryOptions.include.push({
        model: People,
        through: { attributes: [] }, // Промежуточная таблица RoleInCinema
        where: filters.peopleWhere,
        required: true,
        include: [{
          model: RoleInCinema,
          required: true
        }]
      });
    }


    const sessions = await FilmSession.findAll(queryOptions);

    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Ошибка при фильтрации сеансов для кинотеатра:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при фильтрации сеансов для кинотеатра',
      error: error.message
    });
  }
};

module.exports = {
  getFilterOptions,
  getFilteredFilms,
  getFilteredSessionsForFilm,
  getFilteredSessionsForCinema
};