const API_BASE_URL = 'http://localhost:5000/api';

class FilterApi {
  // Получение опций для фильтров (жанры, города, метро)
  async getFilterOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/filters/options`);
      if (!response.ok) throw new Error('Ошибка при получении опций фильтров');
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении опций фильтров:', error);
      throw error;
    }
  }

  // Построение URL параметров из объекта фильтров
  buildFilterParams(filters) {
    const params = new URLSearchParams();
    
    // Функция для безопасного добавления параметра
    const addParam = (key, value) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    };

    // Фильтры по фильмам
    addParam('title', filters.title);
    addParam('genreId', filters.genreId);
    addParam('genreTitle', filters.genreTitle);
    addParam('ratingMin', filters.ratingMin);
    addParam('ratingMax', filters.ratingMax);
    addParam('ageRating', filters.ageRating);
    addParam('durationMin', filters.durationMin);
    addParam('durationMax', filters.durationMax);
    addParam('releaseDateFrom', filters.releaseDateFrom);
    addParam('releaseDateTo', filters.releaseDateTo);
    addParam('peopleName', filters.peopleName);
    addParam('peopleSurname', filters.peopleSurname);
    addParam('peopleId', filters.peopleId);

    // Фильтры по кинотеатрам
    addParam('city', filters.city);
    addParam('metro', filters.metro);
    addParam('cinemaTitle', filters.cinemaTitle);
    addParam('address', filters.address);

    // Фильтры по сеансам
    addParam('date', filters.date);
    addParam('startTime', filters.startTime);
    addParam('startTimeFrom', filters.startTimeFrom);
    addParam('startTimeTo', filters.startTimeTo);
    addParam('ticketPriceMin', filters.ticketPriceMin);
    addParam('ticketPriceMax', filters.ticketPriceMax);

    return params;
  }

  // Фильтрация фильмов для главной страницы
  async getFilteredFilms(filters) {
    try {
      const params = this.buildFilterParams(filters);
      const response = await fetch(`${API_BASE_URL}/filters/films?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при фильтрации фильмов:', error);
      throw error;
    }
  }

  // Фильтрация сеансов для страницы фильма
  async getFilteredSessionsForFilm(filmId, filters) {
    try {
      if (!filmId) {
        throw new Error('ID фильма не указан');
      }

      const params = this.buildFilterParams(filters);
      const response = await fetch(`${API_BASE_URL}/filters/films/${filmId}/sessions?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при фильтрации сеансов для фильма:', error);
      throw error;
    }
  }

  // Фильтрация сеансов для страницы кинотеатра
  async getFilteredSessionsForCinema(cinemaId, filters) {
    try {
      if (!cinemaId) {
        throw new Error('ID кинотеатра не указан');
      }

      const params = this.buildFilterParams(filters);
      const response = await fetch(`${API_BASE_URL}/filters/cinemas/${cinemaId}/sessions?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при фильтрации сеансов для кинотеатра:', error);
      throw error;
    }
  }

  // Дополнительные методы для удобства

  // Проверка, есть ли активные фильтры
  hasActiveFilters(filters) {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      return value !== null && value !== undefined && value !== '';
    });
  }

  // Очистка пустых фильтров
  cleanFilters(filters) {
    const cleaned = {};
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

  // Получение количества активных фильтров
  getActiveFiltersCount(filters) {
    return Object.keys(this.cleanFilters(filters)).length;
  }
}

export default new FilterApi();