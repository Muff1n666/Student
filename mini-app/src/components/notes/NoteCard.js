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
            aria-label="Удалить заметку"
          >
            <svg
              className="delete-note-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M9.5 3.5h5a1.75 1.75 0 0 1 1.73 1.43l.21 1.07H18a1 1 0 1 1 0 2h-.4l-.7 9.18A2.75 2.75 0 0 1 14.17 21H9.83a2.75 2.75 0 0 1-2.73-2.82L6.4 8H6a1 1 0 1 1 0-2h1.56l.21-1.07A1.75 1.75 0 0 1 9.5 3.5zm0 2a.25.25 0 0 0-.24.2L9.1 7h5.8l-.16-1.3a.25.25 0 0 0-.24-.2h-5zm-.86 4.5a.75.75 0 0 1 .8.7l.3 6a.75.75 0 0 1-1.5.08l-.3-6a.75.75 0 0 1 .7-.78zm3.36.7v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 1.5 0zm2.56-.7a.75.75 0 0 1 .7.78l-.3 6a.75.75 0 0 1-1.5-.08l.3-6a.75.75 0 0 1 .8-.7z"
              />
            </svg>
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