const { People, RoleInCinema, Film, Role } = require('../../models');

//Получить информацию об актёре или режиссёре по ID
const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await People.findByPk(id, {
      include: [
        {
          model: RoleInCinema,
          include: [
            { model: Role },
            {
              model: Film,
              attributes: ['id', 'title', 'poster']
            }
          ]
        }
      ]
    });

    if (!person) {
      return res.status(404).json({ message: 'Человек не найден' });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении информации о человеке', error: error.message });
  }
};

//Получить все фильмы, в которых участвовал человек
const getFilmsByPersonId = async (req, res) => {
  try {
    const { id } = req.params;

    const roles = await RoleInCinema.findAll({
      where: { peopleId: id },
      include: [
        {
          model: Film,
          attributes: ['id', 'title', 'poster']
        }
      ]
    });

    const films = roles.map(role => role.Film);

    res.json(films);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении фильмов по участнику', error: error.message });
  }
};

module.exports = {  getPersonById,  getFilmsByPersonId};