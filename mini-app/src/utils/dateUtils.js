export function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}

export function getNoteClass(type) {
  return type === 'homework' ? 'note-homework' : 'note-test';
}

export function getNoteEmoji(type) {
  return type === 'homework' ? '📚' : '✍️';
}

export function getNoteTypeText(type) {
  return type === 'homework' ? 'ДЗ' : 'Тест';
}