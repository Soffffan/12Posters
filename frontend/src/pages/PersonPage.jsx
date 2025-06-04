import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilmCard from "../components/FilmCard";
import personApi from "../api/personApi";
import "./PersonPage.css";

const PersonPage = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [personData, setPersonData] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Функция для получения полного имени
  const getFullName = (person) => {
    if (!person) return '';
    return `${person.name || ''} ${person.surname || ''}`.trim();
  };

  useEffect(() => {
    const loadPersonData = async () => {
      if (!id) {
        setError('ID персоны не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Получаем данные о персоне
        const personInfo = await personApi.getPersonById(id);
        
        console.log('Полученные данные персоны:', personInfo);
        
        // Преобразуем данные в нужный формат
        const transformedPersonData = {
          id: personInfo.id,
          name: getFullName(personInfo),
          birthDate: formatDate(personInfo.birthday),
          birthPlace: personInfo.birthplace || 'Не указано',
          photo: personInfo.photo
        };

        console.log('Преобразованные данные:', transformedPersonData);

        // Группируем роли по фильмам
        const filmsMap = new Map();
        
        personInfo.RoleInCinemas?.forEach(role => {
          const filmId = role.Film.id;
          
          if (!filmsMap.has(filmId)) {
            filmsMap.set(filmId, {
              id: role.Film.id,
              title: role.Film.title,
              poster: role.Film.poster,
              roles: []
            });
          }
          
          // Определяем что показывать: имя персонажа для актёров или тип роли для остальных
          let roleDisplay;
          if (role.Role?.title === 'Актёр' && role.filmName) {
            roleDisplay = role.filmName; // Имя персонажа
          } else {
            roleDisplay = role.Role?.title || 'Неизвестная роль'; // Тип роли
          }
          
          filmsMap.get(filmId).roles.push(roleDisplay);
        });
        
        // Преобразуем Map в массив и объединяем роли через запятую
        const personFilms = Array.from(filmsMap.values()).map(film => ({
          ...film,
          rolesText: film.roles.join(', ')
        }));

        setPersonData(transformedPersonData);
        setFilms(personFilms);
        
      } catch (error) {
        console.error('Error loading person data:', error);
        setError('Ошибка загрузки данных о персоне');
      } finally {
        setLoading(false);
      }
    };

    loadPersonData();
  }, [id]);

  if (loading) {
    return <div className="person-page-loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="person-page-error">{error}</div>;
  }

  if (!personData) {
    return <div className="person-page-error">Данные о персоне не найдены</div>;
  }

  return (
    <div className="person-page">
      <div className="person-layout">
        {/* Фиксированное фото слева */}
        <div className="person-photo-container">
          <div className="person-photo-wrapper">
            <img 
              className="person-photo" 
              src={personData.photo} 
              alt={personData.name}
              onLoad={() => {
                console.log('Изображение успешно загружено:', personData.photo);
              }}
              onError={(e) => {
                console.error('Ошибка загрузки изображения:', personData.photo);
                e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Фото+недоступно';
              }}
            />
          </div>
        </div>

        {/* Скроллящийся контент справа */}
        <div className="person-content">
          <div className="person-info">
            <p className="person-name">{personData.name}</p>
            
            <div className="person-details">
              <div className="detail-group">
                <p className="detail-label">Дата рождения</p>
                <p className="detail-value">{personData.birthDate}</p>
              </div>
              
              <div className="detail-group">
                <p className="detail-label">Место рождения</p>
                <p className="detail-value">{personData.birthPlace}</p>
              </div>
            </div>
          </div>

          <div className="filmography-section">
            <p className="filmography-title">Фильмография</p>
            <div className="films-grid_1">
              {films.length > 0 ? (
                films.map((film) => (
                  <FilmCard 
                    key={film.id}
                    title={film.rolesText} 
                    img={film.poster} 
                    filmId={film.id}
                  />
                ))
              ) : (
                <p>Фильмы не найдены</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPage;