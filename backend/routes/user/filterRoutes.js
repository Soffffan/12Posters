const express = require('express');
const router = express.Router();
const {  getFilterOptions, getFilteredFilms,  getFilteredSessionsForFilm, getFilteredSessionsForCinema } = require('../../controllers/user/filterController');

// Получение опций для фильтров (жанры, города, метро)
router.get('/options', getFilterOptions);

// Фильтрация фильмов для главной страницы
router.get('/films', getFilteredFilms);

// Фильтрация сеансов для страницы фильма
router.get('/films/:filmId/sessions', getFilteredSessionsForFilm);

// Фильтрация сеансов для страницы кинотеатра  
router.get('/cinemas/:cinemaId/sessions', getFilteredSessionsForCinema);

module.exports = router;