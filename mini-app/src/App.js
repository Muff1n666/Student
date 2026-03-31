import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NotesList from './components/NotesList';
import { useTelegramId } from './hooks/useTelegramId';
import api from './services/api';
import './index.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('notes');
  const [userName, setUserName] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { telegramId, loading: idLoading, error: idError } = useTelegramId();

  useEffect(() => {
    if (!telegramId) return;
    
    const loadUserInfo = async () => {
      const user = await api.checkUser(telegramId);
      if (user) {
        setUserName(user.first_name);
      }
    };

    const loadNotes = async () => {
      setLoading(true);
      try {
        const data = await api.getNotes(telegramId);
        setNotes(data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
    loadNotes();
  }, [telegramId]);

  const handleAddNote = async (noteData) => {
    const newNote = await api.createNote(telegramId, noteData);
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Удалить эту заметку?')) return;
    try {
      await api.deleteNote(telegramId, noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    closeMenu();
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'calculator':
        return <Placeholder title="Калькулятор среднего балла" icon="🧮" />;
      case 'stats':
        return <Placeholder title="Статистика успеваемости" icon="📊" />;
      case 'settings':
        return <Placeholder title="Настройки" icon="⚙️" />;
      default:
        return (
          <NotesList 
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        );
    }
  };

  function Placeholder({ title, icon }) {
    return (
      <div className="placeholder">
        <span className="placeholder-icon">{icon}</span>
        <h2>{title}</h2>
        <p>Скоро здесь появится контент...</p>
      </div>
    );
  }

  if (idLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (idError) {
    return (
      <div className="error-screen">
        <span className="error-icon">⚠️</span>
        <h2>Ошибка</h2>
        <p>{idError}</p>
        <button onClick={() => window.location.reload()}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        userName={userName} 
        onMenuToggle={toggleMenu}
        isMenuOpen={isMenuOpen}
      />
      
      <Navigation 
        isOpen={isMenuOpen} 
        onClose={closeMenu}
        onSectionSelect={handleSectionSelect}
        activeSection={activeSection}
      />
      
      <main className="main">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}

export default App;
