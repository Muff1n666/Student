import React from 'react';

function MobileMenu({ isOpen, onToggle }) {
  return (
    <>
      <button 
        className={`mobile-menu-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
      >
        ☰
      </button>
      
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle} />
      )}
    </>
  );
}

export default MobileMenu;