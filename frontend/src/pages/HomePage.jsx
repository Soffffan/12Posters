import React, { useState, useEffect, useMemo } from "react";
import FilmCard from "../components/FilmCard";
import FilterSidebar from "../components/FilterSidebar";
import filmApi from "../api/filmApi";
import filterApi from "../api/filterApi";
import "./HomePage.css";

const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  // Mock данные
  const mockFilms = [
    { 
      id: 1,
      title: "Все везде и сразу", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 2,
      title: "Отель \"Грандбудапешт\"", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 3,
      title: "Круэлла", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 4,
      title: "Ведьмина служба доставки", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 5,
      title: "Перл", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 6,
      title: "Все везде и сразу", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 7,
      title: "Отель \"Грандбудапешт\"", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 8,
      title: "Круэлла", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 9,
      title: "Ведьмина служба доставки", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
    { 
      id: 10,
      title: "Перл", 
      poster: "https://ae04.alicdn.com/kf/S9dfd0dafc5b9455fa6040c60d46fbfb9z.jpg_480x480.jpg" 
    },
  ];

  // Мемоизируем объект фильтров для предотвращения бесконечного цикла
  const memoizedCurrentFilters = useMemo(() => currentFilters, [currentFilters]);

  // Загрузка фильмов при монтировании компонента
  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Если есть активные фильтры, используем API фильтрации
      if (Object.keys(currentFilters).length > 0) {
        const filteredData = await filterApi.getFilteredFilms(currentFilters);
        if (filteredData.success) {
          setFilms(filteredData.data);
        } else {
          throw new Error('Ошибка при фильтрации фильмов');
        }
      } else {
        // Иначе загружаем все фильмы
        const filmsData = await filmApi.getAllFilmsBasic();
        setFilms(filmsData);
      }
      
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err);
      setError('Не удалось загрузить фильмы');
      // В случае ошибки API используем заглушку
      setFilms(mockFilms);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (filters) => {
    try {
      setLoading(true);
      setCurrentFilters(filters);

      // Если фильтры пустые, загружаем все фильмы
      if (Object.keys(filters).length === 0) {
        const filmsData = await filmApi.getAllFilmsBasic();
        setFilms(filmsData);
      } else {
        // Применяем фильтры
        const filteredData = await filterApi.getFilteredFilms(filters);
        
        if (filteredData.success) {
          setFilms(filteredData.data);
          console.log('Отфильтрованные фильмы:', filteredData.data); // Теперь выводим данные, только если они есть
        } else {
          throw new Error('Ошибка при фильтрации фильмов');
        }
      }
    } catch (err) {
      console.error('Ошибка при применении фильтров:', err);
      setError('Ошибка при применении фильтров');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="home-container">
      <div className="home-content">
        <div className="filter-section">
          <button
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Фильтр
            {Object.keys(currentFilters).length > 0 && (
              <span className="filter-count">({Object.keys(currentFilters).length})</span>
            )}
          </button>
        </div>

        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          mode="home"
          currentFilters={memoizedCurrentFilters}
        />

        {loading && (
          <div className="loading-message">
            Загрузка фильмов...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && (
          <div className="films-grid">
            {films.length > 0 ? (
              films.map((film) => (
                <FilmCard 
                  key={film.id} 
                  title={film.title} 
                  img={film.poster} 
                  filmId={film.id}
                />
              ))
            ) : (
              <div className="no-results">
                Фильмы не найдены
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;