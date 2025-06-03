import React from "react";
import "./FilterSidebar.css";

const FilterSidebar = ({ isOpen, onClose }) => {
  const genres = [
    "Детектив", "Драма", "Комедия", "Боевик", "Триллер", 
    "Фантастика", "Ужасы", "Мелодрама", "Приключения"
  ];

  const years = [
    "2024", "2023", "2022", "2021", "2020", "2019", "2018"
  ];

  const countries = [
    "США", "Россия", "Великобритания", "Франция", "Германия", "Япония"
  ];

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h2 className="filter-title">Фильтры</h2>
          <button className="filter-close" onClick={onClose}>×</button>
        </div>

        <div className="filter-group">
          <h3 className="filter-group-title">Жанры</h3>
          <div className="filter-options">
            {genres.map((genre) => (
              <label key={genre} className="filter-option">
                <input type="checkbox" />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-group-title">Год выпуска</h3>
          <div className="filter-options">
            {years.map((year) => (
              <label key={year} className="filter-option">
                <input type="checkbox" />
                <span>{year}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-group-title">Страна</h3>
          <div className="filter-options">
            {countries.map((country) => (
              <label key={country} className="filter-option">
                <input type="checkbox" />
                <span>{country}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;