import React from 'react';

function EmptyNotes() {
  return (
    <div className="empty-notes">
      <p>📭 У вас пока нет заметок</p>
      <p className="empty-notes-sub">Нажмите кнопку "+", чтобы создать первую заметку</p>
    </div>
  );
}

export default EmptyNotes;