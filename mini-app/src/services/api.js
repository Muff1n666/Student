const API_URL = 'https://intimal-hymnologic-sachiko.ngrok-free.dev/api';

class ApiService {
  constructor() {
    this.baseUrl = API_URL;
  }

  async checkUser(telegramId) {
    try {
      console.log('🔵 [API] Проверка пользователя:', telegramId, typeof telegramId);
      const response = await fetch(`${this.baseUrl}/debug/users`);
      const users = await response.json();
      console.log('🔵 [API] Пользователи в БД:', users);
      
      const currentUser = users.find(u => Number(u.telegram_id) === Number(telegramId));
      console.log('🔵 [API] Текущий пользователь:', currentUser);
      return currentUser;
    } catch (error) {
      console.error('❌ [API] Ошибка проверки пользователя:', error);
      return null;
    }
  }

  async getNotes(telegramId) {
    try {
      console.log('🔵 [API] Загрузка заметок для ID:', telegramId, typeof telegramId);
      const url = `${this.baseUrl}/notes/?telegram_id=${telegramId}`;
      console.log('🔵 [API] URL запроса:', url);
      
      const response = await fetch(url);
      console.log('🔵 [API] Статус ответа:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [API] Заметки загружены:', data.length, 'шт.');
        return data;
      } else {
        const error = await response.text();
        console.error('❌ [API] Ошибка загрузки:', response.status, error);
        return [];
      }
    } catch (error) {
      console.error('❌ [API] Ошибка загрузки заметок:', error);
      throw error;
    }
  }

  async createNote(telegramId, noteData) {
    try {
      console.log('🔵 [API] Создание заметки:', { telegramId, noteData });
      
      const requestBody = {
        title: noteData.title,
        type: noteData.type,
        content: noteData.content,
        note_date: noteData.date,  
        telegram_id: Number(telegramId)
      };
      
      console.log('🔵 [API] Тело запроса:', JSON.stringify(requestBody));
      
      const response = await fetch(`${this.baseUrl}/notes/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('🔵 [API] Статус ответа создания:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [API] Заметка создана:', data);
        return data;
      } else {
        const error = await response.json();
        console.error('❌ [API] Ошибка создания:', error);
        throw new Error(error.detail || 'Ошибка создания заметки');
      }
    } catch (error) {
      console.error('❌ [API] Ошибка создания заметки:', error);
      throw error;
    }
  }

  async deleteNote(telegramId, noteId) {
    try {
      console.log(`🔵 [API] Удаление заметки ${noteId} для пользователя ${telegramId}`);
      
      const response = await fetch(`${this.baseUrl}/notes/${noteId}?telegram_id=${telegramId}`, {
        method: 'DELETE'
      });
      
      console.log('🔵 [API] Статус ответа удаления:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ [API] Ошибка удаления:', error);
        throw new Error('Ошибка удаления заметки');
      }
      
      console.log('✅ [API] Заметка удалена');
      return true;
    } catch (error) {
      console.error('❌ [API] Ошибка удаления заметки:', error);
      throw error;
    }
  }

  async getSettings(telegramId) {
    try {
      console.log('🔵 [API] Загрузка настроек для ID:', telegramId);
      const response = await fetch(`${this.baseUrl}/settings/?telegram_id=${telegramId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [API] Настройки загружены:', data);
        return data;
      }
      throw new Error('Ошибка загрузки настроек');
    } catch (error) {
      console.error('❌ [API] Ошибка загрузки настроек:', error);
      throw error;
    }
  }

  async updateSettings(telegramId, reminderTime) {
    try {
      console.log('🔵 [API] Обновление настроек:', { telegramId, reminderTime });
      const response = await fetch(`${this.baseUrl}/settings/?telegram_id=${telegramId}&reminder_time=${reminderTime}`, {
        method: 'PUT'
      });
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [API] Настройки обновлены:', data);
        return data;
      }
      throw new Error('Ошибка сохранения настроек');
    } catch (error) {
      console.error('❌ [API] Ошибка сохранения настроек:', error);
      throw error;
    }
  }
}

const api = new ApiService();
export default api;
