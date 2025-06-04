// src/api/bookingApi.js

const API_BASE_URL = 'http://localhost:5000/api';

class BookingApi {
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

  // Получить все места для сеанса по ID сеанса
  async getSeatsForSession(id) {
    return this.makeRequest(`/bookings/seats/${id}`);
  }

  // Забронировать место по ID
  async bookSeat(seatId) {
    return this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({ seatId }),
    });
  }
}

const bookingApi = new BookingApi();
export default bookingApi;