const express = require('express');
const router = express.Router();
const {  getAllCinemas,  getCinemaById,  getFilmSessionsByCinemaId, searchCinemas} = require('../../controllers/user/cinemaController');

/**
 * @swagger
 * tags:
 *   name: Cinemas
 *   description: Управление кинотеатрами
 */

/**
 * @swagger
 * /api/cinemas/search:
 *   get:
 *     summary: Поиск кинотеатров по названию, адресу или метро
 *     tags: [Cinemas]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Строка поиска
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденные кинотеатры
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cinema'
 *       400:
 *         description: Отсутствует параметр query
 */
router.get('/search', searchCinemas);

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Получить список всех кинотеатров
 *     tags: [Cinemas]
 *     responses:
 *       200:
 *         description: Список кинотеатров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cinema'
 */
router.get('/', getAllCinemas);

/**
 * @swagger
 * /api/cinemas/{cinemaId}/sessions:
 *   get:
 *     summary: Получить все сеансы в конкретном кинотеатре
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: cinemaId
 *         required: true
 *         description: ID кинотеатра
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список сеансов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FilmSession'
 */
router.get('/:cinemaId/sessions', getFilmSessionsByCinemaId);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   get:
 *     summary: Получить кинотеатр по ID
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID кинотеатра
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о кинотеатре
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CinemaWithHalls'
 *       404:
 *         description: Кинотеатр не найден
 */
router.get('/:id', getCinemaById);

module.exports = router;
