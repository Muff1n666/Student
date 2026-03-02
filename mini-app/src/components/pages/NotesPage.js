import React, { useState, useEffect } from 'react';
import NotesList from '../notes/NotesList';
import NoteForm from '../notes/NoteForm';
import Modal from '../common/Modal';
import api from '../../services/api';

function NotesPage({ telegramId, userName }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [telegramId]);

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

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await api.createNote(telegramId, noteData);
      setNotes([...notes, newNote]);
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
      return;
    }
    
    try {
      await api.deleteNote(telegramId, noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      alert('Ошибка при удалении заметки');
    }
  };

  if (loading) {
    return <div className="loading-container">Загрузка...</div>;
  }

  return (
    <>
      {userName && (
        <div className="welcome-message">
          👋 Привет, {userName}!
        </div>
      )}
      
      <NotesList notes={notes} onDeleteNote={handleDeleteNote} />
      
      <button className="fab-button" onClick={() => setShowModal(true)}>+</button>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <NoteForm 
          onSubmit={handleCreateNote}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
}

export default NotesPage;