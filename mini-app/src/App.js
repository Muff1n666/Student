import React, { useState, useEffect } from 'react';
import './index.css';

//Хуки
import { useTelegramId } from './hooks/useTelegramId';

// Компоненты интерфейса
import Sidebar from './components/layout/Sidebar';
import MobileMenu from './components/layout/MobileMenu';
import NotesPage from './components/pages/NotesPage';
import PlaceholderPage from './components/pages/PlaceholderPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorMessage from './components/common/ErrorMessage';

//Работа с API
import api from './services/api';

function App() {
  const [activeTool, setActiveTool] = useState('заметки');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userName, setUserName] = useState('');
  
  const { telegramId, loading: idLoading, error: idError } = useTelegramId();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (telegramId) {
      loadUserInfo();
    }
  }, [telegramId]);

  const loadUserInfo = async () => {
    const user = await api.checkUser(telegramId);
    if (user) {
      setUserName(user.first_name);
    }
  };

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  if (idLoading) {
    return <LoadingSpinner />;
  }

  if (idError) {
    return (
      <ErrorMessage 
        message={idError} 
        telegramId={telegramId}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const renderPage = () => {
    switch (activeTool) {
      case 'калькулятор':
        return <PlaceholderPage icon="🧮" title="Калькулятор" />;
      case 'оценок':
        return <PlaceholderPage icon="📊" title="Таблица оценок" />;
      case 'расписание':
        return <PlaceholderPage icon="📅" title="Расписание" />;
      case 'заметки':
      default:
        return (
          <NotesPage 
            telegramId={telegramId} 
            userName={userName}
          />
        );
    }
  };

  return (
    <div className="app">
      {/* Мобильное меню */}
      {isMobile && (
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      )}

      {/* Боковое меню */}
      <Sidebar 
        activeTool={activeTool}
        onToolSelect={handleToolSelect}
        isMobile={isMobile}
        isOpen={isMobileMenuOpen}
      />
      
      {/* Основной контент */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;