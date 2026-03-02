import React from 'react';

function Sidebar({ activeTool, onToolSelect, isMobile, isOpen }) {
  const tools = [
    { id: 'заметки', label: 'Заметки', icon: '📋' },
    { id: 'калькулятор', label: 'Калькулятор', icon: '🧮' },
    { id: 'оценок', label: 'Таблица оценок', icon: '📊' },
    { id: 'расписание', label: 'Расписание', icon: '📅' }
  ];

  return (
    <aside className={`sidebar ${isMobile && !isOpen ? 'hidden' : ''}`}>
      <div className="sidebar-header">
        <h2>Учебный органайзер</h2>
      </div>
      <nav className="sidebar-nav">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`nav-item ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolSelect(tool.id)}
          >
            {tool.icon} {tool.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;