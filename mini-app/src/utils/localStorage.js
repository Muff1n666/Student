const GUEST_NOTES_KEY = 'guest_notes';
let nextId = Date.now();

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_NOTES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes));
}

export function guestGetNotes() {
  return Promise.resolve(loadNotes());
}

export function guestCreateNote(noteData) {
  const notes = loadNotes();
  const note = {
    id: ++nextId,
    title: noteData.title,
    type: noteData.type,
    content: noteData.content,
    note_date: noteData.date || noteData.note_date,
    notified: false,
    created_at: new Date().toISOString(),
  };
  notes.unshift(note);
  saveNotes(notes);
  return Promise.resolve(note);
}

export function guestDeleteNote(noteId) {
  const notes = loadNotes().filter(n => n.id !== noteId);
  saveNotes(notes);
  return Promise.resolve({ message: 'Note deleted' });
}
