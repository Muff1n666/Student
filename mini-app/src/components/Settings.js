import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import api from '../services/api';

function Settings() {
  const { user, refreshUser } = useAuth();
  const [telegramId, setTelegramId] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleLinkTelegram = async () => {
    if (!telegramId.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      const tid = parseInt(telegramId.trim());
      if (isNaN(tid)) {
        setMessage('Введите корректный Telegram ID');
        return;
      }
      await api.linkTelegram(tid);
      await refreshUser();
      setMessage('Telegram привязан!');
      setTelegramId('');
    } catch (error) {
      setMessage(error.message || 'Ошибка привязки');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings-card">
        <h2>Настройки</h2>

        <div className="settings-section">
          <h3>🔗 Привязка Telegram</h3>
          <p className="settings-description">
            Привяжите Telegram, чтобы получать уведомления о заметках в боте.
            Ваш Telegram ID можно узнать у бота: @userinfobot
          </p>

          {user.telegram_linked ? (
            <div className="telegram-linked">
              <p>✅ Telegram привязан (ID: {user.telegram_id})</p>
            </div>
          ) : (
            <div className="telegram-link-form">
              <input
                type="text"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                placeholder="Введите Telegram ID"
                className="telegram-input"
              />
              <button
                className="save-btn"
                onClick={handleLinkTelegram}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Привязать'}
              </button>
            </div>
          )}

          {message && (
            <div className={`settings-message ${message.includes('Ошибка') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="settings-card">
        <h3>ℹ️ Аккаунт</h3>
        <p>Email: {user.email}</p>
        <p>Имя: {user.first_name || '—'}</p>
      </div>

      <div className="warning-banner">
        ⚠️ Внимание! Функция находится в разработке и может работать нестабильно.
      </div>
    </div>
  );
}

export default Settings;
