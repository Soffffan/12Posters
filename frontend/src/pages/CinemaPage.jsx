import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionCard from "../components/SessionCard";
import FilterSidebar from "../components/FilterSidebar";
import cinemaApi from "../api/cinemaApi";
import filterApi from "../api/filterApi";
import "./CinemaPage.css";

const CinemaPage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [cinema, setCinema] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [sessionsLoading, setSessionsLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Функция для применения фильтров
  const handleApplyFilters = async (filters) => {
    try {
      setSessionsLoading(true);
      setCurrentFilters(filters);
      
      // Получаем отфильтрованные сеансы для кинотеатра
      const response = await filterApi.getFilteredSessionsForCinema(id, filters);
      
      // Проверяем формат ответа и извлекаем данные
      let filteredSessions = [];
      if (response && response.success && response.data) {
        filteredSessions = response.data;
      } else if (Array.isArray(response)) {
        filteredSessions = response;
      } else if (response && response.sessions) {
        filteredSessions = response.sessions;
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
        const allSessions = await cinemaApi.getFilmSessionsByCinemaId(id);
        setSessions(allSessions);
      } catch (fallbackError) {
        console.error("Ошибка при загрузке всех сеансов:", fallbackError);
      }
    } finally {
      setSessionsLoading(false);
    }
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = () => {
    return filterApi.hasActiveFilters(currentFilters);
  };

  // Функция для сброса фильтров и загрузки всех сеансов
  const handleResetFilters = async () => {
    try {
      setSessionsLoading(true);
      setCurrentFilters({});
      
      // Загружаем все сеансы кинотеатра без фильтров
      const allSessions = await cinemaApi.getFilmSessionsByCinemaId(id);
      setSessions(allSessions);
      
    } catch (error) {
      console.error("Ошибка при сбросе фильтров:", error);
      setError("Не удалось загрузить сеансы");
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCinemaData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Получаем информацию о кинотеатре
        const cinemaData = await cinemaApi.getCinemaById(id);
        setCinema(cinemaData);
        
        // Получаем сеансы кинотеатра
        const sessionsData = await cinemaApi.getFilmSessionsByCinemaId(id);
        setSessions(sessionsData);
        
      } catch (err) {
        console.error('Error fetching cinema data:', err);
        setError('Ошибка загрузки данных о кинотеатре');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCinemaData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="cinema-page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cinema-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!cinema) {
    return (
      <div className="cinema-page">
        <div className="error">Кинотеатр не найден</div>
      </div>
    );
  }

  return (
    <div className="cinema-page">
      <div className="cinema-content">
        <div className="cinema-main">
          <h1 className="cinema-title">{cinema.title}</h1>
          <p className="cinema-description">{cinema.description}</p>
          
          <div className="cinema-tabs">
            <button
              className={`tab-button_2 ${activeTab === "info" ? "active" : ""} no-focus`}
              onClick={() => setActiveTab("info")}
            >
              Информация
            </button>
            <button
              className={`tab-button_2 ${activeTab === "sessions" ? "active" : ""} no-focus`}
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
              <div className="cinema-info">
                <div className="info-section">
                  <h3>Адрес</h3>
                  <p>{cinema.address}</p>
                </div>

                <div className="info-section">
                  <h3>Город</h3>
                  <p>{cinema.city}</p>
                </div>

                {cinema.metro && (
                  <div className="info-section">
                    <h3>Метро</h3>
                    <p>{cinema.metro}</p>
                  </div>
                )}

                {cinema.phoneNumber && (
                  <div className="info-section">
                    <h3>Номер телефона</h3>
                    <p>{cinema.phoneNumber}</p>
                  </div>
                )}

                <div className="info-section">
                  <h3>Количество залов</h3>
                  <p>{cinema.numberHalls}</p>
                </div>

                <div className="info-section">
                  <h3>Общее количество мест</h3>
                  <p>{cinema.numberSeats}</p>
                </div>

                <div className="info-section">
                  <h3>Статус</h3>
                  <p className={`status ${cinema.status === 'Открыт' ? 'open' : 'closed'}`}>
                    {cinema.status}
                  </p>
                </div>

                {cinema.CinemaHalls && cinema.CinemaHalls.length > 0 && (
                  <div className="info-section">
                    <h3>Залы</h3>
                    <div className="halls-list">
                      {cinema.CinemaHalls.map((hall) => (
                        <div key={hall.id} className="hall-item">
                          <span className="hall-name">{hall.title}</span>
                          <span className="hall-seats">{hall.numberSeats} мест</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="cinema-sessions">
                {sessionsLoading ? (
                  <div className="sessions-loading">
                    <p>Загрузка сеансов...</p>
                  </div>
                ) : sessions.length > 0 ? (
                  <>
                    <SessionCard sessions={sessions} context="cinema" />
                  </>
                ) : (
                  <div className="no-sessions">
                    <p>
                      {hasActiveFilters() 
                        ? "Сеансы по заданным фильтрам не найдены. Попробуйте изменить условия поиска."
                        : "Сеансы для этого кинотеатра не найдены"
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
        mode="cinema"
        cinemaId={id}
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default CinemaPage;