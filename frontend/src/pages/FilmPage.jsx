import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import filmApi from "../api/filmApi";
import "./FilmPage.css";

const FilmPage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [film, setFilm] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем информацию о фильме
        const filmData = await filmApi.getFilmById(id);
        setFilm(filmData);
        
        // Получаем сеансы фильма
        const sessionsData = await filmApi.getFilmSessionsByFilmId(id);
        setSessions(sessionsData);
        
      } catch (err) {
        console.error('Error fetching film data:', err);
        setError('Ошибка загрузки данных о фильме');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFilmData();
    }
  }, [id]);

  const handleGenreClick = (genreId) => {
    navigate(`/genre/${genreId}`);
  };

  const handlePersonClick = (personId) => {
    navigate(`/person/${personId}`);
  };

  if (loading) {
    return (
      <div className="film-page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="film-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="film-page">
        <div className="error">Фильм не найден</div>
      </div>
    );
  }

  return (
    <div className="film-page">
      <div className="film-content">
        <div className="film-poster-container">
          <img 
            className="film-poster" 
            src={film.poster} 
            alt={film.title} 
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
        </div>
        
        <div className="film-main">
          <h1 className="film-title_1">{film.title}</h1>
          <p className="film-description">{film.description}</p>
          
          <div className="film-tabs">
            <button
              className={`tab-button_1 ${activeTab === "info" ? "active" : ""} no-focus`}
              onClick={() => setActiveTab("info")}
            >
              Информация
            </button>
            <button
              className={`tab-button_1 ${activeTab === "sessions" ? "active" : ""} no-focus`}
              onClick={() => setActiveTab("sessions")}
            >
              Сеансы
            </button>
          </div>


          <div className="tab-content">
            {activeTab === "info" ? (
              <div className="film-info">
                {film.FilmGenres && film.FilmGenres.length > 0 && (
                  <div className="info-section">
                    <h3>Жанры</h3>
                    <div className="genres-list">
                      {film.FilmGenres.map((filmGenre) => (
                        <button
                          key={filmGenre.Genre.id}
                          className="genre-tag"
                          onClick={() => handleGenreClick(filmGenre.Genre.id)}
                        >
                          {filmGenre.Genre.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {film.RoleInCinemas && film.RoleInCinemas.length > 0 && (
                  <div className="info-section">
                    <h3>Актеры</h3>
                    <div className="actors-list">
                      {film.RoleInCinemas
                        .filter(role => role.Role.title === "Актёр")
                        .slice(0, 5)
                        .map((role) => (
                          <button
                            key={role.Person.id}
                            className="actor-tag"
                            onClick={() => handlePersonClick(role.Person.id)}
                          >
                            {role.Person.name} {role.Person.surname}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="info-section">
                  <h3>Время</h3>
                  <p>{film.duration} мин.</p>
                </div>

                <div className="info-section">
                  <h3>Дата выхода</h3>
                  <p>{new Date(film.releaseDate).toLocaleDateString('ru-RU')}</p>
                </div>

                {film.rating && (
                  <div className="info-section">
                    <h3>Рейтинг</h3>
                    <p>{film.rating}</p>
                  </div>
                )}

                <div className="info-section">
                  <h3>Возрастной рейтинг</h3>
                  <p>{film.ageRating}+</p>
                </div>
              </div>
            ) : (
              <div className="film-sessions">
                {sessions.length > 0 ? (
                  <SessionCard sessions={sessions} context="film" />
                ) : (
                  <div className="no-sessions">
                    <p>Сеансы для этого фильма не найдены</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmPage;