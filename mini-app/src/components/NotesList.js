import React, { useState } from 'react';

function NotesList({ notes, onDeleteNote, onAddNote }) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (noteData) => {
    try {
      await onAddNote(noteData);
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short',
      weekday: 'short'
    });
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'homework': return 'Домашнее задание';
      case 'test': return 'Контрольная';
      case 'practice': return 'Практика';
      default: return type;
    }
  };

  return (
    <>
      <div className="notes-container">
        {notes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <h3>Пока нет заметок</h3>
            <p>Нажмите + чтобы добавить первую</p>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <div 
                key={note.id} 
                className={`note-card note-${note.type}`}
              >
                <div className="note-header">
                  <div>
                    <span className="note-type">{getTypeLabel(note.type)}</span>
                    <h3 className="note-title">{note.title}</h3>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => onDeleteNote(note.id)}
                    aria-label="Удалить"
                  >
                    🗑️
                  </button>
                </div>
                
                <p className="note-content">{note.content}</p>
                
                <div className="note-footer">
                  <span className="note-date">
                    📅 {formatDate(note.note_date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        className="fab"
        onClick={() => setShowModal(true)}
        aria-label="Добавить заметку"
      >
        +
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Новая заметка</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSubmit({
                title: formData.get('title'),
                content: formData.get('content'),
                type: formData.get('type'),
                date: formData.get('date')
              });
            }}>
              <div className="form-group">
                <label>Заголовок</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Например: Математика ДЗ"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Описание</label>
                <textarea 
                  name="content" 
                  placeholder="Что нужно сделать..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Тип</label>
                <div className="type-select">
                  <label className="type-option">
                    <input type="radio" name="type" value="homework" defaultChecked />
                    <span>📚 Домашнее задание</span>
                  </label>
                  <label className="type-option">
                    <input type="radio" name="type" value="test" />
                    <span>📝 Контрольная</span>
                  </label>
                  <label className="type-option type-practice">
                    <input type="radio" name="type" value="practice" />
                    <span>🔧 Практика</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Дата</label>
                <input 
                  type="date" 
                  name="date" 
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NotesList;
