import React from "react";
import "./SessionCard.css";

const SessionCard = ({ session, context }) => {
  return (
    <div className="session-card">
      {context === "film" ? (
        <div className="session-side">
          <div className="cinema-title">{session.cinemaTitle}</div>
        </div>
      ) : (
        <div className="session-side">
          <img
            src="https://image.tmdb.org/t/p/w200/8NFMvxvzTdKZVvzqFUxFqThmZQl.jpg"
            alt="Film Poster"
            className="side-poster"
          />
          <div className="film-title">Интерстеллар</div>
        </div>
      )}
      <div className="session-main">
        <div className="session-info">
          <span className="session-time">{session.time}</span>
          <span className="session-date">{session.date}</span>
        </div>
        <div className="session-price">{session.price} ₽</div>
        <button className="session-button">Купить билет</button>
      </div>
    </div>
  );
};

export default SessionCard;