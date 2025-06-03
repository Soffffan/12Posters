const { Op } = require('sequelize');
const { Film, FilmSession, Cinema, CinemaHall } = require('../../models');

//Получить список всех кинотеатров
const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.findAll();
    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении списка кинотеатров', error: error.message });
  }
};

//Получить информацию о конкретном кинотеатре
const getCinemaById = async (req, res) => {
  try {
    const { id } = req.params;

    const cinema = await Cinema.findByPk(id, {
      include: [{ model: CinemaHall }]
    });

    if (!cinema) {
      return res.status(404).json({ message: 'Кинотеатр не найден' });
    }

    res.json(cinema);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении кинотеатра', error: error.message });
  }
};

//Получить все сеансы в конкретном кинотеатре
const getFilmSessionsByCinemaId = async (req, res) => {
  try {
    const { cinemaId } = req.params;

    const sessions = await FilmSession.findAll({
      where: { cinemaId },
      include: [
        {
          model: Cinema
        },
        {
          model: Film,
          attributes: ['id', 'title', 'poster']
        },
        {
          model: CinemaHall
        }
      ]
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении сеансов в кинотеатре', error: error.message });
  }
};

//Поиск по названию, адресу или метро
const searchCinemas = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Параметр query обязателен' });
    }

    const cinemas = await Cinema.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } }, // Исправлено название поля
          { address: { [Op.like]: `%${query}%` } }, // Исправлено название поля и опечатка
          { metro: { [Op.like]: `%${query}%` } } // Исправлено название поля
        ]
      }
    });

    res.json(cinemas);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при поиске кинотеатров', error: error.message });
  }
};

module.exports = {  getAllCinemas,  getCinemaById,  getFilmSessionsByCinemaId,  searchCinemas};