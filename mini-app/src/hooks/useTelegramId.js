import { useState, useEffect } from 'react';

export function useTelegramId() {
  const [telegramId, setTelegramId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegram = () => {
      try {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
          const userId = parseInt(window.Telegram.WebApp.initDataUnsafe.user.id);
          if (!isNaN(userId)) {
            setTelegramId(userId);
            localStorage.setItem('telegramId', String(userId));
            setError(null);
            return true;
          }
        }
      } catch (e) {
        console.log('Telegram WebApp not available');
      }
      return false;
    };

    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('user_id') || params.get('tg_user_id');

    if (initTelegram()) {
      setLoading(false);
      return;
    }

    if (idFromUrl) {
      const parsedId = parseInt(idFromUrl);
      if (!isNaN(parsedId)) {
        setTelegramId(parsedId);
        localStorage.setItem('telegramId', String(parsedId));
        setError(null);
      } else {
        setError('Ошибка получения ID пользователя');
      }
    } else {
      const savedId = localStorage.getItem('telegramId');
      if (savedId) {
        const parsedSavedId = parseInt(savedId);
        if (!isNaN(parsedSavedId)) {
          setTelegramId(parsedSavedId);
          setError(null);
        } else {
          setError('Пожалуйста, откройте приложение через бота Telegram!');
        }
      } else {
        setError('Пожалуйста, откройте приложение через бота Telegram!');
      }
    }
    setLoading(false);
  }, []);

  return { telegramId, loading, error };
}
