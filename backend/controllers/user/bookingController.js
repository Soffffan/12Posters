const { FilmSession, HallSeat } = require('../../models');

//Получить все места для сеанса (по ID сеанса)
const getSeatsForSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await FilmSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ message: 'Сеанс не найден' });
    }

    const seats = await HallSeat.findAll({
      where: { cinemaHallId: session.cinemaHallId },
      order: [['rowNumber', 'ASC'], ['seatNumber', 'ASC']]
    });

    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении мест', error: error.message });
  }
};

//Забронировать одно место
const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    if (!seatId) {
      return res.status(400).json({ message: 'seatId обязателен' });
    }
    const seat = await HallSeat.findByPk(seatId);

    if (!seat) {
      return res.status(404).json({ message: 'Место не найдено' });
    }

    if (!seat.free) {
      return res.status(400).json({ message: 'Место уже занято' });
    }

    seat.free = false;
    await seat.save();

    res.json({ message: 'Место успешно забронировано', seat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при бронировании места', error: error.message });
  }
};

module.exports = {  getSeatsForSession,  bookSeat};