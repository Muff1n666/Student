import React from 'react';
import NoteCard from './NoteCard';
import EmptyNotes from './EmptyNotes';

function NotesList({ notes, onDeleteNote }) {
  if (notes.length === 0) {
    return <EmptyNotes />;
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}

export default NotesList;