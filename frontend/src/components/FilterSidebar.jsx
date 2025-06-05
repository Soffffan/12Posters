import React, { useState, useEffect, useCallback } from "react";
import filterApi from "../api/filterApi";
import "./FilterSidebar.css";

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  mode = 'home', // 'home', 'film', 'cinema'
  filmId = null,
  cinemaId = null,
  currentFilters = {} // Текущие примененные фильтры
}) => {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    cities: [],
    metros: []
  });
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);

  // Мемоизируем функцию загрузки опций
  const loadFilterOptions = useCallback(async () => {
    try {
      setOptionsLoading(true);
      const options = await filterApi.getFilterOptions();
      if (options.success) {
        setFilterOptions(options.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке опций фильтров:', error);
      // Fallback данные в случае ошибки
      setFilterOptions({
        genres: [],
        cities: [],
        metros: []
      });
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  // Загружаем опции для фильтров при открытии
  useEffect(() => {
    if (isOpen) {
      loadFilterOptions();
    }
  }, [isOpen, loadFilterOptions]);

  // Отдельный useEffect для установки текущих фильтров
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (key, value, type = 'single') => {
    setFilters(prev => {
      if (type === 'checkbox') {
        const currentValues = prev[key] || [];
        if (currentValues.includes(value)) {
          return { ...prev, [key]: currentValues.filter(item => item !== value) };
        } else {
          return { ...prev, [key]: [...currentValues, value] };
        }
      }
      
      // Для пустых значений удаляем ключ из объекта
      if (value === '' || value === null || value === undefined) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      
      return { ...prev, [key]: value };
    });
  };

  // Применение фильтров
  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      // Передаем фильтры в родительский компонент
      await onApplyFilters(filters);
      onClose();
    } catch (error) {
      console.error('Ошибка при применении фильтров:', error);
    } finally {
      setLoading(false);
    }
  };

  // Сброс фильтров
  const handleResetFilters = () => {
    setFilters({});
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      return value !== null && value !== undefined && value !== '';
    });
  };

  // Компонент блока фильтра по фильмам
  const FilmFilters = () => (
    <div className="filter-group">
      <h3 className="filter-group-title">Фильм</h3>
      
      <div className="filter-field">
        <label>Название</label>
        <input
          type="text"
          placeholder="Введите название"
          value={filters.title || ''}
          onChange={(e) => handleFilterChange('title', e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label>Жанр</label>
        {optionsLoading ? (
          <div className="loading-small">Загрузка...</div>
        ) : (
          <select 
            value={filters.genreId || ''} 
            onChange={(e) => handleFilterChange('genreId', e.target.value)}
          >
            <option value="">Выберите жанр</option>
            {filterOptions.genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.title}</option>
            ))}
          </select>
        )}
      </div>

      <div className="filter-field">
        <label>Имя актера</label>
        <input
          type="text"
          placeholder="Введите имя актера"
          value={filters.peopleName || ''}
          onChange={(e) => handleFilterChange('peopleName', e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label>Фамилия актера</label>
        <input
          type="text"
          placeholder="Введите фамилию актера"
          value={filters.peopleSurname || ''}
          onChange={(e) => handleFilterChange('peopleSurname', e.target.value)}
        />
      </div>

      <div className="filter-range">
        <label>Рейтинг</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="От"
            min="0"
            max="10"
            step="0.1"
            value={filters.ratingMin || ''}
            onChange={(e) => handleFilterChange('ratingMin', e.target.value)}
          />
          <span className="range-separator">—</span>
          <input
            type="number"
            placeholder="До"
            min="0"
            max="10"
            step="0.1"
            value={filters.ratingMax || ''}
            onChange={(e) => handleFilterChange('ratingMax', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-range">
        <label>Продолжительность (мин)</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="От"
            min="0"
            value={filters.durationMin || ''}
            onChange={(e) => handleFilterChange('durationMin', e.target.value)}
          />
          <span className="range-separator">—</span>
          <input
            type="number"
            placeholder="До"
            min="0"
            value={filters.durationMax || ''}
            onChange={(e) => handleFilterChange('durationMax', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-range">
        <label>Дата выхода</label>
        <div className="range-inputs">
          <input
            type="date"
            value={filters.releaseDateFrom || ''}
            onChange={(e) => handleFilterChange('releaseDateFrom', e.target.value)}
          />
          <span className="range-separator">—</span>
          <input
            type="date"
            value={filters.releaseDateTo || ''}
            onChange={(e) => handleFilterChange('releaseDateTo', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-field">
        <label>Возрастной рейтинг</label>
        <select 
          value={filters.ageRating || ''} 
          onChange={(e) => handleFilterChange('ageRating', e.target.value)}
        >
          <option value="">Выберите рейтинг</option>
          <option value="0">0+</option>
          <option value="6">6+</option>
          <option value="12">12+</option>
          <option value="16">16+</option>
          <option value="18">18+</option>
        </select>
      </div>
    </div>
  );

  // Компонент блока фильтра по кинотеатрам
  const CinemaFilters = () => (
    <div className="filter-group">
      <h3 className="filter-group-title">Кинотеатр</h3>
      
      <div className="filter-field">
        <label>Город</label>
        {optionsLoading ? (
          <div className="loading-small">Загрузка...</div>
        ) : (
          <select 
            value={filters.city || ''} 
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="">Выберите город</option>
            {filterOptions.cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        )}
      </div>

      <div className="filter-field">
        <label>Метро</label>
        {optionsLoading ? (
          <div className="loading-small">Загрузка...</div>
        ) : (
          <select 
            value={filters.metro || ''} 
            onChange={(e) => handleFilterChange('metro', e.target.value)}
          >
            <option value="">Выберите метро</option>
            {filterOptions.metros.map(metro => (
              <option key={metro} value={metro}>{metro}</option>
            ))}
          </select>
        )}
      </div>

      <div className="filter-field">
        <label>Название кинотеатра</label>
        <input
          type="text"
          placeholder="Введите название"
          value={filters.cinemaTitle || ''}
          onChange={(e) => handleFilterChange('cinemaTitle', e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label>Адрес</label>
        <input
          type="text"
          placeholder="Введите адрес"
          value={filters.address || ''}
          onChange={(e) => handleFilterChange('address', e.target.value)}
        />
      </div>
    </div>
  );

  // Компонент блока фильтра по сеансам
  const SessionFilters = () => (
    <div className="filter-group">
      <h3 className="filter-group-title">Сеанс</h3>
      
      <div className="filter-field">
        <label>Дата</label>
        <input
          type="date"
          value={filters.date || ''}
          onChange={(e) => handleFilterChange('date', e.target.value)}
        />
      </div>

      <div className="filter-range">
        <label>Время начала сеанса</label>
        <div className="range-inputs">
          <input
            type="time"
            value={filters.startTimeFrom || ''}
            onChange={(e) => handleFilterChange('startTimeFrom', e.target.value)}
          />
          <span className="range-separator">—</span>
          <input
            type="time"
            value={filters.startTimeTo || ''}
            onChange={(e) => handleFilterChange('startTimeTo', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-range">
        <label>Цена билета (₽)</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="От"
            min="0"
            value={filters.ticketPriceMin || ''}
            onChange={(e) => handleFilterChange('ticketPriceMin', e.target.value)}
          />
          <span className="range-separator">—</span>
          <input
            type="number"
            placeholder="До"
            min="0"
            value={filters.ticketPriceMax || ''}
            onChange={(e) => handleFilterChange('ticketPriceMax', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h2 className="filter-title">Фильтры</h2>
          <button className="filter-close" onClick={onClose}>×</button>
        </div>

        <div className="filter-content">
          {/* Отображаем нужные блоки фильтров в зависимости от режима */}
          {mode === 'home' && (
            <>
              <FilmFilters />
              <CinemaFilters />
            </>
          )}
          
          {mode === 'film' && (
            <>
              <CinemaFilters />
              <SessionFilters />
            </>
          )}
          
          {mode === 'cinema' && (
            <>
              <FilmFilters />
              <SessionFilters />
            </>
          )}
        </div>

        <div className="filter-actions">
          <button 
            className="filter-reset" 
            onClick={handleResetFilters}
            disabled={loading || !hasActiveFilters()}
          >
            Сбросить
          </button>
          <button 
            className="filter-apply" 
            onClick={handleApplyFilters}
            disabled={loading}
          >
            {loading ? 'Применение...' : 'Применить'}
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;