const express = require('express');
const router = express.Router();
const {  getAllFilmsBasic,  getGenreById, getFilmsByGenreId, getFilmById,  getFilmSessionsByFilmId,  searchFilms} = require('../../controllers/user/filmController');

/**
 * @swagger
 * tags:
 *   name: Films
 *   description: Работа с фильмами
 */

/**
 * @swagger
 * /api/films/search:
 *   get:
 *     summary: Поиск фильмов по названию
 *     tags: [Films]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Текст поиска по названию фильма
 *     responses:
 *       200:
 *         description: Список фильмов, подходящих по названию
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/search', searchFilms);

/**
 * @swagger
 * /api/films:
 *   get:
 *     summary: Получить список фильмов (только постеры и названия)
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: Список фильмов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   poster:
 *                     type: string
 */
router.get('/', getAllFilmsBasic);

/**
 * @swagger
 * /api/films/genre/{id}:
 *   get:
 *     summary: Получить информацию о жанре по ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID жанра
 *     responses:
 *       200:
 *         description: Информация о жанре
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Жанр не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/genre/:id', getGenreById);

/**
 * @swagger
 * /api/films/genre/films/{genreId}:
 *   get:
 *     summary: Получить список фильмов по ID жанра (только постеры и названия)
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID жанра для фильтрации фильмов
 *     responses:
 *       200:
 *         description: Список фильмов по жанру
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   poster:
 *                     type: string
 *       400:
 *         description: Ошибка в параметрах запроса
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/genre/films/:genreId', getFilmsByGenreId);


/**
 * @swagger
 * /api/films/{filmId}/sessions:
 *   get:
 *     summary: Получить сеансы фильма по ID фильма
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: filmId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID фильма
 *     responses:
 *       200:
 *         description: Сеансы фильма
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/:filmId/sessions', getFilmSessionsByFilmId);

/**
 * @swagger
 * /api/films/{id}:
 *   get:
 *     summary: Получить полную информацию о фильме по ID
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID фильма
 *     responses:
 *       200:
 *         description: Информация о фильме
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Фильм не найден
 */
router.get('/:id', getFilmById);

module.exports = router;