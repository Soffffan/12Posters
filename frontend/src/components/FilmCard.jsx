import React from "react";
import { useNavigate } from "react-router-dom";
import "./FilmCard.css";

const FilmCard = ({ title, img, filmId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Когда будете готовы добавить навигацию, раскомментируйте:
    navigate(`/film/${filmId}`);
    console.log(`Клик по фильму с ID: ${filmId}`);
  };

  return (
    <div className="film-card" onClick={handleClick}>
      <div className="poster-container">
        <img className="poster" src={img} alt={title} />
      </div>
      <div className="film-title">{title}</div>
    </div>
  );
};

export default FilmCard;