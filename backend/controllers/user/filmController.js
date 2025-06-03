const { Op } = require('sequelize');
const {  Film,  FilmGenre,  Genre,  RoleInCinema,  People,  Role,  FilmSession,  Cinema,  CinemaHall} = require('../../models');

//Просто постеры и названия для главной
const getAllFilmsBasic = async (req, res) => {
  try {
    const films = await Film.findAll({
      attributes: ['id', 'title', 'poster'],
    });
    res.json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении фильмов', error: error.message });
  }
};


// Поиск информации о жанре по id
const getGenreById = async (req, res) => {
  try {
    const { id } = req.params;

    const genre = await Genre.findByPk(id);

    if (!genre) {
      return res.status(404).json({ message: 'Жанр не найден' });
    }

    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении жанра', error: error.message });
  }
};

// Поиск фильмов по id жанра
const getFilmsByGenreId = async (req, res) => {
  try {
    const { genreId } = req.params;

    if (!genreId) {
      return res.status(400).json({ message: 'genreId обязателен' });
    }

    const films = await Film.findAll({
      attributes: ['id', 'title', 'poster'],
      include: [{
        model: FilmGenre,
        where: { genreId },
        attributes: [],
      }],
    });

    res.json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении фильмов по жанру', error: error.message });
  }
};


//Полная информация о фильме
const getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findByPk(id, {
      include: [
        {
          model: FilmGenre,
          include: [{ model: Genre }],
        },
        {
          model: RoleInCinema,
          include: [
            { model: People },
            { model: Role }
          ],
        },
        {
          model: FilmSession,
          include: [
            { model: Cinema },
            { model: CinemaHall }
          ],
        },
      ],
    });
    if (!film) return res.status(404).json({ message: 'Фильм не найден' });
    res.json(film);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении информации о фильме', error: error.message });
  }
};

//Сеансы по фильму
const getFilmSessionsByFilmId = async (req, res) => {
  try {
    const { filmId } = req.params;
    const sessions = await FilmSession.findAll({
      where: { filmId },
      include: [
        {
          model: Cinema,
          attributes: ['id', 'title', 'address', 'metro', 'city'],
        },
        {
          model: CinemaHall,
          attributes: ['id', 'title', 'numberHall'],
        },
      ],
    });
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении сеансов', error: error.message });
  }
};

//Поиск фильмов по названию
const searchFilms = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Параметр query обязателен' });

    const films = await Film.findAll({
      where: {
        title: { [require('sequelize').Op.like]: `%${query}%` },
      },
      attributes: ['id', 'title', 'poster'],
    });
    res.json(films);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при поиске фильмов', error: error.message });
  }
};

module.exports = {  getAllFilmsBasic,  getGenreById,  getFilmsByGenreId, getFilmById,  getFilmSessionsByFilmId,  searchFilms};