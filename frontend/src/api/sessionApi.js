// src/api/sessionApi.js

const API_BASE_URL = 'http://localhost:5000/api';

class SessionApi {
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

  // Получить все сеансы
  async getAllSessions() {
    return this.makeRequest('/sessions');
  }

  // Получить конкретный сеанс по ID
  async getSessionById(id) {
    return this.makeRequest(`/sessions/${id}`);
  }
}

const sessionApi = new SessionApi();
export default sessionApi;
