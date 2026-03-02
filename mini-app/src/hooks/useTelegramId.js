import { useState, useEffect } from 'react';

export function useTelegramId() {
  const [telegramId, setTelegramId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('user_id');
    
    if (idFromUrl) {
      setTelegramId(idFromUrl);
      localStorage.setItem('telegramId', idFromUrl);
      setError(null);
    } else {
      const savedId = localStorage.getItem('telegramId');
      if (savedId) {
        setTelegramId(savedId);
      } else {
        setError('Пожалуйста, откройте приложение через бота Telegram!');
      }
    }
    setLoading(false);
  }, []);

  return { telegramId, loading, error };
}