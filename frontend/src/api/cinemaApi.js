const API_BASE_URL = 'http://localhost:5000/api';

const cinemaApi = {
  // Получить все кинотеатры
  getAllCinemas: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cinemas`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      throw error;
    }
  },

  // Получить информацию о конкретном кинотеатре по ID
  getCinemaById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cinemas/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cinema by ID:', error);
      throw error;
    }
  },

  // Получить все сеансы для конкретного кинотеатра
  getFilmSessionsByCinemaId: async (cinemaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cinemas/${cinemaId}/sessions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching film sessions by cinema ID:', error);
      throw error;
    }
  },

  // Поиск кинотеатров по запросу (название, адрес, метро)
  searchCinemas: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cinemas/search?query=${query}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching cinemas:', error);
      throw error;
    }
  }
};

export default cinemaApi;
