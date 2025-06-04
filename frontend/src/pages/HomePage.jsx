import React, { useState, useEffect } from "react";
import FilmCard from "../components/FilmCard";
import FilterSidebar from "../components/FilterSidebar";
import filmApi from "../api/filmApi";
import "./HomePage.css";

const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Загрузка фильмов при монтировании компонента
  useEffect(() => {
    loadFilms();
  }, []);

  const loadFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Пока используем заглушку
      //setFilms(mockFilms);
      
      
      const filmsData = await filmApi.getAllFilmsBasic();
      setFilms(filmsData);
      
      
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err);
      setError('Не удалось загрузить фильмы');
      // В случае ошибки API используем заглушку
      setFilms(mockFilms);
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
          </button>
        </div>

        {isFilterOpen && <FilterSidebar />}

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
            {films.map((film) => (
              <FilmCard 
                key={film.id} 
                title={film.title} 
                img={film.poster} 
                filmId={film.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;