import React from 'react';
import { formatDate, getNoteClass, getNoteEmoji, getNoteTypeText } from '../../utils/dateUtils';

function NoteCard({ note, onDelete }) {
  return (
    <div className={`note-card ${getNoteClass(note.type)}`}>
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <span className="note-type-badge">
            {getNoteEmoji(note.type)} {getNoteTypeText(note.type)}
          </span>
          <button 
            className="delete-note-btn"
            onClick={() => onDelete(note.id)}
            title="Удалить заметку"
          >
            🗑️
          </button>
        </div>
      </div>
      <p className="note-content">{note.content}</p>
      <div className="note-footer">
        <span className="note-date">
          📅 {formatDate(note.note_date)}
        </span>
      </div>
    </div>
  );
}

export default NoteCard;