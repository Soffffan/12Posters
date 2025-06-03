const express = require('express');
const router = express.Router();
const {  getPersonById,  getFilmsByPersonId} = require('../../controllers/user/personController');

/**
 * @swagger
 * tags:
 *   name: Person
 *   description: Участники фильмов (актёры, режиссёры и др.)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     Film:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         poster:
 *           type: string
 *     RoleInCinema:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         filmId:
 *           type: integer
 *         peopleId:
 *           type: integer
 *         filmName:
 *           type: string
 *         roleId:
 *           type: integer
 *         Role:
 *           $ref: '#/components/schemas/Role'
 *         Film:
 *           $ref: '#/components/schemas/Film'
 *     Person:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *         birthplace:
 *           type: string
 *         photo:
 *           type: string
 *           format: uri
 *         RoleInCinemas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoleInCinema'
 */

/**
 * @swagger
 * /api/person/{id}:
 *   get:
 *     summary: Получить информацию об участнике кино по ID
 *     tags: [Person]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID участника
 *     responses:
 *       200:
 *         description: Информация об участнике
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       404:
 *         description: Участник не найден
 */
router.get('/:id', getPersonById);

/**
 * @swagger
 * /api/person/{id}/films:
 *   get:
 *     summary: Получить все фильмы, в которых участвовал человек
 *     tags: [Person]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID участника
 *     responses:
 *       200:
 *         description: Список фильмов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *       404:
 *         description: Участник не найден
 */
router.get('/:id/films', getFilmsByPersonId);

module.exports = router;
