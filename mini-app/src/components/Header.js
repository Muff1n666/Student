import React from 'react';

function Header({ userName, onMenuToggle, isMenuOpen, onLogout }) {
  return (
    <header className="header">
      <button
        className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
        onClick={onMenuToggle}
        aria-label="Меню"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="header-title">
        <h1>Студентик</h1>
      </div>

      {userName && (
        <span className="user-greeting">Привет, {userName}!</span>
      )}

      <button className="logout-btn" onClick={onLogout} title="Выйти">
        🚪
      </button>
    </header>
  );
}

export default Header;
