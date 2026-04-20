import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Settings({ telegramId }) {
  const [reminderTime, setReminderTime] = useState('23:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, [telegramId]);

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings(telegramId);
      setReminderTime(settings.reminder_time);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.updateSettings(telegramId, reminderTime);
      setMessage('Настройки сохранены!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleTimeChange = (delta) => {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    let newHours = hours + delta;
    if (newHours < 0) newHours = 23;
    if (newHours > 23) newHours = 0;
    const newTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    setReminderTime(newTime);
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings-card">
        <h2>Настройки</h2>
        
        <div className="settings-section">
          <h3>⏰ Время уведомлений</h3>
          <p className="settings-description">
            Выберите время, когда бот будет отправлять напоминания о завтрашних заметках
          </p>

          <div className="time-picker">
            <button 
              className="time-btn"
              onClick={() => handleTimeChange(-1)}
            >
              −
            </button>
            
            <div className="time-display">
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="time-input"
              />
            </div>
            
            <button 
              className="time-btn"
              onClick={() => handleTimeChange(1)}
            >
              +
            </button>
          </div>

          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>

          {message && (
            <div className={`settings-message ${message.includes('Ошибка') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="warning-banner">
        ⚠️ Внимание! Функция находится в разработке и может работать нестабильно.
      </div>

      <div className="settings-card info-card">
        <h3>ℹ️ Как это работает</h3>
        <ul>
          <li>Бот отправляет напоминание в выбранное время</li>
          <li>Напоминание приходит накануне каждой заметки</li>
          <li>Время сохраняется автоматически</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;