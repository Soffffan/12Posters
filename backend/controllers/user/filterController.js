const {  Film, FilmGenre, Genre, RoleInCinema, People, FilmSession, Cinema} = require('../../models');

const FilmFilterBuilder = require('../utils/builders/filmFilterBuilder');
const FilmFilterDirector = require('../utils/builders/filmFilterDirector');
const { buildSessionFilter } = require('../utils/builders/sessionFilterBuilder');
const { buildCinemaFilter } = require('../utils/builders/cinemaFilterBuilder');

const filterFilmsMain = async (req, res) => {
  try {
    const filters = req.query;

    const filmBuilder = new FilmFilterBuilder();
    const filmDirector = new FilmFilterDirector(filmBuilder);
    const { filmWhere, genreWhere, peopleWhere } = filmDirector.construct(filters);

    const sessionWhere = buildSessionFilter(filters);
    const cinemaWhere = buildCinemaFilter(filters);

    const films = await Film.findAll({
      where: filmWhere,
      include: [
        {
          model: FilmGenre,
          include: [
            {
              model: Genre,
              where: genreWhere || undefined,
              required: !!genreWhere
            }
          ],
          required: !!genreWhere
        },
        {
          model: RoleInCinema,
          include: [
            {
              model: People,
              where: peopleWhere || undefined,
              required: !!peopleWhere
            }
          ],
          required: !!peopleWhere
        },
        {
          model: FilmSession,
          where: sessionWhere,
          include: [
            {
              model: Cinema,
              where: cinemaWhere
            }
          ],
          required: true
        }
      ]
    });

    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка фильтрации на главной', error: err.message });
  }
};

const filterFilm = async (req, res) => {
  try {
    const filmId = req.params.id;
    const filters = req.query;

    const sessionWhere = buildSessionFilter(filters);
    const cinemaWhere = buildCinemaFilter(filters);

    const sessions = await FilmSession.findAll({
      where: {
        ...sessionWhere,
        FilmId: filmId
      },
      include: [
        {
          model: Cinema,
          where: cinemaWhere
        }
      ]
    });

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка фильтрации по кинотеатрам и сеансам у фильма', error: err.message });
  }
};

const filterCinema = async (req, res) => {
  try {
    const cinemaId = req.params.id;
    const filters = req.query;

    const filmBuilder = new FilmFilterBuilder();
    const filmDirector = new FilmFilterDirector(filmBuilder);
    const { filmWhere, genreWhere, peopleWhere } = filmDirector.construct(filters);

    const sessionWhere = buildSessionFilter(filters);

    const films = await Film.findAll({
      where: filmWhere,
      include: [
        {
          model: FilmGenre,
          include: [
            {
              model: Genre,
              where: genreWhere || undefined
            }
          ],
          required: !!genreWhere
        },
        {
          model: RoleInCinema,
          include: [
            {
              model: People,
              where: peopleWhere || undefined
            }
          ],
          required: !!peopleWhere
        },
        {
          model: FilmSession,
          where: {
            ...sessionWhere,
            CinemaId: cinemaId
          },
          required: true
        }
      ]
    });

    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка фильтрации по фильмам и сеансам в кинотеатре', error: err.message });
  }
};

module.exports = {  filterFilmsMain,  filterFilm,  filterCinema};