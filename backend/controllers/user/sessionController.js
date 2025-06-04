const { FilmSession, Film, Cinema, CinemaHall, HallSeat } = require('../../models');

//Получить все сеансы
const getAllSessions = async (req, res) => {
  try {
    const sessions = await FilmSession.findAll({
      include: [
        { 
          model: Film,
          attributes: ['id', 'title', 'poster'] 
        },
        { 
          model: Cinema, 
          attributes: ['id', 'title', 'city'] 
        },
        { 
          model: CinemaHall, 
          attributes: ['id', 'title', 'numberHall'] 
        }
      ]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении сеансов', error: error.message });
  }
};

//Получить конкретный сеанс по ID
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await FilmSession.findByPk(id, {
      include: [
        { 
          model: Film, 
          attributes: ['id', 'title', 'poster'] 
        },
        { 
          model: Cinema
        },
        { 
          model: CinemaHall
        }
      ]
    });

    if (!session) {
      return res.status(404).json({ message: 'Сеанс не найден' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении сеанса', error: error.message });
  }
};

module.exports = {  getAllSessions,  getSessionById};