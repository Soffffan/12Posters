const API_BASE_URL = 'http://localhost:5000/api';

const personApi = {
  // Получить информацию о человеке по ID
  getPersonById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/person/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching person by ID:', error);
      throw error;
    }
  },

  // Получить все фильмы человека по ID
  getPersonFilms: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/person/${id}/films`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching person films:', error);
      throw error;
    }
  }
};

export default personApi;