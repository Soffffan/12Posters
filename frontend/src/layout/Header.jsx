import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import movieIcon from '../assets/movie.png';

const Header = () => {

  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/`);
  };
  
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={handleClick}>
          <img src={movieIcon} alt="Movie icon" className="logo-icon" />
          <span className="logo-text">12 Posters</span>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Поиск" 
              className="search-input"
            />
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