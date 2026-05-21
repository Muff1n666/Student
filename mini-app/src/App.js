import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import NotesList from './components/NotesList';
import Calculator from './components/Calculator';
import Settings from './components/Settings';
import LoginPage from './components/pages/LoginPage';
import { AuthProvider, useAuth } from './AuthContext';
import api from './services/api';
import './index.css';

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.getNotes()
      .then(data => setNotes(data))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddNote = async (noteData) => {
    await api.createNote(noteData);
    const data = await api.getNotes();
    setNotes(data);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Удалить эту заметку?')) return;
    await api.deleteNote(noteId);
    const data = await api.getNotes();
    setNotes(data);
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
        return <Settings />;
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

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <Header
        userName={user.first_name}
        onMenuToggle={toggleMenu}
        isMenuOpen={isMenuOpen}
        onLogout={logout}
      />

      <Navigation
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onSectionSelect={handleSectionSelect}
        activeSection={activeSection}
      />

      <main className="main">
        <div className="debug-info">
          <div>Email: <strong>{user.email}</strong></div>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
