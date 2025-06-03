import React, { useState } from "react";
import SessionCard from "../components/SessionCard";
import "./FilmPage.css";

const FilmPage = () => {
  const [activeTab, setActiveTab] = useState("info");

  const film = {
    title: "Интерстеллар",
    poster: "https://image.tmdb.org/t/p/w500/8NFMvxvzTdKZVvzqFUxFqThmZQl.jpg",
    description: `Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, группа исследователей и учёных отправляется сквозь червоточину в другое измерение.`,
    country: "США",
    releaseDate: "2014",
    duration: "169 мин",
    ageRating: "12+",
    genres: ["Фантастика", "Драма", "Приключения"],
  };

  const sessions = [
    {
      id: 1,
      time: "14:30",
      date: "2025-05-21",
      price: 350,
      cinemaTitle: "Кинотеатр Пионер",
    },
    {
      id: 2,
      time: "17:00",
      date: "2025-05-21",
      price: 400,
      cinemaTitle: "Синема Парк",
    },
  ];

  return (
    <div className="film-page">
      <div className="film-tabs">
        <button
          className={activeTab === "info" ? "active" : ""}
          onClick={() => setActiveTab("info")}
        >
          Информация
        </button>
        <button
          className={activeTab === "sessions" ? "active" : ""}
          onClick={() => setActiveTab("sessions")}
        >
          Сеансы
        </button>
      </div>

      {activeTab === "info" ? (
        <div className="film-info">
          <img className="film-poster" src={film.poster} alt={film.title} />
          <div className="film-details">
            <h1>{film.title}</h1>
            <p className="description">{film.description}</p>
            <ul>
              <li><strong>Страна:</strong> {film.country}</li>
              <li><strong>Год:</strong> {film.releaseDate}</li>
              <li><strong>Длительность:</strong> {film.duration}</li>
              <li><strong>Возрастной рейтинг:</strong> {film.ageRating}</li>
              <li><strong>Жанры:</strong> {film.genres.join(", ")}</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="film-sessions">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} context="film" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmPage;