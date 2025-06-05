import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import movieIcon from '../assets/movie.png';
import filmApi from '../api/filmApi';
import cinemaApi from '../api/cinemaApi';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ films: [], cinemas: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce для оптимизации поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults({ films: [], cinemas: [] });
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Закрытие dropdown при клике вне области поиска
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const [filmsResponse, cinemasResponse] = await Promise.all([
        filmApi.searchFilms(searchQuery),
        cinemaApi.searchCinemas(searchQuery)
      ]);

      setSearchResults({
        films: filmsResponse.slice(0, 5), // Ограничиваем до 5 результатов
        cinemas: cinemasResponse.slice(0, 5)
      });
      setShowDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ films: [], cinemas: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchResults.films.length > 0 || searchResults.cinemas.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleResultClick = (type, id) => {
    setShowDropdown(false);
    setSearchQuery('');
    if (type === 'film') {
      navigate(`/film/${id}`);
    } else if (type === 'cinema') {
      navigate(`/cinema/${id}`);
    }
  };

  const handleClick = () => {
    navigate(`/`);
  };

  const hasResults = searchResults.films.length > 0 || searchResults.cinemas.length > 0;

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={handleClick}>
          <img src={movieIcon} alt="Movie icon" className="logo-icon" />
          <span className="logo-text">12 Posters</span>
        </div>
        <div className="header-right">
          <div className="search-container" ref={searchRef}>
            <input 
              type="text" 
              placeholder="Поиск" 
              className="search-input"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            
            {showDropdown && (
              <div className="search-dropdown" ref={dropdownRef}>
                {isSearching && (
                  <div className="search-loading">
                    <span>Поиск...</span>
                  </div>
                )}
                
                {!isSearching && !hasResults && searchQuery.length >= 2 && (
                  <div className="search-no-results">
                    <span>Ничего не найдено</span>
                  </div>
                )}

                {!isSearching && hasResults && (
                  <>
                    {searchResults.films.length > 0 && (
                      <div className="search-section">
                        <div className="search-section-title">
                          <span>Фильмы</span>
                        </div>
                        {searchResults.films.map((film) => (
                          <div 
                            key={`film-${film.id}`}
                            className="search-result-item"
                            onClick={() => handleResultClick('film', film.id)}
                          >
                            <img 
                              src={film.poster} 
                              alt={film.title}
                              className="search-result-poster"
                            />
                            <span className="search-result-title">{film.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.cinemas.length > 0 && (
                      <div className="search-section">
                        <div className="search-section-title">
                          <span>Кинотеатры</span>
                        </div>
                        {searchResults.cinemas.map((cinema) => (
                          <div 
                            key={`cinema-${cinema.id}`}
                            className="search-result-item"
                            onClick={() => handleResultClick('cinema', cinema.id)}
                          >
                            <div className="search-result-cinema-icon">🎭</div>
                            <div className="search-result-cinema-info">
                              <span className="search-result-title">{cinema.title}</span>
                              <span className="search-result-subtitle">
                                {cinema.metro && `${cinema.metro} • `}{cinema.address}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="profile-avatar">
            <div className="avatar-circle"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;