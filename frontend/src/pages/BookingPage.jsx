// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionApi from '../api/sessionApi';
import bookingApi from '../api/bookingApi';
import SeatMap from '../components/SeatMap';
import './BookingPage.css';

const BookingPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleCinemaClick = (cinemaId) => {
    if (cinemaId) {
      navigate(`/cinema/${cinemaId}`);
    }
  };

  useEffect(() => {
    console.log('SessionId from params:', sessionId);
    
    const fetchData = async () => {
        try {
        setLoading(true);

        const sessionData = await sessionApi.getSessionById(sessionId);
        const seatsData = await bookingApi.getSeatsForSession(sessionId);

        setSession(sessionData);
        setSeats(seatsData);

        } catch (err) {
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    if (sessionId) {
        fetchData();
    } else {
        setLoading(false);
    }
    }, [sessionId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Выберите места для бронирования');
      return;
    }

    setBookingLoading(true);
    try {
      // Бронируем каждое место отдельно
      const bookingPromises = selectedSeats.map(seatId => 
        bookingApi.bookSeat(seatId)
      );
      
      await Promise.all(bookingPromises);
      
      // Обновляем состояние мест
      setSeats(prev => 
        prev.map(seat => 
          selectedSeats.includes(seat.id) 
            ? { ...seat, free: false }
            : seat
        )
      );
      
      alert(`Успешно забронировано мест: ${selectedSeats.length}`);
      setSelectedSeats([]);
    } catch (err) {
      alert('Ошибка при бронировании');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.length * (session?.ticketPrice || 0);
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="booking-page">
        <div className="error">Сеанс не найден</div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Назад
        </button>
        
        <div className="session-info">
          <div className="session-main-info">
            <img 
              src={session.Film.poster} 
              alt={session.Film.title}
              className="session-poster"
              onError={(e) => {
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
            <div className="session-details">
              <h1 className="film-title_3">{session.Film.title}</h1>
              <div className="session-meta">
                <span className="session-date_1">{formatDate(session.date)}</span>
                <span className="session-time_1">{formatTime(session.time)}</span>
              </div>
              <div className="cinema-info_1">
                <div className="cinema-name" onClick={() => handleCinemaClick(session.Cinema.id)}>{session.Cinema.title}</div>
                <div className="hall-name">{session.CinemaHall.title}</div>
                {session.Cinema.address && (
                  <div className="cinema-address">{session.Cinema.address}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-content">
        <div className="seat-map-container">
          <div className="screen">
            <div className="screen-label">ЭКРАН</div>
          </div>
          
          <SeatMap 
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
          
          <div className="legend">
            <div className="legend-item">
              <div className="legend-seat free"></div>
              <span>Свободно</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat occupied"></div>
              <span>Занято</span>
            </div>
            <div className="legend-item">
              <div className="legend-seat selected"></div>
              <span>Выбрано</span>
            </div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <div className="selected-seats-info">
              <h3>Выбранные места:</h3>
              <div className="selected-seats-list">
                {selectedSeats.map(seatId => {
                  const seat = seats.find(s => s.id === seatId);
                  return seat ? (
                    <span key={seatId} className="selected-seat-item">
                      Ряд {seat.rowNumber}, место {seat.seatNumber}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="booking-total">
              <div className="total-price">
                Итого: {getTotalPrice()}₽
              </div>
              <button 
                className="book-button"
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Бронирование...' : 'Забронировать'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;