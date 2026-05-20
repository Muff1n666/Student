import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NotesList from './components/NotesList';
import Calculator from './components/Calculator';
import Settings from './components/Settings';
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

  console.log('[App] telegramId:', telegramId, 'type:', typeof telegramId);
  console.log('[App] idLoading:', idLoading, 'idError:', idError);

  useEffect(() => {
    if (!telegramId) {
      console.log('[App] telegramId не определен, ждем...');
      return;
    }

    console.log('[App] Загрузка данных для пользователя:', telegramId);
    
    const loadUserInfo = async () => {
      try {
        console.log('[App] Загрузка информации о пользователе...');
        const user = await api.checkUser(telegramId);
        console.log('[App] Пользователь:', user);
        if (user) {
          setUserName(user.first_name);
        }
      } catch (error) {
        console.error('[App] Ошибка загрузки пользователя:', error);
      }
    };

    const loadNotes = async () => {
      setLoading(true);
      try {
        console.log('[App] Загрузка заметок...');
        const data = await api.getNotes(telegramId);
        console.log('[App] Загружено заметок:', data.length);
        setNotes(data);
      } catch (error) {
        console.error('[App] Ошибка загрузки заметок:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
    loadNotes();
  }, [telegramId]);

  const loadNotesFresh = async () => {
    setLoading(true);
    try {
      const data = await api.getNotes(telegramId);
      setNotes(data);
      console.log('[App] Список заметок обновлен:', data.length);
    } catch (error) {
      console.error('[App] Ошибка обновления списка:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      console.log('[App] Создание заметки:', noteData);
      await api.createNote(telegramId, noteData);
      console.log('[App] Заметка создана, обновляем список...');
      await loadNotesFresh();
    } catch (error) {
      console.error('[App] Ошибка создания заметки:', error);
      alert(error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Удалить эту заметку?')) return;
    try {
      console.log('[App] Удаление заметки:', noteId);
      await api.deleteNote(telegramId, noteId);
      await loadNotesFresh();
    } catch (error) {
      console.error('[App] Ошибка удаления:', error);
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
        return <Calculator />;
      case 'stats':
        return <Placeholder title="Статистика успеваемости" icon="📊" />;
      case 'settings':
        return <Settings telegramId={telegramId} />;
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
        <div className="debug-info">
          <div>User ID: <strong>{telegramId || "Не определен"}</strong></div>
          <div>Заметок: {notes.length}</div>
          <div>Загрузка: {loading ? "Да" : "Нет"}</div>
        </div>
        
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
