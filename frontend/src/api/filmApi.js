// src/api/filmApi.js

const API_BASE_URL = 'http://localhost:5000/api';

class FilmApi {
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  //Получить все фильмы (постеры и названия для главной страницы)
  async getAllFilmsBasic() {
    return this.makeRequest('/films');
  }

  //Получить полную информацию о фильме по ID
  async getFilmById(id) {
    return this.makeRequest(`/films/${id}`);
  }

  //Получить полную информацию о жанре по ID
  async getGenreById(id) {
    return this.makeRequest(`/films/genre/${id}`);
  }

  //Получить полную информацию о фильме по ID
  async getFilmsByGenreId(id) {
    return this.makeRequest(`/films/genre/films/${id}`);
  }

  //Получить сеансы по ID фильма
  async getFilmSessionsByFilmId(filmId) {
    return this.makeRequest(`/films/${filmId}/sessions`);
  }

  //Поиск фильмов по названию
  async searchFilms(query) {
    return this.makeRequest(`/films/search?query=${encodeURIComponent(query)}`);
  }
}

//Экспортируем единственный экземпляр
const filmApi = new FilmApi();
export default filmApi;