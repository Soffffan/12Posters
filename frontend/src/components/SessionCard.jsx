import React from "react";
import { useNavigate } from "react-router-dom";
import "./SessionCard.css";

const SessionCard = ({ sessions, context }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const handleCinemaClick = (cinemaId) => {
    if (context === "film" && cinemaId) {
      navigate(`/cinema/${cinemaId}`);
    }
  };

  const handleBuyTicket = (sessionId) => {
    console.log(`Покупка билета на сеанс ${sessionId}`);
  };

  // Группируем сеансы по кинотеатрам и датам
  const groupedSessions = {};
  
  sessions.forEach(session => {
    const cinemaKey = session.Cinema.title;
    if (!groupedSessions[cinemaKey]) {
      groupedSessions[cinemaKey] = {
        cinema: session.Cinema,
        dates: {}
      };
    }
    
    const dateKey = formatDate(session.date);
    if (!groupedSessions[cinemaKey].dates[dateKey]) {
      groupedSessions[cinemaKey].dates[dateKey] = [];
    }
    
    groupedSessions[cinemaKey].dates[dateKey].push(session);
  });

  return (
    <div className="sessions-container">
      {Object.entries(groupedSessions).map(([cinemaName, cinemaData]) => (
        <div key={cinemaName} className="cinema-sessions-block">
          <div className="cinema-header">
            <div 
              className="cinema-name"
              onClick={() => handleCinemaClick(cinemaData.cinema.id)}
            >
              {cinemaData.cinema.title}
            </div>
            <div className="cinema-info">
              {cinemaData.cinema.address && (
                <span className="cinema-address">{cinemaData.cinema.address}</span>
              )}
              {cinemaData.cinema.metro && (
                <span className="cinema-metro">м. {cinemaData.cinema.metro}</span>
              )}
            </div>
          </div>
          
          {Object.entries(cinemaData.dates).map(([date, dateSessions]) => (
            <div key={date} className="date-sessions">
              <div className="session-date">{date}</div>
              <div className="sessions-grid">
                {dateSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="session-time-block"
                    onClick={() => handleBuyTicket(session.id)}
                  >
                    <div className="session-time">{formatTime(session.time)}</div>
                    <div className="session-price">{session.ticketPrice}₽</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SessionCard;