const express = require('express');
const router = express.Router();
const {  getAllSessions,  getSessionById} = require('../../controllers/user/sessionController');

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Управление сеансами фильмов
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FilmShort:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         poster:
 *           type: string
 *           format: uri
 *     CinemaShort:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         city:
 *           type: string
 *     CinemaHallShort:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         numberHall:
 *           type: integer
 *     FilmSession:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         filmId:
 *           type: integer
 *         cinemaId:
 *           type: integer
 *         cinemaHallId:
 *           type: integer
 *         dateTime:
 *           type: string
 *           format: date-time
 *         Film:
 *           $ref: '#/components/schemas/FilmShort'
 *         Cinema:
 *           $ref: '#/components/schemas/CinemaShort'
 *         CinemaHall:
 *           $ref: '#/components/schemas/CinemaHallShort'
 */

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Получить все сеансы
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Список всех сеансов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FilmSession'
 *       500:
 *         description: Ошибка при получении данных
 */
router.get('/', getAllSessions);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Получить конкретный сеанс по ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сеанса
 *     responses:
 *       200:
 *         description: Детали сеанса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilmSession'
 *       404:
 *         description: Сеанс не найден
 *       500:
 *         description: Ошибка при получении данных
 */
router.get('/:id', getSessionById);

module.exports = router;