const API_URL = 'https://intimal-hymnologic-sachiko.ngrok-free.dev/api';

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  async checkUser(telegramId) {
    try {
      console.log('🔵 Проверка пользователя:', telegramId);
      const response = await fetch(`${this.baseUrl}/debug/users`);
      const users = await response.json();
      console.log('Пользователи в БД:', users);
      
      const currentUser = users.find(u => u.telegram_id === parseInt(telegramId));
      console.log('Текущий пользователь:', currentUser);
      return currentUser;
    } catch (error) {
      console.error('❌ Ошибка проверки пользователя:', error);
      return null;
    }
  }

  async getNotes(telegramId) {
    try {
      console.log('🔵 Загрузка заметок для ID:', telegramId);
      const response = await fetch(`${this.baseUrl}/notes/?telegram_id=${telegramId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Заметки загружены:', data);
        return data;
      } else {
        const error = await response.text();
        console.error('❌ Ошибка загрузки:', response.status, error);
        return [];
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки заметок:', error);
      throw error;
    }
  }

  async createNote(telegramId, noteData) {
    try {
      console.log('🔵 Создание заметки:', { telegramId, ...noteData });
      
      const response = await fetch(`${this.baseUrl}/notes/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          title: noteData.title,
          type: noteData.type,
          content: noteData.content,
          note_date: noteData.date,  
          telegram_id: parseInt(telegramId)
        })
      });
      
      console.log('Ответ от сервера:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Заметка создана:', data);
        return data;
      } else {
        const error = await response.json();
        console.error('❌ Ошибка создания:', error);
        throw new Error(error.detail || 'Ошибка создания заметки');
      }
    } catch (error) {
      console.error('❌ Ошибка создания заметки:', error);
      throw error;
    }
  }

  async deleteNote(telegramId, noteId) {
    try {
      console.log(`🔵 Удаление заметки ${noteId} для пользователя ${telegramId}`);
      
      const response = await fetch(`${this.baseUrl}/notes/${noteId}?telegram_id=${telegramId}`, {
        method: 'DELETE'
      });
      
      console.log('Ответ от сервера:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Ошибка удаления:', error);
        throw new Error('Ошибка удаления заметки');
      }
      
      console.log('✅ Заметка удалена');
      return true;
    } catch (error) {
      console.error('❌ Ошибка удаления заметки:', error);
      throw error;
    }
  }
}

const api = new ApiService();
export default api;