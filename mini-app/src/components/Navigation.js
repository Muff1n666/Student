import React from 'react';

function Navigation({ isOpen, onClose, onSectionSelect, activeSection }) {
  const tools = [
    { id: 'notes', label: 'Мои заметки', icon: '📝' },
    { id: 'calculator', label: 'Калькулятор среднего балла', icon: '🧮' },
    { id: 'stats', label: 'Статистика успеваемости', icon: '📊' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <>
      <div className={`nav-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      
      <nav className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>📚 Студентик</h2>
          <button className="nav-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="nav-list">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`nav-item ${activeSection === tool.id ? 'active' : ''}`}
              onClick={() => onSectionSelect(tool.id)}
            >
              <span className="nav-icon">{tool.icon}</span>
              <span className="nav-label">{tool.label}</span>
            </button>
          ))}
        </div>
        
        <div className="nav-footer">
          <p>разработано студентами ИС1-15</p>
          <p>Лапшиным Д и Лебедевым И</p>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
