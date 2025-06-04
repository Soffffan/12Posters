import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilmCard from "../components/FilmCard";
import filmApi from "../api/filmApi";
import "./GenrePage.css";

const GenrePage = () => {
  const { id: genreId } = useParams(); // Получаем ID жанра из URL
  const [genreData, setGenreData] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock данные
  const mockGenreData = {
    name: "Детектив",
    description: "Детектив в кинематографе — это жанр фильмов, где основное внимание уделяется расследованию таинственного события, чаще всего преступления, с целью раскрытия истины и установления виновного. Этот жанр часто сочетается с триллером и другими жанрами, например, комедией, создавая различные поджанры детектива.",
    traits: [
      "Фильм строится вокруг поиска и раскрытия тайны, чаще всего преступления.",
      "Повествование обычно включает в себя различные версии событий и загадки, заставляющие зрителей строить свои гипотезы.",
      "В завершении фильма часто происходит неожиданный поворот сюжета, раскрывающий истину и выявляющий виновного.",
      "Детектив может сочетаться с другими жанрами, например, триллером, комедией, научной фантастикой, вестерном.",
      "Главные герои часто представлены как сыщики, полиция, адвокаты или другие лица, занимающиеся расследованием."
    ]
  };

  const mockFilms = [
    { 
      id: 1, 
      title: "Убийство в Восточном экспрессе", 
      poster: "https://www.themoviedb.org/t/p/w500/3ovFaFeojLFIl5ClqhtgYMDS8sE.jpg" 
    },
    { 
      id: 2, 
      title: "Смерть наНиле", 
      poster: "https://www.themoviedb.org/t/p/w500/kVr5zBa4SbOlCFBAfcV8XmgNCEH.jpg" 
    },
    { 
      id: 3, 
      title: "Призраки в Венеции", 
      poster: "https://www.themoviedb.org/t/p/w500/1Xgjl22MkAZQUavvOeBqRehrvqO.jpg" 
    },
    { 
      id: 4, 
      title: "Достать ножи", 
      poster: "https://www.themoviedb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg" 
    },
    { 
      id: 5, 
      title: "Достать ножи: Стеклянная луковица", 
      poster: "https://www.themoviedb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg" 
    },
    { 
      id: 6, 
      title: "Молчание ягнят", 
      poster: "https://www.themoviedb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg" 
    },
    { 
      id: 7, 
      title: "Собиратель душ", 
      poster: "https://www.themoviedb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg" 
    },
    { 
      id: 8, 
      title: "Остров проклятых", 
      poster: "https://www.themoviedb.org/t/p/w500/4G6FNNLSIVrwSRZyFs91hQ3lZtD.jpg" 
    },
    { 
      id: 9, 
      title: "Коматозники", 
      poster: "https://www.themoviedb.org/t/p/w500/9NSKaKptaEgEOWBzWX8Aa8dljQJ.jpg" 
    },
    { 
      id: 10, 
      title: "Перл", 
      poster: "https://www.themoviedb.org/t/p/w500/ulBLIBqvdnf4H6JBt0OpMCU1ECn.jpg" 
    }
  ];

  useEffect(() => {
    const loadGenreData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading genre data for ID:', genreId);
        
        // API вызовы (раскомментируйте когда будет готов бэкенд)
        const genreInfo = await filmApi.getGenreById(genreId);
        const genreFilms = await filmApi.getFilmsByGenreId(genreId);
        
        console.log('Genre info:', genreInfo);
        console.log('Genre films:', genreFilms);
        
        // Проверяем структуру данных и адаптируем под наш интерфейс
        const adaptedGenreData = {
          name: genreInfo.title || 'Неизвестный жанр',
          description: genreInfo.description || 'Описание отсутствует'
        };
        
        setGenreData(adaptedGenreData);
        setFilms(Array.isArray(genreFilms) ? genreFilms : []);

        // Используем mock данные если API не работает
        // setGenreData(mockGenreData);
        // setFilms(mockFilms);
        
      } catch (error) {
        console.error('Error loading genre data:', error);
        setError('Ошибка загрузки данных о жанре');
        
        // Fallback на mock данные при ошибке
        console.log('Using mock data as fallback');
        setGenreData(mockGenreData);
        setFilms(mockFilms);
      } finally {
        setLoading(false);
      }
    };

    if (genreId) {
      loadGenreData();
    }
  }, [genreId]);

  if (loading) {
    return <div className="genre-page-loading">Загрузка...</div>;
  }

  if (error && !genreData) {
    return <div className="genre-page-error">{error}</div>;
  }

  if (!genreData) {
    return <div className="genre-page-error">Данные о жанре не найдены</div>;
  }

  return (
    <div className="genre-page">
      <div className="genre-content">
        <p className="genre-title">{genreData.name}</p>
        
        <div className="genre-description">
          <p>{genreData.description}</p>
        </div>

        <div className="films-section">
          <h2 className="films-title">Фильмы</h2>
          <div className="films-grid">
            {films && films.length > 0 ? (
              films.map((film) => (
                <FilmCard 
                  key={film.id} 
                  id={film.id}
                  title={film.title} 
                  img={film.poster} 
                />
              ))
            ) : (
              <p className="no-films-message">Фильмы не найдены</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenrePage;