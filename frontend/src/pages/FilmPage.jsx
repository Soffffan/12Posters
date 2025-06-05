import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import FilterSidebar from "../components/FilterSidebar";
import filmApi from "../api/filmApi";
import filterApi from "../api/filterApi";
import "./FilmPage.css";

const FilmPage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [film, setFilm] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [sessionsLoading, setSessionsLoading] = useState(false); // Отдельный лоадер для сеансов

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

        // Получаем сеансы фильма без фильтров
        const sessionsData = await filmApi.getFilmSessionsByFilmId(id);
        setSessions(sessionsData);
      } catch (err) {
        console.error("Error fetching film data:", err);
        setError("Ошибка загрузки данных о фильме");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFilmData();
    }
  }, [id]);

  // Функция для применения фильтров
  const handleApplyFilters = async (filters) => {
    try {
      setSessionsLoading(true);
      setCurrentFilters(filters);
      
      // Получаем отфильтрованные сеансы
      const response = await filterApi.getFilteredSessionsForFilm(id, filters);
      
      // Проверяем формат ответа и извлекаем данные
      let filteredSessions = [];
      if (response && response.success && response.data) {
        filteredSessions = response.data;
      } else if (Array.isArray(response)) {
        filteredSessions = response;
      } else {
        console.warn('Неожиданный формат ответа от API:', response);
        filteredSessions = [];
      }
      
      setSessions(filteredSessions);
      
      // Показываем уведомление о количестве найденных сеансов
      if (filteredSessions.length === 0) {
        console.log('Сеансы по заданным фильтрам не найдены');
      } else {
        console.log(`Найдено сеансов: ${filteredSessions.length}`);
      }
      
    } catch (error) {
      console.error("Ошибка при применении фильтров:", error);
      setError("Не удалось загрузить отфильтрованные сеансы");
      
      // В случае ошибки загружаем все сеансы заново
      try {
        const allSessions = await filmApi.getFilmSessionsByFilmId(id);
        setSessions(allSessions);
      } catch (fallbackError) {
        console.error("Ошибка при загрузке всех сеансов:", fallbackError);
      }
    } finally {
      setSessionsLoading(false);
    }
  };

  // Функция для сброса фильтров
  const handleResetFilters = async () => {
    try {
      setSessionsLoading(true);
      setCurrentFilters({});
      
      // Загружаем все сеансы без фильтров
      const allSessions = await filmApi.getFilmSessionsByFilmId(id);
      setSessions(allSessions);
    } catch (error) {
      console.error("Ошибка при сбросе фильтров:", error);
      setError("Не удалось загрузить сеансы");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleGenreClick = (genreId) => {
    navigate(`/genre/${genreId}`);
  };

  const handlePersonClick = (personId) => {
    navigate(`/person/${personId}`);
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = () => {
    return filterApi.hasActiveFilters(currentFilters);
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
              e.target.src = "/placeholder-poster.jpg";
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

          {/* Кнопки управления фильтрами */}
          {activeTab === "sessions" && (
            <div className="filter-controls">
              <button
                className="filter-button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                disabled={sessionsLoading}
              >
                Фильтры 
                {hasActiveFilters() && (
                  <span className="filter-badge">
                    ({filterApi.getActiveFiltersCount(currentFilters)})
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="tab-content">
            {activeTab === "info" ? (
              <div className="film-info">
                {/* Секция информации о фильме */}
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
                        .filter((role) => role.Role.title === "Актёр")
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
                  <p>{new Date(film.releaseDate).toLocaleDateString("ru-RU")}</p>
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
                {sessionsLoading ? (
                  <div className="sessions-loading">
                    <p>Загрузка сеансов...</p>
                  </div>
                ) : sessions.length > 0 ? (
                  <>
                    {hasActiveFilters() && (
                      <div className="filter-info">
                        <p>Найдено сеансов: {sessions.length}</p>
                      </div>
                    )}
                    <SessionCard sessions={sessions} context="film" />
                  </>
                ) : (
                  <div className="no-sessions">
                    <p>
                      {hasActiveFilters() 
                        ? "Сеансы по заданным фильтрам не найдены. Попробуйте изменить условия поиска."
                        : "Сеансы для этого фильма не найдены"
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Панель фильтров */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        mode="film"
        filmId={id}
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default FilmPage;