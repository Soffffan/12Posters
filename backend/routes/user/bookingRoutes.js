const express = require('express');
const router = express.Router();
const {  getSeatsForSession,  bookSeat} = require('../../controllers/user/bookingController');

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Бронирование мест на сеансы
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HallSeat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         RowNumber:
 *           type: integer
 *         SeatNumber:
 *           type: integer
 *         Free:
 *           type: boolean
 *         CinemaHallId:
 *           type: integer
 *     BookSeatRequest:
 *       type: object
 *       required:
 *         - seatId
 *       properties:
 *         seatId:
 *           type: integer
 *           description: ID места для бронирования
 *     BookSeatResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         seat:
 *           $ref: '#/components/schemas/HallSeat'
 */

/**
 * @swagger
 * /api/bookings/seats/{id}:
 *   get:
 *     summary: Получить список мест для сеанса
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID сеанса
 *     responses:
 *       200:
 *         description: Список мест
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HallSeat'
 *       404:
 *         description: Сеанс не найден
 *       500:
 *         description: Ошибка при получении мест
 */
router.get('/seats/:id', getSeatsForSession);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Забронировать одно место
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookSeatRequest'
 *     responses:
 *       200:
 *         description: Место успешно забронировано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookSeatResponse'
 *       400:
 *         description: Некорректные данные или место уже занято
 *       404:
 *         description: Место не найдено
 *       500:
 *         description: Ошибка при бронировании
 */
router.post('/', bookSeat);

module.exports = router;
